// Specimen Collection model — fictional data only. All names, IDs, specimens are illustrative.

import type { LaboratoryRequest, SpecimenType, RequestPriority } from './model'

export type SpecimenStatus =
  | 'awaiting-collection'
  | 'collection-started'
  | 'collected-pending-verification'
  | 'verified'
  | 'rejected'
  | 'cancelled'

export type RejectionReason =
  | 'incorrect-specimen-type'
  | 'container-problem'
  | 'insufficient-quantity'
  | 'damaged-container'
  | 'labeling-issue'
  | 'contaminated'
  | 'other'

export type CollectionLocation =
  | 'outpatient-lab'
  | 'inpatient-ward'
  | 'emergency-department'
  | 'operating-room'
  | 'icu'
  | 'other'

// Specimen collection record
export type SpecimenCollection = {
  id: string
  requestId: string
  patientId: string
  patientName: string
  patientAge: number
  patientSex: 'male' | 'female' | 'other' | 'not-recorded'
  encounterId: string
  requestedTests: Array<{
    testName: string
    testCode: string
    specimenType: SpecimenType
  }>
  specimenType: SpecimenType
  specimenIdentifier: string
  collectedBy: string
  collectedDate: string
  collectedTime: string
  collectionLocation: CollectionLocation
  collectionNotes: string
  status: SpecimenStatus
  verifiedBy: string | null
  verifiedDate: string | null
  rejectionReason: RejectionReason | null
  rejectionNotes: string | null
  rejectedBy: string | null
  rejectedDate: string | null
  requestingClinician: string
  requestDate: string
  priority: RequestPriority
}

// Collection request (view of lab request needing collection)
export type CollectionRequest = {
  id: string // request ID
  patientId: string
  patientName: string
  patientAge: number
  patientSex: 'male' | 'female' | 'other' | 'not-recorded'
  dateOfBirth: string | null
  encounterId: string
  requestedTests: Array<{
    id: string
    testName: string
    testCode: string
    specimenType: SpecimenType
    specimenVolume: string
    specimenContainer: string
    specialInstructions: string
  }>
  requestingClinician: string
  requestDate: string
  priority: RequestPriority
  specimenStatus: SpecimenStatus
  specimenId: string | null
  collectedBy: string | null
  collectedDate: string | null
}

// Collection draft being created
export type CollectionDraft = {
  requestId: string
  patientId: string
  patientName: string
  patientConfirmed: boolean
  specimenType: SpecimenType | null
  specimenIdentifier: string
  collectionDate: string
  collectionTime: string
  collectionLocation: CollectionLocation | null
  collectionNotes: string
  collectedBy: string
}

// Rejection draft
export type RejectionDraft = {
  requestId: string
  specimenId: string | null
  rejectionReason: RejectionReason | null
  rejectionNotes: string
}

// Specimen Collection workspace context
export type SpecimenCollectionContext = {
  currentUser: string
  currentRole: 'lab-technician' | 'phlebotomist' | 'nurse' | 'other'
  canCollect: boolean
  canVerify: boolean
  canReject: boolean
  requiresSeparateVerification: boolean // if true, collector cannot verify own collection
}

// Collection queue state
export type CollectionQueueState = {
  context: SpecimenCollectionContext
  requests: CollectionRequest[]
  selectedRequest: CollectionRequest | null
  activeDraft: CollectionDraft | null
  activeRejection: RejectionDraft | null
  searchQuery: string
  statusFilter: SpecimenStatus | 'all'
  dateFilter: 'today' | 'yesterday' | 'week' | 'all'
  saveState: 'idle' | 'saving' | 'saved' | 'error'
}

// ============================================================================
// SAMPLE DATA - Demonstration collection requests
// ============================================================================

export const sampleCollectionContext: SpecimenCollectionContext = {
  currentUser: 'Nurse Sarah Bekele',
  currentRole: 'nurse',
  canCollect: true,
  canVerify: true,
  canReject: true,
  requiresSeparateVerification: false,
}

