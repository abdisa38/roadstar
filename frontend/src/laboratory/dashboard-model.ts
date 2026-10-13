// Laboratory Dashboard Model (Prompt 31)
// Data model for laboratory dashboard overview and workload management

import type { RequestStatus, RequestPriority } from './model';
import type { SpecimenStatus } from './specimen-model';

// Dashboard workload summary
export interface WorkloadSummary {
  newOrders: number;
  awaitingSpecimen: number;
  inProgress: number;
  pendingResults: number;
  awaitingReview: number;
  completedToday: number;
}

// Attention item types
export type AttentionType = 
  | 'specimen-not-received'
  | 'specimen-rejected'
  | 'incomplete-order'
  | 'delayed-test'
  | 'awaiting-review'
  | 'quality-issue';

// Attention priority
export type AttentionPriority = 'critical' | 'high' | 'medium' | 'low';

// Laboratory attention item
export interface AttentionItem {
  id: string;
  type: AttentionType;
  priority: AttentionPriority;
  orderId: string;
  patientName: string;
  patientId: string;
  testName: string;
  message: string;
  action: string;
  timestamp: Date;
}

// Dashboard order (combines laboratory request and specimen info)
export interface DashboardOrder {
  orderId: string;
  patientName: string;
  patientId: string;
  encounterId: string;
  testName: string;
  testCategory: string;
  orderingDepartment: string;
  orderingClinician: string;
  orderTime: Date;
  specimenType: string;
  specimenStatus: SpecimenStatus | 'not-collected';
  specimenIdentifier?: string;
  processingStatus: RequestStatus;
  priority: RequestPriority;
  nextAction: string;
}

// Dashboard filters
export interface DashboardFilters {
  searchQuery: string;
  testTypeFilter?: string;
  orderStatusFilter?: RequestStatus;
  specimenStatusFilter?: SpecimenStatus | 'not-collected';
  priorityFilter?: RequestPriority;
  dateRangeFilter: 'today' | 'last-7-days' | 'last-30-days' | 'all';
}

// Dashboard state
export interface DashboardState {
  workloadSummary: WorkloadSummary;
  attentionItems: AttentionItem[];
  orders: DashboardOrder[];
  filters: DashboardFilters;
  sortBy: 'order-time' | 'patient-name' | 'priority' | 'status';
  sortDirection: 'asc' | 'desc';
}

// Demo workload summary
export const demoWorkloadSummary: WorkloadSummary = {
  newOrders: 12,
  awaitingSpecimen: 8,
  inProgress: 15,
  pendingResults: 6,
  awaitingReview: 4,
  completedToday: 23
};

// Demo attention items
export const demoAttentionItems: AttentionItem[] = [
  {
    id: 'ATT-001',
    type: 'specimen-not-received',
    priority: 'high',
    orderId: 'LABREQ-2026-00150',
    patientName: 'Ahmed Hassan',
    patientId: 'ORH-2026-00145',
    testName: 'Blood Culture',
    message: 'Specimen not received for 2 hours after order',
    action: 'Contact specimen collection',
    timestamp: new Date('2026-10-13T08:30:00')
  },
  {
    id: 'ATT-002',
    type: 'awaiting-review',
    priority: 'critical',
    orderId: 'LABREQ-2026-00148',
    patientName: 'Fatima Ibrahim',
    patientId: 'ORH-2026-00143',
    testName: 'CBC',
    message: 'Critical low hemoglobin result awaiting review',
    action: 'Review result',
    timestamp: new Date('2026-10-13T07:45:00')
  },
  {
    id: 'ATT-003',
    type: 'specimen-rejected',
    priority: 'high',
    orderId: 'LABREQ-2026-00147',
    patientName: 'Mohamed Ali',
    patientId: 'ORH-2026-00142',
    testName: 'Liver Function Test',
    message: 'Specimen hemolyzed, recollection required',
    action: 'Request recollection',
    timestamp: new Date('2026-10-13T07:15:00')
  },
  {
    id: 'ATT-004',
    type: 'delayed-test',
    priority: 'medium',
    orderId: 'LABREQ-2026-00146',
    patientName: 'Sarah Ahmed',
    patientId: 'ORH-2026-00141',
    testName: 'Fasting Blood Sugar',
    message: 'Test delayed beyond 4-hour target',
    action: 'Prioritize processing',
    timestamp: new Date('2026-10-13T06:30:00')
  }
];

