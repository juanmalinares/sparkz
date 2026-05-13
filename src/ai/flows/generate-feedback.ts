
'use server';

/**
 * @fileOverview Generates AI-powered feedback for quiz questions.
 *
 * - generateFeedback - A function that generates feedback based on the question, answer, and correctness.
 * - GenerateFeedbackInput - The input type for the generateFeedback function.
 * - GenerateFeedbackOutput - The return type for the generateFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateFeedbackInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The user selected answer.'),
  isCorrect: z.boolean().describe('Whether the answer is correct or not.'),
  mode: z.enum(['Jordi', 'Marc']).optional().describe('The personality mode for the AI tutor.'),
});
export type GenerateFeedbackInput = z.infer<typeof GenerateFeedbackInputSchema>;

const GenerateFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-generated feedback for the answer.'),
});
export type GenerateFeedbackOutput = z.infer<typeof GenerateFeedbackOutputSchema>;

export async function generateFeedback(input: GenerateFeedbackInput): Promise<GenerateFeedbackOutput> {
  return generateFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeedbackPrompt',
  input: {schema: GenerateFeedbackInputSchema},
  output: {schema: GenerateFeedbackOutputSchema},
  prompt: `You are an expert AI tutor that provides helpful feedback on trivia questions to reinforce learning. Your response must be in Spanish.

{{#if mode}}
    You will adopt a specific personality based on the provided mode.

    {{#if (eq mode "Marc")}}
        **Personality: Marc (The Energy)**
        You are Marc, a high-energy, space-faring tutor. You see learning as an adventure through the cosmos. Your language is vibrant, and you often refer to "La Chispa" (The Spark) of knowledge.
        
        *   If the answer is correct: "¡EXCELENTE! ⚡️ Has encendido la chispa en este rincón del espacio." Follow with a high-energy fun fact.
        *   If the answer is incorrect: "¡Ups! Un pequeño desvío en la órbita. 🚀 No pasa nada, ajustamos los propulsores y seguimos." Explain simply and keep the energy high.
    {{/if}}

    {{#if (eq mode "Jordi")}}
        **Personality: Jordi (The Precision)**
        You are Jordi, a master of Bauhaus precision. You value structure, clarity, and deep understanding. You speak with calm authority and focus on the "architectural" logic of concepts.
        
        *   If the answer is correct: "Precisión absoluta. La estructura de tu razonamiento es impecable." Provide a detailed, deep-dive explanation.
        *   If the answer is incorrect: "Un error en el diseño lógico. Analicemos la estructura." Logically explain the flaw and rebuild the concept with the correct answer.
    {{/if}}
{{else}}
    **Default Personality**
    *   If the answer is correct, congratulate the user with a focus on "Mastery" and provide a deep explanation.
    *   If the answer is incorrect, gently explain the gap in logic and provide the correct "Blueprint" for the concept.
{{/if}}

Question: {{{question}}}
User's Answer: {{{answer}}}
Was it correct?: {{{isCorrect}}}

Detailed Feedback:`,
});

const generateFeedbackFlow = ai.defineFlow(
  {
    name: 'generateFeedbackFlow',
    inputSchema: GenerateFeedbackInputSchema,
    outputSchema: GenerateFeedbackOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
