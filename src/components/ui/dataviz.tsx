'use client';

import { useId } from 'react';

/* ────────────────────────────────────────────────────────────────
   Sparkz V3.0 dataviz — "instrument panel" graphic language.
   Hatched bars, radial tick gauge, connected badges.
   All SVG, themeable via props (accept CSS vars or hex).
   ──────────────────────────────────────────────────────────────── */

export interface BarDatum { label: string; v: number; }

export function HatchBars({
  data,
  active = -1,
  color = '#6E6BF0',
  labelColor = 'rgba(255,255,255,0.6)',
  tagBg = '#14161A',
  tagColor = '#ffffff',
  height = 150,
  valueFmt = (v: number) => String(v),
}: {
  data: BarDatum[];
  active?: number;
  color?: string;
  labelColor?: string;
  tagBg?: string;
  tagColor?: string;
  height?: number;
  valueFmt?: (v: number) => string;
}) {
  const uid = useId().replace(/[:]/g, '');
  const n = Math.max(data.length, 1);
  const slot = 44;
  const barW = 22;
  const W = n * slot;
  const tagH = 22;
  const labelH = 18;
  const topPad = 6;
  const plotH = height - tagH - labelH - topPad;
  const max = Math.max(...data.map(d => d.v), 1);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Actividad semanal">
      <defs>
        <pattern id={`hatch-${uid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={color} strokeWidth="2.5" opacity="0.4" />
        </pattern>
      </defs>
      {data.map((d, i) => {
        const h = Math.max((d.v / max) * plotH, 3);
        const x = i * slot + (slot - barW) / 2;
        const cx = x + barW / 2;
        const y = topPad + tagH + (plotH - h);
        const isActive = i === active;
        const tagText = valueFmt(d.v);
        const tagW = Math.max(34, tagText.length * 7 + 14);
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={h} rx={7}
              fill={isActive ? color : `url(#hatch-${uid})`}
              stroke={color} strokeOpacity={isActive ? 0 : 0.22} strokeWidth={1}
            />
            {isActive && (
              <g>
                <rect x={cx - tagW / 2} y={y - tagH - 2} width={tagW} height={tagH} rx={tagH / 2} fill={tagBg} />
                <text x={cx} y={y - tagH / 2 - 1} dominantBaseline="central" textAnchor="middle"
                  fill={tagColor} fontFamily="Anton, sans-serif" fontSize="12">{tagText}</text>
              </g>
            )}
            <text x={cx} y={height - 4} textAnchor="middle" fill={labelColor}
              fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="700">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TickGauge({
  size = 150,
  pct = 0.6,
  color = '#1FE0A6',
  track = 'rgba(255,255,255,0.12)',
  value,
  label,
  valueColor = '#ffffff',
  labelColor = 'rgba(255,255,255,0.55)',
}: {
  size?: number;
  pct?: number;
  color?: string;
  track?: string;
  value: string | number;
  label?: string;
  valueColor?: string;
  labelColor?: string;
}) {
  const ticks = 44;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 3;
  const rInner = rOuter - 12;
  const lit = Math.round(Math.min(Math.max(pct, 0), 1) * ticks);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${value} ${label ?? ''}`}>
      {Array.from({ length: ticks }, (_, i) => {
        const a = (-90 + i * (360 / ticks)) * (Math.PI / 180);
        return (
          <line key={i}
            x1={cx + rInner * Math.cos(a)} y1={cy + rInner * Math.sin(a)}
            x2={cx + rOuter * Math.cos(a)} y2={cy + rOuter * Math.sin(a)}
            stroke={i < lit ? color : track} strokeWidth="3" strokeLinecap="round" />
        );
      })}
      <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="central"
        fill={valueColor} fontFamily="Anton, sans-serif" fontSize={size * 0.27}>{value}</text>
      {label && (
        <text x={cx} y={cy + size * 0.17} textAnchor="middle"
          fill={labelColor} fontFamily="Hanken Grotesk, sans-serif" fontWeight="700"
          fontSize={size * 0.085} letterSpacing="1.5">{label}</text>
      )}
    </svg>
  );
}

export function ConnectedBadges({
  data,
  active = -1,
  color = '#6E6BF0',
  colors,
  track = '#2A2E37',
  valueColor = '#ffffff',
  labelColor = '#9CA3AF',
  surface = '#1E2127',
}: {
  data: BarDatum[];
  active?: number;
  color?: string;
  colors?: string[];
  track?: string;
  valueColor?: string;
  labelColor?: string;
  surface?: string;
}) {
  const n = Math.max(data.length, 1);
  const slot = 64;
  const r = 22;
  const W = n * slot;
  const H = 80;
  const cy = 26;
  const cx = (i: number) => i * slot + slot / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Maestría por materia">
      {n > 1 && <line x1={cx(0)} y1={cy} x2={cx(n - 1)} y2={cy} stroke={track} strokeWidth="2" />}
      {data.map((d, i) => {
        const c = colors?.[i] ?? color;
        const isActive = i === active;
        return (
          <g key={i}>
            <circle cx={cx(i)} cy={cy} r={r} fill={isActive ? c : surface}
              stroke={colors ? c : (isActive ? color : track)} strokeWidth={isActive ? 3 : 2}
              strokeOpacity={colors && !isActive ? 0.6 : 1} />
            <text x={cx(i)} y={cy} textAnchor="middle" dominantBaseline="central"
              fill={isActive ? '#0A0D12' : (colors ? c : valueColor)} fontFamily="Anton, sans-serif" fontSize="16">{d.v}</text>
            <text x={cx(i)} y={H - 8} textAnchor="middle"
              fill={colors ? c : (isActive ? color : labelColor)} fillOpacity={colors && !isActive ? 0.8 : 1}
              fontFamily="Hanken Grotesk, sans-serif" fontWeight="700" fontSize="11" letterSpacing="1">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
