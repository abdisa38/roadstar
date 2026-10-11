// Doctor dashboard model — fictional data only. All names, IDs, clinical values are illustrative.

export type EncounterStatus = 
  | 'waiting'
  | 'in-consultation'
  | 'awaiting-results'
  | 'ready-for-review'
  | 'completed'

export type TaskType = 
  | 'lab-result'
  | 'follow-up'
  | 'incomplete-note'
  | 'prescription-pending'

export type TaskPriority = 'normal' | 'urgent'

export type PatientEncounter = {
  id: string
  patientId: string
  patientName: string
  appointmentTime: string | null
  arrivalTime: string
  chiefComplaint: string
  status: EncounterStatus
  assignedDoctor: string
  triageCompleted: boolean
  vitalSigns: boolean
  waitingDuration: number // minutes
}

export type ClinicalTask = {
  id: string
  type: TaskType
  patientId: string
  patientName: string
  encounterId: string
  description: string
  priority: TaskPriority
  createdAt: string
  dueDate: string | null
}

export type Appointment = {
  id: string
  patientId: string
  patientName: string
  time: string
  type: string
  status: 'scheduled' | 'arrived' | 'in-progress' | 'completed' | 'no-show'
}

export type DashboardSummary = {
  waitingForConsultation: number
  inProgress: number
  completedToday: number
  resultsRequiringReview: number
}

// Sample patient encounters for demonstration
export const sampleEncounters: PatientEncounter[] = [
  {
    id: 'ENC-2026-00087',
    patientId: 'ORH-2026-00124',
    patientName: 'Hana Mohammed',
    appointmentTime: '09:00',
    arrivalTime: '2026-01-11T08:55:00Z',
    chiefComplaint: 'Persistent cough and fever',
    status: 'waiting',
    assignedDoctor: 'Dr. Demo',
    triageCompleted: true,
    vitalSigns: true,
    waitingDuration: 35,
  },
  {
    id: 'ENC-2026-00088',
    patientId: 'ORH-2026-00125',
    patientName: 'Ahmed Hassan',
    appointmentTime: '09:30',
    arrivalTime: '2026-01-11T09:25:00Z',
    chiefComplaint: 'Chest pain - follow-up',
    status: 'in-consultation',
    assignedDoctor: 'Dr. Demo',
    triageCompleted: true,
    vitalSigns: true,
    waitingDuration: 0,
  },
  {
    id: 'ENC-2026-00089',
    patientId: 'ORH-2026-00126',
    patientName: 'Fatuma Ali',
    appointmentTime: '10:00',
    arrivalTime: '2026-01-11T09:50:00Z',
    chiefComplaint: 'Prenatal check-up',
    status: 'awaiting-results',
    assignedDoctor: 'Dr. Demo',
    triageCompleted: true,
    vitalSigns: true,
    waitingDuration: 0,
  },
  {
    id: 'ENC-2026-00090',
    patientId: 'ORH-2026-00127',
    patientName: 'Dawit Bekele',
    appointmentTime: null,
    arrivalTime: '2026-01-11T09:45:00Z',
    chiefComplaint: 'Severe headache and dizziness',
    status: 'waiting',
    assignedDoctor: 'Dr. Demo',
    triageCompleted: true,
    vitalSigns: true,
    waitingDuration: 20,
  },
  {
    id: 'ENC-2026-00091',
    patientId: 'ORH-2026-00128',
    patientName: 'Sara Tesfaye',
    appointmentTime: '10:30',
    arrivalTime: '2026-01-11T10:20:00Z',
    chiefComplaint: 'Diabetes management follow-up',
    status: 'ready-for-review',
    assignedDoctor: 'Dr. Demo',
    triageCompleted: true,
    vitalSigns: true,
    waitingDuration: 0,
  },
  {
    id: 'ENC-2026-00092',
    patientId: 'ORH-2026-00129',
    patientName: 'Marta Girma',
    appointmentTime: '08:30',
    arrivalTime: '2026-01-11T08:25:00Z',
    chiefComplaint: 'General consultation',
    status: 'completed',
    assignedDoctor: 'Dr. Demo',
    triageCompleted: true,
    vitalSigns: true,
    waitingDuration: 0,
  },
]

