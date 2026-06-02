import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { classNames } from "../utils/format";

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  actionLabel,
  actionTo,
  onAction,
  className,
}: Props) {
  return (
    <div className={classNames("mb-4 flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
      </div>
      {action
        ? action
        : actionLabel && actionTo
        ? (
          <Link
            to={actionTo}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            {actionLabel} →
          </Link>
        )
        : actionLabel && onAction
        ? (
          <button
            type="button"
            onClick={onAction}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            {actionLabel} →
          </button>
        )
        : null}
    </div>
  );
}
