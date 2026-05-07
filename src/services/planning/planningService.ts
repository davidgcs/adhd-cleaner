import { AppSettings, Task, TaskExecution } from "../../models/types";
import { dayDifference, plusDays, plusMonths, startOfDayIso } from "../shared/dateService";

export function calculateTaskNextDue(task: Pick<Task, "frequencyType" | "frequencyValue">, from: Date): string {
  const value = Math.max(1, task.frequencyValue || 1);
  const base = new Date(from);
  if (task.frequencyType === "daily") return plusDays(base, value).toISOString();
  if (task.frequencyType === "weekly") return plusDays(base, value * 7).toISOString();
  if (task.frequencyType === "every_x_days") return plusDays(base, value).toISOString();
  if (task.frequencyType === "monthly") return plusMonths(base, value).toISOString();
  return plusDays(base, value).toISOString();
}

function scoreTask(task: Task, now: Date, settings: AppSettings): number {
  const daysToDue = dayDifference(now.toISOString(), task.nextDueAt);
  let score = 0;
  if (daysToDue <= 0) score += 30 + Math.abs(daysToDue);
  if (daysToDue === 1) score += 10;
  if (settings.preferredMorningFocus && now.getHours() < 12 && task.estimatedMinutes <= 12) score += 8;
  if (task.difficulty === "hard") score -= 3;
  return score;
}

export function getRecommendedTasks(
  tasks: Task[],
  _executions: TaskExecution[],
  settings: AppSettings,
  now: Date,
): Task[] {
  const activeTasks = tasks.filter((task) => task.isActive);
  const limit = Math.max(3, Math.min(5, settings.maxDailyRecommendations));
  const sorted = activeTasks.sort((a, b) => scoreTask(b, now, settings) - scoreTask(a, now, settings));

  const selected: Task[] = [];
  let hardCount = 0;
  for (const task of sorted) {
    if (task.difficulty === "hard" && hardCount >= 1) continue;
    selected.push(task);
    if (task.difficulty === "hard") hardCount += 1;
    if (selected.length >= limit) break;
  }
  return selected;
}

export function getMonthlyCalendarSummary(executions: TaskExecution[], dateInMonth: Date) {
  const year = dateInMonth.getFullYear();
  const month = dateInMonth.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }).map((_, index) => {
    const day = new Date(year, month, index + 1);
    const dayIso = startOfDayIso(day);
    const dayExecutions = executions.filter(
      (execution) => startOfDayIso(new Date(execution.completedAt)) === dayIso,
    );
    return {
      dateIso: dayIso,
      dayLabel: String(index + 1),
      points: dayExecutions.reduce((total, execution) => total + execution.pointsAwarded + execution.bonusApplied, 0),
      statuses: dayExecutions.map((execution) => execution.status),
    };
  });
}
