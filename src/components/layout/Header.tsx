'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { SparkzLogo } from '@/components/ui/SparkzLogo';

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-base/90 backdrop-blur border-b border-[color:var(--line)] sticky top-0 z-40">
      <div className="mx-auto max-w-lg flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2 group">
          <SparkzLogo size={30} className="transition-transform group-hover:-translate-y-0.5" />
          <span className="font-display text-2xl tracking-tight text-ink leading-none">Sparkz</span>
        </Link>

        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-white/10">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-brand text-ink font-display">
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-surface text-ink border border-[color:var(--line)]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-ink">{user.displayName}</p>
                    <p className="text-xs leading-none text-[color:var(--muted-foreground)]">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[color:var(--line)]" />
                {isClient && isAdmin && (
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-ink cursor-pointer">
                    <Link href="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-pop focus:bg-pop/10 focus:text-pop cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-display">Salir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/tutorial')} className="btn-sparkz-primary text-sm px-5 py-2">
              Empezar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
