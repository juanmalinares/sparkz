'use client';

import { useState, useEffect, useMemo } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import Link from 'next/link';
import { getQuizzes } from '@/lib/db';
import {
  IconQuatrefoil, IconStarburst, IconDisc, IconArch, IconSparkle, IconBolt,
  type SparkzIconProps,
} from '@/components/ui/sparkz-icons';
import { Loader2, ChevronRight, Play } from 'lucide-react';
import type { Quiz } from '@/lib/types';

type IconCmp = (p: SparkzIconProps) => ReactElement;

// ── Colores por Materia (V3.0 palette) — used for the section header ──
const SUBJECTS: { keywords: string[]; accent: string; Icon: IconCmp }[] = [
  { keywords: ['matemátic', 'matematic', 'math', 'cálculo', 'calcul', 'álgebra', 'geometr'], accent: '#6E6BF0', Icon: IconQuatrefoil },
  { keywords: ['ciencia', 'naturales', 'biolog', 'física', 'fisica', 'quím'],                accent: '#1FE0A6', Icon: IconStarburst  },
  { keywords: ['lengua', 'lectura', 'literatura', 'comprensión'],                            accent: '#F4C24A', Icon: IconArch       },
  { keywords: ['inglés', 'ingles', 'english', 'idioma', 'italiano', 'grammar'],              accent: '#F2674C', Icon: IconSparkle    },
];
const DEFAULT_SUBJECT = { accent: '#6E6BF0', Icon: IconQuatrefoil };

// Per-card glyph variety.
const UNIT_GLYPHS: IconCmp[] = [IconQuatrefoil, IconStarburst, IconDisc, IconArch, IconSparkle, IconBolt];

// Carátula colors — cycled per lesson so the catalog is vivid, not monochrome.
const CARD_PALETTE: { accent: string; on: string }[] = [
  { accent: '#6E6BF0', on: '#FFFFFF' }, // violet
  { accent: '#1FE0A6', on: '#08291F' }, // mint
  { accent: '#F4C24A', on: '#2A1D06' }, // gold
  { accent: '#F2674C', on: '#FFFFFF' }, // coral
  { accent: '#38BDF8', on: '#06283D' }, // sky
  { accent: '#EC4899', on: '#FFFFFF' }, // pink
];

function subjectKey(q: Quiz): string {
  return (q.subject || q.topic || 'General').trim();
}
function subjectStyle(name: string) {
  const lower = name.toLowerCase();
  return SUBJECTS.find(s => s.keywords.some(k => lower.includes(k))) ?? DEFAULT_SUBJECT;
}

interface SubjectGroup {
  name: string;
  accent: string;
  Icon: IconCmp;
  grade?: string;
  quizzes: Quiz[];
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const all = await getQuizzes();
        setQuizzes(all.filter(q => q.active !== false));
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const groups = useMemo<SubjectGroup[]>(() => {
    const bySubject = new Map<string, Quiz[]>();
    for (const q of quizzes) {
      const key = subjectKey(q);
      (bySubject.get(key) ?? bySubject.set(key, []).get(key)!).push(q);
    }
    const result: SubjectGroup[] = [];
    for (const [name, list] of bySubject) {
      const ordered = [...list].sort((a, b) => {
        const ao = a.order ?? null, bo = b.order ?? null;
        if (ao !== null && bo !== null) return ao - bo;
        return (a.createdAt || 0) - (b.createdAt || 0);
      });
      const style = subjectStyle(name);
      result.push({
        name,
        accent: style.accent,
        Icon: style.Icon,
        grade: ordered.find(q => q.grade)?.grade,
        quizzes: ordered,
      });
    }
    return result.sort((a, b) => {
      if (a.name === 'Matemática') return -1;
      if (b.name === 'Matemática') return 1;
      return b.quizzes.length - a.quizzes.length;
    });
  }, [quizzes]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <p className="text-[color:var(--muted-foreground)] mt-4 font-body">Cargando lecciones…</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Page intro */}
      <header className="mb-7">
        <span className="sparkz-label text-mint">Aprender</span>
        <h1 className="font-display text-[40px] leading-[0.95] text-ink mt-1.5">¿Qué practicamos hoy?</h1>
        <p className="font-body text-[color:var(--muted-foreground)] mt-3">
          Elegí una lección para sumar XP y preparar el cuatrimestral.
        </p>
      </header>