// Sample clinical tasks for demonstration
export const sampleClinicalTasks: ClinicalTask[] = [
  {
    id: 'TASK-001',
    type: 'lab-result',
    patientId: 'ORH-2026-00128',
    patientName: 'Sara Tesfaye',
    encounterId: 'ENC-2026-00091',
    description: 'HbA1c and fasting glucose results available',
    priority: 'normal',
    createdAt: '2026-01-11T09:45:00Z',
    dueDate: null,
  },
  {
    id: 'TASK-002',
    type: 'follow-up',
    patientId: 'ORH-2026-00125',
    patientName: 'Ahmed Hassan',
    encounterId: 'ENC-2026-00088',
    description: 'ECG interpretation required',
    priority: 'urgent',
    createdAt: '2026-01-11T09:30:00Z',
    dueDate: '2026-01-11T12:00:00Z',
  },
  {
    id: 'TASK-003',
    type: 'incomplete-note',
    patientId: 'ORH-2026-00126',
    patientName: 'Fatuma Ali',
    encounterId: 'ENC-2026-00089',
    description: 'Clinical note requires completion',
    priority: 'normal',
    createdAt: '2026-01-11T10:15:00Z',
    dueDate: '2026-01-11T17:00:00Z',
  },
]

// Sample appointments for demonstration
export const sampleAppointments: Appointment[] = [
  {
    id: 'APT-001',
    patientId: 'ORH-2026-00124',
    patientName: 'Hana Mohammed',
    time: '09:00',
    type: 'Follow-up',
    status: 'arrived',
  },
  {
    id: 'APT-002',
    patientId: 'ORH-2026-00125',
    patientName: 'Ahmed Hassan',
    time: '09:30',
    type: 'Follow-up',
    status: 'in-progress',
  },
  {
    id: 'APT-003',
    patientId: 'ORH-2026-00126',
    patientName: 'Fatuma Ali',
    time: '10:00',
    type: 'Prenatal',
    status: 'arrived',
  },
  {
    id: 'APT-004',
    patientId: 'ORH-2026-00128',
    patientName: 'Sara Tesfaye',
    time: '10:30',
    type: 'Follow-up',
    status: 'arrived',
  },
  {
    id: 'APT-005',
    patientId: 'ORH-2026-00130',
    patientName: 'Yohannes Abebe',
    time: '11:00',
    type: 'New Patient',
    status: 'scheduled',
  },
  {
    id: 'APT-006',
    patientId: 'ORH-2026-00131',
    patientName: 'Bethlehem Tadesse',
    time: '11:30',
    type: 'Follow-up',
    status: 'scheduled',
  },
]

export function getEncounterStatusLabel(status: EncounterStatus): string {
  const labels: Record<EncounterStatus, string> = {
    'waiting': 'Waiting',
    'in-consultation': 'In Consultation',
    'awaiting-results': 'Awaiting Results',
    'ready-for-review': 'Ready for Review',
    'completed': 'Completed',
  }
  return labels[status]
}

export function getTaskTypeLabel(type: TaskType): string {
  const labels: Record<TaskType, string> = {
    'lab-result': 'Laboratory Result',
    'follow-up': 'Follow-up Required',
    'incomplete-note': 'Incomplete Note',
    'prescription-pending': 'Prescription Pending',
  }
  return labels[type]
}

export function getActionLabel(status: EncounterStatus): string {
  const actions: Record<EncounterStatus, string> = {
    'waiting': 'Open Patient',
    'in-consultation': 'Continue Consultation',
    'awaiting-results': 'View Encounter',
    'ready-for-review': 'Review Results',
    'completed': 'View Record',
  }
  return actions[status]
}

export function calculateWaitTime(arrivalTime: string, currentTime: Date = new Date()): string {
  const arrival = new Date(arrivalTime)
  const diffMs = currentTime.getTime() - arrival.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return '< 1 min'
  if (diffMins < 60) return `${diffMins} min`
  
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function filterEncounters(
  encounters: PatientEncounter[],
  search: string,
  statusFilter: EncounterStatus | 'all',
  dateFilter: 'today' | 'all',
  assignedToMe: boolean,
  doctorName: string,
): PatientEncounter[] {
  return encounters.filter((encounter) => {
    const matchesSearch =
      !search ||
      encounter.patientName.toLowerCase().includes(search.toLowerCase()) ||
      encounter.patientId.toLowerCase().includes(search.toLowerCase()) ||
      encounter.id.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || encounter.status === statusFilter
    
    const matchesDate = dateFilter === 'all' || 
      new Date(encounter.arrivalTime).toDateString() === new Date().toDateString()
    
    const matchesAssignment = !assignedToMe || encounter.assignedDoctor === doctorName
    
    return matchesSearch && matchesStatus && matchesDate && matchesAssignment
  })
}

export function calculateSummary(encounters: PatientEncounter[]): DashboardSummary {
  const today = new Date().toDateString()
  
  return {
    waitingForConsultation: encounters.filter((e) => e.status === 'waiting').length,
    inProgress: encounters.filter((e) => e.status === 'in-consultation').length,
    completedToday: encounters.filter(
      (e) => e.status === 'completed' && new Date(e.arrivalTime).toDateString() === today
    ).length,
    resultsRequiringReview: encounters.filter((e) => e.status === 'ready-for-review').length,
  }
}
