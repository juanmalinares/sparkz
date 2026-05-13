import QuizResultsClient from "@/components/quiz/QuizResultsClient";
import { getQuizById } from "@/lib/db";
import { notFound } from "next/navigation";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultsPage({ params, searchParams }: ResultsPageProps) {
    const { id } = await params;
    const sParams = await searchParams;
    const quiz = await getQuizById(id);

    const scoreValue = Array.isArray(sParams.score) ? sParams.score[0] : sParams.score;
    const totalValue = Array.isArray(sParams.total) ? sParams.total[0] : sParams.total;
    
    const score = parseInt(scoreValue || '0', 10);
    const total = parseInt(totalValue || '0', 10);

    if(!quiz || isNaN(score) || isNaN(total)) {
        return notFound();
    }

    return <QuizResultsClient quiz={quiz} score={score} totalQuestions={total} />;
}
