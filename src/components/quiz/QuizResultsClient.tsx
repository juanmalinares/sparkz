'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useUser} from '@/hooks/useUser';
import {type Quiz} from '@/lib/types';
import {Button} from '@/components/ui/button';
import {Repeat, Trophy, Award, Loader2, Home} from 'lucide-react';
import {cn} from '@/lib/utils';

export default function QuizResultsClient({quiz, score, totalQuestions}: {quiz: Quiz; score: number; totalQuestions: number}) {
  const router = useRouter();
  const {user, highScore, loading} = useUser();

  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if(!loading && !user) {
        router.push('/tutorial');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-16 h-16 animate-spin text-vermillion" />
        </div>
      );
  }

  return (
    <div className="flex items-center justify-center py-10 px-4 min-h-screen -mt-8 -mx-4 bg-obsidian text-cream">
      <div className="sparkz-card w-full max-w-2xl bg-white text-obsidian border-obsidian p-8 md:p-12 text-center animate-in zoom-in-95 duration-500" style={{ boxShadow: '6px 6px 0 #111827' }}>
        
        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-amber border-2 border-obsidian rounded-action flex items-center justify-center rotate-3" style={{ boxShadow: '4px 4px 0 #111827' }}>
                <Trophy className="w-12 h-12 text-obsidian" />
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 tracking-tight">¡Misión Cumplida!</h1>
        <p className="text-xl font-body text-slate mb-10">Increíble trabajo, {user?.displayName || 'estudiante'}.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="sparkz-card p-6 bg-vermillion text-white border-obsidian">
                <span className="sparkz-label text-white/70 block mb-2">TU PUNTAJE</span>
                <p className="text-6xl font-display font-bold mb-1">{percentage}%</p>
                <p className="text-sm font-body text-white/80">{score} de {totalQuestions} aciertos</p>
            </div>
            
            <div className="sparkz-card p-6 bg-cream text-obsidian border-obsidian">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-vermillion" />
                    <span className="sparkz-label text-slate">RÉCORD PERSONAL</span>
                </div>
                <p className="text-6xl font-display font-bold mb-1">{highScore}%</p>
                <p className="text-sm font-body text-slate">¡Seguí así!</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push(`/quiz/${quiz.id}`)} 
            className="btn-sparkz-primary py-6 h-auto text-lg"
          >
            <Repeat className="mr-2 h-5 w-5" />
            Reintentar Módulo
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/quiz')}
            className="btn-sparkz-ghost py-6 h-auto text-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Ver Otros Módulos
          </Button>
        </div>
      </div>
    </div>
  );
}
