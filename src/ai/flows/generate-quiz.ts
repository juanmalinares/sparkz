'use server';

/**
 * @fileOverview AI Module Creator tool to generate new gamified learning modules.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the module.'),
  audience: z.string().default('Niños de 6 a 10 años').describe('The target audience for the module.'),
  tone: z.string().default('Divertido y educativo').describe('The tone and style of the content.'),
  poolSize: z.number().default(15).describe('Total number of questions to generate for the pool.'),
  instructions: z
    .string()
    .optional()
    .describe('Optional instructions for generating the module.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  theory: z.object({
    intro: z.string().describe('A 3-line intro welcoming the user and explaining the importance of the topic.'),
    rules: z.array(z.object({
      title: z.string().describe('Short memorable title.'),
      text: z.string().describe('Direct, easy to digest explanation.'),
      example: z.string().describe('Practical example or "Cheat Code".')
    })).length(4)
  }),
  flashcards: z.array(z.object({
    front: z.string().describe('Front side: question or challenge.'),
    back: z.string().describe('Back side: exact, punchy answer.')
  })).length(6),
  quiz: z.array(
    z.object({
      type: z
        .enum(['multiple_choice', 'true_false', 'fill_in_the_blank', 'odd_one_out'])
        .describe('The type of the question.'),
      question: z.string().describe("The question text."),
      options: z.array(z.string()).optional().describe("For choice types, provide possible answers."),
      correctAnswer: z.string().optional().describe("The correct answer."),
      explanation: z.string().optional(),
    })
  ),
});

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateModulePrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `Actúa como un Experto Diseñador Instruccional, Pedagogo y Copywriter especializado en microlearning gamificado. Tu objetivo es crear un módulo de aprendizaje completo, altamente estructurado y entretenido.

TEMA PRINCIPAL: {{topic}}
AUDIENCIA OBJETIVO: {{audience}}
TONO Y ESTILO: {{tone}}

{{#if instructions}}
INSTRUCCIONES ADICIONALES: {{instructions}}
{{/if}}

Debes generar el contenido estructurado ÚNICAMENTE en formato JSON válido. Tu respuesta debe seguir exactamente estas tres secciones de aprendizaje:

1. SECCIÓN: TEORÍA VISUAL Y ENGANCHADORA (Theory)
Crea una explicación conceptual que capture la atención inmediatamente. Divide el contenido en reglas o principios fundamentales.
- intro: Un párrafo inicial (máximo 3 líneas) dando la bienvenida al usuario en el TONO solicitado, explicando por qué dominar este TEMA es crucial para su éxito.
- rules: Un array de exactamente 4 conceptos clave. Cada uno debe contener:
    - title: Un título corto y memorable adaptado al tono.
    - text: Explicación clara, directa y fácil de digerir de ese concepto.
    - example: Un ejemplo práctico, una fórmula, o un caso de uso realista ("Cheat Code" / Tip).

2. SECCIÓN: REPASO ACTIVO (Flashcards)
Crea tarjetas de memoria diseñadas para la retención rápida (Active Recall).
- flashcards: Un array de exactamente 6 objetos con 'front' y 'back'.

3. SECCIÓN: TEST MULTIFORMATO (Quiz)
Crea un examen final de exactamente {{poolSize}} preguntas. Intenta balancear equitativamente los siguientes tipos:
- "multiple_choice": Opción múltiple con 3-4 opciones, solo una correcta.
- "true_false": Afirmación conceptual. Opciones estrictamente ["Verdadero", "Falso"].
- "fill_in_the_blank": Oración con concepto faltante representado por ______.
- "odd_one_out": "Encuentra el intruso". Identifica qué opción NO pertenece al grupo.

Toda la respuesta debe estar en Idioma Español.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
