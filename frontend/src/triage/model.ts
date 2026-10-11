// Triage assessment workspace model — fictional data only. All names, IDs, clinical values are illustrative.

export type TriageWorkspaceState = 'form' | 'review' | 'completed'

export type AssessmentSection = 
  | 'patient-verification'
  | 'chief-complaint'
  | 'vital-signs'
  | 'clinical-assessment'
  | 'priority-escalation'

export type Priority = 'routine' | 'needs-review' | 'urgent-escalation'

export type AllergyStatus = 'not-recorded' | 'no-known-allergies' | 'allergies-present'

export type TriageFormData = {
  // Patient Identity
  patientId: string
  patientName: string
  encounterId: string
  arrivalTime: string
  age: number | null
  dateOfBirth: string | null
  sex: 'male' | 'female' | 'other' | 'not-recorded'
  
  // Chief Complaint
  chiefComplaint: string
  symptomDescription: string
  symptomOnset: string
  symptomDuration: string
  additionalSymptoms: string
  
  // Vital Signs
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  heartRate: string
  temperature: string
  temperatureUnit: 'celsius' | 'fahrenheit'
  respiratoryRate: string
  oxygenSaturation: string
  weight: string
  height: string
  heightUnit: 'cm' | 'm'
  painScore: string
  
  // Clinical Observations
  generalObservations: string
  clinicalFindings: string
  allergyStatus: AllergyStatus
  documentedAllergies: string
  existingAllergies: string
  existingConditions: string
  nursingNotes: string
  
  // Priority and Escalation
  priority: Priority
  escalationReason: string
  escalationNotes: string
  
  // Metadata
  assignedNurse: string
  startTime: string
  lastModified: string
}

export const emptyTriageForm: TriageFormData = {
  patientId: '',
  patientName: '',
  encounterId: '',
  arrivalTime: '',
  age: null,
  dateOfBirth: null,
  sex: 'not-recorded',
  chiefComplaint: '',
  symptomDescription: '',
  symptomOnset: '',
  symptomDuration: '',
  additionalSymptoms: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  heartRate: '',
  temperature: '',
  temperatureUnit: 'celsius',
  respiratoryRate: '',
  oxygenSaturation: '',
  weight: '',
  height: '',
  heightUnit: 'cm',
  painScore: '',
  generalObservations: '',
  clinicalFindings: '',
  allergyStatus: 'not-recorded',
  documentedAllergies: '',
  existingAllergies: '',
  existingConditions: '',
  nursingNotes: '',
  priority: 'routine',
  escalationReason: '',
  escalationNotes: '',
  assignedNurse: 'Nurse Demo',
  startTime: new Date().toISOString(),
  lastModified: new Date().toISOString(),
}

// Sample patient data for triage workspace
export const samplePatientForTriage = {
  id: 'ORH-2026-00124',
  name: 'Hana Mohammed',
  encounterId: 'ENC-2026-00087',
  arrivalTime: '2026-01-11T09:24:00Z',
  age: 34,
  dateOfBirth: '1991-06-15',
  sex: 'female' as const,
  knownAllergies: ['Penicillin'],
  existingConditions: ['Hypertension'],
}

export function validateSection(
  formData: TriageFormData,
  section: AssessmentSection
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (section === 'patient-verification') {
    if (!formData.patientId) errors.patientId = 'Patient ID is required'
    if (!formData.encounterId) errors.encounterId = 'Encounter ID is required'
  }

  if (section === 'chief-complaint') {
    if (!formData.chiefComplaint.trim()) {
      errors.chiefComplaint = 'Chief complaint is required'
    }
  }

  if (section === 'vital-signs') {
    // Validate blood pressure
    if (formData.bloodPressureSystolic) {
      const systolic = Number(formData.bloodPressureSystolic)
      if (isNaN(systolic) || systolic < 50 || systolic > 250) {
        errors.bloodPressureSystolic = 'Enter a valid systolic BP (50-250 mmHg)'
      }
    }
    
    if (formData.bloodPressureDiastolic) {
      const diastolic = Number(formData.bloodPressureDiastolic)
      if (isNaN(diastolic) || diastolic < 30 || diastolic > 150) {
        errors.bloodPressureDiastolic = 'Enter a valid diastolic BP (30-150 mmHg)'
      }
    }

    // Validate heart rate
    if (formData.heartRate) {
      const hr = Number(formData.heartRate)
      if (isNaN(hr) || hr < 30 || hr > 220) {
        errors.heartRate = 'Enter a valid heart rate (30-220 bpm)'
      }
    }

    // Validate temperature
    if (formData.temperature) {
      const temp = Number(formData.temperature)
      if (isNaN(temp) || temp < 30 || temp > 45) {
        errors.temperature = 'Enter a valid temperature (30-45°C)'
      }
    }

    // Validate respiratory rate
    if (formData.respiratoryRate) {
      const rr = Number(formData.respiratoryRate)
      if (isNaN(rr) || rr < 5 || rr > 60) {
        errors.respiratoryRate = 'Enter a valid respiratory rate (5-60 breaths/min)'
      }
    }

    // Validate oxygen saturation
    if (formData.oxygenSaturation) {
      const spo2 = Number(formData.oxygenSaturation)
      if (isNaN(spo2) || spo2 < 50 || spo2 > 100) {
        errors.oxygenSaturation = 'Enter a valid oxygen saturation (50-100%)'
      }
    }

    // Validate pain score
    if (formData.painScore) {
      const pain = Number(formData.painScore)
      if (isNaN(pain) || pain < 0 || pain > 10) {
        errors.painScore = 'Enter a valid pain score (0-10)'
      }
    }
  }

  if (section === 'clinical-assessment') {
    if (formData.allergyStatus === 'allergies-present' && !formData.documentedAllergies.trim()) {
      errors.documentedAllergies = 'Please document allergies or change status'
    }
  }

  return errors
}

