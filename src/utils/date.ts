const SR_MONTHS_SHORT = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "avg", "sep", "okt", "nov", "dec",
];

const SR_MONTHS_LONG = [
  "januar", "februar", "mart", "april", "maj", "jun",
  "jul", "avgust", "septembar", "oktobar", "novembar", "decembar",
];

const SR_WEEKDAYS_SHORT = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];
const SR_WEEKDAYS_LONG = [
  "Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota",
];

export function formatShortDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.getDate()}. ${SR_MONTHS_SHORT[date.getMonth()]}`;
}

export function formatLongDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${SR_WEEKDAYS_LONG[date.getDay()]}, ${date.getDate()}. ${
    SR_MONTHS_LONG[date.getMonth()]
  } ${date.getFullYear()}.`;
}

export function formatDateDot(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}.`;
}

export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nextWeekDays(start: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function weekdayShort(d: Date): string {
  return SR_WEEKDAYS_SHORT[d.getDay()];
}

export function greetingByHour(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Dobro jutro";
  if (h < 18) return "Dobar dan";
  return "Dobro veče";
}

export function timeSlotsFromTo(
  startHour: number,
  endHour: number,
  stepMin: number,
): string[] {
  const slots: string[] = [];
  for (let m = startHour * 60; m < endHour * 60; m += stepMin) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return slots;
}
