import { getQuizById, getQuizzes } from '@/lib/db';
import { notFound } from 'next/navigation';
import QuizClient from '@/components/quiz/QuizClient';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz || !quiz.active) {
    notFound();
  }

  return <QuizClient quiz={quiz} />;
}

export async function generateStaticParams() {
    const quizzes = await getQuizzes({ activeOnly: true });
    return quizzes.map(quiz => ({ id: quiz.id }));
}
