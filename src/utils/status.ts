import type { RecordStatus } from "../types";

export type ChipTone = "success" | "warning" | "danger" | "neutral";

export function recordStatusTone(status: RecordStatus | string): ChipTone {
  if (status === "Normalan" || status === "Uredan") return "success";
  if (status === "Proveriti") return "warning";
  if (status === "Abnormalan") return "danger";
  return "neutral";
}
