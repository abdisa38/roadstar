import type { IconName } from "../Icon"
import { patients as directoryPatients, type DirectoryPatient } from "../patient-directory/model"

export type RecordStatus = "Active Demographic Record" | "Pending Verification" | "Archived"

export type DemographicData = {
  id: string
  given: string
  family: string
  fullName: string
  birthMode: "date" | "age" | "unknown"
  dob?: string
  estimatedAge?: number
  ageBasis?: "estimated" | "reported"
  demographicCategory: "Adult" | "Pediatric" | "Maternal" | "Adolescent" | "Unspecified"
  phone: string
  maskedPhone: string
  phoneToken: string
  alternatePhone?: string
  email?: string
  residence: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  registrationDate: string
  registeringFacility: string
  registeringOfficer?: string
  recordStatus: RecordStatus
  possibleDuplicate?: boolean
  duplicateNote?: string
}

export type AppointmentStatus = "Scheduled" | "Confirmed" | "Completed" | "Cancelled"

export type PatientAppointment = {
  id: string
  patientId: string
  date: string
  time: string
  service: string
  department: string
  clinician: string
  status: AppointmentStatus
  visitType: "Scheduled consultation" | "Follow-up check" | "Specialist review"
  notes?: string
}

export type EncounterStatus = "Completed" | "In Progress" | "Closed"

export type PatientEncounter = {
  id: string
  patientId: string
  date: string
  time: string
  type: "Outpatient Consultation" | "Follow-up Visit" | "Triage Assessment" | "Specialist Consultation"
  department: string
  clinician: string
  status: EncounterStatus
  reasonForVisit: string
  assessment: string
  clinicalNotes: string
  vitals?: {
    bp?: string
    heartRate?: string
    temperature?: string
    weight?: string
  }
  associatedOrders?: string[]
}

export type ClinicalDiagnosis = {
  encounterId: string
  encounterDate: string
  condition: string
  type: "Primary" | "Secondary"
  clinician: string
  status: "Active" | "Resolved" | "Managed"
}

export type ClinicalRecord = {
  patientId: string
  allergies: string[]
  diagnoses: ClinicalDiagnosis[]
  generalNotes: string
}

export type LabOrderStatus = "Sample Collected" | "In Analysis" | "Result Available" | "Pending Review"

export type PatientLabRecord = {
  id: string
  patientId: string
  encounterId?: string
  orderDate: string
  testName: string
  category: "Hematology" | "Biochemistry" | "Microbiology" | "Parasitology"
  orderingClinician: string
  status: LabOrderStatus
  resultDate?: string
  resultValue?: string
  referenceRange?: string
  flag?: "Normal" | "Elevated" | "Low"
}

export type PrescriptionStatus = "Prescribed" | "Dispensed" | "Pending Dispensing"

export type PatientPrescription = {
  id: string
  patientId: string
  encounterId?: string
  prescribedDate: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  prescribingClinician: string
  status: PrescriptionStatus
  dispensedDate?: string
  dispensingPharmacist?: string
}

export type BillingStatus = "Paid" | "Pending Payment" | "Receipt Issued"

export type PatientBillingItem = {
  id: string
  patientId: string
  encounterId?: string
  date: string
  serviceDescription: string
  amountEtb: number
  status: BillingStatus
  receiptNumber?: string
  cashierName?: string
}

export type ActivityEventType =
  | "appointment"
  | "encounter"
  | "lab"
  | "prescription"
  | "billing"
  | "registration"
  | "demographics"

export type ActivityEvent = {
  id: string
  type: ActivityEventType
  date: string
  time: string
  title: string
  description: string
  badge: string
  badgeVariant: "default" | "success" | "warning" | "info"
  actor?: string
  referenceId?: string
}

export type UnifiedPatientProfile = {
  demographics: DemographicData
  appointments: PatientAppointment[]
  encounters: PatientEncounter[]
  clinical: ClinicalRecord
  laboratory: PatientLabRecord[]
  prescriptions: PatientPrescription[]
  billing: PatientBillingItem[]
  activity: ActivityEvent[]
}

// -------------------------------------------------------------
// FICTIONAL DEMONSTRATION PROFILES
// -------------------------------------------------------------

