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

/** One row: app has finished first-time setup (demo seed decision is done forever). */
export interface MetaDoc {
  id: string
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

const metaSchema: RxJsonSchema<MetaDoc> = {
  title: 'app meta',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', maxLength: 100 },
  },
  required: ['id'],
}

type AppCollections = {
  conflicts: RxCollection<ConflictDoc>
  meta: RxCollection<MetaDoc>
}

const DEMO_CONFLICT_ID = 'crdt-err-001'
const BOOTSTRAP_META_ID = 'bootstrap'

let dbPromise: Promise<RxDatabase<AppCollections>> | null = null

export const initDB = async (): Promise<RxDatabase<AppCollections>> => {
  if (!dbPromise) {
    dbPromise = createRxDatabase<AppCollections>({
      name: 'openmeddb',
      storage: getRxStoragePouch('idb'),
      ignoreDuplicate: true,
    }).then(async (db) => {
      await db.addCollections({
        conflicts: { schema: conflictSchema },
        meta: { schema: metaSchema },
      })

      const boot = await db.meta.findOne(BOOTSTRAP_META_ID).exec()
      if (!boot) {
        const hasDemo = await db.conflicts.findOne(DEMO_CONFLICT_ID).exec()
        if (!hasDemo) {
          await db.conflicts.insert({
            id: DEMO_CONFLICT_ID,
            patientName: 'Fatima S.',
            patientId: 'PT-8842',
            field: 'Severe Allergies',
            localValue: 'Penicillin (Anaphylaxis Risk)',
            remoteValue: 'None Known',
            localTimestamp: '2026-04-05T14:30:00Z',
            remoteTimestamp: '2026-04-05T09:15:00Z',
          })
        }
        await db.meta.insert({ id: BOOTSTRAP_META_ID })
      }

      return db
    })
  }
  return dbPromise
}
