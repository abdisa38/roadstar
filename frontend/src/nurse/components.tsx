import type { TriageAssessment, TriageDraft, PatientContext } from './model'
import {
  triageStatusLabel,
  priorityLabel,
  calculateWaitTime,
  timeDisplay,
} from './model'
import Icon from '../Icon'

// Summary Cards
type NurseSummaryCardsProps = {
  summary: {
    waitingForTriage: number
    inAssessment: number
    assessmentCompleted: number
    needsReview: number
  }
}

export function NurseSummaryCards({ summary }: NurseSummaryCardsProps) {
  return (
    <div className="nurse-summary-cards">
      <div className="nurse-summary-card">
        <div className="nurse-summary-card-icon blue">
          <Icon name="users" size={20} />
        </div>
        <div className="nurse-summary-card-content">
          <div className="nurse-summary-card-value">{summary.waitingForTriage}</div>
          <div className="nurse-summary-card-label">Waiting for Triage</div>
        </div>
      </div>

      <div className="nurse-summary-card">
        <div className="nurse-summary-card-icon yellow">
          <Icon name="clipboard" size={20} />
        </div>
        <div className="nurse-summary-card-content">
          <div className="nurse-summary-card-value">{summary.inAssessment}</div>
          <div className="nurse-summary-card-label">In Assessment</div>
        </div>
      </div>

      <div className="nurse-summary-card">
        <div className="nurse-summary-card-icon green">
          <Icon name="check-circle" size={20} />
        </div>
        <div className="nurse-summary-card-content">
          <div className="nurse-summary-card-value">{summary.assessmentCompleted}</div>
          <div className="nurse-summary-card-label">Triage Completed</div>
        </div>
      </div>

      <div className="nurse-summary-card">
        <div className="nurse-summary-card-icon red">
          <Icon name="alert-circle" size={20} />
        </div>
        <div className="nurse-summary-card-content">
          <div className="nurse-summary-card-value">{summary.needsReview}</div>
          <div className="nurse-summary-card-label">Requiring Review</div>
        </div>
      </div>
    </div>
  )
}

// Triage Queue Table
type TriageQueueTableProps = {
  assessments: TriageAssessment[]
  currentTime: Date
  onStartTriage: (assessment: TriageAssessment) => void
  onResumeTriage: (assessment: TriageAssessment) => void
  onViewAssessment: (assessment: TriageAssessment) => void
}

