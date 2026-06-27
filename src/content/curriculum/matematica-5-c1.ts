import type { Quiz } from '@/lib/types';

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

/** Todos los módulos del cuatrimestre. Se irán sumando las unidades 2, 3 y 4. */
export const matematica5C1: Quiz[] = [romanos];
