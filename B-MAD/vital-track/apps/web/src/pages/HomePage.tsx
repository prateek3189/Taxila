import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parseWebEnv } from '@vital-track/config';

type ApiStatus = 'idle' | 'loading' | 'ok' | 'error';

export function HomePage() {
  const { VITE_API_URL } = parseWebEnv({
    VITE_API_URL: import.meta.env.VITE_API_URL,
  });
  const [status, setStatus] = useState<ApiStatus>('idle');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetch(`${VITE_API_URL}/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body) => {
        if (cancelled) return;
        if (body?.success === true && body?.data?.status === 'ok') setStatus('ok');
        else setStatus('error');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [VITE_API_URL]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,148,136,0.18),transparent)]"
        aria-hidden
      />
      <section className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <p className="mb-3 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-600/15">
          Epic 1 foundation · typed API & shared contracts
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Vaccination plans parents trust. Clinics rely on.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          vital-track connects families, caregivers, and verified clinicians with ChildID-based access,
          clear schedules, and auditable immunization records.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/product"
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-500"
          >
            Explore the product
          </Link>
          <a
            className="text-sm font-medium text-teal-700 underline-offset-4 hover:underline"
            href={`${VITE_API_URL.replace(/\/$/, '')}/api/docs`}
            target="_blank"
            rel="noreferrer"
          >
            Open API docs
          </a>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Shared contracts',
              body: 'Zod schemas and TypeScript models live in one package for API and clients.',
            },
            {
              title: 'Consistent API',
              body: 'Standard envelopes, rate limits, and Swagger for every route under /api/v1.',
            },
            {
              title: 'Environment safety',
              body: 'Validated configuration so services fail fast on misconfiguration.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"
            >
              <h2 className="text-sm font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
          <span className="text-sm font-medium text-slate-700">API status</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === 'ok'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20'
                : status === 'error'
                  ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-500/25'
                  : 'bg-slate-100 text-slate-600 ring-1 ring-slate-300/40'
            }`}
          >
            {status === 'idle' || status === 'loading'
              ? 'Checking…'
              : status === 'ok'
                ? 'Reachable'
                : 'Offline — start the API'}
          </span>
          <code className="ml-auto max-w-full truncate text-xs text-slate-500">{VITE_API_URL}</code>
        </div>
      </section>
    </div>
  );
}