// Demo dashboard orders
export const demoDashboardOrders: DashboardOrder[] = [
  {
    orderId: 'LABREQ-2026-00150',
    patientName: 'Ahmed Hassan',
    patientId: 'ORH-2026-00145',
    encounterId: 'ENC-2026-00092',
    testName: 'Blood Culture',
    testCategory: 'Microbiology',
    orderingDepartment: 'Emergency Department',
    orderingClinician: 'Dr. Amina Bekele',
    orderTime: new Date('2026-10-13T06:30:00'),
    specimenType: 'Blood',
    specimenStatus: 'not-collected',
    processingStatus: 'specimen-collection-pending',
    priority: 'STAT',
    nextAction: 'Contact specimen collection'
  },
  {
    orderId: 'LABREQ-2026-00149',
    patientName: 'Hana Mohammed',
    patientId: 'ORH-2026-00124',
    encounterId: 'ENC-2026-00087',
    testName: 'Complete Blood Count (CBC)',
    testCategory: 'Hematology',
    orderingDepartment: 'Outpatient Clinic',
    orderingClinician: 'Dr. Solomon Tadesse',
    orderTime: new Date('2026-10-13T07:00:00'),
    specimenType: 'Blood (EDTA)',
    specimenStatus: 'awaiting-collection',
    specimenIdentifier: 'SPEC-2026-00245',
    processingStatus: 'specimen-collection-pending',
    priority: 'routine',
    nextAction: 'Collect specimen'
  },
  {
    orderId: 'LABREQ-2026-00148',
    patientName: 'Fatima Ibrahim',
    patientId: 'ORH-2026-00143',
    encounterId: 'ENC-2026-00090',
    testName: 'Complete Blood Count (CBC)',
    testCategory: 'Hematology',
    orderingDepartment: 'Emergency Department',
    orderingClinician: 'Dr. Amina Bekele',
    orderTime: new Date('2026-10-13T05:45:00'),
    specimenType: 'Blood (EDTA)',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00244',
    processingStatus: 'result-available',
    priority: 'STAT',
    nextAction: 'Review result'
  },
  {
    orderId: 'LABREQ-2026-00147',
    patientName: 'Mohamed Ali',
    patientId: 'ORH-2026-00142',
    encounterId: 'ENC-2026-00089',
    testName: 'Liver Function Test',
    testCategory: 'Biochemistry',
    orderingDepartment: 'Inpatient Ward 2',
    orderingClinician: 'Dr. Mekuria Getachew',
    orderTime: new Date('2026-10-13T05:30:00'),
    specimenType: 'Blood (Plain)',
    specimenStatus: 'rejected',
    specimenIdentifier: 'SPEC-2026-00243',
    processingStatus: 'specimen-collection-pending',
    priority: 'urgent',
    nextAction: 'Request recollection'
  },
  {
    orderId: 'LABREQ-2026-00146',
    patientName: 'Sarah Ahmed',
    patientId: 'ORH-2026-00141',
    encounterId: 'ENC-2026-00088',
    testName: 'Fasting Blood Sugar',
    testCategory: 'Biochemistry',
    orderingDepartment: 'Outpatient Clinic',
    orderingClinician: 'Dr. Solomon Tadesse',
    orderTime: new Date('2026-10-13T04:30:00'),
    specimenType: 'Blood (Plain)',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00242',
    processingStatus: 'in-progress',
    priority: 'routine',
    nextAction: 'Continue processing'
  },
  {
    orderId: 'LABREQ-2026-00145',
    patientName: 'Ibrahim Yusuf',
    patientId: 'ORH-2026-00140',
    encounterId: 'ENC-2026-00086',
    testName: 'Malaria Test',
    testCategory: 'Serology',
    orderingDepartment: 'Emergency Department',
    orderingClinician: 'Dr. Amina Bekele',
    orderTime: new Date('2026-10-13T03:45:00'),
    specimenType: 'Blood',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00241',
    processingStatus: 'in-progress',
    priority: 'STAT',
    nextAction: 'Continue processing'
  },
  {
    orderId: 'LABREQ-2026-00144',
    patientName: 'Amina Hassan',
    patientId: 'ORH-2026-00139',
    encounterId: 'ENC-2026-00085',
    testName: 'Urinalysis',
    testCategory: 'Urinalysis',
    orderingDepartment: 'Outpatient Clinic',
    orderingClinician: 'Dr. Solomon Tadesse',
    orderTime: new Date('2026-10-13T03:15:00'),
    specimenType: 'Urine',
    specimenStatus: 'collected-pending-verification',
    specimenIdentifier: 'SPEC-2026-00240',
    processingStatus: 'specimen-collected',
    priority: 'routine',
    nextAction: 'Verify specimen'
  },
  {
    orderId: 'LABREQ-2026-00143',
    patientName: 'Hassan Mohammed',
    patientId: 'ORH-2026-00138',
    encounterId: 'ENC-2026-00084',
    testName: 'Renal Function Test',
    testCategory: 'Biochemistry',
    orderingDepartment: 'Inpatient Ward 1',
    orderingClinician: 'Dr. Mekuria Getachew',
    orderTime: new Date('2026-10-13T02:30:00'),
    specimenType: 'Blood (Plain)',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00239',
    processingStatus: 'in-progress',
    priority: 'urgent',
    nextAction: 'Continue processing'
  },
  {
    orderId: 'LABREQ-2026-00142',
    patientName: 'Maryam Ali',
    patientId: 'ORH-2026-00137',
    encounterId: 'ENC-2026-00083',
    testName: 'Stool Ova & Parasites',
    testCategory: 'Parasitology',
    orderingDepartment: 'Outpatient Clinic',
    orderingClinician: 'Dr. Solomon Tadesse',
    orderTime: new Date('2026-10-13T02:00:00'),
    specimenType: 'Stool',
    specimenStatus: 'awaiting-collection',
    processingStatus: 'specimen-collection-pending',
    priority: 'routine',
    nextAction: 'Collect specimen'
  },
  {
    orderId: 'LABREQ-2026-00141',
    patientName: 'Yusuf Ibrahim',
    patientId: 'ORH-2026-00136',
    encounterId: 'ENC-2026-00082',
    testName: 'Electrolytes',
    testCategory: 'Biochemistry',
    orderingDepartment: 'Emergency Department',
    orderingClinician: 'Dr. Amina Bekele',
    orderTime: new Date('2026-10-13T01:30:00'),
    specimenType: 'Blood (Heparin)',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00238',
    processingStatus: 'result-available',
    priority: 'urgent',
    nextAction: 'Review result'
  },
  {
    orderId: 'LABREQ-2026-00140',
    patientName: 'Fatuma Ahmed',
    patientId: 'ORH-2026-00135',
    encounterId: 'ENC-2026-00081',
    testName: 'HIV Test',
    testCategory: 'Serology',
    orderingDepartment: 'Outpatient Clinic',
    orderingClinician: 'Dr. Solomon Tadesse',
    orderTime: new Date('2026-10-13T01:00:00'),
    specimenType: 'Blood',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00237',
    processingStatus: 'in-progress',
    priority: 'routine',
    nextAction: 'Continue processing'
  },
  {
    orderId: 'LABREQ-2026-00139',
    patientName: 'Ali Hassan',
    patientId: 'ORH-2026-00134',
    encounterId: 'ENC-2026-00080',
    testName: 'HbA1c',
    testCategory: 'Biochemistry',
    orderingDepartment: 'Outpatient Clinic',
    orderingClinician: 'Dr. Solomon Tadesse',
    orderTime: new Date('2026-10-13T00:45:00'),
    specimenType: 'Blood (EDTA)',
    specimenStatus: 'verified',
    specimenIdentifier: 'SPEC-2026-00236',
    processingStatus: 'result-available',
    priority: 'routine',
    nextAction: 'Enter result'
  }
];

