/**
 * Local PouchDB for patient records (IndexedDB in the browser).
 * @typedef {import('pouchdb').default} PouchConstructor
 */
import PouchDB from 'pouchdb'
import PouchFind from 'pouchdb-find'

PouchDB.plugin(PouchFind)

/** @type {import('pouchdb').default} */
export const patientDb = new PouchDB('openmed_patients')

/**
 * Mango index for dashboard queries (type + sort field).
 * Safe to call on every boot.
 */
export async function ensurePatientIndexes() {
  try {
    await patientDb.createIndex({
      index: { fields: ['type', 'updatedAt'] },
    })
  } catch {
    /* index may already exist */
  }
}
