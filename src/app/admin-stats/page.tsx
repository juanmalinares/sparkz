
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lock, Trophy, PlayCircle, Calendar, AlertTriangle } from 'lucide-react';
import type { AdminDashboardUser } from '@/lib/types';
import { getAllUserStats } from '@/lib/db';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AdminStatsPage() {
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState<AdminDashboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = !userLoading && user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          const userStats = await getAllUserStats();
          setStats(userStats);
        } catch (error) {
          console.error("Failed to load user stats:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStats();
    }
  }, [isAdmin]);

  if (userLoading || (isAdmin && isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">{userLoading ? 'Verificando acceso...' : 'Cargando estadísticas de usuarios...'}</p>
      </div>
    );
  }

  if (!isAdmin) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Lock className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground max-w-md">
            Esta página es solo para administradores.
        </p>

        <Card className="mt-6 p-4 text-left text-sm bg-secondary/50 border-border w-full max-w-md">
            <CardHeader className="p-2">
                <CardTitle className="text-base">Estado de la Verificación</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
                <p><strong>Email actual:</strong> {user ? `'${user.email}'` : 'No autenticado'}</p>
                <p><strong>Email Admin esperado:</strong> {adminEmail ? `'${adminEmail}'` : '(No configurado)'}</p>

                {!adminEmail && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>¡Acción Requerida!</AlertTitle>
                        <AlertDescription>
                            La variable de entorno <code>NEXT_PUBLIC_ADMIN_EMAIL</code> no está configurada.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

        <Button asChild className="mt-6">
            <Link href="/quiz">Volver a los Quizzes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline">Estadísticas de Usuarios</h1>
      <p className="text-muted-foreground">Un resumen del rendimiento de todos los usuarios que han completado al menos un quiz.</p>

      {stats.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">Todavía no hay datos de usuarios para mostrar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((userStat) => (
            <Card key={userStat.uid} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>{userStat.displayName}</CardTitle>
                <CardDescription>{userStat.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold">{userStat.highScore}%</p>
                    <p className="text-xs text-muted-foreground">Puntuación más alta</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">{userStat.quizzesPlayed}</p>
                    <p className="text-xs text-muted-foreground">Quizzes jugados</p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-accent" />
                  <div>
                    <p className="font-semibold">
                      {userStat.lastPlayed ? formatDistanceToNow(new Date(userStat.lastPlayed), { addSuffix: true, locale: es }) : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">Última partida</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
