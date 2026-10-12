// Prescription Management model — fictional data only. All names, IDs, medications are illustrative.

export type MedicationOrderStatus =
  | 'draft'
  | 'submitted'
  | 'verified'
  | 'dispensed'
  | 'cancelled'
  | 'expired'

export type RouteOfAdministration =
  | 'oral'
  | 'intravenous'
  | 'intramuscular'
  | 'subcutaneous'
  | 'topical'
  | 'rectal'
  | 'inhalation'
  | 'nasal'
  | 'ophthalmic'
  | 'otic'
  | 'transdermal'
  | 'sublingual'

export type FrequencyCode =
  | 'once-daily'
  | 'twice-daily'
  | 'three-times-daily'
  | 'four-times-daily'
  | 'every-4-hours'
  | 'every-6-hours'
  | 'every-8-hours'
  | 'every-12-hours'
  | 'once-weekly'
  | 'as-needed'
  | 'at-bedtime'
  | 'before-meals'
  | 'after-meals'
  | 'other'

export type DosageUnit =
  | 'mg'
  | 'g'
  | 'mcg'
  | 'ml'
  | 'L'
  | 'tablet'
  | 'capsule'
  | 'unit'
  | 'drop'
  | 'puff'
  | 'patch'
  | 'application'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export type AllergyStatus = 'documented' | 'no-known-allergies' | 'not-recorded' | 'not-verified'

// Medication catalogue entry
export type MedicationCatalogueEntry = {
  id: string
  medicationName: string
  genericName: string
  brandName: string | null
  strength: string
  strengthUnit: string
  formulation: string
  route: RouteOfAdministration[]
  category: string
  description: string
}

// Medication order for an encounter
export type MedicationOrder = {
  id: string
  encounterId: string
  medicationId: string
  medicationName: string
  genericName: string
  strength: string
  strengthUnit: string
  formulation: string
  dosageAmount: string
  dosageUnit: DosageUnit
  route: RouteOfAdministration
  frequency: FrequencyCode
  frequencyDescription: string
  duration: string
  durationUnit: 'days' | 'weeks' | 'months'
  quantity: string
  quantityUnit: string
  refills: number
  startDate: string
  endDate: string | null
  patientInstructions: string
  internalNotes: string
  prescribedBy: string
  prescribedDate: string
  status: MedicationOrderStatus
  statusChangedBy: string | null
  statusChangedDate: string | null
  isUnsaved?: boolean
}

// Draft prescription being created
export type PrescriptionDraft = {
  medicationId: string | null
  medicationName: string
  genericName: string
  strength: string
  strengthUnit: string
  formulation: string
  dosageAmount: string
  dosageUnit: DosageUnit | null
  route: RouteOfAdministration | null
  frequency: FrequencyCode | null
  frequencyDescription: string
  duration: string
  durationUnit: 'days' | 'weeks' | 'months'
  quantity: string
  quantityUnit: string
  refills: number
  startDate: string
  endDate: string
  patientInstructions: string
  internalNotes: string
}

// Historical medication from previous encounters
export type HistoricalMedication = {
  id: string
  medicationName: string
  genericName: string
  strength: string
  formulation: string
  dosageAmount: string
  frequency: string
  encounterId: string
  encounterDate: string
  encounterType: string
  prescribedBy: string
  prescribedDate: string
  status: MedicationOrderStatus
}

// Allergy information
export type AllergyInfo = {
  allergyStatus: AllergyStatus
  documentedAllergies: Array<{
    id: string
    allergen: string
    allergyType: 'medication' | 'food' | 'environmental' | 'other'
    severity: 'mild' | 'moderate' | 'severe' | 'unknown'
    reaction: string
    recordedDate: string
  }>
}

// Current diagnosis reference
export type DiagnosisReference = {
  id: string
  diagnosisName: string
  icdCode: string
  designation: 'primary' | 'secondary'
}

