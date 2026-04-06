import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { patientDb, seedPatientsIfEmpty } from '../db/localDatabase.js'
import type { PouchConflictPayload } from '../pouch/patientConflict'
import {
  emptyPatientForm,
  toPatientDoc,
  type PatientPouchDoc,
} from '../types/patient'

type Props = {
  onPouchConflict: (payload: PouchConflictPayload) => void
}

export function PatientDashboard({ onPouchConflict }: Props) {
  const [patients, setPatients] = useState<PatientPouchDoc[]>([])
  const [form, setForm] = useState(() => emptyPatientForm())
  const [editingRev, setEditingRev] = useState<string | undefined>(undefined)
  const [editingId, setEditingId] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastVerifiedAt, setLastVerifiedAt] = useState<Date | null>(null)

  const loadPatients = useCallback(async () => {
    setLoading(true)
    try {
      await seedPatientsIfEmpty()
      const res = await patientDb.find({
        selector: { type: 'patient' },
        sort: [{ updatedAt: 'desc' }],
      })
      setPatients(res.docs as PatientPouchDoc[])
      setLastVerifiedAt(new Date())
    } catch {
      const all = await patientDb.allDocs({ include_docs: true })
      const docs = all.rows
        .map((r: { doc?: PatientPouchDoc }) => r.doc)
        .filter(
          (d: PatientPouchDoc | undefined): d is PatientPouchDoc =>
            !!d && d.type === 'patient',
        )
      docs.sort((a: PatientPouchDoc, b: PatientPouchDoc) =>
        a.updatedAt < b.updatedAt ? 1 : -1,
      )
      setPatients(docs)
      setLastVerifiedAt(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPatients()
    // Avoid re-querying on every tiny change (keeps INP low)
    let scheduled = 0
    const changes = patientDb.changes({ since: 'now', live: true }).on('change', () => {
      if (scheduled) return
      scheduled = window.setTimeout(() => {
        scheduled = 0
        void loadPatients()
      }, 150)
    })
    return () => {
      if (scheduled) window.clearTimeout(scheduled)
      void changes.cancel()
    }
  }, [loadPatients])

  const resetForm = () => {
    setForm(emptyPatientForm())
    setEditingRev(undefined)
    setEditingId(undefined)
    setStatus(null)
  }

  const startEdit = (p: PatientPouchDoc) => {
    setEditingId(p._id)
    setEditingRev(p._rev)
    setForm({
      type: 'patient',
      patientName: p.patientName,
      patientId: p.patientId,
      allergies: p.allergies,
      notes: p.notes,
      updatedAt: p.updatedAt,
    })
    setStatus(null)
  }

  const savePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    setSyncing(true)
    const doc = toPatientDoc({
      ...form,
      _id: editingId,
      _rev: editingRev,
    })
    try {
      const res = await patientDb.put(doc)
      // Update UI immediately without a full refetch (keeps event handlers snappy)
      const nextDoc: PatientPouchDoc = { ...(doc as PatientPouchDoc), _rev: res.rev }
      startTransition(() => {
        setPatients((prev) => {
          const without = prev.filter((p) => p._id !== nextDoc._id)
          return [nextDoc, ...without]
        })
      })
      resetForm()
      setLastVerifiedAt(new Date())
      setStatus('Committed to local registry.')
    } catch (err: unknown) {
      const statusCode =
        err && typeof err === 'object' && 'status' in err
          ? (err as { status: number }).status
          : 0
      if (statusCode === 409 && editingId) {
        try {
          const current = (await patientDb.get(editingId, {
            conflicts: true,
          })) as PatientPouchDoc & { _conflicts?: string[] }
          const revs = [current._rev as string, ...(current._conflicts ?? [])]
          const versions = (await Promise.all(
            revs.map((rev) => patientDb.get(editingId!, { rev })),
          )) as PatientPouchDoc[]
          onPouchConflict({ docId: editingId, versions })
          setStatus('Conflict detected — choose the correct version in the dialog.')
        } catch {
          setStatus('Save conflict — could not load revisions.')
        }
      } else {
        setStatus(err instanceof Error ? err.message : 'Save failed')
      }
    } finally {
      setSyncing(false)
    }
  }

  const lastVerifiedLabel = useMemo(() => {
    if (!lastVerifiedAt) return 'Local State: Verifying…'
    const diff = Math.max(0, Date.now() - lastVerifiedAt.getTime())
    const mins = Math.floor(diff / 60_000)
    if (mins <= 0) return 'Local State: Verified just now'
    return `Local State: Verified ${mins}m ago`
  }, [lastVerifiedAt])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Clinical Entry</h2>
            <p className="mt-1 text-sm text-slate-500">Offline-first registry update.</p>
          </div>
          {syncing ? (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Syncing to Local Cache…
            </div>
          ) : null}
        </div>
        <form className="mt-4 space-y-4" onSubmit={(e) => void savePatient(e)}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="pn">
              Full name
            </label>
            <input
              id="pn"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.patientName}
              onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="pid">
              Patient ID
            </label>
            <input
              id="pid"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.patientId}
              onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-800" htmlFor="all">
              Allergies (critical)
            </label>
            <textarea
              id="all"
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.allergies}
              onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
              placeholder="e.g. Penicillin — anaphylaxis"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="notes">
              Clinical notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={syncing}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Commit to Local Registry
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Clinical Admissions</h2>
            <p className="mt-1 text-sm text-slate-500">{lastVerifiedLabel}</p>
          </div>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading…</p>
        ) : patients.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No patients yet — add one on the left.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {patients.map((p) => (
              <li key={p._id} className="py-3">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="w-full text-left hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2"
                >
                  <div className="font-medium text-slate-900">{p.patientName}</div>
                  <div className="text-sm text-slate-500">ID: {p.patientId}</div>
                  <div className="text-sm text-red-800 line-clamp-2">
                    Allergies: {p.allergies || '—'}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
