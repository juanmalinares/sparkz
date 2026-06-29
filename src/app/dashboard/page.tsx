'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { getQuizzes } from '@/lib/db';
import type { Quiz, Score } from '@/lib/types';
import { HatchBars, TickGauge, ConnectedBadges, type BarDatum } from '@/components/ui/dataviz';

interface Stats {
  name: string;
  xp: number;
  lecciones: number;
  precision: number;
  record: number;
  weekly: BarDatum[];
  weeklyActive: number;
  mastery: BarDatum[];
  masteryActive: number;
}

const WEEKDAY = ['D', 'L', 'M', 'X', 'J', 'V', 'S']; // Date.getDay() 0..6 (es-AR initials)

function shortSubject(s: string): string {
  return s.trim().slice(0, 3).toUpperCase();
}

function computeStats(scores: Score[], quizzes: Quiz[], name: string): Stats | null {
  if (scores.length === 0) return null;

  const totalCorrect = scores.reduce((a, s) => a + s.score, 0);
  const totalQuestions = scores.reduce((a, s) => a + s.totalQuestions, 0);
  const precision = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Weekly XP — correct answers (×10) per day over the last 7 days.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return { time: d.getTime(), label: WEEKDAY[d.getDay()], v: 0 };
  });
  for (const s of scores) {
    const sd = new Date(s.date);
    sd.setHours(0, 0, 0, 0);
    const slot = days.find(d => d.time === sd.getTime());
    if (slot) slot.v += s.score * 10;
  }

  // Mastery — accuracy per subject (subject || topic), highlight the strongest.
  const subjectOf = new Map(quizzes.map(q => [q.id, (q.subject || q.topic || 'General').trim()]));
  const agg = new Map<string, { correct: number; total: number }>();
  for (const s of scores) {
    const subj = subjectOf.get(s.quizId) || 'General';
    const a = agg.get(subj) ?? { correct: 0, total: 0 };
    a.correct += s.score;
    a.total += s.totalQuestions;
    agg.set(subj, a);
  }
  const mastery: BarDatum[] = [...agg.entries()].map(([subj, a]) => ({
    label: shortSubject(subj),
    v: a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0,
  })).slice(0, 5);
  let masteryActive = 0;
  mastery.forEach((m, i) => { if (m.v > (mastery[masteryActive]?.v ?? -1)) masteryActive = i; });

  return {
    name,
    xp: totalCorrect * 10,
    lecciones: scores.length,
    precision,
    record: Math.max(...scores.map(s => Math.round((s.score / s.totalQuestions) * 100))),
    weekly: days.map(d => ({ label: d.label, v: d.v })),
    weeklyActive: 6,
    mastery,
    masteryActive,
  };
}

const DEMO_STATS: Stats = {
  name: 'Jordi',
  xp: 1280,
  lecciones: 14,
  precision: 94,
  record: 100,
  weekly: [
    { label: 'L', v: 40 }, { label: 'M', v: 72 }, { label: 'X', v: 96 },
    { label: 'J', v: 58 }, { label: 'V', v: 80 }, { label: 'S', v: 30 }, { label: 'D', v: 12 },
  ],
  weeklyActive: 2,
  mastery: [
    { label: 'MAT', v: 78 }, { label: 'CIE', v: 62 }, { label: 'LEC', v: 91 },
    { label: 'ART', v: 44 }, { label: 'MÚS', v: 70 },
  ],
  masteryActive: 2,
};

function StatTile({ label, value, tone = 'light' }: { label: string; value: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={tone === 'light' ? 'rounded-xl bg-white/12 p-4' : 'rounded-xl bg-base p-4'}>
      <span className="font-ui font-bold uppercase text-[10px] tracking-[0.13em] text-ink/70">{label}</span>
      <p className="font-display text-3xl text-ink leading-none mt-1.5">{value}</p>
    </div>
  );
}