export const sampleProfileHana: UnifiedPatientProfile = {
  demographics: {
    id: "DEMO-EX-101",
    given: "Hana",
    family: "Example",
    fullName: "Hana Example",
    birthMode: "date",
    dob: "1998-04-12",
    estimatedAge: 28,
    demographicCategory: "Adult",
    phone: "+251 91 100 0101",
    maskedPhone: "••• ••• 0101",
    phoneToken: "0000000101",
    alternatePhone: "+251 92 200 0101",
    email: "hana.example@demo.orhims.et",
    residence: "Kebele 02, Bale Robe, Oromia, Ethiopia",
    emergencyContact: {
      name: "Tola Example",
      relationship: "Spouse",
      phone: "+251 91 100 0999",
    },
    registrationDate: "2026-06-17",
    registeringFacility: "Oda Roba Hospital",
    registeringOfficer: "Receptionist DEMO-STAFF-04",
    recordStatus: "Active Demographic Record",
    possibleDuplicate: true,
    duplicateNote: "Name similarity detected with DEMO-EX-102 (Hana Additional Example). Verify identity attributes before clinical updates.",
  },
  appointments: [
    {
      id: "APT-2026-101",
      patientId: "DEMO-EX-101",
      date: "2026-06-25",
      time: "09:30",
      service: "Outpatient General Consultation",
      department: "General Medicine",
      clinician: "Dr. Aster Example",
      status: "Scheduled",
      visitType: "Scheduled consultation",
      notes: "Follow-up review for recent outpatient consultation.",
    },
    {
      id: "APT-2026-088",
      patientId: "DEMO-EX-101",
      date: "2026-06-18",
      time: "08:45",
      service: "General Medicine Consultation",
      department: "General Medicine",
      clinician: "Dr. Gemechu Example",
      status: "Completed",
      visitType: "Scheduled consultation",
      notes: "Initial consultation completed.",
    },
  ],
  encounters: [
    {
      id: "ENC-2026-088",
      patientId: "DEMO-EX-101",
      date: "2026-06-18",
      time: "09:00",
      type: "Outpatient Consultation",
      department: "General Medicine",
      clinician: "Dr. Gemechu Example",
      status: "Completed",
      reasonForVisit: "Persistent mild headache and routine health evaluation.",
      assessment: "Tension headache with mild dehydration; normal neurological exam.",
      clinicalNotes: "Patient evaluated in OPD Room 3. Vitals stable. Encouraged adequate hydration and rest. Prescribed symptomatic relief. Advised to return if symptoms persist.",
      vitals: {
        bp: "118/76 mmHg",
        heartRate: "72 bpm",
        temperature: "36.7 °C",
        weight: "58 kg",
      },
      associatedOrders: ["LAB-2026-088-A", "RX-2026-088-1"],
    },
    {
      id: "ENC-2026-042",
      patientId: "DEMO-EX-101",
      date: "2026-05-10",
      time: "10:15",
      type: "Triage Assessment",
      department: "Outpatient Triage",
      clinician: "Nurse Chaltu Example",
      status: "Closed",
      reasonForVisit: "Seasonal allergy evaluation.",
      assessment: "Mild allergic rhinitis; no respiratory distress.",
      clinicalNotes: "Observations recorded. Referred to outpatient physician for antihistamine guidance.",
      vitals: {
        bp: "120/80 mmHg",
        heartRate: "76 bpm",
        temperature: "36.8 °C",
        weight: "58 kg",
      },
    },
  ],
  clinical: {
    patientId: "DEMO-EX-101",
    allergies: ["No known drug allergies (NKDA)"],
    diagnoses: [
      {
        encounterId: "ENC-2026-088",
        encounterDate: "2026-06-18",
        condition: "Tension-type headache",
        type: "Primary",
        clinician: "Dr. Gemechu Example",
        status: "Managed",
      },
      {
        encounterId: "ENC-2026-042",
        encounterDate: "2026-05-10",
        condition: "Mild allergic rhinitis",
        type: "Secondary",
        clinician: "Nurse Chaltu Example",
        status: "Resolved",
      },
    ],
    generalNotes: "Historical records linked to encounter context. Clinical findings require authorized physician verification.",
  },
  laboratory: [
    {
      id: "LAB-2026-088-A",
      patientId: "DEMO-EX-101",
      encounterId: "ENC-2026-088",
      orderDate: "2026-06-18",
      testName: "Complete Blood Count (CBC)",
      category: "Hematology",
      orderingClinician: "Dr. Gemechu Example",
      status: "Result Available",
      resultDate: "2026-06-18",
      resultValue: "Hb: 13.8 g/dL, WBC: 6.4 x10³/µL, Plt: 240 x10³/µL",
      referenceRange: "Hb: 12.0–15.5 g/dL",
      flag: "Normal",
    },
    {
      id: "LAB-2026-092-B",
      patientId: "DEMO-EX-101",
      orderDate: "2026-06-25",
      testName: "Serum Electrolytes Panel",
      category: "Biochemistry",
      orderingClinician: "Dr. Aster Example",
      status: "Sample Collected",
      referenceRange: "Standard reference range",
    },
  ],
  prescriptions: [
    {
      id: "RX-2026-088-1",
      patientId: "DEMO-EX-101",
      encounterId: "ENC-2026-088",
      prescribedDate: "2026-06-18",
      medication: "Paracetamol 500mg tablets",
      dosage: "500 mg",
      frequency: "1 tablet by mouth every 8 hours as needed",
      duration: "3 days",
      prescribingClinician: "Dr. Gemechu Example",
      status: "Dispensed",
      dispensedDate: "2026-06-18",
      dispensingPharmacist: "Pharmacist Bekele Example",
    },
  ],
  billing: [
    {
      id: "INV-2026-104",
      patientId: "DEMO-EX-101",
      encounterId: "ENC-2026-088",
      date: "2026-06-18",
      serviceDescription: "Outpatient General Consultation & CBC Analysis",
      amountEtb: 250,
      status: "Paid",
      receiptNumber: "RCPT-2026-9041",
      cashierName: "Cashier Meron Example",
    },
  ],
  activity: [
    {
      id: "ACT-01",
      type: "appointment",
      date: "2026-06-18",
      time: "10:30",
      title: "Appointment scheduled",
      description: "Follow-up consultation booked for 25 Jun 2026 with Dr. Aster Example.",
      badge: "Scheduled",
      badgeVariant: "info",
      actor: "Reception Desk",
      referenceId: "APT-2026-101",
    },
    {
      id: "ACT-02",
      type: "prescription",
      date: "2026-06-18",
      time: "10:15",
      title: "Medication dispensed",
      description: "Paracetamol 500mg dispensed by Pharmacy.",
      badge: "Dispensed",
      badgeVariant: "success",
      actor: "Pharmacist Bekele",
      referenceId: "RX-2026-088-1",
    },
    {
      id: "ACT-03",
      type: "lab",
      date: "2026-06-18",
      time: "10:00",
      title: "Lab result verified",
      description: "Complete Blood Count (CBC) reported within normal reference limits.",
      badge: "Result Ready",
      badgeVariant: "success",
      actor: "Lab Dept.",
      referenceId: "LAB-2026-088-A",
    },
    {
      id: "ACT-04",
      type: "billing",
      date: "2026-06-18",
      time: "09:30",
      title: "Payment recorded",
      description: "Receipt RCPT-2026-9041 issued for Outpatient Consultation (250 ETB).",
      badge: "Paid",
      badgeVariant: "success",
      actor: "Cashier Desk",
      referenceId: "INV-2026-104",
    },
    {
      id: "ACT-05",
      type: "encounter",
      date: "2026-06-18",
      time: "09:00",
      title: "Outpatient encounter completed",
      description: "Consultation conducted by Dr. Gemechu Example in General Medicine.",
      badge: "Completed",
      badgeVariant: "default",
      actor: "Dr. Gemechu Example",
      referenceId: "ENC-2026-088",
    },
    {
      id: "ACT-06",
      type: "registration",
      date: "2026-06-17",
      time: "14:20",
      title: "Demographic registration created",
      description: "Master demographic profile initialized at Oda Roba Hospital reception.",
      badge: "Registered",
      badgeVariant: "default",
      actor: "Reception Desk",
      referenceId: "DEMO-EX-101",
    },
  ],
}

