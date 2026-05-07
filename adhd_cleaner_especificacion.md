# Especificación de producto: ADHD Cleaner

Documento de requisitos funcionales y técnicos para desarrollar una aplicación móvil en React Native orientada a planificación doméstica, recordatorios, gamificación y apoyo visual mediante fotos de antes y después.

## Objetivo del producto

ADHD Cleaner es una aplicación móvil pensada para ayudar a personas con dificultades de organización a mantener una rutina de limpieza sostenible mediante tareas pequeñas, recordatorios oportunos y visualización del progreso.

La idea base del documento original es recomendar acciones sencillas del hogar a lo largo del día, repetirlas según frecuencia, registrar la actividad en un calendario y reforzar la motivación con puntos, rachas y evidencias visuales del antes y después.

## Problema que resuelve

El documento original describe un caso en el que una persona tiene problemas para organizar una rutina de limpieza y necesita que la aplicación le diga qué hacer, cuándo hacerlo y cómo ver el avance acumulado a lo largo del tiempo.

La necesidad principal no es solo gestionar tareas, sino reducir fricción mental, evitar la sobrecarga de decisiones y convertir la limpieza en una secuencia de acciones pequeñas y repetibles.

## Usuario objetivo

El producto está dirigido principalmente a personas con dificultades para sostener hábitos domésticos, incluyendo perfiles con TDAH, personas que viven solas, estudiantes o usuarios que se sienten abrumados por tareas del hogar.

La interfaz debe priorizar claridad, baja fricción, feedback inmediato y sesiones cortas de uso, ya que el documento original pone el foco en tareas sencillas repartidas durante el día.

## Propuesta de valor

La aplicación combina cuatro elementos principales ya presentes en el borrador original: calendario, selección de tareas por estancia o actividad, recordatorios y una capa de motivación con puntos, rachas e integración futura con IA.

El elemento diferencial más claro es el registro visual del progreso mediante fotos de antes y después asociadas al calendario del día en que se realizó la limpieza.

## Alcance funcional

### Funciones principales

A partir del documento original, el alcance funcional mínimo debería incluir las siguientes capacidades:

- Calendario con tareas programadas y completadas.
- Gestión de actividades o habitaciones a limpiar.
- Recordatorios personalizados, incluyendo ejemplos como sacar al perro.
- Sistema de puntos y rachas.
- Registro de fotos de antes y después.
- Recomendaciones de productos de limpieza.
- Vídeos tutoriales de limpieza.
- Posible integración con playlists de música.
- Posible integración futura con IA.

### Prioridades por fases

Para que el desarrollo sea viable, conviene dividir el alcance en fases. El borrador original mezcla ideas de MVP con ideas de crecimiento, así que esta versión las separa para que un equipo o agente de IA pueda ejecutar el trabajo con menos ambigüedad.

| Fase | Funcionalidades |
|---|---|
| MVP | Habitaciones, tareas, calendario, recordatorios, completar tareas, puntos básicos, rachas básicas  |
| V1 | Fotos antes/después, histórico visual, recordatorios personalizados, reglas de frecuencia avanzadas  |
| V2 | Recomendaciones de productos, tutoriales, playlists, personalización más avanzada  |
| Futuro IA | Planificación automática, mensajes motivacionales, sugerencias adaptativas  |

## Caso de uso principal

El ejemplo del documento original presenta a Juan, que necesita que la app le recomiende tareas domésticas pequeñas según el momento del día y con distinta frecuencia, como hacer la cama a diario, limpiar el baño cada dos semanas o cambiar las sábanas cada domingo.

Ese caso de uso debe formalizarse como flujo principal del producto porque define la lógica central: configurar tareas, recibir recomendaciones, registrar antes/después y revisar el progreso en calendario.

### Flujo principal

1. El usuario instala la aplicación y completa un onboarding básico.
2. Define habitaciones y tareas iniciales o acepta una plantilla predeterminada.
3. Configura frecuencia, horario sugerido y recordatorios.
4. La aplicación propone tareas para el día.
5. El usuario inicia una tarea y puede tomar una foto de antes.
6. Al terminar, marca la tarea como completada y puede tomar una foto de después.
7. El calendario registra la actividad, el progreso y la recompensa obtenida.

