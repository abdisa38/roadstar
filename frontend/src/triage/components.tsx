import type { TriageFormData, AssessmentSection, TriageWorkspaceState, Priority, AllergyStatus } from './model'
import {
  getSectionLabel,
  getPriorityLabel,
  getAllergyStatusLabel,
  formatPatientAge,
  formatArrivalTime,
} from './model'
import Icon from '../Icon'

// Patient Identity Header
type PatientIdentityHeaderProps = {
  patient: TriageFormData
  verified: boolean
  showWarning: boolean
  onVerify: () => void
}

export function PatientIdentityHeader({
  patient,
  verified,
  showWarning,
  onVerify,
}: PatientIdentityHeaderProps) {
  return (
    <div className={`patient-identity-header ${showWarning ? 'identity-warning' : ''}`}>
      {showWarning && (
        <div className="identity-alert">
          <Icon name="alert-circle" size={20} />
          <div>
            <strong>Patient Identity Verification Required</strong>
            <p>Please confirm patient identity and active encounter before proceeding.</p>
          </div>
        </div>
      )}
      
      <div className="identity-main">
        <div className="identity-primary">
          <h2>{patient.patientName}</h2>
          <div className="identity-ids">
            <span className="identity-id">
              <strong>Patient ID:</strong> {patient.patientId}
            </span>
            <span className="identity-id">
              <strong>Encounter:</strong> {patient.encounterId}
            </span>
          </div>
        </div>
        
        <div className="identity-secondary">
          <div className="identity-detail">
            <span className="detail-label">Age</span>
            <span className="detail-value">{formatPatientAge(patient.age, patient.dateOfBirth)}</span>
          </div>
          <div className="identity-detail">
            <span className="detail-label">Sex</span>
            <span className="detail-value">
              {patient.sex === 'not-recorded' ? 'Not recorded' : patient.sex}
            </span>
          </div>
          <div className="identity-detail">
            <span className="detail-label">Arrival</span>
            <span className="detail-value">{formatArrivalTime(patient.arrivalTime)}</span>
          </div>
          <div className="identity-detail">
            <span className="detail-label">Status</span>
            <span className="status-badge status-in-progress">
              {verified ? 'In Assessment' : 'Waiting for Triage'}
            </span>
          </div>
        </div>
      </div>

      {patient.existingAllergies && (
        <div className="identity-allergies">
          <Icon name="alert-circle" size={16} />
          <strong>Known Allergies:</strong>
          <span>{patient.existingAllergies}</span>
        </div>
      )}

      {!verified && !showWarning && (
        <button className="button verification-button" onClick={onVerify}>
          <Icon name="check-circle" size={16} />
          Verify patient identity
        </button>
      )}
    </div>
  )
}

// Assessment Progress Tracker
type AssessmentProgressProps = {
  currentSection: AssessmentSection
  completedSections: Set<AssessmentSection>
  onSectionChange: (section: AssessmentSection) => void
}

