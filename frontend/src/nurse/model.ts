// Nurse dashboard and triage model — fictional data only. All names, IDs, clinical values are illustrative.

export type TriageStatus = 
  | 'waiting-for-triage'
  | 'in-assessment'
  | 'assessment-completed'
  | 'needs-review'
  | 'urgent-escalation'

export type Priority = 'routine' | 'urgent' | 'emergency'

export type VitalSigns = {
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  heartRate: number | null
  temperature: number | null
  temperatureUnit: 'celsius' | 'fahrenheit'
  respiratoryRate: number | null
  oxygenSaturation: number | null
  weight: number | null
  height: number | null
  painScore: number | null
  recordedAt: string
  recordedBy: string
}

export type TriageAssessment = {
  id: string
  patientId: string
  patientName: string
  encounterId: string
  arrivalTime: string
  chiefComplaint: string
  symptomDescription: string
  vitalSigns: VitalSigns | null
  allergies: string[]
  existingConditions: string[]
  initialObservations: string
  clinicalNotes: string
  status: TriageStatus
  priority: Priority
  assignedNurse: string
  assessmentStartTime: string | null
  assessmentCompletedTime: string | null
  lastModified: string
}

export type PatientContext = {
  id: string
  name: string
  age: number | null
  dateOfBirth: string | null
  sex: 'male' | 'female' | 'other' | 'not-recorded'
  contactPhone: string
  encounterId: string
  arrivalTime: string
  chiefComplaint: string
  knownAllergies: string[]
  existingConditions: string[]
  recentVitals: VitalSigns | null
  triageStatus: TriageStatus
}

export type TriageDraft = {
  patientId: string
  encounterId: string
  chiefComplaint: string
  symptomDescription: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  heartRate: string
  temperature: string
  temperatureUnit: 'celsius' | 'fahrenheit'
  respiratoryRate: string
  oxygenSaturation: string
  weight: string
  height: string
  painScore: string
  allergies: string
  existingConditions: string
  initialObservations: string
  clinicalNotes: string
}

export const emptyTriageDraft: TriageDraft = {
  patientId: '',
  encounterId: '',
  chiefComplaint: '',
  symptomDescription: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  heartRate: '',
  temperature: '',
  temperatureUnit: 'celsius',
  respiratoryRate: '',
  oxygenSaturation: '',
  weight: '',
  height: '',
  painScore: '',
  allergies: '',
  existingConditions: '',
  initialObservations: '',
  clinicalNotes: '',
}

