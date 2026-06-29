'use client';

import {useState, useEffect, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import type {Quiz} from '@/lib/types';
import {useUser} from '@/hooks/useUser';
import {generateFeedback} from '@/ai/flows/generate-feedback';
import {Loader2, ArrowRight, RotateCcw, Sparkles, Check, Lightbulb} from 'lucide-react';
import { IconQuatrefoil, IconStarburst, IconDisc, IconArch, IconSparkle } from '@/components/ui/sparkz-icons';
import {cn} from '@/lib/utils';
import {answersMatch} from '@/lib/answer-match';

type Step = 'theory' | 'flashcards' | 'quiz';

const PHASE_LABEL: Record<Step, string> = {
  theory: 'Teoría',
  flashcards: 'Repaso',
  quiz: 'Quiz',
};

// Friendly labels for the AI-classified error type (kid-facing, anti-anxiety framing).
const ERROR_LABELS: Record<string, string> = {
  procedural: 'Error de procedimiento',
  conceptual: 'Repasemos el concepto',
  careless: 'Casi: un descuido',
};

// Dark forest ink used on mint / gold concept surfaces (matches V3.0 mockup).
const ON_MINT = '#08291F';
const ON_GOLD = '#2A1D06';

// Per-rule color so the theory cards aren't a monochrome wall.
const THEORY_PALETTE: { accent: string; on: string }[] = [
  { accent: '#6E6BF0', on: '#FFFFFF' }, // violet
  { accent: '#1FE0A6', on: '#08291F' }, // mint
  { accent: '#F2674C', on: '#FFFFFF' }, // coral
  { accent: '#38BDF8', on: '#06283D' }, // sky
  { accent: '#EC4899', on: '#FFFFFF' }, // pink
];
const THEORY_GLYPHS = [IconQuatrefoil, IconStarburst, IconDisc, IconArch, IconSparkle];

function PhaseDot({active, cls}: {active: boolean; cls: string}) {
  return <span className={cn('h-2 rounded-full transition-all duration-300', cls, active ? 'w-7' : 'w-2 opacity-30')} />;
}

export default function QuizClient({quiz}: {quiz: Quiz}) {
  const router = useRouter();
  const {addScore} = useUser();

  // A module may ship without theory and/or flashcards. Skip empty phases so the
  // learner never lands on a blank screen with no way forward.
  const hasTheory = !!(quiz.theory && quiz.theory.rules && quiz.theory.rules.length > 0);
  const hasFlashcards = !!(quiz.flashcards && quiz.flashcards.length > 0);
  const firstStep: Step = hasTheory ? 'theory' : hasFlashcards ? 'flashcards' : 'quiz';

  const [currentStep, setCurrentStep] = useState<Step>(firstStep);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackMeta, setFeedbackMeta] = useState<{ errorType?: string; hint?: string } | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  // Flashcard State
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Shuffle helper (Fisher-Yates)
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Randomize questions on every mount (not memoized, so each visit is fresh)
  const [sessionQuestions] = useState(() => {
    const active = (quiz.questions || []).filter(q => q.active !== false);
    return shuffle(active).slice(0, quiz.sessionLength || 5);
  });

  // Randomize flashcards on every mount
  const [sessionFlashcards] = useState(() => shuffle(quiz.flashcards || []));

  const currentQuestion = useMemo(() => sessionQuestions[currentQuestionIndex], [sessionQuestions, currentQuestionIndex]);

  useEffect(() => {
    document.body.classList.add('lesson-mode');
    return () => document.body.classList.remove('lesson-mode');
  }, []);

  const isCorrect = () => {
    if (!currentQuestion) return false;
    switch (currentQuestion.type) {
      case 'multiple_choice':
      case 'true_false':
      case 'odd_one_out':
        return selectedAnswer ? answersMatch(selectedAnswer, currentQuestion.correctAnswer) : false;
      case 'fill_in_the_blank':
      case 'short_answer':
      case 'dictation':
        return answersMatch(typedAnswer.trim(), currentQuestion.correctAnswer);
      default:
        return false;
    }
  };

  const canSubmit = () => {
    if (!currentQuestion) return false;
    switch (currentQuestion.type) {
      case 'multiple_choice':
      case 'true_false':
      case 'odd_one_out':
        return !!selectedAnswer;
      case 'fill_in_the_blank':
      case 'short_answer':
      case 'dictation':
        return typedAnswer.trim() !== '';
      default:
        return false;
    }
  };

  const isTyped = (q = currentQuestion) =>
    q && (q.type === 'fill_in_the_blank' || q.type === 'short_answer' || q.type === 'dictation');

  const handleAnswerSubmit = async () => {
    if (!canSubmit()) return;

    setIsAnswered(true);
    const wasCorrect = isCorrect();
    if (wasCorrect) setScore(prev => prev + 1);

    setIsFeedbackLoading(true);
    try {
      const userAnswer = isTyped() ? typedAnswer : selectedAnswer!;
      const result = await generateFeedback({
        question: currentQuestion.question,
        answer: userAnswer,
        isCorrect: wasCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        mode: quiz.mode,
      });
      setFeedback(result.feedback);
      setFeedbackMeta({ errorType: result.errorType, hint: result.hint });
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback(wasCorrect ? '¡Correcto! Muy bien hecho.' : `La respuesta correcta es ${currentQuestion.correctAnswer}.`);
      setFeedbackMeta(null);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setIsAnswered(false);
      setFeedback(null);
      setFeedbackMeta(null);
    } else {
      addScore({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        totalQuestions: sessionQuestions.length,
        date: Date.now(),
      });
      router.push(`/quiz/${quiz.id}/results?score=${score}&total=${sessionQuestions.length}`);
    }
  };

  // ── Theory ─────────────────────────────────────────────────────────
  const renderTheoryView = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {quiz.theory?.intro && (
        <div className="rounded-card p-7 md:p-8 bg-gold" style={{ color: ON_GOLD }}>
          <span className="font-ui font-bold uppercase text-xs tracking-[0.15em] flex items-center gap-1.5" style={{ color: `${ON_GOLD}B3` }}>
            <Lightbulb className="w-4 h-4" /> Concepto clave
          </span>
          <p className="font-body font-semibold text-xl md:text-2xl leading-relaxed mt-3">{quiz.theory.intro}</p>
        </div>
      )}

      <div className="space-y-5">
        {quiz.theory?.rules.map((rule, i) => {
          const pal = THEORY_PALETTE[i % THEORY_PALETTE.length];
          const Glyph = THEORY_GLYPHS[i % THEORY_GLYPHS.length];
          return (
            <div
              key={i}
              className="sparkz-card relative overflow-hidden p-6 md:p-8"
              style={{
                background: `color-mix(in srgb, ${pal.accent} 10%, var(--surface))`,
                borderColor: `color-mix(in srgb, ${pal.accent} 30%, var(--line))`,
              }}
            >
              <Glyph className="absolute -right-6 -top-6 w-36 h-36 pointer-events-none" color={pal.accent} style={{ opacity: 0.12 }} />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-12 h-12 rounded-xl grid place-items-center font-display text-2xl shrink-0"
                        style={{ background: pal.accent, color: pal.on }}>{i + 1}</span>
                  <h3 className="font-display text-2xl md:text-3xl text-ink leading-[0.95]">{rule.title}</h3>
                </div>
                <p className="font-body text-lg leading-relaxed text-ink/85">{rule.text}</p>
                {rule.example && (
                  <div className="mt-5 rounded-xl p-5" style={{ background: pal.accent, color: pal.on }}>
                    <span className="font-ui font-bold uppercase text-[11px] tracking-[0.15em]" style={{ color: pal.on, opacity: 0.7 }}>Ejemplo</span>
                    <p className="font-body font-bold text-lg mt-1.5 leading-snug">{rule.example}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setCurrentStep(hasFlashcards ? 'flashcards' : 'quiz')}
        className="btn-sparkz-primary w-full justify-center text-lg mt-2"
      >
        {hasFlashcards ? 'Repasar' : 'Empezar el quiz'} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // ── Flashcards ─────────────────────────────────────────────────────
  const renderFlashcardsView = () => {
    const card = sessionFlashcards[currentFlashcardIndex];
    if (!card) return null;
    const isLast = currentFlashcardIndex >= sessionFlashcards.length - 1;

    return (
      <div className="flex flex-col items-center gap-7 animate-in fade-in duration-500">
        <div className="flex gap-1.5 justify-center">
          {sessionFlashcards.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === currentFlashcardIndex ? 'w-7 bg-mint' : i < currentFlashcardIndex ? 'w-2 bg-gold' : 'w-2 bg-[color:var(--line)]',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped(f => !f)}
          className={cn(
            'relative w-full min-h-[320px] rounded-card flex flex-col p-6 text-left overflow-hidden cursor-pointer',
            'transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0',
            !isFlipped && 'border border-[color:var(--line)]',
          )}
          style={{
            background: isFlipped ? 'var(--mint)' : 'var(--surface)',
            boxShadow: isFlipped ? '0 0 32px rgba(31,224,166,0.28)' : 'var(--shadow-card-lg)',
          }}
        >
          <span
            className="w-fit font-ui font-bold uppercase text-[11px] tracking-[0.18em] rounded-pill px-3 py-1.5"
            style={
              isFlipped
                ? { background: `${ON_MINT}1A`, color: ON_MINT }
                : { background: 'var(--base)', color: 'var(--brand)' }
            }
          >
            {isFlipped ? 'Respuesta' : 'Pregunta'}
          </span>

          <div
            key={isFlipped ? 'back' : 'front'}
            className="flex-grow flex items-center justify-center py-6 animate-in fade-in zoom-in-95 duration-300"
          >
            <p
              className="font-display text-3xl md:text-[2.25rem] text-center leading-[1.1]"
              style={{ color: isFlipped ? ON_MINT : 'var(--ink)' }}
            >
              {isFlipped ? card.back : card.front}
            </p>
          </div>

          <span
            className="self-center flex items-center gap-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.18em] opacity-55"
            style={{ color: isFlipped ? ON_MINT : 'var(--muted-foreground)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> {isFlipped ? 'Tocá para volver' : 'Tocá para revelar'}
          </span>
        </button>

        <div className="w-full">
          {!isLast ? (
            <button
              onClick={() => { setIsFlipped(false); setCurrentFlashcardIndex(i => i + 1); }}
              className="btn-sparkz-action w-full justify-center text-lg"
            >
              Siguiente tarjeta <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setCurrentStep('quiz')} className="btn-sparkz-reward w-full justify-center text-lg">
              ¡Listo para el quiz! <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Quiz ───────────────────────────────────────────────────────────
  const renderQuizView = () => {
    if (!currentQuestion) return null;
    const progress = (currentQuestionIndex / sessionQuestions.length) * 100;
    const choice = currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false' || currentQuestion.type === 'odd_one_out';

    return (
      <div className="animate-in fade-in duration-500">
        {/* Sticky progress */}
        <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-base/95 backdrop-blur border-b border-[color:var(--line)] flex items-center gap-4">
          <div className="flex-grow h-2 rounded-full bg-[color:var(--line)] overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-display text-lg text-ink leading-none whitespace-nowrap">
            {currentQuestionIndex + 1}
            <span className="text-sm text-[color:var(--muted-foreground)]"> / {sessionQuestions.length}</span>
          </span>
        </div>

        {/* Question */}
        <div className="sparkz-card p-6 mt-5">
          <span className="sparkz-label text-brand">Pregunta {currentQuestionIndex + 1}</span>
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-[1.1] mt-2">{currentQuestion.question}</h2>
        </div>

        {/* Answers */}
        <div className="mt-5 space-y-3">
          {choice && currentQuestion.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            let stateClass = '';
            if (isAnswered) {
              if (answersMatch(option, currentQuestion.correctAnswer)) stateClass = 'correct';
              else if (isSelected) stateClass = 'incorrect';
            } else if (isSelected) {
              stateClass = 'selected';
            }
            return (
              <button
                key={index}
                type="button"
                disabled={isAnswered}
                onClick={() => setSelectedAnswer(option)}
                className={cn('answer-card flex items-center gap-4', stateClass)}
              >
                <span
                  className={cn(
                    'w-9 h-9 rounded-lg grid place-items-center font-display text-base shrink-0 border-2 transition-colors',
                    stateClass === 'correct'
                      ? 'border-mint text-mint'
                      : stateClass === 'incorrect'
                        ? 'border-[color:var(--muted-foreground)] text-[color:var(--muted-foreground)]'
                        : isSelected
                          ? 'border-brand text-brand'
                          : 'border-[color:var(--line)] text-[color:var(--muted-foreground)]',
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-body font-semibold text-lg text-ink">{option}</span>
              </button>
            );
          })}

          {isTyped() && (
            <input
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Escribí tu respuesta…"
              disabled={isAnswered}
              className={cn(
                'w-full rounded-card bg-surface text-ink border-2 border-[color:var(--line)] p-5 text-xl font-display outline-none transition-colors focus:border-brand placeholder:text-[color:var(--muted-foreground)] placeholder:font-body',
                isAnswered && isCorrect() && 'border-mint',
                isAnswered && !isCorrect() && 'border-[color:var(--muted-foreground)]',
              )}
            />
          )}
        </div>

        {/* Comprobar (inline) */}
        {!isAnswered && (
          <button
            onClick={handleAnswerSubmit}
            disabled={!canSubmit()}
            className={cn('btn-sparkz-action w-full justify-center text-lg mt-6', !canSubmit() && 'opacity-40 cursor-not-allowed')}
          >
            Comprobar
          </button>
        )}

        {/* Feedback sheet */}
        {isAnswered && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 sm:p-4 animate-in fade-in duration-200">
            <div
              className={cn(
                'w-full max-w-lg rounded-t-card sm:rounded-card p-6 animate-in slide-in-from-bottom-6 duration-300 border',
                isCorrect() ? 'bg-mint border-mint' : 'bg-surface border-[color:var(--line)]',
              )}
              style={isCorrect() ? { color: ON_MINT } : undefined}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn('w-10 h-10 rounded-full grid place-items-center shrink-0', isCorrect() ? '' : 'bg-[color:var(--line)]')}
                  style={isCorrect() ? { background: `${ON_MINT}1F` } : undefined}
                >
                  {isCorrect() ? <Check className="w-6 h-6" /> : <Sparkles className="w-5 h-5 text-brand" />}
                </span>
                <div className="flex-grow min-w-0">
                  <h3 className="font-display text-2xl leading-none">{isCorrect() ? '¡Correcto!' : 'Casi…'}</h3>

                  {!isCorrect() && feedbackMeta?.errorType && ERROR_LABELS[feedbackMeta.errorType] && (
                    <span className="inline-block mt-2 font-ui font-bold uppercase text-[10px] tracking-[0.12em] bg-base text-[color:var(--muted-foreground)] rounded-pill px-2.5 py-1">
                      {ERROR_LABELS[feedbackMeta.errorType]}
                    </span>
                  )}

                  {isFeedbackLoading ? (
                    <p className="font-body text-[15px] leading-snug mt-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analizando tu respuesta…
                    </p>
                  ) : (
                    <p className={cn('font-body text-[15px] leading-snug mt-2', isCorrect() ? '' : 'text-ink')}>{feedback}</p>
                  )}

                  {!isCorrect() && !isFeedbackLoading && feedbackMeta?.hint && (
                    <p className="font-body text-sm leading-snug mt-3 pt-3 border-t border-[color:var(--line)] flex items-start gap-2 text-[color:var(--muted-foreground)]">
                      <Lightbulb className="w-4 h-4 text-gold shrink-0 mt-0.5" /> {feedbackMeta.hint}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={isFeedbackLoading}
                className={cn('btn-sparkz-primary w-full justify-center mt-5 text-lg', isFeedbackLoading && 'opacity-50 cursor-not-allowed')}
              >
                {currentQuestionIndex < sessionQuestions.length - 1 ? 'Siguiente' : 'Finalizar'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pb-28 lg:max-w-3xl lg:mx-auto">
      <header className="mb-5">
        <span className="sparkz-label text-brand">{[quiz.topic, quiz.unit].filter(Boolean).join(' · ')}</span>
        <h1 className="font-display text-[32px] text-ink leading-[0.95] mt-1.5">{quiz.title}</h1>
        <div className="flex items-center gap-2 mt-4">
          {hasTheory && <PhaseDot active={currentStep === 'theory'} cls="bg-brand" />}
          {hasFlashcards && <PhaseDot active={currentStep === 'flashcards'} cls="bg-gold" />}
          <PhaseDot active={currentStep === 'quiz'} cls="bg-mint" />
          <span className="sparkz-label text-[color:var(--muted-foreground)] ml-1">{PHASE_LABEL[currentStep]}</span>
        </div>
      </header>

      {currentStep === 'theory' && renderTheoryView()}
      {currentStep === 'flashcards' && renderFlashcardsView()}
      {currentStep === 'quiz' && renderQuizView()}
    </div>
  );
}
