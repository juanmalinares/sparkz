'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, DrillConfig, DrillOperation } from '@/lib/types';
import { useUser } from '@/hooks/useUser';
import { parseNumeric } from '@/lib/answer-match';
import { cn } from '@/lib/utils';
import { GeometricField } from '@/components/ui/geometric-field';
import { IconBolt, IconSparkle, IconQuatrefoil } from '@/components/ui/sparkz-icons';

const DEFAULT_CONFIG: DrillConfig = {
  operations: ['+', '-', '×', '÷'],
  maxOperand: 100,
  maxFactor: 12,
  count: 20,
};

type Phase = 'intro' | 'playing' | 'finished';
type Problem = { text: string; answer: number };

const OP_LABEL: Record<DrillOperation, string> = {
  '+': 'Sumas',
  '-': 'Restas',
  '×': 'Multiplicaciones',
  '÷': 'Divisiones',
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProblem(cfg: DrillConfig): Problem {
  const ops = cfg.operations.length ? cfg.operations : ['+'];
  const op = ops[randInt(0, ops.length - 1)] as DrillOperation;
  const maxOperand = cfg.maxOperand ?? 100;
  const maxFactor = cfg.maxFactor ?? 12;
  switch (op) {
    case '+': {
      const a = randInt(1, maxOperand);
      const b = randInt(1, maxOperand);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    case '-': {
      const a = randInt(1, maxOperand);
      const b = randInt(1, maxOperand);
      const hi = Math.max(a, b);
      const lo = Math.min(a, b);
      return { text: `${hi} − ${lo}`, answer: hi - lo };
    }
    case '×': {
      const a = randInt(1, maxFactor);
      const b = randInt(1, maxFactor);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    case '÷':
    default: {
      const b = randInt(1, maxFactor);
      const q = randInt(1, maxFactor);
      return { text: `${b * q} ÷ ${b}`, answer: q };
    }
  }
}

export default function MathDrillPlayer({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const { user, addScore } = useUser();

  const config: DrillConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...(quiz.drill ?? {}),
      operations: quiz.drill?.operations?.length ? quiz.drill.operations : DEFAULT_CONFIG.operations,
    }),
    [quiz.drill],
  );

  const total = config.count ?? 20;

  const [phase, setPhase] = useState<Phase>('intro');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState('');
  const [index, setIndex] = useState(0); // exercises answered so far
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'incorrect' | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(config.durationSec ?? null);

  const inputRef = useRef<HTMLInputElement>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedRef = useRef(false);

  const timed = config.durationSec != null;

  useEffect(() => {
    document.body.classList.add('lesson-mode');
    return () => document.body.classList.remove('lesson-mode');
  }, []);

  // Clear any pending auto-advance timer on unmount.
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);

  // Keep the input focused whenever a new problem is shown.
  useEffect(() => { if (phase === 'playing') inputRef.current?.focus(); }, [phase, problem]);

  // Countdown for timed runs: one interval for the whole playing phase.
  useEffect(() => {
    if (phase !== 'playing' || !timed) return;
    const t = setInterval(() => {
      setTimeLeft(prev => (prev == null ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, [phase, timed]);

  // End the run when the clock hits zero.
  useEffect(() => {
    if (phase === 'playing' && timed && timeLeft === 0) setPhase('finished');
  }, [phase, timed, timeLeft]);

  // Persist the result once, after finishing (only when signed in and something was attempted).
  useEffect(() => {
    if (phase !== 'finished' || savedRef.current) return;
    savedRef.current = true;
    if (user && index > 0) {
      addScore({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        totalQuestions: index,
        date: Date.now(),
      }).catch(() => { /* result is still shown locally even if the save fails */ });
    }
  }, [phase, user, index, score, quiz.id, quiz.title, addScore]);

  const start = () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
    savedRef.current = false;
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setIndex(0);
    setInput('');
    setFlash(null);
    setTimeLeft(config.durationSec ?? null);
    setProblem(makeProblem(config));
    setPhase('playing');
  };

  const handleAnswer = () => {
    if (phase !== 'playing' || flash !== null || !problem || input.trim() === '') return;

    const correct = parseNumeric(input) === problem.answer;
    const newStreak = correct ? streak + 1 : 0;
    const answered = index + 1;

    if (correct) setScore(s => s + 1);
    setStreak(newStreak);
    setBestStreak(b => Math.max(b, newStreak));
    setIndex(answered);
    setFlash(correct ? 'correct' : 'incorrect');
    setInput('');

    advanceRef.current = setTimeout(() => {
      setFlash(null);
      if (!timed && answered >= total) {
        setPhase('finished');
      } else {
        setProblem(makeProblem(config));
        inputRef.current?.focus();
      }
    }, 450);
  };

  // ---- Intro ----
  if (phase === 'intro') {
    return (
      <Shell>
        <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-vermillion border-2 border-near-black flex items-center justify-center" style={{ boxShadow: '6px 6px 0 var(--near-black)' }}>
              <IconBolt className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <span className="sparkz-label text-vermillion">PRÁCTICA DE CÁLCULO</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-cream mt-2 tracking-tight">{quiz.title}</h1>
          </div>
          <div className="sparkz-card bg-cream text-obsidian border-obsidian p-6 text-left space-y-3">
            <div className="flex flex-wrap gap-2">
              {config.operations.map(op => (
                <span key={op} className="font-body font-bold text-sm border-2 border-obsidian px-3 py-1 bg-white" style={{ boxShadow: '2px 2px 0 var(--near-black)' }}>
                  {op} {OP_LABEL[op]}
                </span>
              ))}
            </div>
            <p className="font-body text-slate text-sm">
              {timed
                ? `Resolvé la mayor cantidad posible en ${config.durationSec} segundos.`
                : `${total} ejercicios. Escribí el resultado y presioná Enter.`}
            </p>
          </div>
          <button onClick={start} className="btn-sparkz-primary text-xl px-12 py-6 h-auto font-display font-bold">
            EMPEZAR <IconBolt className="ml-2 inline" />
          </button>
        </div>
      </Shell>
    );
  }

  // ---- Finished ----
  if (phase === 'finished') {
    const attempted = index;
    const pct = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
    return (
      <Shell>
        <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
          <span className="sparkz-label text-amber">MISIÓN COMPLETA</span>
          <div className="sparkz-card bg-cream text-obsidian border-obsidian p-10">
            <p className="font-display font-bold text-7xl text-vermillion">{score}<span className="text-3xl text-slate">/{attempted}</span></p>
            <p className="font-body font-bold text-xl mt-2 text-obsidian">{pct}% de aciertos</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-forest text-cream px-4 py-2 border-2 border-near-black" style={{ boxShadow: '3px 3px 0 var(--near-black)' }}>
              <IconSparkle className="w-5 h-5 text-amber" />
              <span className="font-body font-bold text-sm">Mejor racha: {bestStreak}</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={start} className="btn-sparkz-primary text-lg px-8 py-4 h-auto font-display font-bold">
              REINTENTAR
            </button>
            <button onClick={() => router.push('/quiz')} className="btn-sparkz-action bg-white text-obsidian border-obsidian text-lg px-8 py-4 h-auto font-display font-bold">
              SALIR
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Playing ----
  const progress = timed && config.durationSec
    ? ((timeLeft ?? 0) / config.durationSec) * 100
    : (index / total) * 100;

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-end gap-4">
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <span className="sparkz-label text-[10px] text-vermillion">
              {timed ? 'TIEMPO RESTANTE' : 'PROGRESO'}
            </span>
            <div className="sparkz-progress h-3 bg-forest">
              <div className="sparkz-progress-fill bg-vermillion" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="text-right">
            <span className="font-display font-bold text-2xl text-amber">{timed ? `${timeLeft}s` : `${index}/${total}`}</span>
            <div className="flex items-center justify-end gap-1 text-cream/70">
              <IconBolt className="w-4 h-4 text-vermillion" />
              <span className="font-body font-bold text-sm">x{streak}</span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'sparkz-card border-obsidian p-12 text-center transition-colors duration-150',
            flash === 'correct' && 'bg-amber',
            flash === 'incorrect' && 'bg-stone',
            flash === null && 'bg-cream',
          )}
        >
          <p className="font-display font-bold text-6xl md:text-7xl text-obsidian tracking-tight tabular-nums">
            {problem?.text} {flash === null ? '= ?' : ''}
          </p>
        </div>

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAnswer(); }}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Tu respuesta"
          className="w-full bg-white text-obsidian border-4 border-obsidian p-6 text-3xl font-display font-bold text-center outline-none focus:ring-8 focus:ring-electric/20 transition-all tabular-nums"
          style={{ boxShadow: '6px 6px 0 var(--near-black)' }}
        />

        <button
          onClick={handleAnswer}
          disabled={input.trim() === '' || flash !== null}
          className={cn(
            'btn-sparkz-primary w-full text-xl py-5 h-auto font-display font-bold',
            (input.trim() === '' || flash !== null) && 'opacity-50 cursor-not-allowed',
          )}
        >
          COMPROBAR
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto -mt-8 -mx-4 pb-32 bg-forest text-cream min-h-screen p-6 md:p-12 relative overflow-hidden">
      <GeometricField variant="dark" density="medium" className="opacity-20" />
      {children}
    </div>
  );
}
