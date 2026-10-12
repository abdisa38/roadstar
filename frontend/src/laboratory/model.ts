// Laboratory Orders model — fictional data only. All names, IDs, test results are illustrative.

export type RequestStatus =
  | 'draft'
  | 'requested'
  | 'accepted'
  | 'specimen-collection-pending'
  | 'specimen-collected'
  | 'in-progress'
  | 'result-available'
  | 'cancelled'

export type RequestPriority = 'routine' | 'urgent' | 'stat'

export type SpecimenType =
  | 'blood-whole'
  | 'blood-serum'
  | 'blood-plasma'
  | 'urine'
  | 'stool'
  | 'sputum'
  | 'csf'
  | 'swab'
  | 'tissue'
  | 'other'

export type TestCategory =
  | 'hematology'
  | 'biochemistry'
  | 'microbiology'
  | 'serology'
  | 'urinalysis'
  | 'parasitology'
  | 'histopathology'
  | 'other'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// Laboratory test catalogue entry
export type LabTestCatalogueEntry = {
  id: string
  testName: string
  testCode: string
  category: TestCategory
  specimenType: SpecimenType
  specimenVolume: string
  specimenContainer: string
  description: string
  turnaroundTime: string
  requiresFasting: boolean
}

// Individual test in a request
export type RequestedTest = {
  id: string
  testCatalogueId: string
  testName: string
  testCode: string
  specimenType: SpecimenType
  notes: string
}

// Laboratory request
export type LaboratoryRequest = {
  id: string
  encounterId: string
  patientId: string
  requestedTests: RequestedTest[]
  clinicalIndication: string
  requestNotes: string
  priority: RequestPriority
  orderedBy: string
  orderedDate: string
  status: RequestStatus
  statusChangedBy: string | null
  statusChangedDate: string | null
  specimenCollectedDate: string | null
  specimenCollectedBy: string | null
  resultAvailableDate: string | null
  cancelledReason: string | null
  isUnsaved?: boolean
}

// Draft request being created
export type RequestDraft = {
  selectedTests: RequestedTest[]
  clinicalIndication: string
  requestNotes: string
  priority: RequestPriority
}

// Request status history entry
export type StatusHistoryEntry = {
  status: RequestStatus
  timestamp: string
  changedBy: string
  notes: string
}

// Result summary (simplified - full result entry is separate workflow)
export type ResultSummary = {
  requestId: string
  availableDate: string
  reviewedBy: string | null
  reviewedDate: string | null
  criticalValues: boolean
  abnormalFindings: boolean
}

// Patient and encounter context
export type LaboratoryOrderContext = {
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
  canOrderTests: boolean
}

// Complete laboratory orders state
export type LaboratoryOrdersState = {
  context: LaboratoryOrderContext
  requests: LaboratoryRequest[]
  activeDraft: RequestDraft | null
  saveState: SaveState
  lastSaved: string | null
  catalogueAvailable: boolean
  searchQuery: string
  statusFilter: RequestStatus | 'all'
}

// ============================================================================
// SAMPLE DATA - Fictional laboratory test catalogue
// ============================================================================

