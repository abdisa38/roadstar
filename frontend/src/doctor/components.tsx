import type {
  PatientEncounter,
  ClinicalTask,
  Appointment,
  EncounterStatus,
  DashboardSummary,
} from './model'
import {
  getEncounterStatusLabel,
  getTaskTypeLabel,
  getActionLabel,
  calculateWaitTime,
  formatTime,
} from './model'
import Icon from '../Icon'

// Dashboard Summary Cardsjui
type DashboardSummaryCardsProps = {
  summary: DashboardSummary
  onCardClick: (status: EncounterStatus) => void
}

export function DashboardSummaryCards({
  summary,
  onCardClick,
}: DashboardSummaryCardsProps) {
  return (
    <div className="dashboard-summary-cards">
      <button
        className="summary-card"
        onClick={() => onCardClick('waiting')}
      >
        <div className="summary-card-icon blue">
          <Icon name="clock" size={20} />
        </div>
        <div className="summary-card-content">
          <div className="summary-card-value">{summary.waitingForConsultation}</div>
          <div className="summary-card-label">Waiting for Consultation</div>
        </div>
      </button>

      <button
        className="summary-card"
        onClick={() => onCardClick('in-consultation')}
      >
        <div className="summary-card-icon green">
          <Icon name="activity" size={20} />
        </div>
        <div className="summary-card-content">
          <div className="summary-card-value">{summary.inProgress}</div>
          <div className="summary-card-label">In Progress</div>
        </div>
      </button>

      <button
        className="summary-card"
        onClick={() => onCardClick('completed')}
      >
        <div className="summary-card-icon gray">
          <Icon name="check-circle" size={20} />
        </div>
        <div className="summary-card-content">
          <div className="summary-card-value">{summary.completedToday}</div>
          <div className="summary-card-label">Completed Today</div>
        </div>
      </button>

      <button
        className="summary-card"
        onClick={() => onCardClick('ready-for-review')}
      >
        <div className="summary-card-icon yellow">
          <Icon name="file-text" size={20} />
        </div>
        <div className="summary-card-content">
          <div className="summary-card-value">{summary.resultsRequiringReview}</div>
          <div className="summary-card-label">Results Requiring Review</div>
        </div>
      </button>
    </div>
  )
}

