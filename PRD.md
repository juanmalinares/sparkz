
# Documento de Requisitos de Producto (PRD): Sparkz Kids

## 1. Visión General y Objetivo

**Sparkz Kids** es una aplicación web de quizzes interactivos diseñada para niños, con el objetivo de hacer que el aprendizaje sea divertido, atractivo y personalizado. La plataforma utiliza inteligencia artificial generativa para crear contenido educativo dinámico, proporcionar feedback instantáneo y permitir una gestión de contenido sencilla para los administradores.

## 2. Características Principales (Core Features)

### 2.1. Gestión de Usuarios y Perfiles
- **Autenticación de Usuarios:** Sistema completo de registro (email/contraseña), inicio de sesión y recuperación de contraseña.
- **Perfil de Usuario Persistente:** Se guarda el `displayName` (nombre de usuario), `email` y `uid` del usuario. El progreso (puntajes) se asocia a este perfil.
- **Sesión de Usuario:** El estado del usuario (autenticado o no) persiste en toda la aplicación.

### 2.2. Experiencia de Quiz Interactiva
- **Selección de Quizzes:** Una página principal (`/quiz`) muestra una lista de quizzes disponibles con tarjetas que incluyen título, tema, imagen y número de preguntas.
- **Múltiples Tipos de Preguntas:** La plataforma soporta una variedad de formatos para mantener el interés del usuario:
    - `multiple_choice` (Opción múltiple)
    - `true_false` (Verdadero o Falso)
    - `fill_in_the_blank` (Rellenar el espacio en blanco)
    - `short_answer` (Respuesta corta)
    - `matching` (Emparejamiento de arrastrar y soltar)
    - `dictation` (Dictado basado en audio generado por IA)
- **Interfaz de Quiz:** Muestra una pregunta a la vez con una barra de progreso. La interfaz se adapta al tipo de pregunta.
- **Soporte de Imágenes:** Las preguntas pueden incluir imágenes de contexto.

### 2.3. Sistema de Puntuación y Feedback
- **Feedback con IA:** Después de cada respuesta, un tutor de IA (`generateFeedback` flow) proporciona una explicación en español. El tono del feedback se adapta a una de las dos personalidades seleccionadas para el quiz:
    - **Marc:** Entusiasta, alentador y usa emojis.
    - **Jordi:** Calmo, sabio y ofrece explicaciones más detalladas.
- **Página de Resultados:** Al finalizar un quiz, el usuario ve su puntaje (en formato `X/Y` y porcentaje), su puntuación más alta histórica y opciones para reintentar el quiz o elegir otro.
- **Animaciones de Respuesta:** Se muestran animaciones distintivas para respuestas correctas e incorrectas, con variantes según la personalidad de la IA (`Marc` vs. `Jordi`).

### 2.4. Panel de Estadísticas del Usuario (`/dashboard`)
- **Resumen de Rendimiento:** Tarjetas que muestran quizzes completados, puntuación promedio, total de respuestas correctas y la puntuación más alta.
- **Gráficos de Progreso:**
    - Gráfico de barras con los resultados de los últimos 10 quizzes.
    - Gráfico de torta que desglosa las respuestas correctas por categoría de quiz.
- **Análisis por Categoría:** Identificación de fortalezas (categorías con >70% de aciertos) y debilidades (categorías con <50%).
- **Historial de Quizzes:** Una lista desplazable con el historial completo de todos los quizzes realizados, mostrando título, fecha y puntaje.

### 2.5. Funcionalidades de Administración (Acceso restringido por email)

- **Panel de Administración (`/admin`):**
    - **Creador de Quizzes con IA:** Un formulario para generar nuevos quizzes especificando tema, número de preguntas, dificultad, personalidad de la IA e instrucciones adicionales. Permite subir imágenes para generar preguntas contextuales.
    - **Gestión de Quizzes:** Una tabla para ver todos los quizzes existentes. Permite activar/desactivar, editar detalles (título, imagen), eliminar quizzes y expandir para ver y editar preguntas individuales.
    - **Edición Rápida (`/admin/quiz/[id]/edit`):** Una interfaz dedicada para editar todas las preguntas de un quiz con guardado automático.
    - **Gestión de Reportes:** Una tabla para revisar las preguntas reportadas por los usuarios, marcarlas como revisadas y editar la pregunta directamente desde el reporte.

- **Panel de Estadísticas de Administrador (`/admin-stats`):**
    - Una vista de todas las estadísticas de los usuarios, incluyendo nombre, email, puntuación más alta, número de quizzes jugados y fecha de la última partida.

### 2.6. Reporte de Preguntas
- **Reportar Pregunta Confusa:** Durante un quiz, el usuario puede reportar una pregunta. El sistema la reemplaza por otra pregunta del mismo quiz (si hay disponibles) y registra el reporte para revisión del administrador.
- **Reportar Corrección Errónea:** En la pantalla de feedback, si un usuario cree que la corrección es incorrecta, puede reportarlo. El reporte se guarda para revisión del administrador.

## 3. Pautas de Estilo y Diseño (UI/UX)

- **Paleta de Colores Principal (Tema "Jordi" / Oscuro):**
    - **Fondo:** Azul/Púrpura oscuro (`hsl(265 50% 10%)`).
    - **Primario:** Naranja vibrante (`hsl(29 100% 58%)`).
    - **Acento:** Violeta intenso (`hsl(284 70% 28%)`).
    - **Tarjetas:** Púrpura oscuro (`hsl(278 15% 15%)`).

- **Paleta de Colores Alternativa (Tema "Marc" / Claro):**
    - **Fondo:** Amarillo claro (`hsl(45 100% 95%)`).
    - **Primario:** Azul brillante (`hsl(210 100% 56%)`).
    - **Acento:** Rojo/Rosa brillante (`hsl(350 100% 60%)`).

- **Tipografía:**
    - **Tema Oscuro:** `Montserrat` para titulares y cuerpo.
    - **Tema Claro:** `Nunito` para un estilo más redondeado y amigable.

- **Diseño General:**
    - Interfaz moderna y limpia con esquinas redondeadas y sombras sutiles.
    - Diseño basado en tarjetas (`Card`) para organizar la información.
    - Uso consistente de componentes de la librería **ShadCN/UI**.
    - La aplicación es completamente responsiva y funcional en dispositivos móviles.

- **Iconografía:** Se utiliza la librería `lucide-react` para todos los íconos.

## 4. Pila Tecnológica (Tech Stack)

- **Framework Frontend:** Next.js (con App Router).
- **Lenguaje:** TypeScript.
- **Estilos:** Tailwind CSS.
- **Componentes UI:** ShadCN/UI.
- **Inteligencia Artificial:**
    - **Orquestación:** Genkit.
    - **Modelos:** `googleai/gemini-1.5-flash-latest` para generación de texto y `gemini-2.5-flash-preview-tts` para texto-a-voz.
- **Backend y Base de Datos:**
    - **Servicios:** Firebase.
    - **Autenticación:** Firebase Authentication (Email/Password).
    - **Base de Datos:** Firestore para almacenar quizzes y datos de usuario (puntajes).
- **Gestión de Estado (Cliente):** React Context API (`UserProvider`).
- **Formularios:** React Hook Form con Zod para validación.
- **Animaciones y Arrastrar y Soltar:**
    - CSS Keyframe animations.
    - Dnd-Kit para la funcionalidad de arrastrar y soltar en las preguntas de emparejamiento.

