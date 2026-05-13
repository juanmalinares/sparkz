
import type { Quiz } from './types';

// This file is now a backup and seed data source. 
// The app primarily uses Firebase Firestore.
// To add these quizzes to your Firestore database, you can ask me to create a seeding script.

export const quizzes: Quiz[] = [
  {
    id: 'solar-system',
    title: 'Nuestro Sistema Solar',
    topic: 'Espacio',
    image: 'https://placehold.co/600x400.png',
    questions: [
      {
        type: 'multiple_choice',
        question: '¿Qué planeta es conocido como el Planeta Rojo?',
        options: ['Tierra', 'Marte', 'Júpiter', 'Saturno'],
        correctAnswer: 'Marte',
        explanation: 'Marte es llamado el Planeta Rojo por el óxido de hierro (herrumbre) en su superficie, que le da una apariencia rojiza.'
      },
      {
        type: 'multiple_choice',
        question: '¿Cuál es el planeta más grande de nuestro sistema solar?',
        options: ['Tierra', 'Marte', 'Júpiter', 'Saturno'],
        correctAnswer: 'Júpiter',
        explanation: 'Júpiter es el planeta más grande, más de dos veces más masivo que todos los demás planetas juntos.'
      },
      {
        type: 'multiple_choice',
        question: '¿Qué planeta tiene los anillos más prominentes?',
        options: ['Saturno', 'Urano', 'Júpiter', 'Neptuno'],
        correctAnswer: 'Saturno',
        explanation: 'Los anillos de Saturno son los más extensos y visibles desde la Tierra. Están hechos de partículas de hielo con una pequeña cantidad de escombros rocosos y polvo.'
      }
    ],
    active: true,
    sessionLength: 10,
  },
  {
    id: 'world-oceans',
    title: 'Los Océanos del Mundo',
    topic: 'Geografía',
    image: 'https://placehold.co/600x400.png',
    questions: [
      {
        type: 'multiple_choice',
        question: '¿Cuál es el océano más grande de la Tierra?',
        options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
        correctAnswer: 'Pacífico',
        explanation: 'El Océano Pacífico es el más grande y profundo de los cinco océanos del mundo.'
      },
      {
        type: 'multiple_choice',
        question: '¿En qué océano se encuentra la Gran Barrera de Coral?',
        options: ['Atlántico', 'Pacífico', 'Índico', 'Ártico'],
        correctAnswer: 'Pacífico',
        explanation: 'La Gran Barrera de Coral se encuentra frente a la costa de Queensland, Australia, en el Mar del Coral, que forma parte del Océano Pacífico.'
      }
    ],
    active: true,
    sessionLength: 10,
  },
    {
    id: 'dinosaurs-101',
    title: 'Dinosaurios 101',
    topic: 'Historia',
    image: 'https://placehold.co/600x400.png',
    questions: [
      {
        type: 'multiple_choice',
        question: '¿Qué dinosaurio es conocido por sus tres cuernos?',
        options: ['Tyrannosaurus Rex', 'Triceratops', 'Velociraptor', 'Stegosaurus'],
        correctAnswer: 'Triceratops',
        explanation: 'El Triceratops es famoso por su gran cresta ósea y tres cuernos en su cráneo.'
      },
      {
        type: 'multiple_choice',
        question: '¿Qué significa el nombre "Tyrannosaurus Rex"?',
        options: ['Rey de los Lagartos', 'Rey Lagarto Tirano', 'Lagarto Cabezón', 'Ladrón Veloz'],
        correctAnswer: 'Rey Lagarto Tirano',
        explanation: 'En griego, "tyrannos" significa tirano, "sauros" significa lagarto, y "rex" es latín para rey.'
      },
      {
        type: 'multiple_choice',
        question: '¿Cuál de estos dinosaurios era herbívoro?',
        options: ['Velociraptor', 'Tyrannosaurus Rex', 'Stegosaurus', 'Allosaurus'],
        correctAnswer: 'Stegosaurus',
        explanation: 'El Stegosaurus era un comedor de plantas (herbívoro), conocido por las placas en su espalda y las púas en su cola.'
      }
    ],
    active: true,
    sessionLength: 10,
  },
  {
    "id": "matem-ticas-1752269333031",
    "title": "Matemáticas",
    "topic": "Matemáticas",
    "image": "https://placehold.co/600x400.png",
    "active": true,
    "sessionLength": 15,
    "mode": "Jordi",
    "questions": [
      {
        "correctAnswer": "2500",
        "question": "¿Cuánto es 50 x 50?",
        "type": "short_answer",
        "explanation": "50 multiplicado por 50 es igual a 2500."
      },
      {
        "correctAnswer": "Verdadero",
        "question": "¿Es 3578 mayor que 2987?",
        "type": "true_false",
        "options": [
          "Verdadero",
          "Falso"
        ]
      },
      {
        "correctAnswer": "1450",
        "question": "Si tengo 2 billetes de $500, 1 billete de $200 y 5 monedas de $50, ¿Cuánto dinero tengo en total?",
        "type": "short_answer",
        "explanation": "2 billetes de $500 = $1000\n1 billete de $200 = $200\n5 monedas de $50 = $250\n$1000 + $200 + $250 = $1450"
      },
      {
        "correctAnswer": "3456",
        "question": "Escribe el número tres mil cuatrocientos cincuenta y seis.",
        "type": "fill_in_the_blank",
        "explanation": "El número escrito en letras es 3456"
      },
      {
        "correctAnswer": "Resta",
        "question": "¿Qué operación debo realizar para encontrar la diferencia entre dos números?",
        "type": "short_answer",
        "explanation": "La resta es la operación que se utiliza para hallar la diferencia entre dos números."
      },
      {
        "correctAnswer": "72",
        "question": "Resuelve: 9 x 8 = ___",
        "type": "fill_in_the_blank",
        "explanation": "9 x 8 = 72"
      },
      {
        "correctAnswer": "1025",
        "question": "¿Cuánto es 25 x 41?",
        "type": "short_answer",
        "explanation": "25 multiplicado por 41 es igual a 1025."
      },
      {
        "correctAnswer": "Falso",
        "question": "La circunferencia es una línea recta.",
        "type": "true_false",
        "options": [
          "Verdadero",
          "Falso"
        ]
      },
      {
        "correctAnswer": "Verdadero",
        "question": "El radio es la mitad del diámetro de una circunferencia.",
        "type": "true_false",
        "options": [
          "Verdadero",
          "Falso"
        ]
      },
      {
        "correctAnswer": "Diámetro",
        "question": "La línea que atraviesa el centro de una circunferencia y une dos puntos opuestos se llama _____.",
        "type": "fill_in_the_blank",
        "explanation": "La línea que pasa por el centro y une dos puntos opuestos de una circunferencia se llama diámetro."
      },
      {
        "correctAnswer": "6750",
        "question": "Resuelve 2250 + 4500 =",
        "type": "short_answer",
        "explanation": "La suma de 2250 y 4500 es 6750."
      },
      {
        "correctAnswer": "30000",
        "question": "Escribe en números: Treinta mil.",
        "type": "short_answer",
        "explanation": "Treinta mil se escribe como 30000."
      },
      {
        "correctAnswer": "150",
        "question": "Resuelve: 300 / 2 =",
        "type": "short_answer",
        "explanation": "300 dividido 2 es igual a 150"
      },
      {
        "correctAnswer": "Multiplicación",
        "question": "¿Qué operación usarías para calcular el total si compras 5 paquetes de galletitas a $35 cada uno?",
        "type": "short_answer",
        "explanation": "Para calcular el total debes usar la multiplicación."
      },
      {
        "correctAnswer": "4500",
        "question": "Si un kilo de manzanas cuesta $150, ¿Cuánto cuestan 30 kilos?",
        "type": "short_answer",
        "explanation": "30 kilos x $150/kilo = $4500"
      },
      {
        "correctAnswer": "Circunferencia",
        "question": "¿Cómo se llama la línea curva cerrada que tiene todos sus puntos a la misma distancia de su centro?",
        "type": "short_answer",
        "explanation": "Esa línea se llama circunferencia."
      },
      {
        "correctAnswer": "245",
        "question": "Resuelve: 490 / 2 = ___",
        "type": "fill_in_the_blank",
        "explanation": "490 dividido 2 es 245"
      },
      {
        "correctAnswer": "Radio",
        "question": "La distancia desde el centro de una circunferencia hasta cualquier punto de la circunferencia se llama _____.",
        "type": "fill_in_the_blank",
        "explanation": "Esa distancia se llama radio."
      },
      {
        "correctAnswer": "Verdadero",
        "question": "El diámetro de una circunferencia siempre es el doble de su radio.",
        "type": "true_false",
        "options": [
          "Verdadero",
          "Falso"
        ]
      },
      {
        "correctAnswer": "Verdadero",
        "question": "La suma es conmutativa.",
        "type": "true_false",
        "options": [
          "Verdadero",
          "Falso"
        ],
        "explanation": "La suma es conmutativa, el orden de los términos no altera el resultado."
      },
      {
        "correctAnswer": "75",
        "question": "Completa la tabla de multiplicar del 5: ... 5 x 15 = ___",
        "type": "fill_in_the_blank",
        "explanation": "5 x 15 = 75"
      },
      {
        "correctAnswer": "Falso",
        "question": "La resta es conmutativa.",
        "type": "true_false",
        "options": [
          "Verdadero",
          "Falso"
        ],
        "explanation": "La resta no es conmutativa, el orden de los términos sí altera el resultado."
      },
      {
        "correctAnswer": "500",
        "question": "Un billete de quinientos pesos es igual a ____ pesos.",
        "type": "fill_in_the_blank",
        "explanation": "Un billete de quinientos pesos es igual a 500 pesos."
      },
      {
        "correctAnswer": "100",
        "question": "Un billete de cien pesos es igual a ____ pesos.",
        "type": "fill_in_the_blank",
        "explanation": "Un billete de cien pesos es igual a 100 pesos."
      },
      {
        "correctAnswer": "120",
        "question": "Resuelve: 240 / 2 = ___",
        "type": "fill_in_the_blank",
        "explanation": "240 dividido 2 es igual a 120"
      },
      {
        "correctAnswer": "1346",
        "question": "Calcula la suma de 1234 y 112.",
        "type": "multiple_choice",
        "options": ["1346", "1122", "1446", "1336"],
        "explanation": "1234 + 112 = 1346"
      },
      {
        "correctAnswer": "52",
        "question": "Resuelve: 13 x 4 =",
        "type": "multiple_choice",
        "options": ["52", "42", "17", "48"],
        "explanation": "13 x 4 = 52"
      },
      {
        "correctAnswer": "Veintitrés mil cuatrocientos cincuenta y seis",
        "question": "Escribe con letras el número 23456.",
        "type": "multiple_choice",
        "options": ["Veintitrés mil cuatrocientos cincuenta y seis", "Veintitrés mil quinientos cuarenta y seis", "Dos mil trescientos cuarenta y cinco"],
        "explanation": "El número 23456 se escribe 'Veintitrés mil cuatrocientos cincuenta y seis'."
      },
      {
        "correctAnswer": "11234",
        "question": "Escribe el número once mil doscientos treinta y cuatro.",
        "type": "multiple_choice",
        "options": ["11234", "11324", "1234", "10234"],
        "explanation": "Once mil doscientos treinta y cuatro se escribe como 11234."
      },
      {
        "correctAnswer": "2000",
        "question": "Si tengo 4 billetes de $500, ¿cuánto dinero tengo?",
        "type": "multiple_choice",
        "options": ["2000", "200", "4500", "1000"],
        "explanation": "4 billetes de $500 = $2000."
      },
      {
        "correctAnswer": "5678",
        "question": "Escribe el número cinco mil seiscientos setenta y ocho.",
        "type": "multiple_choice",
        "options": ["5678", "5768", "6578", "50678"],
        "explanation": "El número es 5678."
      },
      {
        "correctAnswer": "17890",
        "question": "Calcula: 8945 + 8945 = ?",
        "type": "multiple_choice",
        "options": ["17890", "16890", "17880", "8945"],
        "explanation": "8945 + 8945 = 17890"
      },
      {
        "correctAnswer": "7000",
        "question": "Redondea 6850 a la unidad de mil más cercana.",
        "type": "multiple_choice",
        "options": ["7000", "6000", "6900", "6800"],
        "explanation": "6850 está más cerca de 7000 que de 6000."
      },
      {
        "correctAnswer": "32",
        "question": "8 x 4 = ?",
        "type": "multiple_choice",
        "options": ["32", "12", "36", "24"],
        "explanation": "8 multiplicado por 4 es igual a 32."
      },
      {
        "correctAnswer": "45",
        "question": "9 x 5 = ?",
        "type": "multiple_choice",
        "options": ["45", "14", "54", "40"],
        "explanation": "9 multiplicado por 5 es igual a 45."
      },
      {
        "correctAnswer": "67",
        "question": "Resuelve 34 + 33 =",
        "type": "multiple_choice",
        "options": ["67", "77", "1", "66"],
        "explanation": "34 + 33 = 67"
      },
      {
        "correctAnswer": "12345",
        "question": "Escribe el número doce mil trescientos cuarenta y cinco.",
        "type": "multiple_choice",
        "options": ["12345", "12435", "13245", "10345"],
        "explanation": "El número es 12345."
      },
      {
        "correctAnswer": "567",
        "question": "Resuelve: 876 - 309 = ?",
        "type": "multiple_choice",
        "options": ["567", "577", "1185", "667"],
        "explanation": "876 - 309 = 567"
      },
      {
        "correctAnswer": "200",
        "question": "Resuelve: 400 / 2 = ?",
        "type": "multiple_choice",
        "options": ["200", "20", "800", "402"],
        "explanation": "400 / 2 = 200"
      },
      {
        "correctAnswer": "25",
        "question": "Resuelve: 125 / 5 = ?",
        "type": "multiple_choice",
        "options": ["25", "15", "120", "30"],
        "explanation": "125 / 5 = 25"
      },
      {
        "correctAnswer": "1000",
        "question": "Resuelve: 200 x 5 = ?",
        "type": "multiple_choice",
        "options": ["1000", "205", "100", "2500"],
        "explanation": "200 x 5 = 1000"
      },
      {
        "correctAnswer": "1500",
        "question": "Resuelve: 300 x 5 = ?",
        "type": "multiple_choice",
        "options": ["1500", "305", "150", "3500"],
        "explanation": "300 x 5 = 1500"
      },
      {
        "correctAnswer": "30",
        "question": "Resuelve: 6 x 5 = ?",
        "type": "multiple_choice",
        "options": ["30", "11", "25", "65"],
        "explanation": "6 x 5 = 30"
      },
      {
        "correctAnswer": "48",
        "question": "Resuelve: 6 x 8 = ?",
        "type": "multiple_choice",
        "options": ["48", "14", "54", "42"],
        "explanation": "6 x 8 = 48"
      },
      {
        "correctAnswer": "24",
        "question": "Resuelve: 4 x 6 = ?",
        "type": "multiple_choice",
        "options": ["24", "10", "28", "30"],
        "explanation": "4 x 6 = 24"
      },
      {
        "correctAnswer": "36",
        "question": "Resuelve: 6 x 6 = ?",
        "type": "multiple_choice",
        "options": ["36", "12", "30", "42"],
        "explanation": "6 x 6 = 36"
      },
      {
        "correctAnswer": "8",
        "question": "Resuelve: 40 / 5 = ?",
        "type": "multiple_choice",
        "options": ["8", "9", "7", "45"],
        "explanation": "40 / 5 = 8"
      },
      {
        "correctAnswer": "6",
        "question": "Resuelve: 30 / 5 = ?",
        "type": "multiple_choice",
        "options": ["6", "5", "7", "35"],
        "explanation": "30 / 5 = 6"
      }
    ]
  }
];


