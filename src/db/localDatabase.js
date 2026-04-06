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

/** Canonical demo rows (IndexedDB is per-origin: localhost ≠ production). */
function buildDemoPatientDocs(now) {
  const minutesAgo = (m) => new Date(now - m * 60_000).toISOString()
  return [
    {
      _id: 'patient:OML-9904',
      type: 'patient',
      patientName: 'Amina Mustapha',
      patientId: 'OML-9904',
      allergies: 'Penicillin (Anaphylaxis)',
      notes: 'Follow-up for malaria treatment. Monitor temperature and hydration.',
      updatedAt: minutesAgo(6),
    },
    {
      _id: 'patient:OML-7741',
      type: 'patient',
      patientName: 'Ibrahim Musa',
      patientId: 'OML-7741',
      allergies: 'None',
      notes: 'Hypertension check. Refill amlodipine; counsel on salt intake.',
      updatedAt: minutesAgo(14),
    },
    {
      _id: 'patient:OML-5503',
      type: 'patient',
      patientName: 'Alma Bashir',
      patientId: 'OML-5503',
      allergies: 'Sulfa (Rash)',
      notes: 'Postnatal visit. Assess bleeding; advise iron supplementation.',
      updatedAt: minutesAgo(23),
    },
    {
      _id: 'patient:OML-8824',
      type: 'patient',
      patientName: 'Sani Lawan',
      patientId: 'OML-8824',
      allergies: 'None',
      notes: 'Diarrhea and dehydration. Start ORS; review in 24h.',
      updatedAt: minutesAgo(37),
    },
    {
      _id: 'patient:OML-6132',
      type: 'patient',
      patientName: 'Zainab Garba',
      patientId: 'OML-6132',
      allergies: 'Ibuprofen (Wheezing)',
      notes: 'Asthma follow-up. Confirm inhaler technique; check triggers.',
      updatedAt: minutesAgo(52),
    },
  ]
}

/**
 * Ensure the five demo patients exist. Inserts any missing `_id` only — does not
 * overwrite records you already edited (existing rev wins). Fixes the case where
 * an older seed left a single row and skipped the bulk insert forever.
 * Safe to call on every boot.
 */
export async function seedPatientsIfEmpty() {
  await ensurePatientIndexes()
  const now = Date.now()
  const demos = buildDemoPatientDocs(now)

  for (const doc of demos) {
    try {
      await patientDb.get(doc._id)
    } catch (err) {
      const status = err && typeof err === 'object' && 'status' in err ? err.status : 0
      if (status === 404) {
        await patientDb.put(doc)
      }
    }
  }
}