## Requisitos funcionales detallados

### 1. Onboarding

La primera apertura debe permitir configurar rápidamente la casa y evitar una experiencia vacía. El borrador original no define este flujo, pero es necesario para que el producto sea utilizable desde el primer día.

Requisitos:

- Selección de habitaciones frecuentes: baño, cocina, dormitorio, salón, escritorio.
- Importación de plantilla inicial de tareas.
- Pregunta opcional sobre tiempo disponible al día.
- Configuración de ventana horaria preferida para notificaciones.

### 2. Gestión de habitaciones

El documento menciona elegir entre diferentes actividades o habitaciones para limpiar, por lo que deben existir entidades editables para representar ese dominio.

Requisitos:

- Crear habitación.
- Editar nombre e icono de habitación.
- Archivar o eliminar habitación.
- Asociar tareas a cada habitación.

### 3. Gestión de tareas

Las tareas son el núcleo del sistema y deben admitir reglas de repetición suficientemente claras para cubrir los ejemplos del documento original.

Campos recomendados para cada tarea:

- `id`
- `title`
- `description`
- `roomId`
- `frequencyType` (daily, weekly, every_x_days, monthly, custom)
- `frequencyValue`
- `preferredTimeRange`
- `estimatedMinutes`
- `difficulty`
- `isActive`
- `lastCompletedAt`
- `nextDueAt`
- `pointsReward`

Acciones requeridas:

- Crear tarea.
- Editar tarea.
- Duplicar tarea.
- Desactivar tarea.
- Marcar tarea como completada o pospuesta.

### 4. Planificación diaria

La app debe decidir qué tareas mostrar cada día sin saturar al usuario. Esta parte no está definida técnicamente en el borrador, pero es crucial para que una IA o un desarrollador implementen el comportamiento esperado.

Reglas iniciales sugeridas:

- Priorizar tareas vencidas o próximas a vencer.
- Limitar recomendaciones diarias a un máximo configurable, por ejemplo entre 3 y 5.
- Dar prioridad a tareas cortas por la mañana si el usuario suele completar más acciones en ese horario.
- Evitar recomendar demasiadas tareas de alta dificultad el mismo día.

### 5. Recordatorios y notificaciones

El documento original menciona recordatorios de limpieza y recordatorios personalizados como sacar al perro, por lo que el sistema de notificaciones debe cubrir ambos escenarios.

Requisitos:

- Recordatorio automático para tareas programadas.
- Recordatorios personalizados independientes de limpieza.
- Repetición diaria, semanal o personalizada.
- Opción de silenciar o reprogramar.
- Historial simple de notificaciones disparadas.

### 6. Calendario

El calendario es una de las funciones explícitas del documento y debe actuar como panel principal de seguimiento.

Requisitos:

- Vista mensual.
- Vista diaria con detalle de tareas.
- Estado visual por tarea: pendiente, completada, omitida, vencida.
- Indicadores de puntos obtenidos por día.
- Miniaturas o marcadores para fotos antes/después asociadas a una tarea completada.

### 7. Fotos antes y después

La captura de imágenes es uno de los componentes más distintivos del concepto y debe definirse con claridad para facilitar su desarrollo.

Requisitos:

- Capturar foto antes de iniciar la tarea.
- Capturar foto después de completar la tarea.
- Asociar ambas imágenes al registro de ejecución de tarea.
- Mostrar comparación visual en la vista de detalle.
- Reflejar el contenido en el calendario del día correspondiente.

### 8. Gamificación

El documento menciona points earning y una forma de castigo al perder la racha, por lo que conviene convertir esas ideas en reglas concretas y no ambiguas.

Requisitos:

- Asignar puntos por completar tareas.
- Permitir bonus por completar varias tareas el mismo día.
- Mantener racha actual y mejor racha histórica.
- Definir pérdida de racha cuando no se cumple el mínimo diario.
- Mostrar feedback negativo suave al perder la racha, evitando una UX agresiva.

Ejemplo de reglas iniciales:

