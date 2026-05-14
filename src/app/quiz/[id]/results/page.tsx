'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import QuizResultsClient from "@/components/quiz/QuizResultsClient";
import { getQuizById } from "@/lib/db";
import { Loader2 } from 'lucide-react';
import type { Quiz } from '@/lib/types';

export default function ResultsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    const score = parseInt(searchParams.get('score') || '0', 10);
    const total = parseInt(searchParams.get('total') || '0', 10);

    useEffect(() => {
        async function fetchQuiz() {
            try {
                const data = await getQuizById(id);
                setQuiz(data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
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
                <p className="text-slate mt-4 font-body">Cargando resultados...</p>
            </div>
        );
    }

    if (!quiz || isNaN(score) || isNaN(total)) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4 text-obsidian">Resultados no encontrados</h1>
                <p className="text-xl text-slate">No se pudieron cargar los resultados.</p>
            </div>
        );
    }

    return <QuizResultsClient quiz={quiz} score={score} totalQuestions={total} />;
}
