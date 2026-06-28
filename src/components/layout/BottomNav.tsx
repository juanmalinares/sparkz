'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IconHome, IconArch, IconBolt, IconQuatrefoil, IconProfile } from '@/components/ui/sparkz-icons';

const items = [
  { href: '/', label: 'Inicio', icon: IconHome },
  { href: '/quiz', label: 'Aprender', icon: IconArch },
  { href: '/practica', label: 'Reto', icon: IconBolt },
  { href: '/dashboard', label: 'Premios', icon: IconQuatrefoil },
  { href: '/dashboard', label: 'Perfil', icon: IconProfile },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur border-t border-[color:var(--line)]">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-2">
        {items.map(({ href, label, icon: Icon }, i) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={`${href}-${i}`} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-1.5 transition-colors',
                  isActive ? 'text-mint' : 'text-[color:var(--muted-foreground)] hover:text-ink',
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="font-ui font-bold uppercase tracking-[0.12em] text-[9px]">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
