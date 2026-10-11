import { useState } from "react"
import Icon from "../Icon"
import PreviewDialog from "../permissions/PreviewDialog"
import { Button, Heading, Input, Select, Text } from "../permissions/ui"
import { patients as directoryPatients } from "../patient-directory/model"
import { sampleAppointments } from "../appointments/model"
import {
  calculateWaitingDuration,
  detectDuplicateQueueEntry,
  emptyQueueDraft,
  queueStatusLabel,
  timeLabel,
  validateQueueDraft,
  type QueueDraft,
  type QueueEntry,
  type QueueStatus,
} from "./model"

// Summary Cards
export function QueueSummaryCards({
  queue,
  onFilterByStatus,
}: {
  queue: QueueEntry[]
  onFilterByStatus: (status: QueueStatus | "all") => void
}) {
  const waiting = queue.filter((e) => e.status === "waiting").length
  const called = queue.filter((e) => e.status === "called").length
  const inService = queue.filter((e) => e.status === "in-service").length
  const completed = queue.filter((e) => e.status === "completed").length

  return (
    <div className="queue-summary-grid">
      <button
        type="button"
        className="queue-summary-card"
        onClick={() => onFilterByStatus("waiting")}
      >
        <div className="summary-card-icon waiting">
          <Icon name="clock" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Waiting</span>
          <strong className="summary-card-value">{waiting}</strong>
          <small>Patients in queue</small>
        </div>
      </button>

      <button
        type="button"
        className="queue-summary-card"
        onClick={() => onFilterByStatus("called")}
      >
        <div className="summary-card-icon called">
          <Icon name="user" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Called</span>
          <strong className="summary-card-value">{called}</strong>
          <small>Called for service</small>
        </div>
      </button>

      <button
        type="button"
        className="queue-summary-card"
        onClick={() => onFilterByStatus("in-service")}
      >
        <div className="summary-card-icon in-service">
          <Icon name="building" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">In Service</span>
          <strong className="summary-card-value">{inService}</strong>
          <small>Currently being served</small>
        </div>
      </button>

      <button
        type="button"
        className="queue-summary-card"
        onClick={() => onFilterByStatus("completed")}
      >
        <div className="summary-card-icon completed">
          <Icon name="check" size={18} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Completed</span>
          <strong className="summary-card-value">{completed}</strong>
          <small>Queue step finished</small>
        </div>
      </button>
    </div>
  )
}

// Date Navigator (reuse from appointments)
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
        <span className="date-display">
          {new Date(selectedDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      <Button
        className="date-nav-button"
        onClick={onNext}
        aria-label="Next day"
      >
        <Icon name="chevron" size={16} />
      </Button>

      <Button className="button secondary" onClick={onToday} disabled={isToday}>
        Today
      </Button>
    </div>
  )
}

// Queue Filters
export function QueueFilters({
  statusFilter,
  departmentFilter,
  onStatusChange,
  onDepartmentChange,
  onClear,
}: {
  statusFilter: QueueStatus | "all"
  departmentFilter: string
  onStatusChange: (status: QueueStatus | "all") => void
  onDepartmentChange: (department: string) => void
  onClear: () => void
}) {
  const hasFilters = statusFilter !== "all" || !!departmentFilter

  return (
    <div className="queue-filters">
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as QueueStatus | "all")}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="waiting">Waiting</option>
        <option value="called">Called</option>
        <option value="in-service">In Service</option>
        <option value="completed">Completed</option>
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

