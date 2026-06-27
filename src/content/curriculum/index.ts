import type { Quiz } from '@/lib/types';
import { matematica5C1 } from './matematica-5-c1';

/** All curriculum modules authored in code (before they're seeded to Firestore). */
export const allCurriculum: Quiz[] = [...matematica5C1];

/** Look up an authored module by id — used by the /preview route. */
export function getCurriculumModule(id: string): Quiz | undefined {
  return allCurriculum.find(m => m.id === id);
}
