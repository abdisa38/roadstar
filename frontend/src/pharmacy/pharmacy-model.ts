/**
 * Pharmacy Dashboard Data Model
 * ORHIMS Phase 07 - Pharmacy Management (Prompt 36)
 */

// ============================================================
// CORE INTERFACES
// ============================================================

export interface PharmacyContext {
  facilityName: string
  pharmacyLocation: string
  currentDate: Date
  currentUser: PharmacyUser
  lastUpdated?: Date
}

export interface PharmacyUser {
  userId: string
  name: string
  role: 'Pharmacist' | 'Pharmacy Technician' | 'Pharmacy Assistant' | 'Pharmacy Manager'
  permissions: Set<string>
}

// ============================================================
// DASHBOARD METRICS
// ============================================================

export interface PharmacyMetrics {
  pendingPrescriptions: number
  inProgressPrescriptions: number
  dispensedToday: number
  lowStockItems: number
  outOfStockItems: number
  expiryAlerts: number
}

// ============================================================
// PRESCRIPTION INTERFACES
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
  prescribingDepartment: string
  prescribingClinician: string
  prescriptionDate: Date
  priority: PrescriptionPriority
  status: PrescriptionStatus
  itemCount: number
  dispensedItemCount: number
  assignedTo?: string
}

// ============================================================
// MEDICINE INVENTORY INTERFACES
// ============================================================

export type StockStatus = 
  | 'in-stock' 
  | 'low-stock' 
  | 'out-of-stock' 
  | 'restricted' 
  | 'expired-present'

export interface MedicineInventoryItem {
  medicineId: string
  medicineName: string
  medicineCode: string
  strength?: string
  dosageForm: string
  availableQuantity: number
  unitOfMeasure: string
  reorderThreshold: number
  stockStatus: StockStatus
  hasExpiredStock: boolean
  totalBatches: number
}

// ============================================================
// EXPIRY MONITORING INTERFACES
// ============================================================

export type BatchStatus = 'expiring-soon' | 'expired' | 'quarantined' | 'available'

export interface ExpiryMonitoringItem {
  batchId: string
  medicineId: string
  medicineName: string
  medicineCode: string
  strength?: string
  dosageForm: string
  batchNumber: string
  quantity: number
  unitOfMeasure: string
  expiryDate: Date
  daysUntilExpiry: number
  status: BatchStatus
}

// ============================================================
// STOCK MOVEMENT INTERFACES
// ============================================================

export type MovementType = 
  | 'stock-received' 
  | 'dispensed' 
  | 'adjustment' 
  | 'returned' 
  | 'transferred'

export interface StockMovement {
  movementId: string
  movementReference: string
  medicineId: string
  medicineName: string
  medicineCode: string
  movementType: MovementType
  quantity: number
  unitOfMeasure: string
  movementDate: Date
  performedBy: string
  performedByRole: string
  referenceDocument?: string
  notes?: string
}

// ============================================================
// PHARMACY ALERTS INTERFACES
// ============================================================

export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertType = 
  | 'reorder-threshold' 
  | 'expiry-approaching' 
  | 'expired-stock' 
  | 'unavailable-medicine' 
  | 'stock-discrepancy' 
  | 'pending-prescription'

export interface PharmacyAlert {
  alertId: string
  alertType: AlertType
  severity: AlertSeverity
  title: string
  description: string
  relatedReference?: string
  timestamp: Date
  actionRequired: string
  actionLink?: string
}

// ============================================================
// DEMO DATA
// ============================================================

export const demoPharmacyContext: PharmacyContext = {
  facilityName: 'Oda Roba Hospital',
  pharmacyLocation: 'Main Pharmacy',
  currentDate: new Date('2026-10-14T14:30:00'),
  currentUser: {
    userId: 'PHR-2026-00012',
    name: 'Tigist Alemayehu',
    role: 'Pharmacist',
    permissions: new Set(['view-prescriptions', 'dispense', 'manage-inventory', 'view-reports'])
  },
  lastUpdated: new Date('2026-10-14T14:28:45')
}

export const demoPharmacyMetrics: PharmacyMetrics = {
  pendingPrescriptions: 12,
  inProgressPrescriptions: 5,
  dispensedToday: 47,
  lowStockItems: 8,
  outOfStockItems: 3,
  expiryAlerts: 6
}

