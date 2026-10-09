import { useEffect, useState } from "react"
import Icon from "../Icon"
import { AccessDeniedPage } from "../permissions/components"
import { Button, Heading, Text } from "../permissions/ui"
import {
  AppointmentDetailModal,
  AppointmentsTab,
  BillingTab,
  ClinicalHistoryTab,
  DemographicsTab,
  EncounterDetailModal,
  EncountersTab,
  LaboratoryTab,
  OverviewTab,
  PatientIdentityHeader,
  PatientProfileBreadcrumb,
  PatientProfileNavigation,
  PrescriptionsTab,
  type ProfileTab,
} from "./components"
import {
  getProfileById,
  sampleProfileHana,
  type DemographicData,
  type PatientAppointment,
  type PatientEncounter,
  type UnifiedPatientProfile,
} from "./model"
import "./patient-profile.css"

export default function PatientProfilePage({
  patientId = "DEMO-EX-101",
  state,
  permissions,
  onNavigate,
  onReady,
}: {
  patientId?: string
  state: string
  permissions: Set<string>
  onNavigate: (id: string) => void
  onReady: () => void
}) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UnifiedPatientProfile | null>(() => {
    return getProfileById(patientId) || sampleProfileHana
  })

  const [selectedEncounter, setSelectedEncounter] = useState<PatientEncounter | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  useEffect(() => {
    const loaded = getProfileById(patientId) || sampleProfileHana
    setProfile(loaded)
    setIsEditing(false)
    setActiveTab("overview")
  }, [patientId])

  // Handle saving demographic edits
  function handleSaveDemographics(updated: Partial<DemographicData>) {
    if (!profile) return
    const nextDemographics: DemographicData = {
      ...profile.demographics,
      ...updated,
    }

    setProfile({
      ...profile,
      demographics: nextDemographics,
      activity: [
        {
          id: `ACT-${Date.now()}`,
          type: "demographics",
          date: "2026-06-18",
          time: "11:00",
          title: "Demographic record updated",
          description: "Patient identity information modified by authorized staff.",
          badge: "Updated",
          badgeVariant: "info",
          actor: "Reception Desk",
        },
        ...profile.activity,
      ],
    })

    setIsEditing(false)
    setSuccessBanner("Demographic changes successfully saved.")
    setTimeout(() => setSuccessBanner(null), 4000)
  }

  // Permission access check
  if (!permissions.has("directory") && !permissions.has("registration")) {
    return (
      <AccessDeniedPage
        onBack={() => onNavigate("home")}
        onHome={() => onNavigate("home")}
      />
    )
  }

  // Simulated Loading State
  if (state === "loading") {
    return (
      <div className="patient-profile-page" role="status" aria-busy="true">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b" }}>
          <Icon name="clock" size={18} />
          <span>Loading patient record…</span>
        </div>
        <div className="empty-tab-card" style={{ padding: "4rem 2rem" }}>
          <div style={{ width: "60%", height: "1.5rem", background: "#f1f5f9", borderRadius: "0.25rem", marginBottom: "1rem" }} />
          <div style={{ width: "40%", height: "1rem", background: "#f1f5f9", borderRadius: "0.25rem" }} />
        </div>
      </div>
    )
  }

  // Simulated Error State
  if (state === "error") {
    return (
      <div className="patient-profile-page">
        <div className="empty-tab-card" style={{ borderColor: "#fca5a5", background: "#fff5f5" }}>
          <div className="empty-tab-icon" style={{ color: "#e11d48", background: "#fee2e2" }}>
            <Icon name="warning" size={26} />
          </div>
          <Heading level={2}>Patient Profile Retrieval Error</Heading>
          <Text>
            The patient profile data could not be retrieved from the hospital service.
          </Text>
          <Button
            className="button secondary"
            onClick={() => {
              onReady()
            }}
          >
            Retry Retrieval
          </Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="patient-profile-page">
        <div className="empty-tab-card">
          <div className="empty-tab-icon">
            <Icon name="user" size={26} />
          </div>
          <Heading level={2}>Patient Not Found</Heading>
          <Text>
            No patient record with ID “{patientId}” was found in the hospital registry.
          </Text>
          <Button className="button" onClick={() => onNavigate("directory")}>
            Return to Patient Directory
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main id="patient-profile-main" className="patient-profile-page">
      {/* 1. Breadcrumb navigation */}
      <PatientProfileBreadcrumb
        patientName={profile.demographics.fullName}
        onBackToDirectory={() => onNavigate("directory")}
      />

      {/* Success Notification Alert */}
      {successBanner && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
          }}
          role="status"
        >
          <Icon name="check" size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. Identity Header Card */}
      <PatientIdentityHeader
        demographics={profile.demographics}
        permissions={permissions}
        onEdit={() => {
          setActiveTab("demographics")
          setIsEditing(true)
        }}
        onSchedule={() => setActiveTab("appointments")}
        onRegisterVisit={() => setActiveTab("encounters")}
      />

      {/* 3. Profile Navigation Tabs */}
      <PatientProfileNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          setIsEditing(false)
        }}
        counts={{
          appointments: profile.appointments.length,
          encounters: profile.encounters.length,
          labs: profile.laboratory.length,
          prescriptions: profile.prescriptions.length,
          billing: profile.billing.length,
        }}
        permissions={permissions}
      />

      {/* 4. Tab Content Area */}
      <div className="patient-profile-content-body">
        {activeTab === "overview" && (
          <OverviewTab
            profile={profile}
            onNavigateTab={(tab) => {
              setActiveTab(tab)
              setIsEditing(false)
            }}
          />
        )}

        {activeTab === "demographics" && (
          <DemographicsTab
            demographics={profile.demographics}
            isEditing={isEditing}
            onStartEdit={() => setIsEditing(true)}
            onCancelEdit={() => setIsEditing(false)}
            onSave={handleSaveDemographics}
          />
        )}

        {activeTab === "appointments" && (
          <AppointmentsTab
            appointments={profile.appointments}
            onSchedule={() => {
              // Navigates or cues booking
              onNavigate("appointments")
            }}
            onViewAppointment={setSelectedAppointment}
          />
        )}

        {activeTab === "encounters" && (
          <EncountersTab
            encounters={profile.encounters}
            onViewEncounter={setSelectedEncounter}
          />
        )}

        {activeTab === "clinical" && (
          <ClinicalHistoryTab
            clinical={profile.clinical}
            isRestricted={
              !permissions.has("records") && !permissions.has("consultations")
            }
          />
        )}

        {activeTab === "laboratory" && (
          <LaboratoryTab
            labRecords={profile.laboratory}
            isRestricted={
              !permissions.has("lab-orders") && !permissions.has("orders")
            }
          />
        )}

        {activeTab === "prescriptions" && (
          <PrescriptionsTab
            prescriptions={profile.prescriptions}
            isRestricted={
              !permissions.has("prescriptions") &&
              !permissions.has("prescription-queue")
            }
          />
        )}

        {activeTab === "billing" && (
          <BillingTab
            billingItems={profile.billing}
            isRestricted={
              !permissions.has("invoices") && !permissions.has("payments")
            }
          />
        )}
      </div>

      {/* Modals for Drilldown */}
      {selectedEncounter && (
        <EncounterDetailModal
          encounter={selectedEncounter}
          onClose={() => setSelectedEncounter(null)}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* Expandable Review & Open Decisions */}
      <details className="patient-directory-notes" style={{ marginTop: "1rem" }}>
        <summary>
          <Icon name="info" size={15} />
          Prompt 20 · Patient Profile Interaction Notes & Data Boundaries
          <Icon name="chevron" size={14} />
        </summary>
        <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Heading level={3}>Unified Record Architecture & Data Integrity</Heading>
          <Text>
            <strong>Distinct Concepts:</strong> The patient’s permanent demographic record is strictly decoupled from individual appointments and healthcare encounters. Each visit possesses its own clinical notes, vitals, and diagnoses, preventing data blending across historical episodes.
          </Text>
          <Text>
            <strong>Permission Boundaries:</strong> Non-clinical staff (receptionists, cashiers) are restricted from viewing clinical histories, diagnostic orders, or prescriptions. Financial information (invoices, billing) is partitioned under cashier permissions and never influences clinical triage eligibility.
          </Text>
          <Text>
            <strong>Duplicate Warning:</strong> A dedicated duplicate notice alerts staff when similar identity attributes exist, promoting multi-attribute verification before records are amended. Automatic record merging is strictly prohibited.
          </Text>
        </div>
      </details>
    </main>
  )
}
