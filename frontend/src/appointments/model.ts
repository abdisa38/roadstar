// Appointment management model — fictional data only. All names, IDs, dates are illustrative.

export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'arrived' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show'

export type AppointmentRecord = {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  service: string
  department: string
  clinician: string | null
  status: AppointmentStatus
  reason: string
  notes: string
  bookedBy: string
  bookedAt: string
  updatedAt: string
  cancellationReason?: string
}

export type AppointmentDraft = {
  patientId: string
  patientName: string
  date: string
  time: string
  service: string
  department: string
  clinician: string | null
  reason: string
  notes: string
}

export type ScheduleConflict = {
  type: 'clinician-overlap' | 'patient-duplicate' | 'unavailable-slot'
  message: string
  severity: 'warning' | 'error'
}

export const emptyDraft: AppointmentDraft = {
  patientId: '',
  patientName: '',
  date: '',
  time: '',
  service: '',
  department: '',
  clinician: null,
  reason: '',
  notes: '',
}

// Fictional sample appointments for demonstration
export const sampleAppointments: AppointmentRecord[] = [
  {
    id: 'DEMO-APT-201',
    patientId: 'DEMO-EX-101',
    patientName: 'Hana Example',
    date: '2026-07-14',
    time: '09:00',
    service: 'General outpatient consultation',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician A',
    status: 'confirmed',
    reason: 'Follow-up visit',
    notes: 'Fictional appointment — design preview only.',
    bookedBy: 'Demo Receptionist',
    bookedAt: '2026-07-01T11:00:00Z',
    updatedAt: '2026-07-05T09:00:00Z',
  },
  {
    id: 'DEMO-APT-202',
    patientId: 'DEMO-EX-102',
    patientName: 'Abebe Example',
    date: '2026-07-14',
    time: '09:30',
    service: 'General consultation',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician B',
    status: 'scheduled',
    reason: 'Initial consultation',
    notes: '',
    bookedBy: 'Demo Receptionist',
    bookedAt: '2026-07-08T14:30:00Z',
    updatedAt: '2026-07-08T14:30:00Z',
  },
  {
    id: 'DEMO-APT-203',
    patientId: 'DEMO-EX-103',
    patientName: 'Tigist Example',
    date: '2026-07-14',
    time: '10:00',
    service: 'Maternal health review',
    department: 'Maternal & Child Health',
    clinician: 'Dr. Example Clinician C',
    status: 'scheduled',
    reason: 'Antenatal checkup',
    notes: '',
    bookedBy: 'Demo Receptionist',
    bookedAt: '2026-07-09T10:15:00Z',
    updatedAt: '2026-07-09T10:15:00Z',
  },
  {
    id: 'DEMO-APT-204',
    patientId: 'DEMO-EX-104',
    patientName: 'Daniel Example',
    date: '2026-07-14',
    time: '10:30',
    service: 'Laboratory result review',
    department: 'Laboratory',
    clinician: null,
    status: 'cancelled',
    reason: 'Laboratory referral',
    notes: '',
    bookedBy: 'Demo Receptionist',
    bookedAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-07-10T15:30:00Z',
    cancellationReason: 'Patient requested reschedule — fictional.',
  },
  {
    id: 'DEMO-APT-205',
    patientId: 'DEMO-EX-105',
    patientName: 'Sara Example',
    date: '2026-07-14',
    time: '11:00',
    service: 'Follow-up consultation',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician A',
    status: 'scheduled',
    reason: 'Follow-up',
    notes: '',
    bookedBy: 'Demo Receptionist',
    bookedAt: '2026-07-11T16:00:00Z',
    updatedAt: '2026-07-11T16:00:00Z',
  },
  {
    id: 'DEMO-APT-206',
    patientId: 'DEMO-EX-106',
    patientName: 'Marta Example',
    date: '2026-07-14',
    time: '11:30',
    service: 'General consultation',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician B',
    status: 'arrived',
    reason: 'General checkup',
    notes: '',
    bookedBy: 'Demo Receptionist',
    bookedAt: '2026-07-12T08:45:00Z',
    updatedAt: '2026-07-14T11:25:00Z',
  },
]

