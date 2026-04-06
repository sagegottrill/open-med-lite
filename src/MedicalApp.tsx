import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ConflictResolver } from './components/ConflictResolver'
import { PatientDashboard } from './components/PatientDashboard'
import { initDB, type ConflictDoc } from './db'
import { patientDb } from './db/localDatabase.js'
import {
  applyPouchWinner,
  subscribePouchConflicts,
  type PouchConflictPayload,
} from './pouch/patientConflict'
import { ConflictDeskPage, ConflictDeskBadge } from './pages/ConflictDeskPage'
import OfficerDemoDashboard from './pages/OfficerDemoDashboard'
import type { PatientPouchDoc } from './types/patient'
import type { RxDocument } from 'rxdb'

export default function MedicalApp() {
  const location = useLocation()
  const [rxConflicts, setRxConflicts] = useState<ConflictDoc[]>([])
  const [pouchConflict, setPouchConflict] = useState<PouchConflictPayload | null>(null)

  useEffect(() => {
    let sub: { unsubscribe: () => void } | undefined
    void initDB().then((database) => {
      sub = database.conflicts.find().$.subscribe((docs: RxDocument<ConflictDoc>[]) => {
        setRxConflicts(docs.map((d) => d.toJSON() as ConflictDoc))
      })
    })
    return () => sub?.unsubscribe()
  }, [])

  useEffect(() => {
    return subscribePouchConflicts(patientDb, (payload) => {
      if (payload.versions.length >= 2) {
        setPouchConflict(payload)
      }
    })
  }, [])

  const showResolver =
    pouchConflict !== null && pouchConflict.versions.length >= 2

  const body = useMemo(() => {
    switch (location.pathname) {
      case '/demo':
      case '/officer-dashboard':
        return <OfficerDemoDashboard />
      case '/patients':
        return <PatientDashboard onPouchConflict={setPouchConflict} />
      case '/desk':
        return <ConflictDeskPage />
      default:
        return (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
            Unknown route. Use the navigation above.
          </div>
        )
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OpenMed Lite</h1>
          <p className="mt-1 text-slate-500">Offline-First Clinical Records</p>
        </div>
        <ConflictDeskBadge count={rxConflicts.length} />
      </header>

      <nav className="mb-8 flex flex-wrap gap-6 text-sm font-medium">
        <NavLink
          to="/demo"
          end
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-slate-900 pb-1 text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }
        >
          Live demo (Triage)
        </NavLink>
        <NavLink
          to="/patients"
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-slate-900 pb-1 text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }
        >
          Patient Registry
        </NavLink>
        <NavLink
          to="/desk"
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-slate-900 pb-1 text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }
        >
          Conflict Resolution
        </NavLink>
        <NavLink
          to="/"
          className="ml-auto inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          Landing
        </NavLink>
      </nav>

      {body}

      {showResolver ? (
        <ConflictResolver
          open
          docId={pouchConflict!.docId}
          versionA={pouchConflict!.versions[0]}
          versionB={pouchConflict!.versions[1]}
          onResolve={async (chosen) => {
            await applyPouchWinner(patientDb, pouchConflict!.docId, chosen as PatientPouchDoc)
          }}
          onDismiss={() => setPouchConflict(null)}
        />
      ) : null}
    </div>
  )
}
