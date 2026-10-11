import { useState } from "react"
import Icon from "../Icon"
import PreviewDialog from "../permissions/PreviewDialog"
import { Button, Heading, Input, Select, Text } from "../permissions/ui"
import { patients as directoryPatients } from "../patient-directory/model"
import {
  appointmentStatusLabel,
  clinicians,
  dateLabel,
  detectConflicts,
  emptyDraft,
  formatDateTime,
  services,
  validateAppointmentDraft,
  type AppointmentDraft,
  type AppointmentRecord,
  type AppointmentStatus,
  type ScheduleConflict,
} from "./model"

// Summary Cards
export function AppointmentSummaryCards({
  appointments,
  selectedDate,
}: {
  appointments: AppointmentRecord[]
  selectedDate: string
}) {
  const dayAppointments = appointments.filter((apt) => apt.date === selectedDate)

  const scheduled = dayAppointments.filter(
    (apt) => apt.status === "scheduled" || apt.status === "confirmed",
  ).length
  const confirmed = dayAppointments.filter((apt) => apt.status === "confirmed")
    .length
  const arrived = dayAppointments.filter((apt) => apt.status === "arrived").length
  const cancelled = dayAppointments.filter((apt) => apt.status === "cancelled")
    .length

  return (
    <div className="appointments-summary-grid">
      <div className="appointments-summary-card">
        <div className="summary-card-icon">
          <Icon name="calendar" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Total Scheduled</span>
          <strong className="summary-card-value">{scheduled}</strong>
          <small>Appointments for selected date</small>
        </div>
      </div>

      <div className="appointments-summary-card">
        <div className="summary-card-icon confirmed">
          <Icon name="check" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Confirmed</span>
          <strong className="summary-card-value">{confirmed}</strong>
          <small>Confirmed by patient</small>
        </div>
      </div>

      <div className="appointments-summary-card">
        <div className="summary-card-icon arrived">
          <Icon name="user" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Arrived</span>
          <strong className="summary-card-value">{arrived}</strong>
          <small>Patients checked in</small>
        </div>
      </div>

      <div className="appointments-summary-card">
        <div className="summary-card-icon cancelled">
          <Icon name="close" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Cancelled</span>
          <strong className="summary-card-value">{cancelled}</strong>
          <small>Cancelled today</small>
        </div>
      </div>
    </div>
  )
}

// Date Navigator
export function DateNavigator({
  selectedDate,
  onDateChange,
  onPrevious,
  onNext,
  onToday,
}: {
  selectedDate: string
  onDateChange: (date: string) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}) {
  const isToday = selectedDate === new Date().toISOString().slice(0, 10)

  return (
    <div className="date-navigator">
      <Button
        className="date-nav-button"
        onClick={onPrevious}
        aria-label="Previous day"
      >
        <Icon name="chevron" size={16} />
      </Button>

      <div className="date-selector">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          aria-label="Select date"
        />
        <span className="date-display">{dateLabel(selectedDate)}</span>
      </div>

      <Button
        className="date-nav-button"
        onClick={onNext}
        aria-label="Next day"
      >
        <Icon name="chevron" size={16} />
      </Button>

      <Button
        className="button secondary"
        onClick={onToday}
        disabled={isToday}
      >
        Today
      </Button>
    </div>
  )
}

// Appointment Filters
export function AppointmentFilters({
  statusFilter,
  departmentFilter,
  onStatusChange,
  onDepartmentChange,
  onClear,
}: {
  statusFilter: AppointmentStatus | "all"
  departmentFilter: string
  onStatusChange: (status: AppointmentStatus | "all") => void
  onDepartmentChange: (department: string) => void
  onClear: () => void
}) {
  const hasFilters = statusFilter !== "all" || !!departmentFilter

  return (
    <div className="appointments-filters">
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as AppointmentStatus | "all")}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="confirmed">Confirmed</option>
        <option value="arrived">Arrived</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </Select>

      <Select
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
        aria-label="Filter by department"
      >
        <option value="">All departments</option>
        <option value="General Medicine">General Medicine</option>
        <option value="Maternal & Child Health">Maternal & Child Health</option>
        <option value="Emergency">Emergency</option>
        <option value="Laboratory">Laboratory</option>
      </Select>

      {hasFilters && (
        <Button className="button secondary" onClick={onClear}>
          <Icon name="close" size={14} />
          Clear filters
        </Button>
      )}
    </div>
  )
}

