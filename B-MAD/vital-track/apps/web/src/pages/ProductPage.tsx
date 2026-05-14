export function ProductPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product overview</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Epic 1 delivers the monorepo, shared types, API middleware, CI, and these surfaces. Next epics add
        registration, ChildID, vaccination plans, and notifications.
      </p>
      <ul className="mt-8 space-y-4">
        <li className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-800">
            1
          </span>
          <div>
            <p className="font-semibold text-slate-900">Parents & caregivers</p>
            <p className="text-sm text-slate-600">
              Mobile app for child profiles, QR ChildID, approvals, and reminders.
            </p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-800">
            2
          </span>
          <div>
            <p className="font-semibold text-slate-900">Clinicians</p>
            <p className="text-sm text-slate-600">
              Web portal for verified doctors to publish plans and record administrations.
            </p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-800">
            3
          </span>
          <div>
            <p className="font-semibold text-slate-900">Platform</p>
            <p className="text-sm text-slate-600">
              Admin workflows, audit logs, and compliance-ready exports.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