export const sampleLabTestCatalogue: LabTestCatalogueEntry[] = [
  // Hematology
  {
    id: 'LAB-CBC-001',
    testName: 'Complete Blood Count (CBC)',
    testCode: 'CBC',
    category: 'hematology',
    specimenType: 'blood-whole',
    specimenVolume: '3-5 ml',
    specimenContainer: 'EDTA tube (purple top)',
    description: 'Full blood count including WBC, RBC, hemoglobin, hematocrit, platelets, and differential',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-ESR-001',
    testName: 'Erythrocyte Sedimentation Rate (ESR)',
    testCode: 'ESR',
    category: 'hematology',
    specimenType: 'blood-whole',
    specimenVolume: '2 ml',
    specimenContainer: 'EDTA tube (purple top)',
    description: 'Measures rate at which RBCs settle, indicator of inflammation',
    turnaroundTime: '1-2 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-HEMO-001',
    testName: 'Hemoglobin',
    testCode: 'HB',
    category: 'hematology',
    specimenType: 'blood-whole',
    specimenVolume: '2 ml',
    specimenContainer: 'EDTA tube (purple top)',
    description: 'Measures hemoglobin concentration in blood',
    turnaroundTime: '1 hour',
    requiresFasting: false,
  },

  // Biochemistry
  {
    id: 'LAB-GLUC-001',
    testName: 'Fasting Blood Glucose',
    testCode: 'FBG',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '2 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Measures blood glucose levels after fasting',
    turnaroundTime: '1-2 hours',
    requiresFasting: true,
  },
  {
    id: 'LAB-GLUC-002',
    testName: 'Random Blood Glucose',
    testCode: 'RBG',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '2 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Measures blood glucose at any time',
    turnaroundTime: '1-2 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-HBA1C-001',
    testName: 'Glycated Hemoglobin (HbA1c)',
    testCode: 'HBA1C',
    category: 'biochemistry',
    specimenType: 'blood-whole',
    specimenVolume: '2 ml',
    specimenContainer: 'EDTA tube (purple top)',
    description: 'Average blood glucose over past 2-3 months',
    turnaroundTime: '24 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-CREAT-001',
    testName: 'Serum Creatinine',
    testCode: 'CREAT',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '2 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Kidney function test',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-UREA-001',
    testName: 'Blood Urea Nitrogen (BUN)',
    testCode: 'BUN',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '2 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Kidney function test',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-LFT-001',
    testName: 'Liver Function Tests (LFT Panel)',
    testCode: 'LFT',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '5 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Panel including ALT, AST, ALP, bilirubin, albumin, total protein',
    turnaroundTime: '4-6 hours',
    requiresFasting: true,
  },
  {
    id: 'LAB-LIPID-001',
    testName: 'Lipid Profile',
    testCode: 'LIPID',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '3 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Total cholesterol, HDL, LDL, triglycerides',
    turnaroundTime: '4-6 hours',
    requiresFasting: true,
  },
  {
    id: 'LAB-ELEC-001',
    testName: 'Electrolytes Panel',
    testCode: 'ELEC',
    category: 'biochemistry',
    specimenType: 'blood-serum',
    specimenVolume: '2 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Sodium, potassium, chloride, bicarbonate',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },

  // Microbiology
  {
    id: 'LAB-CULT-001',
    testName: 'Blood Culture',
    testCode: 'BLDCX',
    category: 'microbiology',
    specimenType: 'blood-whole',
    specimenVolume: '10 ml per bottle (2 bottles)',
    specimenContainer: 'Blood culture bottles (aerobic and anaerobic)',
    description: 'Culture and sensitivity for bacterial identification',
    turnaroundTime: '48-72 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-URINE-001',
    testName: 'Urine Culture and Sensitivity',
    testCode: 'URCX',
    category: 'microbiology',
    specimenType: 'urine',
    specimenVolume: '5-10 ml',
    specimenContainer: 'Sterile urine container',
    description: 'Culture and antibiotic sensitivity testing',
    turnaroundTime: '48-72 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-SPUTUM-001',
    testName: 'Sputum Culture and AFB',
    testCode: 'SPUTCX',
    category: 'microbiology',
    specimenType: 'sputum',
    specimenVolume: '5-10 ml',
    specimenContainer: 'Sterile sputum container',
    description: 'Culture for bacteria including acid-fast bacilli (TB)',
    turnaroundTime: '3-7 days (AFB may take longer)',
    requiresFasting: false,
  },
  {
    id: 'LAB-STOOL-001',
    testName: 'Stool Culture',
    testCode: 'STLCX',
    category: 'microbiology',
    specimenType: 'stool',
    specimenVolume: '5-10 grams',
    specimenContainer: 'Sterile stool container',
    description: 'Culture for enteric pathogens',
    turnaroundTime: '48-72 hours',
    requiresFasting: false,
  },

  // Serology
  {
    id: 'LAB-HIV-001',
    testName: 'HIV Screening',
    testCode: 'HIV',
    category: 'serology',
    specimenType: 'blood-serum',
    specimenVolume: '3 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'HIV antibody screening test',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-HEP-001',
    testName: 'Hepatitis B Surface Antigen',
    testCode: 'HBSAG',
    category: 'serology',
    specimenType: 'blood-serum',
    specimenVolume: '3 ml',
    specimenContainer: 'Plain tube (red top)',
    description: 'Screening for Hepatitis B infection',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-MALARIA-001',
    testName: 'Malaria Rapid Test',
    testCode: 'MRDT',
    category: 'parasitology',
    specimenType: 'blood-whole',
    specimenVolume: '2 ml',
    specimenContainer: 'EDTA tube (purple top)',
    description: 'Rapid diagnostic test for malaria parasites',
    turnaroundTime: '30 minutes',
    requiresFasting: false,
  },
  {
    id: 'LAB-MALARIA-002',
    testName: 'Malaria Blood Film',
    testCode: 'MALBF',
    category: 'parasitology',
    specimenType: 'blood-whole',
    specimenVolume: '2 ml',
    specimenContainer: 'EDTA tube (purple top)',
    description: 'Microscopic examination for malaria parasites',
    turnaroundTime: '2-4 hours',
    requiresFasting: false,
  },

  // Urinalysis
  {
    id: 'LAB-URINE-002',
    testName: 'Urinalysis (Complete)',
    testCode: 'UA',
    category: 'urinalysis',
    specimenType: 'urine',
    specimenVolume: '10-50 ml',
    specimenContainer: 'Clean urine container',
    description: 'Physical, chemical, and microscopic examination of urine',
    turnaroundTime: '1-2 hours',
    requiresFasting: false,
  },
  {
    id: 'LAB-PREG-001',
    testName: 'Pregnancy Test (Urine)',
    testCode: 'UPREG',
    category: 'urinalysis',
    specimenType: 'urine',
    specimenVolume: '5 ml',
    specimenContainer: 'Clean urine container',
    description: 'Qualitative pregnancy test',
    turnaroundTime: '15-30 minutes',
    requiresFasting: false,
  },
]

