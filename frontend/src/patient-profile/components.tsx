import { useState } from "react"
import Icon from "../Icon"
import PreviewDialog from "../permissions/PreviewDialog"
import { Button, Heading, Input, Select, Text } from "../permissions/ui"
import type {
  ActivityEvent,
  DemographicData,
  PatientAppointment,
  PatientBillingItem,
  PatientEncounter,
  PatientLabRecord,
  PatientPrescription,
  UnifiedPatientProfile,
} from "./model"

// -------------------------------------------------------------
// BREADCRUMB
// -------------------------------------------------------------
export function PatientProfileBreadcrumb({
  patientName,
  onBackToDirectory,
}: {
  patientName: string
  onBackToDirectory: () => void
}) {
  return (
    <nav className="patient-profile-breadcrumb" aria-label="Breadcrumb navigation">
      <button onClick={onBackToDirectory}>
        <Icon name="arrow" size={14} />
        Patient Directory
      </button>
      <span>/</span>
      <span className="current">{patientName}</span>
      <span>(Unified Profile)</span>
    </nav>
  )
}

// -------------------------------------------------------------
// IDENTITY HEADER & ACTIONS
// -------------------------------------------------------------
export function PatientIdentityHeader({
  demographics,
  permissions,
  onEdit,
  onSchedule,
  onRegisterVisit,
}: {
  demographics: DemographicData
  permissions: Set<string>
  onEdit: () => void
  onSchedule: () => void
  onRegisterVisit: () => void
}) {
  const initials = demographics.fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const canEdit = permissions.has("registration") || permissions.has("directory")
  const canSchedule = permissions.has("appointments")
  const canRegisterVisit = permissions.has("queue") || permissions.has("registration")

  return (
    <header className="patient-profile-header-card" aria-label="Patient identity header">
      <div className="patient-profile-header-top">
        <div className="patient-profile-identity-main">
          <div className="patient-avatar-initials" aria-hidden="true">
            {initials}
          </div>
          <div className="patient-identity-text">
            <div className="patient-identity-title-row">
              <h1 className="patient-identity-name">{demographics.fullName}</h1>
              <span className="patient-id-badge">{demographics.id}</span>
              <span className="record-status-pill">
                <Icon name="shield" size={12} />
                {demographics.recordStatus}
              </span>
            </div>
            <div className="patient-identity-meta-row">
              <span>
                <Icon name="calendar" size={14} />
                {demographics.dob
                  ? `${demographics.estimatedAge || "—"} yrs (${demographics.dob})`
                  : demographics.estimatedAge
                  ? `Approx. ${demographics.estimatedAge} yrs`
                  : "Age not recorded"}
              </span>
              <span>•</span>
              <span>
                <Icon name="user" size={14} />
                {demographics.demographicCategory}
              </span>
              <span>•</span>
              <span>
                <Icon name="phone" size={14} />
                {demographics.phoneToken ? demographics.maskedPhone : "No contact recorded"}
              </span>
              <span>•</span>
              <span>
                <Icon name="clock" size={14} />
                Registered {demographics.registrationDate}
              </span>
            </div>
          </div>
        </div>

        <div className="patient-identity-actions">
          {canEdit && (
            <Button className="button secondary" onClick={onEdit}>
              <Icon name="edit" size={15} />
              Edit Demographics
            </Button>
          )}
          {canSchedule && (
            <Button className="button" onClick={onSchedule}>
              <Icon name="calendar" size={15} />
              Schedule Appointment
            </Button>
          )}
          {canRegisterVisit && (
            <Button className="button secondary" onClick={onRegisterVisit}>
              <Icon name="check" size={15} />
              Register Visit
            </Button>
          )}
        </div>
      </div>

      {demographics.possibleDuplicate && (
        <div className="patient-duplicate-warning" role="alert">
          <Icon name="warning" size={18} />
          <div>
            <strong>Possible Duplicate Record Alert: </strong>
            {demographics.duplicateNote ||
              "Similar demographic attributes found in existing records. Verify identity details before clinical documentation."}
          </div>
        </div>
      )}
    </header>
  )
}

// -------------------------------------------------------------
// NAVIGATION TABS
// -------------------------------------------------------------
export type ProfileTab =
  | "overview"
  | "demographics"
  | "appointments"
  | "encounters"
  | "clinical"
  | "laboratory"
  | "prescriptions"
  | "billing"

