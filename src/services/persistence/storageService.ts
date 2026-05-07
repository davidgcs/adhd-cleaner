import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppData } from "../../models/types";

const STORAGE_KEY = "adhd-cleaner:data:v1";

export function defaultAppData(): AppData {
  return {
    onboarding: {
      completed: false,
      dailyAvailableMinutes: 20,
      preferredNotificationWindow: { startHour: 8, endHour: 20 },
    },
    settings: {
      maxDailyRecommendations: 4,
      preferredMorningFocus: true,
      preferredNotificationWindow: { startHour: 8, endHour: 20 },
    },
    rooms: [],
    tasks: [],
    executions: [],
    customReminders: [],
    notificationHistory: [],
    gamification: {
      totalPoints: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
  };
}

export async function loadAppData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultAppData();
  try {
    return { ...defaultAppData(), ...JSON.parse(raw) };
  } catch {
    return defaultAppData();
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
