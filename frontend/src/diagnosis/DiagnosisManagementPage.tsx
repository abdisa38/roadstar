import { useState, useEffect } from 'react'
import type {
  DiagnosisManagementContext,
  EncounterDiagnosis,
  HistoricalDiagnosis,
  DiagnosisCatalogueResult,
  DiagnosisDesignation,
  SaveState,
} from './model'
import {
  sampleDiagnosisContext,
  sampleCurrentDiagnoses,
  sampleHistoricalDiagnoses,
  getPrimaryDiagnosis,
  hasUnsavedChanges,
  isDuplicateDiagnosis,
} from './model'
import {
  PatientEncounterHeader,
  CurrentDiagnosesSection,
  AddDiagnosisButton,
  AddDiagnosisPanel,
  HistoricalDiagnosesSection,
  PrimaryDiagnosisSummary,
  SaveStatusIndicator,
  UnsavedChangesDialog,
  DuplicateDiagnosisDialog,
  RemoveDiagnosisDialog,
  CatalogueUnavailableMessage,
} from './components'
import './diagnosis.css'

type DiagnosisManagementPageProps = {
  state: 'loading' | 'ready' | 'error'
  patientId: string
  encounterId: string
  onNavigate: (destination: string, params?: Record<string, string>) => void
  onReady: () => void
}