function DashboardView({ s }: { s: Stats }) {
  return (
    <div className="space-y-5 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start">
      {/* Left column: Esta semana + Maestría */}
      <div className="space-y-5 lg:col-span-2">
      {/* Esta semana (hero) */}
      <section className="rounded-card bg-brand p-5" style={{ boxShadow: 'var(--glow-brand)' }}>
        <div className="flex items-baseline justify-between">
          <span className="sparkz-label text-ink/70">Esta semana</span>
          <span className="font-display text-ink text-lg leading-none">{s.xp.toLocaleString('es-AR')} <span className="text-ink/60 text-xs">XP</span></span>
        </div>
        <div className="mt-3">
          <HatchBars
            data={s.weekly}
            active={s.weeklyActive}
            color="#ffffff"
            labelColor="rgba(255,255,255,0.6)"
            tagBg="#14161A"
            tagColor="#ffffff"
            height={140}
            valueFmt={(v) => `${v}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <StatTile label="XP total" value={s.xp.toLocaleString('es-AR')} />
          <StatTile label="Lecciones" value={String(s.lecciones)} />
        </div>
      </section>

      {/* Maestría por materia */}
      <section className="sparkz-card p-5">
        <span className="sparkz-label text-[color:var(--muted-foreground)]">Maestría por materia</span>
        <div className="mt-3">
          <ConnectedBadges data={s.mastery} active={s.masteryActive} color="#6E6BF0" />
        </div>
      </section>
      </div>

      {/* Right column: Precisión + Récord */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-5">
        <section className="sparkz-card p-5 flex flex-col items-center">
          <span className="sparkz-label text-[color:var(--muted-foreground)] self-start">Precisión</span>
          <div className="mt-2">
            <TickGauge size={132} pct={s.precision / 100} color="#1FE0A6" value={s.precision} label="%" track="rgba(255,255,255,0.1)" />
          </div>
        </section>
        <section className="sparkz-card p-5 flex flex-col">
          <span className="sparkz-label text-[color:var(--muted-foreground)]">Récord</span>
          <div className="flex-grow grid place-items-center py-2">
            <div className="text-center">
              <p className="font-display text-mint leading-none" style={{ fontSize: 56 }}>{s.record}<span className="text-2xl">%</span></p>
              <span className="font-ui text-xs text-[color:var(--muted-foreground)]">mejor puntaje</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, scores, loading: userLoading } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let on = true;
    getQuizzes().then(q => { if (on) { setQuizzes(q); setDataLoading(false); } }).catch(() => on && setDataLoading(false));
    return () => { on = false; };
  }, []);

  const stats = useMemo(
    () => (user ? computeStats(scores, quizzes, user.displayName || 'crack') : null),
    [user, scores, quizzes],
  );

  if (userLoading || (user && dataLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <p className="text-[color:var(--muted-foreground)] mt-4 font-body">Cargando tu progreso…</p>
      </div>
    );
  }

  // Logged out → sample dashboard with a sign-in nudge.
  if (!user) {
    return (
      <div className="pb-6">
        <header className="mb-5">
          <span className="sparkz-label text-mint">Premios</span>
          <h1 className="font-display text-[34px] text-ink leading-[0.95] mt-1.5">Tu progreso</h1>
        </header>
        <div className="sparkz-card p-4 mb-5 flex items-center justify-between gap-3">
          <p className="font-body text-sm text-[color:var(--muted-foreground)]">Estás viendo un panel de ejemplo.</p>
          <Link href="/tutorial" className="font-display uppercase text-sm tracking-wide bg-brand text-ink rounded-pill px-4 py-2 shrink-0">
            Iniciá sesión
          </Link>
        </div>
        <DashboardView s={DEMO_STATS} />
      </div>
    );
  }

  // Logged in, no plays yet → empty state.
  if (!stats) {
    return (
      <div className="pb-6">
        <header className="mb-5">
          <span className="sparkz-label text-mint">Premios</span>
          <h1 className="font-display text-[34px] text-ink leading-[0.95] mt-1.5">¡Hola, {user.displayName || 'crack'}!</h1>
        </header>
        <div className="sparkz-card p-8 text-center">
          <h2 className="font-display text-2xl text-ink">Todavía no hay progreso</h2>
          <p className="font-body text-[color:var(--muted-foreground)] mt-2 max-w-xs mx-auto">
            Jugá tu primera lección y vas a ver acá tu XP, precisión y maestría por materia.
          </p>
          <Link href="/quiz" className="btn-sparkz-primary justify-center mt-6 inline-flex">Ir a las lecciones</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <header className="mb-5">
        <span className="sparkz-label text-mint">Premios</span>
        <h1 className="font-display text-[34px] text-ink leading-[0.95] mt-1.5">¡Hola, {stats.name}!</h1>
      </header>
      <DashboardView s={stats} />
    </div>
  );
}
