import type {Metadata} from 'next';
import './globals.css';
import {cn} from '@/lib/utils';
import {UserProvider} from '@/context/UserProvider';
import {Toaster} from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sparkz — Learn Like a Champion',
  description: 'A premium kids education app for ages 6–10. Bauhaus design, manga energy, real learning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isConfigMissing = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
                          !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
                          !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
                          !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
                          !process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
                          !process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  let bodyContent;

  if (isConfigMissing) {
    bodyContent = (
      <div className="flex items-center justify-center min-h-screen bg-obsidian p-4">
        <div
          className="w-full max-w-xl bg-card rounded-card border-2 border-vermillion p-8"
          style={{ boxShadow: '4px 4px 0 #E5311D' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="w-10 h-10 text-vermillion flex-shrink-0" />
            <div>
              <h2 className="font-display font-bold text-xl text-obsidian">Firebase Config Missing</h2>
              <p className="text-slate text-sm font-body">The app can't connect to the database.</p>
            </div>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm font-body text-foreground">
            <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-vermillion">Firebase Console</a> and select your project.</li>
            <li>Navigate to <strong>Project Settings</strong> → <strong>General</strong>.</li>
            <li>Copy the SDK config values into your <code className="bg-stone px-1 rounded">.env.local</code> file.</li>
            <li><strong>Restart the dev server</strong> after saving the file.</li>
          </ol>
        </div>
      </div>
    );
  } else {
    bodyContent = (
      <UserProvider>
        <Header />
        <main className="flex-grow w-full max-w-lg md:max-w-3xl lg:max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-28">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </UserProvider>
    );
  }

  return (
    <html lang="es-AR" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col'
        )}
        style={{ background: 'var(--background)' }}
        suppressHydrationWarning
      >
        {bodyContent}
      </body>
    </html>
  );
}
