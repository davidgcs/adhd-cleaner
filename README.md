# ADHD Cleaner

Aplicación móvil en React Native + TypeScript para planificación doméstica con foco en TDAH.

## Incluye

- Onboarding inicial con selección de habitaciones, plantilla de tareas, tiempo diario y ventana de notificaciones.
- Gestión de habitaciones (crear, archivar/eliminar) y tareas recurrentes (crear, duplicar, activar/desactivar, completar, posponer).
- Pantalla principal con recomendaciones diarias según vencimiento, dificultad y duración.
- Calendario mensual + detalle diario con estados de ejecución y puntos ganados.
- Gamificación con puntos por dificultad, bonus diario y rachas.
- Recordatorios locales y recordatorios personalizados con historial simple.
- Persistencia local con AsyncStorage.
- Modelo de ejecuciones preparado para fotos antes/después (`beforePhotoUri` y `afterPhotoUri`) para fase 2.

## Estructura modular

- `src/models`: modelos tipados de dominio.
- `src/services/planning`: lógica de planificación y recomendaciones.
- `src/services/gamification`: puntos, bonus y rachas.
- `src/services/notifications`: historial y acciones de recordatorios.
- `src/services/persistence`: carga/guardado local persistente.
- `src/services/template`: plantilla inicial del onboarding.