export default function DiagnosisManagementPage({
  state,
  patientId,
  encounterId,
  onNavigate,
  onReady,
}: DiagnosisManagementPageProps) {
  // Context and diagnoses
  const [context] = useState<DiagnosisManagementContext>(sampleDiagnosisContext)
  const [currentDiagnoses, setCurrentDiagnoses] = useState<EncounterDiagnosis[]>(
    sampleCurrentDiagnoses
  )
  const [historicalDiagnoses] = useState<HistoricalDiagnosis[]>(sampleHistoricalDiagnoses)

  // UI state
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [catalogueAvailable, setCatalogueAvailable] = useState(true)

  // Dialogs
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [duplicateDiagnosis, setDuplicateDiagnosis] = useState<DiagnosisCatalogueResult | null>(
    null
  )
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [diagnosisToRemove, setDiagnosisToRemove] = useState<EncounterDiagnosis | null>(null)

  useEffect(() => {
    if (state === 'ready') {
      onReady()
    }
  }, [state, onReady])

  if (state === 'loading') {
    return (
      <div className="diagnosis-management-page loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Loading diagnosis management...</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="diagnosis-management-page error">
        <div className="error-content">
          <div className="error-icon">⚠</div>
          <h2>Unable to Load Diagnosis Management</h2>
          <p>The diagnosis management interface could not be loaded at this time.</p>
          <div className="error-actions">
            <button className="button" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <button
              className="button secondary"
              onClick={() => onNavigate('clinical-workspace')}
            >
              Return to Clinical Workspace
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleReturnToClinical = () => {
    if (hasUnsavedChanges(currentDiagnoses)) {
      setPendingNavigation('clinical-workspace')
      setShowUnsavedDialog(true)
    } else {
      onNavigate('clinical-workspace', { patientId, encounterId })
    }
  }

  const handleAddDiagnosis = () => {
    if (!catalogueAvailable) {
      return
    }
    setIsAddPanelOpen(true)
  }

  const handleCancelAdd = () => {
    setIsAddPanelOpen(false)
  }

  const handleSaveDiagnosis = (
    diagnosis: DiagnosisCatalogueResult,
    designation: DiagnosisDesignation,
    clinicalNotes: string
  ) => {
    // Check for duplicate
    if (isDuplicateDiagnosis(currentDiagnoses, diagnosis.code)) {
      setDuplicateDiagnosis(diagnosis)
      setShowDuplicateDialog(true)
      return
    }

    // If setting as primary and one already exists, replace it
    if (designation === 'primary') {
      const existing = getPrimaryDiagnosis(currentDiagnoses)
      if (existing) {
        // In real implementation, would show confirmation dialog
        // For demo, just change existing to secondary
        setCurrentDiagnoses((prev) =>
          prev.map((d) =>
            d.id === existing.id ? { ...d, designation: 'secondary' as DiagnosisDesignation } : d
          )
        )
      }
    }

    // Add new diagnosis
    const newDiagnosis: EncounterDiagnosis = {
      id: `DIAG-${Date.now()}`,
      diagnosisName: diagnosis.name,
      icdCode: diagnosis.code,
      designation,
      status: 'active',
      recordedDate: new Date().toISOString(),
      recordedBy: context.assignedClinician,
      encounterId: context.encounterId,
      clinicalNotes,
      isUnsaved: false,
    }

    // Simulate save
    setSaveState('saving')
    setTimeout(() => {
      // Simulate random save failure (10% chance)
      if (Math.random() < 0.1) {
        setSaveState('error')
        setTimeout(() => setSaveState('idle'), 3000)
      } else {
        setCurrentDiagnoses((prev) => [...prev, newDiagnosis])
        setSaveState('saved')
        setLastSaved(new Date().toISOString())
        setIsAddPanelOpen(false)
        setTimeout(() => setSaveState('idle'), 2000)
      }
    }, 1000)
  }

  const handleRemoveDiagnosis = (diagnosis: EncounterDiagnosis) => {
    if (!context.canEdit || context.isReadOnly) {
      return
    }
    setDiagnosisToRemove(diagnosis)
    setShowRemoveDialog(true)
  }

  const confirmRemoveDiagnosis = () => {
    if (diagnosisToRemove) {
      setCurrentDiagnoses((prev) => prev.filter((d) => d.id !== diagnosisToRemove.id))
      setShowRemoveDialog(false)
      setDiagnosisToRemove(null)
    }
  }

  const handleNavigateToHistory = () => {
    if (hasUnsavedChanges(currentDiagnoses)) {
      setPendingNavigation('medical-history')
      setShowUnsavedDialog(true)
    } else {
      onNavigate('medical-history', { patientId, encounterId })
    }
  }

  const confirmNavigationWithUnsaved = () => {
    if (pendingNavigation) {
      onNavigate(pendingNavigation, { patientId, encounterId })
      setShowUnsavedDialog(false)
      setPendingNavigation(null)
    }
  }

  const cancelNavigationWithUnsaved = () => {
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
  }

  const primaryDiagnosis = getPrimaryDiagnosis(currentDiagnoses)

  return (
    <div className="diagnosis-management-page">
      <PatientEncounterHeader context={context} onReturn={handleReturnToClinical} />

      <div className="diagnosis-container">
        {context.isReadOnly && (
          <div className="read-only-notice">
            <div className="notice-icon">ℹ</div>
            <div className="notice-content">
              <strong>This encounter is read-only</strong>
              <p>
                This encounter has been finalized and cannot be edited. View-only access is
                permitted.
              </p>
            </div>
          </div>
        )}

        {!context.canEdit && !context.isReadOnly && (
          <div className="permission-notice">
            <div className="notice-icon">⚠</div>
            <div className="notice-content">
              <strong>Limited permissions</strong>
              <p>You do not have permission to add or edit diagnoses for this encounter.</p>
            </div>
          </div>
        )}

        <div className="diagnosis-content">
          <div className="main-section">
            {primaryDiagnosis && (
              <PrimaryDiagnosisSummary diagnosis={primaryDiagnosis} context={context} />
            )}

            <CurrentDiagnosesSection
              diagnoses={currentDiagnoses}
              context={context}
              onRemove={handleRemoveDiagnosis}
            />

            {!context.isReadOnly && context.canEdit && (
              <>
                {!catalogueAvailable && <CatalogueUnavailableMessage />}

                {!isAddPanelOpen && (
                  <AddDiagnosisButton
                    onClick={handleAddDiagnosis}
                    disabled={!catalogueAvailable}
                  />
                )}

                {isAddPanelOpen && (
                  <AddDiagnosisPanel
                    context={context}
                    currentDiagnoses={currentDiagnoses}
                    onSave={handleSaveDiagnosis}
                    onCancel={handleCancelAdd}
                    saveState={saveState}
                  />
                )}
              </>
            )}
          </div>

          <div className="sidebar-section">
            <HistoricalDiagnosesSection
              diagnoses={historicalDiagnoses}
              onViewAll={handleNavigateToHistory}
            />
          </div>
        </div>

        {(saveState === 'saved' || saveState === 'saving' || saveState === 'error') && (
          <SaveStatusIndicator saveState={saveState} lastSaved={lastSaved} />
        )}
      </div>

      {showUnsavedDialog && (
        <UnsavedChangesDialog
          onContinue={confirmNavigationWithUnsaved}
          onCancel={cancelNavigationWithUnsaved}
        />
      )}

      {showDuplicateDialog && duplicateDiagnosis && (
        <DuplicateDiagnosisDialog
          diagnosis={duplicateDiagnosis}
          onClose={() => {
            setShowDuplicateDialog(false)
            setDuplicateDiagnosis(null)
          }}
        />
      )}

      {showRemoveDialog && diagnosisToRemove && (
        <RemoveDiagnosisDialog
          diagnosis={diagnosisToRemove}
          onConfirm={confirmRemoveDiagnosis}
          onCancel={() => {
            setShowRemoveDialog(false)
            setDiagnosisToRemove(null)
          }}
        />
      )}
    </div>
  )
}
