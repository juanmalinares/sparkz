import type { Quiz } from '@/lib/types';
import { genCombinedOps, genRomanNumerals, genProportionality, genGeometry } from './generators';

/**
 * Currículum: Matemática 5° — Cuatrimestre 1 (C1).
 * Fiel al temario y guía de estudio del colegio. Cada unidad es un módulo de
 * 3 fases (Teoría → Flashcards → Quiz). Contexto mundialista/fútbol donde la
 * guía lo usa, para enganchar. Cargar con: scripts/seed-curriculum.ts
 */

const romanos: Quiz = {
  id: 'mate5-c1-romanos',
  title: 'Números Romanos',
  topic: 'Matemática',
  subject: 'Matemática',
  unit: 'Numeración',
  grade: '5°',
  order: 1,
  active: true,
  mode: 'Marc',
  sessionLength: 10,
  experienceType: 'classic-quiz',
  theory: {
    intro:
      '¡Bienvenido al sistema que usaban los romanos y que todavía vive en los relojes, los siglos y hasta en el Super Bowl! Dominar estas 4 reglas te deja leer y escribir cualquier número romano sin dudar.',
    rules: [
      {
        title: 'Regla de la repetición',
        text: 'Las letras I, X, C y M se pueden repetir hasta 3 veces seguidas. Las letras V, L y D nunca se repiten.',
        example: 'XXX = 30 (válido). VV está mal: para 10 se usa X.',
      },
      {
        title: 'Regla de la suma',
        text: 'Si una letra está a la derecha de otra de igual o mayor valor, los valores se suman.',
        example: 'CL = 100 + 50 = 150 · VI = 5 + 1 = 6',
      },
      {
        title: 'Regla de la resta',
        text: 'Si una letra de menor valor está a la izquierda de una mayor, se resta. ¡Ojo! Solo restan I, X y C.',
        example: 'IV = 4, IX = 9 · XL = 40, XC = 90 · CD = 400, CM = 900',
      },
      {
        title: 'Regla de la multiplicación',
        text: 'Una raya horizontal arriba de una letra (o grupo) multiplica su valor por 1.000. Sirve para números grandes.',
        example: 'Una V con raya encima = 5 × 1.000 = 5.000',
      },
    ],
  },
  flashcards: [
    { front: 'Valores básicos: I, V, X, L', back: 'I=1, V=5, X=10, L=50' },
    { front: 'Valores básicos: C, D, M', back: 'C=100, D=500, M=1.000' },
    { front: '¿Qué letras NUNCA se repiten?', back: 'V, L y D' },
    { front: '¿Cómo se escribe 4 y 9?', back: 'IV = 4 · IX = 9' },
    { front: '¿Cómo se escribe 40, 90, 400 y 900?', back: 'XL=40, XC=90, CD=400, CM=900' },
    { front: '¿Qué hace una raya encima de una letra?', back: 'Multiplica su valor por 1.000' },
  ],
  questions: [
    {
      type: 'multiple_choice',
      question: '¿Cuánto vale el número romano XXX?',
      options: ['30', '15', '300', '13'],
      correctAnswer: '30',
      explanation: 'X = 10 y se repite 3 veces: 10 + 10 + 10 = 30.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cuánto vale CL?',
      options: ['150', '60', '99', '600'],
      correctAnswer: '150',
      explanation: 'L (50) está a la derecha de C (100), así que se suma: 100 + 50 = 150.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cuánto vale IX?',
      options: ['9', '11', '8', '19'],
      correctAnswer: '9',
      explanation: 'I (1) está a la izquierda de X (10), entonces se resta: 10 − 1 = 9.',
      active: true,
    },
    {
      type: 'fill_in_the_blank',
      question: 'El número 4 se escribe en romano como ______.',
      correctAnswer: 'IV',
      explanation: 'I se coloca a la izquierda de V: 5 − 1 = 4.',
      active: true,
    },
    {
      type: 'fill_in_the_blank',
      question: 'El número 40 se escribe en romano como ______.',
      correctAnswer: 'XL',
      explanation: 'X (10) a la izquierda de L (50): 50 − 10 = 40.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cuál es el valor decimal de XIV?',
      options: ['14', '16', '24', '6'],
      correctAnswer: '14',
      explanation: 'X = 10 y IV = 4, entonces 10 + 4 = 14.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cómo se escribe 2.319 en números romanos?',
      options: ['MMCCCXIX', 'MMCCCXXI', 'MMCCCIX', 'MMMCCCXIX'],
      correctAnswer: 'MMCCCXIX',
      explanation: '2.000 = MM, 300 = CCC, 19 = XIX → MMCCCXIX.',
      active: true,
    },
    {
      type: 'true_false',
      question: 'Las letras V, L y D nunca se repiten.',
      options: ['Verdadero', 'Falso'],
      correctAnswer: 'Verdadero',
      explanation: 'Solo I, X, C y M se pueden repetir (hasta 3 veces). V, L y D no.',
      active: true,
    },
    {
      type: 'true_false',
      question: '"IL" es la forma correcta de escribir 49.',
      options: ['Verdadero', 'Falso'],
      correctAnswer: 'Falso',
      explanation: 'La I solo resta a V y X. El 49 se escribe XLIX (40 + 9).',
      active: true,
    },
    {
      type: 'true_false',
      question: 'Una raya horizontal arriba de una letra multiplica su valor por 1.000.',
      options: ['Verdadero', 'Falso'],
      correctAnswer: 'Verdadero',
      explanation: 'Es la regla de la multiplicación: por ejemplo, V con raya = 5.000.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cuál es el valor decimal de XC?',
      options: ['90', '110', '40', '190'],
      correctAnswer: '90',
      explanation: 'X (10) a la izquierda de C (100): 100 − 10 = 90.',
      active: true,
    },
    {
      type: 'fill_in_the_blank',
      question: 'El número 900 se escribe en romano como ______.',
      correctAnswer: 'CM',
      explanation: 'C (100) a la izquierda de M (1.000): 1.000 − 100 = 900.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cuánto vale MCMLXXXIV? (pista: es un año mundialista)',
      options: ['1984', '1974', '1986', '1884'],
      correctAnswer: '1984',
      explanation: 'M=1.000, CM=900, LXXX=80, IV=4 → 1.984.',
      active: true,
    },
    {
      type: 'multiple_choice',
      question: '¿Cómo se escribe 2.024 en números romanos?',
      options: ['MMXXIV', 'MMXIV', 'MMXXVI', 'MMXXIX'],
      correctAnswer: 'MMXXIV',
      explanation: '2.000 = MM, 20 = XX, 4 = IV → MMXXIV.',
      active: true,
    },
    {
      type: 'true_false',
      question: 'La letra I se puede repetir un máximo de 3 veces seguidas (por ejemplo, III = 3).',
      options: ['Verdadero', 'Falso'],
      correctAnswer: 'Verdadero',
      explanation: 'I, X, C y M se repiten hasta 3 veces. III = 3 es correcto.',
      active: true,
    },
  ],
};

