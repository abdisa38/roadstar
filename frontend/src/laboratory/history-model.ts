/**
 * Laboratory History Model (Prompt 35)
 * Data structures for historical laboratory record retrieval
 */

import type { RequestPriority, TestType } from './model'
import type { ResultFlag } from './result-entry-model'

// Historical record status types
export type HistoricalOrderStatus =
  | 'completed'
  | 'approved'
  | 'released'
  | 'corrected'
  | 'amended'
  | 'cancelled'

export type HistoricalResultStatus =
  | 'finalized'
  | 'approved'
  | 'released'
  | 'corrected'
  | 'amended'

// Historical record in list view
export interface HistoricalRecord {
  recordId: string
  orderNumber: string
  patientId: string
  patientName: string
  testSummary: string
  orderingDepartment: string
  orderingClinician?: string
  orderDate: string
  completionDate?: string
  priority: RequestPriority
  orderStatus: HistoricalOrderStatus
  resultStatus: HistoricalResultStatus
  hasCorrections: boolean
  hasAmendments: boolean
  isReleased: boolean
}

// Detailed historical record
export interface HistoricalRecordDetail {
  recordId: string
  orderNumber: string
  
  // Order information
  orderDate: string
  orderingClinician: string
  orderingDepartment: string
  priority: RequestPriority
  completionDate?: string
  
  // Patient information
  patientId: string
  patientName: string
  age?: number
  sex?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  
  // Specimen information
  specimenType: string
  specimenId?: string
  specimenCollectedAt?: string
  specimenReceivedAt?: string
  specimenNotes?: string
  
  // Test results
  tests: HistoricalTestResult[]
  
  // Review and release
  reviewedBy?: string
  reviewedAt?: string
  approvedBy?: string
  approvedAt?: string
  releasedBy?: string
  releasedAt?: string
  
  // Status
  orderStatus: HistoricalOrderStatus
  resultStatus: HistoricalResultStatus
  
  // Metadata
  hasCorrections: boolean
  hasAmendments: boolean
  versionNumber: number
  lastModifiedAt: string
  lastModifiedBy?: string
}

// Historical test result
export interface HistoricalTestResult {
  testId: string
  testName: string
  testType: TestType
  results: HistoricalAnalyteResult[]
  laboratoryComments?: string
  interpretation?: string
  performedBy?: string
  performedAt?: string
}

// Historical analyte result
export interface HistoricalAnalyteResult {
  analyteName: string
  value: string
  unit: string
  referenceInterval?: string
  flag: ResultFlag
  isCorrected: boolean
  isAmended: boolean
  comments?: string
}

// Correction record
export interface CorrectionRecord {
  correctionId: string
  orderNumber: string
  analyteName: string
  originalValue: string
  correctedValue: string
  unit: string
  referenceInterval?: string
  correctionReason: string
  correctedBy: string
  correctedAt: string
  approvedBy?: string
  approvedAt?: string
  auditReference?: string
}

// Amendment record
export interface AmendmentRecord {
  amendmentId: string
  orderNumber: string
  amendmentType: 'result-correction' | 'interpretation-update' | 'comment-addition' | 'other'
  description: string
  amendedBy: string
  amendedAt: string
  approvedBy?: string
  approvedAt?: string
  auditReference?: string
}

// Historical timeline event
export interface HistoricalTimelineEvent {
  eventId: string
  eventType: 
    | 'order-created'
    | 'specimen-collected'
    | 'specimen-received'
    | 'results-entered'
    | 'results-submitted'
    | 'correction-requested'
    | 'results-resubmitted'
    | 'results-approved'
    | 'results-released'
    | 'result-corrected'
    | 'result-amended'
    | 'order-cancelled'
  timestamp: string
  performedBy?: string
  description?: string
  statusBefore?: string
  statusAfter?: string
}

// Result comparison
export interface ResultComparison {
  analyteName: string
  currentResult: {
    value: string
    unit: string
    date: string
    orderNumber: string
    referenceInterval?: string
    flag: ResultFlag
  }
  historicalResult: {
    value: string
    unit: string
    date: string
    orderNumber: string
    referenceInterval?: string
    flag: ResultFlag
  }
  trend?: 'increasing' | 'decreasing' | 'stable'
  percentChange?: number
  absoluteChange?: number
}

