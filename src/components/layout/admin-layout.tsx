import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ShieldCheck,
  ToggleLeft,
  Gauge,
  ScrollText,
  LifeBuoy,
  Settings,
  Menu,
  Moon,
  Sun,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-context";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Organizations", "/organizations", Building2],
  ["Subscriptions", "/subscriptions", CreditCard],
  ["Access Control", "/access-control", ShieldCheck],
  ["Features", "/features", ToggleLeft],
  ["Usage & Limits", "/usage", Gauge],
  ["Audit Logs", "/audit-logs", ScrollText],
  ["Support", "/support", LifeBuoy],
  ["Settings", "/settings", Settings],
] as const;

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const side = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 px-2">
        <div className="text-lg font-bold tracking-tight text-brand dark:text-indigo-300">
          ABJAD
        </div>

        <div className="text-xs text-slate-500">
          Platform Admin
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive
                ? "bg-brand text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
            AK
          </div>

          <div className="min-w-0 flex-1 text-sm">
            <div className="truncate font-medium">
              Arshil Khan
            </div>

            <div className="truncate text-xs text-slate-500">
              Platform Administrator
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen">
      <div className="hidden md:block">{side}</div>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="z-50">{side}</div>

          <button
            aria-label="Close menu"
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <button
            className="btn md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={16} />
          </button>

          <div className="relative max-w-md flex-1">
            <Search
              size={14}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              className="input w-full pl-9"
              placeholder="Search organizations…"
            />
          </div>

          <button
            className="btn"
            aria-label="Toggle theme"
            onClick={() => setDark((value) => !value)}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="btn"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}