      {/* Hero: práctica rápida (Reto) */}
      <Link href="/practica" className="group block mb-9">
        <article className="relative overflow-hidden rounded-card bg-pop p-5 flex items-center gap-4
                            shadow-[var(--shadow-card-lg)] transition-transform
                            group-hover:-translate-y-1 group-active:translate-y-0">
          <div className="w-14 h-14 rounded-2xl bg-black/15 grid place-items-center shrink-0">
            <IconBolt className="w-8 h-8 text-ink" />
          </div>
          <div className="flex-grow min-w-0">
            <span className="sparkz-label text-ink/75">Matemática · Entrenamiento</span>
            <h2 className="font-display text-[26px] leading-none text-ink mt-1">Práctica de Cálculo</h2>
            <p className="font-body text-sm text-ink/85 mt-1.5">
              Ejercicios al instante para ganar velocidad: sumas, restas, tablas y divisiones.
            </p>
          </div>
          <span className="grid w-11 h-11 rounded-full bg-base/90 text-ink place-items-center shrink-0
                          transition-transform group-hover:scale-105">
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </span>
        </article>
      </Link>

      {quizzes.length === 0 ? (
        <div className="sparkz-card text-center py-16 px-6">
          <h2 className="font-display text-2xl text-ink">Todavía no hay lecciones</h2>
          <p className="font-body text-[color:var(--muted-foreground)] mt-2">
            Cuando se publiquen, las vas a ver acá. Mientras tanto, probá la Práctica de Cálculo. 👆
          </p>
        </div>
      ) : (
        <div className="space-y-9">
          {groups.map((group, gi) => {
            const base = groups.slice(0, gi).reduce((n, g) => n + g.quizzes.length, 0);
            return (
            <section key={group.name} style={{ '--accent': group.accent } as CSSProperties}>
              {/* Materia header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
                     style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}>
                  <group.Icon className="w-5 h-5" color="var(--accent)" />
                </div>
                <h2 className="font-display text-xl text-ink leading-none">{group.name}</h2>
                <span className="font-ui text-xs text-[color:var(--muted-foreground)]">
                  {group.quizzes.length} {group.quizzes.length === 1 ? 'lección' : 'lecciones'}
                  {group.grade ? ` · ${group.grade}` : ''}
                </span>
                <div className="flex-grow h-px bg-[color:var(--line)] ml-1" />
              </div>

              {/* Lesson cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.quizzes.map((quiz, i) => {
                  const Glyph = UNIT_GLYPHS[i % UNIT_GLYPHS.length];
                  const count = quiz.sessionLength || quiz.questions?.length || 10;
                  const pal = CARD_PALETTE[(base + i) % CARD_PALETTE.length];
                  return (
                    <Link href={`/quiz/${quiz.id}`} key={quiz.id} className="group block h-full">
                      <article
                        style={{ '--accent': pal.accent } as CSSProperties}
                        className="flex flex-col h-full rounded-card overflow-hidden bg-surface border border-[color:var(--line)]
                                   transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[color:var(--accent)]
                                   group-hover:shadow-[0_0_30px_-8px_var(--accent)]"
                      >
                        {/* Carátula */}
                        <div className="relative h-24 overflow-hidden flex items-end p-4" style={{ background: pal.accent }}>
                          <Glyph className="absolute -right-4 -bottom-6 w-28 h-28" color={pal.on} style={{ opacity: 0.16 }} />
                          <Glyph className="w-8 h-8 relative z-10" color={pal.on} />
                          <span className="absolute top-3 right-3 z-10 rounded-pill bg-base px-2.5 py-1 leading-none inline-flex items-baseline gap-1">
                            <span className="font-display text-base text-ink">{count}</span>
                            <span className="font-ui font-bold uppercase text-[9px] tracking-[0.1em] text-ink/55">preg</span>
                          </span>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col flex-grow p-4">
                          <span className="sparkz-label">{quiz.unit || quiz.topic}</span>
                          <h3 className="font-display text-[24px] leading-[1.05] text-ink mt-1">{quiz.title}</h3>
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <span className="font-ui text-xs text-[color:var(--muted-foreground)]">
                              {quiz.grade ? `${quiz.grade} · ` : ''}Lección
                            </span>
                            <span className="w-9 h-9 rounded-full grid place-items-center text-[color:var(--accent)]"
                                  style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}>
                              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
