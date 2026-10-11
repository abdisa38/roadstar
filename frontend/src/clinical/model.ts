// Clinical workspace model — fictional data only. All names, IDs, clinical values are illustrative.

export type EncounterStatus = 
  | 'waiting'
  | 'in-consultation'
  | 'awaiting-results'
  | 'ready-for-review'
  | 'completed'

export type AllergyStatus = 'not-verified' | 'no-known-allergies' | 'allergies-documented'

export type SaveState = 'unsaved' | 'saving' | 'saved' | 'error'

export type ClinicalSection = 
  | 'overview'
  | 'clinical-notes'
  | 'medical-history'
  | 'diagnoses'
  | 'prescriptions'
  | 'laboratory'
  | 'documents'

export type VitalSigns = {
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  recordedAt: string
  recordedBy: string
}

export type Allergy = {
  allergen: string
  reaction: string
  severity: 'mild' | 'moderate' | 'severe'
  recordedDate: string
}

export type ClinicalNote = {
  chiefComplaint: string
  historyOfPresentIllness: string
  examinationFindings: string
  clinicalAssessment: string
  plan: string
  lastModified: string
  status: 'draft' | 'finalized'
}

export type PreviousEncounter = {
  id: string
  date: string
  type: string
  doctor: string
  diagnoses: string[]
  summary: string
}

export type PatientClinicalContext = {
  patientId: string
  patientName: string
  age: number
  dateOfBirth: string
  sex: 'male' | 'female' | 'other' | 'not-recorded'
  contactPhone: string
  encounterId: string
  encounterDate: string
  encounterType: string
  encounterStatus: EncounterStatus
  assignedDoctor: string
  chiefComplaint: string
  allergyStatus: AllergyStatus
  allergies: Allergy[]
  vitalSigns: VitalSigns | null
  clinicalNote: ClinicalNote
  previousEncounters: PreviousEncounter[]
  existingDiagnoses: string[]
  activePrescriptions: string[]
  pendingLabResults: number
}

export const emptyClinicalNote: ClinicalNote = {
  chiefComplaint: '',
  historyOfPresentIllness: '',
  examinationFindings: '',
  clinicalAssessment: '',
  plan: '',
  lastModified: '',
  status: 'draft',
}

// Sample patient clinical context for demonstration
export const samplePatientContext: PatientClinicalContext = {
  patientId: 'ORH-2026-00124',
  patientName: 'Hana Mohammed',
  age: 34,
  dateOfBirth: '1991-06-15',
  sex: 'female',
  contactPhone: '+251 91 123 4567',
  encounterId: 'ENC-2026-00087',
  encounterDate: '2026-01-11T09:30:00Z',
  encounterType: 'General Consultation',
  encounterStatus: 'in-consultation',
  assignedDoctor: 'Dr. Demo',
  chiefComplaint: 'Persistent cough and fever',
  allergyStatus: 'allergies-documented',
  allergies: [
    {
      allergen: 'Penicillin',
      reaction: 'Rash and itching',
      severity: 'moderate',
      recordedDate: '2024-03-15',
    },
  ],
  vitalSigns: {
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    heartRate: 82,
    temperature: 38.2,
    respiratoryRate: 18,
    oxygenSaturation: 97,
    recordedAt: '2026-01-11T09:35:00Z',
    recordedBy: 'Nurse Demo',
  },
  clinicalNote: {
    chiefComplaint: 'Persistent cough and fever for 3 days',
    historyOfPresentIllness: 'Patient reports dry cough started 3 days ago. Fever began yesterday evening. Cough worse at night, disrupting sleep. No shortness of breath. Mild fatigue and reduced appetite.',
    examinationFindings: '',
    clinicalAssessment: '',
    plan: '',
    lastModified: '2026-01-11T09:40:00Z',
    status: 'draft',
  },
  previousEncounters: [
    {
      id: 'ENC-2025-12-543',
      date: '2025-12-15',
      type: 'Follow-up',
      doctor: 'Dr. Abebe',
      diagnoses: ['Essential Hypertension'],
      summary: 'Blood pressure well controlled on current medication',
    },
    {
      id: 'ENC-2025-09-321',
      date: '2025-09-20',
      type: 'General Consultation',
      doctor: 'Dr. Demo',
      diagnoses: ['Essential Hypertension', 'Vitamin D Deficiency'],
      summary: 'Initial diagnosis of hypertension, started on Amlodipine 5mg',
    },
  ],
  existingDiagnoses: ['Essential Hypertension (Controlled)'],
  activePrescriptions: ['Amlodipine 5mg - Daily'],
  pendingLabResults: 0,
}

export function getEncounterStatusLabel(status: EncounterStatus): string {
  const labels: Record<EncounterStatus, string> = {
    waiting: 'Waiting',
    'in-consultation': 'In Consultation',
    'awaiting-results': 'Awaiting Results',
    'ready-for-review': 'Ready for Review',
    completed: 'Completed',
  }
  return labels[status]
}

export function getAllergyStatusLabel(status: AllergyStatus): string {
  const labels: Record<AllergyStatus, string> = {
    'not-verified': 'Not Verified',
    'no-known-allergies': 'No Known Allergies',
    'allergies-documented': 'Allergies Documented',
  }
  return labels[status]
}

export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function hasUnsavedChanges(
  currentNote: ClinicalNote,
  originalNote: ClinicalNote
): boolean {
  return (
    currentNote.chiefComplaint !== originalNote.chiefComplaint ||
    currentNote.historyOfPresentIllness !== originalNote.historyOfPresentIllness ||
    currentNote.examinationFindings !== originalNote.examinationFindings ||
    currentNote.clinicalAssessment !== originalNote.clinicalAssessment ||
    currentNote.plan !== originalNote.plan
  )
}

export function getTimeSinceLastSave(lastModified: string): string {
  if (!lastModified) return 'Never saved'
  
  const now = new Date()
  const saved = new Date(lastModified)
  const diffMs = now.getTime() - saved.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins === 1) return '1 minute ago'
  if (diffMins < 60) return `${diffMins} minutes ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return '1 hour ago'
  if (diffHours < 24) return `${diffHours} hours ago`
  
  return formatDateTime(lastModified)
}
