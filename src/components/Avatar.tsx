import { classNames } from "../utils/format";

interface Props {
  initials: string;
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tone?: "primary" | "neutral";
  className?: string;
}

const sizes = {
  xs: "size-7 text-[10px]",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-base",
  xl: "size-24 text-xl",
};

export function Avatar({ initials, src, alt, size = "md", tone = "primary", className }: Props) {
  const styles = sizes[size];
  return (
    <div
      className={classNames(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold",
        tone === "primary"
          ? "bg-primary-50 text-primary-700"
          : "bg-surface-alt text-ink-muted",
        styles,
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt ?? initials} className="size-full object-cover" loading="lazy" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