export const sampleCollectionRequests: CollectionRequest[] = [
  {
    id: 'LABREQ-2026-00145',
    patientId: 'ORH-2026-00124',
    patientName: 'Hana Mohammed',
    patientAge: 34,
    patientSex: 'female',
    dateOfBirth: '1992-03-15',
    encounterId: 'ENC-2026-00087',
    requestedTests: [
      {
        id: 'RT-001',
        testName: 'Complete Blood Count (CBC)',
        testCode: 'CBC',
        specimenType: 'blood-whole',
        specimenVolume: '3-5 ml',
        specimenContainer: 'EDTA tube (purple top)',
        specialInstructions: '',
      },
      {
        id: 'RT-002',
        testName: 'Erythrocyte Sedimentation Rate (ESR)',
        testCode: 'ESR',
        specimenType: 'blood-whole',
        specimenVolume: '2 ml',
        specimenContainer: 'EDTA tube (purple top)',
        specialInstructions: '',
      },
    ],
    requestingClinician: 'Dr. Abebe Tadesse',
    requestDate: '2026-10-12T09:45:00Z',
    priority: 'routine',
    specimenStatus: 'awaiting-collection',
    specimenId: null,
    collectedBy: null,
    collectedDate: null,
  },
  {
    id: 'LABREQ-2026-00156',
    patientId: 'ORH-2026-00089',
    patientName: 'Ahmed Hassan',
    patientAge: 52,
    patientSex: 'male',
    dateOfBirth: '1974-07-22',
    encounterId: 'ENC-2026-00091',
    requestedTests: [
      {
        id: 'RT-004',
        testName: 'Fasting Blood Glucose',
        testCode: 'FBG',
        specimenType: 'blood-serum',
        specimenVolume: '2 ml',
        specimenContainer: 'Plain tube (red top)',
        specialInstructions: 'Patient must be fasting for 8-12 hours',
      },
      {
        id: 'RT-005',
        testName: 'Lipid Profile',
        testCode: 'LIPID',
        specimenType: 'blood-serum',
        specimenVolume: '3 ml',
        specimenContainer: 'Plain tube (red top)',
        specialInstructions: 'Patient must be fasting for 12 hours',
      },
    ],
    requestingClinician: 'Dr. Marta Alemayehu',
    requestDate: '2026-10-12T08:30:00Z',
    priority: 'routine',
    specimenStatus: 'awaiting-collection',
    specimenId: null,
    collectedBy: null,
    collectedDate: null,
  },
  {
    id: 'LABREQ-2026-00148',
    patientId: 'ORH-2026-00112',
    patientName: 'Fatima Yusuf',
    patientAge: 28,
    patientSex: 'female',
    dateOfBirth: '1998-11-08',
    encounterId: 'ENC-2026-00093',
    requestedTests: [
      {
        id: 'RT-006',
        testName: 'Urinalysis (Complete)',
        testCode: 'UA',
        specimenType: 'urine',
        specimenVolume: '10-50 ml',
        specimenContainer: 'Clean urine container',
        specialInstructions: 'Clean-catch midstream specimen preferred',
      },
    ],
    requestingClinician: 'Dr. Abebe Tadesse',
    requestDate: '2026-10-12T10:20:00Z',
    priority: 'routine',
    specimenStatus: 'awaiting-collection',
    specimenId: null,
    collectedBy: null,
    collectedDate: null,
  },
  {
    id: 'LABREQ-2026-00122',
    patientId: 'ORH-2026-00124',
    patientName: 'Hana Mohammed',
    patientAge: 34,
    patientSex: 'female',
    dateOfBirth: '1992-03-15',
    encounterId: 'ENC-2026-00087',
    requestedTests: [
      {
        id: 'RT-003',
        testName: 'Malaria Rapid Test',
        testCode: 'MRDT',
        specimenType: 'blood-whole',
        specimenVolume: '2 ml',
        specimenContainer: 'EDTA tube (purple top)',
        specialInstructions: '',
      },
    ],
    requestingClinician: 'Dr. Abebe Tadesse',
    requestDate: '2026-10-12T09:30:00Z',
    priority: 'urgent',
    specimenStatus: 'verified',
    specimenId: 'SPEC-2026-00089',
    collectedBy: 'Nurse Sarah Bekele',
    collectedDate: '2026-10-12T09:35:00Z',
  },
  {
    id: 'LABREQ-2026-00163',
    patientId: 'ORH-2026-00098',
    patientName: 'Dawit Tesfaye',
    patientAge: 19,
    patientSex: 'male',
    dateOfBirth: '2007-05-14',
    encounterId: 'ENC-2026-00095',
    requestedTests: [
      {
        id: 'RT-007',
        testName: 'Blood Culture',
        testCode: 'BLDCX',
        specimenType: 'blood-whole',
        specimenVolume: '10 ml per bottle (2 bottles)',
        specimenContainer: 'Blood culture bottles (aerobic and anaerobic)',
        specialInstructions: 'Strict aseptic technique required. Collect before antibiotics if possible.',
      },
    ],
    requestingClinician: 'Dr. Solomon Girma',
    requestDate: '2026-10-12T11:15:00Z',
    priority: 'urgent',
    specimenStatus: 'collected-pending-verification',
    specimenId: 'SPEC-2026-00091',
    collectedBy: 'Phlebotomist Ahmed Ali',
    collectedDate: '2026-10-12T11:30:00Z',
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getSpecimenStatusLabel(status: SpecimenStatus): string {
  const labels: Record<SpecimenStatus, string> = {
    'awaiting-collection': 'Awaiting Collection',
    'collection-started': 'Collection Started',
    'collected-pending-verification': 'Collected — Verification Pending',
    verified: 'Verified',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function getSpecimenStatusClass(status: SpecimenStatus): string {
  const classes: Record<SpecimenStatus, string> = {
    'awaiting-collection': 'specimen-status-awaiting',
    'collection-started': 'specimen-status-started',
    'collected-pending-verification': 'specimen-status-pending',
    verified: 'specimen-status-verified',
    rejected: 'specimen-status-rejected',
    cancelled: 'specimen-status-cancelled',
  }
  return classes[status]
}

export function getRejectionReasonLabel(reason: RejectionReason): string {
  const labels: Record<RejectionReason, string> = {
    'incorrect-specimen-type': 'Incorrect specimen type',
    'container-problem': 'Container or labeling problem',
    'insufficient-quantity': 'Insufficient specimen quantity',
    'damaged-container': 'Damaged or leaking container',
    'labeling-issue': 'Labeling issue',
    contaminated: 'Contaminated specimen',
    other: 'Other (see notes)',
  }
  return labels[reason]
}

export function getCollectionLocationLabel(location: CollectionLocation): string {
  const labels: Record<CollectionLocation, string> = {
    'outpatient-lab': 'Outpatient Laboratory',
    'inpatient-ward': 'Inpatient Ward',
    'emergency-department': 'Emergency Department',
    'operating-room': 'Operating Room',
    icu: 'Intensive Care Unit',
    other: 'Other',
  }
  return labels[location]
}

export function createEmptyCollectionDraft(request: CollectionRequest, currentUser: string): CollectionDraft {
  const now = new Date()
  return {
    requestId: request.id,
    patientId: request.patientId,
    patientName: request.patientName,
    patientConfirmed: false,
    specimenType: request.requestedTests[0]?.specimenType || null,
    specimenIdentifier: '',
    collectionDate: now.toISOString().split('T')[0],
    collectionTime: now.toTimeString().substring(0, 5),
    collectionLocation: null,
    collectionNotes: '',
    collectedBy: currentUser,
  }
}

export function createEmptyRejectionDraft(request: CollectionRequest): RejectionDraft {
  return {
    requestId: request.id,
    specimenId: request.specimenId,
    rejectionReason: null,
    rejectionNotes: '',
  }
}

export function validateCollectionDraft(
  draft: CollectionDraft
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!draft.patientConfirmed) {
    errors.patientConfirmed = 'You must confirm the patient identity before proceeding'
  }

  if (!draft.specimenType) {
    errors.specimenType = 'Specimen type is required'
  }

  if (!draft.specimenIdentifier || draft.specimenIdentifier.trim() === '') {
    errors.specimenIdentifier = 'Specimen identifier is required'
  }

  if (!draft.collectionDate) {
    errors.collectionDate = 'Collection date is required'
  }

  if (!draft.collectionTime) {
    errors.collectionTime = 'Collection time is required'
  }

  if (!draft.collectionLocation) {
    errors.collectionLocation = 'Collection location is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateRejectionDraft(
  draft: RejectionDraft
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!draft.rejectionReason) {
    errors.rejectionReason = 'Rejection reason is required'
  }

  if (draft.rejectionReason === 'other' && (!draft.rejectionNotes || draft.rejectionNotes.trim() === '')) {
    errors.rejectionNotes = 'Please provide details when selecting "Other" as rejection reason'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function canStartCollection(
  request: CollectionRequest,
  context: SpecimenCollectionContext
): boolean {
  if (!context.canCollect) return false
  return request.specimenStatus === 'awaiting-collection' || request.specimenStatus === 'collection-started'
}

export function canVerify(
  request: CollectionRequest,
  context: SpecimenCollectionContext
): boolean {
  if (!context.canVerify) return false
  if (request.specimenStatus !== 'collected-pending-verification') return false
  
  // If separate verification required, cannot verify own collection
  if (context.requiresSeparateVerification && request.collectedBy === context.currentUser) {
    return false
  }
  
  return true
}

export function canReject(
  request: CollectionRequest,
  context: SpecimenCollectionContext
): boolean {
  if (!context.canReject) return false
  return (
    request.specimenStatus === 'collected-pending-verification' ||
    request.specimenStatus === 'awaiting-collection' ||
    request.specimenStatus === 'collection-started'
  )
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

export function formatSpecimenStatus(status: SpecimenStatus | 'not-collected'): string {
  const labels: Record<SpecimenStatus | 'not-collected', string> = {
    'not-collected': 'Not Collected',
    'awaiting-collection': 'Awaiting Collection',
    'collection-started': 'Collection Started',
    'collected-pending-verification': 'Pending Verification',
    'verified': 'Verified',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
  }
  return labels[status]
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(time: string): string {
  return time // Already in HH:MM format
}

export function generateSpecimenId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `SPEC-${year}-${random}`
}


// Alias exports for compatibility with SpecimenCollectionPage
export const demoCollectionRequests = sampleCollectionRequests
export const demoCollectionUser = sampleCollectionContext.currentUser

// Permission check helpers
export function canCollectSpecimen(request: CollectionRequest, context: SpecimenCollectionContext): boolean {
  return canStartCollection(request, context)
}

export function canVerifySpecimen(request: CollectionRequest, context: SpecimenCollectionContext): boolean {
  return canVerify(request, context)
}

export function canRejectSpecimen(request: CollectionRequest, context: SpecimenCollectionContext): boolean {
  return canReject(request, context)
}

// Status transition helper
export function getNextSpecimenStatus(
  currentStatus: SpecimenStatus,
  action: 'collect' | 'verify' | 'reject'
): SpecimenStatus {
  if (action === 'collect') {
    if (currentStatus === 'awaiting-collection' || currentStatus === 'collection-started') {
      return 'collected-pending-verification'
    }
  } else if (action === 'verify') {
    if (currentStatus === 'collected-pending-verification') {
      return 'verified'
    }
  } else if (action === 'reject') {
    return 'rejected'
  }
  return currentStatus
}


// Alias for collection location formatter
export function formatCollectionLocation(location: CollectionLocation): string {
  return getCollectionLocationLabel(location)
}
