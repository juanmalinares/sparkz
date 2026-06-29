import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { IconQuatrefoil, IconBolt, IconSparkle } from '@/components/ui/sparkz-icons';
import { SparkzLogo } from '@/components/ui/SparkzLogo';

const FEATURES = [
  { Icon: IconQuatrefoil, accent: '#6E6BF0', title: 'Precisión',     text: 'Retos paso a paso que construyen conocimiento real, sin relleno.' },
  { Icon: IconBolt,       accent: '#1FE0A6', title: 'Energía',       text: 'Feedback de IA al instante que te guía y te mantiene en racha.' },
  { Icon: IconSparkle,    accent: '#F4C24A', title: 'Descubrimiento', text: 'Desbloqueá logros que reflejan tu progreso de verdad.' },
];

export default function LandingPage() {
  return (
    <div className="pb-6 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-card bg-brand p-7 lg:p-14" style={{ boxShadow: 'var(--glow-brand)' }}>
        <SparkzLogo size={230} fill="#ffffff" className="absolute -right-12 -top-16 opacity-[0.12] pointer-events-none" />
        <span className="sparkz-label text-ink/70 relative z-10">Sparkz · Edades 6–10</span>
        <h1 className="font-display text-[44px] lg:text-[68px] leading-[0.9] text-ink mt-2 relative z-10">
          Aprendé<br />jugando.
        </h1>
        <p className="font-body text-ink/85 mt-4 max-w-md lg:max-w-lg relative z-10 leading-relaxed">
          Lecciones cortas, feedback al instante y recompensas. La chispa que llevás adentro, lista para brillar.
        </p>
        <Link
          href="/quiz"
          className="relative z-10 inline-flex items-center gap-2 mt-6 bg-base text-ink font-display uppercase tracking-wide px-7 py-3.5 rounded-pill text-lg transition-transform active:scale-[0.96]"
        >
          Empezar a aprender <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features */}
      <section>
        <span className="sparkz-label text-[color:var(--muted-foreground)] block mb-4">Por qué Sparkz</span>
        <div className="grid gap-4 lg:grid-cols-3">
        {FEATURES.map(f => (
          <div
            key={f.title}
            className="sparkz-card p-5 flex items-start gap-4"
            style={{ '--accent': f.accent } as CSSProperties}
          >
            <div
              className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}
            >
              <f.Icon className="w-6 h-6" color="var(--accent)" />
            </div>
            <div>
              <h3 className="font-display text-xl text-ink leading-none">{f.title}</h3>
              <p className="font-body text-[15px] text-[color:var(--muted-foreground)] mt-1.5 leading-relaxed">{f.text}</p>
            </div>
          </div>
        ))}
        </div>
      </section>
    </div>
  );
}
