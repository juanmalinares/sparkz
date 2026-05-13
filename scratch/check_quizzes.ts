
import { getQuizzes } from '../src/lib/db';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function main() {
  try {
    const quizzes = await getQuizzes();
    console.log(`Found ${quizzes.length} quizzes:`);
    quizzes.forEach(q => {
      console.log(`- [${q.id}] ${q.title} (${q.active ? 'Active' : 'Inactive'})`);
    });
  } catch (e) {
    console.error(e);
  }
}

main();
