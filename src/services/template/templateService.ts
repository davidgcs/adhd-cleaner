import { Room, Task } from "../../models/types";
import { createId } from "../shared/dateService";

export const frequentRooms: Record<string, string> = {
  baño: "🛁",
  cocina: "🍳",
  dormitorio: "🛏️",
  salón: "🛋️",
  escritorio: "🧑‍💻",
};

const templateByRoom: Record<string, Omit<Task, "id" | "roomId" | "nextDueAt">[]> = {
  baño: [
    {
      title: "Limpiar lavabo",
      description: "Limpieza rápida de superficie",
      frequencyType: "every_x_days",
      frequencyValue: 3,
      preferredTimeRange: "morning",
      estimatedMinutes: 8,
      difficulty: "easy",
      isActive: true,
      pointsReward: 5,
    },
  ],
  cocina: [
    {
      title: "Recoger encimera",
      description: "Eliminar desorden y pasar paño",
      frequencyType: "daily",
      frequencyValue: 1,
      preferredTimeRange: "morning",
      estimatedMinutes: 10,
      difficulty: "easy",
      isActive: true,
      pointsReward: 5,
    },
  ],
  dormitorio: [
    {
      title: "Hacer la cama",
      description: "Rutina diaria breve",
      frequencyType: "daily",
      frequencyValue: 1,
      preferredTimeRange: "morning",
      estimatedMinutes: 5,
      difficulty: "easy",
      isActive: true,
      pointsReward: 5,
    },
    {
      title: "Cambiar sábanas",
      description: "Rutina semanal",
      frequencyType: "weekly",
      frequencyValue: 1,
      preferredTimeRange: "afternoon",
      estimatedMinutes: 20,
      difficulty: "medium",
      isActive: true,
      pointsReward: 10,
    },
  ],
  salón: [
    {
      title: "Ordenar superficie principal",
      description: "Reducir distracciones visuales",
      frequencyType: "weekly",
      frequencyValue: 1,
      preferredTimeRange: "afternoon",
      estimatedMinutes: 12,
      difficulty: "easy",
      isActive: true,
      pointsReward: 5,
    },
  ],
  escritorio: [
    {
      title: "Despejar escritorio",
      description: "Dejar lista el área de foco",
      frequencyType: "daily",
      frequencyValue: 1,
      preferredTimeRange: "morning",
      estimatedMinutes: 7,
      difficulty: "easy",
      isActive: true,
      pointsReward: 5,
    },
  ],
};

export function createTemplateTasks(rooms: Room[]): Task[] {
  return rooms.flatMap((room) =>
    (templateByRoom[room.name] ?? []).map((templateTask) => ({
      ...templateTask,
      id: createId(),
      roomId: room.id,
      nextDueAt: new Date().toISOString(),
    })),
  );
}
