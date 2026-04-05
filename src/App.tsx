import { Activity } from 'lucide-react'

function App() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-clinical-accent/15 text-clinical-accent ring-1 ring-clinical-accent/25 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/30">
        <Activity className="h-9 w-9" strokeWidth={2} aria-hidden />
      </div>
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-clinical-ink dark:text-white sm:text-4xl">
          OpenMed Lite
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Offline-first clinical record foundation — high contrast, minimal
          chrome, ready for intermittent connectivity.
        </p>
      </div>
      <p className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-500">
        Phase 1 · Architecture
      </p>
    </div>
  )
}

export default App
