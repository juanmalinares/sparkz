
'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useUser} from '@/hooks/useUser';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {QuizCreatorForm} from '@/components/admin/QuizCreatorForm';
import {Lock, Trash2, Loader2, Edit, CheckSquare, AlertTriangle, FilePenLine, ChevronRight, Zap} from 'lucide-react';
import type {Quiz, Report, Question} from '@/lib/types';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Switch} from '@/components/ui/switch';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addQuiz, deleteQuiz, getQuizzes, updateQuiz, getReports, updateReport } from '@/lib/db';
import { EditQuizDialog } from '@/components/admin/EditQuizDialog';
import { EditQuestionDialog } from '@/components/admin/EditQuestionDialog';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

function QuizListTable({quizzes, onToggle, onDelete, onEditDetails, onEditQuestion, loading, onToggleQuestion}: {quizzes: Quiz[], onToggle: (id: string, active: boolean) => void, onDelete: (id: string) => void, onEditDetails: (quiz: Quiz) => void, onEditQuestion: (quiz: Quiz, question: Question, index: number) => void, loading: boolean, onToggleQuestion: (quizId: string, questionIndex: number, active: boolean) => void}) {
    const router = useRouter();
    const getQuestionTypeLabel = (type: Question['type']) => {
        switch (type) {
            case 'multiple_choice': return 'Opción Múltiple';
            case 'true_false': return 'Verdadero/Falso';
            case 'fill_in_the_blank': return 'Rellenar Espacio';
            case 'short_answer': return 'Respuesta Corta';
            case 'matching': return 'Emparejamiento';
            case 'dictation': return 'Dictado';
            default: return 'Estándar';
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Administrar Quizzes Existentes</CardTitle>
                        <CardDescription>
                            Editá, activá, desactivá o eliminá quizzes. Expandí una fila para ver y editar sus preguntas.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Preguntas</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    {quizzes.map(quiz => (
                        <Collapsible asChild key={quiz.id}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <ChevronRight className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-90" />
                                                <span className="sr-only">Toggle questions</span>
                                            </Button>
                                        </CollapsibleTrigger>
                                    </TableCell>
                                    <TableCell className="font-medium">{quiz.title}</TableCell>
                                    <TableCell>{quiz.topic}</TableCell>
                                    <TableCell>{quiz.questions.length}</TableCell>
                                    <TableCell>
                                        <Badge variant={quiz.active ? 'default' : 'secondary'}>
                                            {quiz.active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => router.push(`/admin/quiz/${quiz.id}/edit`)} title="Edición Rápida">
                                            <Zap className="h-4 w-4" />
                                            <span className="sr-only">Edición Rápida</span>
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => onEditDetails(quiz)} title="Editar detalles del quiz">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Editar Detalles</span>
                                        </Button>
                                        <Switch
                                            checked={quiz.active}
                                            onCheckedChange={(checked) => onToggle(quiz.id, checked)}
                                            aria-label="Activar o desactivar quiz"
                                        />
                                        <Button variant="destructive" size="icon" onClick={() => onDelete(quiz.id)} title="Eliminar quiz">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Eliminar</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <CollapsibleContent asChild>
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-0">
                                            <div className="p-4 bg-muted/50">
                                                <h4 className="font-semibold mb-2 ml-2">Preguntas en este quiz (desplácese para ver todas):</h4>
                                                <ScrollArea className="h-96">
                                                    <div className="space-y-2 pr-4 pl-2">
                                                        {quiz.questions.map((q, index) => (
                                                            <div key={`${quiz.id}-q-${index}`} className={cn("flex justify-between items-center p-3 rounded-md bg-background shadow-sm gap-4 transition-opacity", q.active === false && "opacity-50")}>
                                                                <p className="text-sm flex-grow">{index + 1}. {q.question}</p>
                                                                <Badge variant="secondary" className="flex-shrink-0">{getQuestionTypeLabel(q.type)}</Badge>
                                                                <div className="flex items-center gap-2">
                                                                    <Switch
                                                                        checked={q.active !== false}
                                                                        onCheckedChange={(checked) => onToggleQuestion(quiz.id, index, checked)}
                                                                        aria-label={`Activar o desactivar pregunta ${index + 1}`}
                                                                    />
                                                                    <Button variant="outline" size="sm" onClick={() => onEditQuestion(quiz, q, index)}>
                                                                        <FilePenLine className="mr-2 h-4 w-4" /> Editar
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </CollapsibleContent>
                            </TableBody>
                        </Collapsible>
                    ))}
                </Table>
                )}
            </CardContent>
        </Card>
    )
}

function ReportsTable({ reports, onUpdate, loading, onEditQuestion }: { reports: Report[], onUpdate: (id: string, updates: Partial<Report>) => void, loading: boolean, onEditQuestion: (report: Report) => void }) {
  const getReportTypeDescription = (type: Report['reportType']) => {
    switch (type) {
      case 'confusing_question':
        return 'Pregunta confusa';
      case 'incorrect_correction':
        return 'Corrección errónea';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preguntas Reportadas</CardTitle>
        <CardDescription>
          Revisá las preguntas que los usuarios han reportado como confusas o con correcciones erróneas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Pregunta Reportada</TableHead>
                <TableHead>Tipo de Reporte</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.id} className={report.status === 'new' ? 'bg-secondary/50' : ''}>
                  <TableCell className="font-medium">{report.quizTitle}</TableCell>
                  <TableCell className="max-w-xs truncate">{report.question}</TableCell>
                  <TableCell>{getReportTypeDescription(report.reportType)}</TableCell>
                  <TableCell>{format(new Date(report.reportedAt), 'dd/MM/yy HH:mm', { locale: es })}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'new' ? 'destructive' : 'default'}>
                      {report.status === 'new' ? 'Nuevo' : 'Revisado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center gap-2 justify-end">
                     <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditQuestion(report)}
                      disabled={report.status === 'reviewed'}
                    >
                      <FilePenLine className="mr-2 h-4 w-4" />
                      Editar Pregunta
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onUpdate(report.id, { status: 'reviewed' })}
                      disabled={report.status === 'reviewed'}
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Marcar como revisado
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {reports.length === 0 && !loading && <p className="text-center text-muted-foreground py-6">No hay reportes.</p>}
      </CardContent>
    </Card>
  )
}