export const demoPrescriptionQueue: PrescriptionQueueItem[] = [
  {
    prescriptionId: 'PRX-001',
    prescriptionNumber: 'RX-2026-00124',
    patientId: 'ORH-2026-00089',
    patientName: 'Abebe Bekele',
    patientMRN: 'ORH-2026-00089',
    prescribingDepartment: 'Internal Medicine',
    prescribingClinician: 'Dr. Marta Kebede',
    prescriptionDate: new Date('2026-10-14T13:45:00'),
    priority: 'urgent',
    status: 'pending',
    itemCount: 3,
    dispensedItemCount: 0
  },
  {
    prescriptionId: 'PRX-002',
    prescriptionNumber: 'RX-2026-00125',
    patientId: 'ORH-2026-00117',
    patientName: 'Hana Mohammed',
    patientMRN: 'ORH-2026-00117',
    prescribingDepartment: 'Pediatrics',
    prescribingClinician: 'Dr. Yohannes Girma',
    prescriptionDate: new Date('2026-10-14T13:20:00'),
    priority: 'routine',
    status: 'in-progress',
    itemCount: 2,
    dispensedItemCount: 1,
    assignedTo: 'Tigist Alemayehu'
  },
  {
    prescriptionId: 'PRX-003',
    prescriptionNumber: 'RX-2026-00126',
    patientId: 'ORH-2026-00124',
    patientName: 'Sara Musa',
    patientMRN: 'ORH-2026-00124',
    prescribingDepartment: 'Emergency',
    prescribingClinician: 'Dr. Ahmed Hassan',
    prescriptionDate: new Date('2026-10-14T14:10:00'),
    priority: 'stat',
    status: 'pending',
    itemCount: 4,
    dispensedItemCount: 0
  },
  {
    prescriptionId: 'PRX-004',
    prescriptionNumber: 'RX-2026-00127',
    patientId: 'ORH-2026-00102',
    patientName: 'Mohammed Ali',
    patientMRN: 'ORH-2026-00102',
    prescribingDepartment: 'Surgery',
    prescribingClinician: 'Dr. Rahel Tesfaye',
    prescriptionDate: new Date('2026-10-14T12:30:00'),
    priority: 'routine',
    status: 'partially-dispensed',
    itemCount: 5,
    dispensedItemCount: 3,
    assignedTo: 'Dawit Mulugeta'
  },
  {
    prescriptionId: 'PRX-005',
    prescriptionNumber: 'RX-2026-00128',
    patientId: 'ORH-2026-00076',
    patientName: 'Fatima Hassan',
    patientMRN: 'ORH-2026-00076',
    prescribingDepartment: 'Outpatient',
    prescribingClinician: 'Dr. Bekele Tadesse',
    prescriptionDate: new Date('2026-10-14T11:50:00'),
    priority: 'routine',
    status: 'pending',
    itemCount: 2,
    dispensedItemCount: 0
  }
]

export const demoInventoryAlerts: MedicineInventoryItem[] = [
  {
    medicineId: 'MED-001',
    medicineName: 'Paracetamol',
    medicineCode: 'PAR-500',
    strength: '500mg',
    dosageForm: 'Tablet',
    availableQuantity: 150,
    unitOfMeasure: 'tablets',
    reorderThreshold: 500,
    stockStatus: 'low-stock',
    hasExpiredStock: false,
    totalBatches: 2
  },
  {
    medicineId: 'MED-002',
    medicineName: 'Amoxicillin',
    medicineCode: 'AMX-250',
    strength: '250mg',
    dosageForm: 'Capsule',
    availableQuantity: 0,
    unitOfMeasure: 'capsules',
    reorderThreshold: 300,
    stockStatus: 'out-of-stock',
    hasExpiredStock: true,
    totalBatches: 0
  },
  {
    medicineId: 'MED-003',
    medicineName: 'Oral Rehydration Salts',
    medicineCode: 'ORS-001',
    dosageForm: 'Sachet',
    availableQuantity: 45,
    unitOfMeasure: 'sachets',
    reorderThreshold: 200,
    stockStatus: 'low-stock',
    hasExpiredStock: false,
    totalBatches: 1
  },
  {
    medicineId: 'MED-004',
    medicineName: 'Normal Saline',
    medicineCode: 'NS-500',
    strength: '0.9%',
    dosageForm: 'IV Solution 500ml',
    availableQuantity: 0,
    unitOfMeasure: 'bottles',
    reorderThreshold: 100,
    stockStatus: 'out-of-stock',
    hasExpiredStock: false,
    totalBatches: 0
  },
  {
    medicineId: 'MED-005',
    medicineName: 'Metformin',
    medicineCode: 'MET-500',
    strength: '500mg',
    dosageForm: 'Tablet',
    availableQuantity: 280,
    unitOfMeasure: 'tablets',
    reorderThreshold: 600,
    stockStatus: 'low-stock',
    hasExpiredStock: false,
    totalBatches: 3
  },
  {
    medicineId: 'MED-006',
    medicineName: 'Insulin (Regular)',
    medicineCode: 'INS-REG',
    strength: '100 IU/ml',
    dosageForm: 'Injection 10ml',
    availableQuantity: 0,
    unitOfMeasure: 'vials',
    reorderThreshold: 20,
    stockStatus: 'out-of-stock',
    hasExpiredStock: false,
    totalBatches: 0
  }
]