export const sampleProfileDawit: UnifiedPatientProfile = {
  demographics: {
    id: "DEMO-EX-103",
    given: "Dawit",
    family: "Example",
    fullName: "Dawit Example",
    birthMode: "date",
    dob: "1988-03-12",
    estimatedAge: 38,
    demographicCategory: "Adult",
    phone: "+251 91 100 0103",
    maskedPhone: "••• ••• 0103",
    phoneToken: "0000000103",
    residence: "Kebele 04, Bale Robe, Oromia, Ethiopia",
    emergencyContact: {
      name: "Desta Example",
      relationship: "Brother",
      phone: "+251 91 100 0777",
    },
    registrationDate: "2026-06-15",
    registeringFacility: "Oda Roba Hospital",
    registeringOfficer: "Receptionist DEMO-STAFF-02",
    recordStatus: "Active Demographic Record",
    possibleDuplicate: false,
  },
  appointments: [
    {
      id: "APT-2026-077",
      patientId: "DEMO-EX-103",
      date: "2026-06-20",
      time: "11:00",
      service: "Cardiology Review",
      department: "Internal Medicine",
      clinician: "Dr. Aster Example",
      status: "Scheduled",
      visitType: "Specialist review",
    },
  ],
  encounters: [
    {
      id: "ENC-2026-071",
      patientId: "DEMO-EX-103",
      date: "2026-06-15",
      time: "11:30",
      type: "Outpatient Consultation",
      department: "General Medicine",
      clinician: "Dr. Gemechu Example",
      status: "Completed",
      reasonForVisit: "Routine cardiovascular screening.",
      assessment: "Blood pressure well controlled on lifestyle measures.",
      clinicalNotes: "Patient reports no chest discomfort. Advised to continue low-sodium diet and follow up in one month.",
      vitals: {
        bp: "124/82 mmHg",
        heartRate: "68 bpm",
        temperature: "36.6 °C",
        weight: "74 kg",
      },
    },
  ],
  clinical: {
    patientId: "DEMO-EX-103",
    allergies: ["Penicillin (reported mild rash)"],
    diagnoses: [
      {
        encounterId: "ENC-2026-071",
        encounterDate: "2026-06-15",
        condition: "Essential hypertension (mild/managed)",
        type: "Primary",
        clinician: "Dr. Gemechu Example",
        status: "Managed",
      },
    ],
    generalNotes: "Patient has documented penicillin sensitivity. All prescribing staff should take note.",
  },
  laboratory: [
    {
      id: "LAB-2026-071-L",
      patientId: "DEMO-EX-103",
      encounterId: "ENC-2026-071",
      orderDate: "2026-06-15",
      testName: "Lipid Profile",
      category: "Biochemistry",
      orderingClinician: "Dr. Gemechu Example",
      status: "Result Available",
      resultDate: "2026-06-15",
      resultValue: "Total Chol: 185 mg/dL, HDL: 48 mg/dL, LDL: 110 mg/dL",
      referenceRange: "Total Chol < 200 mg/dL",
      flag: "Normal",
    },
  ],
  prescriptions: [],
  billing: [
    {
      id: "INV-2026-071",
      patientId: "DEMO-EX-103",
      encounterId: "ENC-2026-071",
      date: "2026-06-15",
      serviceDescription: "Cardiovascular Screening & Lipid Profile",
      amountEtb: 320,
      status: "Paid",
      receiptNumber: "RCPT-2026-8812",
      cashierName: "Cashier Meron Example",
    },
  ],
  activity: [
    {
      id: "ACT-D1",
      type: "appointment",
      date: "2026-06-15",
      time: "12:10",
      title: "Cardiology follow-up scheduled",
      description: "Review appointment booked for 20 Jun 2026 with Dr. Aster Example.",
      badge: "Scheduled",
      badgeVariant: "info",
      actor: "Reception Desk",
      referenceId: "APT-2026-077",
    },
    {
      id: "ACT-D2",
      type: "encounter",
      date: "2026-06-15",
      time: "11:30",
      title: "Outpatient Consultation completed",
      description: "Cardiovascular review completed by Dr. Gemechu Example.",
      badge: "Completed",
      badgeVariant: "default",
      actor: "Dr. Gemechu Example",
      referenceId: "ENC-2026-071",
    },
  ],
}

