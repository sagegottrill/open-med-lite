import type { PatientPouchDoc } from '../types/patient'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PouchDatabase = any

export type PouchConflictPayload = {
  docId: string
  versions: PatientPouchDoc[]
}

/**
 * Live listener: when a patient doc has revision branches, surface it for human merge.
 */
export function subscribePouchConflicts(
  db: PouchDatabase,
  onConflict: (payload: PouchConflictPayload) => void,
): () => void {
  const check = async (id: string) => {
    if (!id.startsWith('patient:')) return
    try {
      const doc = (await db.get(id, { conflicts: true })) as PatientPouchDoc & {
        _conflicts?: string[]
      }
      if (!doc._conflicts?.length) return
      const revs = [doc._rev as string, ...doc._conflicts]
      const versions = (await Promise.all(
        revs.map((rev) => db.get(id, { rev })),
      )) as PatientPouchDoc[]
      onConflict({ docId: id, versions })
    } catch {
      /* deleted or missing */
    }
  }

  const changes = db.changes({ since: 'now', live: true, include_docs: true })
  changes.on('change', (ch: { id?: string }) => {
    if (ch.id) void check(ch.id)
  })

  return () => {
    void changes.cancel()
  }
}

/**
 * Apply clinician-chosen document as the new winning revision and remove other leaf revs.
 */
export async function applyPouchWinner(
  db: PouchDatabase,
  docId: string,
  chosen: PatientPouchDoc,
): Promise<void> {
  const head = (await db.get(docId, { conflicts: true })) as PatientPouchDoc & {
    _conflicts?: string[]
  }
  const next = {
    ...chosen,
    _id: docId,
    _rev: head._rev,
    type: 'patient' as const,
    updatedAt: new Date().toISOString(),
  }
  delete (next as { _conflicts?: unknown })._conflicts
  await db.put(next)

  if (head._conflicts?.length) {
    for (const rev of head._conflicts) {
      try {
        const loser = await db.get(docId, { rev })
        await db.remove(loser)
      } catch {
        /* already compacted */
      }
    }
  }
}