// Appointment Table
export function AppointmentTable({
  appointments,
  permissions,
  onView,
  onReschedule,
  onCancel,
  onArrival,
  onViewPatient,
}: {
  appointments: AppointmentRecord[]
  permissions: Set<string>
  onView: (appointment: AppointmentRecord) => void
  onReschedule: (appointment: AppointmentRecord) => void
  onCancel: (appointment: AppointmentRecord) => void
  onArrival: (id: string) => void
  onViewPatient: (patientId: string) => void
}) {
  return (
    <div className="appointments-table-wrapper">
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Service</th>
            <th>Clinician</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <strong className="appointment-time">{appointment.time}</strong>
                <small>{appointment.id}</small>
              </td>
              <td>
                <strong className="appointment-patient-name">
                  {appointment.patientName}
                </strong>
                <small>{appointment.patientId}</small>
              </td>
              <td>
                {appointment.service}
                <small>{appointment.department}</small>
              </td>
              <td>{appointment.clinician || "Not assigned"}</td>
              <td>
                <span className={`appointment-status-badge ${appointment.status}`}>
                  {appointmentStatusLabel(appointment.status)}
                </span>
              </td>
              <td>
                <div className="appointment-actions">
                  <Button
                    className="appointment-action-button"
                    onClick={() => onView(appointment)}
                  >
                    View
                  </Button>
                  {appointment.status === "scheduled" &&
                    permissions.has("appointments") && (
                      <>
                        <Button
                          className="appointment-action-button"
                          onClick={() => onReschedule(appointment)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          className="appointment-action-button"
                          onClick={() => onCancel(appointment)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  {(appointment.status === "scheduled" ||
                    appointment.status === "confirmed") &&
                    permissions.has("queue") && (
                      <Button
                        className="appointment-action-button primary"
                        onClick={() => onArrival(appointment.id)}
                      >
                        <Icon name="check" size={14} />
                        Mark Arrived
                      </Button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Schedule Appointment Dialog
export function ScheduleAppointmentDialog({
  existingAppointments,
  initialDraft,
  onSave,
  onCancel,
  onNavigateToRegistration,
}: {
  existingAppointments: AppointmentRecord[]
  initialDraft?: AppointmentDraft
  onSave: (draft: AppointmentDraft) => void
  onCancel: () => void
  onNavigateToRegistration: () => void
}) {
  const [step, setStep] = useState<"patient" | "details" | "review">("patient")
  const [draft, setDraft] = useState<AppointmentDraft>(
    initialDraft || { ...emptyDraft },
  )
  const [patientSearch, setPatientSearch] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([])
  const [saving, setSaving] = useState(false)

  const searchResults = patientSearch
    ? directoryPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.id.toLowerCase().includes(patientSearch.toLowerCase()),
      )
    : []

  const selectPatient = (patient: typeof directoryPatients[0]) => {
    setDraft({ ...draft, patientId: patient.id, patientName: patient.name })
    setStep("details")
  }

  const validateDetails = () => {
    const validationErrors = validateAppointmentDraft(draft)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      const detectedConflicts = detectConflicts(draft, existingAppointments)
      setConflicts(detectedConflicts)
      setStep("review")
    }
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      onSave(draft)
      setSaving(false)
    }, 600)
  }

  return (
    <PreviewDialog
      title={
        step === "patient"
          ? "Schedule Appointment - Select Patient"
          : step === "details"
            ? "Schedule Appointment - Appointment Details"
            : "Schedule Appointment - Review & Confirm"
      }
      onClose={onCancel}
      className="appointment-dialog"
    >
      {step === "patient" && (
        <div className="appointment-dialog-content">
          <Text>Search for an existing patient to schedule an appointment.</Text>

          <label className="appointment-search-field">
            <span>Search patient</span>
            <div className="search-input-wrapper">
              <Icon name="search" size={16} />
              <Input
                type="search"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by name or patient ID"
              />
            </div>
          </label>

          {patientSearch && searchResults.length > 0 && (
            <div className="patient-search-results">
              {searchResults.map((patient) => (
                <button
                  type="button"
                  key={patient.id}
                  className="patient-result-item"
                  onClick={() => selectPatient(patient)}
                >
                  <div>
                    <strong>{patient.name}</strong>
                    <span>{patient.id}</span>
                  </div>
                  <div>
                    <small>{patient.birth}</small>
                    <small>{patient.contact}</small>
                  </div>
                  <Icon name="arrow" size={16} />
                </button>
              ))}
            </div>
          )}

          {patientSearch && searchResults.length === 0 && (
            <div className="patient-not-found">
              <Icon name="info" size={20} />
              <Text>No patients found matching your search.</Text>
              <Button className="button" onClick={onNavigateToRegistration}>
                Register New Patient
              </Button>
            </div>
          )}

          <div className="appointment-dialog-actions">
            <Button className="button secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {step === "details" && (
        <div className="appointment-dialog-content">
          <div className="selected-patient-banner">
            <Icon name="user" size={18} />
            <div>
              <strong>{draft.patientName}</strong>
              <span>{draft.patientId}</span>
            </div>
            <Button
              className="button-link"
              onClick={() => setStep("patient")}
            >
              Change patient
            </Button>
          </div>

          <div className="appointment-form-grid">
            <label>
              Appointment date <span className="required">*</span>
              <Input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                min={new Date().toISOString().slice(0, 10)}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </label>

            <label>
              Appointment time <span className="required">*</span>
              <Input
                type="time"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              />
              {errors.time && <span className="field-error">{errors.time}</span>}
            </label>

            <label className="full-width">
              Service <span className="required">*</span>
              <Select
                value={draft.service}
                onChange={(e) => {
                  const service = services.find((s) => s.label === e.target.value)
                  setDraft({
                    ...draft,
                    service: e.target.value,
                    department: service?.department || "",
                  })
                }}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.label}>
                    {service.label} · {service.department}
                  </option>
                ))}
              </Select>
              {errors.service && (
                <span className="field-error">{errors.service}</span>
              )}
            </label>

            <label className="full-width">
              Assigned clinician (optional)
              <Select
                value={draft.clinician || ""}
                onChange={(e) => setDraft({ ...draft, clinician: e.target.value || null })}
              >
                <option value="">Hospital will assign</option>
                {clinicians.map((clinician) => (
                  <option key={clinician.id} value={clinician.name}>
                    {clinician.name} · {clinician.department}
                  </option>
                ))}
              </Select>
            </label>

            <label className="full-width">
              Appointment reason
              <Input
                value={draft.reason}
                onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
                placeholder="e.g., Follow-up visit, Initial consultation"
              />
            </label>

            <label className="full-width">
              Booking notes (optional)
              <Input
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder="Additional notes for this appointment"
              />
            </label>
          </div>

          <div className="appointment-dialog-actions">
            <Button className="button secondary" onClick={() => setStep("patient")}>
              Back
            </Button>
            <Button className="button" onClick={validateDetails}>
              Review Appointment
            </Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="appointment-dialog-content">
          {conflicts.length > 0 && (
            <div className="scheduling-conflicts">
              {conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className={`conflict-alert ${conflict.severity}`}
                >
                  <Icon name="warning" size={18} />
                  <div>
                    <strong>
                      {conflict.severity === "error"
                        ? "Scheduling Error"
                        : "Potential Conflict"}
                    </strong>
                    <Text>{conflict.message}</Text>
                  </div>
                </div>
              ))}
              {conflicts.some((c) => c.severity === "error") && (
                <Text>
                  Please resolve errors before confirming this appointment.
                </Text>
              )}
            </div>
          )}

          <div className="appointment-review-section">
            <Heading level={3}>Appointment Summary</Heading>
            <dl className="appointment-review-list">
              <div>
                <dt>Patient</dt>
                <dd>
                  {draft.patientName}
                  <small>{draft.patientId}</small>
                </dd>
              </div>
              <div>
                <dt>Date & Time</dt>
                <dd>{formatDateTime(draft.date, draft.time)}</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>
                  {draft.service}
                  <small>{draft.department}</small>
                </dd>
              </div>
              <div>
                <dt>Clinician</dt>
                <dd>{draft.clinician || "Hospital will assign"}</dd>
              </div>
              {draft.reason && (
                <div>
                  <dt>Reason</dt>
                  <dd>{draft.reason}</dd>
                </div>
              )}
              {draft.notes && (
                <div>
                  <dt>Notes</dt>
                  <dd>{draft.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="appointment-dialog-actions">
            <Button
              className="button secondary"
              onClick={() => setStep("details")}
              disabled={saving}
            >
              Edit Details
            </Button>
            <Button
              className="button"
              onClick={handleSave}
              disabled={
                saving || conflicts.some((c) => c.severity === "error")
              }
            >
              {saving ? "Confirming…" : "Confirm Appointment"}
            </Button>
          </div>
        </div>
      )}
    </PreviewDialog>
  )
}

// Reschedule Dialog
export function RescheduleDialog({
  appointment,
  existingAppointments,
  onSave,
  onCancel,
}: {
  appointment: AppointmentRecord
  existingAppointments: AppointmentRecord[]
  onSave: (draft: AppointmentDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<AppointmentDraft>({
    patientId: appointment.patientId,
    patientName: appointment.patientName,
    date: appointment.date,
    time: appointment.time,
    service: appointment.service,
    department: appointment.department,
    clinician: appointment.clinician,
    reason: appointment.reason,
    notes: appointment.notes,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    const validationErrors = validateAppointmentDraft(draft)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      const detectedConflicts = detectConflicts(
        draft,
        existingAppointments,
        appointment.id,
      )
      setConflicts(detectedConflicts)

      if (!detectedConflicts.some((c) => c.severity === "error")) {
        setSaving(true)
        setTimeout(() => {
          onSave(draft)
          setSaving(false)
        }, 600)
      }
    }
  }

  return (
    <PreviewDialog
      title="Reschedule Appointment"
      onClose={onCancel}
      className="appointment-dialog"
    >
      <div className="appointment-dialog-content">
        <div className="original-appointment-banner">
          <Icon name="info" size={18} />
          <div>
            <Text>
              <strong>Original appointment:</strong> {appointment.patientName} ·{" "}
              {formatDateTime(appointment.date, appointment.time)}
            </Text>
          </div>
        </div>

        {conflicts.length > 0 && (
          <div className="scheduling-conflicts">
            {conflicts.map((conflict, index) => (
              <div key={index} className={`conflict-alert ${conflict.severity}`}>
                <Icon name="warning" size={18} />
                <div>
                  <strong>
                    {conflict.severity === "error"
                      ? "Scheduling Error"
                      : "Potential Conflict"}
                  </strong>
                  <Text>{conflict.message}</Text>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="appointment-form-grid">
          <label>
            New appointment date <span className="required">*</span>
            <Input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              min={new Date().toISOString().slice(0, 10)}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </label>

          <label>
            New appointment time <span className="required">*</span>
            <Input
              type="time"
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
            />
            {errors.time && <span className="field-error">{errors.time}</span>}
          </label>
        </div>

        <div className="appointment-dialog-actions">
          <Button
            className="button secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="button"
            onClick={handleSave}
            disabled={saving || conflicts.some((c) => c.severity === "error")}
          >
            {saving ? "Rescheduling…" : "Confirm Reschedule"}
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}

// Cancel Appointment Dialog
export function CancelAppointmentDialog({
  appointment,
  onConfirm,
  onCancel,
}: {
  appointment: AppointmentRecord
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  return (
    <PreviewDialog
      title="Cancel Appointment"
      onClose={onCancel}
      className="appointment-dialog"
    >
      <div className="appointment-dialog-content">
        <div className="cancellation-warning">
          <Icon name="warning" size={24} />
          <div>
            <Heading level={3}>Confirm cancellation</Heading>
            <Text>
              This will cancel the scheduled appointment for{" "}
              <strong>{appointment.patientName}</strong> on{" "}
              {formatDateTime(appointment.date, appointment.time)}.
            </Text>
          </div>
        </div>

        <label className="full-width">
          Cancellation reason
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Patient requested reschedule, Medical emergency"
          />
        </label>

        <label className="cancellation-checkbox">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span>
            I understand this appointment will be cancelled and the patient should
            be notified through the appropriate channel.
          </span>
        </label>

        <div className="appointment-dialog-actions">
          <Button className="button secondary" onClick={onCancel}>
            Keep Appointment
          </Button>
          <Button
            className="button"
            onClick={() => onConfirm(reason)}
            disabled={!confirmed}
          >
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}

// Appointment Detail Panel
export function AppointmentDetailPanel({
  appointment,
  permissions,
  onClose,
  onReschedule,
  onCancel,
  onArrival,
  onViewPatient,
}: {
  appointment: AppointmentRecord
  permissions: Set<string>
  onClose: () => void
  onReschedule: (appointment: AppointmentRecord) => void
  onCancel: (appointment: AppointmentRecord) => void
  onArrival: (id: string) => void
  onViewPatient: (patientId: string) => void
}) {
  return (
    <PreviewDialog
      title="Appointment Details"
      onClose={onClose}
      className="appointment-dialog"
    >
      <div className="appointment-dialog-content">
        <div className="appointment-detail-header">
          <div>
            <Heading level={3}>{appointment.patientName}</Heading>
            <span className="appointment-detail-id">{appointment.id}</span>
          </div>
          <span className={`appointment-status-badge ${appointment.status}`}>
            {appointmentStatusLabel(appointment.status)}
          </span>
        </div>

        <dl className="appointment-detail-list">
          <div>
            <dt>Patient ID</dt>
            <dd>{appointment.patientId}</dd>
          </div>
          <div>
            <dt>Date & Time</dt>
            <dd>{formatDateTime(appointment.date, appointment.time)}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>
              {appointment.service}
              <small>{appointment.department}</small>
            </dd>
          </div>
          <div>
            <dt>Assigned Clinician</dt>
            <dd>{appointment.clinician || "Not assigned"}</dd>
          </div>
          {appointment.reason && (
            <div>
              <dt>Appointment Reason</dt>
              <dd>{appointment.reason}</dd>
            </div>
          )}
          {appointment.notes && (
            <div>
              <dt>Booking Notes</dt>
              <dd>{appointment.notes}</dd>
            </div>
          )}
          <div>
            <dt>Booked By</dt>
            <dd>
              {appointment.bookedBy}
              <small>
                {new Date(appointment.bookedAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </dd>
          </div>
          {appointment.status === "cancelled" && appointment.cancellationReason && (
            <div>
              <dt>Cancellation Reason</dt>
              <dd>{appointment.cancellationReason}</dd>
            </div>
          )}
        </dl>

        <div className="appointment-detail-actions">
          <Button
            className="button secondary"
            onClick={() => onViewPatient(appointment.patientId)}
          >
            View Patient Profile
          </Button>

          {appointment.status === "scheduled" && permissions.has("appointments") && (
            <>
              <Button
                className="button secondary"
                onClick={() => {
                  onClose()
                  onReschedule(appointment)
                }}
              >
                Reschedule
              </Button>
              <Button
                className="button secondary"
                onClick={() => {
                  onClose()
                  onCancel(appointment)
                }}
              >
                Cancel Appointment
              </Button>
            </>
          )}

          {(appointment.status === "scheduled" ||
            appointment.status === "confirmed") &&
            permissions.has("queue") && (
              <Button
                className="button"
                onClick={() => {
                  onArrival(appointment.id)
                  onClose()
                }}
              >
                <Icon name="check" size={16} />
                Mark Arrived
              </Button>
            )}
        </div>
      </div>
    </PreviewDialog>
  )
}

// Empty State
export function AppointmentsEmptyState({
  hasFilters,
  onClearFilters,
  onSchedule,
  canSchedule,
}: {
  hasFilters: boolean
  onClearFilters: () => void
  onSchedule: () => void
  canSchedule: boolean
}) {
  return (
    <div className="appointments-empty-state">
      <Icon name="calendar" size={32} />
      <Heading level={3}>
        {hasFilters ? "No appointments match your filters" : "No appointments scheduled"}
      </Heading>
      <Text>
        {hasFilters
          ? "Try adjusting your search or filters to see more results."
          : "There are no appointments scheduled for the selected date."}
      </Text>
      <div className="empty-state-actions">
        {hasFilters && (
          <Button className="button secondary" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        {canSchedule && (
          <Button className="button" onClick={onSchedule}>
            <Icon name="calendar" size={16} />
            Schedule Appointment
          </Button>
        )}
      </div>
    </div>
  )
}

// Loading State
export function AppointmentLoadingState() {
  return (
    <div className="appointments-loading">
      <div className="loading-skeleton-summary" />
      <div className="loading-skeleton-controls" />
      <div className="loading-skeleton-table" />
    </div>
  )
}

// Error State
export function AppointmentsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="appointments-error-state">
      <Icon name="warning" size={32} />
      <Heading level={2}>Unable to load appointments</Heading>
      <Text>
        Appointment records could not be retrieved. Please try again or contact
        support if the problem persists.
      </Text>
      <Button className="button" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  )
}

// Session Expired State
export function SessionExpiredState() {
  return (
    <div className="appointments-error-state">
      <Icon name="clock" size={32} />
      <Heading level={2}>Session expired</Heading>
      <Text>Your session has expired. Please sign in again to continue.</Text>
      <Button className="button" onClick={() => window.location.reload()}>
        Sign In Again
      </Button>
    </div>
  )
}
