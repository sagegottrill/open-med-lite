import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Radio,
  ShieldAlert,
  Wifi,
  WifiOff,
} from 'lucide-react'

type MockConflict = {
  id: string
  patientId: string
  conflictType: string
  timestamp: string
  /** Drives copy in the resolution desk */
  variant: 'penicillin' | 'dose' | 'demographics'
}

const INITIAL_QUEUE: MockConflict[] = [
  {
    id: 'qc-1',
    patientId: 'OML-8824',
    conflictType: 'Allergy Override',
    timestamp: '2 hours ago (Field Tablet B)',
    variant: 'penicillin',
  },
  {
    id: 'qc-2',
    patientId: 'OML-7741',
    conflictType: 'Medication Dose Mismatch',
    timestamp: '45 min ago (Field Tablet A)',
    variant: 'dose',
  },
  {
    id: 'qc-3',
    patientId: 'OML-5503',
    conflictType: 'Demographics Conflict',
    timestamp: '18 min ago (Field Tablet B)',
    variant: 'demographics',
  },
]

export default function OfficerDemoDashboard() {
  const [networkOnline, setNetworkOnline] = useState(false)
  const [queue, setQueue] = useState<MockConflict[]>(INITIAL_QUEUE)
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_QUEUE[0]?.id ?? null)
  const [toast, setToast] = useState<string | null>(null)

  const selected = queue.find((q) => q.id === selectedId) ?? null

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(t)
  }, [toast])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
  }, [])

  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (next.length === 0) {
        setSelectedId(null)
      } else if (selectedId === id) {
        setSelectedId(next[0]?.id ?? null)
      }
      return next
    })
  }

  const handleApproveMerge = () => {
    if (!selected) return
    const isPenicillin = selected.variant === 'penicillin'
    removeFromQueue(selected.id)
    showToast(
      isPenicillin
        ? 'RxDB: Conflict resolved. Record cryptographically sealed and synced.'
        : 'Conflict resolved. Record sealed and queued for sync.',
    )
  }

  const handleRejectIncoming = () => {
    if (!selected) return
    removeFromQueue(selected.id)
    showToast('Incoming sync rejected. Master record retained locally.')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm">
      {/* PANE 1 */}
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/90 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            OpenMed Lite: Triage &amp; Sync
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Human-in-the-loop resolution · Sahel Resilience Stack
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNetworkOnline((o) => !o)}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition sm:w-auto ${
            networkOnline
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-amber-500 text-amber-950 hover:bg-amber-400'
          }`}
        >
          {networkOnline ? (
            <>
              <Wifi className="h-4 w-4 shrink-0" aria-hidden />
              Broadband Restored (Syncing…)
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
              Offline (IndexedDB Cache)
            </>
          )}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* PANE 2 */}
        <aside className="w-full border-b border-slate-200 bg-white lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="sticky top-0 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-800">
              <ClipboardList className="h-5 w-5 text-blue-900" aria-hidden />
              <h2 className="text-sm font-bold uppercase tracking-wide text-blue-950">
                Pending Sync Conflicts
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">Requires officer approval</p>
          </div>
          <ul className="max-h-[40vh] space-y-2 overflow-y-auto p-3 lg:max-h-none">
            {queue.length === 0 ? (
              <li className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-8 text-center text-sm text-slate-500">
                No items in queue
              </li>
            ) : (
              queue.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`flex w-full flex-col gap-1 rounded-lg border px-3 py-3 text-left transition active:scale-[0.99] ${
                      selectedId === c.id
                        ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-200'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {c.patientId}
                    </span>
                    <span className="text-xs font-medium text-amber-800">{c.conflictType}</span>
                    <span className="text-[11px] text-slate-500">{c.timestamp}</span>
                    <span className="mt-1 flex items-center text-[11px] font-medium text-blue-800">
                      Review
                      <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden />
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* PANE 3 */}
        <main className="min-h-[320px] flex-1 bg-slate-50/50 p-4 sm:p-6">
          {queue.length === 0 ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-emerald-200 bg-white px-6 py-12 text-center shadow-inner">
              <CheckCircle className="mb-4 h-16 w-16 text-emerald-600" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900">Queue Clear</h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                All local states synchronized. Automated merge was not applied to critical fields
                without your review.
              </p>
            </div>
          ) : !selected ? (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
              Select a conflict from the queue to open the resolution desk.
            </div>
          ) : (
            <ResolutionDesk
              conflict={selected}
              onApprove={handleApproveMerge}
              onReject={handleRejectIncoming}
            />
          )}
        </main>
      </div>

      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-50 flex max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border border-slate-200 bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
          role="status"
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  )
}

function ResolutionDesk({
  conflict,
  onApprove,
  onReject,
}: {
  conflict: MockConflict
  onApprove: () => void
  onReject: () => void
}) {
  const pen = conflict.variant === 'penicillin'

  const masterLabel = pen
    ? 'Current Record — Penicillin Allergy: NO'
    : conflict.variant === 'dose'
      ? 'Current Record — Metformin: 500mg BID'
      : 'Current Record — DOB: 1988-03-12'

  const incomingLabel = pen
    ? 'Incoming Update — Penicillin Allergy: YES (Severity: Anaphylaxis)'
    : conflict.variant === 'dose'
      ? 'Incoming Update — Metformin: 1000mg BID'
      : 'Incoming Update — DOB: 1988-12-03'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-2">
        <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-slate-900">Resolution desk</h2>
          <p className="text-xs text-slate-500">
            Patient <span className="font-mono font-semibold">{conflict.patientId}</span> ·{' '}
            {conflict.conflictType}
          </p>
        </div>
      </div>

      <div
        className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        role="alert"
      >
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <p>
          <strong>Automated CRDT merge halted.</strong> Conflicting critical medical data detected.
          Review both sides before merging.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-0 md:divide-x md:divide-slate-200">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-r-none md:border-r-0">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <Radio className="h-4 w-4" aria-hidden />
            Master DB
          </div>
          <p className="text-base font-semibold leading-relaxed text-slate-800">{masterLabel}</p>
          <p className="mt-3 text-xs text-slate-500">Authoritative copy on clinic server snapshot.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm md:rounded-l-none md:border-l-0">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <WifiOff className="h-4 w-4" aria-hidden />
            Incoming Sync
          </div>
          <p className="text-base font-semibold leading-relaxed text-slate-900">{incomingLabel}</p>
          <p className="mt-3 text-xs text-slate-600">Captured on field tablet while offline.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onReject}
          className="order-2 w-full rounded-lg border border-red-200 bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-700 active:bg-red-800 sm:order-1 sm:w-auto"
        >
          Reject Incoming Data
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="order-1 w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 sm:order-2 sm:w-auto"
        >
          Approve &amp; Merge
        </button>
      </div>
    </div>
  )
}
