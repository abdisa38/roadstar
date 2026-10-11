// Queue management model — fictional data only. All names, IDs, times are illustrative.

export type QueueStatus = 
  | 'waiting' 
  | 'called' 
  | 'in-service' 
  | 'completed' 
  | 'cancelled' 
  | 'left-before-service'

export type QueueEntry = {
  id: string
  patientId: string
  patientName: string
  appointmentId: string | null
  service: string
  department: string
  arrivalTime: string
  calledTime: string | null
  serviceStartTime: string | null
  completedTime: string | null
  status: QueueStatus
  position: number | null
  notes: string
  registeredBy: string
}

export type QueueDraft = {
  patientId: string
  patientName: string
  appointmentId: string | null
  service: string
  department: string
  notes: string
}

export const emptyQueueDraft: QueueDraft = {
  patientId: '',
  patientName: '',
  appointmentId: null,
  service: '',
  department: '',
  notes: '',
}

// Fictional sample queue entries for demonstration
export const sampleQueueEntries: QueueEntry[] = [
  {
    id: 'DEMO-Q-301',
    patientId: 'DEMO-EX-101',
    patientName: 'Hana Example',
    appointmentId: 'DEMO-APT-201',
    service: 'General consultation',
    department: 'General Medicine',
    arrivalTime: '2026-07-14T08:45:00Z',
    calledTime: null,
    serviceStartTime: null,
    completedTime: null,
    status: 'waiting',
    position: 1,
    notes: '',
    registeredBy: 'Demo Receptionist',
  },
  {
    id: 'DEMO-Q-302',
    patientId: 'DEMO-EX-102',
    patientName: 'Abebe Example',
    appointmentId: 'DEMO-APT-202',
    service: 'General consultation',
    department: 'General Medicine',
    arrivalTime: '2026-07-14T08:50:00Z',
    calledTime: '2026-07-14T09:05:00Z',
    serviceStartTime: null,
    completedTime: null,
    status: 'called',
    position: 2,
    notes: '',
    registeredBy: 'Demo Receptionist',
  },
  {
    id: 'DEMO-Q-303',
    patientId: 'DEMO-EX-103',
    patientName: 'Tigist Example',
    appointmentId: 'DEMO-APT-203',
    service: 'Maternal health review',
    department: 'Maternal & Child Health',
    arrivalTime: '2026-07-14T09:00:00Z',
    calledTime: '2026-07-14T09:15:00Z',
    serviceStartTime: '2026-07-14T09:18:00Z',
    completedTime: null,
    status: 'in-service',
    position: null,
    notes: '',
    registeredBy: 'Demo Receptionist',
  },
  {
    id: 'DEMO-Q-304',
    patientId: 'DEMO-EX-105',
    patientName: 'Sara Example',
    appointmentId: 'DEMO-APT-205',
    service: 'Follow-up consultation',
    department: 'General Medicine',
    arrivalTime: '2026-07-14T09:10:00Z',
    calledTime: null,
    serviceStartTime: null,
    completedTime: null,
    status: 'waiting',
    position: 3,
    notes: '',
    registeredBy: 'Demo Receptionist',
  },
  {
    id: 'DEMO-Q-305',
    patientId: 'DEMO-EX-106',
    patientName: 'Marta Example',
    appointmentId: 'DEMO-APT-206',
    service: 'General consultation',
    department: 'General Medicine',
    arrivalTime: '2026-07-14T08:30:00Z',
    calledTime: '2026-07-14T08:45:00Z',
    serviceStartTime: '2026-07-14T08:50:00Z',
    completedTime: '2026-07-14T09:20:00Z',
    status: 'completed',
    position: null,
    notes: '',
    registeredBy: 'Demo Receptionist',
  },
]

export function queueStatusLabel(status: QueueStatus): string {
  const map: Record<QueueStatus, string> = {
    waiting: 'Waiting',
    called: 'Called',
    'in-service': 'In Service',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'left-before-service': 'Left Before Service',
  }
  return map[status] ?? status
}

export function calculateWaitingDuration(arrivalTime: string, now: Date = new Date()): string {
  const arrival = new Date(arrivalTime)
  const diffMs = now.getTime() - arrival.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return '< 1 min'
  if (diffMins < 60) return `${diffMins} min`
  
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`
}

export function timeLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function filterQueue(
  entries: QueueEntry[],
  search: string,
  statusFilter: QueueStatus | 'all',
  departmentFilter: string,
): QueueEntry[] {
  return entries.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.patientName.toLowerCase().includes(search.toLowerCase()) ||
      entry.patientId.toLowerCase().includes(search.toLowerCase()) ||
      entry.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
    const matchesDepartment = !departmentFilter || entry.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })
}

export function validateQueueDraft(draft: QueueDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!draft.patientId) errors.patientId = 'Patient is required'
  if (!draft.service) errors.service = 'Service is required'
  
  return errors
}

export function detectDuplicateQueueEntry(
  draft: QueueDraft,
  existing: QueueEntry[],
): QueueEntry | null {
  return existing.find(
    (entry) =>
      entry.patientId === draft.patientId &&
      (entry.status === 'waiting' || 
       entry.status === 'called' || 
       entry.status === 'in-service')
  ) || null
}
