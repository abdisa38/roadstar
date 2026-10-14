/**
 * Prescription Queue and Dispensing Data Model
 * ORHIMS Phase 07 - Pharmacy Management (Prompt 37)
 */

// ============================================================
// CORE INTERFACES
// ============================================================

export interface PrescriptionContext {
  facilityName: string
  pharmacyLocation: string
  currentUser: PharmacyUser
  currentDate: Date
  lastUpdated?: Date
}

export interface PharmacyUser {
  userId: string
  name: string
  role: 'Pharmacist' | 'Pharmacy Technician' | 'Pharmacy Manager'
  permissions: Set<string>
}

// ============================================================
// PRESCRIPTION QUEUE INTERFACES
// ============================================================

export type PrescriptionStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'partially-dispensed' 
  | 'dispensed' 
  | 'on-hold' 
  | 'cancelled'

export type PrescriptionPriority = 'routine' | 'urgent' | 'stat'

export interface PrescriptionQueueItem {
  prescriptionId: string
  prescriptionNumber: string
  patientId: string
  patientName: string
  patientMRN: string
  patientAge: number
  patientGender: 'Male' | 'Female'
  prescribingDepartment: string
  prescribingClinician: string
  prescriptionDate: Date
  priority: PrescriptionPriority
  status: PrescriptionStatus
  itemCount: number
  dispensedItemCount: number
  assignedTo?: string
  clinicalAuthorizationStatus?: string
}

export interface QueueFilters {
  searchQuery: string
  prescriptionNumber: string
  patientNameOrId: string
  department: string
  clinician: string
  dateFrom?: Date
  dateTo?: Date
  status: PrescriptionStatus | 'all'
  priority: PrescriptionPriority | 'all'
  requiresAttention: boolean
}

// ============================================================
// DETAILED PRESCRIPTION INTERFACES
// ============================================================

export interface PrescriptionDetail {
  prescriptionId: string
  prescriptionNumber: string
  patient: PatientInfo
  prescriber: PrescriberInfo
  prescriptionDate: Date
  priority: PrescriptionPriority
  status: PrescriptionStatus
  clinicalAuthorizationStatus: 'approved' | 'pending' | 'rejected'
  items: PrescribedMedicineItem[]
  dispensingHistory: DispensingTransaction[]
  notes?: string
  holdReason?: HoldReason
  cancelReason?: string
}

export interface PatientInfo {
  patientId: string
  patientMRN: string
  name: string
  age: number
  gender: 'Male' | 'Female'
  department: string
  ward?: string
  bedNumber?: string
  allergies?: string[]
}

export interface PrescriberInfo {
  clinicianId: string
  name: string
  title: string
  department: string
  licenseNumber?: string
}

// ============================================================
// PRESCRIBED MEDICINE INTERFACES
// ============================================================

export interface PrescribedMedicineItem {
  itemId: string
  medicineId: string
  medicineName: string
  strength: string
  dosageForm: string
  route: string
  frequency: string
  duration: string
  instructions: string
  quantityPrescribed: number
  quantityPreviouslyDispensed: number
  quantityRemaining: number
  unitOfMeasure: string
  availabilityStatus: MedicineAvailabilityStatus
  matchedInventory?: InventoryMatch
  selectedBatch?: BatchSelection
  currentDispensingQuantity: number
}

export type MedicineAvailabilityStatus = 
  | 'available' 
  | 'low-stock' 
  | 'unavailable' 
  | 'not-matched'

export interface InventoryMatch {
  medicineId: string
  medicineName: string
  strength: string
  dosageForm: string
  totalAvailableQuantity: number
  unitOfMeasure: string
  eligibleBatches: BatchInfo[]
  matchQuality: 'exact' | 'partial' | 'no-match'
}

export interface BatchInfo {
  batchId: string
  batchNumber: string
  availableQuantity: number
  expiryDate: Date
  daysUntilExpiry: number
  status: BatchStatus
  location?: string
}

export type BatchStatus = 
  | 'eligible' 
  | 'expiring-soon' 
  | 'expired' 
  | 'quarantined' 
  | 'reserved'

export interface BatchSelection {
  batchId: string
  batchNumber: string
  quantityFromBatch: number
  expiryDate: Date
}

// ============================================================
// DISPENSING TRANSACTION INTERFACES
// ============================================================

export interface DispensingTransaction {
  transactionId: string
  transactionReference: string
  prescriptionId: string
  transactionDate: Date
  performedBy: string
  performedByRole: string
  transactionType: 'full' | 'partial'
  items: DispensedItem[]
  status: DispensingTransactionStatus
  notes?: string
  correctionReference?: string
}

