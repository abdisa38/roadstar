import type { PatientClinicalContext, ClinicalNote, ClinicalSection, SaveState } from './model'
import {
  getEncounterStatusLabel,
  getAllergyStatusLabel,
  formatDateTime,
  formatDate,
  formatTime,
} from './model'
import Icon from '../Icon'

// Patient and Encounter Header
type PatientEncounterHeaderProps = {
  patient: PatientClinicalContext
  onReturn: () => void
}

export function PatientEncounterHeader({ patient, onReturn }: PatientEncounterHeaderProps) {
  return (
    <div className="patient-encounter-header">
      <div className="header-content">
        <button className="return-button" onClick={onReturn}>
          <Icon name="arrow-left" size={16} />
          Return to Dashboard
        </button>

        <div className="patient-identity">
          <div className="patient-primary">
            <h1>{patient.patientName}</h1>
            <div className="patient-identifiers">
              <span className="patient-id">
                <strong>Patient ID:</strong> {patient.patientId}
              </span>
              <span className="encounter-id">
                <strong>Encounter:</strong> {patient.encounterId}
              </span>
            </div>
          </div>

          <div className="patient-demographics">
            <div className="demographic-item">
              <span className="demographic-label">Age</span>
              <span className="demographic-value">{patient.age} years</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Sex</span>
              <span className="demographic-value">
                {patient.sex === 'not-recorded' ? 'Not recorded' : patient.sex}
              </span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Date</span>
              <span className="demographic-value">{formatDate(patient.encounterDate)}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Type</span>
              <span className="demographic-value">{patient.encounterType}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Status</span>
              <span className={`status-badge status-${patient.encounterStatus}`}>
                {getEncounterStatusLabel(patient.encounterStatus)}
              </span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Doctor</span>
              <span className="demographic-value">{patient.assignedDoctor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Clinical Safety Summary
type ClinicalSafetySummaryProps = {
  patient: PatientClinicalContext
}

export function ClinicalSafetySummary({ patient }: ClinicalSafetySummaryProps) {
  return (
    <div className="clinical-safety-summary">
      <div className="safety-content">
        <div className="safety-section allergies-section">
          <div className="safety-section-header">
            <Icon name="alert-circle" size={18} />
            <h3>Allergies</h3>
          </div>
          {patient.allergyStatus === 'not-verified' && (
            <div className="allergy-warning">
              <Icon name="alert-triangle" size={16} />
              <span>Allergy information not verified</span>
            </div>
          )}
          {patient.allergyStatus === 'no-known-allergies' && (
            <div className="allergy-none">
              <Icon name="check-circle" size={16} />
              <span>No known allergies documented</span>
            </div>
          )}
          {patient.allergyStatus === 'allergies-documented' && patient.allergies.length > 0 && (
            <ul className="allergy-list">
              {patient.allergies.map((allergy, index) => (
                <li key={index} className={`allergy-item severity-${allergy.severity}`}>
                  <div className="allergy-main">
                    <strong>{allergy.allergen}</strong>
                    <span className={`severity-badge severity-${allergy.severity}`}>
                      {allergy.severity}
                    </span>
                  </div>
                  <div className="allergy-details">
                    <span>Reaction: {allergy.reaction}</span>
                    <span className="allergy-date">Recorded: {formatDate(allergy.recordedDate)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="safety-section vital-signs-section">
          <div className="safety-section-header">
            <Icon name="activity" size={18} />
            <h3>Recent Vital Signs</h3>
          </div>
          {patient.vitalSigns ? (
            <>
              <dl className="vital-signs-grid">
                <dt>BP</dt>
                <dd>{patient.vitalSigns.bloodPressureSystolic}/{patient.vitalSigns.bloodPressureDiastolic} mmHg</dd>
                <dt>HR</dt>
                <dd>{patient.vitalSigns.heartRate} bpm</dd>
                <dt>Temp</dt>
                <dd>{patient.vitalSigns.temperature}°C</dd>
                <dt>RR</dt>
                <dd>{patient.vitalSigns.respiratoryRate} /min</dd>
                <dt>SpO₂</dt>
                <dd>{patient.vitalSigns.oxygenSaturation}%</dd>
              </dl>
              <p className="vitals-timestamp">
                Recorded: {formatDateTime(patient.vitalSigns.recordedAt)} by {patient.vitalSigns.recordedBy}
              </p>
            </>
          ) : (
            <p className="no-vitals">No vital signs recorded for this encounter</p>
          )}
        </div>

        <div className="safety-section reason-section">
          <div className="safety-section-header">
            <Icon name="file-text" size={18} />
            <h3>Reason for Visit</h3>
          </div>
          <p className="chief-complaint">{patient.chiefComplaint}</p>
        </div>
      </div>
    </div>
  )
}

// Clinical Navigation Tabs
type ClinicalNavigationTabsProps = {
  activeSection: ClinicalSection
  onSectionChange: (section: ClinicalSection) => void
  hasUnsavedChanges: boolean
}

export function ClinicalNavigationTabs({
  activeSection,
  onSectionChange,
  hasUnsavedChanges,
}: ClinicalNavigationTabsProps) {
  const tabs: { id: ClinicalSection; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'clinical-notes', label: 'Clinical Notes', icon: 'edit' },
    { id: 'medical-history', label: 'Medical History', icon: 'clock' },
    { id: 'diagnoses', label: 'Diagnoses', icon: 'clipboard' },
    { id: 'prescriptions', label: 'Prescriptions', icon: 'file-plus' },
    { id: 'laboratory', label: 'Laboratory', icon: 'activity' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
  ]

  return (
    <div className="clinical-navigation-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`clinical-tab ${activeSection === tab.id ? 'active' : ''}`}
          onClick={() => onSectionChange(tab.id)}
        >
          <Icon name={tab.icon as any} size={16} />
          <span>{tab.label}</span>
          {tab.id === 'clinical-notes' && hasUnsavedChanges && (
            <span className="unsaved-indicator" title="Unsaved changes" />
          )}
        </button>
      ))}
    </div>
  )
}

// Consultation Note Editor
type ConsultationNoteEditorProps = {
  note: ClinicalNote
  onChange: (field: keyof ClinicalNote, value: string) => void
  saveState: SaveState
  onSave: () => void
  lastSaved: string
}

export function ConsultationNoteEditor({
  note,
  onChange,
  saveState,
  onSave,
  lastSaved,
}: ConsultationNoteEditorProps) {
  return (
    <div className="consultation-note-editor">
      <div className="editor-header">
        <h2>Consultation Notes</h2>
        <div className="editor-actions">
          <span className="last-saved">{lastSaved}</span>
          <button
            className="button"
            onClick={onSave}
            disabled={saveState === 'saving' || saveState === 'saved'}
          >
            {saveState === 'saving' ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      <div className="note-sections">
        <div className="note-section">
          <label htmlFor="chief-complaint">
            <strong>Chief Complaint</strong>
          </label>
          <textarea
            id="chief-complaint"
            value={note.chiefComplaint}
            onChange={(e) => onChange('chiefComplaint', e.target.value)}
            rows={2}
            placeholder="Primary reason for patient's visit"
          />
        </div>

        <div className="note-section">
          <label htmlFor="history-present-illness">
            <strong>History of Present Illness</strong>
          </label>
          <textarea
            id="history-present-illness"
            value={note.historyOfPresentIllness}
            onChange={(e) => onChange('historyOfPresentIllness', e.target.value)}
            rows={5}
            placeholder="Detailed description of the patient's symptoms, onset, duration, and progression"
          />
        </div>

        <div className="note-section">
          <label htmlFor="examination-findings">
            <strong>Relevant Examination Findings</strong>
          </label>
          <textarea
            id="examination-findings"
            value={note.examinationFindings}
            onChange={(e) => onChange('examinationFindings', e.target.value)}
            rows={5}
            placeholder="Physical examination findings relevant to the presenting complaint"
          />
        </div>

        <div className="note-section">
          <label htmlFor="clinical-assessment">
            <strong>Clinical Assessment</strong>
          </label>
          <textarea
            id="clinical-assessment"
            value={note.clinicalAssessment}
            onChange={(e) => onChange('clinicalAssessment', e.target.value)}
            rows={4}
            placeholder="Clinical interpretation and assessment of the patient's condition"
          />
        </div>

        <div className="note-section">
          <label htmlFor="plan">
            <strong>Plan</strong>
          </label>
          <textarea
            id="plan"
            value={note.plan}
            onChange={(e) => onChange('plan', e.target.value)}
            rows={5}
            placeholder="Management plan including investigations, treatment, and follow-up"
          />
        </div>
      </div>
    </div>
  )
}

// Context Panel
type ContextPanelProps = {
  patient: PatientClinicalContext
  onNavigateToSection: (section: ClinicalSection) => void
}

export function ContextPanel({ patient, onNavigateToSection }: ContextPanelProps) {
  return (
    <div className="context-panel">
      <div className="context-section">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            className="action-button"
            onClick={() => onNavigateToSection('medical-history')}
          >
            <Icon name="clock" size={16} />
            <span>View Medical History</span>
          </button>
          <button
            className="action-button"
            onClick={() => onNavigateToSection('diagnoses')}
          >
            <Icon name="clipboard" size={16} />
            <span>Manage Diagnoses</span>
          </button>
          <button
            className="action-button"
            onClick={() => onNavigateToSection('prescriptions')}
          >
            <Icon name="file-plus" size={16} />
            <span>Create Prescription</span>
          </button>
          <button
            className="action-button"
            onClick={() => onNavigateToSection('laboratory')}
          >
            <Icon name="activity" size={16} />
            <span>Order Laboratory Tests</span>
          </button>
        </div>
      </div>

      <div className="context-section">
        <h3>Recent Encounters</h3>
        {patient.previousEncounters.length > 0 ? (
          <ul className="encounter-history">
            {patient.previousEncounters.slice(0, 3).map((encounter) => (
              <li key={encounter.id} className="history-encounter">
                <div className="encounter-date">{formatDate(encounter.date)}</div>
                <div className="encounter-type">{encounter.type}</div>
                <div className="encounter-doctor">{encounter.doctor}</div>
                <div className="encounter-summary">{encounter.summary}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-history">No previous encounters recorded</p>
        )}
        {patient.previousEncounters.length > 3 && (
          <button
            className="button text"
            onClick={() => onNavigateToSection('medical-history')}
          >
            View all encounters
          </button>
        )}
      </div>

      {patient.existingDiagnoses.length > 0 && (
        <div className="context-section">
          <h3>Existing Diagnoses</h3>
          <ul className="context-list">
            {patient.existingDiagnoses.map((diagnosis, index) => (
              <li key={index}>{diagnosis}</li>
            ))}
          </ul>
        </div>
      )}

      {patient.activePrescriptions.length > 0 && (
        <div className="context-section">
          <h3>Active Medications</h3>
          <ul className="context-list">
            {patient.activePrescriptions.map((prescription, index) => (
              <li key={index}>{prescription}</li>
            ))}
          </ul>
        </div>
      )}

      {patient.pendingLabResults > 0 && (
        <div className="context-section">
          <div className="pending-alert">
            <Icon name="alert-circle" size={16} />
            <span>{patient.pendingLabResults} pending lab result(s)</span>
          </div>
          <button
            className="button secondary small"
            onClick={() => onNavigateToSection('laboratory')}
          >
            Review Results
          </button>
        </div>
      )}
    </div>
  )
}

// Save State Indicator
type SaveStateIndicatorProps = {
  saveState: SaveState
  lastSaved: string
  onSave: () => void
}

export function SaveStateIndicator({ saveState, lastSaved, onSave }: SaveStateIndicatorProps) {
  return (
    <div className={`save-state-indicator ${saveState}`}>
      <div className="save-state-content">
        {saveState === 'unsaved' && (
          <>
            <Icon name="alert-circle" size={16} />
            <span>Unsaved changes</span>
          </>
        )}
        {saveState === 'saving' && (
          <>
            <div className="spinner-small" />
            <span>Saving...</span>
          </>
        )}
        {saveState === 'saved' && (
          <>
            <Icon name="check-circle" size={16} />
            <span>All changes saved • {lastSaved}</span>
          </>
        )}
        {saveState === 'error' && (
          <>
            <Icon name="x-circle" size={16} />
            <span>Save failed</span>
            <button className="button small" onClick={onSave}>
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Unsaved Changes Dialog
type UnsavedChangesDialogProps = {
  onConfirm: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({ onConfirm, onCancel }: UnsavedChangesDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="alert-circle" size={24} />
          <h3>Unsaved Changes</h3>
        </div>
        <p>
          You have unsaved changes to the clinical note. Are you sure you want to leave without saving?
        </p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onCancel}>
            Continue Editing
          </button>
          <button className="button danger" onClick={onConfirm}>
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// Save Error Dialog
type SaveErrorDialogProps = {
  error: string
  onRetry: () => void
  onCancel: () => void
}

export function SaveErrorDialog({ error, onRetry, onCancel }: SaveErrorDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="x-circle" size={24} />
          <h3>Save Failed</h3>
        </div>
        <p>{error}</p>
        <p className="dialog-hint">
          Your changes have been preserved in memory. Please try saving again.
        </p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="button" onClick={onRetry}>
            Retry Save
          </button>
        </div>
      </div>
    </div>
  )
}
