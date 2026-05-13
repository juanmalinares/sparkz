import Link from 'next/link';
import { GeometricField } from '@/components/ui/geometric-field';
import { IconQuatrefoil, IconBolt, IconSparkle, IconArch } from '@/components/ui/sparkz-icons';
import { cn } from '@/lib/utils';
import { SparkzLogo } from '@/components/ui/SparkzLogo';

const FeatureCard = ({ icon: Icon, title, description, colorClass }: { icon: any, title: string, description: string, colorClass: string }) => (
    <div className="sparkz-card p-8 flex flex-col items-center text-center relative overflow-hidden group transition-transform hover:-translate-y-1">
        <div className={cn("w-16 h-16 flex items-center justify-center mb-6 border-2 border-obsidian", colorClass)} style={{ boxShadow: '3px 3px 0 var(--obsidian)' }}>
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-2xl mb-3 text-obsidian uppercase tracking-tight">{title}</h3>
        <p className="font-body text-slate text-sm leading-relaxed">{description}</p>
    </div>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen -mt-8 -mx-4 pb-20 bg-forest text-cream flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-4 overflow-hidden flex-shrink-0 border-b-4 border-near-black">
                <GeometricField variant="dark" density="high" className="z-0" />
                
                <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl">
                    <div className="flex-1 text-left">
                        <span className="sparkz-label text-electric mb-4 block tracking-[0.3em]">00 · IDENTIDAD</span>
                        <h1 className="font-display font-bold text-7xl md:text-[100px] leading-[0.85] mb-8 text-white tracking-tighter">
                            La chispa<br />
                            vive en<br />
                            <span className="text-electric">el espacio.</span>
                        </h1>
                        <p className="font-body text-xl text-stone/80 max-w-md mb-10 leading-relaxed">
                            A premium interactive experience for curious minds. Bauhaus precision meets space-age discovery.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/tutorial" className="btn-sparkz-primary bg-electric text-forest border-forest text-lg px-10 py-5">
                                START LEARNING
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:grid w-[400px] h-[400px] bg-electric relative grid-cols-4 grid-rows-4 p-5 border-4 border-near-black" style={{ boxShadow: '8px 8px 0 var(--near-black)' }}>
                        {[...Array(16)].map((_, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "transition-all duration-500",
                                    i % 3 === 0 ? 'bg-forest' : 'bg-transparent',
                                    i % 2 === 0 ? 'rounded-full scale-75' : 'rounded-none'
                                )} 
                            />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <SparkzLogo size={120} fill="white" className="opacity-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 container mx-auto px-4 -mt-12 max-w-6xl">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={IconQuatrefoil}
                        colorClass="bg-cobalt text-white"
                        title="Precision"
                        description="Structured challenges designed to build real knowledge, step by step, with zero fluff."
                    />
                    <FeatureCard 
                        icon={IconBolt}
                        colorClass="bg-electric text-forest"
                        title="Energy"
                        description="Instant AI feedback that guides your growth and keeps your momentum alive."
                    />
                    <FeatureCard 
                        icon={IconSparkle}
                        colorClass="bg-vermillion text-white"
                        title="Discovery"
                        description="Unlock achievements that reflect true mastery. Premium rewards for premium effort."
                    />
                </div>
            </section>
        </div>
    )
}