export type DispensingTransactionStatus = 
  | 'completed' 
  | 'partial' 
  | 'reversed' 
  | 'corrected'

export interface DispensedItem {
  itemId: string
  medicineName: string
  strength: string
  dosageForm: string
  quantityDispensed: number
  unitOfMeasure: string
  batchNumber: string
  expiryDate: Date
}

// ============================================================
// HOLD AND CANCELLATION INTERFACES
// ============================================================

export interface HoldReason {
  reason: HoldReasonType
  explanation: string
  requestedBy: string
  requestedAt: Date
  expectedResolutionDate?: Date
}

export type HoldReasonType = 
  | 'medicine-unavailable' 
  | 'clarification-required' 
  | 'authorization-issue' 
  | 'inventory-discrepancy' 
  | 'other'

// ============================================================
// CONFIRMATION AND VALIDATION INTERFACES
// ============================================================

export interface DispensingConfirmation {
  prescriptionId: string
  prescriptionNumber: string
  patient: {
    name: string
    mrn: string
  }
  items: ConfirmationItem[]
  totalItemsDispensed: number
  itemsRemaining: number
  warnings: string[]
}

export interface ConfirmationItem {
  medicineName: string
  strength: string
  quantityDispensed: number
  unitOfMeasure: string
  batchNumber: string
  expiryDate: Date
  quantityRemaining: number
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

// ============================================================
// DEMO DATA
// ============================================================

export const demoPrescriptionContext: PrescriptionContext = {
  facilityName: 'Oda Roba Hospital',
  pharmacyLocation: 'Main Pharmacy',
  currentUser: {
    userId: 'PHR-2026-00012',
    name: 'Tigist Alemayehu',
    role: 'Pharmacist',
    permissions: new Set(['view-prescriptions', 'dispense', 'manage-inventory', 'place-hold'])
  },
  currentDate: new Date('2026-10-14T14:45:00'),
  lastUpdated: new Date('2026-10-14T14:44:30')
}

export const demoPrescriptionQueue: PrescriptionQueueItem[] = [
  {
    prescriptionId: 'PRX-001',
    prescriptionNumber: 'RX-2026-00124',
    patientId: 'ORH-2026-00089',
    patientName: 'Abebe Bekele',
    patientMRN: 'ORH-2026-00089',
    patientAge: 45,
    patientGender: 'Male',
    prescribingDepartment: 'Internal Medicine',
    prescribingClinician: 'Dr. Marta Kebede',
    prescriptionDate: new Date('2026-10-14T13:45:00'),
    priority: 'urgent',
    status: 'pending',
    itemCount: 3,
    dispensedItemCount: 0,
    clinicalAuthorizationStatus: 'approved'
  },
  {
    prescriptionId: 'PRX-002',
    prescriptionNumber: 'RX-2026-00125',
    patientId: 'ORH-2026-00117',
    patientName: 'Hana Mohammed',
    patientMRN: 'ORH-2026-00117',
    patientAge: 34,
    patientGender: 'Female',
    prescribingDepartment: 'Pediatrics',
    prescribingClinician: 'Dr. Yohannes Girma',
    prescriptionDate: new Date('2026-10-14T13:20:00'),
    priority: 'routine',
    status: 'in-progress',
    itemCount: 2,
    dispensedItemCount: 1,
    assignedTo: 'Tigist Alemayehu',
    clinicalAuthorizationStatus: 'approved'
  },
  {
    prescriptionId: 'PRX-003',
    prescriptionNumber: 'RX-2026-00126',
    patientId: 'ORH-2026-00124',
    patientName: 'Sara Musa',
    patientMRN: 'ORH-2026-00124',
    patientAge: 28,
    patientGender: 'Female',
    prescribingDepartment: 'Emergency',
    prescribingClinician: 'Dr. Ahmed Hassan',
    prescriptionDate: new Date('2026-10-14T14:10:00'),
    priority: 'stat',
    status: 'pending',
    itemCount: 4,
    dispensedItemCount: 0,
    clinicalAuthorizationStatus: 'approved'
  },
  {
    prescriptionId: 'PRX-004',
    prescriptionNumber: 'RX-2026-00127',
    patientId: 'ORH-2026-00102',
    patientName: 'Mohammed Ali',
    patientMRN: 'ORH-2026-00102',
    patientAge: 52,
    patientGender: 'Male',
    prescribingDepartment: 'Surgery',
    prescribingClinician: 'Dr. Rahel Tesfaye',
    prescriptionDate: new Date('2026-10-14T12:30:00'),
    priority: 'routine',
    status: 'partially-dispensed',
    itemCount: 5,
    dispensedItemCount: 3,
    assignedTo: 'Dawit Mulugeta',
    clinicalAuthorizationStatus: 'approved'
  },
  {
    prescriptionId: 'PRX-005',
    prescriptionNumber: 'RX-2026-00128',
    patientId: 'ORH-2026-00076',
    patientName: 'Fatima Hassan',
    patientMRN: 'ORH-2026-00076',
    patientAge: 67,
    patientGender: 'Female',
    prescribingDepartment: 'Outpatient',
    prescribingClinician: 'Dr. Bekele Tadesse',
    prescriptionDate: new Date('2026-10-14T11:50:00'),
    priority: 'routine',
    status: 'pending',
    itemCount: 2,
    dispensedItemCount: 0,
    clinicalAuthorizationStatus: 'approved'
  },
  {
    prescriptionId: 'PRX-006',
    prescriptionNumber: 'RX-2026-00129',
    patientId: 'ORH-2026-00145',
    patientName: 'Kebede Alemu',
    patientMRN: 'ORH-2026-00145',
    patientAge: 38,
    patientGender: 'Male',
    prescribingDepartment: 'Internal Medicine',
    prescribingClinician: 'Dr. Marta Kebede',
    prescriptionDate: new Date('2026-10-14T10:20:00'),
    priority: 'routine',
    status: 'on-hold',
    itemCount: 3,
    dispensedItemCount: 0,
    clinicalAuthorizationStatus: 'approved'
  }
]

export const demoPrescriptionDetail: PrescriptionDetail = {
  prescriptionId: 'PRX-001',
  prescriptionNumber: 'RX-2026-00124',
  patient: {
    patientId: 'ORH-2026-00089',
    patientMRN: 'ORH-2026-00089',
    name: 'Abebe Bekele',
    age: 45,
    gender: 'Male',
    department: 'Internal Medicine',
    ward: 'Ward B',
    bedNumber: 'B-12',
    allergies: ['Penicillin']
  },
  prescriber: {
    clinicianId: 'CLN-2026-00032',
    name: 'Dr. Marta Kebede',
    title: 'Internal Medicine Specialist',
    department: 'Internal Medicine',
    licenseNumber: 'ETH-MED-2015-00432'
  },
  prescriptionDate: new Date('2026-10-14T13:45:00'),
  priority: 'urgent',
  status: 'pending',
  clinicalAuthorizationStatus: 'approved',
  items: [
    {
      itemId: 'ITEM-001',
      medicineId: 'MED-001',
      medicineName: 'Paracetamol',
      strength: '500mg',
      dosageForm: 'Tablet',
      route: 'Oral',
      frequency: 'Three times daily',
      duration: '5 days',
      instructions: 'Take after meals',
      quantityPrescribed: 15,
      quantityPreviouslyDispensed: 0,
      quantityRemaining: 15,
      unitOfMeasure: 'tablets',
      availabilityStatus: 'available',
      currentDispensingQuantity: 0,
      matchedInventory: {
        medicineId: 'MED-001',
        medicineName: 'Paracetamol',
        strength: '500mg',
        dosageForm: 'Tablet',
        totalAvailableQuantity: 150,
        unitOfMeasure: 'tablets',
        matchQuality: 'exact',
        eligibleBatches: [
          {
            batchId: 'BAT-001',
            batchNumber: 'PAR2024-08-001',
            availableQuantity: 150,
            expiryDate: new Date('2027-08-30'),
            daysUntilExpiry: 320,
            status: 'eligible'
          }
        ]
      }
    },
    {
      itemId: 'ITEM-002',
      medicineId: 'MED-007',
      medicineName: 'Ciprofloxacin',
      strength: '500mg',
      dosageForm: 'Tablet',
      route: 'Oral',
      frequency: 'Twice daily',
      duration: '7 days',
      instructions: 'Take with plenty of water',
      quantityPrescribed: 14,
      quantityPreviouslyDispensed: 0,
      quantityRemaining: 14,
      unitOfMeasure: 'tablets',
      availabilityStatus: 'available',
      currentDispensingQuantity: 0,
      matchedInventory: {
        medicineId: 'MED-007',
        medicineName: 'Ciprofloxacin',
        strength: '500mg',
        dosageForm: 'Tablet',
        totalAvailableQuantity: 180,
        unitOfMeasure: 'tablets',
        matchQuality: 'exact',
        eligibleBatches: [
          {
            batchId: 'BAT-007',
            batchNumber: 'CIP2024-08-001',
            availableQuantity: 180,
            expiryDate: new Date('2026-11-30'),
            daysUntilExpiry: 47,
            status: 'expiring-soon'
          }
        ]
      }
    },
    {
      itemId: 'ITEM-003',
      medicineId: 'MED-003',
      medicineName: 'Oral Rehydration Salts',
      strength: '',
      dosageForm: 'Sachet',
      route: 'Oral',
      frequency: 'As needed',
      duration: '3 days',
      instructions: 'Dissolve in 1 liter of water',
      quantityPrescribed: 10,
      quantityPreviouslyDispensed: 0,
      quantityRemaining: 10,
      unitOfMeasure: 'sachets',
      availabilityStatus: 'available',
      currentDispensingQuantity: 0,
      matchedInventory: {
        medicineId: 'MED-003',
        medicineName: 'Oral Rehydration Salts',
        strength: '',
        dosageForm: 'Sachet',
        totalAvailableQuantity: 45,
        unitOfMeasure: 'sachets',
        matchQuality: 'exact',
        eligibleBatches: [
          {
            batchId: 'BAT-003',
            batchNumber: 'ORS2024-07-001',
            availableQuantity: 45,
            expiryDate: new Date('2027-07-15'),
            daysUntilExpiry: 274,
            status: 'eligible'
          }
        ]
      }
    }
  ],
  dispensingHistory: [],
  notes: 'Patient has confirmed allergy to Penicillin. Ensure alternative antibiotics only.'
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getPrescriptionStatusLabel(status: PrescriptionStatus): string {
  const labels: Record<PrescriptionStatus, string> = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'partially-dispensed': 'Partially Dispensed',
    'dispensed': 'Dispensed',
    'on-hold': 'On Hold',
    'cancelled': 'Cancelled'
  }
  return labels[status]
}

export function getPriorityLabel(priority: PrescriptionPriority): string {
  const labels: Record<PrescriptionPriority, string> = {
    'routine': 'Routine',
    'urgent': 'Urgent',
    'stat': 'STAT'
  }
  return labels[priority]
}

export function getAvailabilityStatusLabel(status: MedicineAvailabilityStatus): string {
  const labels: Record<MedicineAvailabilityStatus, string> = {
    'available': 'Available',
    'low-stock': 'Low Stock',
    'unavailable': 'Unavailable',
    'not-matched': 'Not Matched'
  }
  return labels[status]
}

export function getBatchStatusLabel(status: BatchStatus): string {
  const labels: Record<BatchStatus, string> = {
    'eligible': 'Eligible',
    'expiring-soon': 'Expiring Soon',
    'expired': 'Expired',
    'quarantined': 'Quarantined',
    'reserved': 'Reserved'
  }
  return labels[status]
}

export function getHoldReasonLabel(reason: HoldReasonType): string {
  const labels: Record<HoldReasonType, string> = {
    'medicine-unavailable': 'Medicine Unavailable',
    'clarification-required': 'Clarification Required',
    'authorization-issue': 'Authorization Issue',
    'inventory-discrepancy': 'Inventory Discrepancy',
    'other': 'Other'
  }
  return labels[reason]
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function calculateDaysUntilExpiry(expiryDate: Date, currentDate: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffTime = expiryDate.getTime() - currentDate.getTime()
  return Math.ceil(diffTime / msPerDay)
}

export function validateDispensingQuantity(
  quantity: number,
  remaining: number,
  available: number
): ValidationError[] {
  const errors: ValidationError[] = []

  if (quantity < 0) {
    errors.push({
      field: 'quantity',
      message: 'Quantity cannot be negative',
      severity: 'error'
    })
  }

  if (quantity === 0) {
    errors.push({
      field: 'quantity',
      message: 'Quantity must be greater than zero',
      severity: 'error'
    })
  }

  if (quantity > remaining) {
    errors.push({
      field: 'quantity',
      message: `Quantity exceeds remaining prescribed amount (${remaining})`,
      severity: 'error'
    })
  }

  if (quantity > available) {
    errors.push({
      field: 'quantity',
      message: `Quantity exceeds available stock (${available})`,
      severity: 'error'
    })
  }

  return errors
}

export function applyQueueFilters(
  queue: PrescriptionQueueItem[],
  filters: Partial<QueueFilters>
): PrescriptionQueueItem[] {
  let filtered = [...queue]

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(item =>
      item.prescriptionNumber.toLowerCase().includes(query) ||
      item.patientName.toLowerCase().includes(query) ||
      item.patientMRN.toLowerCase().includes(query)
    )
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(item => item.status === filters.status)
  }

  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter(item => item.priority === filters.priority)
  }

  if (filters.department) {
    filtered = filtered.filter(item =>
      item.prescribingDepartment.toLowerCase().includes(filters.department!.toLowerCase())
    )
  }

  if (filters.requiresAttention) {
    filtered = filtered.filter(item =>
      item.status === 'pending' || item.status === 'in-progress' || item.status === 'partially-dispensed'
    )
  }

  return filtered
}