export const sampleProfileIncomplete: UnifiedPatientProfile = {
  demographics: {
    id: "DEMO-EX-102",
    given: "Hana",
    family: "Additional Example",
    fullName: "Hana Additional Example",
    birthMode: "unknown",
    demographicCategory: "Adult",
    phone: "",
    maskedPhone: "No contact recorded",
    phoneToken: "",
    residence: "Example locality B, Bale Robe, Oromia",
    registrationDate: "2026-05-28",
    registeringFacility: "Oda Roba Hospital",
    recordStatus: "Active Demographic Record",
    possibleDuplicate: true,
    duplicateNote: "Possible duplicate match with DEMO-EX-101 (Hana Example). Multi-attribute review recommended.",
  },
  appointments: [],
  encounters: [],
  clinical: {
    patientId: "DEMO-EX-102",
    allergies: ["No allergies recorded"],
    diagnoses: [],
    generalNotes: "Initial demographic record created with minimal fields. Clinical assessments pending.",
  },
  laboratory: [],
  prescriptions: [],
  billing: [],
  activity: [
    {
      id: "ACT-I1",
      type: "registration",
      date: "2026-05-28",
      time: "09:15",
      title: "Demographic registration created",
      description: "Minimal registration recorded. Phone and birth date were not provided.",
      badge: "Incomplete",
      badgeVariant: "warning",
      actor: "Reception Desk",
      referenceId: "DEMO-EX-102",
    },
  ],
}

