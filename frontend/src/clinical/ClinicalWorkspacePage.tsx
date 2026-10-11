import { useCallback, useEffect, useState } from 'react'
import type { PatientClinicalContext, ClinicalNote, ClinicalSection, SaveState } from './model'
import {
  samplePatientContext,
  emptyClinicalNote,
  hasUnsavedChanges,
  getTimeSinceLastSave,
} from './model'
import {
  PatientEncounterHeader,
  ClinicalSafetySummary,
  ClinicalNavigationTabs,
  ConsultationNoteEditor,
  ContextPanel,
  SaveStateIndicator,
  UnsavedChangesDialog,
  SaveErrorDialog,
} from './components'
import Icon from '../Icon'
import './clinical.css'

type ClinicalWorkspacePageProps = {
  state: 'loading' | 'error' | 'ready'
  encounterId: string
  patientId: string
  onNavigate: (target: string) => void
  onReady: () => void
}

export default function ClinicalWorkspacePage({
  state,
  encounterId,
  patientId,
  onNavigate,
  onReady,
}: ClinicalWorkspacePageProps) {
  const [patientContext, setPatientContext] = useState<PatientClinicalContext>(samplePatientContext)
  const [originalNote, setOriginalNote] = useState<ClinicalNote>(samplePatientContext.clinicalNote)
  const [currentNote, setCurrentNote] = useState<ClinicalNote>(samplePatientContext.clinicalNote)
  const [activeSection, setActiveSection] = useState<ClinicalSection>('clinical-notes')
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [showSaveError, setShowSaveError] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  useEffect(() => {
    if (state === 'ready') {
      // Load patient context
      setPatientContext(samplePatientContext)
      setOriginalNote(samplePatientContext.clinicalNote)
      setCurrentNote(samplePatientContext.clinicalNote)
      onReady()
    }
  }, [state, encounterId, patientId, onReady])

  useEffect(() => {
    // Track unsaved changes
    if (hasUnsavedChanges(currentNote, originalNote)) {
      setSaveState('unsaved')
    } else if (saveState === 'unsaved') {
      setSaveState('saved')
    }
  }, [currentNote, originalNote, saveState])

  const handleNoteChange = useCallback((field: keyof ClinicalNote, value: string) => {
    setCurrentNote((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSaveDraft = useCallback(async () => {
    setSaveState('saving')
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const savedNote = {
        ...currentNote,
        lastModified: new Date().toISOString(),
      }
      
      setOriginalNote(savedNote)
      setCurrentNote(savedNote)
      setPatientContext((prev) => ({
        ...prev,
        clinicalNote: savedNote,
      }))
      setSaveState('saved')
    } catch (error) {
      setSaveError('Failed to save clinical note. Please try again.')
      setShowSaveError(true)
      setSaveState('error')
    }
  }, [currentNote])

  const handleReturnToDashboard = useCallback(() => {
    if (hasUnsavedChanges(currentNote, originalNote)) {
      setPendingNavigation(() => () => onNavigate('doctor-dashboard'))
      setShowUnsavedWarning(true)
      return
    }
    onNavigate('doctor-dashboard')
  }, [currentNote, originalNote, onNavigate])

  const handleNavigateSection = useCallback((section: ClinicalSection) => {
    if (hasUnsavedChanges(currentNote, originalNote)) {
      setPendingNavigation(() => () => setActiveSection(section))
      setShowUnsavedWarning(true)
      return
    }
    setActiveSection(section)
  }, [currentNote, originalNote])

  const handleConfirmDiscard = useCallback(() => {
    setShowUnsavedWarning(false)
    setCurrentNote(originalNote)
    setSaveState('saved')
    if (pendingNavigation) {
      pendingNavigation()
      setPendingNavigation(null)
    }
  }, [originalNote, pendingNavigation])

  const handleCancelDiscard = useCallback(() => {
    setShowUnsavedWarning(false)
    setPendingNavigation(null)
  }, [])

  const handleRetrySave = useCallback(() => {
    setShowSaveError(false)
    handleSaveDraft()
  }, [handleSaveDraft])

  if (state === 'loading') {
    return (
      <div className="clinical-workspace-loading">
        <div className="spinner" />
        <p>Loading patient encounter…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="clinical-workspace-error">
        <Icon name="alert-circle" size={48} />
        <h2>Unable to Load Patient Encounter</h2>
        <p>The patient record or encounter could not be loaded.</p>
        <button className="button" onClick={() => onNavigate('doctor-dashboard')}>
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="clinical-workspace">
      <PatientEncounterHeader
        patient={patientContext}
        onReturn={handleReturnToDashboard}
      />

      <ClinicalSafetySummary patient={patientContext} />

      <div className="clinical-workspace-content">
        <div className="clinical-main-area">
          <ClinicalNavigationTabs
            activeSection={activeSection}
            onSectionChange={handleNavigateSection}
            hasUnsavedChanges={hasUnsavedChanges(currentNote, originalNote)}
          />

          {activeSection === 'overview' && (
            <div className="clinical-overview">
              <div className="overview-section">
                <h3>Current Visit</h3>
                <dl className="overview-list">
                  <dt>Chief Complaint</dt>
                  <dd>{patientContext.chiefComplaint}</dd>
                  <dt>Encounter Type</dt>
                  <dd>{patientContext.encounterType}</dd>
                  <dt>Assigned Doctor</dt>
                  <dd>{patientContext.assignedDoctor}</dd>
                </dl>
              </div>

              <div className="overview-section">
                <h3>Existing Diagnoses</h3>
                {patientContext.existingDiagnoses.length > 0 ? (
                  <ul className="diagnosis-list">
                    {patientContext.existingDiagnoses.map((diagnosis, index) => (
                      <li key={index}>{diagnosis}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">No existing diagnoses recorded</p>
                )}
              </div>

              <div className="overview-section">
                <h3>Active Prescriptions</h3>
                {patientContext.activePrescriptions.length > 0 ? (
                  <ul className="prescription-list">
                    {patientContext.activePrescriptions.map((rx, index) => (
                      <li key={index}>{rx}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">No active prescriptions</p>
                )}
              </div>
            </div>
          )}

          {activeSection === 'clinical-notes' && (
            <ConsultationNoteEditor
              note={currentNote}
              onChange={handleNoteChange}
              saveState={saveState}
              onSave={handleSaveDraft}
              lastSaved={getTimeSinceLastSave(currentNote.lastModified)}
            />
          )}

          {activeSection === 'medical-history' && (
            <div className="clinical-placeholder">
              <Icon name="file-text" size={48} />
              <h3>Medical History</h3>
              <p>Complete medical history module will be available in a future update.</p>
              <button className="button secondary" onClick={() => setActiveSection('clinical-notes')}>
                Return to Clinical Notes
              </button>
            </div>
          )}

          {activeSection === 'diagnoses' && (
            <div className="clinical-placeholder">
              <Icon name="clipboard" size={48} />
              <h3>Diagnoses</h3>
              <p>Diagnosis management module will be available in a future update.</p>
              <button className="button secondary" onClick={() => setActiveSection('clinical-notes')}>
                Return to Clinical Notes
              </button>
            </div>
          )}

          {activeSection === 'prescriptions' && (
            <div className="clinical-placeholder">
              <Icon name="file-plus" size={48} />
              <h3>Prescriptions</h3>
              <p>Prescription authoring module will be available in a future update.</p>
              <button className="button secondary" onClick={() => setActiveSection('clinical-notes')}>
                Return to Clinical Notes
              </button>
            </div>
          )}

          {activeSection === 'laboratory' && (
            <div className="clinical-placeholder">
              <Icon name="activity" size={48} />
              <h3>Laboratory</h3>
              <p>Laboratory ordering and results module will be available in a future update.</p>
              <button className="button secondary" onClick={() => setActiveSection('clinical-notes')}>
                Return to Clinical Notes
              </button>
            </div>
          )}

          {activeSection === 'documents' && (
            <div className="clinical-placeholder">
              <Icon name="folder" size={48} />
              <h3>Documents</h3>
              <p>Document management module will be available in a future update.</p>
              <button className="button secondary" onClick={() => setActiveSection('clinical-notes')}>
                Return to Clinical Notes
              </button>
            </div>
          )}
        </div>

        <ContextPanel
          patient={patientContext}
          onNavigateToSection={handleNavigateSection}
        />
      </div>

      <SaveStateIndicator
        saveState={saveState}
        lastSaved={getTimeSinceLastSave(currentNote.lastModified)}
        onSave={handleSaveDraft}
      />

      {showUnsavedWarning && (
        <UnsavedChangesDialog
          onConfirm={handleConfirmDiscard}
          onCancel={handleCancelDiscard}
        />
      )}

      {showSaveError && (
        <SaveErrorDialog
          error={saveError}
          onRetry={handleRetrySave}
          onCancel={() => setShowSaveError(false)}
        />
      )}
    </div>
  )
}
