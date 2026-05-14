'use client';

import {useState, useEffect, useMemo, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {type Quiz, type Question as QuestionType, MatchItem, Flashcard, Rule} from '@/lib/types';
import {useUser} from '@/hooks/useUser';
import {generateFeedback} from '@/ai/flows/generate-feedback';
import {generateAudio} from '@/ai/flows/generate-audio';
import { addReport } from '@/lib/db';
import {Button} from '@/components/ui/button';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {Loader2, Flag, CheckCircle2, XCircle, GripVertical, Volume2, ArrowRight, RotateCcw, BookOpen, Layers, Zap} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {cn} from '@/lib/utils';
import Image from 'next/image';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GeometricField } from '@/components/ui/geometric-field';
import { IconArch, IconBolt, IconSparkle, IconQuatrefoil } from '@/components/ui/sparkz-icons';

// Helper to normalize string for comparison
function normalizeString(str: string | null | undefined): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, ""); 
}

// Draggable Item Component
function SortableMatchItem({ id, text }: { id: string; text: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
        ref={setNodeRef} 
        {...attributes} 
        {...listeners} 
        className="flex items-center gap-2 p-3 rounded-action border-2 border-obsidian bg-white touch-none cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-transform" 
        style={{ ...style, boxShadow: '2px 2px 0 #111827' }}
    >
        <GripVertical className="h-5 w-5 text-slate" />
        <span className="text-lg font-body font-bold text-obsidian">{text}</span>
    </div>
  );
}

type Step = 'theory' | 'flashcards' | 'quiz';

