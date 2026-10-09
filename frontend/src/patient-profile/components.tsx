import { useState } from "react"
import Icon, { type IconName } from "../Icon"
import { Button, Heading, Input, Select, Text } from "../permissions/ui"
import {
  appointmentStatusLabel,
  birthDisplay,
  dateLabel,
  displayName,
  encounterStatusLabel,
  timeLabel,
  type ActivityEvent,
  type AppointmentRecord,
  type EncounterRecord,
  type PatientRecord,
} from "./model"

// Patient Header Component
export function PatientHeader({ patient }: { patient: PatientRecord }) {
  const birth = birthDisplay(patient)
  return (
    <div className="patient-profile-header">
      <div className="patient-avatar">
        <span>
          {patient.givenName[0]}
          {patient.familyName ? patient.familyName[0] : ""}
        </span>
      </div>
      <div className="patient-identity">
        <div className="patient-name-id">
          <Heading level={1}>{displayName(patient)}</Heading>
          <span className="patient-id-badge">{patient.id}</span>
        </div>
        <div className="patient-demographic-line">
          <span>
            <Icon name="calendar" size={14} />
            {birth.value}
            <small>{birth.detail}</small>
          </span>
          <span>
            <Icon name="phone" size={14} />
            {patient.phone || "Not recorded"}
          </span>
          <span>
            <Icon name="user" size={14} />
            Registered {dateLabel(patient.registered)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Patient Action Area
export function PatientActionArea({
  permissions,
  editing,
  onEdit,
  onSchedule,
  onViewAppointments,
  onStartVisit,
}: {
  permissions: Set<string>
  editing: boolean
  onEdit: () => void
  onSchedule: () => void
  onViewAppointments: () => void
  onStartVisit: () => void
}) {
  return (
    <div className="patient-action-area">
      <div className="patient-actions-primary">
        {permissions.has("registration") && !editing && (
          <Button className="button secondary" onClick={onEdit}>
            <Icon name="edit" size={16} />
            Edit Patient
          </Button>
        )}
        {permissions.has("appointments") && (
          <>
            <Button className="button" onClick={onSchedule}>
              <Icon name="calendar" size={16} />
              Schedule Appointment
            </Button>
            <Button className="button secondary" onClick={onViewAppointments}>
              View Appointments
            </Button>
          </>
        )}
        {permissions.has("queue") && (
          <Button className="button secondary" onClick={onStartVisit}>
            <Icon name="check" size={16} />
            Check In Visit
          </Button>
        )}
      </div>
    </div>
  )
}

// Patient Profile Navigation (Tabs)
export function PatientProfileNavigation({
  current,
  available,
  onChange,
}: {
  current: string
  available: string[]
  onChange: (tab: string) => void
}) {
  const tabs: { id: string; label: string; icon: IconName }[] = [
    { id: "overview", label: "Overview", icon: "info" },
    { id: "demographics", label: "Demographics", icon: "user" },
    { id: "appointments", label: "Appointments", icon: "calendar" },
    { id: "encounters", label: "Encounters", icon: "building" },
    { id: "clinical", label: "Clinical History", icon: "heart" },
    { id: "laboratory", label: "Laboratory", icon: "flask" },
    { id: "prescriptions", label: "Prescriptions", icon: "pill" },
    { id: "billing", label: "Billing", icon: "info" },
  ]

  return (
    <nav className="patient-profile-tabs" aria-label="Patient profile sections">
      <div className="patient-profile-tabs-scroll">
        {tabs
          .filter((tab) => available.includes(tab.id))
          .map((tab) => (
            <Button
              key={tab.id}
              className={current === tab.id ? "is-active" : ""}
              onClick={() => onChange(tab.id)}
              aria-current={current === tab.id ? "page" : undefined}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
            </Button>
          ))}
      </div>
    </nav>
  )
}

// Overview Tab
export function OverviewTab({
  patient,
  activity,
  permissions,
  onEditDemographics,
  onViewActivity,
}: {
  patient: PatientRecord
  activity: ActivityEvent[]
  permissions: Set<string>
  onEditDemographics: () => void
  onViewActivity: () => void
}) {
  const birth = birthDisplay(patient)
  return (
    <div className="overview-tab">
      <div className="overview-left">
        <section className="profile-info-card">
          <div className="profile-card-header">
            <Heading level={2}>Demographic Information</Heading>
            {permissions.has("registration") && (
              <Button className="profile-card-edit" onClick={onEditDemographics}>
                <Icon name="edit" size={14} />
                Edit
              </Button>
            )}
          </div>
          <dl className="profile-info-list">
            <div>
              <dt>Full name</dt>
              <dd>{displayName(patient)}</dd>
            </div>
            <div>
              <dt>Date of birth / Age</dt>
              <dd>
                {birth.value}
                <small>{birth.detail}</small>
              </dd>
            </div>
            <div>
              <dt>Contact phone</dt>
              <dd>{patient.phone || "Not recorded"}</dd>
            </div>
            {patient.alternatePhone && (
              <div>
                <dt>Alternate phone</dt>
                <dd>{patient.alternatePhone}</dd>
              </div>
            )}
            {patient.email && (
              <div>
                <dt>Email</dt>
                <dd>{patient.email}</dd>
              </div>
            )}
            <div>
              <dt>Place of residence</dt>
              <dd>{patient.residence || "Not recorded"}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-info-card">
          <Heading level={2}>Registration Information</Heading>
          <dl className="profile-info-list">
            <div>
              <dt>Patient ID</dt>
              <dd>{patient.id}</dd>
            </div>
            <div>
              <dt>Registration date</dt>
              <dd>{dateLabel(patient.registered)}</dd>
            </div>
            <div>
              <dt>Registered by</dt>
              <dd>{patient.registeredBy}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{dateLabel(patient.lastUpdated)}</dd>
            </div>
          </dl>
        </section>

        {patient.emergencyName && (
          <section className="profile-info-card">
            <Heading level={2}>Emergency Contact</Heading>
            <dl className="profile-info-list">
              <div>
                <dt>Contact name</dt>
                <dd>{patient.emergencyName}</dd>
              </div>
              <div>
                <dt>Relationship</dt>
                <dd>{patient.emergencyRelationship}</dd>
              </div>
              <div>
                <dt>Contact phone</dt>
                <dd>{patient.emergencyPhone}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>

      <div className="overview-right">
        <section className="profile-info-card">
          <Heading level={2}>Recent Activity</Heading>
          <ActivityTimeline events={activity.slice(0, 8)} />
          {activity.length > 8 && (
            <Button className="profile-link-button" onClick={onViewActivity}>
              View all activity
              <Icon name="arrow" size={14} />
            </Button>
          )}
        </section>
      </div>
    </div>
  )
}

// Activity Timeline
export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="activity-empty">
        <Text>No activity recorded for this patient.</Text>
      </div>
    )
  }

  const iconMap: Record<ActivityEvent["kind"], IconName> = {
    appointment: "calendar",
    encounter: "building",
    registration: "user",
    demographic: "edit",
    laboratory: "flask",
    prescription: "pill",
    billing: "info",
  }

  return (
    <div className="activity-timeline">
      {events.map((event) => (
        <div key={event.id} className="activity-event">
          <div className="activity-icon">
            <Icon name={iconMap[event.kind]} size={14} />
          </div>
          <div className="activity-content">
            <strong>{event.label}</strong>
            <span>{event.detail}</span>
            <time>
              {new Date(event.timestamp).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
}

// Demographics Tab
export function DemographicsTab({
  patient,
  editing,
  permissions,
  onEdit,
  onSave,
  onCancel,
}: {
  patient: PatientRecord
  editing: boolean
  permissions: Set<string>
  onEdit: () => void
  onSave: (updated: PatientRecord) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<PatientRecord>(patient)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      onSave({ ...draft, lastUpdated: new Date().toISOString().slice(0, 10) })
      setSaving(false)
    }, 600)
  }

  const birth = birthDisplay(editing ? draft : patient)

  if (editing) {
    return (
      <div className="demographics-tab editing">
        <section className="profile-info-card">
          <Heading level={2}>Identity Information</Heading>
          <div className="profile-edit-grid">
            <label>
              Primary / given name <span className="required">*</span>
              <Input
                value={draft.givenName}
                onChange={(e) => setDraft({ ...draft, givenName: e.target.value })}
              />
            </label>
            <label>
              Additional name
              <Input
                value={draft.additionalName}
                onChange={(e) =>
                  setDraft({ ...draft, additionalName: e.target.value })
                }
              />
            </label>
            <label>
              Family name
              <Input
                value={draft.familyName}
                onChange={(e) => setDraft({ ...draft, familyName: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="profile-info-card">
          <Heading level={2}>Birth Information</Heading>
          <div className="profile-edit-grid">
            <label>
              Birth information mode
              <Select
                value={draft.birthMode}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    birthMode: e.target.value as PatientRecord["birthMode"],
                  })
                }
              >
                <option value="unknown">Not provided</option>
                <option value="date">Date of birth</option>
                <option value="age">Estimated age</option>
              </Select>
            </label>
            {draft.birthMode === "date" && (
              <label>
                Date of birth
                <Input
                  type="date"
                  value={draft.birth}
                  onChange={(e) => setDraft({ ...draft, birth: e.target.value })}
                />
              </label>
            )}
            {draft.birthMode === "age" && (
              <label>
                Estimated age (years)
                <Input
                  type="number"
                  value={draft.estimatedAge ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      estimatedAge: Number.parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </label>
            )}
          </div>
        </section>

        <section className="profile-info-card">
          <Heading level={2}>Contact Information</Heading>
          <div className="profile-edit-grid">
            <label>
              Primary phone
              <Input
                value={draft.phoneToken}
                onChange={(e) =>
                  setDraft({ ...draft, phoneToken: e.target.value })
                }
                placeholder="e.g. 0900000000"
              />
            </label>
            <label>
              Alternate phone
              <Input
                value={draft.alternatePhone}
                onChange={(e) =>
                  setDraft({ ...draft, alternatePhone: e.target.value })
                }
              />
            </label>
            <label>
              Email address
              <Input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </label>
            <label>
              Place of residence
              <Input
                value={draft.residence}
                onChange={(e) => setDraft({ ...draft, residence: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="profile-info-card">
          <Heading level={2}>Emergency Contact</Heading>
          <div className="profile-edit-grid">
            <label>
              Emergency contact name
              <Input
                value={draft.emergencyName}
                onChange={(e) =>
                  setDraft({ ...draft, emergencyName: e.target.value })
                }
              />
            </label>
            <label>
              Relationship
              <Input
                value={draft.emergencyRelationship}
                onChange={(e) =>
                  setDraft({ ...draft, emergencyRelationship: e.target.value })
                }
              />
            </label>
            <label>
              Emergency phone
              <Input
                value={draft.emergencyPhone}
                onChange={(e) =>
                  setDraft({ ...draft, emergencyPhone: e.target.value })
                }
              />
            </label>
          </div>
        </section>

        <div className="profile-edit-actions">
          <Button className="button secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button className="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="demographics-tab">
      <section className="profile-info-card">
        <div className="profile-card-header">
          <Heading level={2}>Identity Information</Heading>
          {permissions.has("registration") && (
            <Button className="profile-card-edit" onClick={onEdit}>
              <Icon name="edit" size={14} />
              Edit
            </Button>
          )}
        </div>
        <dl className="profile-info-list">
          <div>
            <dt>Primary / given name</dt>
            <dd>{patient.givenName}</dd>
          </div>
          {patient.additionalName && (
            <div>
              <dt>Additional name</dt>
              <dd>{patient.additionalName}</dd>
            </div>
          )}
          {patient.familyName && (
            <div>
              <dt>Family name</dt>
              <dd>{patient.familyName}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="profile-info-card">
        <Heading level={2}>Birth Information</Heading>
        <dl className="profile-info-list">
          <div>
            <dt>Date of birth / Age</dt>
            <dd>
              {birth.value}
              <small>{birth.detail}</small>
            </dd>
          </div>
        </dl>
      </section>

      <section className="profile-info-card">
        <Heading level={2}>Contact Information</Heading>
        <dl className="profile-info-list">
          <div>
            <dt>Primary phone</dt>
            <dd>{patient.phone || "Not recorded"}</dd>
          </div>
          {patient.alternatePhone && (
            <div>
              <dt>Alternate phone</dt>
              <dd>{patient.alternatePhone}</dd>
            </div>
          )}
          {patient.email ? (
            <div>
              <dt>Email address</dt>
              <dd>{patient.email}</dd>
            </div>
          ) : null}
          <div>
            <dt>Place of residence</dt>
            <dd>{patient.residence || "Not recorded"}</dd>
          </div>
        </dl>
      </section>

      <section className="profile-info-card">
        <Heading level={2}>Emergency Contact</Heading>
        {patient.emergencyName ? (
          <dl className="profile-info-list">
            <div>
              <dt>Contact name</dt>
              <dd>{patient.emergencyName}</dd>
            </div>
            <div>
              <dt>Relationship</dt>
              <dd>{patient.emergencyRelationship}</dd>
            </div>
            <div>
              <dt>Contact phone</dt>
              <dd>{patient.emergencyPhone}</dd>
            </div>
          </dl>
        ) : (
          <Text>No emergency contact recorded.</Text>
        )}
      </section>

      <section className="profile-info-card">
        <Heading level={2}>Registration Metadata</Heading>
        <dl className="profile-info-list">
          <div>
            <dt>Patient ID</dt>
            <dd>{patient.id}</dd>
          </div>
          <div>
            <dt>Registration date</dt>
            <dd>{dateLabel(patient.registered)}</dd>
          </div>
          <div>
            <dt>Registered by</dt>
            <dd>{patient.registeredBy}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{dateLabel(patient.lastUpdated)}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

// Appointments List
export function AppointmentsList({
  appointments,
  onOpen,
  onNavigate,
}: {
  appointments: AppointmentRecord[]
  onOpen: (appointment: AppointmentRecord) => void
  onNavigate: () => void
}) {
  if (appointments.length === 0) {
    return (
      <div className="profile-empty-state">
        <Icon name="calendar" size={28} />
        <Heading level={3}>No appointments found</Heading>
        <Text>This patient has no scheduled appointments on record.</Text>
        <Button className="button" onClick={onNavigate}>
          Schedule Appointment
        </Button>
      </div>
    )
  }

  return (
    <div className="appointments-list-section">
      <div className="profile-section-header">
        <Heading level={2}>Appointments</Heading>
        <Button className="button secondary" onClick={onNavigate}>
          <Icon name="calendar" size={16} />
          Manage Appointments
        </Button>
      </div>

      <div className="appointments-table-wrapper">
        <table className="profile-data-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Service</th>
              <th>Clinician</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <strong>{dateLabel(appointment.date)}</strong>
                  <small>{timeLabel(appointment.time)}</small>
                </td>
                <td>
                  {appointment.service}
                  <small>{appointment.department}</small>
                </td>
                <td>{appointment.clinician || "Not assigned"}</td>
                <td>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointmentStatusLabel(appointment.status)}
                  </span>
                </td>
                <td>
                  <Button
                    className="table-action-button"
                    onClick={() => onOpen(appointment)}
                  >
                    View
                    <Icon name="arrow" size={13} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Encounters List
export function EncountersList({
  encounters,
  onOpen,
}: {
  encounters: EncounterRecord[]
  onOpen: (encounter: EncounterRecord) => void
}) {
  if (encounters.length === 0) {
    return (
      <div className="profile-empty-state">
        <Icon name="building" size={28} />
        <Heading level={3}>No encounter records</Heading>
        <Text>
          No encounter or visit records are available for this patient.
        </Text>
      </div>
    )
  }

  return (
    <div className="encounters-list-section">
      <div className="profile-section-header">
        <Heading level={2}>Encounters & Visits</Heading>
        <Text>Each encounter is a distinct healthcare visit or episode.</Text>
      </div>

      <div className="encounters-list">
        {encounters.map((encounter) => (
          <div key={encounter.id} className="encounter-card">
            <div className="encounter-header">
              <div>
                <strong>{encounter.type}</strong>
                <span className="encounter-id">{encounter.id}</span>
              </div>
              <span className={`status-badge ${encounter.status}`}>
                {encounterStatusLabel(encounter.status)}
              </span>
            </div>
            <dl className="encounter-details">
              <div>
                <dt>Date & Time</dt>
                <dd>
                  {dateLabel(encounter.date)} · {timeLabel(encounter.time)}
                </dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{encounter.department}</dd>
              </div>
              <div>
                <dt>Clinician</dt>
                <dd>{encounter.clinician || "Not assigned"}</dd>
              </div>
            </dl>
            {encounter.notes && (
              <Text className="encounter-notes">{encounter.notes}</Text>
            )}
            <Button
              className="encounter-action"
              onClick={() => onOpen(encounter)}
            >
              Open Encounter
              <Icon name="arrow" size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Restricted Section State
export function RestrictedSectionState({ section }: { section: string }) {
  return (
    <div className="profile-restricted-state">
      <Icon name="lock" size={24} />
      <Heading level={3}>Access restricted</Heading>
      <Text>
        Your current permissions do not include access to {section}. Contact
        your administrator if you believe this is incorrect.
      </Text>
    </div>
  )
}

// Loading State
export function LoadingState() {
  return (
    <div className="patient-profile-loading">
      <div className="loading-skeleton-header" />
      <div className="loading-skeleton-actions" />
      <div className="loading-skeleton-tabs" />
      <div className="loading-skeleton-content" />
    </div>
  )
}

// Session Expired State
export function SessionExpiredState() {
  return (
    <div className="profile-error-state">
      <Icon name="clock" size={32} />
      <Heading level={2}>Session expired</Heading>
      <Text>Your session has expired. Please sign in again to continue.</Text>
      <Button className="button" onClick={() => window.location.reload()}>
        Sign In Again
      </Button>
    </div>
  )
}

// Patient Not Found
export function PatientNotFound({
  patientId,
  onBack,
  onHome,
}: {
  patientId: string
  onBack: () => void
  onHome: () => void
}) {
  return (
    <div className="profile-error-state">
      <Icon name="info" size={32} />
      <Heading level={2}>Patient not found</Heading>
      <Text>
        No patient record found for identifier: <strong>{patientId}</strong>
      </Text>
      <div className="error-actions">
        <Button className="button secondary" onClick={onBack}>
          Return to Directory
        </Button>
        <Button className="button" onClick={onHome}>
          Return to Home
        </Button>
      </div>
    </div>
  )
}

// Patient Profile Error
export function PatientProfileError({
  onRetry,
  onBack,
}: {
  onRetry: () => void
  onBack: () => void
}) {
  return (
    <div className="profile-error-state">
      <Icon name="warning" size={32} />
      <Heading level={2}>Unable to load patient profile</Heading>
      <Text>
        The patient profile could not be retrieved. Please try again or return
        to the directory.
      </Text>
      <div className="error-actions">
        <Button className="button secondary" onClick={onBack}>
          Return to Directory
        </Button>
        <Button className="button" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
