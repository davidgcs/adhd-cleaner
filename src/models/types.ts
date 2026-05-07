export type FrequencyType = "daily" | "weekly" | "every_x_days" | "monthly" | "custom";
export type PreferredTimeRange = "morning" | "afternoon" | "evening" | "any";
export type Difficulty = "easy" | "medium" | "hard";
export type TaskStatus = "pending" | "completed" | "skipped" | "overdue";

export interface Room {
  id: string;
  name: string;
  icon: string;
  isArchived: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  roomId: string;
  frequencyType: FrequencyType;
  frequencyValue: number;
  preferredTimeRange: PreferredTimeRange;
  estimatedMinutes: number;
  difficulty: Difficulty;
  isActive: boolean;
  lastCompletedAt?: string;
  nextDueAt: string;
  pointsReward: number;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  completedAt: string;
  status: Exclude<TaskStatus, "pending" | "overdue">;
  pointsAwarded: number;
  bonusApplied: number;
  beforePhotoUri?: string;
  afterPhotoUri?: string;
}

export interface CustomReminder {
  id: string;
  title: string;
  frequencyType: FrequencyType;
  frequencyValue: number;
  nextFireAt: string;
  isSilent: boolean;
}

export interface NotificationHistoryItem {
  id: string;
  sourceType: "task" | "custom";
  sourceId: string;
  message: string;
  scheduledAt: string;
  firedAt?: string;
  silenced: boolean;
}

export interface GamificationState {
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  lastCompletionDay?: string;
}

export interface AppSettings {
  maxDailyRecommendations: number;
  preferredMorningFocus: boolean;
  preferredNotificationWindow: {
    startHour: number;
    endHour: number;
  };
}

export interface OnboardingState {
  completed: boolean;
  dailyAvailableMinutes: number;
  preferredNotificationWindow: {
    startHour: number;
    endHour: number;
  };
}

export interface AppData {
  onboarding: OnboardingState;
  settings: AppSettings;
  rooms: Room[];
  tasks: Task[];
  executions: TaskExecution[];
  customReminders: CustomReminder[];
  notificationHistory: NotificationHistoryItem[];
  gamification: GamificationState;
}
