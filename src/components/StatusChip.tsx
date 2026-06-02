import type { ReactNode } from "react";
import { classNames } from "../utils/format";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger";

interface Props {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const tones: Record<Tone, string> = {
  neutral: "bg-surface-alt text-ink-muted",
  primary: "bg-primary-50 text-primary-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
};

export function StatusChip({ tone = "neutral", children, className, icon }: Props) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