export default function AdminPage() {
  const {user, loading: userLoading} = useUser();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingQuestionTarget, setEditingQuestionTarget] = useState<{ quiz: Quiz; question: Question; index: number; report?: Report; } | null>(null);

  const isAdmin = !userLoading && user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
        const dbQuizzes = await getQuizzes();
        setQuizzes(dbQuizzes);
    } catch (error) {
        console.error("Failed to load quizzes from Firestore", error);
        toast({
            variant: "destructive",
            title: "Error al cargar quizzes",
            description: "No se pudieron cargar los quizzes desde la base de datos."
        });
    } finally {
        setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
        const dbReports = await getReports({ newOnly: true });
        setReports(dbReports);
    } catch (error) {
        console.error("Failed to load reports from Firestore", error);
        toast({
            variant: "destructive",
            title: "Error al cargar reportes",
            description: "No se pudieron cargar los reportes."
        });
    } finally {
        setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
        fetchQuizzes();
        fetchReports();
    }
  }, [isAdmin]);

  
  const handleAddQuiz = async (newQuiz: Quiz) => {
    try {
        await addQuiz(newQuiz);
        toast({
            title: "Quiz agregado",
            description: "El nuevo quiz fue guardado en la base de datos.",
        });
        fetchQuizzes();
    } catch (error) {
        console.error("Failed to add quiz to Firestore", error);
        toast({
            variant: "destructive",
            title: "Error al agregar quiz",
            description: "No se pudo guardar el quiz. Intenta de nuevo.",
        });
    }
  };

  const handleToggleActive = async (quizId: string, active: boolean) => {
    try {
        await updateQuiz(quizId, { active });
        toast({
            title: "Estado del quiz actualizado",
            description: "El cambio se guardó en la base de datos.",
        });
        fetchQuizzes();
    } catch (error) {
        console.error("Failed to update quiz in Firestore", error);
        toast({
            variant: "destructive",
            title: "Error al actualizar",
            description: "No se pudo actualizar el estado del quiz."
        });
    }
  };

  const handleUpdateDetails = async (quizId: string, updates: Partial<Quiz>) => {
    try {
        await updateQuiz(quizId, updates);
        toast({
            title: "Quiz actualizado",
            description: "Los cambios se guardaron en la base de datos.",
        });
        fetchQuizzes();
        setEditingQuiz(null);
    } catch (error) {
        console.error("Failed to update quiz details in Firestore", error);
        toast({
            variant: "destructive",
            title: "Error al actualizar",
            description: "No se pudieron guardar los cambios del quiz."
        });
    }
};

  const handleDeleteQuiz = async (quizId: string) => {
     if (confirm('¿Seguro que querés eliminar este quiz? Esta acción es permanente y lo eliminará de la base de datos.')) {
        try {
            await deleteQuiz(quizId);
            toast({
                variant: "destructive",
                title: "Quiz eliminado",
                description: "El quiz ha sido eliminado permanentemente.",
            });
            fetchQuizzes();
        } catch (error) {
             console.error("Failed to delete quiz from Firestore", error);
             toast({
                variant: "destructive",
                title: "Error al eliminar",
                description: "No se pudo eliminar el quiz."
             });
        }
    }
  };

  const handleUpdateReport = async (reportId: string, updates: Partial<Report>) => {
    try {
        await updateReport(reportId, updates);
        toast({
            title: "Reporte actualizado",
            description: "El estado del reporte fue modificado.",
        });
        fetchReports();
    } catch (error) {
        console.error("Failed to update report", error);
        toast({
            variant: "destructive",
            title: "Error al actualizar",
            description: "No se pudo actualizar el reporte.",
        });
    }
  };

  const handleToggleQuestionActive = async (quizId: string, questionIndex: number, active: boolean) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      active: active
    };

    try {
      await updateQuiz(quizId, { questions: updatedQuestions });
      toast({
        title: "Pregunta actualizada",
        description: `La pregunta ha sido ${active ? 'activada' : 'desactivada'}.`,
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Failed to update question active state", error);
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudo cambiar el estado de la pregunta.",
      });
    }
  };

 const handleStartEditReportedQuestion = (report: Report) => {
    const quizToEdit = quizzes.find(q => q.id === report.quizId);
    if (!quizToEdit) {
        toast({
            variant: "destructive",
            title: "Quiz no encontrado",
            description: "No se pudo encontrar el quiz asociado a este reporte.",
        });
        return;
    }

    const questionIndex = quizToEdit.questions.findIndex(q => q.question === report.question);
    if (questionIndex === -1) {
        toast({
            variant: "destructive",
            title: "Pregunta no encontrada",
            description: "La pregunta original no fue encontrada en el quiz. Puede que ya haya sido modificada.",
        });
        return;
    }

    setEditingQuestionTarget({
        report,
        quiz: quizToEdit,
        question: quizToEdit.questions[questionIndex],
        index: questionIndex
    });
  };

  const handleStartEditQuizQuestion = (quiz: Quiz, question: Question, index: number) => {
    setEditingQuestionTarget({ quiz, question, index });
  };

  const handleUpdateQuestion = async (quizId: string, questionIndex: number, updatedQuestion: Question) => {
    if (!editingQuestionTarget) return;

    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    
    try {
        await updateQuiz(quizId, { questions: updatedQuestions });
        
        let toastDescription = "Los cambios en la pregunta se guardaron en la base de datos.";
        if (editingQuestionTarget.report) {
            await updateReport(editingQuestionTarget.report.id, { status: 'reviewed' });
            toastDescription = "Los cambios se guardaron y el reporte se marcó como revisado.";
        }
        
        toast({
            title: "Pregunta actualizada",
            description: toastDescription,
        });

        setEditingQuestionTarget(null);
        fetchQuizzes(); 
        if (editingQuestionTarget.report) {
            fetchReports();
        }
    } catch (error) {
        console.error("Failed to update question or report", error);
        toast({
            variant: "destructive",
            title: "Error al actualizar",
            description: "No se pudieron guardar los cambios."
        });
    }
  };


  if (userLoading) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Verificando acceso...</p>
        </div>
    )
  }
  
  if (!isAdmin) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Lock className="w-16 h-16 text-destructive mb-4"/>
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground max-w-md">
            Esta página es solo para administradores. Iniciá sesión con la cuenta de administrador para continuar.
        </p>
        
        <Card className="mt-6 p-4 text-left text-sm bg-secondary/50 border-border w-full max-w-md">
          <CardHeader className="p-2">
            <CardTitle className="text-base">Estado de la Verificación</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <p><strong>Email actual:</strong> {user ? `'${user.email}'` : 'No autenticado'}</p>
            <p><strong>Email Admin esperado:</strong> {adminEmail ? `'${adminEmail}'` : '(No configurado)'}</p>
            
            {!adminEmail && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>¡Acción Requerida!</AlertTitle>
                    <AlertDescription>
                        La variable de entorno <code>NEXT_PUBLIC_ADMIN_EMAIL</code> no está configurada. Debes agregarla a tu archivo <code>.env</code> y reiniciar el servidor para ver el link de Admin.
                    </AlertDescription>
                </Alert>
            )}
            
            {user && adminEmail && !isAdmin && (
                <p className="text-destructive font-semibold mt-2">
                    El email actual no coincide con el de administrador.
                </p>
            )}
          </CardContent>
        </Card>

        <Button asChild className="mt-6">
            <Link href="/quiz">Volver a los Quizzes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold font-headline">Panel de Administración</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Creador de Quizzes con IA</CardTitle>
          <CardDescription>
            Generá un nuevo quiz usando IA. Proporcioná un tema, número de preguntas y dificultad. La IA creará una mezcla de tipos de preguntas.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <QuizCreatorForm onQuizAdded={handleAddQuiz} />
        </CardContent>
      </Card>
      
      <QuizListTable 
        quizzes={quizzes} 
        onToggle={handleToggleActive} 
        onDelete={handleDeleteQuiz} 
        onEditDetails={(quiz) => setEditingQuiz(quiz)} 
        onEditQuestion={handleStartEditQuizQuestion}
        loading={isLoading} 
        onToggleQuestion={handleToggleQuestionActive}
      />
      
      <ReportsTable reports={reports} onUpdate={handleUpdateReport} loading={reportsLoading} onEditQuestion={handleStartEditReportedQuestion} />

      {editingQuiz && (
        <EditQuizDialog
            quiz={editingQuiz}
            onUpdate={handleUpdateDetails}
            onOpenChange={(isOpen) => !isOpen && setEditingQuiz(null)}
        />
      )}
      
      {editingQuestionTarget && (
        <EditQuestionDialog
          quiz={editingQuestionTarget.quiz}
          question={editingQuestionTarget.question}
          questionIndex={editingQuestionTarget.index}
          onUpdate={handleUpdateQuestion}
          onOpenChange={(isOpen) => !isOpen && setEditingQuestionTarget(null)}
        />
      )}
    </div>
  );
}

    