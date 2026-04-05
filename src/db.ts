import {
  createRxDatabase,
  addRxPlugin,
  type RxCollection,
  type RxDatabase,
  type RxJsonSchema,
} from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb'
import idb from 'pouchdb-adapter-idb'

// Add plugins
addRxPlugin(RxDBDevModePlugin)
addPouchPlugin(idb)

export interface ConflictDoc {
  id: string
  patientName: string
  patientId: string
  field: string
  localValue: string
  remoteValue: string
  localTimestamp: string
  remoteTimestamp: string
}

const conflictSchema: RxJsonSchema<ConflictDoc> = {
  title: 'conflict schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', maxLength: 100 },
    patientName: { type: 'string' },
    patientId: { type: 'string' },
    field: { type: 'string' },
    localValue: { type: 'string' },
    remoteValue: { type: 'string' },
    localTimestamp: { type: 'string' },
    remoteTimestamp: { type: 'string' },
  },
  required: ['id', 'patientName', 'field', 'localValue', 'remoteValue'],
}

type ConflictCollections = {
  conflicts: RxCollection<ConflictDoc>
}

let dbPromise: Promise<RxDatabase<ConflictCollections>> | null = null

export const initDB = async (): Promise<RxDatabase<ConflictCollections>> => {
  if (!dbPromise) {
    dbPromise = createRxDatabase<ConflictCollections>({
      name: 'openmeddb',
      storage: getRxStoragePouch('idb'),
      ignoreDuplicate: true,
    }).then(async (db) => {
      await db.addCollections({
        conflicts: { schema: conflictSchema },
      })

      // Seed the database with our specific medical edge-case if empty
      const existing = await db.conflicts.find().exec()
      if (existing.length === 0) {
        await db.conflicts.insert({
          id: 'crdt-err-001',
          patientName: 'Fatima S.',
          patientId: 'PT-8842',
          field: 'Severe Allergies',
          localValue: 'Penicillin (Anaphylaxis Risk)',
          remoteValue: 'None Known',
          localTimestamp: '2026-04-05T14:30:00Z',
          remoteTimestamp: '2026-04-05T09:15:00Z',
        })
      }
      return db
    })
  }
  return dbPromise
}
