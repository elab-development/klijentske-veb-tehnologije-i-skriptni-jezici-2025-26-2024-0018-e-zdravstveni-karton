import type { ReactNode } from "react";
import { Logo } from "./Logo";

interface Props {
  children: ReactNode;
  heroTitle: string;
  heroSubtitle: string;
}

export function AuthLayout({ children, heroTitle, heroSubtitle }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <aside className="relative overflow-hidden bg-primary-600 px-6 py-10 text-white sm:px-10 lg:flex-1 lg:py-16">
        <div className="absolute -left-10 -top-10 size-44 rounded-full bg-primary-400/30" />
        <div className="absolute right-0 top-16 size-56 rounded-full bg-primary-300/20" />
        <div className="absolute -bottom-12 left-1/3 size-72 rounded-full bg-primary-700/40" />

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto lg:mr-12 lg:max-w-md xl:mr-20">
          <Logo variant="light" />
          <div className="mt-10 lg:mt-24">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-4 text-sm text-primary-100 sm:text-base">{heroSubtitle}</p>
          </div>

          <ul className="mt-8 hidden gap-3 text-sm text-primary-100 lg:grid">
            <Bullet>Centralizovani elektronski zdravstveni kartoni</Bullet>
            <Bullet>Brzo zakazivanje pregleda online</Bullet>
            <Bullet>Sigurno čuvanje medicinskih nalaza</Bullet>
          </ul>
        </div>
      </aside>

      <section className="flex-1 bg-white px-6 py-8 sm:px-10 lg:rounded-l-3xl lg:py-16">
        <div className="mx-auto w-full max-w-md lg:ml-12 xl:ml-20">{children}</div>
      </section>
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </span>
      {children}
    </li>
  );
}
