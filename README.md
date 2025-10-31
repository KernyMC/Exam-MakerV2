# 📚 Exam Maker - Generador Inteligente de Exámenes con ChatGPT

Plataforma web que aprovecha el poder de **ChatGPT** para transformar cualquier documento en exámenes de práctica. Sube un PDF y obtén preguntas inteligentes generadas automáticamente. Perfecta para estudiantes que quieren practicar y profesores que necesitan crear exámenes rápidamente.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-blue)
![ChatGPT](https://img.shields.io/badge/ChatGPT-GPT--3.5--turbo-green)

## ⚠️ Nota sobre la Arquitectura

**Esta es una prueba de concepto (PoC)** donde la integración con la API de ChatGPT se realiza directamente desde el frontend.

**Posibles mejoras para producción:**
- ✅ Mover la API key y las llamadas a ChatGPT a un **backend seguro** (Node.js/Express, Python/Flask, etc.)
- ✅ Implementar autenticación de usuarios con JWT
- ✅ Usar una base de datos (MongoDB, PostgreSQL) en lugar de localStorage
- ✅ Agregar límites de rate limiting y manejo de cuotas
- ✅ Implementar caché de respuestas para optimizar costos de API

Este enfoque frontend-only fue elegido para **simplicidad y rapidez en el desarrollo** del concepto.

## ✨ Características Principales

### 🤖 Generación Automática con ChatGPT
- **Genera exámenes inteligentes** desde archivos PDF o DOCX usando ChatGPT
- Aprovecha **GPT-3.5-turbo de OpenAI** para crear preguntas contextuales y relevantes
- Configura cantidad de preguntas (1-50)
- Selecciona nivel de dificultad (Fácil, Medio, Difícil)
- Extracción automática de texto desde PDFs

### 📝 Gestión de Exámenes
- Importa exámenes en formato Aiken
- Crea y edita exámenes manualmente
- Organiza y busca entre tus exámenes
- Elimina exámenes que no necesites

### 🎯 Práctica Interactiva
- **Modo Moodle**: Navega pregunta por pregunta con panel lateral
- **Modo Lista**: Ve todas las preguntas en una sola página
- Mezcla respuestas aleatoriamente
- Retroalimentación inmediata (respuestas correctas/incorrectas)
- Barra de progreso en tiempo real
- Celebración con confeti al aprobar (70%+)

### 🎴 Tarjetas de Estudio (Flashcards)
- Sistema de repetición espaciada
- Animación de volteo de tarjetas
- Marca preguntas como "Lo Sé" o "Repetir"
- Las preguntas difíciles se repiten automáticamente
- Opción de mezclar tarjetas

### 📊 Estadísticas y Resultados
- Porcentaje de aciertos
- Tiempo invertido
- Revisión de respuestas incorrectas
- Promedio de calificaciones
- Contador de exámenes realizados

## 🧠 Cómo Funciona la Integración con ChatGPT

### Arquitectura de Generación Inteligente

La aplicación utiliza la API de ChatGPT (GPT-3.5-turbo) de OpenAI para generar preguntas de examen de forma inteligente y contextual. Aquí está el proceso completo:

#### 1. Extracción de Contenido
```typescript
// Ubicación: src/pages/GenerateExam.tsx
```
- El usuario sube un archivo PDF o DOCX
- La aplicación extrae el texto usando `pdfjs-dist`
- Se limita a 8000 caracteres para optimizar el uso de la API

#### 2. Construcción del Prompt
El sistema construye un prompt detallado con:
- Contenido del documento extraído
- Número de preguntas solicitadas (1-50)
- Nivel de dificultad seleccionado (Fácil/Medio/Difícil)
- Instrucciones para formato Aiken

**Ejemplo de prompt:**
```
Genera [N] preguntas de opción múltiple en formato Aiken basadas en el siguiente contenido.
Dificultad: [NIVEL]
Contenido: [TEXTO_EXTRAIDO]

Formato Aiken:
Pregunta aquí
A) Opción 1
B) Opción 2
C) Opción 3
D) Opción 4
ANSWER: A
```

#### 3. Llamada a la API (Frontend)
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,      // Creatividad moderada
    max_tokens: 2048       // Respuesta detallada
  })
});
```

⚠️ **Nota de Seguridad:** En producción, esta llamada debería hacerse desde un backend para proteger la API key.

#### 4. Procesamiento de Respuesta
- Parsea la respuesta de OpenAI
- Convierte el texto en objetos de pregunta estructurados
- Valida el formato Aiken
- Almacena las preguntas en localStorage

#### 5. Manejo de Errores
- Validación de API key
- Timeout de 30 segundos
- Mensajes de error amigables
- Reintentos en caso de fallos

### Parámetros de Configuración IA

| Parámetro | Valor | Propósito |
|-----------|-------|-----------|
| **Modelo** | gpt-3.5-turbo | Balance entre calidad y costo |
| **Temperature** | 0.7 | Creatividad moderada en preguntas |
| **Max Tokens** | 2048 | Suficiente para ~20-30 preguntas |
| **Límite de Texto** | 8000 caracteres | Optimización de costos API |

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend Framework:    React 18.3.1 + TypeScript 5.5.3
Build Tool:            Vite 5.4.1
Styling:               Tailwind CSS 3.4.11
Components:            shadcn-ui + Radix UI
State Management:      React Context API + Hooks
Routing:               React Router DOM 6.26.2
Forms:                 React Hook Form + Zod
AI Service:            OpenAI GPT-3.5-turbo
PDF Processing:        pdfjs-dist 5.1.91
Data Storage:          localStorage (cliente)
Animations:            Tailwind CSS + Canvas Confetti
Icons:                 Lucide React
```