export const demoExpiryMonitoring: ExpiryMonitoringItem[] = [
  {
    batchId: 'BAT-001',
    medicineId: 'MED-007',
    medicineName: 'Ciprofloxacin',
    medicineCode: 'CIP-500',
    strength: '500mg',
    dosageForm: 'Tablet',
    batchNumber: 'CIP2024-08-001',
    quantity: 180,
    unitOfMeasure: 'tablets',
    expiryDate: new Date('2026-11-30'),
    daysUntilExpiry: 47,
    status: 'expiring-soon'
  },
  {
    batchId: 'BAT-002',
    medicineId: 'MED-008',
    medicineName: 'Ceftriaxone',
    medicineCode: 'CEF-1G',
    strength: '1g',
    dosageForm: 'Injection',
    batchNumber: 'CEF2024-06-002',
    quantity: 24,
    unitOfMeasure: 'vials',
    expiryDate: new Date('2026-09-15'),
    daysUntilExpiry: -29,
    status: 'expired'
  },
  {
    batchId: 'BAT-003',
    medicineId: 'MED-009',
    medicineName: 'Dextrose',
    medicineCode: 'DEX-5',
    strength: '5%',
    dosageForm: 'IV Solution 500ml',
    batchNumber: 'DEX2024-09-003',
    quantity: 36,
    unitOfMeasure: 'bottles',
    expiryDate: new Date('2026-12-20'),
    daysUntilExpiry: 67,
    status: 'available'
  },
  {
    batchId: 'BAT-004',
    medicineId: 'MED-010',
    medicineName: 'Diazepam',
    medicineCode: 'DIA-5',
    strength: '5mg',
    dosageForm: 'Tablet',
    batchNumber: 'DIA2024-05-004',
    quantity: 150,
    unitOfMeasure: 'tablets',
    expiryDate: new Date('2026-10-30'),
    daysUntilExpiry: 16,
    status: 'expiring-soon'
  },
  {
    batchId: 'BAT-005',
    medicineId: 'MED-002',
    medicineName: 'Amoxicillin',
    medicineCode: 'AMX-250',
    strength: '250mg',
    dosageForm: 'Capsule',
    batchNumber: 'AMX2024-03-005',
    quantity: 120,
    unitOfMeasure: 'capsules',
    expiryDate: new Date('2026-08-20'),
    daysUntilExpiry: -55,
    status: 'expired'
  },
  {
    batchId: 'BAT-006',
    medicineId: 'MED-011',
    medicineName: 'Vitamin B Complex',
    medicineCode: 'VIT-BC',
    dosageForm: 'Tablet',
    batchNumber: 'VIT2024-07-006',
    quantity: 200,
    unitOfMeasure: 'tablets',
    expiryDate: new Date('2026-11-15'),
    daysUntilExpiry: 32,
    status: 'expiring-soon'
  }
]

export const demoStockMovements: StockMovement[] = [
  {
    movementId: 'MOV-001',
    movementReference: 'GRN-2026-00089',
    medicineId: 'MED-001',
    medicineName: 'Paracetamol',
    medicineCode: 'PAR-500',
    movementType: 'stock-received',
    quantity: 1000,
    unitOfMeasure: 'tablets',
    movementDate: new Date('2026-10-14T09:15:00'),
    performedBy: 'Dawit Mulugeta',
    performedByRole: 'Pharmacy Technician',
    referenceDocument: 'PO-2026-00234',
    notes: 'Supplier: MedSupply Ethiopia'
  },
  {
    movementId: 'MOV-002',
    movementReference: 'RX-2026-00118',
    medicineId: 'MED-005',
    medicineName: 'Metformin',
    medicineCode: 'MET-500',
    movementType: 'dispensed',
    quantity: 60,
    unitOfMeasure: 'tablets',
    movementDate: new Date('2026-10-14T13:45:00'),
    performedBy: 'Tigist Alemayehu',
    performedByRole: 'Pharmacist',
    referenceDocument: 'RX-2026-00118'
  },
  {
    movementId: 'MOV-003',
    movementReference: 'ADJ-2026-00012',
    medicineId: 'MED-007',
    medicineName: 'Ciprofloxacin',
    medicineCode: 'CIP-500',
    movementType: 'adjustment',
    quantity: -10,
    unitOfMeasure: 'tablets',
    movementDate: new Date('2026-10-14T11:20:00'),
    performedBy: 'Tigist Alemayehu',
    performedByRole: 'Pharmacist',
    notes: 'Damaged packaging - written off'
  },
  {
    movementId: 'MOV-004',
    movementReference: 'RX-2026-00115',
    medicineId: 'MED-003',
    medicineName: 'Oral Rehydration Salts',
    medicineCode: 'ORS-001',
    movementType: 'dispensed',
    quantity: 12,
    unitOfMeasure: 'sachets',
    movementDate: new Date('2026-10-14T10:30:00'),
    performedBy: 'Selam Tadesse',
    performedByRole: 'Pharmacy Assistant',
    referenceDocument: 'RX-2026-00115'
  },
  {
    movementId: 'MOV-005',
    movementReference: 'RET-2026-00003',
    medicineId: 'MED-009',
    medicineName: 'Dextrose',
    medicineCode: 'DEX-5',
    movementType: 'returned',
    quantity: 2,
    unitOfMeasure: 'bottles',
    movementDate: new Date('2026-10-14T08:50:00'),
    performedBy: 'Dawit Mulugeta',
    performedByRole: 'Pharmacy Technician',
    referenceDocument: 'RX-2026-00112',
    notes: 'Unused from cancelled procedure'
  }
]

