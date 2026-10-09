import { useEffect, useState } from "react"
import Icon from "../Icon"
import { AccessDeniedPage } from "../permissions/components"
import { Button, Heading, Text } from "../permissions/ui"
import {
  birthDisplay,
  dateLabel,
  displayName,
  sampleActivity,
  sampleAppointments,
  sampleEncounters,
  sampleProfile,
  type ActivityEvent,
  type AppointmentRecord,
  type EncounterRecord,
  type PatientRecord,
} from "./model"
import {
  ActivityTimeline,
  AppointmentsList,
  DemographicsTab,
  EncountersList,
  LoadingState,
  OverviewTab,
  PatientActionArea,
  PatientHeader,
  PatientNotFound,
  PatientProfileError,
  PatientProfileNavigation,
  RestrictedSectionState,
  SessionExpiredState,
} from "./components"
import "./patient-profile.css"

export type ProfileTab =
  | "overview"
  | "demographics"
  | "appointments"
  | "encounters"
  | "clinical"
  | "laboratory"
  | "prescriptions"
  | "billing"

type ProfileState =
  | "ready"
  | "loading"
  | "error"
  | "not-found"
  | "expired"
  | "restricted"

export default function PatientProfilePage({
  state,
  patientId,
  permissions,
  onNavigate,
  onReady,
}: {
  state: ProfileState
  patientId: string
  permissions: Set<string>
  onNavigate: (id: string) => void
  onReady: () => void
}) {
  const [tab, setTab] = useState<ProfileTab>("overview")
  const [patient, setPatient] = useState<PatientRecord | null>(sampleProfile)
  const [appointments, setAppointments] =
    useState<AppointmentRecord[]>(sampleAppointments)
  const [encounters, setEncounters] =
    useState<EncounterRecord[]>(sampleEncounters)
  const [activity, setActivity] = useState<ActivityEvent[]>(sampleActivity)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setEditing(false)
  }, [state])

  if (state === "expired") return <SessionExpiredState />

  if (state === "restricted" || !permissions.has("directory"))
    return (
      <AccessDeniedPage
        onBack={() => onNavigate("directory")}
        onHome={() => onNavigate("home")}
      />
    )

  if (state === "not-found")
    return (
      <PatientNotFound
        patientId={patientId}
        onBack={() => onNavigate("directory")}
        onHome={() => onNavigate("home")}
      />
    )

  if (state === "error")
    return (
      <PatientProfileError
        onRetry={onReady}
        onBack={() => onNavigate("directory")}
      />
    )

  if (state === "loading" || !patient) return <LoadingState />

  const availableTabs: ProfileTab[] = ["overview", "demographics"]
  if (permissions.has("appointments")) availableTabs.push("appointments")
  if (permissions.has("encounters")) availableTabs.push("encounters")
  if (permissions.has("clinical-records")) availableTabs.push("clinical")
  if (permissions.has("laboratory")) availableTabs.push("laboratory")
  if (permissions.has("prescriptions")) availableTabs.push("prescriptions")
  if (permissions.has("billing")) availableTabs.push("billing")

  const currentTab = availableTabs.includes(tab) ? tab : "overview"

  return (
    <div className="patient-profile-page">
      <div className="patient-profile-breadcrumb">
        <Button
          className="breadcrumb-link"
          onClick={() => onNavigate("home")}
          aria-label="Workspace home"
        >
          Workspace
        </Button>
        <Icon name="chevron" size={13} />
        <Button className="breadcrumb-link" onClick={() => onNavigate("home")}>
          Patient Operations
        </Button>
        <Icon name="chevron" size={13} />
        <Button
          className="breadcrumb-link"
          onClick={() => onNavigate("directory")}
        >
          Patient Directory
        </Button>
        <Icon name="chevron" size={13} />
        <span>Patient Profile</span>
      </div>

      <PatientHeader patient={patient} />

      <PatientActionArea
        permissions={permissions}
        editing={editing}
        onEdit={() => setEditing(true)}
        onSchedule={() => onNavigate("appointments")}
        onViewAppointments={() => setTab("appointments")}
        onStartVisit={() => onNavigate("queue")}
      />

      <PatientProfileNavigation
        current={currentTab}
        available={availableTabs}
        onChange={setTab}
      />

      <div className="patient-profile-demo-note">
        <Icon name="shield" size={14} />
        <span>
          Fictional demonstration record · DEMO-EX-101 · No real patient data
          displayed
        </span>
      </div>

      <div className="patient-profile-content">
        {currentTab === "overview" && (
          <OverviewTab
            patient={patient}
            activity={activity}
            permissions={permissions}
            onEditDemographics={() => {
              setTab("demographics")
              setEditing(true)
            }}
            onViewActivity={() => {}}
          />
        )}

        {currentTab === "demographics" && (
          <DemographicsTab
            patient={patient}
            editing={editing}
            permissions={permissions}
            onEdit={() => setEditing(true)}
            onSave={(updated) => {
              setPatient(updated)
              setEditing(false)
              onReady()
            }}
            onCancel={() => setEditing(false)}
          />
        )}

        {currentTab === "appointments" && (
          <>
            {permissions.has("appointments") ? (
              <AppointmentsList
                appointments={appointments}
                onOpen={(appointment) => {}}
                onNavigate={() => onNavigate("appointments")}
              />
            ) : (
              <RestrictedSectionState section="Appointments" />
            )}
          </>
        )}

        {currentTab === "encounters" && (
          <>
            {permissions.has("encounters") ? (
              <EncountersList
                encounters={encounters}
                onOpen={(encounter) => {}}
              />
            ) : (
              <RestrictedSectionState section="Encounters" />
            )}
          </>
        )}

        {currentTab === "clinical" && (
          <>
            {permissions.has("clinical-records") ? (
              <div className="patient-profile-placeholder">
                <Icon name="info" size={22} />
                <Heading level={3}>Clinical history overview</Heading>
                <Text>
                  Clinical history, diagnoses, allergies, and treatment plans
                  linked to encounters. This section awaits hospital policy
                  approval.
                </Text>
              </div>
            ) : (
              <RestrictedSectionState section="Clinical History" />
            )}
          </>
        )}

        {currentTab === "laboratory" && (
          <>
            {permissions.has("laboratory") ? (
              <div className="patient-profile-placeholder">
                <Icon name="flask" size={22} />
                <Heading level={3}>Laboratory summary</Heading>
                <Text>
                  Authorized laboratory orders and results. Keep orders distinct
                  from completed results.
                </Text>
              </div>
            ) : (
              <RestrictedSectionState section="Laboratory" />
            )}
          </>
        )}

        {currentTab === "prescriptions" && (
          <>
            {permissions.has("prescriptions") ? (
              <div className="patient-profile-placeholder">
                <Icon name="pill" size={22} />
                <Heading level={3}>Prescriptions summary</Heading>
                <Text>
                  Authorized prescription records. Keep prescription creation
                  separate from dispensing.
                </Text>
              </div>
            ) : (
              <RestrictedSectionState section="Prescriptions" />
            )}
          </>
        )}

        {currentTab === "billing" && (
          <>
            {permissions.has("billing") ? (
              <div className="patient-profile-placeholder">
                <Icon name="info" size={22} />
                <Heading level={3}>Billing summary</Heading>
                <Text>
                  Financial records including invoices, payments, and
                  outstanding balances. Only information authorized for your
                  role.
                </Text>
              </div>
            ) : (
              <RestrictedSectionState section="Billing" />
            )}
          </>
        )}
      </div>

      <details className="patient-profile-notes">
        <summary>
          <Icon name="info" size={15} />
          Prompt 20 · Patient Profile & Unified Record
          <Icon name="chevron" size={14} />
        </summary>
        <Heading level={3}>Unified patient record with distinct concepts</Heading>
        <Text>
          Patient identity remains separate from appointments, encounters, and
          clinical records. Each encounter is a distinct visit with its own
          history. Missing information is not fabricated. All data shown is
          fictional and for design preview only.
        </Text>
        <Text>
          Backend services must independently authorize every profile access,
          enforce permissions per tab, and validate demographic changes.
          Clinical information must remain linked to source encounters. No
          automatic record merging.
        </Text>
      </details>
    </div>
  )
}
