import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        ui: ['DM Sans', 'sans-serif'],
        label: ['DM Sans', 'sans-serif'],
      },
      colors: {
        // ── Sparkz Primary Palette (Hex) ────────────────────────
        electric:   '#C5E830',
        forest:     '#0D2318',
        cobalt:     '#1A2FBF',
        vermillion: '#E5311D',
        amber:      '#F5C400',
        obsidian:   '#111827',
        cream:      '#F6F2EC',
        teal:       '#00B4A6',
        violet:     '#7C3AFD',
        stone:      '#E5E1DC',
        slate:      '#6B7280',
        'near-black': '#0A0D12',
        // ── shadcn/ui semantic roles ────────────────────────────
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input:  'var(--input)',
        ring:   'var(--ring)',
      },
      borderRadius: {
        pill:   '999px',
        card:   '0px',
        action: '0px',
        lg:     'var(--radius)',
        md:     'calc(var(--radius) - 2px)',
        sm:     'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'sparkz-card':   '3px 3px 0 var(--obsidian)',
        'sparkz-card-lg':'4px 4px 0 var(--obsidian)',
        'sparkz-pill':   '2px 2px 0 var(--obsidian)',
      },
      keyframes: {
        // ── Accordion (keep for shadcn) ─────────────────────────
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        // ── Sparkz answer feedback ──────────────────────────────
        'scale-pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.08)' },
          '70%':  { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-4px)' },
          '40%':      { transform: 'translateX(4px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        // ── Reward badge drop ───────────────────────────────────
        'badge-drop': {
          '0%':   { transform: 'translateY(-120px) scale(0.8)', opacity: '0' },
          '60%':  { transform: 'translateY(12px) scale(1.04)',  opacity: '1' },
          '80%':  { transform: 'translateY(-6px) scale(0.98)',  opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)',        opacity: '1' },
        },
        // ── Geometric background drift (idle) ───────────────────
        'geo-drift': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%':      { transform: 'translate(6px, -8px) rotate(2deg)' },
          '66%':      { transform: 'translate(-4px, 6px) rotate(-1deg)' },
        },
        // ── Progress bar overshoot ──────────────────────────────
        'progress-fill': {
          '0%':   { transform: 'scaleX(0)', transformOrigin: 'left' },
          '85%':  { transform: 'scaleX(1.03)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        // ── Button press ────────────────────────────────────────
        'btn-press': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(0.96)' },
        },
        // ── Amber speed glow ────────────────────────────────────
        'amber-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 196, 0, 0)' },
          '50%':      { boxShadow: '0 0 16px 4px rgba(245, 196, 0, 0.45)' },
        },
      },
      animation: {
        'accordion-down':   'accordion-down 0.2s ease-out',
        'accordion-up':     'accordion-up 0.2s ease-out',
        'scale-pop':        'scale-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake':            'shake 0.4s ease-in-out',
        'badge-drop':       'badge-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'geo-drift':        'geo-drift 8s ease-in-out infinite',
        'geo-drift-slow':   'geo-drift 14s ease-in-out infinite',
        'progress-fill':    'progress-fill 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
        'btn-press':        'btn-press 0.15s ease-out',
        'amber-pulse':      'amber-pulse 0.8s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
