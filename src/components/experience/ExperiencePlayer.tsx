'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import type { Quiz, ExperienceType } from '@/lib/types';

type ExperienceComponent = ComponentType<{ quiz: Quiz }>;

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <Loader2 className="h-12 w-12 animate-spin text-vermillion" />
  </div>
);

// Each experience is its own code-split chunk, loaded only when actually
// selected. This keeps one experience's heavy deps (e.g. the classic quiz's
// AI feedback flow, which pulls in Genkit) out of every other experience.
// Registering a new experience = adding one entry here.
const registry: Partial<Record<ExperienceType, ExperienceComponent>> = {
  'classic-quiz': dynamic(() => import('@/experiences/classic-quiz/Player'), { ssr: false, loading: Loading }),
  'math-drill': dynamic(() => import('@/experiences/math-drill/Player'), { ssr: false, loading: Loading }),
};

/**
 * Picks the playable experience for a module based on `quiz.experienceType`
 * and renders it. Absent/unknown types fall back to the classic quiz.
 */
export function ExperiencePlayer({ quiz }: { quiz: Quiz }) {
  const Experience = (quiz.experienceType && registry[quiz.experienceType]) || registry['classic-quiz']!;
  return <Experience quiz={quiz} />;
}