// Utility functions
export function formatAttentionType(type: AttentionType): string {
  switch (type) {
    case 'specimen-not-received': return 'Specimen Not Received';
    case 'specimen-rejected': return 'Specimen Rejected';
    case 'incomplete-order': return 'Incomplete Order';
    case 'delayed-test': return 'Delayed Test';
    case 'awaiting-review': return 'Awaiting Review';
    case 'quality-issue': return 'Quality Issue';
    default: return type;
  }
}

export function formatAttentionPriority(priority: AttentionPriority): string {
  switch (priority) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return priority;
  }
}

export function getNextActionLabel(order: DashboardOrder): string {
  if (order.specimenStatus === 'not-collected' || order.specimenStatus === 'awaiting-collection') {
    return 'Collect Specimen';
  }
  if (order.specimenStatus === 'collected-pending-verification') {
    return 'Verify Specimen';
  }
  if (order.specimenStatus === 'rejected') {
    return 'Request Recollection';
  }
  if (order.processingStatus === 'in-progress') {
    return 'Continue Processing';
  }
  if (order.processingStatus === 'result-available') {
    return 'Review Result';
  }
  return 'View Order';
}

export function filterOrders(orders: DashboardOrder[], filters: DashboardFilters): DashboardOrder[] {
  let filtered = [...orders];

  // Search query
  if (filters.searchQuery.trim().length >= 2) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(order =>
      order.patientName.toLowerCase().includes(query) ||
      order.patientId.toLowerCase().includes(query) ||
      order.orderId.toLowerCase().includes(query) ||
      order.testName.toLowerCase().includes(query)
    );
  }

  // Test type filter
  if (filters.testTypeFilter) {
    filtered = filtered.filter(order => order.testCategory === filters.testTypeFilter);
  }

  // Order status filter
  if (filters.orderStatusFilter) {
    filtered = filtered.filter(order => order.processingStatus === filters.orderStatusFilter);
  }

  // Specimen status filter
  if (filters.specimenStatusFilter) {
    filtered = filtered.filter(order => order.specimenStatus === filters.specimenStatusFilter);
  }

  // Priority filter
  if (filters.priorityFilter) {
    filtered = filtered.filter(order => order.priority === filters.priorityFilter);
  }

  // Date range filter
  const now = new Date();
  if (filters.dateRangeFilter !== 'all') {
    const cutoff = new Date(now);
    if (filters.dateRangeFilter === 'today') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (filters.dateRangeFilter === 'last-7-days') {
      cutoff.setDate(cutoff.getDate() - 7);
    } else if (filters.dateRangeFilter === 'last-30-days') {
      cutoff.setDate(cutoff.getDate() - 30);
    }
    filtered = filtered.filter(order => order.orderTime >= cutoff);
  }

  return filtered;
}

