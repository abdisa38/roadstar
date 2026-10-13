/**
 * Laboratory Result Review Model (Prompt 34)
 * Data structures and business logic for result review and approval workflow
 */

import type { RequestPriority, TestType } from './model'
import type { ResultFlag } from './result-entry-model'

// Review status types
export type ReviewStatus =
  | 'pending-review'
  | 'under-review'
  | 'returned-for-correction'
  | 'approved'
  | 'released'

export type CorrectionReason =
  | 'missing-required-result'
  | 'incorrect-unit'
  | 'inconsistent-test-information'
  | 'invalid-result-format'
  | 'insufficient-documentation'
  | 'other'

export type AuditEventType =
  | 'results-submitted'
  | 'review-started'
  | 'review-note-recorded'
  | 'correction-requested'
  | 'results-resubmitted'
  | 'results-approved'
  | 'critical-finding-escalated'
  | 'results-released'

// Result to review
export interface ReviewResult {
  analyteName: string
  value: string
  unit: string
  referenceInterval: string
  flag: ResultFlag
  entryStatus: 'valid' | 'warning' | 'error'
  entryComments?: string
}

// Historical result for comparison
export interface HistoricalResult {
  analyteName: string
  value: string
  unit: string
  referenceInterval?: string
  resultDate: string
  orderNumber: string
}

// Test result set
export interface TestResultSet {
  testId: string
  testName: string
  testType: TestType
  results: ReviewResult[]
  criticalCount: number
  abnormalCount: number
  validationIssues: number
  laboratoryComments?: string
  submittedBy: string
  submittedAt: string
}

// Order awaiting review
export interface ReviewQueueItem {
  orderId: string
  orderNumber: string
  patientId: string
  patientName: string
  age?: number
  sex?: 'male' | 'female' | 'other'
  testSummary: string
  orderingDepartment: string
  orderingClinician: string
  priority: RequestPriority
  submittedAt: string
  reviewStatus: ReviewStatus
  hasCriticalFindings: boolean
  hasAbnormalFindings: boolean
  waitingDuration: number // minutes
  specimenType: string
}

// Detailed order for review
export interface ReviewOrder {
  orderId: string
  orderNumber: string
  patientId: string
  patientName: string
  age?: number
  sex?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  orderingClinician: string
  orderingDepartment: string
  orderDate: string
  priority: RequestPriority
  reviewStatus: ReviewStatus
  
  // Specimen information
  specimenType: string
  specimenId?: string
  specimenCollectedAt?: string
  specimenReceivedAt?: string
  specimenCondition?: string
  specimenNotes?: string
  
  // Test results
  tests: TestResultSet[]
  totalTests: number
  completedTests: number
  
  // Summary counts
  totalCriticalFindings: number
  totalAbnormalFindings: number
  totalValidationIssues: number
  
  // Submission info
  submittedBy: string
  submittedAt: string
  lastUpdatedAt: string
  lastUpdatedBy?: string
  
  // Review tracking
  reviewedBy?: string
  reviewStartedAt?: string
  reviewCompletedAt?: string
  reviewNotes?: string
  
  // Historical comparison
  hasHistoricalResults: boolean
}

// Audit event
export interface AuditEvent {
  eventId: string
  eventType: AuditEventType
  timestamp: string
  userId: string
  userName: string
  previousStatus?: ReviewStatus
  newStatus?: ReviewStatus
  reason?: string
  details?: string
}

// Correction request
export interface CorrectionRequest {
  orderId: string
  orderNumber: string
  reason: CorrectionReason
  affectedTest?: string
  description: string
  requestedBy: string
  requestedAt: string
}

// Review decision
export interface ReviewDecision {
  orderId: string
  action: 'approve' | 'request-correction' | 'escalate-critical'
  reviewerId: string
  reviewerName: string
  reviewNotes?: string
  correctionRequest?: CorrectionRequest
  timestamp: string
}

// Review permissions
export interface ReviewerPermissions {
  canReview: boolean
  canApprove: boolean
  canRequestCorrection: boolean
  canEscalateCritical: boolean
  canRelease: boolean
  canViewAuditHistory: boolean
  canViewHistoricalResults: boolean
}

