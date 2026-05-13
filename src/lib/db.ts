
import {db} from '@/lib/firebase';
import type {Quiz, Score, Report, User, AdminDashboardUser} from '@/lib/types';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  runTransaction,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

const quizzesCollection = collection(db, 'quizzes');

export async function getQuizzes(options: {activeOnly?: boolean} = {}): Promise<Quiz[]> {
  const q = options.activeOnly 
    ? query(quizzesCollection, where('active', '==', true))
    : query(quizzesCollection);
  
  const snapshot = await getDocs(q);
  const allQuizzes = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          ...data, 
          id: doc.id,
          createdAt: data.createdAt?.toMillis() || null,
      } as Quiz
  });

  // Sort by creation date descending, handling potential nulls
  allQuizzes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return allQuizzes;
}

export async function getQuizById(id: string): Promise<Quiz | null> {
    const docRef = doc(db, 'quizzes', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
            ...data, 
            id: docSnap.id,
            createdAt: data.createdAt?.toMillis() || null
        } as Quiz;
    } else {
        return null;
    }
}

export async function addQuiz(quiz: Quiz): Promise<void> {
    const docRef = doc(db, 'quizzes', quiz.id);
    await setDoc(docRef, { ...quiz, createdAt: serverTimestamp() });
}

export async function updateQuiz(id: string, updates: Partial<Quiz>): Promise<void> {
    const docRef = doc(db, 'quizzes', id);
    // Firestore's updateDoc can handle nested field updates if you use dot notation,
    // but here we are replacing the whole 'questions' array, which is fine.
    // If we wanted to update a single question, we would need a more complex transaction.
    // For this app, replacing the whole array is acceptable.
    await updateDoc(docRef, updates);
}

export async function deleteQuiz(id: string): Promise<void> {
    const docRef = doc(db, 'quizzes', id);
    await deleteDoc(docRef);
}


// USER DATA FUNCTIONS
export async function getUserData(user: FirebaseUser): Promise<{scores: Score[], highScore: number}> {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    
    const userData = {
        displayName: user.displayName,
        email: user.email,
    };

    if (docSnap.exists()) {
        const data = docSnap.data();
        if(data.displayName !== user.displayName || data.email !== user.email){
             await updateDoc(userDocRef, userData);
        }
        const scores = (data.scores || []).sort((a: Score, b: Score) => b.date - a.date);
        return {
            scores: scores,
            highScore: data.highScore || 0,
        };
    } else {
        await setDoc(userDocRef, { ...userData, scores: [], highScore: 0 });
        return { scores: [], highScore: 0 };
    }
}

export async function addUserScore(user: User, newScore: Score): Promise<{newScores: Score[], newHighScore: number}> {
    const userDocRef = doc(db, "users", user.uid);

    try {
        const { newScores, newHighScore } = await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            
            const userData = {
                displayName: user.displayName,
                email: user.email,
            };

            if (!userDoc.exists()) {
                const newPercentage = Math.round((newScore.score / newScore.totalQuestions) * 100);
                transaction.set(userDocRef, { ...userData, scores: [newScore], highScore: newPercentage });
                return { newScores: [newScore], newHighScore: newPercentage };
            }

            const data = userDoc.data();
            const currentScores: Score[] = data.scores || [];
            const currentHighScore: number = data.highScore || 0;

            const updatedScores = [newScore, ...currentScores].slice(0, 50); // Store up to 50 recent scores
            
            const newPercentage = Math.round((newScore.score / newScore.totalQuestions) * 100);
            const updatedHighScore = Math.max(currentHighScore, newPercentage);

            transaction.update(userDocRef, { ...userData, scores: updatedScores, highScore: updatedHighScore });
            
            return { newScores: updatedScores, newHighScore: updatedHighScore };
        });

        return { newScores, newHighScore };
    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
}

export async function getAllUserStats(): Promise<AdminDashboardUser[]> {
  const usersCollectionRef = collection(db, 'users');
  const snapshot = await getDocs(usersCollectionRef);

  const usersData = snapshot.docs.map(doc => {
    const data = doc.data();
    const scores: Score[] = (data.scores || []).sort((a: Score, b: Score) => b.date - a.date);
    return {
      uid: doc.id,
      displayName: data.displayName || 'Usuario Anónimo',
      email: data.email || null,
      highScore: data.highScore || 0,
      quizzesPlayed: scores.length,
      lastPlayed: scores.length > 0 ? scores[0].date : null
    };
  });

  return usersData.filter(user => user.quizzesPlayed > 0);
}


// REPORT FUNCTIONS
const reportsCollection = collection(db, 'reports');

export async function addReport(reportData: Omit<Report, 'id' | 'reportedAt' | 'status'>): Promise<void> {
    await addDoc(reportsCollection, {
        ...reportData,
        status: 'new',
        reportedAt: serverTimestamp(),
    });
}

export async function getReports(options: {newOnly?: boolean} = {}): Promise<Report[]> {
    let q;
    if (options.newOnly) {
        // Query by status first to avoid needing a composite index, then sort in code.
        q = query(reportsCollection, where('status', '==', 'new'));
    } else {
        q = query(reportsCollection, orderBy('reportedAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    
    const reports = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            reportedAt: data.reportedAt?.toDate().getTime() || Date.now(),
        } as Report;
    });

    // If we fetched only new reports, they are not sorted yet. Sort them now.
    if (options.newOnly) {
      reports.sort((a, b) => b.reportedAt - a.reportedAt);
    }

    return reports;
}

export async function updateReport(id: string, updates: Partial<Report>): Promise<void> {
    const docRef = doc(db, 'reports', id);
    await updateDoc(docRef, updates);
}

    