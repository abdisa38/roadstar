// Medical History model — fictional data only. All names, IDs, clinical values are illustrative.

export type HistorySection =
  | 'overview'
  | 'encounters'
  | 'conditions'
  | 'allergies'
  | 'medications'
  | 'procedures'
  | 'family-social'
  | 'laboratory'
  | 'documents'

export type RecordStatus = 'active' | 'inactive' | 'discontinued' | 'completed' | 'unknown'

export type AllergyVerificationStatus = 'verified' | 'not-verified' | 'pending-review'

export type HistoricalEncounter = {
  id: string
  date: string
  type: string
  reason: string
  status: 'completed' | 'cancelled' | 'no-show'
  clinician: string
  department: string
  summary: string
  diagnosesCount: number
  notesCount: number
}

export type MedicalCondition = {
  id: string
  condition: string
  recordedDate: string
  encounterId: string
  encounterDate: string
  status: RecordStatus
  clinician: string
  notes: string
  icdCode?: string
}

export type AllergyRecord = {
  id: string
  allergen: string
  allergenType: 'medication' | 'food' | 'environmental' | 'other'
  reaction: string
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'
  recordedDate: string
  lastReviewedDate: string
  verificationStatus: AllergyVerificationStatus
  clinician: string
  notes: string
}

export type MedicationRecord = {
  id: string
  medicationName: string
  strength: string
  formulation: string
  dose: string
  frequency: string
  route: string
  prescriptionDate: string
  startDate: string
  endDate?: string
  status: RecordStatus
  prescriber: string
  encounterId: string
  indication: string
  instructions: string
}

export type ProcedureRecord = {
  id: string
  procedureName: string
  procedureDate: string
  performedBy: string
  facility: string
  encounterId: string
  notes: string
  outcome: string
}

export type FamilyHistoryRecord = {
  id: string
  relationship: string
  condition: string
  ageAtDiagnosis?: number
  ageAtDeath?: number
  recordedDate: string
  clinician: string
  notes: string
}

export type SocialHistoryRecord = {
  category: 'smoking' | 'alcohol' | 'substance-use' | 'occupation' | 'living-situation' | 'other'
  status: string
  details: string
  recordedDate: string
  lastUpdated: string
  clinician: string
}

export type LaboratoryRecord = {
  id: string
  testName: string
  orderedDate: string
  collectedDate?: string
  resultDate?: string
  status: 'ordered' | 'collected' | 'pending' | 'completed' | 'cancelled'
  orderingClinician: string
  encounterId: string
  resultSummary: string
  abnormalFlag: boolean
}

export type ClinicalDocument = {
  id: string
  documentType: string
  title: string
  uploadedDate: string
  relatedEncounterId?: string
  uploadedBy: string
  fileSize: string
  format: string
}

export type HistoryOverview = {
  totalEncounters: number
  lastEncounterDate: string
  recordedConditionsCount: number
  allergyCount: number
  verifiedAllergies: boolean
  activeMedicationsCount: number
  historicalMedicationsCount: number
  proceduresCount: number
  recentLabsCount: number
  documentsCount: number
  familyHistoryRecorded: boolean
  socialHistoryRecorded: boolean
}

export type PatientMedicalHistory = {
  // Patient identity
  patientId: string
  patientName: string
  dateOfBirth: string
  age: number
  sex: 'male' | 'female' | 'other' | 'not-recorded'
  
  // Current context
  currentEncounterId: string
  currentEncounterDate: string
  
  // Overview
  overview: HistoryOverview
  
  // Historical records
  encounters: HistoricalEncounter[]
  conditions: MedicalCondition[]
  allergies: AllergyRecord[]
  medications: MedicationRecord[]
  procedures: ProcedureRecord[]
  familyHistory: FamilyHistoryRecord[]
  socialHistory: SocialHistoryRecord[]
  laboratoryResults: LaboratoryRecord[]
  documents: ClinicalDocument[]
}