// Search and Filters
type SearchAndFiltersProps = {
  search: string
  statusFilter: EncounterStatus | 'all'
  dateFilter: 'today' | 'all'
  assignedToMe: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: EncounterStatus | 'all') => void
  onDateFilterChange: (value: 'today' | 'all') => void
  onAssignedToMeChange: (value: boolean) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function SearchAndFilters({
  search,
  statusFilter,
  dateFilter,
  assignedToMe,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
  onAssignedToMeChange,
  onClearFilters,
  hasActiveFilters,
}: SearchAndFiltersProps) {
  return (
    <div className="search-and-filters">
      <div className="search-input-wrapper">
        <Icon name="search" size={16} />
        <input
          type="text"
          placeholder="Search by patient name or ID…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-row">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as EncounterStatus | 'all')}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="waiting">Waiting</option>
          <option value="in-consultation">In Consultation</option>
          <option value="awaiting-results">Awaiting Results</option>
          <option value="ready-for-review">Ready for Review</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value as 'today' | 'all')}
          className="filter-select"
        >
          <option value="today">Today</option>
          <option value="all">All Dates</option>
        </select>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={assignedToMe}
            onChange={(e) => onAssignedToMeChange(e.target.checked)}
          />
          <span>Assigned to me</span>
        </label>

        {hasActiveFilters && (
          <button onClick={onClearFilters} className="button text">
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

// Patient Queue Table
type PatientQueueTableProps = {
  encounters: PatientEncounter[]
  currentTime: Date
  onOpenPatient: (encounter: PatientEncounter) => void
}

export function PatientQueueTable({
  encounters,
  currentTime,
  onOpenPatient,
}: PatientQueueTableProps) {
  return (
    <div className="patient-queue-table-container">
      <table className="patient-queue-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Encounter ID</th>
            <th>Time</th>
            <th>Chief Complaint</th>
            <th>Status</th>
            <th>Triage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {encounters.map((encounter) => (
            <tr
              key={encounter.id}
              className="queue-row"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return
                onOpenPatient(encounter)
              }}
            >
              <td>
                <div className="patient-info">
                  <strong className="patient-name">{encounter.patientName}</strong>
                  <span className="patient-id">{encounter.patientId}</span>
                </div>
              </td>
              <td>
                <span className="encounter-id">{encounter.id}</span>
              </td>
              <td>
                <div className="time-info">
                  {encounter.appointmentTime && (
                    <span className="appointment-time">
                      <Icon name="calendar" size={14} />
                      {encounter.appointmentTime}
                    </span>
                  )}
                  {encounter.status === 'waiting' && encounter.waitingDuration > 0 && (
                    <span className="wait-time">
                      Waiting {calculateWaitTime(encounter.arrivalTime, currentTime)}
                    </span>
                  )}
                  {!encounter.appointmentTime && encounter.status !== 'waiting' && (
                    <span className="arrival-time">
                      Arrived {formatTime(encounter.arrivalTime)}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className="chief-complaint">{encounter.chiefComplaint}</span>
              </td>
              <td>
                <span className={`status-badge status-${encounter.status}`}>
                  {getEncounterStatusLabel(encounter.status)}
                </span>
              </td>
              <td>
                {encounter.triageCompleted ? (
                  <span className="triage-complete">
                    <Icon name="check-circle" size={14} />
                    Complete
                  </span>
                ) : (
                  <span className="triage-pending">
                    <Icon name="alert-circle" size={14} />
                    Pending
                  </span>
                )}
              </td>
              <td>
                <button
                  className="button small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenPatient(encounter)
                  }}
                >
                  {getActionLabel(encounter.status)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Clinical Tasks Panel
type ClinicalTasksPanelProps = {
  tasks: ClinicalTask[]
  onOpenTask: (task: ClinicalTask) => void
}

export function ClinicalTasksPanel({ tasks, onOpenTask }: ClinicalTasksPanelProps) {
  return (
    <div className="clinical-tasks-panel">
      <div className="panel-header">
        <h3>Clinical Tasks</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-tasks">
          <p>No pending clinical tasks</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <button
                className="task-button"
                onClick={() => onOpenTask(task)}
              >
                <div className="task-header">
                  <span className={`task-type-badge ${task.priority === 'urgent' ? 'urgent' : ''}`}>
                    {getTaskTypeLabel(task.type)}
                  </span>
                  {task.priority === 'urgent' && (
                    <span className="urgent-indicator">
                      <Icon name="alert-circle" size={14} />
                      Urgent
                    </span>
                  )}
                </div>
                <p className="task-patient">
                  <strong>{task.patientName}</strong>
                  <span className="task-patient-id">{task.patientId}</span>
                </p>
                <p className="task-description">{task.description}</p>
                <span className="task-time">{formatTime(task.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Today's Schedule Panel
type TodaysSchedulePanelProps = {
  appointments: Appointment[]
  onOpenAppointment: (appointment: Appointment) => void
}

export function TodaysSchedulePanel({
  appointments,
  onOpenAppointment,
}: TodaysSchedulePanelProps) {
  return (
    <div className="schedule-panel">
      <div className="panel-header">
        <h3>Today's Schedule</h3>
        <span className="appointment-count">{appointments.length}</span>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-schedule">
          <p>No scheduled appointments</p>
        </div>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <button
                className="appointment-button"
                onClick={() => onOpenAppointment(appointment)}
              >
                <div className="appointment-time-slot">{appointment.time}</div>
                <div className="appointment-details">
                  <strong className="appointment-patient">{appointment.patientName}</strong>
                  <span className="appointment-type">{appointment.type}</span>
                </div>
                <span className={`appointment-status status-${appointment.status}`}>
                  {appointment.status === 'scheduled' && 'Scheduled'}
                  {appointment.status === 'arrived' && 'Arrived'}
                  {appointment.status === 'in-progress' && 'In Progress'}
                  {appointment.status === 'completed' && 'Completed'}
                  {appointment.status === 'no-show' && 'No Show'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Empty Queue State
type EmptyQueueStateProps = {
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyQueueState({ hasFilters, onClearFilters }: EmptyQueueStateProps) {
  if (hasFilters) {
    return (
      <div className="empty-queue-state">
        <Icon name="search" size={48} />
        <h3>No patients match your filters</h3>
        <p>Try adjusting your search criteria or clearing the filters.</p>
        <button className="button" onClick={onClearFilters}>
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="empty-queue-state">
      <Icon name="users" size={48} />
      <h3>No patients in queue</h3>
      <p>There are no patients currently assigned to you.</p>
    </div>
  )
}