// Search filters
export interface HistorySearchFilters {
  searchTerm: string
  dateRange: {
    start: string
    end: string
  }
  patientId?: string
  testCategory?: TestType | 'all'
  testName?: string
  orderingDepartment?: string
  orderingClinician?: string
  priority?: RequestPriority | 'all'
  orderStatus?: HistoricalOrderStatus | 'all'
  resultStatus?: HistoricalResultStatus | 'all'
  showCorrectedOnly: boolean
  showReleasedOnly: boolean
}

// History metrics
export interface HistoryMetrics {
  completedOrders: number
  resultsReleased: number
  correctedOrAmended: number
  recordsInPeriod: number
}

// User permissions for history
export interface HistoryPermissions {
  canViewHistory: boolean
  canViewAllPatients: boolean
  canViewClinicianInfo: boolean
  canViewReviewInfo: boolean
  canViewAuditHistory: boolean
  canExportRecords: boolean
  canPrintRecords: boolean
  canViewCorrections: boolean
}

// History context
export interface HistoryContext {
  currentUser: string
  currentRole: string
  permissions: HistoryPermissions
}

// ============================================================================
// DEMO DATA
// ============================================================================

export const demoHistoryContext: HistoryContext = {
  currentUser: 'Dr. Solomon Tadesse',
  currentRole: 'Pathologist',
  permissions: {
    canViewHistory: true,
    canViewAllPatients: true,
    canViewClinicianInfo: true,
    canViewReviewInfo: true,
    canViewAuditHistory: true,
    canExportRecords: true,
    canPrintRecords: true,
    canViewCorrections: true,
  },
}

export const demoHistoricalRecords: HistoricalRecord[] = [
  {
    recordId: 'rec-001',
    orderNumber: 'ORD-LAB-2026-00117',
    patientId: 'ORH-P-000208',
    patientName: 'Hana Mohammed',
    testSummary: 'Complete Blood Count (CBC)',
    orderingDepartment: 'Internal Medicine',
    orderingClinician: 'Dr. Tigist Alemu',
    orderDate: '2026-10-10T08:30:00',
    completionDate: '2026-10-10T16:45:00',
    priority: 'urgent',
    orderStatus: 'released',
    resultStatus: 'released',
    hasCorrections: false,
    hasAmendments: false,
    isReleased: true,
  },
  {
    recordId: 'rec-002',
    orderNumber: 'ORD-LAB-2026-00102',
    patientId: 'ORH-P-000182',
    patientName: 'Abebe Bekele',
    testSummary: 'Fasting Blood Glucose',
    orderingDepartment: 'Endocrinology',
    orderingClinician: 'Dr. Marta Girma',
    orderDate: '2026-10-08T07:15:00',
    completionDate: '2026-10-08T11:30:00',
    priority: 'routine',
    orderStatus: 'released',
    resultStatus: 'released',
    hasCorrections: true,
    hasAmendments: false,
    isReleased: true,
  },
  {
    recordId: 'rec-003',
    orderNumber: 'ORD-LAB-2026-00091',
    patientId: 'ORH-P-000156',
    patientName: 'Fatuma Ibrahim',
    testSummary: 'Urinalysis',
    orderingDepartment: 'Obstetrics',
    orderingClinician: 'Dr. Solomon Gebre',
    orderDate: '2026-10-05T09:00:00',
    completionDate: '2026-10-05T14:20:00',
    priority: 'routine',
    orderStatus: 'released',
    resultStatus: 'released',
    hasCorrections: false,
    hasAmendments: false,
    isReleased: true,
  },
  {
    recordId: 'rec-004',
    orderNumber: 'ORD-LAB-2026-00085',
    patientId: 'ORH-P-000142',
    patientName: 'Kebede Alemayehu',
    testSummary: 'Liver Function Tests (LFT)',
    orderingDepartment: 'Gastroenterology',
    orderingClinician: 'Dr. Dawit Bekele',
    orderDate: '2026-10-03T10:45:00',
    completionDate: '2026-10-03T17:15:00',
    priority: 'routine',
    orderStatus: 'released',
    resultStatus: 'released',
    hasCorrections: true,
    hasAmendments: true,
    isReleased: true,
  },
  {
    recordId: 'rec-005',
    orderNumber: 'ORD-LAB-2026-00078',
    patientId: 'ORH-P-000208',
    patientName: 'Hana Mohammed',
    testSummary: 'Complete Blood Count (CBC)',
    orderingDepartment: 'Internal Medicine',
    orderingClinician: 'Dr. Tigist Alemu',
    orderDate: '2026-09-28T08:00:00',
    completionDate: '2026-09-28T15:30:00',
    priority: 'routine',
    orderStatus: 'released',
    resultStatus: 'released',
    hasCorrections: false,
    hasAmendments: false,
    isReleased: true,
  },
]

