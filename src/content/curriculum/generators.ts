import type { Question } from '@/lib/types';

/**
 * Procedural question generators for the Matemática 5° curriculum.
 *
 * Math content is cheap to generate, so instead of hand-authoring dozens of
 * near-identical questions we synthesize a large, varied bank per unit. The RNG
 * is seeded (deterministic) so the bank is stable and reviewable, and every
 * generated question carries the right answer + a kid-facing explanation.
 *
 * Arithmetic answers use `fill_in_the_blank` (no distractor risk — answersMatch
 * parses numbers in es-AR). Categorical answers use `multiple_choice`.
 */

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randInt = (r: () => number, min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
const pick = <T,>(r: () => number, arr: T[]): T => arr[Math.floor(r() * arr.length)];
function shuffle<T>(r: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Roman numerals ───────────────────────────────────────────────────
const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];
export function toRoman(n: number): string {
  let out = '';
  for (const [v, sym] of ROMAN) while (n >= v) { out += sym; n -= v; }
  return out;
}

// ── Generators ───────────────────────────────────────────────────────

/** Cálculos combinados — order of operations (PEMDAS), integer results. */
export function genCombinedOps(seed: number, n: number): Question[] {
  const r = rng(seed);
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < n && guard++ < n * 25) {
    let text = '', value = 0, expl = '';
    switch (randInt(r, 0, 7)) {
      case 0: { const a = randInt(r, 2, 20), b = randInt(r, 2, 9), c = randInt(r, 2, 9);
        value = a + b * c; text = `${a} + ${b} × ${c}`;
        expl = `Primero la multiplicación: ${b} × ${c} = ${b * c}. Después: ${a} + ${b * c} = ${value}.`; break; }
      case 1: { const a = randInt(r, 2, 9), b = randInt(r, 2, 9), c = randInt(r, 2, 20);
        value = a * b + c; text = `${a} × ${b} + ${c}`;
        expl = `Primero ×: ${a} × ${b} = ${a * b}. Después: ${a * b} + ${c} = ${value}.`; break; }
      case 2: { const a = randInt(r, 3, 9), b = randInt(r, 3, 9), c = randInt(r, 1, a * b - 1);
        value = a * b - c; text = `${a} × ${b} - ${c}`;
        expl = `Primero ×: ${a} × ${b} = ${a * b}. Después: ${a * b} - ${c} = ${value}.`; break; }
      case 3: { const a = randInt(r, 2, 12), b = randInt(r, 2, 12), c = randInt(r, 2, 6);
        value = (a + b) * c; text = `(${a} + ${b}) × ${c}`;
        expl = `Primero el paréntesis: ${a} + ${b} = ${a + b}. Después ×: ${a + b} × ${c} = ${value}.`; break; }
      case 4: { const b = randInt(r, 2, 9), a = b + randInt(r, 2, 9), c = randInt(r, 2, 6);
        value = (a - b) * c; text = `(${a} - ${b}) × ${c}`;
        expl = `Primero el paréntesis: ${a} - ${b} = ${a - b}. Después ×: ${a - b} × ${c} = ${value}.`; break; }
      case 5: { const a = randInt(r, 2, 15), b = randInt(r, 2, 9), c = randInt(r, 2, 9), bc = b * c, d = randInt(r, 1, a + bc - 1);
        value = a + bc - d; text = `${a} + ${b} × ${c} - ${d}`;
        expl = `Primero ×: ${b} × ${c} = ${bc}. Después: ${a} + ${bc} - ${d} = ${value}.`; break; }
      case 6: { const b = randInt(r, 2, 9), q = randInt(r, 2, 9), a = b * q, c = randInt(r, 2, 20);
        value = q + c; text = `${a} ÷ ${b} + ${c}`;
        expl = `Primero la división: ${a} ÷ ${b} = ${q}. Después: ${q} + ${c} = ${value}.`; break; }
      default: { const a = randInt(r, 2, 7), b = randInt(r, 2, 9), c = randInt(r, 2, 9);
        value = a * (b + c); text = `${a} × (${b} + ${c})`;
        expl = `Primero el paréntesis: ${b} + ${c} = ${b + c}. Después ×: ${a} × ${b + c} = ${value}.`; break; }
    }
    if (seen.has(text)) continue;
    seen.add(text);
    out.push({ type: 'fill_in_the_blank', question: `Resolvé el cálculo combinado: ${text}`, correctAnswer: String(value), explanation: expl, active: true });
  }
  return out;
}

/** Números romanos — read a roman (typed) or write a number as roman (choice). */
export function genRomanNumerals(seed: number, n: number): Question[] {
  const r = rng(seed);
  const out: Question[] = [];
  const seen = new Set<string>();
  const nice = [40, 49, 90, 99, 150, 200, 250, 300, 400, 500, 600, 900, 1000, 1500, 2000];
  let guard = 0;
  while (out.length < n && guard++ < n * 25) {
    const num = r() < 0.6 ? randInt(r, 1, 100) : pick(r, nice);
    const rom = toRoman(num);
    if (r() < 0.5) {
      const key = `a${rom}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ type: 'fill_in_the_blank', question: `¿Qué número es ${rom}?`, correctAnswer: String(num), explanation: `${rom} = ${num}.`, active: true });
    } else {
      const key = `b${num}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const opts = new Set<string>([rom]);
      let g = 0;
      while (opts.size < 4 && g++ < 40) {
        const d = num + pick(r, [-5, -3, -2, -1, 1, 2, 3, 5, 10, -10]);
        if (d >= 1 && d <= 3999) { const dr = toRoman(d); if (dr !== rom) opts.add(dr); }
      }
      while (opts.size < 4) opts.add(toRoman(randInt(r, 1, 100)));
      out.push({ type: 'multiple_choice', question: `¿Cómo se escribe ${num} en números romanos?`, options: shuffle(r, [...opts]), correctAnswer: rom, explanation: `${num} se escribe ${rom}.`, active: true });
    }
  }
  return out;
}

