import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../utils/format";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  as?: "div" | "section" | "article";
}

export function Card({ className, children, as = "div", ...rest }: Props) {
  const Component = as as "div";
  return (
    <Component
      className={classNames(
        "rounded-2xl border border-surface-border/70 bg-white p-5 shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
