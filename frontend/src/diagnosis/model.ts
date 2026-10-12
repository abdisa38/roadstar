// Diagnosis Management model — fictional data only. All names, IDs, diagnosis codes are illustrative.

export type DiagnosisDesignation = 'primary' | 'secondary'

export type DiagnosisStatus = 'active' | 'resolved' | 'inactive'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// Encounter diagnosis - diagnosis associated with current encounter
export type EncounterDiagnosis = {
  id: string
  diagnosisName: string
  icdCode: string
  designation: DiagnosisDesignation
  status: DiagnosisStatus
  recordedDate: string
  recordedBy: string
  encounterId: string
  clinicalNotes: string
  isUnsaved?: boolean
}

// Catalogue result - from terminology search
export type DiagnosisCatalogueResult = {
  id: string
  name: string
  code: string
  category: string
  description: string
}

// Historical diagnosis - from previous encounters
export type HistoricalDiagnosis = {
  id: string
  diagnosisName: string
  icdCode: string
  recordedDate: string
  encounterId: string
  encounterDate: string
  encounterType: string
  recordedBy: string
  status: DiagnosisStatus
}

// Patient and encounter context
export type DiagnosisManagementContext = {
  patientId: string
  patientName: string
  age: number
  sex: 'male' | 'female' | 'other' | 'not-recorded'
  encounterId: string
  encounterDate: string
  encounterType: string
  encounterStatus: 'in-progress' | 'completed' | 'cancelled'
  assignedClinician: string
  isReadOnly: boolean
  canEdit: boolean
}

// Complete diagnosis management state
export type DiagnosisManagementState = {
  context: DiagnosisManagementContext
  currentDiagnoses: EncounterDiagnosis[]
  historicalDiagnoses: HistoricalDiagnosis[]
  saveState: SaveState
  lastSaved: string | null
}

// Sample diagnosis catalogue - fictional ICD-10 examples
export const sampleDiagnosisCatalogue: DiagnosisCatalogueResult[] = [
  {
    id: 'ICD-I10',
    name: 'Essential (primary) hypertension',
    code: 'I10',
    category: 'Diseases of the circulatory system',
    description: 'High blood pressure of unknown cause',
  },
  {
    id: 'ICD-E11',
    name: 'Type 2 diabetes mellitus',
    code: 'E11',
    category: 'Endocrine, nutritional and metabolic diseases',
    description: 'Non-insulin-dependent diabetes mellitus',
  },
  {
    id: 'ICD-J06',
    name: 'Acute upper respiratory infection, unspecified',
    code: 'J06.9',
    category: 'Diseases of the respiratory system',
    description: 'Common cold or URI not otherwise specified',
  },
  {
    id: 'ICD-J18',
    name: 'Pneumonia, unspecified organism',
    code: 'J18.9',
    category: 'Diseases of the respiratory system',
    description: 'Pneumonia without specification of causative organism',
  },
  {
    id: 'ICD-A09',
    name: 'Gastroenteritis and colitis of unspecified origin',
    code: 'A09',
    category: 'Certain infectious and parasitic diseases',
    description: 'Diarrhea and gastroenteritis of presumed infectious origin',
  },
  {
    id: 'ICD-M79',
    name: 'Soft tissue disorder, unspecified',
    code: 'M79.9',
    category: 'Diseases of the musculoskeletal system',
    description: 'Disorder of soft tissue, not elsewhere classified',
  },
  {
    id: 'ICD-R50',
    name: 'Fever of other and unknown origin',
    code: 'R50.9',
    category: 'Symptoms, signs and abnormal findings',
    description: 'Fever, unspecified',
  },
  {
    id: 'ICD-R51',
    name: 'Headache',
    code: 'R51',
    category: 'Symptoms, signs and abnormal findings',
    description: 'Headache, not elsewhere classified',
  },
  {
    id: 'ICD-K21',
    name: 'Gastro-esophageal reflux disease',
    code: 'K21.9',
    category: 'Diseases of the digestive system',
    description: 'GERD without esophagitis',
  },
  {
    id: 'ICD-E55',
    name: 'Vitamin D deficiency',
    code: 'E55.9',
    category: 'Endocrine, nutritional and metabolic diseases',
    description: 'Vitamin D deficiency, unspecified',
  },
  {
    id: 'ICD-I25',
    name: 'Chronic ischemic heart disease',
    code: 'I25.9',
    category: 'Diseases of the circulatory system',
    description: 'Chronic ischemic heart disease, unspecified',
  },
  {
    id: 'ICD-E66',
    name: 'Overweight and obesity',
    code: 'E66.9',
    category: 'Endocrine, nutritional and metabolic diseases',
    description: 'Obesity, unspecified',
  },
  {
    id: 'ICD-M54',
    name: 'Dorsalgia (back pain)',
    code: 'M54.5',
    category: 'Diseases of the musculoskeletal system',
    description: 'Low back pain',
  },
  {
    id: 'ICD-N39',
    name: 'Urinary tract infection, site not specified',
    code: 'N39.0',
    category: 'Diseases of the genitourinary system',
    description: 'UTI, site not specified',
  },
  {
    id: 'ICD-L30',
    name: 'Dermatitis, unspecified',
    code: 'L30.9',
    category: 'Diseases of the skin',
    description: 'Dermatitis, unspecified',
  },
  {
    id: 'ICD-H10',
    name: 'Conjunctivitis',
    code: 'H10.9',
    category: 'Diseases of the eye',
    description: 'Conjunctivitis, unspecified',
  },
  {
    id: 'ICD-J45',
    name: 'Asthma',
    code: 'J45.9',
    category: 'Diseases of the respiratory system',
    description: 'Asthma, unspecified',
  },
  {
    id: 'ICD-F41',
    name: 'Anxiety disorder, unspecified',
    code: 'F41.9',
    category: 'Mental and behavioral disorders',
    description: 'Anxiety disorder, not elsewhere classified',
  },
  {
    id: 'ICD-G43',
    name: 'Migraine',
    code: 'G43.909',
    category: 'Diseases of the nervous system',
    description: 'Migraine, unspecified, not intractable',
  },
  {
    id: 'ICD-K59',
    name: 'Constipation',
    code: 'K59.00',
    category: 'Diseases of the digestive system',
    description: 'Constipation, unspecified',
  },
]

