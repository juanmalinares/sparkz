
'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { getQuizById, updateQuiz } from '@/lib/db';
import type { Quiz, Question } from '@/lib/types';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QuestionEditor } from '@/components/admin/QuestionEditor';
import { produce } from 'immer';

// Custom hook for debouncing
function useDebounce(value: any, delay: number) {  
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function RapidEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = use(params);

  const debouncedQuiz = useDebounce(quiz, 1500); // Debounce for 1.5 seconds

  const isAdmin = !userLoading && user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (userLoading) return;
    if (!isAdmin) {
      router.push('/admin');
      return;
    }
    
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        const dbQuiz = await getQuizById(id);
        if (dbQuiz) {
          setQuiz(dbQuiz);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el quiz.' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuiz();
  }, [id, userLoading, isAdmin, router, toast]);


  useEffect(() => {
    const saveQuiz = async () => {
        if (!debouncedQuiz || !debouncedQuiz.questions) return;
        setIsSaving(true);
        try {
            await updateQuiz(debouncedQuiz.id, { questions: debouncedQuiz.questions });
             toast({
                title: '¡Guardado!',
                description: 'Los cambios se han guardado en la base de datos.',
                duration: 2000,
            });
        } catch (error) {
            console.error("Error updating quiz:", error);
            toast({
                variant: 'destructive',
                title: 'Error de guardado',
                description: 'No se pudieron guardar los cambios.'
            });
        } finally {
            setIsSaving(false);
        }
    };
    if (debouncedQuiz) {
      saveQuiz();
    }
  }, [debouncedQuiz, toast]);


  const handleQuestionChange = useCallback((index: number, updatedQuestion: Question) => {
    setQuiz(
      produce(draft => {
        if (draft) {
          draft.questions[index] = updatedQuestion;
        }
      })
    );
  }, [produce]);

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <Button variant="ghost" onClick={() => router.push('/admin')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Panel
            </Button>
            <h1 className="text-3xl font-bold font-headline mt-2">Edición Rápida: {quiz.title}</h1>
            <p className="text-muted-foreground">Los cambios se guardan automáticamente.</p>
        </div>
        <div>
            {isSaving && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
      </div>
      
      <div className="space-y-8">
        {quiz.questions.map((question, index) => (
          <QuestionEditor
            key={`${quiz.id}-q-${index}`}
            question={question}
            questionIndex={index}
            onQuestionChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
          />
        ))}
      </div>
    </div>
  );
}