// Queue Table
export function QueueTable({
  entries,
  permissions,
  selectedId,
  onSelect,
  onCall,
  onMarkInService,
  onComplete,
  onLeft,
  onCancel,
  onViewPatient,
}: {
  entries: QueueEntry[]
  permissions: Set<string>
  selectedId: string | null
  onSelect: (entry: QueueEntry) => void
  onCall: (entry: QueueEntry) => void
  onMarkInService: (id: string) => void
  onComplete: (entry: QueueEntry) => void
  onLeft: (entry: QueueEntry) => void
  onCancel: (id: string) => void
  onViewPatient: (patientId: string) => void
}) {
  return (
    <div className="queue-table-wrapper">
      <table className="queue-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Patient</th>
            <th>Arrival Time</th>
            <th>Service</th>
            <th>Waiting</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className={selectedId === entry.id ? "selected" : ""}
            >
              <td>
                {entry.position !== null ? (
                  <span className="queue-position">{entry.position}</span>
                ) : (
                  <span className="queue-position-empty">—</span>
                )}
              </td>
              <td>
                <strong className="queue-patient-name">{entry.patientName}</strong>
                <small>{entry.patientId}</small>
              </td>
              <td>
                <strong>{timeLabel(entry.arrivalTime)}</strong>
                <small>{entry.id}</small>
              </td>
              <td>
                {entry.service}
                <small>{entry.department}</small>
              </td>
              <td>
                <span className="waiting-duration">
                  {entry.status === 'waiting' || entry.status === 'called'
                    ? calculateWaitingDuration(entry.arrivalTime)
                    : '—'}
                </span>
              </td>
              <td>
                <span className={`queue-status-badge ${entry.status}`}>
                  {queueStatusLabel(entry.status)}
                </span>
              </td>
              <td>
                <div className="queue-actions">
                  <Button
                    className="queue-action-button"
                    onClick={() => onSelect(entry)}
                  >
                    View
                  </Button>
                  {entry.status === "waiting" && permissions.has("queue") && (
                    <Button
                      className="queue-action-button primary"
                      onClick={() => onCall(entry)}
                    >
                      Call
                    </Button>
                  )}
                  {entry.status === "called" && permissions.has("queue") && (
                    <Button
                      className="queue-action-button primary"
                      onClick={() => onMarkInService(entry.id)}
                    >
                      In Service
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

// Add to Queue Dialog
export function AddToQueueDialog({
  existingQueue,
  onSave,
  onCancel,
  onNavigateToRegistration,
}: {
  existingQueue: QueueEntry[]
  onSave: (draft: QueueDraft) => void
  onCancel: () => void
  onNavigateToRegistration: () => void
}) {
  const [step, setStep] = useState<"patient" | "details" | "review">("patient")
  const [draft, setDraft] = useState<QueueDraft>({ ...emptyQueueDraft })
  const [patientSearch, setPatientSearch] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [duplicate, setDuplicate] = useState<QueueEntry | null>(null)
  const [saving, setSaving] = useState(false)

  const searchResults = patientSearch
    ? directoryPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.id.toLowerCase().includes(patientSearch.toLowerCase()),
      )
    : []

  const selectPatient = (patient: typeof directoryPatients[0]) => {
    const patientAppointments = sampleAppointments.filter(
      (apt) => apt.patientId === patient.id,
    )
    setDraft({
      ...draft,
      patientId: patient.id,
      patientName: patient.name,
      appointmentId: patientAppointments[0]?.id || null,
    })
    setStep("details")
  }

  const validateAndReview = () => {
    const validationErrors = validateQueueDraft(draft)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      const duplicateEntry = detectDuplicateQueueEntry(draft, existingQueue)
      setDuplicate(duplicateEntry)
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
          ? "Register Arrival - Find Patient"
          : step === "details"
            ? "Register Arrival - Queue Details"
            : "Register Arrival - Review & Confirm"
      }
      onClose={onCancel}
      className="queue-dialog"
    >
      {step === "patient" && (
        <div className="queue-dialog-content">
          <Text>Search for the patient who has arrived.</Text>

          <label className="queue-search-field">
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

          <div className="queue-dialog-actions">
            <Button className="button secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {step === "details" && (
        <div className="queue-dialog-content">
          <div className="selected-patient-banner">
            <Icon name="user" size={18} />
            <div>
              <strong>{draft.patientName}</strong>
              <span>{draft.patientId}</span>
            </div>
            <Button className="button-link" onClick={() => setStep("patient")}>
              Change patient
            </Button>
          </div>

          <div className="queue-form-grid">
            <label className="full-width">
              Service <span className="required">*</span>
              <Select
                value={draft.service}
                onChange={(e) => {
                  const services = [
                    { service: 'General consultation', department: 'General Medicine' },
                    { service: 'Maternal health review', department: 'Maternal & Child Health' },
                    { service: 'Emergency consultation', department: 'Emergency' },
                  ]
                  const selected = services.find(s => s.service === e.target.value)
                  setDraft({
                    ...draft,
                    service: e.target.value,
                    department: selected?.department || '',
                  })
                }}
              >
                <option value="">Select service</option>
                <option value="General consultation">General consultation · General Medicine</option>
                <option value="Maternal health review">Maternal health review · Maternal & Child Health</option>
                <option value="Emergency consultation">Emergency consultation · Emergency</option>
              </Select>
              {errors.service && <span className="field-error">{errors.service}</span>}
            </label>

            <label className="full-width">
              Arrival notes (optional)
              <Input
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder="e.g., Patient arrived early, Walk-in patient"
              />
            </label>
          </div>

          <div className="queue-dialog-actions">
            <Button className="button secondary" onClick={() => setStep("patient")}>
              Back
            </Button>
            <Button className="button" onClick={validateAndReview}>
              Review Queue Entry
            </Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="queue-dialog-content">
          {duplicate && (
            <div className="duplicate-queue-warning">
              <Icon name="warning" size={20} />
              <div>
                <strong>Possible duplicate queue entry detected</strong>
                <Text>
                  {duplicate.patientName} already has an active queue entry (
                  {duplicate.id}) with status "{queueStatusLabel(duplicate.status)}".
                  Review the existing entry before creating a new one.
                </Text>
              </div>
            </div>
          )}

          <div className="queue-review-section">
            <Heading level={3}>Queue Entry Summary</Heading>
            <dl className="queue-review-list">
              <div>
                <dt>Patient</dt>
                <dd>
                  {draft.patientName}
                  <small>{draft.patientId}</small>
                </dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>
                  {draft.service}
                  <small>{draft.department}</small>
                </dd>
              </div>
              {draft.appointmentId && (
                <div>
                  <dt>Associated Appointment</dt>
                  <dd>{draft.appointmentId}</dd>
                </div>
              )}
              {draft.notes && (
                <div>
                  <dt>Notes</dt>
                  <dd>{draft.notes}</dd>
                </div>
              )}
              <div>
                <dt>Arrival Time</dt>
                <dd>Will be recorded at confirmation</dd>
              </div>
            </dl>
          </div>

          <div className="queue-dialog-actions">
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
              disabled={saving || !!duplicate}
            >
              {saving ? "Confirming…" : "Confirm Queue Entry"}
            </Button>
          </div>
        </div>
      )}
    </PreviewDialog>
  )
}

// Call Patient Dialog
export function CallPatientDialog({
  entry,
  onConfirm,
  onCancel,
}: {
  entry: QueueEntry
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <PreviewDialog
      title="Call Patient"
      onClose={onCancel}
      className="queue-dialog"
    >
      <div className="queue-dialog-content">
        <div className="queue-action-info">
          <Icon name="user" size={22} />
          <div>
            <Heading level={3}>Call {entry.patientName}</Heading>
            <Text>
              This will update the queue status to "Called" and record the time.
              The patient should proceed to the service area.
            </Text>
          </div>
        </div>

        <dl className="queue-detail-list">
          <div>
            <dt>Patient ID</dt>
            <dd>{entry.patientId}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{entry.service}</dd>
          </div>
          <div>
            <dt>Waiting Duration</dt>
            <dd>{calculateWaitingDuration(entry.arrivalTime)}</dd>
          </div>
        </dl>

        <div className="queue-dialog-actions">
          <Button className="button secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="button" onClick={onConfirm}>
            Confirm Call
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}

// Complete Queue Dialog
export function CompleteQueueDialog({
  entry,
  onConfirm,
  onCancel,
}: {
  entry: QueueEntry
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <PreviewDialog
      title="Complete Queue Step"
      onClose={onCancel}
      className="queue-dialog"
    >
      <div className="queue-dialog-content">
        <div className="queue-action-info">
          <Icon name="check" size={22} />
          <div>
            <Heading level={3}>Complete queue entry</Heading>
            <Text>
              This will mark the queue step as completed for {entry.patientName}.
              This does not automatically complete the entire visit or encounter.
            </Text>
          </div>
        </div>

        <div className="queue-dialog-actions">
          <Button className="button secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="button" onClick={onConfirm}>
            Mark Completed
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}

// Left Before Service Dialog
export function LeftBeforeServiceDialog({
  entry,
  onConfirm,
  onCancel,
}: {
  entry: QueueEntry
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <PreviewDialog
      title="Record Patient Left"
      onClose={onCancel}
      className="queue-dialog"
    >
      <div className="queue-dialog-content">
        <div className="queue-warning-info">
          <Icon name="warning" size={22} />
          <div>
            <Heading level={3}>Patient left before service</Heading>
            <Text>
              Record that {entry.patientName} left before receiving service. This
              status should only be used when the patient has departed without
              being served.
            </Text>
          </div>
        </div>

        <div className="queue-dialog-actions">
          <Button className="button secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="button" onClick={onConfirm}>
            Confirm Left Before Service
          </Button>
        </div>
      </div>
    </PreviewDialog>
  )
}

// Queue Entry Detail Panel
export function QueueEntryDetailPanel({
  entry,
  permissions,
  onClose,
  onCall,
  onMarkInService,
  onComplete,
  onLeft,
  onCancel,
  onViewPatient,
}: {
  entry: QueueEntry
  permissions: Set<string>
  onClose: () => void
  onCall: () => void
  onMarkInService: () => void
  onComplete: () => void
  onLeft: () => void
  onCancel: () => void
  onViewPatient: (patientId: string) => void
}) {
  return (
    <PreviewDialog
      title="Queue Entry Details"
      onClose={onClose}
      className="queue-dialog"
    >
      <div className="queue-dialog-content">
        <div className="queue-entry-header">
          <div>
            <Heading level={3}>{entry.patientName}</Heading>
            <span className="queue-entry-id">{entry.id}</span>
          </div>
          <span className={`queue-status-badge ${entry.status}`}>
            {queueStatusLabel(entry.status)}
          </span>
        </div>

        <dl className="queue-detail-list">
          <div>
            <dt>Patient ID</dt>
            <dd>{entry.patientId}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>
              {entry.service}
              <small>{entry.department}</small>
            </dd>
          </div>
          <div>
            <dt>Arrival Time</dt>
            <dd>{new Date(entry.arrivalTime).toLocaleString('en-GB')}</dd>
          </div>
          {entry.position !== null && (
            <div>
              <dt>Queue Position</dt>
              <dd>{entry.position}</dd>
            </div>
          )}
          {(entry.status === 'waiting' || entry.status === 'called') && (
            <div>
              <dt>Waiting Duration</dt>
              <dd>{calculateWaitingDuration(entry.arrivalTime)}</dd>
            </div>
          )}
          {entry.calledTime && (
            <div>
              <dt>Called Time</dt>
              <dd>{new Date(entry.calledTime).toLocaleString('en-GB')}</dd>
            </div>
          )}
          {entry.serviceStartTime && (
            <div>
              <dt>Service Start Time</dt>
              <dd>{new Date(entry.serviceStartTime).toLocaleString('en-GB')}</dd>
            </div>
          )}
          {entry.completedTime && (
            <div>
              <dt>Completed Time</dt>
              <dd>{new Date(entry.completedTime).toLocaleString('en-GB')}</dd>
            </div>
          )}
          {entry.appointmentId && (
            <div>
              <dt>Associated Appointment</dt>
              <dd>{entry.appointmentId}</dd>
            </div>
          )}
          {entry.notes && (
            <div>
              <dt>Notes</dt>
              <dd>{entry.notes}</dd>
            </div>
          )}
        </dl>

        <div className="queue-entry-actions">
          <Button
            className="button secondary"
            onClick={() => onViewPatient(entry.patientId)}
          >
            View Patient Profile
          </Button>

          {permissions.has("queue") && (
            <>
              {entry.status === "waiting" && (
                <Button className="button" onClick={onCall}>
                  <Icon name="user" size={16} />
                  Call Patient
                </Button>
              )}
              {entry.status === "called" && (
                <Button className="button" onClick={onMarkInService}>
                  Mark In Service
                </Button>
              )}
              {entry.status === "in-service" && (
                <Button className="button" onClick={onComplete}>
                  Complete Queue Step
                </Button>
              )}
              {(entry.status === "waiting" || entry.status === "called") && (
                <Button className="button secondary" onClick={onLeft}>
                  Record Left Before Service
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </PreviewDialog>
  )
}

// Empty State
export function QueueEmptyState({
  hasFilters,
  onClearFilters,
  onAddToQueue,
  canAdd,
}: {
  hasFilters: boolean
  onClearFilters: () => void
  onAddToQueue: () => void
  canAdd: boolean
}) {
  return (
    <div className="queue-empty-state">
      <Icon name="clock" size={32} />
      <Heading level={3}>
        {hasFilters ? "No queue entries match your filters" : "No patients in queue"}
      </Heading>
      <Text>
        {hasFilters
          ? "Try adjusting your search or filters to see more results."
          : "There are no queue entries for the selected date."}
      </Text>
      <div className="empty-state-actions">
        {hasFilters && (
          <Button className="button secondary" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        {canAdd && (
          <Button className="button" onClick={onAddToQueue}>
            <Icon name="user" size={16} />
            Register Arrival
          </Button>
        )}
      </div>
    </div>
  )
}

// Loading State
export function QueueLoadingState() {
  return (
    <div className="queue-loading">
      <div className="loading-skeleton-summary" />
      <div className="loading-skeleton-controls" />
      <div className="loading-skeleton-table" />
    </div>
  )
}

// Error State
export function QueueErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="queue-error-state">
      <Icon name="warning" size={32} />
      <Heading level={2}>Unable to load queue</Heading>
      <Text>
        Queue entries could not be retrieved. Please try again or contact support
        if the problem persists.
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
    <div className="queue-error-state">
      <Icon name="clock" size={32} />
      <Heading level={2}>Session expired</Heading>
      <Text>Your session has expired. Please sign in again to continue.</Text>
      <Button className="button" onClick={() => window.location.reload()}>
        Sign In Again
      </Button>
    </div>
  )
}
