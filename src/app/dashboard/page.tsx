'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getQuizzes } from '@/lib/db';
import type { Quiz } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconSquare, IconCircle, IconTriangle, IconDiamond } from '@/components/ui/sparkz-icons';

export default function DashboardPage() {
  const { user, highScore, scores, loading: userLoading } = useUser();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/tutorial');
    } else if(user) {
      const fetchQuizData = async () => {
        setDataLoading(true);
        const allQuizzes = await getQuizzes();
        setQuizzes(allQuizzes);
        setDataLoading(false);
      }
      fetchQuizData();
    }
  }, [user, userLoading, router]);

  const stats = useMemo(() => {
    if (scores.length === 0 || quizzes.length === 0) {
      return {
        quizzesCompletados: 0,
        puntuacionPromedio: 0,
        totalCorrectas: 0,
        totalPreguntas: 0,
        recentChartData: [],
        categoryPerformance: {},
        strengths: [],
        weaknesses: [],
        categoryBlocks: [],
      };
    }

    const quizzesCompletados = scores.length;
    const totalCorrectas = scores.reduce((acc, s) => acc + s.score, 0);
    const totalPreguntas = scores.reduce((acc, s) => acc + s.totalQuestions, 0);
    const puntuacionPromedio = totalPreguntas > 0 ? Math.round((totalCorrectas / totalPreguntas) * 100) : 0;

    const recentScores = scores.slice(0, 10);
    const recentChartData = recentScores.map(s => ({
      name: s.quizTitle.length > 15 ? s.quizTitle.substring(0, 12) + '...' : s.quizTitle,
      score: s.score,
      percentage: Math.round((s.score / s.totalQuestions) * 100),
    })).reverse();

    const quizTopicMap = new Map(quizzes.map(q => [q.id, q.topic]));
    const categoryPerformance: { [key: string]: { correct: number, total: number, accuracy: number } } = {};

    scores.forEach(score => {
      const topic = quizTopicMap.get(score.quizId) || 'Desconocido';
      if (!categoryPerformance[topic]) {
        categoryPerformance[topic] = { correct: 0, total: 0, accuracy: 0 };
      }
      categoryPerformance[topic].correct += score.score;
      categoryPerformance[topic].total += score.totalQuestions;
    });
    
    for (const cat in categoryPerformance) {
        const { correct, total } = categoryPerformance[cat];
        categoryPerformance[cat].accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    }

    const strengths = Object.entries(categoryPerformance).filter(([, data]) => data.accuracy >= 70);
    const weaknesses = Object.entries(categoryPerformance).filter(([, data]) => data.accuracy < 50);

    // Map categories to geometric shapes
    const shapes = [IconSquare, IconCircle, IconTriangle, IconDiamond];
    const colors = ['bg-cobalt', 'bg-amber', 'bg-teal', 'bg-vermillion', 'bg-violet'];
    
    const categoryBlocks = Object.entries(categoryPerformance).map(([name, data], index) => ({
        name,
        accuracy: data.accuracy,
        Icon: shapes[index % shapes.length],
        colorClass: colors[index % colors.length],
    }));

    return {
      quizzesCompletados,
      puntuacionPromedio,
      totalCorrectas,
      totalPreguntas,
      recentChartData,
      categoryPerformance,
      strengths,
      weaknesses,
      categoryBlocks,
    };
  }, [scores, quizzes]);


  if (userLoading || dataLoading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-16 h-16 animate-spin text-vermillion" />
      </div>
    );
  }

  // Dummy streak data for visual demo
  const streakData = ['missed', 'missed', 'good', 'great', 'great', 'good', 'missed', 'good', 'great', 'great', 'great', 'great'];

  return (
    <div className="space-y-8 pb-10">
      
      <div className="bg-obsidian text-cream p-8 rounded-card -mx-4 sm:mx-0 shadow-sparkz-card border-2 border-obsidian relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">{user.displayName}</h1>
          <p className="text-slate font-body mb-8">Daily Goal: Keep the streak alive.</p>
          
          <div className="flex flex-col gap-2">
              <span className="sparkz-label text-slate">12-DAY STREAK</span>
              <div className="flex flex-wrap gap-2">
                  {streakData.map((status, i) => (
                      <div 
                          key={i} 
                          className={`w-6 h-6 border-2 border-obsidian rounded-sm ${status === 'great' ? 'bg-amber shadow-[1px_1px_0_#111827]' : status === 'good' ? 'bg-teal shadow-[1px_1px_0_#111827]' : 'bg-obsidian/50'}`}
                      />
                  ))}
              </div>
          </div>
        </div>
      </div>
      
      {/* Stat Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="sparkz-card p-6 flex flex-col gap-2 relative overflow-hidden">
            <IconSquare className="w-8 h-8 text-obsidian absolute -right-2 -bottom-2 opacity-10" />
            <span className="sparkz-label text-slate">QUIZZES COMPLETED</span>
            <span className="text-4xl font-display font-bold text-obsidian">{stats.quizzesCompletados}</span>
        </div>
        <div className="sparkz-card p-6 flex flex-col gap-2 relative overflow-hidden">
            <IconCircle className="w-8 h-8 text-obsidian absolute -right-2 -bottom-2 opacity-10" />
            <span className="sparkz-label text-slate">AVERAGE SCORE</span>
            <span className="text-4xl font-display font-bold text-obsidian">{stats.puntuacionPromedio}%</span>
        </div>
        <div className="sparkz-card p-6 flex flex-col gap-2 relative overflow-hidden">
            <IconTriangle className="w-8 h-8 text-obsidian absolute -right-2 -bottom-2 opacity-10" />
            <span className="sparkz-label text-slate">ACCURACY</span>
            <span className="text-4xl font-display font-bold text-obsidian">{stats.totalPreguntas > 0 ? Math.round((stats.totalCorrectas / stats.totalPreguntas) * 100) : 0}%</span>
        </div>
         <div className="sparkz-card p-6 flex flex-col gap-2 relative overflow-hidden bg-amber border-obsidian">
            <IconDiamond className="w-8 h-8 text-obsidian absolute -right-2 -bottom-2 opacity-10" />
            <span className="sparkz-label text-obsidian">HIGH SCORE</span>
            <span className="text-4xl font-display font-bold text-obsidian">{highScore}%</span>
        </div>
      </div>

        <Tabs defaultValue="general" className="mt-8">
            <TabsList className="w-full justify-start border-b-2 border-stone rounded-none bg-transparent p-0 mb-6 gap-6 h-auto">
                <TabsTrigger value="general" className="sparkz-label text-slate data-[state=active]:text-obsidian data-[state=active]:border-b-4 data-[state=active]:border-amber rounded-none pb-2 bg-transparent shadow-none data-[state=active]:bg-transparent">GENERAL</TabsTrigger>
                <TabsTrigger value="category" className="sparkz-label text-slate data-[state=active]:text-obsidian data-[state=active]:border-b-4 data-[state=active]:border-amber rounded-none pb-2 bg-transparent shadow-none data-[state=active]:bg-transparent">BY SUBJECT</TabsTrigger>
                <TabsTrigger value="history" className="sparkz-label text-slate data-[state=active]:text-obsidian data-[state=active]:border-b-4 data-[state=active]:border-amber rounded-none pb-2 bg-transparent shadow-none data-[state=active]:bg-transparent">HISTORY</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="pt-2">
                 <div className="sparkz-card p-6">
                    <h3 className="font-display font-bold text-xl mb-6">Recent Quizzes</h3>
                    {stats.recentChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={stats.recentChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#111827" fontSize={12} tickLine={false} axisLine={{stroke: '#E5E1DC', strokeWidth: 2}} fontFamily="DM Sans" fontWeight={700} />
                            <YAxis stroke="#111827" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} fontFamily="DM Sans" fontWeight={700} />
                            <Tooltip 
                                cursor={{fill: '#E5E1DC', opacity: 0.5}}
                                contentStyle={{ 
                                    background: '#111827', 
                                    border: '2px solid #111827',
                                    borderRadius: '4px',
                                    color: '#F6F2EC',
                                    fontFamily: 'DM Sans',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    boxShadow: '3px 3px 0 #F5C400'
                                }}
                                formatter={(value, name, props) => [`${value}%`, "SCORE"]}
                            />
                            <Bar dataKey="percentage" radius={[0, 0, 0, 0]}>
                                {stats.recentChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#1A2FBF" />
                                ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-slate font-body py-10">Complete a quiz to see your performance.</p>
                    )}
                </div>
            </TabsContent>
            
            <TabsContent value="category" className="pt-2">
                 <div className="grid gap-6 md:grid-cols-3">
                    {stats.categoryBlocks.length > 0 ? stats.categoryBlocks.map((block) => (
                        <div key={block.name} className="sparkz-card p-6 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 ${block.colorClass} border-2 border-obsidian rounded-action flex items-center justify-center mb-4`} style={{ boxShadow: '2px 2px 0 #111827' }}>
                                <block.Icon className="w-8 h-8 text-white" />
                            </div>
                            <span className="sparkz-label text-slate mb-1">{block.name}</span>
                            <span className="text-3xl font-display font-bold text-obsidian">{block.accuracy}%</span>
                        </div>
                    )) : (
                        <p className="col-span-3 text-center text-slate font-body py-10">No subject data available.</p>
                    )}
                 </div>
            </TabsContent>
            
            <TabsContent value="history" className="pt-2">
                 <div className="sparkz-card p-0 overflow-hidden">
                        {scores.length > 0 ? (
                            <ScrollArea className="h-[400px]">
                                <div className="divide-y-2 divide-stone">
                                {scores.map((s, index) => (
                                    <div key={index} className="flex justify-between items-center p-6 hover:bg-stone/20 transition-colors">
                                        <div>
                                            <p className="font-display font-bold text-lg text-obsidian">{s.quizTitle}</p>
                                            <p className="text-sm font-body text-slate">{format(new Date(s.date), "PPP p", { locale: es })}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-obsidian text-amber font-display font-bold px-3 py-1 rounded-action border-2 border-obsidian" style={{ boxShadow: '2px 2px 0 #F5C400' }}>
                                                {s.score}/{s.totalQuestions}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <p className="text-center text-slate font-body py-10">No history available.</p>
                        )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
