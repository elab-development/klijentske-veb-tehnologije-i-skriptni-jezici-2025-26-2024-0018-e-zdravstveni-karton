import { classNames } from "../utils/format";

interface Props {
  size?: "sm" | "md";
  className?: string;
  variant?: "dark" | "light";
}

export function Logo({ size = "md", className, variant = "dark" }: Props) {
  const dim = size === "sm" ? "size-7" : "size-9";
  const textCls = variant === "light" ? "text-white" : "text-ink";
  return (
    <span className={classNames("inline-flex items-center gap-2", className)}>
      <span
        className={classNames(
          "inline-flex items-center justify-center rounded-xl bg-primary-600 text-white shadow-soft",
          dim,
        )}
        aria-hidden
      >
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className={classNames("text-base font-extrabold tracking-tight", textCls)}>
        MedKarton
      </span>
    </span>
  );
}