const combinados: Quiz = {
  id: 'mate5-c1-combinados',
  title: 'Cálculos Combinados',
  topic: 'Matemática',
  subject: 'Matemática',
  unit: 'Operaciones',
  grade: '5°',
  order: 2,
  active: true,
  mode: 'Marc',
  sessionLength: 10,
  experienceType: 'classic-quiz',
  theory: {
    intro:
      'Un cálculo combinado mezcla sumas, restas, multiplicaciones y divisiones. ¡Pero no se resuelve de izquierda a derecha sin más! Hay un orden que tenés que respetar para que dé bien.',
    rules: [
      {
        title: 'Los paréntesis mandan',
        text: 'Lo que está entre paréntesis ( ) se resuelve antes que nada.',
        example: '(5 + 3) × 4 = 8 × 4 = 32',
      },
      {
        title: 'Después, × y ÷',
        text: 'Sin paréntesis, primero resolvés las multiplicaciones y divisiones, de izquierda a derecha.',
        example: '5 + 3 × 4 = 5 + 12 = 17 (¡no 32!)',
      },
      {
        title: 'Al final, + y −',
        text: 'Las sumas y restas se hacen al final, también de izquierda a derecha.',
        example: '20 − 12 ÷ 4 = 20 − 3 = 17',
      },
      {
        title: 'Una operación por vez',
        text: 'Resolvé un paso, reescribí el cálculo más corto y seguí. Sin apuro no te equivocás.',
        example: '6 × 7 + 8 × 2 = 42 + 16 = 58',
      },
    ],
  },
  flashcards: [
    { front: '¿Qué se resuelve siempre primero?', back: 'Lo que está entre paréntesis ( )' },
    { front: 'Sin paréntesis, ¿qué va primero: × o +?', back: 'La multiplicación (y la división)' },
    { front: '5 + 3 × 4', back: '17 — primero 3 × 4 = 12' },
    { front: '(5 + 3) × 4', back: '32 — primero el paréntesis' },
    { front: '20 − 12 ÷ 4', back: '17 — primero 12 ÷ 4 = 3' },
    { front: '¿En qué dirección resolvés × y ÷ entre sí?', back: 'De izquierda a derecha' },
  ],
  questions: [
    { type: 'multiple_choice', question: 'Resolvé: 5 + 3 × 4', options: ['17', '32', '20', '23'], correctAnswer: '17', explanation: 'Primero la multiplicación: 3 × 4 = 12. Después 5 + 12 = 17.', active: true },
    { type: 'multiple_choice', question: 'Resolvé: (5 + 3) × 4', options: ['32', '17', '20', '12'], correctAnswer: '32', explanation: 'El paréntesis primero: 5 + 3 = 8. Después 8 × 4 = 32.', active: true },
    { type: 'fill_in_the_blank', question: 'Resolvé: 20 − 12 ÷ 4 = ___', correctAnswer: '17', explanation: 'Primero la división: 12 ÷ 4 = 3. Después 20 − 3 = 17.', active: true },
    { type: 'multiple_choice', question: 'Resolvé: 100 ÷ (2 × 5)', options: ['10', '50', '20', '250'], correctAnswer: '10', explanation: 'El paréntesis primero: 2 × 5 = 10. Después 100 ÷ 10 = 10.', active: true },
    { type: 'short_answer', question: 'Resolvé: 6 × 7 + 8 × 2', correctAnswer: '58', explanation: 'Las dos multiplicaciones primero: 42 + 16 = 58.', active: true },
    { type: 'true_false', question: 'En un cálculo sin paréntesis, la multiplicación se resuelve antes que la suma.', options: ['Verdadero', 'Falso'], correctAnswer: 'Verdadero', explanation: 'Sí: primero × y ÷, después + y −.', active: true },
    { type: 'true_false', question: '5 + 3 × 4 es igual a 32.', options: ['Verdadero', 'Falso'], correctAnswer: 'Falso', explanation: 'Es 17. El 32 saldría solo con paréntesis: (5 + 3) × 4.', active: true },
    { type: 'fill_in_the_blank', question: 'Resolvé: 3 × (10 − 4) = ___', correctAnswer: '18', explanation: 'Paréntesis primero: 10 − 4 = 6. Después 3 × 6 = 18.', active: true },
    { type: 'multiple_choice', question: 'Resolvé: 7 × 8 − 40 ÷ 8', options: ['51', '56', '2', '16'], correctAnswer: '51', explanation: 'Primero × y ÷: 56 − 5 = 51.', active: true },
    { type: 'short_answer', question: 'Resolvé: (12 + 8) × 5', correctAnswer: '100', explanation: 'Paréntesis primero: 20 × 5 = 100.', active: true },
    { type: 'short_answer', question: 'En 8 partidos del Mundial se vendieron 1.250 entradas en cada uno, y además 3.400 entradas online. ¿Cuántas entradas se vendieron en total? (1.250 × 8 + 3.400)', correctAnswer: '13400', explanation: '1.250 × 8 = 10.000. Después 10.000 + 3.400 = 13.400.', active: true },
    { type: 'short_answer', question: 'Se fabricaron 2.000 camisetas para cada una de las 32 selecciones y luego 6.000 más. ¿Cuántas camisetas hay? (2.000 × 32 + 6.000)', correctAnswer: '70000', explanation: '2.000 × 32 = 64.000. Después 64.000 + 6.000 = 70.000.', active: true },
    { type: 'multiple_choice', question: '¿Cuál es el PRIMER paso para resolver (4.250 × 4) + 3.875 − 358?', options: ['Resolver 4.250 × 4', 'Sumar 3.875', 'Restar 358', 'Sumar 4.250 + 3.875'], correctAnswer: 'Resolver 4.250 × 4', explanation: 'El paréntesis se resuelve primero: 4.250 × 4 = 17.000.', active: true },
    { type: 'fill_in_the_blank', question: 'Resolvé: 8 + 24 ÷ 6 = ___', correctAnswer: '12', explanation: 'Primero la división: 24 ÷ 6 = 4. Después 8 + 4 = 12.', active: true },
    { type: 'multiple_choice', question: 'Resolvé: 200 + 50 × 3', options: ['350', '750', '253', '450'], correctAnswer: '350', explanation: 'Primero 50 × 3 = 150. Después 200 + 150 = 350.', active: true },
  ],
};

