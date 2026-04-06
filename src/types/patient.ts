/** Patient document stored in PouchDB `openmed_patients`. */
import { v4 as uuidv4 } from 'uuid'

export type PatientPouchDoc = {
  _id: string
  _rev?: string
  type: 'patient'
  patientName: string
  patientId: string
  allergies: string
  notes: string
  updatedAt: string
  _conflicts?: string[]
  _deleted?: boolean
}

export function emptyPatientForm(): Omit<PatientPouchDoc, '_id' | '_rev' | '_conflicts' | '_deleted'> {
  return {
    type: 'patient',
    patientName: '',
    patientId: '',
    allergies: '',
    notes: '',
    updatedAt: new Date().toISOString(),
  }
}

export function toPatientDoc(
  fields: Omit<PatientPouchDoc, '_id' | '_rev' | '_conflicts' | '_deleted' | 'type' | 'updatedAt'> & {
    _id?: string
    _rev?: string
  },
): PatientPouchDoc {
  const rand =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : uuidv4()
  const _id = fields._id ?? `patient:${rand}`
  return {
    _id,
    _rev: fields._rev,
    type: 'patient',
    patientName: fields.patientName.trim(),
    patientId: fields.patientId.trim(),
    allergies: fields.allergies.trim(),
    notes: fields.notes.trim(),
    updatedAt: new Date().toISOString(),
  }
}