/** Proporcionalidad directa — rule of three with integer unit prices. */
export function genProportionality(seed: number, n: number): Question[] {
  const r = rng(seed);
  const out: Question[] = [];
  const seen = new Set<string>();
  const items = ['figuritas', 'alfajores', 'lápices', 'stickers', 'globos', 'caramelos', 'entradas', 'empanadas'];
  let guard = 0;
  while (out.length < n && guard++ < n * 25) {
    const a = randInt(r, 2, 6), u = randInt(r, 2, 15), b = randInt(r, 2, 12), item = pick(r, items);
    if (b === a) continue;
    const p = a * u, ans = b * u;
    const key = `${a}-${u}-${b}-${item}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      type: 'fill_in_the_blank',
      question: `Si ${a} ${item} cuestan $${p}, ¿cuánto cuestan ${b} ${item}? (en $)`,
      correctAnswer: String(ans),
      explanation: `Cada uno cuesta $${p} ÷ ${a} = $${u}. Entonces ${b} × $${u} = $${ans}.`,
      active: true,
    });
  }
  return out;
}

/** Ángulos y triángulos — angle sums and classification. */
export function genGeometry(seed: number, n: number): Question[] {
  const r = rng(seed);
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < n && guard++ < n * 25) {
    switch (randInt(r, 0, 3)) {
      case 0: { // third angle of a triangle
        const x = randInt(r, 20, 120), y = randInt(r, 20, 150 - x);
        const third = 180 - x - y;
        if (y < 20 || third < 15) continue;
        const key = `t${x}-${y}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ type: 'fill_in_the_blank', question: `Dos ángulos de un triángulo miden ${x}° y ${y}°. ¿Cuánto mide el tercero? (en grados)`, correctAnswer: String(third), explanation: `Los ángulos de un triángulo suman 180°. 180 - ${x} - ${y} = ${third}°.`, active: true });
        break;
      }
      case 1: { // classify an angle
        const a = pick(r, [randInt(r, 10, 89), 90, randInt(r, 91, 179), 180]);
        const cat = a < 90 ? 'Agudo' : a === 90 ? 'Recto' : a < 180 ? 'Obtuso' : 'Llano';
        const key = `a${a}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ type: 'multiple_choice', question: `Un ángulo que mide ${a}° es:`, options: shuffle(r, ['Agudo', 'Recto', 'Obtuso', 'Llano']), correctAnswer: cat, explanation: `Agudo: menos de 90°. Recto: 90°. Obtuso: entre 90° y 180°. Llano: 180°. ${a}° es ${cat.toLowerCase()}.`, active: true });
        break;
      }
      case 2: { // classify a triangle by its angles
        let x: number, y: number;
        switch (randInt(r, 0, 2)) {
          case 0: x = 90; y = randInt(r, 20, 69); break;          // right
          case 1: x = randInt(r, 91, 140); y = randInt(r, 20, 175 - x); break; // obtuse
          default: x = randInt(r, 55, 85); y = randInt(r, 55, 85); break;      // acute
        }
        const z = 180 - x - y;
        if (z < 15) continue;
        const cat = (x === 90 || y === 90 || z === 90) ? 'Rectángulo' : (x > 90 || y > 90 || z > 90) ? 'Obtusángulo' : 'Acutángulo';
        const key = `ta${x}-${y}-${z}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ type: 'multiple_choice', question: `Un triángulo con ángulos de ${x}°, ${y}° y ${z}° es:`, options: shuffle(r, ['Acutángulo', 'Rectángulo', 'Obtusángulo']), correctAnswer: cat, explanation: `Rectángulo: tiene un ángulo de 90°. Obtusángulo: tiene uno mayor a 90°. Acutángulo: todos menores a 90°. Acá es ${cat.toLowerCase()}.`, active: true });
        break;
      }
      default: { // classify a triangle by its sides
        let a: number, b: number, c: number, cat: string;
        switch (randInt(r, 0, 2)) {
          case 0: a = b = c = randInt(r, 3, 12); cat = 'Equilátero'; break;
          case 1: a = b = randInt(r, 4, 12); c = randInt(r, 3, 2 * a - 1); if (c === a) continue; cat = 'Isósceles'; break;
          default: a = randInt(r, 3, 8); b = a + randInt(r, 1, 4); c = b + randInt(r, 1, 4); cat = 'Escaleno'; break;
        }
        const key = `ts${a}-${b}-${c}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ type: 'multiple_choice', question: `Un triángulo con lados de ${a} cm, ${b} cm y ${c} cm es:`, options: shuffle(r, ['Equilátero', 'Isósceles', 'Escaleno']), correctAnswer: cat, explanation: `Equilátero: 3 lados iguales. Isósceles: 2 lados iguales. Escaleno: los 3 lados distintos.`, active: true });
        break;
      }
    }
  }
  return out;
}
