
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { SparkzLogo } from '@/components/ui/SparkzLogo';

function LoginForm({ onForgotPassword }: { onForgotPassword: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/quiz');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error al iniciar sesión",
                description: "Email o contraseña incorrectos. Por favor, intentá de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
             <div className="text-right">
                <Button type="button" variant="link" size="sm" className="p-0 h-auto" onClick={onForgotPassword}>
                    ¿Olvidaste tu contraseña?
                </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ingresar
          </Button>
        </form>
    )
}

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
             toast({
                variant: "destructive",
                title: "Contraseña muy corta",
                description: "La contraseña debe tener al menos 6 caracteres.",
            });
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });
            await userCredential.user.reload();
            toast({
                title: "¡Cuenta creada!",
                description: "Bienvenido a Sparkz Kids. Redirigiendo...",
            });
            router.push('/quiz');
        } catch (error: any) {
             let description = "Ocurrió un error inesperado. Por favor, intentá de nuevo.";
             switch (error.code) {
                case 'auth/email-already-in-use':
                    description = "Este email ya está en uso. Por favor, intentá con otro o iniciá sesión.";
                    break;
                case 'auth/invalid-email':
                    description = "El formato del email no es válido. Por favor, revisalo.";
                    break;
                case 'auth/weak-password':
                    description = "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
                    break;
                default:
                    console.error("Error de registro no manejado:", error);
                    break;
             }
             toast({
                variant: "destructive",
                title: "Error al crear cuenta",
                description: description,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignUp} className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="signup-username">Nombre de usuario</Label>
            <Input
              id="signup-username"
              type="text"
              placeholder="ej. SuperEstudiante"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Contraseña (mín. 6 caracteres)</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Cuenta
          </Button>
        </form>
    )
}

function ResetPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: "Email de recupero enviado",
                description: "Revisá tu casilla de correo (también en spam) para ver las instrucciones.",
            });
            onBackToLogin();
        } catch (error: any) {
            let description = "Ocurrió un error inesperado. Por favor, intentá de nuevo.";
            if (error.code === 'auth/user-not-found') {
                description = "No se encontró ninguna cuenta con ese email. Verificá si lo escribiste bien.";
            }
            toast({
                variant: "destructive",
                title: "Error al enviar el email",
                description: description,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
                <CardTitle>Restablecer Contraseña</CardTitle>
                <CardDescription>
                    Ingresá tu email y te enviaremos un enlace para que puedas crear una nueva contraseña.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                            id="reset-email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Email de Recupero
                    </Button>
                </form>
            </CardContent>
            <CardContent className="mt-4 text-center">
                 <Button variant="link" onClick={onBackToLogin}>Volver a Iniciar Sesión</Button>
            </CardContent>
        </Card>
    );
}


export default function AuthPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);


  useEffect(() => {
    if (!loading && user) {
      router.push('/quiz');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold">Cargando...</h1>
            <p className="text-muted-foreground">Verificando tu sesión...</p>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      {isResetting ? (
        <ResetPasswordForm onBackToLogin={() => setIsResetting(false)} />
      ) : (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-4">
                    <SparkzLogo size={96} />
                </div>
                <CardTitle>
                    <div className="flex flex-col items-center leading-tight">
                        <span className="sparkz-kids-sparkz text-4xl font-bold font-headline">
                            {'Sparkz'.split('').map((letter, index) => (
                                <span key={index}>{letter}</span>
                            ))}
                        </span>
                        <span className="sparkz-kids-kids text-4xl font-bold font-headline">
                            {'Kids'.split('').map((letter, index) => (
                                <span key={index}>{letter}</span>
                            ))}
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Ingresar</TabsTrigger>
                        <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="pt-4">
                        <LoginForm onForgotPassword={() => setIsResetting(true)} />
                    </TabsContent>
                    <TabsContent value="signup" className="pt-4">
                        <SignUpForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