// Review context
export interface ReviewContext {
  currentUser: string
  currentRole: 'pathologist' | 'senior-technician' | 'laboratory-director' | 'medical-director'
  permissions: ReviewerPermissions
  requiresSeparateApproval: boolean
  allowCriticalRelease: boolean
}

// ============================================================================
// DEMO DATA
// ============================================================================

export const demoReviewContext: ReviewContext = {
  currentUser: 'Dr. Solomon Tadesse',
  currentRole: 'pathologist',
  permissions: {
    canReview: true,
    canApprove: true,
    canRequestCorrection: true,
    canEscalateCritical: true,
    canRelease: false, // Release requires separate authorization
    canViewAuditHistory: true,
    canViewHistoricalResults: true,
  },
  requiresSeparateApproval: true,
  allowCriticalRelease: false,
}

export const demoReviewQueue: ReviewQueueItem[] = [
  {
    orderId: 'ord-001',
    orderNumber: 'ORD-LAB-2026-00138',
    patientId: 'ORH-P-000208',
    patientName: 'Hana Mohammed',
    age: 34,
    sex: 'female',
    testSummary: 'Complete Blood Count (CBC)',
    orderingDepartment: 'Internal Medicine',
    orderingClinician: 'Dr. Tigist Alemu',
    priority: 'urgent',
    submittedAt: '2026-10-13T14:30:00',
    reviewStatus: 'pending-review',
    hasCriticalFindings: true,
    hasAbnormalFindings: true,
    waitingDuration: 45,
    specimenType: 'Blood - EDTA',
  },
  {
    orderId: 'ord-002',
    orderNumber: 'ORD-LAB-2026-00139',
    patientId: 'ORH-P-000215',
    patientName: 'Kebede Alemayehu',
    age: 58,
    sex: 'male',
    testSummary: 'Lipid Panel',
    orderingDepartment: 'Cardiology',
    orderingClinician: 'Dr. Dawit Bekele',
    priority: 'routine',
    submittedAt: '2026-10-13T13:15:00',
    reviewStatus: 'pending-review',
    hasCriticalFindings: false,
    hasAbnormalFindings: true,
    waitingDuration: 135,
    specimenType: 'Blood - Serum',
  },
  {
    orderId: 'ord-003',
    orderNumber: 'ORD-LAB-2026-00135',
    patientId: 'ORH-P-000198',
    patientName: 'Fatuma Ibrahim',
    age: 27,
    sex: 'female',
    testSummary: 'Urinalysis',
    orderingDepartment: 'Obstetrics',
    orderingClinician: 'Dr. Marta Girma',
    priority: 'routine',
    submittedAt: '2026-10-13T11:45:00',
    reviewStatus: 'pending-review',
    hasCriticalFindings: false,
    hasAbnormalFindings: false,
    waitingDuration: 225,
    specimenType: 'Urine - Clean Catch',
  },
  {
    orderId: 'ord-004',
    orderNumber: 'ORD-LAB-2026-00132',
    patientId: 'ORH-P-000182',
    patientName: 'Ahmed Hassan',
    age: 42,
    sex: 'male',
    testSummary: 'Liver Function Tests (LFT)',
    orderingDepartment: 'Gastroenterology',
    orderingClinician: 'Dr. Solomon Gebre',
    priority: 'routine',
    submittedAt: '2026-10-13T10:20:00',
    reviewStatus: 'returned-for-correction',
    hasCriticalFindings: false,
    hasAbnormalFindings: true,
    waitingDuration: 290,
    specimenType: 'Blood - Serum',
  },
]

