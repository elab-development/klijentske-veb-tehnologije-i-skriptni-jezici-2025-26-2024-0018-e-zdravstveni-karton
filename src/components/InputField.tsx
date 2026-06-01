import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { classNames } from "../utils/format";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, Props>(function InputField(
  { label, hint, error, leftIcon, rightSlot, className, id, ...rest },
  ref,
) {
  const inputId = id ?? `field-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={classNames("w-full", className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-faint">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={classNames(
            "w-full rounded-xl border bg-surface-subtle px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100",
            leftIcon ? "pl-10" : "",
            rightSlot ? "pr-12" : "",
            error ? "border-danger-500" : "border-surface-border",
          )}
          {...rest}
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});
