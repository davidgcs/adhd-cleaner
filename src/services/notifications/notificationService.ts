import { NotificationHistoryItem, Task } from "../../models/types";
import { createId, plusDays } from "../shared/dateService";

export function createTaskReminder(task: Task): NotificationHistoryItem {
  return {
    id: createId(),
    sourceType: "task",
    sourceId: task.id,
    message: `Recordatorio: ${task.title}`,
    scheduledAt: task.nextDueAt,
    silenced: false,
  };
}

export function fireDueNotificationHistory(history: NotificationHistoryItem[]): NotificationHistoryItem[] {
  const now = new Date().toISOString();
  return history.map((item) =>
    !item.firedAt && !item.silenced && item.scheduledAt <= now ? { ...item, firedAt: now } : item,
  );
}

export function silenceNotification(history: NotificationHistoryItem[], id: string): NotificationHistoryItem[] {
  return history.map((item) => (item.id === id ? { ...item, silenced: true } : item));
}

export function rescheduleNotification(
  history: NotificationHistoryItem[],
  id: string,
  days: number,
): NotificationHistoryItem[] {
  return history.map((item) =>
    item.id === id
      ? { ...item, scheduledAt: plusDays(new Date(item.scheduledAt), Math.max(1, days)).toISOString(), firedAt: undefined }
      : item,
  );
}
