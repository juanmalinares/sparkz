'use client';

import { ExperiencePlayer } from '@/components/experience/ExperiencePlayer';
import type { Quiz } from '@/lib/types';

// A self-contained practice module: no Firestore needed. The math-drill
// experience generates the exercises procedurally from `drill`.
const practiceModule: Quiz = {
  id: 'practica-mate',
  title: 'Práctica de Cálculo',
  topic: 'Matemática',
  experienceType: 'math-drill',
  active: true,
  questions: [],
  drill: {
    operations: ['+', '-', '×', '÷'],
    maxOperand: 100,
    maxFactor: 12,
    count: 20,
  },
};

export default function PracticaPage() {
  return <ExperiencePlayer quiz={practiceModule} />;
}