export default function QuizClient({quiz}: {quiz: Quiz}) {
  const router = useRouter();
  const {addScore} = useUser();
  const {toast} = useToast();
  
  const [currentStep, setCurrentStep] = useState<Step>('theory');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  const [sessionFlashcards] = useState(() => {
    return shuffle(quiz.flashcards || []);
  });

  const currentQuestion = useMemo(() => sessionQuestions[currentQuestionIndex], [sessionQuestions, currentQuestionIndex]);

  useEffect(() => {
    document.body.classList.add('lesson-mode');
    return () => document.body.classList.remove('lesson-mode');
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isCorrect = () => {
    if (!currentQuestion) return false;
    
    switch (currentQuestion.type) {
        case 'multiple_choice':
        case 'true_false':
        case 'odd_one_out':
            return selectedAnswer ? normalizeString(selectedAnswer) === normalizeString(currentQuestion.correctAnswer!) : false;
        case 'fill_in_the_blank':
        case 'short_answer':
        case 'dictation':
            return normalizeString(typedAnswer.trim()) === normalizeString(currentQuestion.correctAnswer!);
        default:
            return false;
    }
  }
  
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
  }

  const handleAnswerSubmit = async () => {
    if (!canSubmit()) return;

    setIsAnswered(true);
    const wasCorrect = isCorrect();
    if (wasCorrect) {
      setScore(prev => prev + 1);
    } 

    setIsFeedbackLoading(true);
    try {
      const userAnswer = (currentQuestion.type === 'fill_in_the_blank' || currentQuestion.type === 'short_answer' || currentQuestion.type === 'dictation') ? typedAnswer : selectedAnswer!;
      
      const result = await generateFeedback({
        question: currentQuestion.question,
        answer: userAnswer,
        isCorrect: wasCorrect,
        mode: quiz.mode
      });
      setFeedback(result.feedback);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback(wasCorrect ? "¡Correcto! ¡Muy bien hecho." : `La respuesta correcta es ${currentQuestion.correctAnswer}.`);
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
    } else {
      addScore({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: score,
        totalQuestions: sessionQuestions.length,
        date: Date.now(),
      });
      router.push(`/quiz/${quiz.id}/results?score=${score}&total=${sessionQuestions.length}`);
    }
  };

  const renderTheoryView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <GeometricField variant="dark" density="low" className="opacity-30" />
      
      <div className="sparkz-card p-8 bg-cream text-obsidian border-obsidian relative z-10">
          <h2 className="font-display font-bold text-3xl mb-4 text-cobalt flex items-center gap-3">
              <IconArch className="w-8 h-8" /> Concepto Maestro
          </h2>
          <p className="text-xl md:text-2xl font-body font-bold leading-tight">
              {quiz.theory?.intro}
          </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 relative z-10">
          {quiz.theory?.rules.map((rule, i) => (
              <div key={i} className="sparkz-card p-6 bg-white border-obsidian hover:-translate-y-1 transition-transform">
                  <span className="sparkz-label text-vermillion mb-2 block">REGLA #0{i+1}</span>
                  <h3 className="font-display font-bold text-xl mb-3 text-obsidian">{rule.title}</h3>
                  <p className="font-body text-slate mb-6 text-sm leading-relaxed">{rule.text}</p>
                  <div className="bg-electric/10 p-4 border-l-4 border-electric">
                      <span className="font-label text-[10px] text-forest font-bold block mb-2 uppercase tracking-widest">PRO TIP / CHEAT CODE</span>
                      <p className="font-body font-bold text-xs text-forest">{rule.example}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="flex justify-center pt-8 relative z-10">
          <Button onClick={() => setCurrentStep('flashcards')} className="btn-sparkz-primary text-xl px-12 py-8 h-auto group">
              ENTENDIDO. A REPASAR <IconBolt className="ml-2 group-hover:scale-110 transition-transform" />
          </Button>
      </div>
    </div>
  );

  const renderFlashcardsView = () => {
    const card = sessionFlashcards[currentFlashcardIndex];
    if (!card) return null;

    return (
      <div className="flex flex-col items-center gap-12 animate-in fade-in duration-500 relative z-10">
          <div className="text-center">
              <h2 className="font-display font-bold text-3xl mb-2 text-white flex items-center justify-center gap-3">
                  <IconSparkle className="w-8 h-8 text-electric" /> Repaso Activo
              </h2>
              <p className="text-stone font-body text-sm uppercase tracking-widest">Tarjeta {currentFlashcardIndex + 1} de {sessionFlashcards.length}</p>
          </div>

          <div 
              className="relative w-full max-w-md aspect-[4/3] cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
          >
              <div className={cn(
                  "relative w-full h-full transition-all duration-500 preserve-3d",
                  isFlipped && "rotate-y-180"
              )}>
                  <div className="absolute inset-0 backface-hidden sparkz-card bg-white flex flex-col items-center justify-center p-10 text-center border-obsidian" style={{ boxShadow: '6px 6px 0 var(--near-black)' }}>
                      <span className="sparkz-label text-slate mb-6">PREGUNTA</span>
                      <p className="font-display font-bold text-3xl text-obsidian tracking-tight">{card.front}</p>
                      <div className="absolute bottom-6 text-slate text-[10px] font-label font-bold uppercase tracking-[0.2em] opacity-40">TAP PARA REVELAR</div>
                  </div>

                  <div className="absolute inset-0 backface-hidden rotate-y-180 sparkz-card bg-electric flex flex-col items-center justify-center p-10 text-center border-obsidian" style={{ boxShadow: '6px 6px 0 var(--near-black)' }}>
                      <span className="sparkz-label text-forest mb-6">RESPUESTA MAESTRA</span>
                      <p className="font-display font-bold text-3xl text-forest tracking-tight">{card.back}</p>
                  </div>
              </div>
          </div>

          <div className="flex gap-4 w-full max-w-md">
              {currentFlashcardIndex < sessionFlashcards.length - 1 ? (
                  <Button 
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); setCurrentFlashcardIndex(i => i + 1) }} 
                    className="btn-sparkz-action flex-grow py-6 h-auto border-obsidian"
                  >
                      SIGUIENTE TARJETA
                  </Button>
              ) : (
                  <Button 
                    onClick={() => setCurrentStep('quiz')} 
                    className="btn-sparkz-reward flex-grow py-6 h-auto animate-amber-pulse bg-amber text-obsidian border-obsidian"
                  >
                      ¡LISTO PARA EL TEST! <IconBolt className="ml-2 fill-obsidian" />
                  </Button>
              )}
          </div>
      </div>
    );
  };

  const renderQuizView = () => {
    if (!currentQuestion) return null;
    const progress = ((currentQuestionIndex) / sessionQuestions.length) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
            <div className="bg-near-black border-b-2 border-electric sticky top-[74px] z-40 -mx-4 px-6 py-6 flex justify-between items-center text-white">
                <div className="flex flex-col gap-2 w-full max-w-xs">
                    <span className="sparkz-label text-[10px] text-electric">RETO FINAL EN CURSO</span>
                    <div className="sparkz-progress h-3 bg-forest">
                        <div className="sparkz-progress-fill bg-electric" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="text-right">
                    <span className="font-display font-bold text-2xl text-electric">{currentQuestionIndex + 1}</span>
                    <span className="font-display font-bold text-sm text-stone/40 ml-1">/ {sessionQuestions.length}</span>
                </div>
            </div>

            <div className="sparkz-card p-8 md:p-12 bg-cream text-obsidian border-obsidian relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <IconQuatrefoil className="w-24 h-24" />
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl leading-[1.1] tracking-tight relative z-10">
                    {currentQuestion.question}
                </h2>
            </div>

            <div className="mb-12">
                {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false' || currentQuestion.type === 'odd_one_out') && (
                    <RadioGroup
                        value={selectedAnswer ?? ''}
                        onValueChange={setSelectedAnswer}
                        disabled={isAnswered}
                        className="grid grid-cols-1 gap-5"
                    >
                        {currentQuestion.options?.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            let stateClass = "";
                            if (isAnswered) {
                                const correct = normalizeString(option) === normalizeString(currentQuestion.correctAnswer!);
                                if (correct) stateClass = "correct";
                                else if (isSelected) stateClass = "incorrect";
                            } else if (isSelected) {
                                stateClass = "selected";
                            }

                            return (
                                <div key={index} className="relative">
                                    <RadioGroupItem value={option} id={`option-${index}`} className="absolute opacity-0 w-0 h-0" />
                                    <Label 
                                        htmlFor={`option-${index}`} 
                                        className={cn("answer-card block h-full flex items-center p-6 border-2 transition-all cursor-pointer", stateClass)}
                                        style={{ boxShadow: isSelected ? '0 0 0 transparent' : '4px 4px 0 var(--near-black)' }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-10 h-10 border-2 border-obsidian flex items-center justify-center font-display font-bold text-lg shrink-0",
                                                isSelected ? "bg-obsidian text-white" : "bg-white text-obsidian"
                                            )}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span className="text-xl font-body font-bold tracking-tight">{option}</span>
                                        </div>
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                )}

                {currentQuestion.type === 'fill_in_the_blank' && (
                    <input
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        disabled={isAnswered}
                        className={cn("w-full bg-white text-obsidian border-4 border-obsidian p-8 text-2xl font-display font-bold outline-none focus:ring-8 focus:ring-electric/20 transition-all",
                            isAnswered && isCorrect() && "border-teal bg-teal/10 text-teal",
                            isAnswered && !isCorrect() && "border-vermillion bg-vermillion/10 text-vermillion"
                        )}
                        style={{ boxShadow: '6px 6px 0 var(--near-black)' }}
                    />
                )}
            </div>

            {isAnswered && (
                <div className={cn("sparkz-card p-8 border-obsidian animate-in slide-in-from-bottom-4 duration-500", isCorrect() ? "bg-electric text-forest" : "bg-stone text-obsidian")} style={{ boxShadow: '4px 4px 0 var(--near-black)' }}>
                    <div className="flex items-start gap-5">
                        {isCorrect() ? <IconBolt className="w-10 h-10 flex-shrink-0" /> : <IconQuatrefoil className="w-10 h-10 flex-shrink-0 rotate-45" />}
                        <div>
                            <h3 className="font-display font-bold text-2xl mb-2 uppercase tracking-tighter">{isCorrect() ? "Precisión Total" : "Reajuste Necesario"}</h3>
                            <p className="font-body text-lg font-bold leading-snug">{feedback}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 bg-near-black border-t-4 border-electric p-6 z-50">
                <div className="container mx-auto max-w-3xl flex justify-end">
                    {isAnswered ? (
                        <button onClick={handleNext} className="btn-sparkz-primary bg-electric text-forest border-forest w-full sm:w-auto text-xl px-12 py-5 font-display font-bold">
                            {currentQuestionIndex < sessionQuestions.length - 1 ? 'SIGUIENTE RETO' : 'FINALIZAR MISIÓN'}
                        </button>
                    ) : (
                        <button onClick={handleAnswerSubmit} disabled={!canSubmit()} className={cn("btn-sparkz-action bg-white text-obsidian border-obsidian w-full sm:w-auto text-xl px-12 py-5 font-display font-bold", !canSubmit() && "opacity-50 cursor-not-allowed")}>
                            CONFIRMAR
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto -mt-8 -mx-4 pb-32 bg-forest text-cream min-h-screen p-6 md:p-12 relative overflow-hidden">
      <GeometricField variant="dark" density="medium" className="opacity-20" />
      
      {/* Module Navigation Progress */}
      <div className="flex justify-between items-center mb-16 relative z-10">
          <div className="flex gap-4">
              <div className={cn("w-4 h-4 border-2 border-near-black transition-all", currentStep === 'theory' ? "bg-electric scale-125" : "bg-electric/20")} />
              <div className={cn("w-4 h-4 border-2 border-near-black transition-all", currentStep === 'flashcards' ? "bg-amber scale-125" : "bg-amber/20")} />
              <div className={cn("w-4 h-4 border-2 border-near-black transition-all", currentStep === 'quiz' ? "bg-vermillion scale-125" : "bg-vermillion/20")} />
          </div>
          <span className="sparkz-label text-electric font-bold tracking-[0.2em]">FASE: {currentStep.toUpperCase()}</span>
      </div>

      {currentStep === 'theory' && renderTheoryView()}
      {currentStep === 'flashcards' && renderFlashcardsView()}
      {currentStep === 'quiz' && renderQuizView()}

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
