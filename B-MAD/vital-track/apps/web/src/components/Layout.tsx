import { Link, useLocation } from 'react-router-dom';
import { APP_VERSION } from '@vital-track/shared-types';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/product', label: 'Product' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white shadow-sm ring-1 ring-teal-700/10 transition group-hover:bg-teal-500">
              VT
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-800">
              vital-track
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
            {nav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname === to
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} vital-track. Immunization coordination for families and clinics.</p>
          <p className="font-mono text-xs text-slate-400">v{APP_VERSION}</p>
        </div>
      </footer>
    </div>
  );
}