// Sample context - fictional demonstration data
export const sampleDiagnosisContext: DiagnosisManagementContext = {
  patientId: 'ORH-2026-00124',
  patientName: 'Hana Mohammed',
  age: 34,
  sex: 'female',
  encounterId: 'ENC-2026-00087',
  encounterDate: '2026-01-11T09:30:00Z',
  encounterType: 'General Consultation',
  encounterStatus: 'in-progress',
  assignedClinician: 'Dr. Demo User',
  isReadOnly: false,
  canEdit: true,
}

// Sample current encounter diagnoses
export const sampleCurrentDiagnoses: EncounterDiagnosis[] = [
  {
    id: 'DIAG-001',
    diagnosisName: 'Acute upper respiratory infection, unspecified',
    icdCode: 'J06.9',
    designation: 'primary',
    status: 'active',
    recordedDate: '2026-01-11T10:15:00Z',
    recordedBy: 'Dr. Demo User',
    encounterId: 'ENC-2026-00087',
    clinicalNotes: 'Patient presents with cough, mild fever, and nasal congestion for 3 days. No signs of lower respiratory involvement.',
  },
]

// Sample historical diagnoses
export const sampleHistoricalDiagnoses: HistoricalDiagnosis[] = [
  {
    id: 'HIST-DIAG-001',
    diagnosisName: 'Essential (primary) hypertension',
    icdCode: 'I10',
    recordedDate: '2025-09-20',
    encounterId: 'ENC-2025-09-321',
    encounterDate: '2025-09-20',
    encounterType: 'General Consultation',
    recordedBy: 'Dr. Meron Bekele',
    status: 'active',
  },
  {
    id: 'HIST-DIAG-002',
    diagnosisName: 'Vitamin D deficiency',
    icdCode: 'E55.9',
    recordedDate: '2025-06-10',
    encounterId: 'ENC-2025-06-112',
    encounterDate: '2025-06-10',
    encounterType: 'Annual Health Check',
    recordedBy: 'Dr. Tigist Alemayehu',
    status: 'resolved',
  },
  {
    id: 'HIST-DIAG-003',
    diagnosisName: 'Gastroenteritis and colitis of unspecified origin',
    icdCode: 'A09',
    recordedDate: '2024-11-22',
    encounterId: 'ENC-2024-11-234',
    encounterDate: '2024-11-22',
    encounterType: 'Emergency Visit',
    recordedBy: 'Dr. Dawit Gebre',
    status: 'resolved',
  },
]

// Utility functions

export function searchDiagnosisCatalogue(query: string): DiagnosisCatalogueResult[] {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.toLowerCase().trim()

  return sampleDiagnosisCatalogue.filter(
    (diagnosis) =>
      diagnosis.name.toLowerCase().includes(searchTerm) ||
      diagnosis.code.toLowerCase().includes(searchTerm) ||
      diagnosis.category.toLowerCase().includes(searchTerm) ||
      diagnosis.description.toLowerCase().includes(searchTerm)
  )
}

export function getPrimaryDiagnosis(
  diagnoses: EncounterDiagnosis[]
): EncounterDiagnosis | null {
  return diagnoses.find((d) => d.designation === 'primary') || null
}

export function hasUnsavedChanges(diagnoses: EncounterDiagnosis[]): boolean {
  return diagnoses.some((d) => d.isUnsaved === true)
}

export function isDuplicateDiagnosis(
  diagnoses: EncounterDiagnosis[],
  icdCode: string
): boolean {
  return diagnoses.some((d) => d.icdCode === icdCode && !d.isUnsaved)
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

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getDesignationLabel(designation: DiagnosisDesignation): string {
  return designation === 'primary' ? 'Primary' : 'Secondary'
}

export function getStatusLabel(status: DiagnosisStatus): string {
  const labels: Record<DiagnosisStatus, string> = {
    active: 'Active',
    resolved: 'Resolved',
    inactive: 'Inactive',
  }
  return labels[status]
}

export function getEncounterStatusLabel(
  status: 'in-progress' | 'completed' | 'cancelled'
): string {
  const labels = {
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function validateDiagnosisForm(
  selectedDiagnosis: DiagnosisCatalogueResult | null,
  designation: DiagnosisDesignation | null
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!selectedDiagnosis) {
    errors.push('Please select a diagnosis from the search results')
  }

  if (!designation) {
    errors.push('Please select a diagnosis designation (Primary or Secondary)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