export const sampleProfilesMap: Record<string, UnifiedPatientProfile> = {
  "DEMO-EX-101": sampleProfileHana,
  "DEMO-EX-102": sampleProfileIncomplete,
  "DEMO-EX-103": sampleProfileDawit,
}

export function getProfileById(id: string): UnifiedPatientProfile | null {
  if (sampleProfilesMap[id]) return sampleProfilesMap[id]

  // Fallback to synthesizing a clean fixture from directory patient list
  const dirMatch = directoryPatients.find((p) => p.id === id)
  if (!dirMatch) return null

  const parts = dirMatch.name.split(" ")
  const given = parts[0] || "Patient"
  const family = parts.slice(1).join(" ") || "Example"

  return {
    demographics: {
      id: dirMatch.id,
      given,
      family,
      fullName: dirMatch.name,
      birthMode: dirMatch.birth.includes("-") ? "date" : dirMatch.estimatedAge ? "age" : "unknown",
      dob: dirMatch.birth.includes("-") ? dirMatch.birth : undefined,
      estimatedAge: dirMatch.estimatedAge,
      demographicCategory: "Adult",
      phone: dirMatch.phoneToken ? `+251 91 ${dirMatch.phoneToken.slice(-6)}` : "",
      maskedPhone: dirMatch.contact,
      phoneToken: dirMatch.phoneToken,
      residence: `${dirMatch.residence}, Bale Robe, Oromia`,
      registrationDate: dirMatch.registered,
      registeringFacility: "Oda Roba Hospital",
      recordStatus: "Active Demographic Record",
      possibleDuplicate: false,
    },
    appointments: [],
    encounters: [],
    clinical: {
      patientId: dirMatch.id,
      allergies: ["No allergies recorded"],
      diagnoses: [],
      generalNotes: "Demographic record established. No historical clinical records found for this demonstration entry.",
    },
    laboratory: [],
    prescriptions: [],
    billing: [],
    activity: [
      {
        id: `ACT-${dirMatch.id}`,
        type: "registration",
        date: dirMatch.registered,
        time: "09:00",
        title: "Demographic record created",
        description: "Registered at Oda Roba Hospital reception.",
        badge: "Registered",
        badgeVariant: "default",
        actor: "Reception Desk",
        referenceId: dirMatch.id,
      },
    ],
  }
}
