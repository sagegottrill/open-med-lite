import { useEffect, useState } from 'react'
import { AlertTriangle, Database, Smartphone, CheckCircle } from 'lucide-react'
import { initDB, type ConflictDoc } from '../db'
import type { RxDocument } from 'rxdb'

export function ConflictDeskPage() {
  const [conflicts, setConflicts] = useState<ConflictDoc[]>([])
  const [db, setDb] = useState<Awaited<ReturnType<typeof initDB>> | null>(null)

  useEffect(() => {
    let sub: { unsubscribe: () => void } | undefined
    let cancelled = false

    void (async () => {
      const database = await initDB()
      if (cancelled) return
      setDb(database)
      sub = database.conflicts.find().$.subscribe(
        (docs: RxDocument<ConflictDoc>[]) => {
          setConflicts(docs.map((doc) => doc.toJSON() as ConflictDoc))
        },
      )
    })()

    return () => {
      cancelled = true
      sub?.unsubscribe()
    }
  }, [])

  const resolveConflict = async (id: string, resolution: 'local' | 'remote') => {
    if (!db) return
    console.log(`Resolved ${id} using ${resolution} data.`)
    const query = db.conflicts.findOne({ selector: { id } })
    await query.remove()
  }

  return (
    <main className="max-w-5xl mx-auto">
      <p className="mb-2 text-sm text-slate-500">
        RxDB queue — operational sync conflicts (separate from Pouch patient merges).
      </p>
      <h2 className="text-xl font-semibold mb-6">Human-in-the-Loop Resolution Desk</h2>
      {conflicts.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl flex flex-col items-center text-center max-w-xl mx-auto">
          <CheckCircle size={48} className="mb-4 text-green-500 shrink-0" aria-hidden />
          <h3 className="text-xl font-bold">All CRDT States Synchronized</h3>
          <p className="mt-4 text-sm leading-relaxed text-green-900/80">
            This prototype is only the conflict desk — there is no separate “home” page to return to.
            When the queue is empty, this is the normal screen.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-green-900/80">
            Resolutions are saved in your browser (IndexedDB). After a refresh you should still see
            this message until new conflicts appear — that means persistence is working.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {conflict.patientName} ({conflict.patientId})
                  </h3>
                  <p className="text-sm text-slate-500">
                    Conflicting Field:{' '}
                    <span className="font-semibold text-red-600">{conflict.field}</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-6 bg-amber-50/30">
                  <div className="flex items-center gap-2 mb-4 text-amber-700 font-semibold">
                    <Smartphone size={20} />
                    <h4>Local Clinic Node (Offline Entry)</h4>
                  </div>
                  <div className="p-4 bg-white border border-amber-200 rounded-lg shadow-inner mb-4">
                    <p className="text-lg font-medium">{conflict.localValue}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void resolveConflict(conflict.id, 'local')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium"
                  >
                    Keep Local Data
                  </button>
                </div>
                <div className="p-6 bg-blue-50/30">
                  <div className="flex items-center gap-2 mb-4 text-blue-700 font-semibold">
                    <Database size={20} />
                    <h4>Main Hospital Server</h4>
                  </div>
                  <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-inner mb-4">
                    <p className="text-lg font-medium">{conflict.remoteValue}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void resolveConflict(conflict.id, 'remote')}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded-lg font-medium"
                  >
                    Overwrite with Server
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export function ConflictDeskBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium text-sm">
        <CheckCircle size={18} aria-hidden />
        <span>Sync queue clear</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium text-sm">
      <AlertTriangle size={18} aria-hidden />
      <span>{count} Pending Sync Conflicts</span>
    </div>
  )
}