// Patient and encounter context
export type PrescriptionManagementContext = {
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
  canPrescribe: boolean
  allergyInfo: AllergyInfo
  currentDiagnoses: DiagnosisReference[]
}

// Complete prescription management state
export type PrescriptionManagementState = {
  context: PrescriptionManagementContext
  currentOrders: MedicationOrder[]
  historicalMedications: HistoricalMedication[]
  activeDraft: PrescriptionDraft | null
  saveState: SaveState
  lastSaved: string | null
  catalogueAvailable: boolean
}

// ============================================================================
// SAMPLE DATA - Fictional medication catalogue
// ============================================================================

export const sampleMedicationCatalogue: MedicationCatalogueEntry[] = [
  {
    id: 'MED-AMOXI-500',
    medicationName: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandName: null,
    strength: '500',
    strengthUnit: 'mg',
    formulation: 'Capsule',
    route: ['oral'],
    category: 'Antibiotics',
    description: 'Penicillin antibiotic for bacterial infections',
  },
  {
    id: 'MED-METRO-400',
    medicationName: 'Metronidazole',
    genericName: 'Metronidazole',
    brandName: null,
    strength: '400',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antibiotics',
    description: 'Antibiotic and antiprotozoal medication',
  },
  {
    id: 'MED-PARAC-500',
    medicationName: 'Paracetamol',
    genericName: 'Paracetamol (Acetaminophen)',
    brandName: 'Panadol',
    strength: '500',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Analgesics',
    description: 'Pain reliever and fever reducer',
  },
  {
    id: 'MED-IBUPR-400',
    medicationName: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandName: 'Brufen',
    strength: '400',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'NSAIDs',
    description: 'Non-steroidal anti-inflammatory drug',
  },
  {
    id: 'MED-AMLOD-5',
    medicationName: 'Amlodipine',
    genericName: 'Amlodipine besylate',
    brandName: 'Norvasc',
    strength: '5',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antihypertensives',
    description: 'Calcium channel blocker for hypertension',
  },
  {
    id: 'MED-AMLOD-10',
    medicationName: 'Amlodipine',
    genericName: 'Amlodipine besylate',
    brandName: 'Norvasc',
    strength: '10',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antihypertensives',
    description: 'Calcium channel blocker for hypertension',
  },
  {
    id: 'MED-METFO-500',
    medicationName: 'Metformin',
    genericName: 'Metformin hydrochloride',
    brandName: 'Glucophage',
    strength: '500',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antidiabetics',
    description: 'Oral antidiabetic for type 2 diabetes',
  },
  {
    id: 'MED-METFO-850',
    medicationName: 'Metformin',
    genericName: 'Metformin hydrochloride',
    brandName: 'Glucophage',
    strength: '850',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antidiabetics',
    description: 'Oral antidiabetic for type 2 diabetes',
  },
  {
    id: 'MED-GLIBE-5',
    medicationName: 'Glibenclamide',
    genericName: 'Glibenclamide',
    brandName: 'Daonil',
    strength: '5',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antidiabetics',
    description: 'Sulfonylurea for type 2 diabetes',
  },
  {
    id: 'MED-OMEPZ-20',
    medicationName: 'Omeprazole',
    genericName: 'Omeprazole',
    brandName: 'Losec',
    strength: '20',
    strengthUnit: 'mg',
    formulation: 'Capsule',
    route: ['oral'],
    category: 'Proton Pump Inhibitors',
    description: 'Reduces stomach acid production',
  },
  {
    id: 'MED-SALBU-INHALE',
    medicationName: 'Salbutamol',
    genericName: 'Salbutamol sulfate',
    brandName: 'Ventolin',
    strength: '100',
    strengthUnit: 'mcg',
    formulation: 'Inhaler',
    route: ['inhalation'],
    category: 'Bronchodilators',
    description: 'Short-acting beta-agonist for asthma',
  },
  {
    id: 'MED-CEPHA-500',
    medicationName: 'Cephalexin',
    genericName: 'Cephalexin',
    brandName: 'Keflex',
    strength: '500',
    strengthUnit: 'mg',
    formulation: 'Capsule',
    route: ['oral'],
    category: 'Antibiotics',
    description: 'Cephalosporin antibiotic',
  },
  {
    id: 'MED-DOXCY-100',
    medicationName: 'Doxycycline',
    genericName: 'Doxycycline hyclate',
    brandName: null,
    strength: '100',
    strengthUnit: 'mg',
    formulation: 'Capsule',
    route: ['oral'],
    category: 'Antibiotics',
    description: 'Tetracycline antibiotic',
  },
  {
    id: 'MED-CIPRO-500',
    medicationName: 'Ciprofloxacin',
    genericName: 'Ciprofloxacin hydrochloride',
    brandName: 'Cipro',
    strength: '500',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antibiotics',
    description: 'Fluoroquinolone antibiotic',
  },
  {
    id: 'MED-HYDRO-25',
    medicationName: 'Hydrochlorothiazide',
    genericName: 'Hydrochlorothiazide',
    brandName: 'Microzide',
    strength: '25',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Diuretics',
    description: 'Thiazide diuretic for hypertension',
  },
  {
    id: 'MED-ENAPR-10',
    medicationName: 'Enalapril',
    genericName: 'Enalapril maleate',
    brandName: 'Vasotec',
    strength: '10',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antihypertensives',
    description: 'ACE inhibitor for hypertension',
  },
  {
    id: 'MED-ATORV-20',
    medicationName: 'Atorvastatin',
    genericName: 'Atorvastatin calcium',
    brandName: 'Lipitor',
    strength: '20',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Statins',
    description: 'HMG-CoA reductase inhibitor for cholesterol',
  },
  {
    id: 'MED-ASPIN-100',
    medicationName: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    brandName: null,
    strength: '100',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Antiplatelet Agents',
    description: 'Low-dose aspirin for cardiovascular protection',
  },
  {
    id: 'MED-VITAM-D3',
    medicationName: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    brandName: null,
    strength: '1000',
    strengthUnit: 'IU',
    formulation: 'Capsule',
    route: ['oral'],
    category: 'Vitamins',
    description: 'Vitamin D supplement',
  },
  {
    id: 'MED-FERRO-325',
    medicationName: 'Ferrous Sulfate',
    genericName: 'Ferrous sulfate',
    brandName: null,
    strength: '325',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    route: ['oral'],
    category: 'Iron Supplements',
    description: 'Iron supplement for anemia',
  },
]

