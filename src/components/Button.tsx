import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../utils/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  block?: boolean;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  block,
  loading,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<Variant, string> = {
    primary: "bg-primary-600 text-white shadow-soft hover:bg-primary-700",
    secondary: "border border-surface-border bg-white text-ink hover:bg-surface-subtle",
    ghost: "text-ink-soft hover:bg-surface-subtle",
    danger: "bg-danger-600 text-white hover:bg-danger-700",
  };
  const sizes: Record<Size, string> = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <button
      type="button"
      className={classNames(
        base,
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