- Tarea fácil: 5 puntos.
- Tarea media: 10 puntos.
- Tarea difícil: 15 puntos.
- Bonus de día completo: 10 puntos extra.
- Racha diaria: al menos 1 tarea completada por día.

### 9. Contenido adicional

El documento original propone recomendaciones de productos, vídeos tutoriales y compatibilidad con playlists de música, pero estas capacidades deberían tratarse como extensiones y no como bloqueo del MVP.

Requisitos V1 o V2:

- Ficha con productos recomendados por tipo de tarea.
- Enlaces a vídeos tutoriales de limpieza.
- Enlace profundo para abrir una playlist al comenzar una sesión de limpieza.

### 10. IA futura

La referencia a posible integración con IA es demasiado abierta en el borrador original, por lo que conviene concretarla como backlog futuro.

Posibles capacidades:

- Generar plan semanal adaptado a tiempo disponible.
- Sugerir tareas según contexto, frecuencia y energía estimada.
- Redactar mensajes motivacionales personalizados.
- Recomendar reequilibrio de carga doméstica según tareas atrasadas.

## Requisitos no funcionales

Aunque el documento original no entra en detalle técnico, para poder desarrollar correctamente hacen falta restricciones no funcionales mínimas.

- Aplicación móvil multiplataforma con React Native.
- Código en TypeScript.
- Interfaz simple y de baja carga cognitiva.
- Persistencia local robusta para funcionamiento offline.
- Buen manejo de permisos de cámara, notificaciones y almacenamiento.
- Rendimiento suficiente en dispositivos de gama media.
- Trazabilidad de errores mediante logging básico.

## Recomendación técnica inicial

Para una primera versión, la opción más razonable es empezar con almacenamiento local y arquitectura preparada para sincronización futura. Esta decisión no aparece cerrada en el documento original, pero encaja mejor con una fase de prueba de concepto rápida como la que propone su hoja de ruta.

Stack recomendado:

- React Native con TypeScript.
- Expo si se quiere acelerar prototipado, o React Native CLI si se prioriza mayor control nativo.
- Navegación con React Navigation.
- Estado global con Zustand.
- Persistencia local con SQLite.
- Notificaciones locales.
- Cámara y galería mediante librerías compatibles con la opción elegida.

## Modelo de datos sugerido

Para que una IA pueda generar código con menor ambigüedad, conviene definir entidades explícitas desde el documento.

### Entidad UserSettings

```ts
interface UserSettings {
  preferredLanguage: 'es' | 'en';
  dailyTaskLimit: number;
  notificationStartHour: string;
  notificationEndHour: string;
  streakMinimumTasksPerDay: number;
  enablePunisher: boolean;
  enableMusicShortcut: boolean;
}
```

### Entidad Room

```ts
interface Room {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  archivedAt?: string | null;
}
```

### Entidad Task