// Sample patient context with demonstration data
export const samplePrescriptionContext: PrescriptionManagementContext = {
  patientId: 'ORH-2026-00124',
  patientName: 'Hana Mohammed',
  age: 34,
  sex: 'female',
  encounterId: 'ENC-2026-00087',
  encounterDate: '2026-10-12T09:15:00Z',
  encounterType: 'General Consultation',
  encounterStatus: 'in-progress',
  assignedClinician: 'Dr. Abebe Tadesse',
  isReadOnly: false,
  canPrescribe: true,
  allergyInfo: {
    allergyStatus: 'documented',
    documentedAllergies: [
      {
        id: 'ALLERGY-001',
        allergen: 'Penicillin',
        allergyType: 'medication',
        severity: 'severe',
        reaction: 'Anaphylaxis (rash, difficulty breathing)',
        recordedDate: '2024-03-15T10:30:00Z',
      },
    ],
  },
  currentDiagnoses: [
    {
      id: 'DIAG-001',
      diagnosisName: 'Acute upper respiratory infection, unspecified',
      icdCode: 'J06.9',
      designation: 'primary',
    },
  ],
}

// Sample medication orders
export const sampleMedicationOrders: MedicationOrder[] = [
  {
    id: 'RX-2026-00234',
    encounterId: 'ENC-2026-00087',
    medicationId: 'MED-PARAC-500',
    medicationName: 'Paracetamol',
    genericName: 'Paracetamol (Acetaminophen)',
    strength: '500',
    strengthUnit: 'mg',
    formulation: 'Tablet',
    dosageAmount: '1-2',
    dosageUnit: 'tablet',
    route: 'oral',
    frequency: 'every-6-hours',
    frequencyDescription: 'Every 6 hours as needed',
    duration: '7',
    durationUnit: 'days',
    quantity: '28',
    quantityUnit: 'tablets',
    refills: 0,
    startDate: '2026-10-12T09:30:00Z',
    endDate: '2026-10-19T09:30:00Z',
    patientInstructions:
      'Take 1-2 tablets every 6 hours as needed for pain or fever. Do not exceed 8 tablets in 24 hours.',
    internalNotes: 'For symptomatic relief of fever and body aches',
    prescribedBy: 'Dr. Abebe Tadesse',
    prescribedDate: '2026-10-12T09:30:00Z',
    status: 'submitted',
    statusChangedBy: null,
    statusChangedDate: null,
  },
]

