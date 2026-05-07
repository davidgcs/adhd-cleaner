import { AppData, Difficulty, Task } from "../../models/types";
import { plusDays, sameDay, startOfDayIso } from "../shared/dateService";

export function getPointsForDifficulty(difficulty: Difficulty): number {
  if (difficulty === "easy") return 5;
  if (difficulty === "medium") return 10;
  return 15;
}

export function completeTaskAndAward(data: AppData, task: Task) {
  const pointsAwarded = task.pointsReward || getPointsForDifficulty(task.difficulty);
  const today = startOfDayIso(new Date());
  const completedToday = data.executions.filter(
    (execution) => execution.status === "completed" && sameDay(execution.completedAt, today),
  ).length;
  const bonusApplied = completedToday + 1 >= 3 ? 10 : 0;
  const lastCompletionDay = data.gamification.lastCompletionDay;
  const yesterdayIso = plusDays(new Date(), -1).toISOString();
  const wasYesterday = lastCompletionDay && sameDay(lastCompletionDay, yesterdayIso);
  const currentStreak = lastCompletionDay
    ? sameDay(lastCompletionDay, today)
      ? data.gamification.currentStreak
      : wasYesterday
        ? data.gamification.currentStreak + 1
        : 1
    : 1;

  return {
    pointsAwarded,
    bonusApplied,
    updatedGamification: {
      totalPoints: data.gamification.totalPoints + pointsAwarded + bonusApplied,
      currentStreak,
      bestStreak: Math.max(data.gamification.bestStreak, currentStreak),
      lastCompletionDay: today,
    },
  };
}

export function postponeTask(task: Task, days: number): Task {
  return {
    ...task,
    nextDueAt: plusDays(new Date(task.nextDueAt), Math.max(1, days)).toISOString(),
  };
}
