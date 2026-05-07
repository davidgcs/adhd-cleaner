let localCounter = 0;

export function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  localCounter += 1;
  return `${Date.now()}-${localCounter}`;
}

export function startOfDayIso(date: Date): string {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value.toISOString();
}

export function plusDays(date: Date, days: number): Date {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

export function plusMonths(date: Date, months: number): Date {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

export function sameDay(a: string, b: string): boolean {
  return startOfDayIso(new Date(a)) === startOfDayIso(new Date(b));
}

export function dayDifference(fromIso: string, toIso: string): number {
  const from = new Date(startOfDayIso(new Date(fromIso))).getTime();
  const to = new Date(startOfDayIso(new Date(toIso))).getTime();
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}