export const demoHistoricalRecordDetail: HistoricalRecordDetail = {
  recordId: 'rec-001',
  orderNumber: 'ORD-LAB-2026-00117',
  
  orderDate: '2026-10-10T08:30:00',
  orderingClinician: 'Dr. Tigist Alemu',
  orderingDepartment: 'Internal Medicine',
  priority: 'urgent',
  completionDate: '2026-10-10T16:45:00',
  
  patientId: 'ORH-P-000208',
  patientName: 'Hana Mohammed',
  age: 34,
  sex: 'female',
  dateOfBirth: '1992-03-15',
  
  specimenType: 'Blood - EDTA',
  specimenId: 'SPEC-2026-00245',
  specimenCollectedAt: '2026-10-10T09:15:00',
  specimenReceivedAt: '2026-10-10T09:45:00',
  specimenNotes: 'Adequate volume, no hemolysis',
  
  tests: [
    {
      testId: 'test-001',
      testName: 'Complete Blood Count',
      testType: 'hematology',
      results: [
        {
          analyteName: 'Hemoglobin',
          value: '12.8',
          unit: 'g/dL',
          referenceInterval: '12.0-15.5 g/dL (female)',
          flag: 'normal',
          isCorrected: false,
          isAmended: false,
        },
        {
          analyteName: 'White Blood Cell Count',
          value: '7.2',
          unit: '10³/µL',
          referenceInterval: '4.0-11.0 × 10³/µL',
          flag: 'normal',
          isCorrected: false,
          isAmended: false,
        },
        {
          analyteName: 'Platelet Count',
          value: '245',
          unit: '10³/µL',
          referenceInterval: '150-400 × 10³/µL',
          flag: 'normal',
          isCorrected: false,
          isAmended: false,
        },
        {
          analyteName: 'Red Blood Cell Count',
          value: '4.5',
          unit: '10⁶/µL',
          referenceInterval: '4.0-5.2 × 10⁶/µL (female)',
          flag: 'normal',
          isCorrected: false,
          isAmended: false,
        },
        {
          analyteName: 'Hematocrit',
          value: '38.5',
          unit: '%',
          referenceInterval: '34.9-44.5% (female)',
          flag: 'normal',
          isCorrected: false,
          isAmended: false,
        },
      ],
      laboratoryComments: 'All parameters within normal limits',
      performedBy: 'Almaz Tesfaye (Lab Technician)',
      performedAt: '2026-10-10T14:30:00',
    },
  ],
  
  reviewedBy: 'Dr. Solomon Tadesse',
  reviewedAt: '2026-10-10T15:15:00',
  approvedBy: 'Dr. Solomon Tadesse',
  approvedAt: '2026-10-10T15:20:00',
  releasedBy: 'Dr. Solomon Tadesse',
  releasedAt: '2026-10-10T16:45:00',
  
  orderStatus: 'released',
  resultStatus: 'released',
  
  hasCorrections: false,
  hasAmendments: false,
  versionNumber: 1,
  lastModifiedAt: '2026-10-10T16:45:00',
  lastModifiedBy: 'Dr. Solomon Tadesse',
}