// Fictional sample triage assessments for demonstration
export const sampleTriageAssessments: TriageAssessment[] = [
  {
    id: 'DEMO-TRIAGE-001',
    patientId: 'ORH-2026-00124',
    patientName: 'Hana Mohammed',
    encounterId: 'DEMO-ENC-401',
    arrivalTime: '2026-01-11T08:30:00Z',
    chiefComplaint: 'Persistent cough and fever',
    symptomDescription: 'Dry cough for 3 days, fever started yesterday evening',
    vitalSigns: null,
    allergies: [],
    existingConditions: [],
    initialObservations: '',
    clinicalNotes: '',
    status: 'waiting-for-triage',
    priority: 'routine',
    assignedNurse: '',
    assessmentStartTime: null,
    assessmentCompletedTime: null,
    lastModified: '2026-01-11T08:30:00Z',
  },
  {
    id: 'DEMO-TRIAGE-002',
    patientId: 'ORH-2026-00125',
    patientName: 'Ahmed Hassan',
    encounterId: 'DEMO-ENC-402',
    arrivalTime: '2026-01-11T08:45:00Z',
    chiefComplaint: 'Chest pain',
    symptomDescription: 'Sharp chest pain on left side, started 2 hours ago',
    vitalSigns: {
      bloodPressureSystolic: 145,
      bloodPressureDiastolic: 92,
      heartRate: 88,
      temperature: 37.1,
      temperatureUnit: 'celsius',
      respiratoryRate: 18,
      oxygenSaturation: 97,
      weight: 78,
      height: 175,
      painScore: 7,
      recordedAt: '2026-01-11T08:50:00Z',
      recordedBy: 'Nurse Demo',
    },
    allergies: ['Penicillin'],
    existingConditions: ['Hypertension'],
    initialObservations: 'Patient appears uncomfortable, holding chest area',
    clinicalNotes: 'Vital signs stable, monitoring required',
    status: 'in-assessment',
    priority: 'urgent',
    assignedNurse: 'Nurse Demo',
    assessmentStartTime: '2026-01-11T08:48:00Z',
    assessmentCompletedTime: null,
    lastModified: '2026-01-11T08:50:00Z',
  },
  {
    id: 'DEMO-TRIAGE-003',
    patientId: 'ORH-2026-00126',
    patientName: 'Fatuma Ali',
    encounterId: 'DEMO-ENC-403',
    arrivalTime: '2026-01-11T09:00:00Z',
    chiefComplaint: 'Routine prenatal check-up',
    symptomDescription: '28 weeks pregnant, scheduled follow-up',
    vitalSigns: {
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 76,
      heartRate: 82,
      temperature: 36.8,
      temperatureUnit: 'celsius',
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: 68,
      height: 162,
      painScore: 0,
      recordedAt: '2026-01-11T09:05:00Z',
      recordedBy: 'Nurse Demo',
    },
    allergies: [],
    existingConditions: [],
    initialObservations: 'Patient appears comfortable, no distress noted',
    clinicalNotes: 'Routine prenatal assessment, all vitals within normal range',
    status: 'assessment-completed',
    priority: 'routine',
    assignedNurse: 'Nurse Demo',
    assessmentStartTime: '2026-01-11T09:02:00Z',
    assessmentCompletedTime: '2026-01-11T09:10:00Z',
    lastModified: '2026-01-11T09:10:00Z',
  },
  {
    id: 'DEMO-TRIAGE-004',
    patientId: 'ORH-2026-00127',
    patientName: 'Dawit Bekele',
    encounterId: 'DEMO-ENC-404',
    arrivalTime: '2026-01-11T09:15:00Z',
    chiefComplaint: 'Severe headache and dizziness',
    symptomDescription: 'Sudden onset severe headache, dizziness when standing',
    vitalSigns: null,
    allergies: [],
    existingConditions: [],
    initialObservations: '',
    clinicalNotes: '',
    status: 'waiting-for-triage',
    priority: 'urgent',
    assignedNurse: '',
    assessmentStartTime: null,
    assessmentCompletedTime: null,
    lastModified: '2026-01-11T09:15:00Z',
  },
  {
    id: 'DEMO-TRIAGE-005',
    patientId: 'ORH-2026-00128',
    patientName: 'Sara Tesfaye',
    encounterId: 'DEMO-ENC-405',
    arrivalTime: '2026-01-11T09:20:00Z',
    chiefComplaint: 'Follow-up diabetes management',
    symptomDescription: 'Scheduled diabetes follow-up, blood sugar monitoring',
    vitalSigns: null,
    allergies: [],
    existingConditions: ['Type 2 Diabetes'],
    initialObservations: '',
    clinicalNotes: '',
    status: 'waiting-for-triage',
    priority: 'routine',
    assignedNurse: '',
    assessmentStartTime: null,
    assessmentCompletedTime: null,
    lastModified: '2026-01-11T09:20:00Z',
  },
]

export function triageStatusLabel(status: TriageStatus): string {
  const map: Record<TriageStatus, string> = {
    'waiting-for-triage': 'Waiting for Triage',
    'in-assessment': 'In Assessment',
    'assessment-completed': 'Assessment Completed',
    'needs-review': 'Needs Review',
    'urgent-escalation': 'Urgent Escalation',
  }
  return map[status] ?? status
}