export function PatientProfileNavigation({
  activeTab,
  onSelectTab,
  counts,
  permissions,
}: {
  activeTab: ProfileTab
  onSelectTab: (tab: ProfileTab) => void
  counts: {
    appointments: number
    encounters: number
    labs: number
    prescriptions: number
    billing: number
  }
  permissions: Set<string>
}) {
  const tabs: {
    id: ProfileTab
    label: string
    icon: any
    count?: number
    restricted?: boolean
  }[] = [
    { id: "overview", label: "Overview", icon: "user" },
    { id: "demographics", label: "Demographics", icon: "edit" },
    {
      id: "appointments",
      label: "Appointments",
      icon: "calendar",
      count: counts.appointments,
    },
    {
      id: "encounters",
      label: "Encounters / Visits",
      icon: "clock",
      count: counts.encounters,
    },
    {
      id: "clinical",
      label: "Clinical History",
      icon: "heart",
      restricted: !permissions.has("records") && !permissions.has("consultations"),
    },
    {
      id: "laboratory",
      label: "Laboratory",
      icon: "flask",
      count: counts.labs,
      restricted: !permissions.has("lab-orders") && !permissions.has("orders"),
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: "pill",
      count: counts.prescriptions,
      restricted: !permissions.has("prescriptions") && !permissions.has("prescription-queue"),
    },
    {
      id: "billing",
      label: "Billing",
      icon: "building",
      count: counts.billing,
      restricted: !permissions.has("invoices") && !permissions.has("payments"),
    },
  ]

  return (
    <nav className="patient-profile-nav-tabs" aria-label="Patient Profile sections">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`patient-tab-button ${isActive ? "is-active" : ""} ${
              tab.restricted ? "is-restricted" : ""
            }`}
            onClick={() => onSelectTab(tab.id)}
            aria-selected={isActive}
            role="tab"
          >
            <Icon name={tab.icon} size={15} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="tab-badge">{tab.count}</span>
            )}
            {tab.restricted && <Icon name="shield" size={12} />}
          </button>
        )
      })}
    </nav>
  )
}