export function AssessmentProgress({
  currentSection,
  completedSections,
  onSectionChange,
}: AssessmentProgressProps) {
  const sections: AssessmentSection[] = [
    'patient-verification',
    'chief-complaint',
    'vital-signs',
    'clinical-assessment',
    'priority-escalation',
  ]

  return (
    <div className="assessment-progress">
      {sections.map((section, index) => {
        const isCompleted = completedSections.has(section)
        const isCurrent = currentSection === section
        const isAccessible = index === 0 || completedSections.has(sections[index - 1])

        return (
          <button
            key={section}
            className={`progress-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => isAccessible && onSectionChange(section)}
            disabled={!isAccessible}
          >
            <span className="step-icon">
              {isCompleted ? (
                <Icon name="check-circle" size={20} />
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </span>
            <span className="step-label">{getSectionLabel(section)}</span>
          </button>
        )
      })}
    </div>
  )
}

// Chief Complaint Section
type ChiefComplaintSectionProps = {
  formData: TriageFormData
  errors: Record<string, string>
  onChange: (field: keyof TriageFormData, value: string) => void
  disabled: boolean
}

export function ChiefComplaintSection({
  formData,
  errors,
  onChange,
  disabled,
}: ChiefComplaintSectionProps) {
  return (
    <div className="triage-section">
      <h2>Chief Complaint</h2>
      <p className="section-instruction">
        Document why the patient came to the hospital and relevant symptom information.
      </p>

      <div className="form-field">
        <label htmlFor="chief-complaint">
          Chief Complaint <span className="required">*</span>
        </label>
        <input
          type="text"
          id="chief-complaint"
          value={formData.chiefComplaint}
          onChange={(e) => onChange('chiefComplaint', e.target.value)}
          disabled={disabled}
          className={errors.chiefComplaint ? 'input-error' : ''}
          placeholder="e.g., Persistent cough and fever"
        />
        {errors.chiefComplaint && (
          <span className="error-message">{errors.chiefComplaint}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="symptom-description">Symptom Description</label>
        <textarea
          id="symptom-description"
          value={formData.symptomDescription}
          onChange={(e) => onChange('symptomDescription', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Describe symptoms in detail"
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="symptom-onset">Symptom Onset</label>
          <input
            type="text"
            id="symptom-onset"
            value={formData.symptomOnset}
            onChange={(e) => onChange('symptomOnset', e.target.value)}
            disabled={disabled}
            placeholder="e.g., 3 days ago"
          />
        </div>
        <div className="form-field">
          <label htmlFor="symptom-duration">Duration</label>
          <input
            type="text"
            id="symptom-duration"
            value={formData.symptomDuration}
            onChange={(e) => onChange('symptomDuration', e.target.value)}
            disabled={disabled}
            placeholder="e.g., Continuous"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="additional-symptoms">Additional Symptoms</label>
        <textarea
          id="additional-symptoms"
          value={formData.additionalSymptoms}
          onChange={(e) => onChange('additionalSymptoms', e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Document any related symptoms"
        />
      </div>
    </div>
  )
}

// Vital Signs Section
type VitalSignsSectionProps = {
  formData: TriageFormData
  errors: Record<string, string>
  onChange: (field: keyof TriageFormData, value: string) => void
  disabled: boolean
}

export function VitalSignsSection({
  formData,
  errors,
  onChange,
  disabled,
}: VitalSignsSectionProps) {
  return (
    <div className="triage-section">
      <h2>Vital Signs</h2>
      <p className="section-instruction">
        Record vital sign measurements with appropriate units.
      </p>

      {errors.vitalSigns && (
        <div className="field-error-alert">
          <Icon name="alert-circle" size={16} />
          <span>{errors.vitalSigns}</span>
        </div>
      )}

      <div className="vital-signs-grid">
        <div className="vital-sign-group">
          <h3>Blood Pressure</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="bp-systolic">
                Systolic <span className="unit">(mmHg)</span>
              </label>
              <input
                type="number"
                id="bp-systolic"
                value={formData.bloodPressureSystolic}
                onChange={(e) => onChange('bloodPressureSystolic', e.target.value)}
                disabled={disabled}
                className={errors.bloodPressureSystolic ? 'input-error' : ''}
                placeholder="120"
              />
              {errors.bloodPressureSystolic && (
                <span className="error-message">{errors.bloodPressureSystolic}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="bp-diastolic">
                Diastolic <span className="unit">(mmHg)</span>
              </label>
              <input
                type="number"
                id="bp-diastolic"
                value={formData.bloodPressureDiastolic}
                onChange={(e) => onChange('bloodPressureDiastolic', e.target.value)}
                disabled={disabled}
                className={errors.bloodPressureDiastolic ? 'input-error' : ''}
                placeholder="80"
              />
              {errors.bloodPressureDiastolic && (
                <span className="error-message">{errors.bloodPressureDiastolic}</span>
              )}
            </div>
          </div>
        </div>

        <div className="vital-sign-group">
          <h3>Pulse & Temperature</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="heart-rate">
                Heart Rate <span className="unit">(bpm)</span>
              </label>
              <input
                type="number"
                id="heart-rate"
                value={formData.heartRate}
                onChange={(e) => onChange('heartRate', e.target.value)}
                disabled={disabled}
                className={errors.heartRate ? 'input-error' : ''}
                placeholder="72"
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
                value={formData.temperature}
                onChange={(e) => onChange('temperature', e.target.value)}
                disabled={disabled}
                className={errors.temperature ? 'input-error' : ''}
                placeholder="37.0"
              />
              {errors.temperature && (
                <span className="error-message">{errors.temperature}</span>
              )}
            </div>
          </div>
        </div>

        <div className="vital-sign-group">
          <h3>Respiratory & Oxygen</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="respiratory-rate">
                Respiratory Rate <span className="unit">(breaths/min)</span>
              </label>
              <input
                type="number"
                id="respiratory-rate"
                value={formData.respiratoryRate}
                onChange={(e) => onChange('respiratoryRate', e.target.value)}
                disabled={disabled}
                className={errors.respiratoryRate ? 'input-error' : ''}
                placeholder="16"
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
                value={formData.oxygenSaturation}
                onChange={(e) => onChange('oxygenSaturation', e.target.value)}
                disabled={disabled}
                className={errors.oxygenSaturation ? 'input-error' : ''}
                placeholder="98"
              />
              {errors.oxygenSaturation && (
                <span className="error-message">{errors.oxygenSaturation}</span>
              )}
            </div>
          </div>
        </div>

        <div className="vital-sign-group">
          <h3>Physical Measurements</h3>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="weight">
                Weight <span className="unit">(kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                id="weight"
                value={formData.weight}
                onChange={(e) => onChange('weight', e.target.value)}
                disabled={disabled}
                placeholder="70"
              />
            </div>
            <div className="form-field">
              <label htmlFor="height">
                Height <span className="unit">(cm)</span>
              </label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => onChange('height', e.target.value)}
                disabled={disabled}
                placeholder="170"
              />
            </div>
            <div className="form-field">
              <label htmlFor="pain-score">
                Pain Score <span className="unit">(0-10)</span>
              </label>
              <input
                type="number"
                id="pain-score"
                value={formData.painScore}
                onChange={(e) => onChange('painScore', e.target.value)}
                disabled={disabled}
                min="0"
                max="10"
                className={errors.painScore ? 'input-error' : ''}
                placeholder="0"
              />
              {errors.painScore && (
                <span className="error-message">{errors.painScore}</span>
              )}
              <span className="field-hint">0 = No pain, 10 = Worst pain imaginable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Clinical Observations Section
type ClinicalObservationsSectionProps = {
  formData: TriageFormData
  errors: Record<string, string>
  onChange: (field: keyof TriageFormData, value: string) => void
  disabled: boolean
}

export function ClinicalObservationsSection({
  formData,
  errors,
  onChange,
  disabled,
}: ClinicalObservationsSectionProps) {
  return (
    <div className="triage-section">
      <h2>Clinical Assessment</h2>
      <p className="section-instruction">
        Document your initial clinical assessment and relevant patient history.
      </p>

      <div className="form-field">
        <label htmlFor="general-observations">General Observations</label>
        <textarea
          id="general-observations"
          value={formData.generalObservations}
          onChange={(e) => onChange('generalObservations', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Document patient's general appearance, behavior, and condition"
        />
      </div>

      <div className="form-field">
        <label htmlFor="clinical-findings">Relevant Clinical Findings</label>
        <textarea
          id="clinical-findings"
          value={formData.clinicalFindings}
          onChange={(e) => onChange('clinicalFindings', e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Document relevant observations and findings"
        />
      </div>

      <div className="form-field">
        <label htmlFor="allergy-status">
          Allergy Status <span className="required">*</span>
        </label>
        <select
          id="allergy-status"
          value={formData.allergyStatus}
          onChange={(e) => onChange('allergyStatus', e.target.value as AllergyStatus)}
          disabled={disabled}
          className={errors.allergyStatus ? 'input-error' : ''}
        >
          <option value="not-recorded">Not Recorded</option>
          <option value="no-known-allergies">No Known Allergies</option>
          <option value="allergies-present">Allergies Present</option>
        </select>
        {errors.allergyStatus && (
          <span className="error-message">{errors.allergyStatus}</span>
        )}
      </div>

      {formData.allergyStatus === 'allergies-present' && (
        <div className="form-field">
          <label htmlFor="documented-allergies">
            Document Allergies <span className="required">*</span>
          </label>
          <textarea
            id="documented-allergies"
            value={formData.documentedAllergies}
            onChange={(e) => onChange('documentedAllergies', e.target.value)}
            disabled={disabled}
            rows={3}
            className={errors.documentedAllergies ? 'input-error' : ''}
            placeholder="List all known allergies"
          />
          {errors.documentedAllergies && (
            <span className="error-message">{errors.documentedAllergies}</span>
          )}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="nursing-notes">Additional Nursing Notes</label>
        <textarea
          id="nursing-notes"
          value={formData.nursingNotes}
          onChange={(e) => onChange('nursingNotes', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Additional observations, patient concerns, or contextual information"
        />
      </div>
    </div>
  )
}

// Priority and Escalation Section
type PriorityEscalationSectionProps = {
  formData: TriageFormData
  errors: Record<string, string>
  onChange: (field: keyof TriageFormData, value: string) => void
  disabled: boolean
}

export function PriorityEscalationSection({
  formData,
  errors,
  onChange,
  disabled,
}: PriorityEscalationSectionProps) {
  return (
    <div className="triage-section">
      <h2>Priority & Escalation</h2>
      <p className="section-instruction">
        Record assessment priority according to hospital-approved protocol.
      </p>

      <div className="form-field">
        <label htmlFor="priority">Assessment Priority</label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => onChange('priority', e.target.value as Priority)}
          disabled={disabled}
        >
          <option value="routine">Routine</option>
          <option value="needs-review">Needs Clinical Review</option>
          <option value="urgent-escalation">Urgent Escalation</option>
        </select>
      </div>

      {formData.priority === 'urgent-escalation' && (
        <div className="escalation-alert">
          <Icon name="alert-circle" size={24} />
          <div>
            <strong>Urgent Escalation Selected</strong>
            <p>This patient requires immediate clinical review. Please document the reason for escalation.</p>
          </div>
        </div>
      )}

      {formData.priority !== 'routine' && (
        <>
          <div className="form-field">
            <label htmlFor="escalation-reason">
              Escalation Reason {formData.priority === 'urgent-escalation' && <span className="required">*</span>}
            </label>
            <textarea
              id="escalation-reason"
              value={formData.escalationReason}
              onChange={(e) => onChange('escalationReason', e.target.value)}
              disabled={disabled}
              rows={3}
              className={errors.escalationReason ? 'input-error' : ''}
              placeholder="Document why this patient requires escalated priority"
            />
            {errors.escalationReason && (
              <span className="error-message">{errors.escalationReason}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="escalation-notes">Escalation Notes</label>
            <textarea
              id="escalation-notes"
              value={formData.escalationNotes}
              onChange={(e) => onChange('escalationNotes', e.target.value)}
              disabled={disabled}
              rows={3}
              placeholder="Additional details for clinical team"
            />
          </div>
        </>
      )}
    </div>
  )
}

// Review Summary
type ReviewSummaryProps = {
  formData: TriageFormData
  onEdit: () => void
}

export function ReviewSummary({ formData, onEdit }: ReviewSummaryProps) {
  return (
    <div className="review-summary">
      <div className="review-header">
        <h2>Assessment Review</h2>
        <p>Review all entered information before completing the assessment.</p>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h3>Patient Identity</h3>
          <button className="button text" onClick={onEdit}>
            <Icon name="edit" size={16} />
            Edit
          </button>
        </div>
        <dl className="review-list">
          <dt>Patient Name</dt>
          <dd>{formData.patientName}</dd>
          <dt>Patient ID</dt>
          <dd>{formData.patientId}</dd>
          <dt>Encounter ID</dt>
          <dd>{formData.encounterId}</dd>
        </dl>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h3>Chief Complaint</h3>
        </div>
        <dl className="review-list">
          <dt>Chief Complaint</dt>
          <dd>{formData.chiefComplaint || <em>Not recorded</em>}</dd>
          {formData.symptomDescription && (
            <>
              <dt>Symptom Description</dt>
              <dd>{formData.symptomDescription}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h3>Vital Signs</h3>
        </div>
        <dl className="review-list vital-signs-review">
          {formData.bloodPressureSystolic && formData.bloodPressureDiastolic && (
            <>
              <dt>Blood Pressure</dt>
              <dd>{formData.bloodPressureSystolic}/{formData.bloodPressureDiastolic} mmHg</dd>
            </>
          )}
          {formData.heartRate && (
            <>
              <dt>Heart Rate</dt>
              <dd>{formData.heartRate} bpm</dd>
            </>
          )}
          {formData.temperature && (
            <>
              <dt>Temperature</dt>
              <dd>{formData.temperature}°C</dd>
            </>
          )}
          {formData.respiratoryRate && (
            <>
              <dt>Respiratory Rate</dt>
              <dd>{formData.respiratoryRate} breaths/min</dd>
            </>
          )}
          {formData.oxygenSaturation && (
            <>
              <dt>Oxygen Saturation</dt>
              <dd>{formData.oxygenSaturation}%</dd>
            </>
          )}
          {formData.painScore && (
            <>
              <dt>Pain Score</dt>
              <dd>{formData.painScore}/10</dd>
            </>
          )}
        </dl>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h3>Clinical Assessment</h3>
        </div>
        <dl className="review-list">
          <dt>Allergy Status</dt>
          <dd>{getAllergyStatusLabel(formData.allergyStatus)}</dd>
          {formData.documentedAllergies && (
            <>
              <dt>Documented Allergies</dt>
              <dd>{formData.documentedAllergies}</dd>
            </>
          )}
          {formData.generalObservations && (
            <>
              <dt>General Observations</dt>
              <dd>{formData.generalObservations}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h3>Priority & Escalation</h3>
        </div>
        <dl className="review-list">
          <dt>Priority</dt>
          <dd>
            <span className={`priority-badge priority-${formData.priority}`}>
              {getPriorityLabel(formData.priority)}
            </span>
          </dd>
          {formData.escalationReason && (
            <>
              <dt>Escalation Reason</dt>
              <dd>{formData.escalationReason}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h3>Assessment Information</h3>
        </div>
        <dl className="review-list">
          <dt>Assessed by</dt>
          <dd>{formData.assignedNurse}</dd>
          <dt>Assessment Date</dt>
          <dd>{new Date().toLocaleDateString('en-GB')}</dd>
        </dl>
      </div>
    </div>
  )
}

// Form Actions
type FormActionsProps = {
  workspaceState: TriageWorkspaceState
  isSaving: boolean
  onSaveDraft: () => void
  onReview: () => void
  onComplete: () => void
  onCancel: () => void
  onBackToForm: () => void
  disabled: boolean
}

export function FormActions({
  workspaceState,
  isSaving,
  onSaveDraft,
  onReview,
  onComplete,
  onCancel,
  onBackToForm,
  disabled,
}: FormActionsProps) {
  if (workspaceState === 'review') {
    return (
      <div className="form-actions">
        <button className="button text" onClick={onBackToForm}>
          <Icon name="arrow-left" size={16} />
          Back to form
        </button>
        <button
          className="button"
          onClick={onComplete}
          disabled={isSaving}
        >
          {isSaving ? 'Completing...' : 'Complete Assessment'}
        </button>
      </div>
    )
  }

  return (
    <div className="form-actions">
      <button className="button text" onClick={onCancel} disabled={isSaving}>
        Cancel
      </button>
      <button
        className="button secondary"
        onClick={onSaveDraft}
        disabled={disabled || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Draft'}
      </button>
      <button
        className="button"
        onClick={onReview}
        disabled={disabled || isSaving}
      >
        Review Assessment
      </button>
    </div>
  )
}

// Completion Confirmation
type CompletionConfirmationProps = {
  patient: TriageFormData
  priority: Priority
  onViewAssessment: () => void
  onReturnToQueue: () => void
}

export function CompletionConfirmation({
  patient,
  priority,
  onViewAssessment,
  onReturnToQueue,
}: CompletionConfirmationProps) {
  return (
    <div className="completion-confirmation">
      <div className="completion-icon">
        <Icon name="check-circle" size={64} />
      </div>
      <h2>Assessment Completed</h2>
      <p>Triage assessment for {patient.patientName} has been successfully completed.</p>

      <div className="completion-details">
        <div className="completion-detail">
          <span className="detail-label">Patient ID</span>
          <span className="detail-value">{patient.patientId}</span>
        </div>
        <div className="completion-detail">
          <span className="detail-label">Encounter ID</span>
          <span className="detail-value">{patient.encounterId}</span>
        </div>
        <div className="completion-detail">
          <span className="detail-label">Priority</span>
          <span className={`priority-badge priority-${priority}`}>
            {getPriorityLabel(priority)}
          </span>
        </div>
        <div className="completion-detail">
          <span className="detail-label">Next Step</span>
          <span className="detail-value">
            {priority === 'urgent-escalation'
              ? 'Referred for Urgent Review'
              : priority === 'needs-review'
              ? 'Awaiting Clinical Review'
              : 'Ready for Doctor Review'}
          </span>
        </div>
      </div>

      <div className="completion-actions">
        <button className="button secondary" onClick={onViewAssessment}>
          View Assessment
        </button>
        <button className="button" onClick={onReturnToQueue}>
          Return to Patient Queue
        </button>
      </div>
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
        <p>
          You have unsaved changes in this assessment. Are you sure you want to leave without saving?
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

// Save Failure Dialog
type SaveFailureDialogProps = {
  error: string
  onRetry: () => void
  onCancel: () => void
}

export function SaveFailureDialog({
  error,
  onRetry,
  onCancel,
}: SaveFailureDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="alert-circle" size={24} />
          <h3>Save Failed</h3>
        </div>
        <p>{error}</p>
        <p className="dialog-hint">
          Your entered information has been preserved. Please try saving again.
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
