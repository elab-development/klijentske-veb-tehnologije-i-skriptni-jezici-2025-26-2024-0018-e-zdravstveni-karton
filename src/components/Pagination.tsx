import { ArrowLeft2, ArrowRight2 } from "./icons";
import { classNames } from "../utils/format";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const max = 5;
  let start = Math.max(1, page - Math.floor(max / 2));
  const end = Math.min(totalPages, start + max - 1);
  start = Math.max(1, end - max + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      aria-label="Paginacija"
      className={classNames("flex items-center justify-center gap-1.5", className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-surface-border bg-white text-ink-soft transition hover:bg-surface-subtle disabled:opacity-40"
        aria-label="Prethodna stranica"
      >
        <ArrowLeft2 size="16" />
      </button>
      {start > 1 && (
        <>
          <PageButton page={1} active={false} onClick={() => onChange(1)} />
          {start > 2 && <span className="px-1 text-ink-faint">…</span>}
        </>
      )}
      {pages.map((p) => (
        <PageButton key={p} page={p} active={p === page} onClick={() => onChange(p)} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-ink-faint">…</span>}
          <PageButton page={totalPages} active={false} onClick={() => onChange(totalPages)} />
        </>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-surface-border bg-white text-ink-soft transition hover:bg-surface-subtle disabled:opacity-40"
        aria-label="Sledeća stranica"
      >
        <ArrowRight2 size="16" />
      </button>
    </nav>
  );
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={classNames(
        "inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition",
        active
          ? "bg-primary-600 text-white shadow-soft"
          : "text-ink-soft hover:bg-surface-subtle",
      )}
    >
      {page}
    </button>
  );
}
