
'use client';

import type {Score, User} from '@/lib/types';
import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {auth} from '@/lib/firebase';
import {onAuthStateChanged, User as FirebaseUser, signOut as authSignOut} from 'firebase/auth';
import {getUserData, addUserScore as dbAddUserScore} from '@/lib/db';

interface UserContextType {
  user: User | null;
  scores: Score[];
  highScore: number;
  loading: boolean;
  addScore: (score: Score) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [highScore, setHighScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const appUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(appUser);
        
        const userData = await getUserData(firebaseUser);
        if (userData) {
          setScores(userData.scores);
          setHighScore(userData.highScore);
        }
      } else {
        setUser(null);
        setScores([]);
        setHighScore(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addScore = async (newScore: Score) => {
    if (!user) throw new Error("El usuario debe iniciar sesión para agregar un puntaje.");
    
    const {newScores, newHighScore} = await dbAddUserScore(user, newScore);
    setScores(newScores);
    setHighScore(newHighScore);
  };

  const logout = async () => {
    await authSignOut(auth);
  };

  return (
    <UserContext.Provider value={{user, scores, highScore, loading, addScore, logout}}>
      {children}
    </UserContext.Provider>
  );
};