export function priorityLabel(priority: Priority): string {
  const map: Record<Priority, string> = {
    routine: 'Routine',
    urgent: 'Urgent',
    emergency: 'Emergency',
  }
  return map[priority] ?? priority
}

export function calculateWaitTime(arrivalTime: string, now: Date = new Date()): string {
  const arrival = new Date(arrivalTime)
  const diffMs = now.getTime() - arrival.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return '< 1 min'
  if (diffMins < 60) return `${diffMins} min`
  
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function timeDisplay(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function dateDisplay(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function filterTriageQueue(
  assessments: TriageAssessment[],
  search: string,
  statusFilter: TriageStatus | 'all',
  priorityFilter: Priority | 'all',
): TriageAssessment[] {
  return assessments.filter((assessment) => {
    const matchesSearch =
      !search ||
      assessment.patientName.toLowerCase().includes(search.toLowerCase()) ||
      assessment.patientId.toLowerCase().includes(search.toLowerCase()) ||
      assessment.chiefComplaint.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || assessment.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })
}

export function validateTriageDraft(draft: TriageDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!draft.chiefComplaint.trim()) {
    errors.chiefComplaint = 'Chief complaint is required'
  }
  
  // Validate vital signs if provided
  if (draft.bloodPressureSystolic && (isNaN(Number(draft.bloodPressureSystolic)) || Number(draft.bloodPressureSystolic) < 50 || Number(draft.bloodPressureSystolic) > 250)) {
    errors.bloodPressureSystolic = 'Enter a valid systolic BP (50-250 mmHg)'
  }
  
  if (draft.bloodPressureDiastolic && (isNaN(Number(draft.bloodPressureDiastolic)) || Number(draft.bloodPressureDiastolic) < 30 || Number(draft.bloodPressureDiastolic) > 150)) {
    errors.bloodPressureDiastolic = 'Enter a valid diastolic BP (30-150 mmHg)'
  }
  
  if (draft.heartRate && (isNaN(Number(draft.heartRate)) || Number(draft.heartRate) < 30 || Number(draft.heartRate) > 220)) {
    errors.heartRate = 'Enter a valid heart rate (30-220 bpm)'
  }
  
  if (draft.temperature && (isNaN(Number(draft.temperature)) || Number(draft.temperature) < 30 || Number(draft.temperature) > 45)) {
    errors.temperature = 'Enter a valid temperature (30-45°C)'
  }
  
  if (draft.respiratoryRate && (isNaN(Number(draft.respiratoryRate)) || Number(draft.respiratoryRate) < 5 || Number(draft.respiratoryRate) > 60)) {
    errors.respiratoryRate = 'Enter a valid respiratory rate (5-60 breaths/min)'
  }
  
  if (draft.oxygenSaturation && (isNaN(Number(draft.oxygenSaturation)) || Number(draft.oxygenSaturation) < 50 || Number(draft.oxygenSaturation) > 100)) {
    errors.oxygenSaturation = 'Enter a valid oxygen saturation (50-100%)'
  }
  
  if (draft.painScore && (isNaN(Number(draft.painScore)) || Number(draft.painScore) < 0 || Number(draft.painScore) > 10)) {
    errors.painScore = 'Enter a valid pain score (0-10)'
  }
  
  return errors
}

export function hasUnsavedChanges(draft: TriageDraft): boolean {
  return (
    draft.chiefComplaint.trim() !== '' ||
    draft.symptomDescription.trim() !== '' ||
    draft.bloodPressureSystolic !== '' ||
    draft.bloodPressureDiastolic !== '' ||
    draft.heartRate !== '' ||
    draft.temperature !== '' ||
    draft.respiratoryRate !== '' ||
    draft.oxygenSaturation !== '' ||
    draft.weight !== '' ||
    draft.height !== '' ||
    draft.painScore !== '' ||
    draft.allergies.trim() !== '' ||
    draft.existingConditions.trim() !== '' ||
    draft.initialObservations.trim() !== '' ||
    draft.clinicalNotes.trim() !== ''
  )
}