const proporcionalidad: Quiz = {
  id: 'mate5-c1-proporcionalidad',
  title: 'Proporcionalidad Directa',
  topic: 'Matemática',
  subject: 'Matemática',
  unit: 'Proporcionalidad',
  grade: '5°',
  order: 3,
  active: true,
  mode: 'Marc',
  sessionLength: 10,
  experienceType: 'classic-quiz',
  theory: {
    intro:
      'Dos magnitudes son directamente proporcionales cuando, al aumentar una, la otra aumenta en la misma proporción. Más entradas → más plata; más kilos → más precio. ¡Y siempre con la misma regla!',
    rules: [
      {
        title: '¿Qué es?',
        text: 'Si una magnitud se multiplica (o divide) por un número, la otra se multiplica (o divide) por el mismo número.',
        example: 'Si el doble de cajones → el doble de gaseosas.',
      },
      {
        title: 'La constante K',
        text: 'El cociente (la división) entre las dos magnitudes siempre da el mismo número: la constante de proporcionalidad.',
        example: 'Si 3 entradas = $9.000, entonces K = 9.000 ÷ 3 = $3.000 cada una.',
      },
      {
        title: 'Reducir a la unidad',
        text: 'Calculá cuánto vale 1, y después multiplicá por lo que necesites.',
        example: '2 cajones = 48 gaseosas → 1 cajón = 24 → 6 cajones = 24 × 6 = 144.',
      },
      {
        title: 'Regla de tres (cheat code)',
        text: 'Llevás un valor a la unidad y de ahí saltás al que buscás.',
        example: '5 lápices = $250 → 1 = $50 → 8 = $400.',
      },
    ],
  },
  flashcards: [
    { front: '¿Cuándo dos magnitudes son directamente proporcionales?', back: 'Cuando una aumenta y la otra aumenta en la misma proporción' },
    { front: '¿Qué es la constante K?', back: 'El cociente (división) que siempre da igual entre las dos magnitudes' },
    { front: '2 cajones = 48 gaseosas. ¿Cuántas en 1 cajón?', back: '24 (48 ÷ 2)' },
    { front: 'Si 3 entradas cuestan $9.000, ¿cuánto vale 1?', back: '$3.000 — esa es la constante K' },
    { front: '¿Qué es "reducir a la unidad"?', back: 'Calcular cuánto vale 1, y después multiplicar' },
    { front: '72 GB alcanzan para 8 horas de video. ¿GB por hora?', back: '9 GB (72 ÷ 8)' },
  ],
  questions: [
    { type: 'true_false', question: 'Si dos magnitudes son directamente proporcionales y una se duplica, la otra también se duplica.', options: ['Verdadero', 'Falso'], correctAnswer: 'Verdadero', explanation: 'Esa es justamente la idea de la proporcionalidad directa.', active: true },
    { type: 'short_answer', question: 'En 2 cajones entran 48 gaseosas. ¿Cuántas entran en 6 cajones?', correctAnswer: '144', explanation: '1 cajón = 48 ÷ 2 = 24. Para 6: 24 × 6 = 144.', active: true },
    { type: 'short_answer', question: 'Si en 2 cajones entran 48 gaseosas, ¿cuántos cajones se necesitan para 264 gaseosas?', correctAnswer: '11', explanation: 'Cada cajón lleva 24. 264 ÷ 24 = 11 cajones.', active: true },
    { type: 'short_answer', question: '72 GB de memoria alcanzan para 8 horas de video. ¿Cuántos GB usa 1 hora?', correctAnswer: '9', explanation: '72 ÷ 8 = 9 GB por hora.', active: true },
    { type: 'multiple_choice', question: 'Si 3 entradas cuestan $9.000, ¿cuál es la constante (lo que vale 1 entrada)?', options: ['$3.000', '$9.000', '$6.000', '$27.000'], correctAnswer: '$3.000', explanation: '9.000 ÷ 3 = 3.000 por entrada.', active: true },
    { type: 'short_answer', question: 'Cada entrada cuesta $3.000. ¿Cuánto cuestan 6 entradas?', correctAnswer: '18000', explanation: '3.000 × 6 = 18.000.', active: true },
    { type: 'multiple_choice', question: 'Las entradas cuestan $3.000 cada una. Si María tiene $20.000, ¿puede comprar 5?', options: ['Sí, y le sobran $5.000', 'No, le falta plata', 'Sí, justo justo', 'No, solo le alcanza para 4'], correctAnswer: 'Sí, y le sobran $5.000', explanation: '5 × 3.000 = 15.000. Le sobran 20.000 − 15.000 = 5.000.', active: true },
    { type: 'short_answer', question: '5 lápices cuestan $250. ¿Cuánto cuestan 8 lápices?', correctAnswer: '400', explanation: '1 lápiz = 250 ÷ 5 = 50. Para 8: 50 × 8 = 400.', active: true },
    { type: 'short_answer', question: '3 kg de pan cuestan $1.800. ¿Cuánto cuesta 1 kg?', correctAnswer: '600', explanation: '1.800 ÷ 3 = 600.', active: true },
    { type: 'short_answer', question: 'Un auto recorre 240 km con 20 litros de nafta. ¿Cuántos km recorre con 5 litros?', correctAnswer: '60', explanation: 'Con 1 litro: 240 ÷ 20 = 12 km. Con 5: 12 × 5 = 60 km.', active: true },
    { type: 'true_false', question: 'En la proporcionalidad directa, el cociente entre las magnitudes cambia todo el tiempo.', options: ['Verdadero', 'Falso'], correctAnswer: 'Falso', explanation: 'Al revés: el cociente es constante (la K siempre da igual).', active: true },
    { type: 'short_answer', question: 'Si 1 hora de video usa 9 GB, ¿cuántos GB usan 5 horas?', correctAnswer: '45', explanation: '9 × 5 = 45 GB.', active: true },
    { type: 'multiple_choice', question: '¿Cuál de estas situaciones es de proporcionalidad directa?', options: ['A más kilos de manzana, más precio a pagar', 'La edad de una persona y su cantidad de hermanos', 'El día de la semana y la temperatura'], correctAnswer: 'A más kilos de manzana, más precio a pagar', explanation: 'El precio crece en la misma proporción que los kilos. Las otras no tienen relación proporcional.', active: true },
    { type: 'short_answer', question: 'Si en 2 cajones entran 48 gaseosas, ¿cuántos cajones se necesitan para 528 gaseosas?', correctAnswer: '22', explanation: 'Cada cajón lleva 24. 528 ÷ 24 = 22 cajones.', active: true },
    { type: 'fill_in_the_blank', question: 'Una estrategia es "reducir a la ______": calcular cuánto vale 1 y después multiplicar.', correctAnswer: 'unidad', explanation: 'Reducir a la unidad = encontrar el valor de 1.', active: true },
  ],
};

