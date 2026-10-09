// Patient profile model — fictional data only. All names, IDs, dates are illustrative.

export type PatientRecord = {
  id: string
  givenName: string
  additionalName: string
  familyName: string
  birth: string
  birthMode: 'date' | 'age' | 'unknown'
  estimatedAge?: number
  phone: string
  phoneToken: string
  alternatePhone: string
  email: string
  residence: string
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string
  registered: string
  registeredBy: string
  lastUpdated: string
}

export type AppointmentRecord = {
  id: string
  date: string
  time: string | null
  service: string
  department: string
  clinician: string | null
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'missed'
  notes: string
}

export type EncounterRecord = {
  id: string
  date: string
  time: string | null
  type: string
  department: string
  clinician: string | null
  status: 'open' | 'completed' | 'cancelled'
  notes: string
}

export type ActivityEvent = {
  id: string
  timestamp: string
  label: string
  kind: 'appointment' | 'encounter' | 'registration' | 'demographic' | 'laboratory' | 'prescription' | 'billing'
  detail: string
  restricted: boolean
}

// Fictional sample — ID matches Hana Example from existing fixtures
export const sampleProfile: PatientRecord = {
  id: 'DEMO-EX-101',
  givenName: 'Hana',
  additionalName: '',
  familyName: 'Example',
  birth: '1994-08-10',
  birthMode: 'date',
  phone: '••• ••• 0101',
  phoneToken: '0000000101',
  alternatePhone: '',
  email: '',
  residence: 'Example locality A',
  emergencyName: 'Abebe Example',
  emergencyRelationship: 'Parent',
  emergencyPhone: '••• ••• 9901',
  registered: '2026-06-17',
  registeredBy: 'Demo Receptionist',
  lastUpdated: '2026-06-17',
}

export const sampleAppointments: AppointmentRecord[] = [
  {
    id: 'DEMO-APT-001',
    date: '2026-07-14',
    time: '09:00',
    service: 'General outpatient consultation',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician A',
    status: 'confirmed',
    notes: 'Fictional appointment — design preview only.',
  },
  {
    id: 'DEMO-APT-002',
    date: '2026-08-02',
    time: '11:30',
    service: 'Follow-up review',
    department: 'General Medicine',
    clinician: null,
    status: 'scheduled',
    notes: '',
  },
  {
    id: 'DEMO-APT-003',
    date: '2026-06-20',
    time: '10:00',
    service: 'Laboratory referral review',
    department: 'Laboratory',
    clinician: 'Dr. Example Clinician B',
    status: 'cancelled',
    notes: 'Cancelled by patient — fictional.',
  },
]

export const sampleEncounters: EncounterRecord[] = [
  {
    id: 'DEMO-ENC-001',
    date: '2026-06-17',
    time: '08:45',
    type: 'Outpatient visit',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician A',
    status: 'completed',
    notes: 'Initial visit — fictional notes for design preview only. No real clinical content.',
  },
  {
    id: 'DEMO-ENC-002',
    date: '2026-07-14',
    time: '09:15',
    type: 'Outpatient visit',
    department: 'General Medicine',
    clinician: 'Dr. Example Clinician A',
    status: 'open',
    notes: 'Ongoing encounter — fictional.',
  },
]

export const sampleActivity: ActivityEvent[] = [
  {
    id: 'DEMO-ACT-001',
    timestamp: '2026-06-17T08:30:00Z',
    label: 'Patient registered',
    kind: 'registration',
    detail: 'Registered by Demo Receptionist · DEMO-EX-101',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-002',
    timestamp: '2026-06-17T08:45:00Z',
    label: 'Encounter opened',
    kind: 'encounter',
    detail: 'Outpatient visit · General Medicine · DEMO-ENC-001',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-003',
    timestamp: '2026-06-17T09:30:00Z',
    label: 'Encounter completed',
    kind: 'encounter',
    detail: 'Outpatient visit · General Medicine · DEMO-ENC-001',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-004',
    timestamp: '2026-06-20T10:00:00Z',
    label: 'Appointment cancelled',
    kind: 'appointment',
    detail: 'Laboratory referral review · DEMO-APT-003',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-005',
    timestamp: '2026-06-22T14:10:00Z',
    label: 'Demographic record updated',
    kind: 'demographic',
    detail: 'Contact details confirmed · Demo Receptionist',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-006',
    timestamp: '2026-07-01T11:00:00Z',
    label: 'Appointment scheduled',
    kind: 'appointment',
    detail: 'General outpatient consultation · DEMO-APT-001',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-007',
    timestamp: '2026-07-05T09:00:00Z',
    label: 'Appointment confirmed',
    kind: 'appointment',
    detail: 'DEMO-APT-001 · 14 Jul 2026',
    restricted: false,
  },
  {
    id: 'DEMO-ACT-008',
    timestamp: '2026-07-10T15:45:00Z',
    label: 'Follow-up appointment scheduled',
    kind: 'appointment',
    detail: 'Follow-up review · DEMO-APT-002',
    restricted: false,
  },
]

export function displayName(patient: PatientRecord): string {
  const parts = [patient.givenName, patient.additionalName, patient.familyName].filter(Boolean)
  return parts.join(' ')
}

export function birthDisplay(patient: PatientRecord): { value: string; detail: string } {
  if (patient.birthMode === 'age' && patient.estimatedAge !== undefined) {
    return { value: `${patient.estimatedAge} years`, detail: 'Estimated age · not a recorded date' }
  }
  if (patient.birthMode === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(patient.birth)) {
    const d = new Date(`${patient.birth}T00:00:00Z`)
    const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    const now = new Date()
    const age = now.getUTCFullYear() - d.getUTCFullYear() - (now.getUTCMonth() < d.getUTCMonth() || (now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() < d.getUTCDate()) ? 1 : 0)
    return { value: formatted, detail: `${age} years old` }
  }
  return { value: 'Not recorded', detail: 'No date or age provided' }
}

export function dateLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function timeLabel(time: string | null): string {
  if (!time) return 'Time not set'
  return time
}

export function appointmentStatusLabel(status: AppointmentRecord['status']): string {
  const map: Record<AppointmentRecord['status'], string> = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    missed: 'Missed',
  }
  return map[status] ?? status
}

export function encounterStatusLabel(status: EncounterRecord['status']): string {
  const map: Record<EncounterRecord['status'], string> = {
    open: 'Open',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return map[status] ?? status
}