export const services = [
  { id: 'general-consult', label: 'General outpatient consultation', department: 'General Medicine' },
  { id: 'follow-up', label: 'Follow-up consultation', department: 'General Medicine' },
  { id: 'maternal-health', label: 'Maternal health review', department: 'Maternal & Child Health' },
  { id: 'child-health', label: 'Child health checkup', department: 'Maternal & Child Health' },
  { id: 'lab-review', label: 'Laboratory result review', department: 'Laboratory' },
  { id: 'emergency-consult', label: 'Emergency consultation', department: 'Emergency' },
]

export const clinicians = [
  { id: 'clinician-a', name: 'Dr. Example Clinician A', department: 'General Medicine' },
  { id: 'clinician-b', name: 'Dr. Example Clinician B', department: 'General Medicine' },
  { id: 'clinician-c', name: 'Dr. Example Clinician C', department: 'Maternal & Child Health' },
  { id: 'clinician-d', name: 'Dr. Example Clinician D', department: 'Emergency' },
]

export function appointmentStatusLabel(status: AppointmentStatus): string {
  const map: Record<AppointmentStatus, string> = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    arrived: 'Arrived',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'no-show': 'No-show',
  }
  return map[status] ?? status
}

export function dateLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatDateTime(date: string, time: string): string {
  return `${dateLabel(date)} at ${time}`
}

export function filterAppointments(
  appointments: AppointmentRecord[],
  date: string,
  search: string,
  statusFilter: AppointmentStatus | 'all',
  departmentFilter: string,
): AppointmentRecord[] {
  return appointments.filter((apt) => {
    const matchesDate = apt.date === date
    const matchesSearch =
      !search ||
      apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.patientId.toLowerCase().includes(search.toLowerCase()) ||
      apt.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    const matchesDepartment = !departmentFilter || apt.department === departmentFilter
    return matchesDate && matchesSearch && matchesStatus && matchesDepartment
  })
}

export function validateAppointmentDraft(draft: AppointmentDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!draft.patientId) errors.patientId = 'Patient is required'
  if (!draft.date) errors.date = 'Date is required'
  if (!draft.time) errors.time = 'Time is required'
  if (!draft.service) errors.service = 'Service is required'
  
  // Validate date is not in the past
  if (draft.date) {
    const selected = new Date(`${draft.date}T00:00:00Z`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected < today) {
      errors.date = 'Appointment date cannot be in the past'
    }
  }
  
  return errors
}

export function detectConflicts(
  draft: AppointmentDraft,
  existing: AppointmentRecord[],
  excludeId?: string,
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = []
  
  // Check for same patient on same date/time
  const patientDuplicate = existing.find(
    (apt) =>
      apt.id !== excludeId &&
      apt.patientId === draft.patientId &&
      apt.date === draft.date &&
      apt.time === draft.time &&
      apt.status !== 'cancelled' &&
      apt.status !== 'no-show',
  )
  
  if (patientDuplicate) {
    conflicts.push({
      type: 'patient-duplicate',
      message: 'This patient already has an appointment at this time.',
      severity: 'error',
    })
  }
  
  // Check for clinician overlap
  if (draft.clinician) {
    const clinicianOverlap = existing.find(
      (apt) =>
        apt.id !== excludeId &&
        apt.clinician === draft.clinician &&
        apt.date === draft.date &&
        apt.time === draft.time &&
        apt.status !== 'cancelled' &&
        apt.status !== 'no-show',
    )
    
    if (clinicianOverlap) {
      conflicts.push({
        type: 'clinician-overlap',
        message: `${draft.clinician} is already scheduled at this time.`,
        severity: 'warning',
      })
    }
  }
  
  return conflicts
}
