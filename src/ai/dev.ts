import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/generate-feedback.ts';
import '@/ai/flows/generate-audio.ts';