export function TriageQueueTable({
  assessments,
  currentTime,
  onStartTriage,
  onResumeTriage,
  onViewAssessment,
}: TriageQueueTableProps) {
  if (assessments.length === 0) {
    return (
      <div className="nurse-empty-state">
        <Icon name="clipboard" size={48} />
        <h3>No patients in queue</h3>
        <p>There are no patients matching your current filters.</p>
      </div>
    )
  }

  return (
    <div className="nurse-table-container">
      <table className="nurse-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Arrival Time</th>
            <th>Wait Time</th>
            <th>Chief Complaint</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned Nurse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr
              key={assessment.id}
              className="nurse-table-row"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return
                onViewAssessment(assessment)
              }}
            >
              <td>
                <span className="patient-id">{assessment.patientId}</span>
              </td>
              <td>
                <strong>{assessment.patientName}</strong>
              </td>
              <td>{timeDisplay(assessment.arrivalTime)}</td>
              <td>{calculateWaitTime(assessment.arrivalTime, currentTime)}</td>
              <td>
                <span className="chief-complaint">{assessment.chiefComplaint}</span>
              </td>
              <td>
                <span className={`priority-badge priority-${assessment.priority}`}>
                  {priorityLabel(assessment.priority)}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${assessment.status}`}>
                  {triageStatusLabel(assessment.status)}
                </span>
              </td>
              <td>
                {assessment.assignedNurse || (
                  <span className="text-muted">Not assigned</span>
                )}
              </td>
              <td>
                <div className="nurse-table-actions">
                  {assessment.status === 'waiting-for-triage' && (
                    <button
                      className="button small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onStartTriage(assessment)
                      }}
                    >
                      Start Triage
                    </button>
                  )}
                  {assessment.status === 'in-assessment' && (
                    <button
                      className="button small secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        onResumeTriage(assessment)
                      }}
                    >
                      Resume
                    </button>
                  )}
                  {assessment.status === 'assessment-completed' && (
                    <button
                      className="button small text"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewAssessment(assessment)
                      }}
                    >
                      View
                    </button>
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

// Patient Summary Panel
type PatientSummaryPanelProps = {
  patient: PatientContext
  onClose: () => void
}

export function PatientSummaryPanel({ patient, onClose }: PatientSummaryPanelProps) {
  return (
    <div className="patient-summary-panel">
      <div className="patient-summary-header">
        <h3>Patient Summary</h3>
        <button className="icon-button" onClick={onClose} aria-label="Close panel">
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="patient-summary-content">
        <div className="patient-summary-section">
          <div className="patient-summary-identity">
            <div className="patient-avatar">
              <Icon name="user" size={24} />
            </div>
            <div>
              <h4>{patient.name}</h4>
              <p className="patient-id">{patient.id}</p>
            </div>
          </div>
        </div>

        <div className="patient-summary-section">
          <h5>Demographics</h5>
          <dl className="patient-summary-list">
            <dt>Age</dt>
            <dd>{patient.age ?? 'Not recorded'}</dd>
            <dt>Sex</dt>
            <dd>{patient.sex === 'not-recorded' ? 'Not recorded' : patient.sex}</dd>
            <dt>Contact</dt>
            <dd>{patient.contactPhone || 'Not recorded'}</dd>
          </dl>
        </div>

        <div className="patient-summary-section">
          <h5>Visit Information</h5>
          <dl className="patient-summary-list">
            <dt>Encounter ID</dt>
            <dd>{patient.encounterId}</dd>
            <dt>Arrival Time</dt>
            <dd>{timeDisplay(patient.arrivalTime)}</dd>
            <dt>Chief Complaint</dt>
            <dd>{patient.chiefComplaint}</dd>
          </dl>
        </div>

        <div className="patient-summary-section">
          <h5>Known Allergies</h5>
          {patient.knownAllergies.length > 0 ? (
            <ul className="allergy-list">
              {patient.knownAllergies.map((allergy, index) => (
                <li key={index} className="allergy-item">
                  <Icon name="alert-circle" size={14} />
                  {allergy}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No known allergies recorded</p>
          )}
        </div>

        <div className="patient-summary-section">
          <h5>Existing Conditions</h5>
          {patient.existingConditions.length > 0 ? (
            <ul className="condition-list">
              {patient.existingConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No existing conditions recorded</p>
          )}
        </div>

        {patient.recentVitals && (
          <div className="patient-summary-section">
            <h5>Recent Vital Signs</h5>
            <dl className="vital-signs-grid">
              <dt>Blood Pressure</dt>
              <dd>
                {patient.recentVitals.bloodPressureSystolic}/
                {patient.recentVitals.bloodPressureDiastolic} mmHg
              </dd>
              <dt>Heart Rate</dt>
              <dd>{patient.recentVitals.heartRate} bpm</dd>
              <dt>Temperature</dt>
              <dd>
                {patient.recentVitals.temperature}°
                {patient.recentVitals.temperatureUnit === 'celsius' ? 'C' : 'F'}
              </dd>
              <dt>SpO₂</dt>
              <dd>{patient.recentVitals.oxygenSaturation}%</dd>
            </dl>
            <p className="vitals-timestamp">
              Recorded: {timeDisplay(patient.recentVitals.recordedAt)}
            </p>
          </div>
        )}

        <div className="patient-summary-section">
          <h5>Triage Status</h5>
          <span className={`status-badge status-${patient.triageStatus}`}>
            {triageStatusLabel(patient.triageStatus)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Quick Triage Dialog
type QuickTriageDialogProps = {
  draft: TriageDraft
  errors: Record<string, string>
  onUpdate: (draft: TriageDraft) => void
  onSaveDraft: () => void
  onComplete: () => void
  onCancel: () => void
}

export function QuickTriageDialog({
  draft,
  errors,
  onUpdate,
  onSaveDraft,
  onComplete,
  onCancel,
}: QuickTriageDialogProps) {
  return (
    <div className="triage-dialog-overlay" onClick={onCancel}>
      <div className="triage-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="triage-dialog-header">
          <h2>Quick Triage Assessment</h2>
          <button className="icon-button" onClick={onCancel} aria-label="Close dialog">
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="triage-dialog-content">
          <div className="triage-section">
            <h3>Patient Context</h3>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="patient-id">Patient ID</label>
                <input
                  type="text"
                  id="patient-id"
                  value={draft.patientId}
                  disabled
                  className="input-disabled"
                />
              </div>
              <div className="form-field">
                <label htmlFor="encounter-id">Encounter ID</label>
                <input
                  type="text"
                  id="encounter-id"
                  value={draft.encounterId}
                  disabled
                  className="input-disabled"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="chief-complaint">Chief Complaint *</label>
              <input
                type="text"
                id="chief-complaint"
                value={draft.chiefComplaint}
                onChange={(e) => onUpdate({ ...draft, chiefComplaint: e.target.value })}
                className={errors.chiefComplaint ? 'input-error' : ''}
              />
              {errors.chiefComplaint && (
                <span className="error-message">{errors.chiefComplaint}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="symptom-description">Symptom Description</label>
              <textarea
                id="symptom-description"
                value={draft.symptomDescription}
                onChange={(e) => onUpdate({ ...draft, symptomDescription: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="triage-section">
            <h3>Vital Signs</h3>
            <div className="vital-signs-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="bp-systolic">
                    Systolic BP <span className="unit">(mmHg)</span>
                  </label>
                  <input
                    type="number"
                    id="bp-systolic"
                    value={draft.bloodPressureSystolic}
                    onChange={(e) =>
                      onUpdate({ ...draft, bloodPressureSystolic: e.target.value })
                    }
                    className={errors.bloodPressureSystolic ? 'input-error' : ''}
                  />
                  {errors.bloodPressureSystolic && (
                    <span className="error-message">{errors.bloodPressureSystolic}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="bp-diastolic">
                    Diastolic BP <span className="unit">(mmHg)</span>
                  </label>
                  <input
                    type="number"
                    id="bp-diastolic"
                    value={draft.bloodPressureDiastolic}
                    onChange={(e) =>
                      onUpdate({ ...draft, bloodPressureDiastolic: e.target.value })
                    }
                    className={errors.bloodPressureDiastolic ? 'input-error' : ''}
                  />
                  {errors.bloodPressureDiastolic && (
                    <span className="error-message">{errors.bloodPressureDiastolic}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="heart-rate">
                    Heart Rate <span className="unit">(bpm)</span>
                  </label>
                  <input
                    type="number"
                    id="heart-rate"
                    value={draft.heartRate}
                    onChange={(e) => onUpdate({ ...draft, heartRate: e.target.value })}
                    className={errors.heartRate ? 'input-error' : ''}
                  />
                  {errors.heartRate && (
                    <span className="error-message">{errors.heartRate}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="temperature">
                    Temperature <span className="unit">(°C)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="temperature"
                    value={draft.temperature}
                    onChange={(e) => onUpdate({ ...draft, temperature: e.target.value })}
                    className={errors.temperature ? 'input-error' : ''}
                  />
                  {errors.temperature && (
                    <span className="error-message">{errors.temperature}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="respiratory-rate">
                    Respiratory Rate <span className="unit">(breaths/min)</span>
                  </label>
                  <input
                    type="number"
                    id="respiratory-rate"
                    value={draft.respiratoryRate}
                    onChange={(e) =>
                      onUpdate({ ...draft, respiratoryRate: e.target.value })
                    }
                    className={errors.respiratoryRate ? 'input-error' : ''}
                  />
                  {errors.respiratoryRate && (
                    <span className="error-message">{errors.respiratoryRate}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="oxygen-saturation">
                    Oxygen Saturation <span className="unit">(%)</span>
                  </label>
                  <input
                    type="number"
                    id="oxygen-saturation"
                    value={draft.oxygenSaturation}
                    onChange={(e) =>
                      onUpdate({ ...draft, oxygenSaturation: e.target.value })
                    }
                    className={errors.oxygenSaturation ? 'input-error' : ''}
                  />
                  {errors.oxygenSaturation && (
                    <span className="error-message">{errors.oxygenSaturation}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="weight">
                    Weight <span className="unit">(kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="weight"
                    value={draft.weight}
                    onChange={(e) => onUpdate({ ...draft, weight: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="height">
                    Height <span className="unit">(cm)</span>
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={draft.height}
                    onChange={(e) => onUpdate({ ...draft, height: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="pain-score">
                    Pain Score <span className="unit">(0-10)</span>
                  </label>
                  <input
                    type="number"
                    id="pain-score"
                    value={draft.painScore}
                    onChange={(e) => onUpdate({ ...draft, painScore: e.target.value })}
                    min="0"
                    max="10"
                    className={errors.painScore ? 'input-error' : ''}
                  />
                  {errors.painScore && (
                    <span className="error-message">{errors.painScore}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="triage-section">
            <h3>Clinical Assessment</h3>
            <div className="form-field">
              <label htmlFor="allergies">Known Allergies</label>
              <input
                type="text"
                id="allergies"
                value={draft.allergies}
                onChange={(e) => onUpdate({ ...draft, allergies: e.target.value })}
                placeholder="Separate multiple allergies with commas"
              />
            </div>

            <div className="form-field">
              <label htmlFor="existing-conditions">Existing Conditions</label>
              <input
                type="text"
                id="existing-conditions"
                value={draft.existingConditions}
                onChange={(e) =>
                  onUpdate({ ...draft, existingConditions: e.target.value })
                }
                placeholder="Separate multiple conditions with commas"
              />
            </div>

            <div className="form-field">
              <label htmlFor="initial-observations">Initial Observations</label>
              <textarea
                id="initial-observations"
                value={draft.initialObservations}
                onChange={(e) =>
                  onUpdate({ ...draft, initialObservations: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="form-field">
              <label htmlFor="clinical-notes">Clinical Notes</label>
              <textarea
                id="clinical-notes"
                value={draft.clinicalNotes}
                onChange={(e) => onUpdate({ ...draft, clinicalNotes: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="triage-dialog-footer">
          <button className="button text" onClick={onCancel}>
            Cancel
          </button>
          <button className="button secondary" onClick={onSaveDraft}>
            Save Draft
          </button>
          <button className="button" onClick={onComplete}>
            Complete Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

// Recent Activity Panel
type RecentActivityPanelProps = {
  assessments: TriageAssessment[]
}

export function RecentActivityPanel({ assessments }: RecentActivityPanelProps) {
  const recentActivity = assessments
    .filter((a) => a.status === 'assessment-completed' || a.status === 'in-assessment')
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 5)

  return (
    <div className="recent-activity-panel">
      <h3>Recent Activity</h3>
      {recentActivity.length === 0 ? (
        <p className="text-muted">No recent activity</p>
      ) : (
        <ul className="activity-list">
          {recentActivity.map((assessment) => (
            <li key={assessment.id} className="activity-item">
              <div className="activity-icon">
                <Icon
                  name={
                    assessment.status === 'assessment-completed'
                      ? 'check-circle'
                      : 'clipboard'
                  }
                  size={16}
                />
              </div>
              <div className="activity-content">
                <p className="activity-title">
                  {assessment.status === 'assessment-completed'
                    ? 'Assessment completed'
                    : 'Assessment in progress'}
                </p>
                <p className="activity-patient">{assessment.patientName}</p>
                <p className="activity-time">{timeDisplay(assessment.lastModified)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Unsaved Changes Dialog
type UnsavedChangesDialogProps = {
  onConfirm: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({
  onConfirm,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="alert-circle" size={24} />
          <h3>Unsaved Changes</h3>
        </div>
        <p>You have unsaved changes in the current assessment. Do you want to discard them?</p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onCancel}>
            Keep Editing
          </button>
          <button className="button danger" onClick={onConfirm}>
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  )
}