```ts
interface Task {
  id: string;
  title: string;
  description?: string;
  roomId?: string | null;
  frequencyType: 'daily' | 'weekly' | 'every_x_days' | 'monthly' | 'custom';
  frequencyValue?: number | null;
  preferredTimeRange?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  estimatedMinutes?: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  pointsReward: number;
  isActive: boolean;
  lastCompletedAt?: string | null;
  nextDueAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Entidad TaskExecution

```ts
interface TaskExecution {
  id: string;
  taskId: string;
  scheduledFor: string;
  startedAt?: string | null;
  completedAt?: string | null;
  status: 'pending' | 'completed' | 'skipped' | 'expired';
  pointsEarned: number;
  beforePhotoUri?: string | null;
  afterPhotoUri?: string | null;
  notes?: string;
}
```

### Entidad CustomReminder

```ts
interface CustomReminder {
  id: string;
  title: string;
  description?: string;
  scheduleRule: string;
  isActive: boolean;
  createdAt: string;
}
```

### Entidad StreakStats

```ts
interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
  lastActiveDate?: string | null;
}
```

## Estructura de pantallas

Una IA de desarrollo necesita también una propuesta concreta de navegación, porque el documento original solo enumera funciones sin mapearlas a interfaz.

Pantallas sugeridas:

- Splash / carga inicial.
- Onboarding.
- Home con tareas recomendadas del día.
- Calendario.
- Lista de tareas.
- Detalle de tarea.
- Crear/editar tarea.
- Habitaciones.
- Estadísticas y rachas.
- Ajustes.
- Recordatorios personalizados.
- Historial visual antes/después.

## Criterios de aceptación iniciales

Para facilitar desarrollo por agentes de IA, cada módulo importante debería tener criterios verificables de aceptación.

### Gestión de tareas

- El usuario puede crear una tarea con título, frecuencia y dificultad.
- La tarea aparece en la lista general y en el calendario cuando corresponde.
- El usuario puede marcarla como completada.

### Recordatorios

- El usuario puede crear un recordatorio personalizado.
- El sistema dispara una notificación local en la hora configurada.
- El recordatorio puede reprogramarse o desactivarse.

### Fotos antes/después

- El usuario puede guardar una imagen antes y una después.
- Ambas quedan asociadas a una ejecución de tarea.
- El calendario muestra que ese día existe evidencia visual de la limpieza.

### Gamificación

- Al completar una tarea se suman puntos.
- La racha aumenta si se cumple el mínimo diario.
- La racha se rompe si no se cumple el mínimo definido.

## Backlog priorizado

### MVP

- Onboarding básico.
- CRUD de habitaciones.
- CRUD de tareas.
- Frecuencias simples.
- Home diaria con recomendaciones.
- Calendario básico.
- Notificaciones locales.
- Puntos y racha básica.

### Versión 1

- Fotos antes/después.
- Vista detalle de progreso por día.
- Recordatorios personalizados.
- Mejoras visuales del calendario.
- Persistencia más robusta y exportación básica de datos.

### Versiones posteriores

- Tutoriales de limpieza.
- Productos recomendados.
- Integración con música.
- IA de planificación y personalización.

## Riesgos y decisiones abiertas

El borrador original incluye ideas valiosas pero todavía abiertas, por lo que es importante registrar decisiones pendientes antes de construir.

Preguntas abiertas:

- ¿La primera versión será solo local u ofrecerá sincronización en la nube?
- ¿Las fotos deben almacenarse indefinidamente o con políticas de limpieza?
- ¿Habrá cuentas de usuario o uso anónimo?
- ¿La gamificación debe ser amable o más exigente?
- ¿Las recomendaciones de productos serán manuales, afiliadas o inteligentes?

## Hoja de ruta revisada

La hoja de ruta del documento original propone investigar, crear una prueba de concepto, probar en dispositivos, añadir funciones y después desplegar, pero no prioriza dependencias entre módulos.

Versión reorganizada:

1. Investigación de mercado y benchmarking.
2. Inicialización del repositorio con React Native y TypeScript.
3. Implementación de modelos de datos, navegación y almacenamiento local.
4. Desarrollo del MVP funcional: tareas, habitaciones, calendario y notificaciones.
5. Beta interna en dispositivos reales.
6. Añadir fotos antes/después y gamificación avanzada.
7. Evaluar backend, monetización y opciones de crecimiento.
8. Publicar versión 1 en tiendas.

## Prompt base para una IA de desarrollo

El siguiente bloque sirve como entrada para un agente de IA que vaya a generar el proyecto:

```text
Construye una app móvil en React Native con TypeScript llamada ADHD Cleaner. Debe incluir onboarding, gestión de habitaciones, gestión de tareas recurrentes, calendario mensual, recordatorios locales, puntos, rachas y una pantalla principal con tareas recomendadas del día. Usa almacenamiento local persistente y arquitectura modular escalable. Define modelos tipados, navegación clara, componentes reutilizables y servicios separados para planificación, notificaciones, persistencia y gamificación. Prepara el sistema para añadir fotos antes/después en una segunda fase sin romper la estructura.
```

## Resultado esperado de esta especificación

Con este documento, un equipo técnico o un agente de IA puede interpretar mejor el producto, separar MVP de ideas futuras, identificar entidades de dominio, diseñar pantallas, implementar lógica de planificación y construir una base mantenible sin depender únicamente de notas sueltas del borrador inicial.
