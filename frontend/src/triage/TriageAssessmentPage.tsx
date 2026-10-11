import { useCallback, useEffect, useState } from 'react'
import type { TriageWorkspaceState, TriageFormData, AssessmentSection } from './model'
import {
  emptyTriageForm,
  validateSection,
  validateCompleteAssessment,
  hasUnsavedChanges,
  formatPatientAge,
  formatArrivalTime,
  samplePatientForTriage,
} from './model'
import {
  PatientIdentityHeader,
  AssessmentProgress,
  ChiefComplaintSection,
  VitalSignsSection,
  ClinicalObservationsSection,
  PriorityEscalationSection,
  ReviewSummary,
  FormActions,
  UnsavedChangesDialog,
  SaveFailureDialog,
  CompletionConfirmation,
} from './components'
import Icon from '../Icon'
import './triage.css'

type TriageAssessmentPageProps = {
  state: 'loading' | 'error' | 'ready'
  patientId: string
  encounterId: string
  onNavigate: (target: string) => void
  onReady: () => void
}

export default function TriageAssessmentPage({
  state,
  patientId,
  encounterId,
  onNavigate,
  onReady,
}: TriageAssessmentPageProps) {
  const [workspaceState, setWorkspaceState] = useState<TriageWorkspaceState>('form')
  const [formData, setFormData] = useState<TriageFormData>(emptyTriageForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentSection, setCurrentSection] = useState<AssessmentSection>('patient-verification')
  const [completedSections, setCompletedSections] = useState<Set<AssessmentSection>>(new Set())
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [showSaveFailure, setShowSaveFailure] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [patientVerified, setPatientVerified] = useState(false)
  const [identityWarning, setIdentityWarning] = useState(false)

  useEffect(() => {
    if (state === 'ready') {
      // Load patient data
      const patient = samplePatientForTriage
      setFormData({
        ...emptyTriageForm,
        patientId: patient.id,
        patientName: patient.name,
        encounterId: patient.encounterId,
        arrivalTime: patient.arrivalTime,
        age: patient.age,
        dateOfBirth: patient.dateOfBirth,
        sex: patient.sex,
        existingAllergies: patient.knownAllergies.join(', '),
        existingConditions: patient.existingConditions.join(', '),
      })
      onReady()
    }
  }, [state, patientId, encounterId, onReady])

  const handleVerifyPatient = useCallback(() => {
    if (!formData.patientId || !formData.encounterId) {
      setIdentityWarning(true)
      return
    }
    setPatientVerified(true)
    setIdentityWarning(false)
    setCompletedSections((prev) => new Set(prev).add('patient-verification'))
    setCurrentSection('chief-complaint')
  }, [formData.patientId, formData.encounterId])

  const handleSectionChange = useCallback((section: AssessmentSection) => {
    setCurrentSection(section)
    const sectionErrors = validateSection(formData, section)
    if (Object.keys(sectionErrors).length === 0) {
      setCompletedSections((prev) => new Set(prev).add(section))
    }
  }, [formData])

  const handleFieldChange = useCallback((field: keyof TriageFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Mark current section as in progress
      const sectionErrors = validateSection(formData, currentSection)
      if (Object.keys(sectionErrors).length === 0) {
        setCompletedSections((prev) => new Set(prev).add(currentSection))
      }
      
      alert('Draft saved successfully')
    } catch (error) {
      setSaveError('Failed to save draft. Please try again.')
      setShowSaveFailure(true)
    } finally {
      setIsSaving(false)
    }
  }, [formData, currentSection])

  const handleReview = useCallback(() => {
    const allErrors = validateCompleteAssessment(formData)
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      alert('Please complete all required fields before reviewing')
      return
    }
    setWorkspaceState('review')
  }, [formData])

  const handleCompleteAssessment = useCallback(async () => {
    const allErrors = validateCompleteAssessment(formData)
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      setWorkspaceState('form')
      alert('Please complete all required fields')
      return
    }

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setWorkspaceState('completed')
    } catch (error) {
      setSaveError('Failed to complete assessment. Please try again.')
      setShowSaveFailure(true)
      setWorkspaceState('form')
    } finally {
      setIsSaving(false)
    }
  }, [formData])

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges(formData)) {
      setShowUnsavedWarning(true)
      return
    }
    onNavigate('nurse-dashboard')
  }, [formData, onNavigate])

  const handleConfirmDiscard = useCallback(() => {
    setShowUnsavedWarning(false)
    onNavigate('nurse-dashboard')
  }, [onNavigate])

  const handleCancelDiscard = useCallback(() => {
    setShowUnsavedWarning(false)
  }, [])

  const handleReturnToQueue = useCallback(() => {
    if (hasUnsavedChanges(formData)) {
      setShowUnsavedWarning(true)
      return
    }
    onNavigate('nurse-dashboard')
  }, [formData, onNavigate])

  if (state === 'loading') {
    return (
      <div className="triage-workspace-loading">
        <div className="spinner" />
        <p>Loading triage assessment…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="triage-workspace-error">
        <Icon name="alert-circle" size={48} />
        <h2>Unable to load assessment</h2>
        <p>The patient record or encounter could not be loaded.</p>
        <button className="button" onClick={() => onNavigate('nurse-dashboard')}>
          Return to patient queue
        </button>
      </div>
    )
  }

  if (workspaceState === 'completed') {
    return (
      <CompletionConfirmation
        patient={formData}
        priority={formData.priority}
        onViewAssessment={() => setWorkspaceState('review')}
        onReturnToQueue={() => onNavigate('nurse-dashboard')}
      />
    )
  }

  return (
    <div className="triage-workspace">
      <div className="triage-workspace-header">
        <div className="triage-breadcrumb">
          <button onClick={() => handleReturnToQueue()} className="breadcrumb-link">
            Nurse Dashboard
          </button>
          <Icon name="chevron" size={12} />
          <button onClick={() => handleReturnToQueue()} className="breadcrumb-link">
            Patient Queue
          </button>
          <Icon name="chevron" size={12} />
          <span>Triage Assessment</span>
        </div>
        <div className="triage-page-header">
          <div>
            <h1>Triage Assessment</h1>
            <p className="triage-page-subtitle">
              Record the patient's initial assessment and vital signs before clinical handoff.
            </p>
          </div>
          <button
            className="button secondary"
            onClick={handleReturnToQueue}
          >
            <Icon name="arrow-left" size={16} />
            Return to queue
          </button>
        </div>
      </div>

      <div className="triage-workspace-content">
        <div className="triage-main-column">
          <PatientIdentityHeader
            patient={formData}
            verified={patientVerified}
            showWarning={identityWarning}
            onVerify={handleVerifyPatient}
          />

          {workspaceState === 'review' ? (
            <ReviewSummary
              formData={formData}
              onEdit={() => setWorkspaceState('form')}
            />
          ) : (
            <>
              <AssessmentProgress
                currentSection={currentSection}
                completedSections={completedSections}
                onSectionChange={handleSectionChange}
              />

              <div className="triage-form">
                {currentSection === 'patient-verification' && (
                  <div className="triage-section">
                    <h2>Patient Verification</h2>
                    <p className="section-instruction">
                      Confirm the patient identity and active encounter before proceeding with assessment.
                    </p>
                    <div className="verification-checklist">
                      <label className="verification-item">
                        <input type="checkbox" checked={!!formData.patientId} readOnly />
                        <span>Patient ID verified: {formData.patientId}</span>
                      </label>
                      <label className="verification-item">
                        <input type="checkbox" checked={!!formData.encounterId} readOnly />
                        <span>Encounter ID verified: {formData.encounterId}</span>
                      </label>
                      <label className="verification-item">
                        <input type="checkbox" checked={!!formData.patientName} readOnly />
                        <span>Patient name confirmed: {formData.patientName}</span>
                      </label>
                    </div>
                    {!patientVerified && (
                      <button
                        className="button"
                        onClick={handleVerifyPatient}
                      >
                        Confirm patient identity and proceed
                      </button>
                    )}
                  </div>
                )}

                {currentSection === 'chief-complaint' && (
                  <ChiefComplaintSection
                    formData={formData}
                    errors={errors}
                    onChange={handleFieldChange}
                    disabled={!patientVerified}
                  />
                )}

                {currentSection === 'vital-signs' && (
                  <VitalSignsSection
                    formData={formData}
                    errors={errors}
                    onChange={handleFieldChange}
                    disabled={!patientVerified}
                  />
                )}

                {currentSection === 'clinical-assessment' && (
                  <ClinicalObservationsSection
                    formData={formData}
                    errors={errors}
                    onChange={handleFieldChange}
                    disabled={!patientVerified}
                  />
                )}

                {currentSection === 'priority-escalation' && (
                  <PriorityEscalationSection
                    formData={formData}
                    errors={errors}
                    onChange={handleFieldChange}
                    disabled={!patientVerified}
                  />
                )}
              </div>
            </>
          )}

          <FormActions
            workspaceState={workspaceState}
            isSaving={isSaving}
            onSaveDraft={handleSaveDraft}
            onReview={handleReview}
            onComplete={handleCompleteAssessment}
            onCancel={handleCancel}
            onBackToForm={() => setWorkspaceState('form')}
            disabled={!patientVerified}
          />
        </div>

        {workspaceState !== 'review' && (
          <div className="triage-sidebar-column">
            <div className="assessment-status-panel">
              <h3>Assessment Status</h3>
              <div className="status-info">
                <div className="status-row">
                  <span className="status-label">Status</span>
                  <span className="status-badge status-in-progress">In Progress</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Started by</span>
                  <span className="status-value">Nurse Demo</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Started at</span>
                  <span className="status-value">{formatArrivalTime(new Date().toISOString())}</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Last modified</span>
                  <span className="status-value">Just now</span>
                </div>
              </div>

              {formData.existingAllergies && (
                <div className="alert-box allergy-alert">
                  <Icon name="alert-circle" size={20} />
                  <div>
                    <strong>Known Allergies</strong>
                    <p>{formData.existingAllergies}</p>
                  </div>
                </div>
              )}

              {formData.existingConditions && (
                <div className="info-box">
                  <strong>Existing Conditions</strong>
                  <p>{formData.existingConditions}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showUnsavedWarning && (
        <UnsavedChangesDialog
          onConfirm={handleConfirmDiscard}
          onCancel={handleCancelDiscard}
        />
      )}

      {showSaveFailure && (
        <SaveFailureDialog
          error={saveError}
          onRetry={() => {
            setShowSaveFailure(false)
            handleSaveDraft()
          }}
          onCancel={() => setShowSaveFailure(false)}
        />
      )}
    </div>
  )
}
