export function formatRsd(value: number): string {
  return `${value.toLocaleString("sr-RS")} RSD`;
}

export function initialsFromName(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function calcBmi(heightCm?: number, weightKg?: number): number | null {
  if (!heightCm || !weightKg) return null;
  const h = heightCm / 100;
  if (!h) return null;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}
