/**
 * Sube los módulos de currículum a Firestore.
 *
 * Uso (las credenciales las provee el usuario, nunca se guardan en el repo):
 *   SEED_ADMIN_PASSWORD='tu-password' npm run seed
 *
 * El email se toma de NEXT_PUBLIC_ADMIN_EMAIL en .env.local. El script inicia
 * sesión como ese admin (que es quien tiene permiso de escritura según
 * firestore.rules) y hace upsert por id, así que es seguro re-ejecutarlo.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { matematica5C1 } from '../src/content/curriculum/matematica-5-c1';

async function main() {
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('Falta NEXT_PUBLIC_ADMIN_EMAIL (en .env.local) o SEED_ADMIN_PASSWORD (variable de entorno).');
    console.error("Ejemplo: SEED_ADMIN_PASSWORD='tu-clave' npm run seed");
    process.exit(1);
  }

  const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, email, password);
  console.log(`Autenticado como ${email}`);

  const modules = [...matematica5C1];
  for (const m of modules) {
    await setDoc(doc(db, 'quizzes', m.id), { ...m, createdAt: serverTimestamp() });
    console.log(`  ✔ ${m.id} — ${m.title} (${m.questions.length} preguntas)`);
  }
  console.log(`Listo: ${modules.length} módulo(s) cargado(s) en Firestore.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error al cargar el currículum:', err?.message || err);
  process.exit(1);
});
