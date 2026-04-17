import type { Vaccine } from "../types";
import { getToday, daysDiff } from "./date";

export type VaccineStatus = "done" | "optional" | "overdue" | "upcoming";
export type FilterType = "all" | "public" | "self-paid" | "done" | "upcoming";

export function getStatus(v: Vaccine): VaccineStatus {
  if (v.done) return "done";
  if (!v.scheduled_date) return "optional";
  const scheduled = new Date(v.scheduled_date);
  scheduled.setHours(0, 0, 0, 0);
  const today = getToday();
  if (scheduled < today) return "overdue";
  return "upcoming";
}

export function findNextVaccine(vaccines: Vaccine[]): Vaccine | null {
  const upcoming = vaccines
    .filter((v) => !v.done && v.scheduled_date)
    .sort(
      (a, b) =>
        new Date(a.scheduled_date!).getTime() -
        new Date(b.scheduled_date!).getTime()
    );
  // Find the first vaccine whose scheduled date is >= today
  const today = getToday();
  const future = upcoming.filter((v) => {
    const d = new Date(v.scheduled_date!);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });
  return future.length > 0 ? future[0] : upcoming.length > 0 ? upcoming[0] : null;
}

export function filterVaccines(vaccines: Vaccine[], filter: FilterType): Vaccine[] {
  switch (filter) {
    case "public":
      return vaccines.filter((v) => v.type === "public");
    case "self-paid":
      return vaccines.filter((v) => v.type === "self-paid");
    case "done":
      return vaccines.filter((v) => v.done);
    case "upcoming":
      return vaccines.filter((v) => !v.done);
    default:
      return vaccines;
  }
}

export function getVaccineDate(v: Vaccine): string | null {
  return v.done ? v.done_date : v.scheduled_date;
}

export function getDaysUntilText(v: Vaccine): string {
  if (v.done || !v.scheduled_date) return "";
  const today = getToday();
  const d = daysDiff(today, new Date(v.scheduled_date));
  if (d > 0) return `(${d} \u5929\u5F8C)`;
  if (d === 0) return "(\u4ECA\u5929!)";
  return `(\u5DF2\u904E ${Math.abs(d)} \u5929)`;
}

export function wasEdited(v: Vaccine): boolean {
  // Compare updated_at and created_at — if different (by more than 1 second), consider edited
  const updated = new Date(v.updated_at).getTime();
  const created = new Date(v.created_at).getTime();
  return Math.abs(updated - created) > 1000;
}
