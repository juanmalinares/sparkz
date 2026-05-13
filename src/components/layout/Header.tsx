'use client';

import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { IconHome, IconLearn, IconProfile, IconQuatrefoil } from '@/components/ui/sparkz-icons';
import { SparkzLogo } from '@/components/ui/SparkzLogo';

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col items-center gap-1 p-2 transition-all',
          isActive ? 'text-electric' : 'text-stone/60 hover:text-stone hover:bg-white/5'
        )}
      >
        <Icon className={cn("w-6 h-6", isActive ? "opacity-100" : "opacity-60")} />
        <span className="sparkz-label">{children}</span>
      </Link>
    );
  };

  return (
    <header className="bg-forest text-stone border-b-2 border-near-black sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <SparkzLogo size={40} fill="var(--electric)" className="transition-transform group-hover:-translate-y-0.5" style={{ filter: 'drop-shadow(2px 2px 0px var(--near-black))' }} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Sparkz
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/" icon={IconHome}>Home</NavLink>
          <NavLink href="/quiz" icon={IconLearn}>Learn</NavLink>
          <NavLink href="/dashboard" icon={IconProfile}>Stats</NavLink>
          {isClient && isAdmin && <NavLink href="/admin" icon={IconQuatrefoil}>Admin</NavLink>}
        </nav>

        {/* User Menu */}
        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 p-0 border-2 border-near-black" style={{ boxShadow: '2px 2px 0 var(--near-black)' }}>
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-electric text-forest font-display font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-forest text-stone border-2 border-near-black rounded-none" style={{ boxShadow: '4px 4px 0 var(--near-black)' }} align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.displayName}</p>
                    <p className="text-xs leading-none text-stone/60">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-near-black" />
                <div className='md:hidden'>
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/">Home</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/quiz">Learn</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/dashboard">Stats</Link></DropdownMenuItem>
                  {isClient && isAdmin && <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/admin">Admin</Link></DropdownMenuItem>}
                  <DropdownMenuSeparator className="bg-near-black" />
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-vermillion focus:bg-vermillion/10 focus:text-vermillion cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-display font-bold">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button onClick={() => router.push('/tutorial')} className="hidden md:inline-flex btn-sparkz-primary bg-electric text-forest border-forest">
                Start Learning
              </Button>
              <div className="md:hidden">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-stone hover:bg-white/10 hover:text-white border-2 border-transparent">
                              <Menu className="h-6 w-6" />
                              <span className="sr-only">Open menu</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-forest text-stone border-2 border-near-black rounded-none" style={{ boxShadow: '4px 4px 0 var(--near-black)' }}>
                          <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/">Home</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/quiz">Learn</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/dashboard">Stats</Link></DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-near-black" />
                          <DropdownMenuItem onClick={() => router.push('/tutorial')} className="focus:bg-white/10 focus:text-white">Start Learning</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