export const demoReviewOrder: ReviewOrder = {
  orderId: 'ord-001',
  orderNumber: 'ORD-LAB-2026-00138',
  patientId: 'ORH-P-000208',
  patientName: 'Hana Mohammed',
  age: 34,
  sex: 'female',
  dateOfBirth: '1992-03-15',
  orderingClinician: 'Dr. Tigist Alemu',
  orderingDepartment: 'Internal Medicine',
  orderDate: '2026-10-13T08:30:00',
  priority: 'urgent',
  reviewStatus: 'pending-review',
  
  specimenType: 'Blood - EDTA',
  specimenId: 'SPEC-2026-00245',
  specimenCollectedAt: '2026-10-13T09:15:00',
  specimenReceivedAt: '2026-10-13T09:45:00',
  specimenCondition: 'Adequate volume, no hemolysis',
  specimenNotes: 'Collected by phlebotomist at outpatient lab',
  
  tests: [
    {
      testId: 'test-001',
      testName: 'Complete Blood Count',
      testType: 'hematology',
      results: [
        {
          analyteName: 'Hemoglobin',
          value: '6.8',
          unit: 'g/dL',
          referenceInterval: '12.0-15.5 g/dL (female)',
          flag: 'critical-low',
          entryStatus: 'valid',
          entryComments: 'Confirmed reading. Patient appears pale on examination.',
        },
        {
          analyteName: 'White Blood Cell Count',
          value: '11.5',
          unit: '10³/µL',
          referenceInterval: '4.0-11.0 × 10³/µL',
          flag: 'high',
          entryStatus: 'valid',
        },
        {
          analyteName: 'Red Blood Cell Count',
          value: '3.2',
          unit: '10⁶/µL',
          referenceInterval: '4.0-5.2 × 10⁶/µL (female)',
          flag: 'low',
          entryStatus: 'valid',
        },
        {
          analyteName: 'Hematocrit',
          value: '22.5',
          unit: '%',
          referenceInterval: '34.9-44.5% (female)',
          flag: 'critical-low',
          entryStatus: 'valid',
        },
        {
          analyteName: 'Platelet Count',
          value: '285',
          unit: '10³/µL',
          referenceInterval: '150-400 × 10³/µL',
          flag: 'normal',
          entryStatus: 'valid',
        },
        {
          analyteName: 'Mean Corpuscular Volume (MCV)',
          value: '70',
          unit: 'fL',
          referenceInterval: '80-100 fL',
          flag: 'low',
          entryStatus: 'valid',
        },
        {
          analyteName: 'Mean Corpuscular Hemoglobin (MCH)',
          value: '21',
          unit: 'pg',
          referenceInterval: '27-33 pg',
          flag: 'low',
          entryStatus: 'valid',
        },
        {
          analyteName: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
          value: '30',
          unit: 'g/dL',
          referenceInterval: '32-36 g/dL',
          flag: 'low',
          entryStatus: 'valid',
        },
      ],
      criticalCount: 2,
      abnormalCount: 5,
      validationIssues: 0,
      laboratoryComments: 'Morphology consistent with microcytic hypochromic anemia. Recommend iron studies.',
      submittedBy: 'Almaz Tesfaye (Lab Technician)',
      submittedAt: '2026-10-13T14:30:00',
    },
  ],
  totalTests: 1,
  completedTests: 1,
  totalCriticalFindings: 2,
  totalAbnormalFindings: 5,
  totalValidationIssues: 0,
  submittedBy: 'Almaz Tesfaye',
  submittedAt: '2026-10-13T14:30:00',
  lastUpdatedAt: '2026-10-13T14:30:00',
  hasHistoricalResults: true,
}

export const demoHistoricalResults: HistoricalResult[] = [
  {
    analyteName: 'Hemoglobin',
    value: '11.2',
    unit: 'g/dL',
    referenceInterval: '12.0-15.5 g/dL (female)',
    resultDate: '2026-09-15',
    orderNumber: 'ORD-LAB-2026-00087',
  },
  {
    analyteName: 'White Blood Cell Count',
    value: '8.3',
    unit: '10³/µL',
    referenceInterval: '4.0-11.0 × 10³/µL',
    resultDate: '2026-09-15',
    orderNumber: 'ORD-LAB-2026-00087',
  },
  {
    analyteName: 'Platelet Count',
    value: '265',
    unit: '10³/µL',
    referenceInterval: '150-400 × 10³/µL',
    resultDate: '2026-09-15',
    orderNumber: 'ORD-LAB-2026-00087',
  },
]

