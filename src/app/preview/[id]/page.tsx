'use client';

import { useParams } from 'next/navigation';
import { ExperiencePlayer } from '@/components/experience/ExperiencePlayer';
import { getCurriculumModule } from '@/content/curriculum';

// Preview an authored curriculum module straight from code (no Firestore /
// admin login needed). Useful to review content before seeding it. e.g.
// /preview/mate5-c1-romanos
export default function CurriculumPreviewPage() {
  const params = useParams();
  const quiz = getCurriculumModule(params.id as string);

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4 text-obsidian">Módulo no encontrado</h1>
        <p className="text-xl text-slate">Revisá el id, o agregá el módulo al currículum en <code>src/content/curriculum</code>.</p>
      </div>
    );
  }

  return <ExperiencePlayer quiz={quiz} />;
}
