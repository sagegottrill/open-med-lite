import { useCallback, useEffect, useState } from 'react'
import { patientDb, ensurePatientIndexes } from '../db/localDatabase.js'
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

  const loadPatients = useCallback(async () => {
    setLoading(true)
    try {
      await ensurePatientIndexes()
      const res = await patientDb.find({
        selector: { type: 'patient' },
        sort: [{ updatedAt: 'desc' }],
      })
      setPatients(res.docs as PatientPouchDoc[])
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
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPatients()
    const changes = patientDb
      .changes({ since: 'now', live: true })
      .on('change', () => {
        void loadPatients()
      })
    return () => {
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
    const doc = toPatientDoc({
      ...form,
      _id: editingId,
      _rev: editingRev,
    })
    try {
      await patientDb.put(doc)
      resetForm()
      await loadPatients()
      setStatus('Saved to local PouchDB (IndexedDB).')
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
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Patient record</h2>
        <p className="mt-1 text-sm text-slate-500">
          Creates and updates persist to <code className="text-xs">openmed_patients</code> via{' '}
          <code className="text-xs">db.put()</code>.
        </p>
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {editingId ? 'Update patient' : 'Save patient'}
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
        <h2 className="text-lg font-semibold text-slate-900">Local patient list</h2>
        <p className="mt-1 text-sm text-slate-500">
          Loaded with <code className="text-xs">db.find()</code> / <code className="text-xs">allDocs</code>.
        </p>
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