export const demoCorrectionRecords: CorrectionRecord[] = [
  {
    correctionId: 'corr-001',
    orderNumber: 'ORD-LAB-2026-00102',
    analyteName: 'Fasting Blood Glucose',
    originalValue: '126',
    correctedValue: '116',
    unit: 'mg/dL',
    referenceInterval: '70-100 mg/dL',
    correctionReason: 'Transcription error corrected after verification with analyzer printout',
    correctedBy: 'Almaz Tesfaye',
    correctedAt: '2026-10-08T13:45:00',
    approvedBy: 'Dr. Solomon Tadesse',
    approvedAt: '2026-10-08T14:00:00',
    auditReference: 'AUDIT-2026-00892',
  },
]

export const demoAmendmentRecords: AmendmentRecord[] = [
  {
    amendmentId: 'amend-001',
    orderNumber: 'ORD-LAB-2026-00085',
    amendmentType: 'interpretation-update',
    description: 'Added clinical correlation note regarding elevated ALT in context of patient medication history',
    amendedBy: 'Dr. Solomon Tadesse',
    amendedAt: '2026-10-04T09:30:00',
    approvedBy: 'Dr. Mulu Haile (Laboratory Director)',
    approvedAt: '2026-10-04T10:15:00',
    auditReference: 'AUDIT-2026-00876',
  },
]

export const demoTimelineEvents: HistoricalTimelineEvent[] = [
  {
    eventId: 'evt-001',
    eventType: 'order-created',
    timestamp: '2026-10-10T08:30:00',
    performedBy: 'Dr. Tigist Alemu',
    description: 'Laboratory order created',
    statusBefore: undefined,
    statusAfter: 'requested',
  },
  {
    eventId: 'evt-002',
    eventType: 'specimen-collected',
    timestamp: '2026-10-10T09:15:00',
    performedBy: 'Nurse Sarah Bekele',
    description: 'Specimen collected at outpatient laboratory',
  },
  {
    eventId: 'evt-003',
    eventType: 'specimen-received',
    timestamp: '2026-10-10T09:45:00',
    performedBy: 'Alemwork Taye (Lab Assistant)',
    description: 'Specimen received and verified',
  },
  {
    eventId: 'evt-004',
    eventType: 'results-entered',
    timestamp: '2026-10-10T14:30:00',
    performedBy: 'Almaz Tesfaye',
    description: 'Test results entered',
  },
  {
    eventId: 'evt-005',
    eventType: 'results-submitted',
    timestamp: '2026-10-10T14:35:00',
    performedBy: 'Almaz Tesfaye',
    description: 'Results submitted for review',
    statusBefore: 'draft',
    statusAfter: 'pending-review',
  },
  {
    eventId: 'evt-006',
    eventType: 'results-approved',
    timestamp: '2026-10-10T15:20:00',
    performedBy: 'Dr. Solomon Tadesse',
    description: 'Results approved',
    statusBefore: 'pending-review',
    statusAfter: 'approved',
  },
  {
    eventId: 'evt-007',
    eventType: 'results-released',
    timestamp: '2026-10-10T16:45:00',
    performedBy: 'Dr. Solomon Tadesse',
    description: 'Results released to patient record',
    statusBefore: 'approved',
    statusAfter: 'released',
  },
]

export const demoResultComparisons: ResultComparison[] = [
  {
    analyteName: 'Hemoglobin',
    currentResult: {
      value: '12.8',
      unit: 'g/dL',
      date: '2026-10-10',
      orderNumber: 'ORD-LAB-2026-00117',
      referenceInterval: '12.0-15.5 g/dL (female)',
      flag: 'normal',
    },
    historicalResult: {
      value: '11.2',
      unit: 'g/dL',
      date: '2026-09-28',
      orderNumber: 'ORD-LAB-2026-00078',
      referenceInterval: '12.0-15.5 g/dL (female)',
      flag: 'low',
    },
    trend: 'increasing',
    percentChange: 14.3,
    absoluteChange: 1.6,
  },
  {
    analyteName: 'White Blood Cell Count',
    currentResult: {
      value: '7.2',
      unit: '10³/µL',
      date: '2026-10-10',
      orderNumber: 'ORD-LAB-2026-00117',
      referenceInterval: '4.0-11.0 × 10³/µL',
      flag: 'normal',
    },
    historicalResult: {
      value: '8.3',
      unit: '10³/µL',
      date: '2026-09-28',
      orderNumber: 'ORD-LAB-2026-00078',
      referenceInterval: '4.0-11.0 × 10³/µL',
      flag: 'normal',
    },
    trend: 'decreasing',
    percentChange: -13.3,
    absoluteChange: -1.1,
  },
  {
    analyteName: 'Platelet Count',
    currentResult: {
      value: '245',
      unit: '10³/µL',
      date: '2026-10-10',
      orderNumber: 'ORD-LAB-2026-00117',
      referenceInterval: '150-400 × 10³/µL',
      flag: 'normal',
    },
    historicalResult: {
      value: '265',
      unit: '10³/µL',
      date: '2026-09-28',
      orderNumber: 'ORD-LAB-2026-00078',
      referenceInterval: '150-400 × 10³/µL',
      flag: 'normal',
    },
    trend: 'stable',
    percentChange: -7.5,
    absoluteChange: -20,
  },
]

// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================

export function getHistoricalOrderStatusLabel(status: HistoricalOrderStatus): string {
  const labels: Record<HistoricalOrderStatus, string> = {
    'completed': 'Completed',
    'approved': 'Approved',
    'released': 'Released',
    'corrected': 'Corrected',
    'amended': 'Amended',
    'cancelled': 'Cancelled',
  }
  return labels[status]
}

export function getHistoricalOrderStatusColor(status: HistoricalOrderStatus): string {
  const colors: Record<HistoricalOrderStatus, string> = {
    'completed': 'blue',
    'approved': 'green',
    'released': 'purple',
    'corrected': 'amber',
    'amended': 'amber',
    'cancelled': 'gray',
  }
  return colors[status]
}

export function getHistoricalResultStatusLabel(status: HistoricalResultStatus): string {
  const labels: Record<HistoricalResultStatus, string> = {
    'finalized': 'Finalized',
    'approved': 'Approved',
    'released': 'Released',
    'corrected': 'Corrected',
    'amended': 'Amended',
  }
  return labels[status]
}

export function getHistoricalResultStatusColor(status: HistoricalResultStatus): string {
  const colors: Record<HistoricalResultStatus, string> = {
    'finalized': 'blue',
    'approved': 'green',
    'released': 'purple',
    'corrected': 'amber',
    'amended': 'amber',
  }
  return colors[status]
}

export function getTimelineEventLabel(eventType: HistoricalTimelineEvent['eventType']): string {
  const labels: Record<HistoricalTimelineEvent['eventType'], string> = {
    'order-created': 'Order Created',
    'specimen-collected': 'Specimen Collected',
    'specimen-received': 'Specimen Received',
    'results-entered': 'Results Entered',
    'results-submitted': 'Results Submitted for Review',
    'correction-requested': 'Correction Requested',
    'results-resubmitted': 'Results Resubmitted',
    'results-approved': 'Results Approved',
    'results-released': 'Results Released',
    'result-corrected': 'Result Corrected',
    'result-amended': 'Result Amended',
    'order-cancelled': 'Order Cancelled',
  }
  return labels[eventType]
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

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function createDefaultFilters(): HistorySearchFilters {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 3) // Last 3 months by default
  
  return {
    searchTerm: '',
    dateRange: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    },
    patientId: undefined,
    testCategory: 'all',
    testName: undefined,
    orderingDepartment: undefined,
    orderingClinician: undefined,
    priority: 'all',
    orderStatus: 'all',
    resultStatus: 'all',
    showCorrectedOnly: false,
    showReleasedOnly: false,
  }
}

export function calculateMetrics(records: HistoricalRecord[]): HistoryMetrics {
  return {
    completedOrders: records.filter(r => r.orderStatus === 'completed' || r.orderStatus === 'approved' || r.orderStatus === 'released').length,
    resultsReleased: records.filter(r => r.isReleased).length,
    correctedOrAmended: records.filter(r => r.hasCorrections || r.hasAmendments).length,
    recordsInPeriod: records.length,
  }
}

export function canExportRecords(permissions: HistoryPermissions): boolean {
  return permissions.canExportRecords
}

export function canPrintRecord(permissions: HistoryPermissions): boolean {
  return permissions.canPrintRecords
}