// Sample historical medications
export const sampleHistoricalMedications: HistoricalMedication[] = [
  {
    id: 'RX-2026-00145',
    medicationName: 'Amlodipine',
    genericName: 'Amlodipine besylate',
    strength: '5',
    formulation: 'Tablet',
    dosageAmount: '1',
    frequency: 'Once daily',
    encounterId: 'ENC-2026-00056',
    encounterDate: '2026-08-20T10:00:00Z',
    encounterType: 'Follow-up',
    prescribedBy: 'Dr. Sarah Bekele',
    prescribedDate: '2026-08-20T10:15:00Z',
    status: 'dispensed',
  },
  {
    id: 'RX-2026-00087',
    medicationName: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    strength: '1000',
    formulation: 'Capsule',
    dosageAmount: '1',
    frequency: 'Once daily',
    encounterId: 'ENC-2026-00023',
    encounterDate: '2026-06-10T14:30:00Z',
    encounterType: 'General Consultation',
    prescribedBy: 'Dr. Abebe Tadesse',
    prescribedDate: '2026-06-10T14:45:00Z',
    status: 'dispensed',
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function searchMedicationCatalogue(query: string): MedicationCatalogueEntry[] {
  if (query.length < 2) return []

  const lowerQuery = query.toLowerCase()
  return sampleMedicationCatalogue.filter(
    (med) =>
      med.medicationName.toLowerCase().includes(lowerQuery) ||
      med.genericName.toLowerCase().includes(lowerQuery) ||
      (med.brandName && med.brandName.toLowerCase().includes(lowerQuery)) ||
      med.category.toLowerCase().includes(lowerQuery) ||
      `${med.strength}${med.strengthUnit}`.toLowerCase().includes(lowerQuery)
  )
}

export function getFrequencyLabel(code: FrequencyCode): string {
  const labels: Record<FrequencyCode, string> = {
    'once-daily': 'Once daily',
    'twice-daily': 'Twice daily',
    'three-times-daily': 'Three times daily',
    'four-times-daily': 'Four times daily',
    'every-4-hours': 'Every 4 hours',
    'every-6-hours': 'Every 6 hours',
    'every-8-hours': 'Every 8 hours',
    'every-12-hours': 'Every 12 hours',
    'once-weekly': 'Once weekly',
    'as-needed': 'As needed (PRN)',
    'at-bedtime': 'At bedtime',
    'before-meals': 'Before meals',
    'after-meals': 'After meals',
    other: 'See instructions',
  }
  return labels[code]
}

export function getRouteLabel(route: RouteOfAdministration): string {
  const labels: Record<RouteOfAdministration, string> = {
    oral: 'Oral',
    intravenous: 'Intravenous (IV)',
    intramuscular: 'Intramuscular (IM)',
    subcutaneous: 'Subcutaneous (SC)',
    topical: 'Topical',
    rectal: 'Rectal',
    inhalation: 'Inhalation',
    nasal: 'Nasal',
    ophthalmic: 'Ophthalmic (Eye)',
    otic: 'Otic (Ear)',
    transdermal: 'Transdermal',
    sublingual: 'Sublingual',
  }
  return labels[route]
}

export function getOrderStatusLabel(status: MedicationOrderStatus): string {
  const labels: Record<MedicationOrderStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    verified: 'Verified',
    dispensed: 'Dispensed',
    cancelled: 'Cancelled',
    expired: 'Expired',
  }
  return labels[status]
}

export function getOrderStatusClass(status: MedicationOrderStatus): string {
  const classes: Record<MedicationOrderStatus, string> = {
    draft: 'prescription-status-draft',
    submitted: 'prescription-status-submitted',
    verified: 'prescription-status-verified',
    dispensed: 'prescription-status-dispensed',
    cancelled: 'prescription-status-cancelled',
    expired: 'prescription-status-expired',
  }
  return classes[status]
}

export function hasUnsavedChanges(draft: PrescriptionDraft | null): boolean {
  if (!draft) return false
  if (!draft.medicationId) return false
  if (!draft.dosageAmount) return false
  if (!draft.route) return false
  if (!draft.frequency) return false
  return true
}

export function isDuplicateOrder(
  medicationId: string,
  existingOrders: MedicationOrder[]
): boolean {
  return existingOrders.some(
    (order) =>
      order.medicationId === medicationId &&
      (order.status === 'draft' || order.status === 'submitted' || order.status === 'verified')
  )
}

export function createEmptyDraft(): PrescriptionDraft {
  const today = new Date().toISOString().split('T')[0]
  return {
    medicationId: null,
    medicationName: '',
    genericName: '',
    strength: '',
    strengthUnit: '',
    formulation: '',
    dosageAmount: '',
    dosageUnit: null,
    route: null,
    frequency: null,
    frequencyDescription: '',
    duration: '',
    durationUnit: 'days',
    quantity: '',
    quantityUnit: '',
    refills: 0,
    startDate: today,
    endDate: '',
    patientInstructions: '',
    internalNotes: '',
  }
}

export function validatePrescriptionForm(
  draft: PrescriptionDraft
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!draft.medicationId) {
    errors.medication = 'Please select a medication from the catalogue'
  }

  if (!draft.dosageAmount || draft.dosageAmount.trim() === '') {
    errors.dosageAmount = 'Dosage amount is required'
  }

  if (!draft.dosageUnit) {
    errors.dosageUnit = 'Dosage unit is required'
  }

  if (!draft.route) {
    errors.route = 'Route of administration is required'
  }

  if (!draft.frequency) {
    errors.frequency = 'Frequency is required'
  }

  if (!draft.duration || draft.duration.trim() === '') {
    errors.duration = 'Duration is required'
  }

  if (!draft.quantity || draft.quantity.trim() === '') {
    errors.quantity = 'Quantity is required'
  }

  if (!draft.startDate) {
    errors.startDate = 'Start date is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatShortDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export function getAllergyStatusLabel(status: AllergyStatus): string {
  const labels: Record<AllergyStatus, string> = {
    documented: 'Documented allergies',
    'no-known-allergies': 'No known allergies',
    'not-recorded': 'Not recorded',
    'not-verified': 'Not verified',
  }
  return labels[status]
}

export function getAllergyStatusClass(status: AllergyStatus): string {
  const classes: Record<AllergyStatus, string> = {
    documented: 'allergy-status-documented',
    'no-known-allergies': 'allergy-status-none',
    'not-recorded': 'allergy-status-unknown',
    'not-verified': 'allergy-status-unknown',
  }
  return classes[status]
}