export const demoAuditHistory: AuditEvent[] = [
  {
    eventId: 'evt-001',
    eventType: 'results-submitted',
    timestamp: '2026-10-13T14:30:00',
    userId: 'user-tech-001',
    userName: 'Almaz Tesfaye',
    previousStatus: undefined,
    newStatus: 'pending-review',
    details: 'Complete Blood Count results submitted for review',
  },
  {
    eventId: 'evt-002',
    eventType: 'critical-finding-escalated',
    timestamp: '2026-10-13T14:32:00',
    userId: 'user-tech-001',
    userName: 'Almaz Tesfaye',
    details: 'Critical low hemoglobin (6.8 g/dL) - Ordering clinician notified',
  },
]

// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================

export function getReviewStatusLabel(status: ReviewStatus): string {
  const labels: Record<ReviewStatus, string> = {
    'pending-review': 'Pending Review',
    'under-review': 'Under Review',
    'returned-for-correction': 'Returned for Correction',
    'approved': 'Approved',
    'released': 'Released',
  }
  return labels[status]
}

export function getReviewStatusColor(status: ReviewStatus): string {
  const colors: Record<ReviewStatus, string> = {
    'pending-review': 'amber',
    'under-review': 'blue',
    'returned-for-correction': 'red',
    'approved': 'green',
    'released': 'purple',
  }
  return colors[status]
}

export function getCorrectionReasonLabel(reason: CorrectionReason): string {
  const labels: Record<CorrectionReason, string> = {
    'missing-required-result': 'Missing Required Result',
    'incorrect-unit': 'Incorrect Unit',
    'inconsistent-test-information': 'Inconsistent Test Information',
    'invalid-result-format': 'Invalid Result Format',
    'insufficient-documentation': 'Insufficient Documentation',
    'other': 'Other (see description)',
  }
  return labels[reason]
}

export function getAuditEventLabel(eventType: AuditEventType): string {
  const labels: Record<AuditEventType, string> = {
    'results-submitted': 'Results Submitted',
    'review-started': 'Review Started',
    'review-note-recorded': 'Review Note Recorded',
    'correction-requested': 'Correction Requested',
    'results-resubmitted': 'Results Resubmitted',
    'results-approved': 'Results Approved',
    'critical-finding-escalated': 'Critical Finding Escalated',
    'results-released': 'Results Released',
  }
  return labels[eventType]
}

export function formatWaitingDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hr`
  }
  return `${hours} hr ${remainingMinutes} min`
}

export function canApproveOrder(
  order: ReviewOrder,
  permissions: ReviewerPermissions
): { allowed: boolean; reason?: string } {
  if (!permissions.canApprove) {
    return { allowed: false, reason: 'You do not have approval permissions' }
  }
  
  if (order.reviewStatus === 'approved' || order.reviewStatus === 'released') {
    return { allowed: false, reason: 'Results have already been approved' }
  }
  
  if (order.completedTests < order.totalTests) {
    return { allowed: false, reason: 'Not all requested tests are complete' }
  }
  
  if (order.totalValidationIssues > 0) {
    return { allowed: false, reason: 'Unresolved validation issues must be corrected first' }
  }
  
  if (!order.specimenReceivedAt) {
    return { allowed: false, reason: 'Specimen receipt must be documented' }
  }
  
  return { allowed: true }
}

export function canRequestCorrection(
  order: ReviewOrder,
  permissions: ReviewerPermissions
): { allowed: boolean; reason?: string } {
  if (!permissions.canRequestCorrection) {
    return { allowed: false, reason: 'You do not have correction request permissions' }
  }
  
  if (order.reviewStatus === 'approved' || order.reviewStatus === 'released') {
    return { allowed: false, reason: 'Cannot request correction for approved/released results' }
  }
  
  return { allowed: true }
}

export function validateCorrectionRequest(request: Partial<CorrectionRequest>): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}
  
  if (!request.reason) {
    errors.reason = 'Correction reason is required'
  }
  
  if (!request.description || request.description.trim().length === 0) {
    errors.description = 'Detailed description is required'
  }
  
  if (request.description && request.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function hasCriticalRequiringEscalation(order: ReviewOrder): boolean {
  return order.totalCriticalFindings > 0
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