export function sortOrders(
  orders: DashboardOrder[],
  sortBy: DashboardState['sortBy'],
  sortDirection: DashboardState['sortDirection']
): DashboardOrder[] {
  const sorted = [...orders];
  
  sorted.sort((a, b) => {
    let aVal: any, bVal: any;
    
    switch (sortBy) {
      case 'order-time':
        aVal = a.orderTime.getTime();
        bVal = b.orderTime.getTime();
        break;
      case 'patient-name':
        aVal = a.patientName;
        bVal = b.patientName;
        break;
      case 'priority':
        const priorityOrder = { 'STAT': 0, 'urgent': 1, 'routine': 2 };
        aVal = priorityOrder[a.priority];
        bVal = priorityOrder[b.priority];
        break;
      case 'status':
        aVal = a.processingStatus;
        bVal = b.processingStatus;
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
  
  return sorted;
}

// Calculate workload from orders
export function calculateWorkload(orders: DashboardOrder[]): WorkloadSummary {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    newOrders: orders.filter(o => o.processingStatus === 'requested').length,
    awaitingSpecimen: orders.filter(o => 
      o.processingStatus === 'specimen-collection-pending' || 
      o.specimenStatus === 'awaiting-collection' ||
      o.specimenStatus === 'not-collected'
    ).length,
    inProgress: orders.filter(o => o.processingStatus === 'in-progress').length,
    pendingResults: orders.filter(o => 
      o.processingStatus === 'result-available' && 
      o.nextAction === 'Enter result'
    ).length,
    awaitingReview: orders.filter(o => 
      o.processingStatus === 'result-available' && 
      o.nextAction === 'Review result'
    ).length,
    completedToday: orders.filter(o => {
      const completedDate = new Date(o.orderTime);
      return o.processingStatus === 'result-available' && 
             completedDate >= today;
    }).length
  };
}