### Estructura del Proyecto

```
exam-maker/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx          # Página principal con estadísticas
│   │   ├── GenerateExam.tsx       # 🤖 Generación con IA (Integración OpenAI)
│   │   ├── UploadAiken.tsx        # Importar formato Aiken
│   │   ├── MyExams.tsx            # Gestión de exámenes
│   │   ├── Practice.tsx           # Interfaz de práctica interactiva
│   │   ├── Flashcards.tsx         # Sistema de tarjetas de estudio
│   │   └── ExamView.tsx           # Vista detallada de examen
│   │
│   ├── components/
│   │   ├── AppSidebar.tsx         # Barra lateral de navegación
│   │   ├── Navbar.tsx             # Barra superior
│   │   ├── LoginModal.tsx         # Modal de autenticación
│   │   └── ui/                    # 50+ componentes shadcn-ui
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx            # Hook de autenticación
│   │   └── use-toast.ts           # Sistema de notificaciones
│   │
│   ├── lib/
│   │   └── utils.ts               # Funciones utilitarias
│   │
│   ├── App.tsx                    # Configuración de rutas
│   ├── main.tsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
│
├── public/                        # Recursos estáticos
├── .env                           # Variables de entorno (API key)
├── package.json                   # Dependencias
├── vite.config.ts                 # Configuración Vite
├── tailwind.config.ts             # Configuración Tailwind
└── tsconfig.json                  # Configuración TypeScript
```

### Flujo de Datos

```
Usuario → Componente React → Hook/Context → localStorage
                           ↓
                      OpenAI API (Frontend)
                           ↓
                    Procesamiento IA
                           ↓
                    Preguntas Generadas
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de OpenAI con API key

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/KernyMC/Exam-MakerV2.git
cd Exam-MakerV2
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_OPEN_API_APIKEY=sk-proj-tu-api-key-aqui
```

**¿Cómo obtener tu API key de OpenAI?**

