'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getQuizzes } from '@/lib/db';
import { IconSquare, IconCircle, IconTriangle, IconDiamond } from '@/components/ui/sparkz-icons';
import { Loader2 } from 'lucide-react';
import type { Quiz } from '@/lib/types';

// Colores por Materia — from brand guide
const subjectColors: { keywords: string[], color: string, icon: any }[] = [
    { keywords: ['matemática', 'math', 'cálculo', 'álgebra', 'geometría'],       color: 'bg-cobalt',     icon: IconSquare },
    { keywords: ['ciencia', 'science', 'naturales', 'biología', 'física', 'química'], color: 'bg-teal', icon: IconTriangle },
    { keywords: ['lengua', 'lectura', 'reading', 'literatura', 'comprensión'],    color: 'bg-violet',     icon: IconCircle },
    { keywords: ['arte', 'art', 'dibujo', 'pintura'],                             color: 'bg-amber',      icon: IconDiamond },
    { keywords: ['música', 'music', 'instrumento'],                                color: 'bg-pink',       icon: IconCircle },
    { keywords: ['programación', 'coding', 'code', 'tecnología', 'informática'],   color: 'bg-sky',        icon: IconSquare },
    { keywords: ['historia', 'history', 'sociales'],                               color: 'bg-orange',     icon: IconDiamond },
    { keywords: ['geografía', 'geography', 'mapas'],                               color: 'bg-emerald',    icon: IconTriangle },
    { keywords: ['idioma', 'english', 'inglés', 'italiano', 'français', 'deutsch', 'language', 'vocabulary', 'dictation', 'routines', 'adjective', 'grammar', 'verb', 'pets'], color: 'bg-vermillion', icon: IconDiamond },
    { keywords: ['lógica', 'logic', 'puzzle', 'reto', 'challenge'],                color: 'bg-gunmetal',   icon: IconSquare },
];

const defaultSubject = { color: 'bg-violet', icon: IconSquare };

function getSubjectStyle(topic: string): { color: string; icon: any } {
    const lower = topic.toLowerCase();
    const match = subjectColors.find(s => s.keywords.some(k => lower.includes(k)));
    return match ? { color: match.color, icon: match.icon } : defaultSubject;
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const allQuizzes = await getQuizzes();
        // Show quizzes that are explicitly active or don't have the active field yet
        setQuizzes(allQuizzes.filter(q => q.active !== false));
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-vermillion" />
        <p className="text-slate mt-4 font-body">Cargando lecciones...</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4 text-obsidian">No hay lecciones disponibles</h1>
        <p className="text-xl text-slate">Parece que aún no hay lecciones activas. Ve al panel de Admin para crear una.</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tighter mb-4 text-obsidian">Choose Your Challenge</h1>
          <p className="text-xl font-body text-slate">Select a subject to begin learning.</p>
      </div>

      <Link href="/practica" className="block group mb-8">
        <div className="sparkz-card flex items-center gap-5 p-6 bg-cobalt text-white overflow-hidden transition-transform group-hover:-translate-y-1 group-active:translate-y-0">
          <div className="w-14 h-14 bg-white/15 border-2 border-near-black flex items-center justify-center shrink-0">
            <IconSquare className="w-7 h-7 text-white" />
          </div>
          <div className="flex-grow">
            <span className="sparkz-label text-white/70">Matemática · Entrenamiento</span>
            <h2 className="text-2xl font-display font-bold leading-tight">Práctica de Cálculo</h2>
            <p className="font-body text-sm text-white/80 mt-1">Ejercicios al instante para ganar velocidad. Sumas, restas, tablas y divisiones.</p>
          </div>
          <div className="w-10 h-10 bg-amber border-2 border-obsidian rounded-action flex items-center justify-center shrink-0" style={{ boxShadow: '2px 2px 0 #111827' }}>
            <IconTriangle className="w-5 h-5 ml-1 transform rotate-90 text-obsidian" />
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const mapping = getSubjectStyle(quiz.topic || quiz.title || '');
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
                    <h2 className="text-2xl font-display font-bold text-obsidian mt-1 leading-tight group-hover:text-vermillion transition-colors">{quiz.title}</h2>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-body font-bold text-obsidian border-2 border-obsidian px-2 py-1 rounded-action" style={{ boxShadow: '2px 2px 0 #111827' }}>
                        {quiz.sessionLength || 10} Qs
                    </span>
                    <div className="w-10 h-10 bg-amber border-2 border-obsidian rounded-action flex items-center justify-center group-hover:bg-vermillion group-hover:text-white transition-colors" style={{ boxShadow: '2px 2px 0 #111827' }}>
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
