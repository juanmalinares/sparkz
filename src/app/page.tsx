'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { IconArch, IconBolt, IconQuatrefoil } from '@/components/ui/sparkz-icons';
import { SparkzLogo } from '@/components/ui/SparkzLogo';

// The home is a launchpad into the app's three areas.
const HUB = [
  { href: '/quiz',      Icon: IconArch,       accent: '#6E6BF0', title: 'Aprender', text: 'Lecciones por materia para el cuatrimestral.' },
  { href: '/practica',  Icon: IconBolt,       accent: '#F2674C', title: 'Reto',     text: 'Práctica de cálculo al instante.' },
  { href: '/dashboard', Icon: IconQuatrefoil, accent: '#F4C24A', title: 'Premios',  text: 'Mirá tu progreso y tus récords.' },
];

export default function HomePage() {
  const { user } = useUser();
  const name = user?.displayName?.split(' ')[0];

  return (
    <div className="pb-6 space-y-8">
      {/* Hero — greets the learner and routes them into today's session */}
      <section className="relative overflow-hidden rounded-card bg-brand p-7 lg:p-14" style={{ boxShadow: 'var(--glow-brand)' }}>
        <SparkzLogo size={230} fill="#ffffff" className="absolute -right-12 -top-16 opacity-[0.12] pointer-events-none" />
        <span className="sparkz-label text-ink/70 relative z-10">
          {name ? 'Listo para tu chispa de hoy' : 'Sparkz · Edades 6–10'}
        </span>
        <h1 className="font-display text-[44px] lg:text-[64px] leading-[0.9] text-ink mt-2 relative z-10">
          {name ? <>¡Hola,<br />{name}!</> : <>Aprendé<br />jugando.</>}
        </h1>
        <p className="font-body text-ink/85 mt-4 max-w-md lg:max-w-lg relative z-10 leading-relaxed">
          {name
            ? 'Seguí preparando el cuatrimestral. Elegí por dónde arrancar hoy.'
            : 'Lecciones cortas, feedback al instante y recompensas. La chispa que llevás adentro, lista para brillar.'}
        </p>
        <Link
          href="/quiz"
          className="relative z-10 inline-flex items-center gap-2 mt-6 bg-base text-ink font-display uppercase tracking-wide px-7 py-3.5 rounded-pill text-lg transition-transform active:scale-[0.96]"
        >
          {name ? 'Seguí aprendiendo' : 'Empezar a aprender'} <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Hub — quick access to the three sections */}
      <section>
        <span className="sparkz-label text-[color:var(--muted-foreground)] block mb-4">
          {name ? 'Tus secciones' : 'Explorá Sparkz'}
        </span>
        <div className="grid gap-4 sm:grid-cols-3">
          {HUB.map(h => (
            <Link key={h.href} href={h.href} className="group block h-full" style={{ '--accent': h.accent } as CSSProperties}>
              <article className="sparkz-card h-full p-5 flex flex-col gap-3 transition-all duration-200
                                  group-hover:-translate-y-1 group-hover:border-[color:var(--accent)]
                                  group-hover:shadow-[0_0_30px_-8px_var(--accent)]">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl grid place-items-center"
                       style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}>
                    <h.Icon className="w-6 h-6" color="var(--accent)" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-[color:var(--accent)] transition-transform group-hover:translate-x-0.5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink leading-none">{h.title}</h3>
                  <p className="font-body text-[14px] text-[color:var(--muted-foreground)] mt-1.5 leading-relaxed">{h.text}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
