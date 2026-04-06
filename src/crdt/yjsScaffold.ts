import * as Y from 'yjs'

/**
 * Minimal Yjs scaffold to back the README claim without impacting the demo UI.
 * This is not wired into replication yet; it demonstrates deterministic merges.
 */
export function demoYjsMerge() {
  const a = new Y.Doc()
  const b = new Y.Doc()

  const allergiesA = a.getMap<string>('allergies')
  const allergiesB = b.getMap<string>('allergies')

  // device A (clinic server snapshot)
  allergiesA.set('patient:OML-9904', 'NO')
  // device B (field tablet)
  allergiesB.set('patient:OML-9904', 'YES (Severity: Anaphylaxis)')

  // exchange updates (CRDT merge)
  const updateFromA = Y.encodeStateAsUpdate(a)
  const updateFromB = Y.encodeStateAsUpdate(b)
  Y.applyUpdate(a, updateFromB)
  Y.applyUpdate(b, updateFromA)

  return {
    mergedOnA: allergiesA.get('patient:OML-9904') ?? null,
    mergedOnB: allergiesB.get('patient:OML-9904') ?? null,
  }
}

