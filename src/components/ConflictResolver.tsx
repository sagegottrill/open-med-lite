import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { PatientPouchDoc } from '../types/patient'

export type ConflictResolverProps = {
  open: boolean
  docId: string
  versionA: PatientPouchDoc
  versionB: PatientPouchDoc
  onResolve: (chosen: PatientPouchDoc) => Promise<void>
  onDismiss: () => void
}

function stripMeta(doc: PatientPouchDoc): PatientPouchDoc {
  return {
    _id: doc._id,
    type: 'patient',
    patientName: doc.patientName,
    patientId: doc.patientId,
    allergies: doc.allergies,
    notes: doc.notes,
    updatedAt: doc.updatedAt,
  }
}

export function ConflictResolver({
  open,
  docId,
  versionA,
  versionB,
  onResolve,
  onDismiss,
}: ConflictResolverProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const pick = async (which: 'a' | 'b') => {
    setBusy(true)
    setError(null)
    try {
      const raw = which === 'a' ? versionA : versionB
      await onResolve(stripMeta(raw))
      onDismiss()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Merge failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-title"
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-8 w-8 shrink-0 text-amber-600" aria-hidden />
          <div>
            <h2 id="conflict-title" className="text-xl font-bold text-slate-900">
              Clinical conflict — manual merge required
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              PouchDB detected conflicting revisions for <code className="rounded bg-slate-100 px-1">{docId}</code>.
              Last-write-wins is <strong>not</strong> used for safety. Pick the clinically accurate record.
            </p>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 md:divide-x md:divide-slate-200">
          <div className="md:pr-4">
            <h3 className="mb-3 font-semibold text-slate-800">Version A</h3>
            <ConflictPanel doc={versionA} />
            <button
              type="button"
              disabled={busy}
              onClick={() => void pick('a')}
              className="mt-4 w-full rounded-lg bg-amber-600 py-2.5 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Use version A (clinically correct)
            </button>
          </div>
          <div className="md:pl-4">
            <h3 className="mb-3 font-semibold text-slate-800">Version B</h3>
            <ConflictPanel doc={versionB} />
            <button
              type="button"
              disabled={busy}
              onClick={() => void pick('b')}
              className="mt-4 w-full rounded-lg bg-sky-700 py-2.5 font-medium text-white hover:bg-sky-800 disabled:opacity-50"
            >
              Use version B (clinically correct)
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={onDismiss}
          className="mt-6 text-sm text-slate-500 underline hover:text-slate-700"
        >
          Dismiss (resolve later)
        </button>
      </div>
    </div>
  )
}

function ConflictPanel({ doc }: { doc: PatientPouchDoc }) {
  return (
    <dl className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
      <div>
        <dt className="font-medium text-slate-500">Name</dt>
        <dd className="text-slate-900">{doc.patientName}</dd>
      </div>
      <div>
        <dt className="font-medium text-slate-500">Patient ID</dt>
        <dd className="text-slate-900">{doc.patientId}</dd>
      </div>
      <div>
        <dt className="font-medium text-red-700">Allergies</dt>
        <dd className="font-medium text-slate-900">{doc.allergies || '—'}</dd>
      </div>
      <div>
        <dt className="font-medium text-slate-500">Notes</dt>
        <dd className="whitespace-pre-wrap text-slate-900">{doc.notes || '—'}</dd>
      </div>
      <div>
        <dt className="font-medium text-slate-500">Updated</dt>
        <dd className="text-slate-600">{doc.updatedAt}</dd>
      </div>
    </dl>
  )
}
