'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {generateQuiz} from '@/ai/flows/generate-quiz';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Loader2, Wand2, Copy, PlusCircle} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Quiz, Question } from '@/lib/types';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  topic: z.string().min(3, {message: 'El tema debe tener al menos 3 caracteres.'}),
  audience: z.string().min(3, {message: 'La audiencia debe tener al menos 3 caracteres.'}),
  tone: z.string().min(3, {message: 'El tono debe tener al menos 3 caracteres.'}),
  sessionLength: z.coerce.number().min(1).max(50),
  poolSize: z.coerce.number().min(1).max(100),
  mode: z.enum(['Jordi', 'Marc']),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface QuizCreatorFormProps {
    onQuizAdded: (quiz: Quiz) => void;
}

export function QuizCreatorForm({ onQuizAdded }: QuizCreatorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      audience: 'Niños de 6 a 10 años',
      tone: 'Divertido y educativo',
      sessionLength: 5,
      poolSize: 15,
      mode: 'Marc',
      instructions: '',
    },
});

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGeneratedQuiz(null);

    try {
      const result = await generateQuiz({
        topic: data.topic,
        audience: data.audience,
        tone: data.tone,
        poolSize: data.poolSize,
        instructions: data.instructions,
      });

      const newQuiz: Quiz = {
        id: `${data.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`,
        title: data.topic,
        topic: data.topic,
        theory: result.theory,
        flashcards: result.flashcards,
        questions: result.quiz.map(q => ({ ...q, active: true })),
        image: 'https://placehold.co/600x400.png',
        active: true,
        sessionLength: data.sessionLength,
        mode: data.mode,
      };

      setGeneratedQuiz(newQuiz);

    } catch (error) {
      console.error('Failed to generate quiz:', error);
      toast({
        variant: "destructive",
        title: "Error al Generar el Quiz",
        description: "Algo salió mal. Por favor, intentá de nuevo.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedQuiz) {
        navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2));
        toast({
            title: "¡Copiado al portapapeles!",
            description: "El JSON del quiz ha sido copiado.",
        });
    }
  }

  const handleAddQuizToList = () => {
    if (generatedQuiz) {
        onQuizAdded(generatedQuiz);
        setGeneratedQuiz(null);
        setImagePreviews([]);
        form.reset();
    }
  }

  return (
    <div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="topic"
                    render={({field}) => (
                        <FormItem>
                        <FormLabel>Tema del Quiz</FormLabel>
                        <FormControl>
                            <Input placeholder="ej., El Sistema Solar, Verbos en Italiano" {...field} />
                        </FormControl>
                        <FormDescription>Este será el título principal del quiz.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="mode"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Personalidad de la IA</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná un modo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Marc">Marc (¡Entusiasta y divertido!)</SelectItem>
                          <SelectItem value="Jordi">Jordi (Calmo y sabio)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Elegí cómo responderá el tutor de IA.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                  control={form.control}
                  name="audience"
                  render={({field}) => (
                  <FormItem>
                      <FormLabel>Audiencia Objetivo</FormLabel>
                      <FormControl>
                      <Input placeholder="ej., Niños de 10 años, Principiantes en cocina" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="tone"
                  render={({field}) => (
                  <FormItem>
                      <FormLabel>Tono y Estilo</FormLabel>
                      <FormControl>
                      <Input placeholder="ej., Divertido y sarcástico, Estilo meme" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
            </div>

            <FormField
            control={form.control}
            name="instructions"
            render={({field}) => (
                <FormItem>
                <FormLabel>Instrucciones (Opcional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="ej., Enfocarse en fechas y personajes clave." {...field} />
                </FormControl>
                <FormDescription>Proporcioná instrucciones específicas para la IA.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="sessionLength"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Preguntas por Sesión (Test Final)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Cuántas preguntas verá el alumno en cada intento.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="poolSize"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Pool Total de Preguntas (IA)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Cuántas preguntas creará la IA en total para rotar.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generar Quiz
                </>
            )}
            </Button>
        </form>
        </Form>
        {generatedQuiz && (
            <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
                <div className='flex justify-between items-center mb-4'>
                    <h3 className="text-lg font-semibold">¡Quiz Generado!</h3>
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar JSON
                        </Button>
                        <Button size="sm" onClick={handleAddQuizToList}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar a la lista
                        </Button>
                    </div>
                </div>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify(generatedQuiz, null, 2)}
                </pre>
            </div>
        )}
    </div>
  );
}
