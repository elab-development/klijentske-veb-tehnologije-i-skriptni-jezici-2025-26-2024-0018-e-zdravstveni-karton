import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Home2,
  Hospital,
  LogoutCurve,
  Notification,
  Profile,
  ProfileCircle,
} from "./icons";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { classNames } from "../utils/format";

const navItems = [
  { to: "/", label: "Početna", icon: Home2 },
  { to: "/zakazivanja", label: "Termini", icon: Calendar },
  { to: "/lekari", label: "Lekari", icon: Hospital },
  { to: "/nalazi", label: "Nalazi", icon: Profile },
  { to: "/profil", label: "Profil", icon: ProfileCircle },
];

interface Props {
  children: ReactNode;
}

export function AppShell({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-surface-page lg:flex-row">
      <DesktopSidebar onLogout={logout} />
      <TopBar userInitials={user?.initials() ?? "MK"} userName={user?.fullName() ?? "Korisnik"} />

      <main className="flex-1 px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
        <div className="mx-auto w-full max-w-6xl" key={location.pathname}>
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

function DesktopSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-surface-border bg-white px-4 py-6 lg:flex lg:flex-col">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              classNames(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-ink-soft hover:bg-surface-subtle hover:text-ink",
              )
            }
          >
            <item.icon size="20" variant="Bulk" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-danger-50 hover:text-danger-600"
      >
        <LogoutCurve size="20" variant="Bulk" />
        Odjava
      </button>
    </aside>
  );
}

function TopBar({ userInitials, userName }: { userInitials: string; userName: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-surface-border bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
      <Logo size="sm" />
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifikacije"
          className="relative inline-flex size-9 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-surface-alt"
        >
          <Notification size="18" variant="Bulk" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger-500" />
        </button>
        <Avatar initials={userInitials} alt={userName} size="sm" />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-surface-border bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            classNames(
              "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition",
              isActive ? "text-primary-700" : "text-ink-faint hover:text-ink",
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size="20" variant={isActive ? "Bold" : "Linear"} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
