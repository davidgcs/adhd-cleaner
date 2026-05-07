import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AppData,
  CustomReminder,
  Room,
  Task,
  TaskExecution,
} from "./src/models/types";
import {
  defaultAppData,
  loadAppData,
  saveAppData,
} from "./src/services/persistence/storageService";
import { createTemplateTasks, frequentRooms } from "./src/services/template/templateService";
import {
  calculateTaskNextDue,
  getMonthlyCalendarSummary,
  getRecommendedTasks,
} from "./src/services/planning/planningService";
import {
  completeTaskAndAward,
  getPointsForDifficulty,
  postponeTask,
} from "./src/services/gamification/gamificationService";
import {
  createTaskReminder,
  fireDueNotificationHistory,
} from "./src/services/notifications/notificationService";
import { createId, formatDay, startOfDayIso } from "./src/services/shared/dateService";

type ScreenKey = "home" | "rooms" | "tasks" | "calendar";

export default function App() {
  const [data, setData] = useState<AppData>(defaultAppData());
  const [isLoading, setIsLoading] = useState(true);
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(startOfDayIso(new Date()));
  const [newRoomName, setNewRoomName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskRoomId, setNewTaskRoomId] = useState("");
  const [newReminderTitle, setNewReminderTitle] = useState("");

  useEffect(() => {
    void (async () => {
      const loaded = await loadAppData();
      setData(loaded);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      void saveAppData(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    setData((previous) => ({
      ...previous,
      notificationHistory: fireDueNotificationHistory(previous.notificationHistory),
    }));
  }, []);

  const recommendedTasks = useMemo(
    () => getRecommendedTasks(data.tasks, data.executions, data.settings, new Date()),
    [data.tasks, data.executions, data.settings],
  );

  const calendarDays = useMemo(
    () => getMonthlyCalendarSummary(data.executions, new Date()),
    [data.executions],
  );

  const selectedDayExecutions = useMemo(
    () =>
      data.executions.filter((execution) => startOfDayIso(new Date(execution.completedAt)) === selectedCalendarDay),
    [data.executions, selectedCalendarDay],
  );

  const roomMap = useMemo(
    () =>
      data.rooms.reduce<Record<string, Room>>((accumulator, room) => {
        accumulator[room.id] = room;
        return accumulator;
      }, {}),
    [data.rooms],
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ADHD Cleaner</Text>
        <Text>Cargando datos locales...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!data.onboarding.completed) {
    return (
      <OnboardingScreen
        onFinish={(selectedRooms, dailyMinutes, notifStart, notifEnd, importTemplate) => {
          const initialRooms = selectedRooms.map((name) => ({
            id: createId(),
            name,
            icon: frequentRooms[name],
            isArchived: false,
          }));
          const initialTasks = importTemplate ? createTemplateTasks(initialRooms) : [];
          const withDueDates = initialTasks.map((task) => ({
            ...task,
            nextDueAt: calculateTaskNextDue(task, new Date()),
          }));
          const history = withDueDates.map((task) => createTaskReminder(task));
          setData((previous) => ({
            ...previous,
            rooms: initialRooms,
            tasks: withDueDates,
            notificationHistory: [...previous.notificationHistory, ...history],
            onboarding: {
              completed: true,
              dailyAvailableMinutes: dailyMinutes,
              preferredNotificationWindow: {
                startHour: notifStart,
                endHour: notifEnd,
              },
            },
            settings: {
              ...previous.settings,
              preferredMorningFocus: dailyMinutes <= 25,
            },
          }));
        }}
      />
    );
  }

  const completeTask = (task: Task) => {
    setData((previous) => {
      const { updatedGamification, bonusApplied, pointsAwarded } = completeTaskAndAward(previous, task);
      const execution: TaskExecution = {
        id: createId(),
        taskId: task.id,
        completedAt: new Date().toISOString(),
        status: "completed",
        pointsAwarded,
        bonusApplied,
      };
      return {
        ...previous,
        tasks: previous.tasks.map((existingTask) =>
          existingTask.id === task.id
            ? {
                ...existingTask,
                lastCompletedAt: execution.completedAt,
                nextDueAt: calculateTaskNextDue(existingTask, new Date()),
              }
            : existingTask,
        ),
        executions: [...previous.executions, execution],
        gamification: updatedGamification,
      };
    });
  };

  const postpone = (task: Task) => {
    setData((previous) => ({
      ...previous,
      tasks: previous.tasks.map((existingTask) =>
        existingTask.id === task.id ? postponeTask(existingTask, 1) : existingTask,
      ),
      executions: [
        ...previous.executions,
        {
          id: createId(),
          taskId: task.id,
          completedAt: new Date().toISOString(),
          status: "skipped",
          pointsAwarded: 0,
          bonusApplied: 0,
        },
      ],
    }));
  };

  const createRoom = () => {
    if (!newRoomName.trim()) return;
    setData((previous) => ({
      ...previous,
      rooms: [
        ...previous.rooms,
        { id: createId(), name: newRoomName.trim(), icon: "🏠", isArchived: false },
      ],
    }));
    setNewRoomName("");
  };

  const createTask = () => {
    if (!newTaskTitle.trim() || !newTaskRoomId) return;
    const task: Task = {
      id: createId(),
      title: newTaskTitle.trim(),
      description: "Nueva tarea personalizada",
      roomId: newTaskRoomId,
      frequencyType: "weekly",
      frequencyValue: 1,
      preferredTimeRange: "morning",
      estimatedMinutes: 10,
      difficulty: "easy",
      isActive: true,
      pointsReward: getPointsForDifficulty("easy"),
      nextDueAt: calculateTaskNextDue({ frequencyType: "weekly", frequencyValue: 1 }, new Date()),
    };
    setData((previous) => ({
      ...previous,
      tasks: [...previous.tasks, task],
      notificationHistory: [...previous.notificationHistory, createTaskReminder(task)],
    }));
    setNewTaskTitle("");
  };

  const duplicateTask = (task: Task) => {
    setData((previous) => ({
      ...previous,
      tasks: [
        ...previous.tasks,
        {
          ...task,
          id: createId(),
          title: `${task.title} (copia)`,
          lastCompletedAt: undefined,
          nextDueAt: calculateTaskNextDue(task, new Date()),
        },
      ],
    }));
  };

  const addCustomReminder = () => {
    if (!newReminderTitle.trim()) return;
    const reminder: CustomReminder = {
      id: createId(),
      title: newReminderTitle.trim(),
      frequencyType: "daily",
      frequencyValue: 1,
      nextFireAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      isSilent: false,
    };
    setData((previous) => ({
      ...previous,
      customReminders: [...previous.customReminders, reminder],
    }));
    setNewReminderTitle("");
  };

  return (
    <View style={styles.appShell}>
      <Text style={styles.title}>ADHD Cleaner</Text>
      <View style={styles.nav}>
        {(["home", "rooms", "tasks", "calendar"] as ScreenKey[]).map((key) => (
          <TabButton key={key} label={key.toUpperCase()} active={screen === key} onPress={() => setScreen(key)} />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {screen === "home" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recomendadas del día</Text>
            <Text style={styles.meta}>
              Puntos: {data.gamification.totalPoints} · Racha: {data.gamification.currentStreak} (máx{" "}
              {data.gamification.bestStreak})
            </Text>
            {recommendedTasks.map((task) => (
              <View key={task.id} style={styles.item}>
                <Text style={styles.itemTitle}>{task.title}</Text>
                <Text>
                  {roomMap[task.roomId]?.icon} {roomMap[task.roomId]?.name} · {task.estimatedMinutes} min ·{" "}
                  {task.difficulty}
                </Text>
                <Text style={styles.meta}>Próxima: {formatDay(task.nextDueAt)}</Text>
                <View style={styles.row}>
                  <SmallButton label="Completar" onPress={() => completeTask(task)} />
                  <SmallButton label="Posponer" onPress={() => postpone(task)} />
                </View>
              </View>
            ))}
          </View>
        )}

        {screen === "rooms" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Habitaciones</Text>
            <View style={styles.row}>
              <TextInput value={newRoomName} onChangeText={setNewRoomName} placeholder="Nueva habitación" style={styles.input} />
              <SmallButton label="Crear" onPress={createRoom} />
            </View>
            {data.rooms.map((room) => (
              <View key={room.id} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {room.icon} {room.name}
                </Text>
                <View style={styles.row}>
                  <SmallButton
                    label={room.isArchived ? "Reactivar" : "Archivar"}
                    onPress={() =>
                      setData((previous) => ({
                        ...previous,
                        rooms: previous.rooms.map((existingRoom) =>
                          existingRoom.id === room.id ? { ...existingRoom, isArchived: !existingRoom.isArchived } : existingRoom,
                        ),
                      }))
                    }
                  />
                  <SmallButton
                    label="Eliminar"
                    onPress={() =>
                      setData((previous) => ({
                        ...previous,
                        rooms: previous.rooms.filter((existingRoom) => existingRoom.id !== room.id),
                      }))
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {screen === "tasks" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tareas recurrentes</Text>
            <TextInput value={newTaskTitle} onChangeText={setNewTaskTitle} placeholder="Nueva tarea" style={styles.input} />
            <Text style={styles.meta}>Asociar habitación:</Text>
            <View style={styles.rowWrap}>
              {data.rooms.map((room) => (
                <SmallButton key={room.id} label={`${room.icon} ${room.name}`} onPress={() => setNewTaskRoomId(room.id)} />
              ))}
            </View>
            <SmallButton label="Crear tarea" onPress={createTask} />
            {data.tasks.map((task) => (
              <View key={task.id} style={styles.item}>
                <Text style={styles.itemTitle}>{task.title}</Text>
                <Text>
                  {task.frequencyType} · cada {task.frequencyValue}
                </Text>
                <Text style={styles.meta}>Fotos antes/después listas para fase 2 en ejecuciones</Text>
                <View style={styles.row}>
                  <SmallButton label="Duplicar" onPress={() => duplicateTask(task)} />
                  <SmallButton
                    label={task.isActive ? "Desactivar" : "Activar"}
                    onPress={() =>
                      setData((previous) => ({
                        ...previous,
                        tasks: previous.tasks.map((existingTask) =>
                          existingTask.id === task.id ? { ...existingTask, isActive: !existingTask.isActive } : existingTask,
                        ),
                      }))
                    }
                  />
                </View>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Recordatorios personalizados</Text>
            <View style={styles.row}>
              <TextInput value={newReminderTitle} onChangeText={setNewReminderTitle} placeholder="Ej: Sacar al perro" style={styles.input} />
              <SmallButton label="Añadir" onPress={addCustomReminder} />
            </View>
            {data.customReminders.map((reminder) => (
              <Text key={reminder.id} style={styles.meta}>
                • {reminder.title} · {reminder.frequencyType}
              </Text>
            ))}
          </View>
        )}

        {screen === "calendar" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Calendario mensual</Text>
            <View style={styles.rowWrap}>
              {calendarDays.map((day) => (
                <Pressable key={day.dateIso} onPress={() => setSelectedCalendarDay(day.dateIso)} style={styles.dayChip}>
                  <Text>{day.dayLabel}</Text>
                  <Text style={styles.meta}>+{day.points}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Detalle del día</Text>
            {selectedDayExecutions.map((execution) => (
              <View key={execution.id} style={styles.item}>
                <Text>{data.tasks.find((task) => task.id === execution.taskId)?.title ?? "Tarea"}</Text>
                <Text>
                  Estado: {execution.status} · Puntos: {execution.pointsAwarded + execution.bonusApplied}
                </Text>
                <Text style={styles.meta}>
                  Marcadores foto: antes {execution.beforePhotoUri ? "✓" : "—"} / después {execution.afterPhotoUri ? "✓" : "—"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

function OnboardingScreen({
  onFinish,
}: {
  onFinish: (selectedRooms: string[], dailyMinutes: number, notificationStart: number, notificationEnd: number, importTemplate: boolean) => void;
}) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(["baño", "cocina", "dormitorio"]);
  const [dailyMinutes, setDailyMinutes] = useState("25");
  const [notificationStart, setNotificationStart] = useState("8");
  const [notificationEnd, setNotificationEnd] = useState("20");
  const [importTemplate, setImportTemplate] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido a ADHD Cleaner</Text>
      <Text style={styles.sectionTitle}>1) Elige habitaciones frecuentes</Text>
      <View style={styles.rowWrap}>
        {Object.keys(frequentRooms).map((roomName) => {
          const active = selectedRooms.includes(roomName);
          return (
            <TabButton
              key={roomName}
              label={`${frequentRooms[roomName]} ${roomName}`}
              active={active}
              onPress={() =>
                setSelectedRooms((previous) =>
                  previous.includes(roomName) ? previous.filter((name) => name !== roomName) : [...previous, roomName],
                )
              }
            />
          );
        })}
      </View>
      <Text style={styles.sectionTitle}>2) Importar plantilla inicial</Text>
      <TabButton label={importTemplate ? "Sí" : "No"} active={importTemplate} onPress={() => setImportTemplate((value) => !value)} />
      <Text style={styles.sectionTitle}>3) Tiempo disponible diario (opcional)</Text>
      <TextInput value={dailyMinutes} onChangeText={setDailyMinutes} style={styles.input} keyboardType="numeric" />
      <Text style={styles.sectionTitle}>4) Ventana preferida de notificaciones</Text>
      <View style={styles.row}>
        <TextInput value={notificationStart} onChangeText={setNotificationStart} style={styles.input} keyboardType="numeric" />
        <TextInput value={notificationEnd} onChangeText={setNotificationEnd} style={styles.input} keyboardType="numeric" />
      </View>
      <SmallButton
        label="Finalizar onboarding"
        onPress={() =>
          onFinish(
            selectedRooms,
            Number(dailyMinutes) || 20,
            Math.max(0, Math.min(23, Number(notificationStart) || 8)),
            Math.max(0, Math.min(23, Number(notificationEnd) || 20)),
            importTemplate,
          )
        }
      />
    </ScrollView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, active && styles.buttonActive]}>
      <Text style={[styles.buttonText, active && styles.buttonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SmallButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appShell: { flex: 1, paddingTop: 48, backgroundColor: "#f7f8fa" },
  container: { flexGrow: 1, padding: 16, gap: 10, backgroundColor: "#f7f8fa" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  nav: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 12, marginBottom: 6 },
  scroll: { padding: 12, gap: 12, paddingBottom: 36 },
  card: { backgroundColor: "white", padding: 12, borderRadius: 10, gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "600", marginTop: 6 },
  item: { borderWidth: 1, borderColor: "#e4e8ee", borderRadius: 8, padding: 8, gap: 4 },
  itemTitle: { fontSize: 15, fontWeight: "600" },
  meta: { color: "#617081", fontSize: 12 },
  button: { backgroundColor: "#e3e8f3", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginVertical: 2 },
  buttonActive: { backgroundColor: "#2f6ad8" },
  buttonText: { fontSize: 13, fontWeight: "600", color: "#243447" },
  buttonTextActive: { color: "white" },
  row: { flexDirection: "row", gap: 6, alignItems: "center", flexWrap: "wrap" },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d8e0eb",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 120,
    flexGrow: 1,
  },
  dayChip: { borderWidth: 1, borderColor: "#d8e0eb", padding: 8, borderRadius: 8, minWidth: 48, alignItems: "center", backgroundColor: "white" },
});
