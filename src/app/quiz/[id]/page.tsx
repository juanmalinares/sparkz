'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getQuizById } from '@/lib/db';
import { ExperiencePlayer } from '@/components/experience/ExperiencePlayer';
import { Loader2 } from 'lucide-react';
import type { Quiz } from '@/lib/types';

export default function QuizPage() {
  const params = useParams();
  const id = params.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const data = await getQuizById(id);
        if (!data) {
          setNotFound(true);
        } else {
          setQuiz(data);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-vermillion" />
        <p className="text-slate mt-4 font-body">Cargando lección...</p>
      </div>
    );
  }

  if (notFound || !quiz) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4 text-obsidian">Lección no encontrada</h1>
        <p className="text-xl text-slate">Esta lección no existe o fue desactivada.</p>
      </div>
    );
  }

  return <ExperiencePlayer quiz={quiz} />;
}
