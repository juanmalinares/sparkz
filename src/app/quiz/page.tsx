import Link from 'next/link';
import { getQuizzes } from '@/lib/db';
import { IconSquare, IconCircle, IconTriangle, IconDiamond } from '@/components/ui/sparkz-icons';

export const revalidate = 0;

// Map subjects to colors and geometric shapes for thumbnails
const subjectMap: Record<string, { color: string, icon: any }> = {
    'Matemáticas': { color: 'bg-cobalt', icon: IconSquare },
    'Lengua': { color: 'bg-amber', icon: IconCircle },
    'Ciencias Naturales': { color: 'bg-teal', icon: IconTriangle },
    'Ciencias Sociales': { color: 'bg-vermillion', icon: IconDiamond },
    'default': { color: 'bg-violet', icon: IconSquare }
};

export default async function QuizListPage() {
  const quizzes = await getQuizzes({ activeOnly: true });

  return (
    <div className="pb-10">
      <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tighter mb-4 text-obsidian">Choose Your Challenge</h1>
          <p className="text-xl font-body text-slate">Select a subject to begin learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const mapping = subjectMap[quiz.topic] || subjectMap['default'];
          const Icon = mapping.icon;
          
          return (
            <Link href={`/quiz/${quiz.id}`} key={quiz.id} className="block group">
              <div className="sparkz-card flex flex-col h-full overflow-hidden transition-transform group-hover:-translate-y-1 group-active:translate-y-0 relative">
                
                {/* Geometric Thumbnail Area */}
                <div className={`h-32 ${mapping.color} flex items-center justify-center relative overflow-hidden border-b-2 border-obsidian`}>
                    <Icon className="w-24 h-24 text-white opacity-20 absolute -right-4 -bottom-4 transform rotate-12" />
                    <Icon className="w-12 h-12 text-white relative z-10" />
                </div>

                <div className="p-6 flex flex-col flex-grow bg-white">
                  <div className="mb-4">
                    <span className="sparkz-label text-slate">{quiz.topic}</span>
                    <h2 className="text-2xl font-display font-bold text-obsidian mt-1 leading-tight group-hover:text-cobalt transition-colors">{quiz.title}</h2>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-body font-bold text-obsidian border-2 border-obsidian px-2 py-1 rounded-action" style={{ boxShadow: '2px 2px 0 #111827' }}>
                        {quiz.sessionLength || 10} Qs
                    </span>
                    <div className="w-10 h-10 bg-amber border-2 border-obsidian rounded-action flex items-center justify-center group-hover:bg-cobalt group-hover:text-white transition-colors" style={{ boxShadow: '2px 2px 0 #111827' }}>
                        <IconTriangle className="w-5 h-5 ml-1 transform rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