export const demoPharmacyAlerts: PharmacyAlert[] = [
  {
    alertId: 'ALT-001',
    alertType: 'expired-stock',
    severity: 'critical',
    title: 'Expired Stock Requires Review',
    description: 'Amoxicillin 250mg (Batch AMX2024-03-005) expired on August 20, 2026. Remove from dispensing inventory.',
    relatedReference: 'BAT-005',
    timestamp: new Date('2026-10-14T14:15:00'),
    actionRequired: 'Review and quarantine expired batch',
    actionLink: '/pharmacy/expiry-monitoring'
  },
  {
    alertId: 'ALT-002',
    alertType: 'unavailable-medicine',
    severity: 'critical',
    title: 'Medicine Out of Stock',
    description: 'Normal Saline 0.9% 500ml is out of stock. Active prescriptions may be affected.',
    relatedReference: 'MED-004',
    timestamp: new Date('2026-10-14T13:40:00'),
    actionRequired: 'Initiate emergency procurement',
    actionLink: '/pharmacy/inventory'
  },
  {
    alertId: 'ALT-003',
    alertType: 'expiry-approaching',
    severity: 'warning',
    title: 'Batch Expiring Soon',
    description: 'Diazepam 5mg (Batch DIA2024-05-004) expires in 16 days. 150 tablets remaining.',
    relatedReference: 'BAT-004',
    timestamp: new Date('2026-10-14T12:30:00'),
    actionRequired: 'Prioritize dispensing or return to supplier',
    actionLink: '/pharmacy/expiry-monitoring'
  },
  {
    alertId: 'ALT-004',
    alertType: 'reorder-threshold',
    severity: 'warning',
    title: 'Reorder Threshold Reached',
    description: 'Paracetamol 500mg has reached reorder threshold. Available: 150 tablets, Threshold: 500 tablets.',
    relatedReference: 'MED-001',
    timestamp: new Date('2026-10-14T11:15:00'),
    actionRequired: 'Create purchase request',
    actionLink: '/pharmacy/inventory'
  },
  {
    alertId: 'ALT-005',
    alertType: 'pending-prescription',
    severity: 'info',
    title: 'Prescription Pending Over 60 Minutes',
    description: 'Prescription RX-2026-00126 (Patient: Sara Musa) has been pending for 65 minutes.',
    relatedReference: 'RX-2026-00126',
    timestamp: new Date('2026-10-14T14:25:00'),
    actionRequired: 'Process urgent prescription',
    actionLink: '/pharmacy/prescriptions'
  }
]

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

export function getStockStatusLabel(status: StockStatus): string {
  const labels: Record<StockStatus, string> = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
    'restricted': 'Restricted',
    'expired-present': 'Expired Stock Present'
  }
  return labels[status]
}

export function getBatchStatusLabel(status: BatchStatus): string {
  const labels: Record<BatchStatus, string> = {
    'expiring-soon': 'Expiring Soon',
    'expired': 'Expired',
    'quarantined': 'Quarantined',
    'available': 'Available'
  }
  return labels[status]
}

export function getMovementTypeLabel(type: MovementType): string {
  const labels: Record<MovementType, string> = {
    'stock-received': 'Stock Received',
    'dispensed': 'Dispensed',
    'adjustment': 'Stock Adjustment',
    'returned': 'Returned to Inventory',
    'transferred': 'Transferred'
  }
  return labels[type]
}

export function getAlertSeverityColor(severity: AlertSeverity): string {
  const colors: Record<AlertSeverity, string> = {
    'info': '#3182ce',
    'warning': '#ed8936',
    'critical': '#e53e3e'
  }
  return colors[severity]
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