const geometria: Quiz = {
  id: 'mate5-c1-geometria',
  title: 'Ángulos y Triángulos',
  topic: 'Matemática',
  subject: 'Matemática',
  unit: 'Geometría',
  grade: '5°',
  order: 4,
  active: true,
  mode: 'Marc',
  sessionLength: 10,
  experienceType: 'classic-quiz',
  theory: {
    intro:
      'En geometría clasificamos ángulos y triángulos. Con dos ideas clave (los tipos de ángulo y que los ángulos de un triángulo suman 180°) podés resolver casi todo. ¡Hasta el ángulo de un tiro al arco!',
    rules: [
      {
        title: 'Tipos de ángulos',
        text: 'Agudo: menos de 90°. Recto: exactamente 90°. Obtuso: más de 90° y menos de 180°. Llano: 180°.',
        example: 'La esquina de una hoja es un ángulo recto (90°).',
      },
      {
        title: 'Triángulos por sus lados',
        text: 'Equilátero: 3 lados iguales. Isósceles: 2 lados iguales. Escaleno: 3 lados distintos.',
        example: 'Lados 5, 5 y 8 → isósceles (dos iguales).',
      },
      {
        title: 'Triángulos por sus ángulos',
        text: 'Acutángulo: 3 ángulos agudos. Rectángulo: tiene un ángulo recto. Obtusángulo: tiene un ángulo obtuso.',
        example: 'Ángulos 50°, 50° y 80° → acutángulo (todos menores a 90°).',
      },
      {
        title: 'La regla de oro: 180°',
        text: 'Los tres ángulos interiores de cualquier triángulo SIEMPRE suman 180°.',
        example: 'Si dos ángulos son 40° y 60°, el tercero es 180 − 40 − 60 = 80°.',
      },
    ],
  },
  flashcards: [
    { front: '¿Cómo se llama un ángulo de menos de 90°?', back: 'Agudo' },
    { front: '¿Cuánto mide un ángulo recto?', back: '90°' },
    { front: '¿Cuánto suman los 3 ángulos de un triángulo?', back: 'Siempre 180°' },
    { front: 'Triángulo con sus 3 lados iguales', back: 'Equilátero' },
    { front: 'Triángulo que tiene un ángulo de 90°', back: 'Rectángulo' },
    { front: 'Ángulos que suman 90° / que suman 180°', back: 'Complementarios / Suplementarios' },
  ],
  questions: [
    { type: 'multiple_choice', question: '¿Cómo se llama un ángulo que mide menos de 90°?', options: ['Agudo', 'Recto', 'Obtuso', 'Llano'], correctAnswer: 'Agudo', explanation: 'Agudo = menos de 90°.', active: true },
    { type: 'multiple_choice', question: 'Un ángulo de 90° es un ángulo...', options: ['Recto', 'Agudo', 'Obtuso', 'Llano'], correctAnswer: 'Recto', explanation: 'El ángulo recto mide exactamente 90°.', active: true },
    { type: 'multiple_choice', question: 'Un ángulo de 130° es un ángulo...', options: ['Obtuso', 'Agudo', 'Recto', 'Llano'], correctAnswer: 'Obtuso', explanation: 'Obtuso = más de 90° y menos de 180°.', active: true },
    { type: 'true_false', question: 'Los tres ángulos de cualquier triángulo suman 180°.', options: ['Verdadero', 'Falso'], correctAnswer: 'Verdadero', explanation: 'Es la regla de oro de los triángulos.', active: true },
    { type: 'fill_in_the_blank', question: 'Si dos ángulos de un triángulo miden 40° y 60°, el tercero mide ___ grados.', correctAnswer: '80', explanation: '180 − 40 − 60 = 80°.', active: true },
    { type: 'fill_in_the_blank', question: 'Si dos ángulos de un triángulo miden 50° y 50°, el tercero mide ___ grados.', correctAnswer: '80', explanation: '180 − 50 − 50 = 80°.', active: true },
    { type: 'multiple_choice', question: 'Un triángulo tiene ángulos de 50°, 50° y 80°. ¿Cómo se clasifica según sus ángulos?', options: ['Acutángulo', 'Rectángulo', 'Obtusángulo'], correctAnswer: 'Acutángulo', explanation: 'Los tres ángulos son menores a 90°, así que es acutángulo.', active: true },
    { type: 'multiple_choice', question: 'Un triángulo con sus 3 lados de distinta medida es...', options: ['Escaleno', 'Isósceles', 'Equilátero'], correctAnswer: 'Escaleno', explanation: 'Escaleno = los 3 lados distintos.', active: true },
    { type: 'multiple_choice', question: 'Un triángulo con exactamente 2 lados iguales es...', options: ['Isósceles', 'Escaleno', 'Equilátero'], correctAnswer: 'Isósceles', explanation: 'Isósceles = 2 lados iguales.', active: true },
    { type: 'true_false', question: 'Se puede construir un triángulo con lados de 4 cm, 4 cm y 8 cm.', options: ['Verdadero', 'Falso'], correctAnswer: 'Falso', explanation: 'No: 4 + 4 = 8, y un lado tiene que ser MENOR que la suma de los otros dos (propiedad triangular).', active: true },
    { type: 'true_false', question: 'Se puede construir un triángulo con un ángulo de 90° y otro de 100°.', options: ['Verdadero', 'Falso'], correctAnswer: 'Falso', explanation: 'No: 90 + 100 = 190, y ya pasa de 180°. No queda lugar para el tercer ángulo.', active: true },
    { type: 'fill_in_the_blank', question: 'El complemento de un ángulo de 30° es ___ grados (juntos suman 90°).', correctAnswer: '60', explanation: '90 − 30 = 60°. Son complementarios.', active: true },
    { type: 'fill_in_the_blank', question: 'El suplemento de un ángulo de 120° es ___ grados (juntos suman 180°).', correctAnswer: '60', explanation: '180 − 120 = 60°. Son suplementarios.', active: true },
    { type: 'multiple_choice', question: 'En un tiro libre, la pelota sale a 30° del suelo. ¿Qué tipo de ángulo es?', options: ['Agudo', 'Recto', 'Obtuso'], correctAnswer: 'Agudo', explanation: '30° es menos de 90°, así que es agudo.', active: true },
    { type: 'odd_one_out', question: '¿Cuál de estos NO es una clasificación de triángulo según sus LADOS?', options: ['Rectángulo', 'Escaleno', 'Isósceles', 'Equilátero'], correctAnswer: 'Rectángulo', explanation: 'Rectángulo clasifica por sus ÁNGULOS. Por lados son: escaleno, isósceles y equilátero.', active: true },
  ],
};

/**
 * Todos los módulos del cuatrimestre, en orden. A cada unidad le sumamos un
 * banco grande de preguntas generadas proceduralmente (RNG sembrado, estable)
 * además de las autoradas — así cada lección tiene ~4x+ de variedad.
 */
export const matematica5C1: Quiz[] = [
  { ...romanos,          questions: [...romanos.questions,          ...genRomanNumerals(11, 50)] },
  { ...combinados,       questions: [...combinados.questions,       ...genCombinedOps(22, 50)] },
  { ...proporcionalidad, questions: [...proporcionalidad.questions, ...genProportionality(33, 50)] },
  { ...geometria,        questions: [...geometria.questions,        ...genGeometry(44, 50)] },
];