// -------------------------------------------------------------
// OVERVIEW TAB
// -------------------------------------------------------------
export function OverviewTab({
  profile,
  onNavigateTab,
}: {
  profile: UnifiedPatientProfile
  onNavigateTab: (tab: ProfileTab) => void
}) {
  const d = profile.demographics

  return (
    <div className="profile-overview-grid">
      {/* Left Column: Demographic & Registration Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <section className="profile-card">
          <div className="profile-card-header">
            <h2>
              <Icon name="user" size={17} />
              Demographic Information
            </h2>
            <Button
              className="patient-text-button"
              onClick={() => onNavigateTab("demographics")}
            >
              View all
            </Button>
          </div>
          <dl className="patient-data-dl">
            <dt>Full name</dt>
            <dd>{d.fullName}</dd>

            <dt>Date of birth</dt>
            <dd className={d.dob ? "" : "empty-val"}>{d.dob || "Not recorded"}</dd>

            <dt>Age</dt>
            <dd className={d.estimatedAge ? "" : "empty-val"}>
              {d.estimatedAge ? `${d.estimatedAge} years (${d.ageBasis || "recorded"})` : "Not recorded"}
            </dd>

            <dt>Category</dt>
            <dd>{d.demographicCategory}</dd>

            <dt>Phone (masked)</dt>
            <dd className={d.phoneToken ? "" : "empty-val"}>
              {d.phoneToken ? d.maskedPhone : "Not recorded"}
            </dd>

            <dt>Residence</dt>
            <dd className={d.residence ? "" : "empty-val"}>
              {d.residence || "Not recorded"}
            </dd>

            <dt>Emergency contact</dt>
            <dd className={d.emergencyContact ? "" : "empty-val"}>
              {d.emergencyContact
                ? `${d.emergencyContact.name} (${d.emergencyContact.relationship})`
                : "Not recorded"}
            </dd>
          </dl>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <h3>
              <Icon name="shield" size={17} />
              Registration Metadata
            </h3>
          </div>
          <dl className="patient-data-dl">
            <dt>Patient ID</dt>
            <dd style={{ fontFamily: "monospace" }}>{d.id}</dd>

            <dt>Registration date</dt>
            <dd>{d.registrationDate}</dd>

            <dt>Facility</dt>
            <dd>{d.registeringFacility}</dd>

            <dt>Record status</dt>
            <dd>{d.recordStatus}</dd>

            <dt>Data completeness</dt>
            <dd>
              {d.phone && d.dob && d.residence
                ? "Complete (Contact & DOB verified)"
                : "Basic (Essential demographic fields only)"}
            </dd>
          </dl>
        </section>
      </div>

      {/* Right Column: Chronological Activity Feed */}
      <section className="profile-card">
        <div className="profile-card-header">
          <h2>
            <Icon name="clock" size={17} />
            Recent Patient Activity
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Chronological log
          </span>
        </div>

        {profile.activity.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
            No recent activity recorded for this patient.
          </div>
        ) : (
          <div className="activity-feed-list">
            {profile.activity.map((act) => {
              const iconMap: Record<string, any> = {
                appointment: "calendar",
                encounter: "cross",
                lab: "flask",
                prescription: "pill",
                billing: "building",
                registration: "user",
                demographics: "edit",
              }
              return (
                <div key={act.id} className="activity-feed-item">
                  <div className="activity-feed-icon-wrap">
                    <Icon name={iconMap[act.type] || "info"} size={16} />
                  </div>
                  <div className="activity-feed-content">
                    <div className="activity-feed-top-line">
                      <span className="activity-feed-title">{act.title}</span>
                      <span className={`activity-feed-badge ${act.badgeVariant}`}>
                        {act.badge}
                      </span>
                    </div>
                    <span className="activity-feed-desc">{act.description}</span>
                    <div className="activity-feed-meta">
                      <span>{act.date} at {act.time}</span>
                      {act.actor && <span>• Handled by {act.actor}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

// -------------------------------------------------------------
// DEMOGRAPHICS TAB & INLINE EDIT
// -------------------------------------------------------------
export function DemographicsTab({
  demographics,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
}: {
  demographics: DemographicData
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: (updated: Partial<DemographicData>) => void
}) {
  const [draft, setDraft] = useState({
    given: demographics.given,
    family: demographics.family,
    dob: demographics.dob || "",
    estimatedAge: demographics.estimatedAge ? String(demographics.estimatedAge) : "",
    phone: demographics.phone || "",
    alternatePhone: demographics.alternatePhone || "",
    email: demographics.email || "",
    residence: demographics.residence || "",
    emergencyName: demographics.emergencyContact?.name || "",
    emergencyRelationship: demographics.emergencyContact?.relationship || "",
    emergencyPhone: demographics.emergencyContact?.phone || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const isDirty =
    draft.given !== demographics.given ||
    draft.family !== demographics.family ||
    draft.dob !== (demographics.dob || "") ||
    draft.residence !== (demographics.residence || "") ||
    draft.phone !== (demographics.phone || "")

  function handleCancel() {
    if (isDirty) {
      setShowDiscardConfirm(true)
    } else {
      onCancelEdit()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!draft.given.trim()) newErrors.given = "Given / primary name is required."
    if (!draft.family.trim()) newErrors.family = "Family name is required."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      onSave({
        given: draft.given.trim(),
        family: draft.family.trim(),
        fullName: `${draft.given.trim()} ${draft.family.trim()}`,
        dob: draft.dob || undefined,
        estimatedAge: draft.estimatedAge ? Number(draft.estimatedAge) : undefined,
        phone: draft.phone.trim(),
        maskedPhone: draft.phone.trim() ? `••• ••• ${draft.phone.trim().slice(-4)}` : "No contact recorded",
        residence: draft.residence.trim(),
        emergencyContact: draft.emergencyName
          ? {
              name: draft.emergencyName,
              relationship: draft.emergencyRelationship,
              phone: draft.emergencyPhone,
            }
          : undefined,
      })
    }, 400)
  }

  if (isEditing) {
    return (
      <section className="profile-card" aria-label="Edit patient demographics form">
        <div className="profile-card-header">
          <h2>
            <Icon name="edit" size={18} />
            Edit Demographic Record
          </h2>
          <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
            Patient ID: {demographics.id}
          </span>
        </div>

        <form className="demographics-edit-form" onSubmit={handleSubmit} noValidate>
          {/* Identity Section */}
          <div>
            <div className="form-section-title">Identity & Name</div>
            <div className="form-grid-2col">
              <div className="form-field-group">
                <label htmlFor="edit-given">
                  Given / Primary name <span className="required">*</span>
                </label>
                <Input
                  id="edit-given"
                  value={draft.given}
                  onChange={(e) => {
                    setDraft({ ...draft, given: e.target.value })
                    setErrors({ ...errors, given: "" })
                  }}
                />
                {errors.given && <span className="form-error-msg">{errors.given}</span>}
              </div>
              <div className="form-field-group">
                <label htmlFor="edit-family">
                  Family name <span className="required">*</span>
                </label>
                <Input
                  id="edit-family"
                  value={draft.family}
                  onChange={(e) => {
                    setDraft({ ...draft, family: e.target.value })
                    setErrors({ ...errors, family: "" })
                  }}
                />
                {errors.family && <span className="form-error-msg">{errors.family}</span>}
              </div>
            </div>
          </div>

          {/* Birth & Age Section */}
          <div>
            <div className="form-section-title">Date of Birth & Age</div>
            <div className="form-grid-2col">
              <div className="form-field-group">
                <label htmlFor="edit-dob">Date of birth (YYYY-MM-DD)</label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={draft.dob}
                  onChange={(e) => setDraft({ ...draft, dob: e.target.value })}
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="edit-age">Estimated Age (Years)</label>
                <Input
                  id="edit-age"
                  type="number"
                  min="0"
                  max="125"
                  value={draft.estimatedAge}
                  onChange={(e) => setDraft({ ...draft, estimatedAge: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <div className="form-section-title">Contact & Residence</div>
            <div className="form-grid-2col">
              <div className="form-field-group">
                <label htmlFor="edit-phone">Primary phone number</label>
                <Input
                  id="edit-phone"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="+251 9X XXX XXXX"
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="edit-residence">Place of residence / Kebele</label>
                <Input
                  id="edit-residence"
                  value={draft.residence}
                  onChange={(e) => setDraft({ ...draft, residence: e.target.value })}
                  placeholder="e.g. Kebele 02, Bale Robe"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <div className="form-section-title">Emergency Contact Details</div>
            <div className="form-grid-3col">
              <div className="form-field-group">
                <label htmlFor="edit-em-name">Contact person</label>
                <Input
                  id="edit-em-name"
                  value={draft.emergencyName}
                  onChange={(e) => setDraft({ ...draft, emergencyName: e.target.value })}
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="edit-em-rel">Relationship</label>
                <Input
                  id="edit-em-rel"
                  value={draft.emergencyRelationship}
                  onChange={(e) =>
                    setDraft({ ...draft, emergencyRelationship: e.target.value })
                  }
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="edit-em-phone">Contact phone</label>
                <Input
                  id="edit-em-phone"
                  value={draft.emergencyPhone}
                  onChange={(e) => setDraft({ ...draft, emergencyPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-action-footer">
            <Button className="button secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="button" type="submit" disabled={isSaving}>
              {isSaving ? "Saving changes…" : "Save Demographic Changes"}
              <Icon name="check" size={15} />
            </Button>
          </div>
        </form>

        {showDiscardConfirm && (
          <PreviewDialog
            title="Discard unsaved changes?"
            onClose={() => setShowDiscardConfirm(false)}
          >
            <Text>
              You have made modifications to this patient's demographic information. If
              you discard now, your changes will not be saved.
            </Text>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.25rem" }}>
              <Button className="button secondary" onClick={() => setShowDiscardConfirm(false)}>
                Continue Editing
              </Button>
              <Button
                className="button"
                onClick={() => {
                  setShowDiscardConfirm(false)
                  onCancelEdit()
                }}
              >
                Discard Changes
              </Button>
            </div>
          </PreviewDialog>
        )}
      </section>
    )
  }

  // Display Mode
  return (
    <section className="profile-card" aria-label="Patient demographics details">
      <div className="profile-card-header">
        <h2>
          <Icon name="user" size={18} />
          Complete Demographic Profile
        </h2>
        <Button className="button secondary" onClick={onStartEdit}>
          <Icon name="edit" size={15} />
          Edit Information
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <div className="form-section-title">Identity & Classification</div>
          <dl className="patient-data-dl">
            <dt>Full name</dt>
            <dd>{demographics.fullName}</dd>
            <dt>Given / primary name</dt>
            <dd>{demographics.given}</dd>
            <dt>Family name</dt>
            <dd>{demographics.family}</dd>
            <dt>Demographic group</dt>
            <dd>{demographics.demographicCategory}</dd>
          </dl>
        </div>

        <div>
          <div className="form-section-title">Birth & Age Information</div>
          <dl className="patient-data-dl">
            <dt>Date of birth</dt>
            <dd className={demographics.dob ? "" : "empty-val"}>
              {demographics.dob || "Not recorded"}
            </dd>
            <dt>Age</dt>
            <dd className={demographics.estimatedAge ? "" : "empty-val"}>
              {demographics.estimatedAge
                ? `${demographics.estimatedAge} years (${demographics.ageBasis || "recorded"})`
                : "Not recorded"}
            </dd>
          </dl>
        </div>

        <div>
          <div className="form-section-title">Contact & Address</div>
          <dl className="patient-data-dl">
            <dt>Primary phone</dt>
            <dd className={demographics.phoneToken ? "" : "empty-val"}>
              {demographics.phoneToken ? demographics.maskedPhone : "Not recorded"}
            </dd>
            <dt>Place of residence</dt>
            <dd className={demographics.residence ? "" : "empty-val"}>
              {demographics.residence || "Not recorded"}
            </dd>
            <dt>Email</dt>
            <dd className={demographics.email ? "" : "empty-val"}>
              {demographics.email || "Not recorded"}
            </dd>
          </dl>
        </div>

        <div>
          <div className="form-section-title">Emergency Contact</div>
          <dl className="patient-data-dl">
            <dt>Contact person</dt>
            <dd className={demographics.emergencyContact ? "" : "empty-val"}>
              {demographics.emergencyContact?.name || "Not recorded"}
            </dd>
            <dt>Relationship</dt>
            <dd className={demographics.emergencyContact ? "" : "empty-val"}>
              {demographics.emergencyContact?.relationship || "Not recorded"}
            </dd>
            <dt>Phone</dt>
            <dd className={demographics.emergencyContact ? "" : "empty-val"}>
              {demographics.emergencyContact?.phone || "Not recorded"}
            </dd>
          </dl>
        </div>

        <div>
          <div className="form-section-title">Registration Metadata</div>
          <dl className="patient-data-dl">
            <dt>Master patient ID</dt>
            <dd style={{ fontFamily: "monospace" }}>{demographics.id}</dd>
            <dt>Registration date</dt>
            <dd>{demographics.registrationDate}</dd>
            <dt>Registering facility</dt>
            <dd>{demographics.registeringFacility}</dd>
            <dt>Record status</dt>
            <dd>{demographics.recordStatus}</dd>
          </dl>
        </div>
      </div>
    </section>
  )
}

// -------------------------------------------------------------
// APPOINTMENTS TAB
// -------------------------------------------------------------
export function AppointmentsTab({
  appointments,
  onSchedule,
  onViewAppointment,
}: {
  appointments: PatientAppointment[]
  onSchedule: () => void
  onViewAppointment: (apt: PatientAppointment) => void
}) {
  if (appointments.length === 0) {
    return (
      <div className="empty-tab-card">
        <div className="empty-tab-icon">
          <Icon name="calendar" size={26} />
        </div>
        <h3>No appointments scheduled</h3>
        <p>This patient has no upcoming or previous appointment bookings recorded.</p>
        <Button className="button" onClick={onSchedule}>
          <Icon name="calendar" size={15} />
          Schedule New Appointment
        </Button>
      </div>
    )
  }

  return (
    <section className="profile-card" aria-label="Patient appointment history">
      <div className="profile-card-header">
        <h2>
          <Icon name="calendar" size={18} />
          Scheduled Appointments ({appointments.length})
        </h2>
        <Button className="button" onClick={onSchedule}>
          <Icon name="calendar" size={15} />
          Book Appointment
        </Button>
      </div>

      <table className="patient-profile-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Service / Department</th>
            <th>Clinician</th>
            <th>Visit Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id}>
              <td>
                <strong>{apt.date}</strong>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{apt.time}</div>
              </td>
              <td>
                <div>{apt.service}</div>
                <small style={{ color: "#64748b" }}>{apt.department}</small>
              </td>
              <td>{apt.clinician}</td>
              <td>{apt.visitType}</td>
              <td>
                <span className={`badge-status ${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
              </td>
              <td>
                <Button
                  className="patient-text-button"
                  onClick={() => onViewAppointment(apt)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// -------------------------------------------------------------
// ENCOUNTERS / VISITS TAB
// -------------------------------------------------------------
export function EncountersTab({
  encounters,
  onViewEncounter,
}: {
  encounters: PatientEncounter[]
  onViewEncounter: (enc: PatientEncounter) => void
}) {
  if (encounters.length === 0) {
    return (
      <div className="empty-tab-card">
        <div className="empty-tab-icon">
          <Icon name="clock" size={26} />
        </div>
        <h3>No recorded healthcare encounters</h3>
        <p>
          There are no documented clinical visits or episodes of care for this patient.
          Visits will appear here once registered through reception or clinical triage.
        </p>
      </div>
    )
  }

  return (
    <section className="profile-card" aria-label="Healthcare encounters and visits">
      <div className="profile-card-header">
        <h2>
          <Icon name="clock" size={18} />
          Healthcare Encounters & Visits ({encounters.length})
        </h2>
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
          Each episode of care is documented independently
        </span>
      </div>

      <table className="patient-profile-table">
        <thead>
          <tr>
            <th>Encounter ID</th>
            <th>Date & Time</th>
            <th>Encounter Type</th>
            <th>Department</th>
            <th>Clinician</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {encounters.map((enc) => (
            <tr key={enc.id}>
              <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{enc.id}</td>
              <td>
                <strong>{enc.date}</strong>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{enc.time}</div>
              </td>
              <td>{enc.type}</td>
              <td>{enc.department}</td>
              <td>{enc.clinician}</td>
              <td>
                <span className={`badge-status ${enc.status.toLowerCase().replace(" ", "-")}`}>
                  {enc.status}
                </span>
              </td>
              <td>
                <Button
                  className="patient-text-button"
                  onClick={() => onViewEncounter(enc)}
                >
                  View Visit Summary
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// -------------------------------------------------------------
// CLINICAL HISTORY TAB (PERMISSION AWARE)
// -------------------------------------------------------------
export function ClinicalHistoryTab({
  clinical,
  isRestricted,
}: {
  clinical?: UnifiedPatientProfile["clinical"]
  isRestricted: boolean
}) {
  if (isRestricted) {
    return (
      <RestrictedSectionState
        title="Clinical History Access Restricted"
        description="Clinical assessments, recorded diagnoses, and medical histories require authorized clinical role permissions (Doctor, Nurse, or Medical Officer)."
      />
    )
  }

  if (!clinical || (clinical.allergies.length === 0 && clinical.diagnoses.length === 0)) {
    return (
      <div className="empty-tab-card">
        <div className="empty-tab-icon">
          <Icon name="heart" size={26} />
        </div>
        <h3>No clinical history recorded</h3>
        <p>No documented diagnoses or recorded sensitivities exist for this patient.</p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Allergies Card */}
      <section className="profile-card">
        <div className="profile-card-header">
          <h2>
            <Icon name="warning" size={17} />
            Recorded Allergies & Sensitivities
          </h2>
        </div>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#334155" }}>
          {clinical.allergies.map((allergy, i) => (
            <li key={i} style={{ marginBottom: "0.25rem" }}>
              <strong>{allergy}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* Diagnoses Linked to Encounters */}
      <section className="profile-card">
        <div className="profile-card-header">
          <h2>
            <Icon name="heart" size={17} />
            Diagnoses & Conditions (Encounter-Linked)
          </h2>
        </div>
        <table className="patient-profile-table">
          <thead>
            <tr>
              <th>Condition / Diagnosis</th>
              <th>Type</th>
              <th>Documented Date</th>
              <th>Encounter Reference</th>
              <th>Clinician</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clinical.diagnoses.map((diag, index) => (
              <tr key={index}>
                <td>
                  <strong>{diag.condition}</strong>
                </td>
                <td>{diag.type}</td>
                <td>{diag.encounterDate}</td>
                <td style={{ fontFamily: "monospace" }}>{diag.encounterId}</td>
                <td>{diag.clinician}</td>
                <td>
                  <span className="badge-status completed">{diag.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* General Clinical Context Note */}
      <section className="profile-card" style={{ background: "#f8fafc" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b" }}>
          <Icon name="info" size={16} />
          <span style={{ fontSize: "0.8125rem" }}>{clinical.generalNotes}</span>
        </div>
      </section>
    </div>
  )
}

// -------------------------------------------------------------
// LABORATORY TAB (PERMISSION AWARE)
// -------------------------------------------------------------
export function LaboratoryTab({
  labRecords,
  isRestricted,
}: {
  labRecords: PatientLabRecord[]
  isRestricted: boolean
}) {
  if (isRestricted) {
    return (
      <RestrictedSectionState
        title="Diagnostic Laboratory Records Restricted"
        description="Reviewing laboratory orders and test results requires diagnostic or clinical authorization (Doctor, Laboratory Technician, or Medical Administrator)."
      />
    )
  }

  if (labRecords.length === 0) {
    return (
      <div className="empty-tab-card">
        <div className="empty-tab-icon">
          <Icon name="flask" size={26} />
        </div>
        <h3>No laboratory records</h3>
        <p>There are no diagnostic laboratory orders or reported results on file for this patient.</p>
      </div>
    )
  }

  return (
    <section className="profile-card" aria-label="Laboratory diagnostic records">
      <div className="profile-card-header">
        <h2>
          <Icon name="flask" size={18} />
          Laboratory Orders & Results ({labRecords.length})
        </h2>
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
          Orders are distinct from verified results
        </span>
      </div>

      <table className="patient-profile-table">
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Test Description</th>
            <th>Category</th>
            <th>Ordering Clinician</th>
            <th>Status</th>
            <th>Reported Result</th>
          </tr>
        </thead>
        <tbody>
          {labRecords.map((lab) => (
            <tr key={lab.id}>
              <td>{lab.orderDate}</td>
              <td>
                <strong>{lab.testName}</strong>
              </td>
              <td>{lab.category}</td>
              <td>{lab.orderingClinician}</td>
              <td>
                <span
                  className={`badge-status ${
                    lab.status === "Result Available" ? "completed" : "in-progress"
                  }`}
                >
                  {lab.status}
                </span>
              </td>
              <td>
                {lab.resultValue ? (
                  <div>
                    <span>{lab.resultValue}</span>
                    {lab.referenceRange && (
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Ref: {lab.referenceRange}
                      </div>
                    )}
                  </div>
                ) : (
                  <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                    Awaiting laboratory analysis
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// -------------------------------------------------------------
// PRESCRIPTIONS TAB (PERMISSION AWARE)
// -------------------------------------------------------------
export function PrescriptionsTab({
  prescriptions,
  isRestricted,
}: {
  prescriptions: PatientPrescription[]
  isRestricted: boolean
}) {
  if (isRestricted) {
    return (
      <RestrictedSectionState
        title="Pharmacy & Prescription Access Restricted"
        description="Prescription records and medication dispensing histories require pharmacy or clinical permissions (Doctor, Pharmacist, or Nurse)."
      />
    )
  }

  if (prescriptions.length === 0) {
    return (
      <div className="empty-tab-card">
        <div className="empty-tab-icon">
          <Icon name="pill" size={26} />
        </div>
        <h3>No medication prescriptions</h3>
        <p>No active or historical medication orders are recorded for this patient.</p>
      </div>
    )
  }

  return (
    <section className="profile-card" aria-label="Medication prescriptions">
      <div className="profile-card-header">
        <h2>
          <Icon name="pill" size={18} />
          Prescriptions & Medication Orders ({prescriptions.length})
        </h2>
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
          Prescription order is distinct from physical dispensing
        </span>
      </div>

      <table className="patient-profile-table">
        <thead>
          <tr>
            <th>Prescribed Date</th>
            <th>Medication</th>
            <th>Dosage & Instructions</th>
            <th>Duration</th>
            <th>Prescriber</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((rx) => (
            <tr key={rx.id}>
              <td>{rx.prescribedDate}</td>
              <td>
                <strong>{rx.medication}</strong>
              </td>
              <td>{rx.frequency}</td>
              <td>{rx.duration}</td>
              <td>{rx.prescribingClinician}</td>
              <td>
                <span
                  className={`badge-status ${
                    rx.status === "Dispensed" ? "completed" : "in-progress"
                  }`}
                >
                  {rx.status}
                </span>
                {rx.dispensedDate && (
                  <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                    Dispensed {rx.dispensedDate}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// -------------------------------------------------------------
// BILLING TAB (PERMISSION AWARE)
// -------------------------------------------------------------
export function BillingTab({
  billingItems,
  isRestricted,
}: {
  billingItems: PatientBillingItem[]
  isRestricted: boolean
}) {
  if (isRestricted) {
    return (
      <RestrictedSectionState
        title="Billing & Financial Information Restricted"
        description="Invoices, fee assessments, and payment records require authorized cashier or administrative permissions. Financial records are separate from clinical care eligibility."
      />
    )
  }

  if (billingItems.length === 0) {
    return (
      <div className="empty-tab-card">
        <div className="empty-tab-icon">
          <Icon name="building" size={26} />
        </div>
        <h3>No billing records</h3>
        <p>No invoices or payments have been registered for this patient profile.</p>
      </div>
    )
  }

  const totalEtb = billingItems.reduce((acc, item) => acc + item.amountEtb, 0)

  return (
    <section className="profile-card" aria-label="Patient billing and invoices">
      <div className="profile-card-header">
        <h2>
          <Icon name="building" size={18} />
          Invoices & Payments ({billingItems.length})
        </h2>
        <span style={{ fontWeight: 600, color: "#047857" }}>
          Total Billed: {totalEtb} ETB
        </span>
      </div>

      <table className="patient-profile-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Service Description</th>
            <th>Amount (ETB)</th>
            <th>Payment Status</th>
            <th>Receipt #</th>
          </tr>
        </thead>
        <tbody>
          {billingItems.map((inv) => (
            <tr key={inv.id}>
              <td style={{ fontFamily: "monospace" }}>{inv.id}</td>
              <td>{inv.date}</td>
              <td>{inv.serviceDescription}</td>
              <td style={{ fontWeight: 600 }}>{inv.amountEtb} ETB</td>
              <td>
                <span className="badge-status completed">{inv.status}</span>
              </td>
              <td>{inv.receiptNumber || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// -------------------------------------------------------------
// SHARED RESTRICTED ACCESS STATE
// -------------------------------------------------------------
export function RestrictedSectionState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="restricted-section-card" role="status">
      <div className="restricted-icon-circle">
        <Icon name="shield" size={24} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

// -------------------------------------------------------------
// DETAIL MODALS (ENCOUNTER & APPOINTMENT)
// -------------------------------------------------------------
export function EncounterDetailModal({
  encounter,
  onClose,
}: {
  encounter: PatientEncounter
  onClose: () => void
}) {
  return (
    <PreviewDialog
      title={`Encounter Summary · ${encounter.id}`}
      onClose={onClose}
    >
      <div className="profile-modal-content">
        <div className="profile-modal-header">
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>
              {encounter.department}
            </span>
            <Heading level={3}>{encounter.type}</Heading>
          </div>
          <span className="badge-status completed">{encounter.status}</span>
        </div>

        <div className="profile-modal-body">
          <div>
            <strong>Visit Date & Time: </strong>
            {encounter.date} at {encounter.time}
          </div>
          <div>
            <strong>Responsible Clinician: </strong>
            {encounter.clinician}
          </div>
          <div>
            <strong>Reason for Visit: </strong>
            <p style={{ margin: "0.25rem 0 0" }}>{encounter.reasonForVisit}</p>
          </div>

          {encounter.vitals && (
            <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.375rem" }}>
              <strong>Recorded Vitals: </strong>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                <span>BP: {encounter.vitals.bp || "—"}</span>
                <span>HR: {encounter.vitals.heartRate || "—"}</span>
                <span>Temp: {encounter.vitals.temperature || "—"}</span>
                <span>Weight: {encounter.vitals.weight || "—"}</span>
              </div>
            </div>
          )}

          <div>
            <strong>Clinical Assessment: </strong>
            <p style={{ margin: "0.25rem 0 0" }}>{encounter.assessment}</p>
          </div>

          <div>
            <strong>Documentation Notes: </strong>
            <p style={{ margin: "0.25rem 0 0", color: "#475569" }}>{encounter.clinicalNotes}</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button className="button secondary" onClick={onClose}>
            Close Summary
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}

export function AppointmentDetailModal({
  appointment,
  onClose,
}: {
  appointment: PatientAppointment
  onClose: () => void
}) {
  return (
    <PreviewDialog
      title={`Appointment Details · ${appointment.id}`}
      onClose={onClose}
    >
      <div className="profile-modal-content">
        <div className="profile-modal-header">
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              {appointment.department}
            </span>
            <Heading level={3}>{appointment.service}</Heading>
          </div>
          <span className="badge-status scheduled">{appointment.status}</span>
        </div>

        <div className="profile-modal-body">
          <div>
            <strong>Scheduled Date: </strong> {appointment.date}
          </div>
          <div>
            <strong>Time Preference / Slot: </strong> {appointment.time}
          </div>
          <div>
            <strong>Assigned Clinician: </strong> {appointment.clinician}
          </div>
          <div>
            <strong>Visit Type: </strong> {appointment.visitType}
          </div>
          {appointment.notes && (
            <div>
              <strong>Booking Notes: </strong>
              <p style={{ margin: "0.25rem 0 0" }}>{appointment.notes}</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button className="button secondary" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}