export function validateCompleteAssessment(formData: TriageFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  // Patient verification
  if (!formData.patientId) errors.patientId = 'Patient ID is required'
  if (!formData.encounterId) errors.encounterId = 'Encounter ID is required'

  // Chief complaint is mandatory
  if (!formData.chiefComplaint.trim()) {
    errors.chiefComplaint = 'Chief complaint is required for assessment completion'
  }

  // At least one vital sign should be recorded
  const hasVitalSigns = 
    formData.bloodPressureSystolic ||
    formData.bloodPressureDiastolic ||
    formData.heartRate ||
    formData.temperature ||
    formData.respiratoryRate ||
    formData.oxygenSaturation

  if (!hasVitalSigns) {
    errors.vitalSigns = 'At least one vital sign measurement is required'
  }

  // Validate all entered vital signs
  const vitalErrors = validateSection(formData, 'vital-signs')
  Object.assign(errors, vitalErrors)

  // Allergy documentation
  if (formData.allergyStatus === 'not-recorded') {
    errors.allergyStatus = 'Please document allergy status before completion'
  }

  if (formData.allergyStatus === 'allergies-present' && !formData.documentedAllergies.trim()) {
    errors.documentedAllergies = 'Please document allergies'
  }

  // Escalation validation
  if (formData.priority === 'urgent-escalation' && !formData.escalationReason.trim()) {
    errors.escalationReason = 'Escalation reason is required for urgent cases'
  }

  return errors
}

export function hasUnsavedChanges(formData: TriageFormData): boolean {
  return (
    formData.chiefComplaint.trim() !== '' ||
    formData.symptomDescription.trim() !== '' ||
    formData.bloodPressureSystolic !== '' ||
    formData.bloodPressureDiastolic !== '' ||
    formData.heartRate !== '' ||
    formData.temperature !== '' ||
    formData.respiratoryRate !== '' ||
    formData.oxygenSaturation !== '' ||
    formData.weight !== '' ||
    formData.height !== '' ||
    formData.painScore !== '' ||
    formData.generalObservations.trim() !== '' ||
    formData.clinicalFindings.trim() !== '' ||
    formData.documentedAllergies.trim() !== '' ||
    formData.nursingNotes.trim() !== '' ||
    formData.priority !== 'routine'
  )
}

export function formatPatientAge(age: number | null, dateOfBirth: string | null): string {
  if (age !== null) return `${age} years`
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth)
    const today = new Date()
    const calculatedAge = today.getFullYear() - dob.getFullYear()
    return `${calculatedAge} years`
  }
  return 'Not recorded'
}

export function formatArrivalTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatFullDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getSectionLabel(section: AssessmentSection): string {
  const labels: Record<AssessmentSection, string> = {
    'patient-verification': 'Patient Verification',
    'chief-complaint': 'Chief Complaint',
    'vital-signs': 'Vital Signs',
    'clinical-assessment': 'Clinical Assessment',
    'priority-escalation': 'Priority & Escalation',
  }
  return labels[section]
}

export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    routine: 'Routine',
    'needs-review': 'Needs Clinical Review',
    'urgent-escalation': 'Urgent Escalation',
  }
  return labels[priority]
}

export function getAllergyStatusLabel(status: AllergyStatus): string {
  const labels: Record<AllergyStatus, string> = {
    'not-recorded': 'Not Recorded',
    'no-known-allergies': 'No Known Allergies',
    'allergies-present': 'Allergies Present',
  }
  return labels[status]
}
