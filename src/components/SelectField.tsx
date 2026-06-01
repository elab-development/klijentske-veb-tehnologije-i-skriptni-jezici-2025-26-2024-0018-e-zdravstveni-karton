import type { SelectHTMLAttributes, ReactNode } from "react";
import { classNames } from "../utils/format";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  options: Array<{ value: string; label: string }>;
}

export function SelectField({
  label,
  hint,
  error,
  leftIcon,
  options,
  className,
  id,
  ...rest
}: Props) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={classNames("w-full", className)}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-medium text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-faint">
            {leftIcon}
          </span>
        )}
        <select
          id={selectId}
          className={classNames(
            "w-full appearance-none rounded-xl border bg-surface-subtle px-4 py-3 pr-9 text-sm text-ink outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100",
            leftIcon ? "pl-10" : "",
            error ? "border-danger-500" : "border-surface-border",
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-faint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
}
