'use server';

/**
 * @fileOverview Generates AI-powered, error-aware feedback for quiz questions.
 *
 * Based on K-12 math research (Khanmigo multi-path tutoring, MathEDU error
 * analysis, Vanderbilt misconception dataset): feedback classifies the error
 * (procedural vs. conceptual vs. careless), frames mistakes as useful
 * information (reduces math anxiety), and offers a guiding hint rather than
 * just restating the answer.
 *
 * - generateFeedback - Generates feedback based on the question, answer, and correctness.
 * - GenerateFeedbackInput - The input type for the generateFeedback function.
 * - GenerateFeedbackOutput - The return type for the generateFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateFeedbackInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The user selected answer.'),
  isCorrect: z.boolean().describe('Whether the answer is correct or not.'),
  correctAnswer: z.string().optional().describe('The correct answer, so the tutor can reason about the gap.'),
  explanation: z.string().optional().describe('Reference explanation for the question, if available.'),
  mode: z.enum(['Jordi', 'Marc']).optional().describe('The personality mode for the AI tutor.'),
});
export type GenerateFeedbackInput = z.infer<typeof GenerateFeedbackInputSchema>;

const GenerateFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The kid-friendly feedback message, in Spanish (es-AR).'),
  errorType: z
    .enum(['procedural', 'conceptual', 'careless', 'none'])
    .describe("Type of the student's error: 'procedural' (understood the idea, slipped in the steps), 'conceptual' (misunderstood the idea), 'careless' (a slip/typo), or 'none' (answer was correct)."),
  hint: z
    .string()
    .optional()
    .describe('When incorrect: ONE short guiding question (Spanish) that nudges the child toward fixing it WITHOUT stating the final answer.'),
});
export type GenerateFeedbackOutput = z.infer<typeof GenerateFeedbackOutputSchema>;

export async function generateFeedback(input: GenerateFeedbackInput): Promise<GenerateFeedbackOutput> {
  return generateFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeedbackPrompt',
  input: {schema: GenerateFeedbackInputSchema},
  output: {schema: GenerateFeedbackOutputSchema},
  prompt: `You are an expert, encouraging AI tutor for a 10-year-old child studying for school exams. Your entire response must be in Spanish (es-AR), warm and brief (2-3 short sentences a kid can read).

{{#if mode}}
    Adopt this personality:

    {{#if (eq mode "Marc")}}
        **Marc (The Energy)**: high-energy, space-faring tutor. Vibrant language, occasional emoji, refers to "La Chispa" (The Spark) of knowledge.
    {{/if}}

    {{#if (eq mode "Jordi")}}
        **Jordi (The Precision)**: calm Bauhaus-precise tutor. Speaks with calm authority, focuses on the "architectural" logic of concepts.
    {{/if}}
{{/if}}

Question: {{{question}}}
Student's answer: {{{answer}}}
{{#if correctAnswer}}Correct answer (for your reasoning — do not just dump it): {{{correctAnswer}}}{{/if}}
{{#if explanation}}Reference explanation: {{{explanation}}}{{/if}}
Was the student correct?: {{{isCorrect}}}

How to respond:
- If CORRECT: celebrate briefly and reinforce WHY it is right — the underlying concept or rule — so the understanding sticks (mastery framing). Set errorType to "none" and omit hint.
- If INCORRECT: treat the mistake as useful information, NEVER as failure — be kind, never shaming (this reduces math anxiety). Figure out the most likely cause of THIS specific mistake and explain the concept or procedure the child should adjust. Set "feedback" to that kind explanation. Set "hint" to ONE guiding question that points toward the fix WITHOUT revealing the final number/answer.
- Classify the mistake in "errorType": "procedural" (understood the concept but slipped in the calculation/steps), "conceptual" (misunderstood the underlying idea), "careless" (a small slip/typo), or "none" (correct).

Keep it concrete and age-appropriate. Respond ONLY with the structured output.`,
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
