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

/**
 * Seed localized demo patients if the registry is empty.
 * Safe to call on every boot.
 */
export async function seedPatientsIfEmpty() {
  await ensurePatientIndexes()
  const existing = await patientDb.find({
    selector: { type: 'patient' },
    limit: 1,
  })
  if (existing.docs.length > 0) return

  const now = Date.now()
  const minutesAgo = (m) => new Date(now - m * 60_000).toISOString()

  await patientDb.bulkDocs(
    [
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
    ],
    { new_edits: true },
  )
}