// Sample patient context
export const sampleLabContext: LaboratoryOrderContext = {
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
  canOrderTests: true,
}

// Sample laboratory requests
export const sampleLabRequests: LaboratoryRequest[] = [
  {
    id: 'LABREQ-2026-00145',
    encounterId: 'ENC-2026-00087',
    patientId: 'ORH-2026-00124',
    requestedTests: [
      {
        id: 'RT-001',
        testCatalogueId: 'LAB-CBC-001',
        testName: 'Complete Blood Count (CBC)',
        testCode: 'CBC',
        specimenType: 'blood-whole',
        notes: '',
      },
      {
        id: 'RT-002',
        testCatalogueId: 'LAB-ESR-001',
        testName: 'Erythrocyte Sedimentation Rate (ESR)',
        testCode: 'ESR',
        specimenType: 'blood-whole',
        notes: '',
      },
    ],
    clinicalIndication: 'Fever and fatigue, r/o infection or anemia',
    requestNotes: '',
    priority: 'routine',
    orderedBy: 'Dr. Abebe Tadesse',
    orderedDate: '2026-10-12T09:45:00Z',
    status: 'specimen-collected',
    statusChangedBy: 'Nurse Sarah Bekele',
    statusChangedDate: '2026-10-12T10:15:00Z',
    specimenCollectedDate: '2026-10-12T10:15:00Z',
    specimenCollectedBy: 'Nurse Sarah Bekele',
    resultAvailableDate: null,
    cancelledReason: null,
  },
  {
    id: 'LABREQ-2026-00122',
    encounterId: 'ENC-2026-00087',
    patientId: 'ORH-2026-00124',
    requestedTests: [
      {
        id: 'RT-003',
        testCatalogueId: 'LAB-MALARIA-001',
        testName: 'Malaria Rapid Test',
        testCode: 'MRDT',
        specimenType: 'blood-whole',
        notes: '',
      },
    ],
    clinicalIndication: 'Fever with chills, suspect malaria',
    requestNotes: 'Patient travelled to endemic area last week',
    priority: 'urgent',
    orderedBy: 'Dr. Abebe Tadesse',
    orderedDate: '2026-10-12T09:30:00Z',
    status: 'result-available',
    statusChangedBy: 'Lab Tech Ahmed Hassan',
    statusChangedDate: '2026-10-12T10:00:00Z',
    specimenCollectedDate: '2026-10-12T09:35:00Z',
    specimenCollectedBy: 'Nurse Sarah Bekele',
    resultAvailableDate: '2026-10-12T10:00:00Z',
    cancelledReason: null,
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function searchLabTestCatalogue(query: string): LabTestCatalogueEntry[] {
  if (query.length < 2) return []

  const lowerQuery = query.toLowerCase()
  return sampleLabTestCatalogue.filter(
    (test) =>
      test.testName.toLowerCase().includes(lowerQuery) ||
      test.testCode.toLowerCase().includes(lowerQuery) ||
      test.category.toLowerCase().includes(lowerQuery) ||
      test.description.toLowerCase().includes(lowerQuery)
  )
}

export function getRequestStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    draft: 'Draft',
    requested: 'Requested',
    accepted: 'Accepted',
    'specimen-collection-pending': 'Specimen Collection Pending',
    'specimen-collected': 'Specimen Collected',
    'in-progress': 'In Progress',
    'result-available': 'Result Available',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function getRequestStatusClass(status: RequestStatus): string {
  const classes: Record<RequestStatus, string> = {
    draft: 'lab-status-draft',
    requested: 'lab-status-requested',
    accepted: 'lab-status-accepted',
    'specimen-collection-pending': 'lab-status-specimen-pending',
    'specimen-collected': 'lab-status-specimen-collected',
    'in-progress': 'lab-status-in-progress',
    'result-available': 'lab-status-result-available',
    cancelled: 'lab-status-cancelled',
  }
  return classes[status]
}

export function getPriorityLabel(priority: RequestPriority): string {
  const labels: Record<RequestPriority, string> = {
    routine: 'Routine',
    urgent: 'Urgent',
    stat: 'STAT',
  }
  return labels[priority]
}

export function getPriorityClass(priority: RequestPriority): string {
  const classes: Record<RequestPriority, string> = {
    routine: 'lab-priority-routine',
    urgent: 'lab-priority-urgent',
    stat: 'lab-priority-stat',
  }
  return classes[priority]
}

export function getCategoryLabel(category: TestCategory): string {
  const labels: Record<TestCategory, string> = {
    hematology: 'Hematology',
    biochemistry: 'Biochemistry',
    microbiology: 'Microbiology',
    serology: 'Serology',
    urinalysis: 'Urinalysis',
    parasitology: 'Parasitology',
    histopathology: 'Histopathology',
    other: 'Other',
  }
  return labels[category]
}

export function getSpecimenTypeLabel(specimenType: SpecimenType): string {
  const labels: Record<SpecimenType, string> = {
    'blood-whole': 'Whole Blood',
    'blood-serum': 'Serum',
    'blood-plasma': 'Plasma',
    urine: 'Urine',
    stool: 'Stool',
    sputum: 'Sputum',
    csf: 'CSF',
    swab: 'Swab',
    tissue: 'Tissue',
    other: 'Other',
  }
  return labels[specimenType]
}

export function hasUnsavedChanges(draft: RequestDraft | null): boolean {
  if (!draft) return false
  if (draft.selectedTests.length === 0) return false
  if (draft.clinicalIndication.trim() === '') return false
  return true
}

export function isDuplicateTest(
  testId: string,
  selectedTests: RequestedTest[]
): boolean {
  return selectedTests.some((test) => test.testCatalogueId === testId)
}

export function createEmptyDraft(): RequestDraft {
  return {
    selectedTests: [],
    clinicalIndication: '',
    requestNotes: '',
    priority: 'routine',
  }
}

export function validateLabRequest(
  draft: RequestDraft
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (draft.selectedTests.length === 0) {
    errors.tests = 'Please select at least one laboratory test'
  }

  if (!draft.clinicalIndication || draft.clinicalIndication.trim() === '') {
    errors.clinicalIndication = 'Clinical indication is required'
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

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function canCancelRequest(
  request: LaboratoryRequest,
  canOrderTests: boolean
): boolean {
  if (!canOrderTests) return false
  // Can cancel draft, requested, or accepted requests
  // Cannot cancel after specimen collected or if in progress
  return (
    request.status === 'draft' ||
    request.status === 'requested' ||
    request.status === 'accepted'
  )
}

export function canViewResult(request: LaboratoryRequest): boolean {
  return request.status === 'result-available'
}

export function getStatusTimestamp(request: LaboratoryRequest): string {
  if (request.status === 'result-available' && request.resultAvailableDate) {
    return request.resultAvailableDate
  }
  if (
    (request.status === 'specimen-collected' || request.status === 'in-progress') &&
    request.specimenCollectedDate
  ) {
    return request.specimenCollectedDate
  }
  if (request.statusChangedDate) {
    return request.statusChangedDate
  }
  return request.orderedDate
}