1. Ve a [platform.openai.com](https://platform.openai.com/)
2. Inicia sesión o crea una cuenta
3. Navega a API Keys en tu perfil
4. Crea una nueva API key
5. Copia la key y pégala en tu archivo `.env`

⚠️ **Importante**: Nunca compartas tu API key públicamente ni la subas a GitHub.

### Paso 4: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

### Paso 5: Construir para Producción

```bash
npm run build
npm run preview
```

## 📖 Guía de Uso

### 1. Generar Examen con IA

1. Ve a **"Generar Examen"** en el menú lateral
2. Arrastra y suelta un archivo PDF o DOCX (o haz clic para seleccionar)
3. Ajusta el número de preguntas con el slider (1-50)
4. Selecciona la dificultad: Fácil, Medio o Difícil
5. Haz clic en **"Generar Examen"**
6. Espera mientras la IA procesa el contenido (15-30 segundos)
7. Las preguntas se generarán automáticamente en formato Aiken

### 2. Importar Examen Aiken

1. Ve a **"Subir Aiken"**
2. Pega el texto en formato Aiken o sube un archivo `.txt`
3. Revisa la vista previa de las preguntas detectadas
4. Haz clic en **"Importar Examen"**

**Formato Aiken:**
```
¿Cuál es la capital de Francia?
A) Londres
B) París
C) Madrid
D) Roma
ANSWER: B

¿Cuánto es 2 + 2?
A) 3
B) 4
C) 5
D) 6
ANSWER: B
```

### 3. Practicar Examen

1. Ve a **"Mis Exámenes"**
2. Haz clic en **"Practicar"** en cualquier examen
3. Elige entre:
   - **Modo Moodle**: Navegación pregunta por pregunta
   - **Modo Lista**: Todas las preguntas visibles
4. Mezcla las respuestas para mayor desafío
5. Selecciona tus respuestas
6. Haz clic en **"Finalizar Examen"** para ver tu puntuación

### 4. Usar Flashcards

1. Después de practicar un examen
2. Ve a **"Flashcards"**
3. Lee la pregunta en el frente de la tarjeta
4. Haz clic para voltear y ver la respuesta
5. Marca como **"Lo Sé"** o **"Repetir"**
6. Las tarjetas marcadas para repetir aparecerán de nuevo

## 🔧 Comandos Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo (puerto 8080)
npm run build        # Construye para producción
npm run build:dev    # Construye en modo desarrollo
npm run preview      # Vista previa de build de producción
npm run lint         # Ejecuta ESLint
```

## 🌍 Tecnologías y Bibliotecas Principales

### UI y Estilos
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn-ui**: Componentes React accesibles y personalizables
- **Radix UI**: Primitivos de UI sin estilos
- **Lucide React**: Biblioteca de iconos

### Gestión de Estado y Formularios
- **React Hook Form**: Gestión de formularios con validación
- **Zod**: Validación de esquemas TypeScript-first
- **TanStack React Query**: Gestión de estado del servidor

### Procesamiento de Documentos
- **pdfjs-dist**: Extracción de texto de PDFs
- **File API**: Manejo de archivos del navegador

### Animaciones y UX
- **canvas-confetti**: Animaciones de celebración
- **Embla Carousel**: Carrusel de componentes
- **Tailwind Animations**: Transiciones suaves

## 🔐 Seguridad y Privacidad

- **Sin Backend**: Todos los datos se almacenan localmente en el navegador (PoC)
- **Privacidad Total**: Tus exámenes nunca salen de tu dispositivo (excepto el texto enviado a OpenAI)
- **API Key en Frontend**: ⚠️ Solo para prueba de concepto - mover a backend en producción
- **Sin Registro**: No se recopila información personal

## 🎯 Casos de Uso

### Para Estudiantes
- Convierte apuntes en exámenes de práctica
- Genera preguntas de estudio desde PDFs de libros
- Practica para exámenes con retroalimentación inmediata
- Utiliza flashcards para memorización

### Para Profesores
- Crea bancos de preguntas rápidamente
- Genera exámenes desde material de curso
- Importa exámenes existentes en formato Aiken
- Reutiliza preguntas entre semestres

### Para Autodidactas
- Convierte artículos y tutoriales en cuestionarios
- Evalúa tu comprensión de contenido
- Crea flashcards de cualquier documento
- Practica con repetición espaciada

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar este proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Ideas para contribuir:**
- Implementar backend con Express/Node.js
- Migrar localStorage a base de datos
- Agregar más formatos de exportación
- Implementar sistema de usuarios
- Mejorar el parsing de PDFs con OCR

## 📝 Formato Aiken

El formato Aiken es un estándar simple para exámenes de opción múltiple:

```
Texto de la pregunta aquí
A) Primera opción
B) Segunda opción
C) Tercera opción
D) Cuarta opción
ANSWER: A
```

**Reglas:**
- Una pregunta por bloque
- Opciones etiquetadas con A), B), C), D) o A. B. C. D.
- `ANSWER:` indica la respuesta correcta
- Línea en blanco entre preguntas

## 🐛 Solución de Problemas

### Error: "API key inválida"
- Verifica que tu `.env` tenga `VITE_OPEN_API_APIKEY=sk-proj-...`
- Asegúrate de reiniciar el servidor después de cambiar `.env`
- Verifica que tu API key de OpenAI sea válida

### Error: "No se pudo generar el examen"
- Revisa tu saldo de créditos en OpenAI
- Verifica tu conexión a internet
- Asegúrate de que el PDF tenga texto extraíble (no imágenes)

### El PDF no se procesa
- Algunos PDFs son solo imágenes escaneadas (usa OCR primero)
- Verifica que el PDF tenga menos de 8000 caracteres de texto
- Intenta con un PDF diferente

### Las preguntas no se guardan
- Verifica que tu navegador permita localStorage
- No uses modo incógnito/privado
- Limpia la caché del navegador si hay problemas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con React, TypeScript y la API de ChatGPT