// Sample patient medical history for demonstration
export const sampleMedicalHistory: PatientMedicalHistory = {
  patientId: 'ORH-2026-00124',
  patientName: 'Hana Mohammed',
  dateOfBirth: '1991-06-15',
  age: 34,
  sex: 'female',
  
  currentEncounterId: 'ENC-2026-00087',
  currentEncounterDate: '2026-01-11T09:30:00Z',
  
  overview: {
    totalEncounters: 8,
    lastEncounterDate: '2025-12-15',
    recordedConditionsCount: 3,
    allergyCount: 1,
    verifiedAllergies: true,
    activeMedicationsCount: 2,
    historicalMedicationsCount: 4,
    proceduresCount: 1,
    recentLabsCount: 3,
    documentsCount: 2,
    familyHistoryRecorded: true,
    socialHistoryRecorded: true,
  },
  
  encounters: [
    {
      id: 'ENC-2025-12-543',
      date: '2025-12-15T14:30:00Z',
      type: 'Follow-up Consultation',
      reason: 'Hypertension follow-up',
      status: 'completed',
      clinician: 'Dr. Abebe Tadesse',
      department: 'Internal Medicine',
      summary: 'Blood pressure well controlled on current medication. Continue Amlodipine 5mg daily.',
      diagnosesCount: 1,
      notesCount: 1,
    },
    {
      id: 'ENC-2025-09-321',
      date: '2025-09-20T10:15:00Z',
      type: 'General Consultation',
      reason: 'Elevated blood pressure',
      status: 'completed',
      clinician: 'Dr. Meron Bekele',
      department: 'Internal Medicine',
      summary: 'Initial diagnosis of essential hypertension. Started on Amlodipine 5mg. Lifestyle counseling provided.',
      diagnosesCount: 2,
      notesCount: 2,
    },
    {
      id: 'ENC-2025-06-112',
      date: '2025-06-10T11:00:00Z',
      type: 'Annual Health Check',
      reason: 'Routine health screening',
      status: 'completed',
      clinician: 'Dr. Tigist Alemayehu',
      department: 'Family Medicine',
      summary: 'General health check. Vitamin D deficiency noted. Supplementation recommended.',
      diagnosesCount: 1,
      notesCount: 1,
    },
    {
      id: 'ENC-2024-11-234',
      date: '2024-11-22T09:45:00Z',
      type: 'Emergency Visit',
      reason: 'Acute gastroenteritis',
      status: 'completed',
      clinician: 'Dr. Dawit Gebre',
      department: 'Emergency',
      summary: 'Treated for acute gastroenteritis. IV fluids administered. Symptoms resolved.',
      diagnosesCount: 1,
      notesCount: 2,
    },
    {
      id: 'ENC-2024-08-445',
      date: '2024-08-15T15:30:00Z',
      type: 'Specialist Consultation',
      reason: 'Dermatological assessment',
      status: 'completed',
      clinician: 'Dr. Sara Desta',
      department: 'Dermatology',
      summary: 'Assessed for persistent rash. Diagnosed as contact dermatitis. Topical steroid prescribed.',
      diagnosesCount: 1,
      notesCount: 1,
    },
  ],
  
  conditions: [
    {
      id: 'COND-001',
      condition: 'Essential Hypertension',
      recordedDate: '2025-09-20',
      encounterId: 'ENC-2025-09-321',
      encounterDate: '2025-09-20T10:15:00Z',
      status: 'active',
      clinician: 'Dr. Meron Bekele',
      notes: 'Stage 1 hypertension. BP readings consistently 140-150/85-95. No target organ damage.',
      icdCode: 'I10',
    },
    {
      id: 'COND-002',
      condition: 'Vitamin D Deficiency',
      recordedDate: '2025-06-10',
      encounterId: 'ENC-2025-06-112',
      encounterDate: '2025-06-10T11:00:00Z',
      status: 'inactive',
      clinician: 'Dr. Tigist Alemayehu',
      notes: 'Serum vitamin D level 18 ng/mL. Corrected with supplementation over 3 months.',
      icdCode: 'E55.9',
    },
    {
      id: 'COND-003',
      condition: 'Penicillin Allergy',
      recordedDate: '2024-03-15',
      encounterId: 'ENC-2024-03-089',
      encounterDate: '2024-03-15T13:20:00Z',
      status: 'active',
      clinician: 'Dr. Ahmed Hussein',
      notes: 'Documented allergic reaction to penicillin. Rash and itching within hours of administration.',
    },
  ],
  
  allergies: [
    {
      id: 'ALLG-001',
      allergen: 'Penicillin',
      allergenType: 'medication',
      reaction: 'Rash, itching, urticaria',
      severity: 'moderate',
      recordedDate: '2024-03-15',
      lastReviewedDate: '2025-09-20',
      verificationStatus: 'verified',
      clinician: 'Dr. Ahmed Hussein',
      notes: 'Reaction occurred within 2 hours of oral amoxicillin 500mg. No respiratory symptoms. Patient advised to avoid all penicillin-class antibiotics.',
    },
  ],
  
  medications: [
    {
      id: 'MED-001',
      medicationName: 'Amlodipine',
      strength: '5mg',
      formulation: 'Tablet',
      dose: '5mg',
      frequency: 'Once daily',
      route: 'Oral',
      prescriptionDate: '2025-09-20',
      startDate: '2025-09-20',
      status: 'active',
      prescriber: 'Dr. Meron Bekele',
      encounterId: 'ENC-2025-09-321',
      indication: 'Essential Hypertension',
      instructions: 'Take one tablet every morning. Monitor blood pressure weekly.',
    },
    {
      id: 'MED-002',
      medicationName: 'Vitamin D3 (Cholecalciferol)',
      strength: '50,000 IU',
      formulation: 'Capsule',
      dose: '50,000 IU',
      frequency: 'Weekly',
      route: 'Oral',
      prescriptionDate: '2025-06-10',
      startDate: '2025-06-10',
      endDate: '2025-09-10',
      status: 'completed',
      prescriber: 'Dr. Tigist Alemayehu',
      encounterId: 'ENC-2025-06-112',
      indication: 'Vitamin D Deficiency',
      instructions: 'Take one capsule weekly for 12 weeks. Recheck vitamin D level after completion.',
    },
    {
      id: 'MED-003',
      medicationName: 'Hydrocortisone Cream',
      strength: '1%',
      formulation: 'Topical Cream',
      dose: 'Apply thin layer',
      frequency: 'Twice daily',
      route: 'Topical',
      prescriptionDate: '2024-08-15',
      startDate: '2024-08-15',
      endDate: '2024-09-01',
      status: 'completed',
      prescriber: 'Dr. Sara Desta',
      encounterId: 'ENC-2024-08-445',
      indication: 'Contact Dermatitis',
      instructions: 'Apply to affected areas twice daily for 2 weeks. Discontinue if no improvement.',
    },
    {
      id: 'MED-004',
      medicationName: 'Oral Rehydration Salts',
      strength: 'Standard WHO formula',
      formulation: 'Powder for solution',
      dose: '1 sachet in 1L water',
      frequency: 'As needed',
      route: 'Oral',
      prescriptionDate: '2024-11-22',
      startDate: '2024-11-22',
      endDate: '2024-11-25',
      status: 'completed',
      prescriber: 'Dr. Dawit Gebre',
      encounterId: 'ENC-2024-11-234',
      indication: 'Acute Gastroenteritis',
      instructions: 'Drink 200-400ml after each loose stool until symptoms resolve.',
    },
  ],
  
  procedures: [
    {
      id: 'PROC-001',
      procedureName: 'Minor skin biopsy',
      procedureDate: '2024-08-18',
      performedBy: 'Dr. Sara Desta',
      facility: 'Oda Roba Hospital - Dermatology',
      encounterId: 'ENC-2024-08-445',
      notes: '3mm punch biopsy from left forearm. Local anesthesia used.',
      outcome: 'Biopsy confirmed contact dermatitis. No malignancy detected.',
    },
  ],
  
  familyHistory: [
    {
      id: 'FH-001',
      relationship: 'Mother',
      condition: 'Type 2 Diabetes Mellitus',
      ageAtDiagnosis: 55,
      recordedDate: '2025-06-10',
      clinician: 'Dr. Tigist Alemayehu',
      notes: 'Mother diagnosed at age 55. Currently on oral hypoglycemics.',
    },
    {
      id: 'FH-002',
      relationship: 'Father',
      condition: 'Hypertension',
      ageAtDiagnosis: 50,
      recordedDate: '2025-09-20',
      clinician: 'Dr. Meron Bekele',
      notes: 'Father has long-standing hypertension, well controlled on medication.',
    },
    {
      id: 'FH-003',
      relationship: 'Maternal Grandmother',
      condition: 'Stroke',
      ageAtDeath: 72,
      recordedDate: '2025-09-20',
      clinician: 'Dr. Meron Bekele',
      notes: 'Maternal grandmother died at age 72 from stroke complications.',
    },
  ],
  
  socialHistory: [
    {
      category: 'smoking',
      status: 'Never smoked',
      details: 'Patient reports never having smoked tobacco products.',
      recordedDate: '2025-06-10',
      lastUpdated: '2025-09-20',
      clinician: 'Dr. Meron Bekele',
    },
    {
      category: 'alcohol',
      status: 'Occasional',
      details: 'Reports drinking alcohol socially, approximately 1-2 times per month. No history of alcohol-related problems.',
      recordedDate: '2025-06-10',
      lastUpdated: '2025-09-20',
      clinician: 'Dr. Meron Bekele',
    },
    {
      category: 'occupation',
      status: 'Teacher',
      details: 'Works as a secondary school teacher. Sedentary occupation.',
      recordedDate: '2025-06-10',
      lastUpdated: '2025-06-10',
      clinician: 'Dr. Tigist Alemayehu',
    },
    {
      category: 'living-situation',
      status: 'Lives with family',
      details: 'Lives with spouse and two children in Bale Robe.',
      recordedDate: '2025-06-10',
      lastUpdated: '2025-06-10',
      clinician: 'Dr. Tigist Alemayehu',
    },
  ],
  
  laboratoryResults: [
    {
      id: 'LAB-001',
      testName: 'Complete Blood Count',
      orderedDate: '2025-12-15',
      collectedDate: '2025-12-15',
      resultDate: '2025-12-16',
      status: 'completed',
      orderingClinician: 'Dr. Abebe Tadesse',
      encounterId: 'ENC-2025-12-543',
      resultSummary: 'All parameters within normal limits',
      abnormalFlag: false,
    },
    {
      id: 'LAB-002',
      testName: 'Lipid Profile',
      orderedDate: '2025-09-20',
      collectedDate: '2025-09-20',
      resultDate: '2025-09-22',
      status: 'completed',
      orderingClinician: 'Dr. Meron Bekele',
      encounterId: 'ENC-2025-09-321',
      resultSummary: 'Total cholesterol 195 mg/dL, LDL 115 mg/dL, HDL 58 mg/dL, Triglycerides 110 mg/dL',
      abnormalFlag: false,
    },
    {
      id: 'LAB-003',
      testName: 'Serum Vitamin D',
      orderedDate: '2025-06-10',
      collectedDate: '2025-06-10',
      resultDate: '2025-06-12',
      status: 'completed',
      orderingClinician: 'Dr. Tigist Alemayehu',
      encounterId: 'ENC-2025-06-112',
      resultSummary: 'Vitamin D level: 18 ng/mL (Low - reference range: 30-100 ng/mL)',
      abnormalFlag: true,
    },
  ],
  
  documents: [
    {
      id: 'DOC-001',
      documentType: 'Imaging Report',
      title: 'Chest X-Ray - November 2024',
      uploadedDate: '2024-11-23',
      relatedEncounterId: 'ENC-2024-11-234',
      uploadedBy: 'Radiology Department',
      fileSize: '2.4 MB',
      format: 'PDF',
    },
    {
      id: 'DOC-002',
      documentType: 'Pathology Report',
      title: 'Skin Biopsy - August 2024',
      uploadedDate: '2024-08-25',
      relatedEncounterId: 'ENC-2024-08-445',
      uploadedBy: 'Pathology Department',
      fileSize: '856 KB',
      format: 'PDF',
    },
  ],
}

// Utility functions
export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateLong(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getRecordStatusLabel(status: RecordStatus): string {
  const labels: Record<RecordStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    discontinued: 'Discontinued',
    completed: 'Completed',
    unknown: 'Unknown',
  }
  return labels[status]
}

export function getSeverityLabel(severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'): string {
  const labels = {
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    'life-threatening': 'Life-Threatening',
  }
  return labels[severity]
}

export function getAllergenTypeLabel(type: 'medication' | 'food' | 'environmental' | 'other'): string {
  const labels = {
    medication: 'Medication',
    food: 'Food',
    environmental: 'Environmental',
    other: 'Other',
  }
  return labels[type]
}

export function getLabStatusLabel(status: 'ordered' | 'collected' | 'pending' | 'completed' | 'cancelled'): string {
  const labels = {
    ordered: 'Ordered',
    collected: 'Collected',
    pending: 'Pending Results',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function getRelativeTime(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
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
