import { useState, useRef, useEffect } from 'react'
import type {
  DiagnosisManagementContext,
  EncounterDiagnosis,
  HistoricalDiagnosis,
  DiagnosisCatalogueResult,
  DiagnosisDesignation,
  SaveState,
} from './model'
import {
  searchDiagnosisCatalogue,
  formatDateTime,
  formatDate,
  getDesignationLabel,
  getStatusLabel,
  getEncounterStatusLabel,
  getPrimaryDiagnosis,
  validateDiagnosisForm,
} from './model'
import Icon from '../Icon'

// Patient and Encounter Header
type PatientEncounterHeaderProps = {
  context: DiagnosisManagementContext
  onReturn: () => void
}

export function PatientEncounterHeader({ context, onReturn }: PatientEncounterHeaderProps) {
  return (
    <div className="diagnosis-header">
      <div className="header-content">
        <button className="return-button" onClick={onReturn}>
          <Icon name="arrow-left" size={16} />
          Return to Clinical Workspace
        </button>

        <div className="patient-identity">
          <div className="patient-primary">
            <h1>Diagnosis Management</h1>
            <div className="patient-name">{context.patientName}</div>
          </div>

          <div className="patient-demographics">
            <div className="demographic-item">
              <span className="demographic-label">Patient ID</span>
              <span className="demographic-value">{context.patientId}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Age</span>
              <span className="demographic-value">{context.age} years</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Sex</span>
              <span className="demographic-value">
                {context.sex === 'not-recorded' ? 'Not recorded' : context.sex}
              </span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Encounter</span>
              <span className="demographic-value">{context.encounterId}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Date</span>
              <span className="demographic-value">{formatDate(context.encounterDate)}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Type</span>
              <span className="demographic-value">{context.encounterType}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Status</span>
              <span className={`status-badge status-${context.encounterStatus}`}>
                {getEncounterStatusLabel(context.encounterStatus)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Primary Diagnosis Summary
type PrimaryDiagnosisSummaryProps = {
  diagnosis: EncounterDiagnosis
  context: DiagnosisManagementContext
}

export function PrimaryDiagnosisSummary({ diagnosis, context }: PrimaryDiagnosisSummaryProps) {
  return (
    <div className="primary-diagnosis-summary">
      <div className="summary-header">
        <Icon name="star" size={20} />
        <h2>Primary Diagnosis</h2>
      </div>
      <div className="summary-content">
        <div className="diagnosis-main">
          <div className="diagnosis-name">{diagnosis.diagnosisName}</div>
          <div className="diagnosis-code">ICD-10: {diagnosis.icdCode}</div>
        </div>
        <div className="diagnosis-meta">
          <div className="meta-item">
            <Icon name="calendar" size={14} />
            Recorded: {formatDateTime(diagnosis.recordedDate)}
          </div>
          <div className="meta-item">
            <Icon name="user" size={14} />
            {diagnosis.recordedBy}
          </div>
          <div className="meta-item">
            <Icon name="activity" size={14} />
            Status: {getStatusLabel(diagnosis.status)}
          </div>
        </div>
        {diagnosis.clinicalNotes && (
          <div className="diagnosis-notes">{diagnosis.clinicalNotes}</div>
        )}
      </div>
    </div>
  )
}

// Current Diagnoses Section
type CurrentDiagnosesSectionProps = {
  diagnoses: EncounterDiagnosis[]
  context: DiagnosisManagementContext
  onRemove: (diagnosis: EncounterDiagnosis) => void
}

export function CurrentDiagnosesSection({
  diagnoses,
  context,
  onRemove,
}: CurrentDiagnosesSectionProps) {
  return (
    <div className="current-diagnoses-section">
      <div className="section-header">
        <h2>Diagnoses for This Encounter</h2>
        <span className="diagnosis-count">
          {diagnoses.length} {diagnoses.length === 1 ? 'diagnosis' : 'diagnoses'}
        </span>
      </div>

      {diagnoses.length === 0 && (
        <div className="empty-diagnoses">
          <Icon name="clipboard" size={48} />
          <h3>No diagnoses recorded</h3>
          <p>No diagnoses have been added to this encounter yet.</p>
        </div>
      )}

      {diagnoses.length > 0 && (
        <div className="diagnoses-list">
          {diagnoses.map((diagnosis) => (
            <div
              key={diagnosis.id}
              className={`diagnosis-card ${diagnosis.designation === 'primary' ? 'primary' : ''} ${
                diagnosis.isUnsaved ? 'unsaved' : ''
              }`}
            >
              <div className="diagnosis-card-header">
                <div className="diagnosis-main-info">
                  <div className="designation-badge">
                    <Icon name={diagnosis.designation === 'primary' ? 'star' : 'circle'} size={14} />
                    {getDesignationLabel(diagnosis.designation)}
                  </div>
                  <div className="diagnosis-name">{diagnosis.diagnosisName}</div>
                  <div className="diagnosis-code">ICD-10: {diagnosis.icdCode}</div>
                </div>

                {!context.isReadOnly && context.canEdit && !diagnosis.isUnsaved && (
                  <button
                    className="remove-button"
                    onClick={() => onRemove(diagnosis)}
                    title="Remove diagnosis"
                  >
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>

              <div className="diagnosis-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <Icon name="activity" size={14} />
                    <span className={`status-label status-${diagnosis.status}`}>
                      {getStatusLabel(diagnosis.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <Icon name="calendar" size={14} />
                    {formatDateTime(diagnosis.recordedDate)}
                  </div>
                  <div className="detail-item">
                    <Icon name="user" size={14} />
                    {diagnosis.recordedBy}
                  </div>
                </div>

                {diagnosis.clinicalNotes && (
                  <div className="clinical-notes">
                    <strong>Clinical Notes:</strong> {diagnosis.clinicalNotes}
                  </div>
                )}

                {diagnosis.isUnsaved && (
                  <div className="unsaved-indicator">
                    <Icon name="alert-circle" size={14} />
                    Unsaved changes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Add Diagnosis Button
type AddDiagnosisButtonProps = {
  onClick: () => void
  disabled: boolean
}

export function AddDiagnosisButton({ onClick, disabled }: AddDiagnosisButtonProps) {
  return (
    <button className="add-diagnosis-button" onClick={onClick} disabled={disabled}>
      <Icon name="plus" size={20} />
      Add Diagnosis
    </button>
  )
}

// Add Diagnosis Panel
type AddDiagnosisPanelProps = {
  context: DiagnosisManagementContext
  currentDiagnoses: EncounterDiagnosis[]
  onSave: (
    diagnosis: DiagnosisCatalogueResult,
    designation: DiagnosisDesignation,
    clinicalNotes: string
  ) => void
  onCancel: () => void
  saveState: SaveState
}

export function AddDiagnosisPanel({
  context,
  currentDiagnoses,
  onSave,
  onCancel,
  saveState,
}: AddDiagnosisPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DiagnosisCatalogueResult[]>([])
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisCatalogueResult | null>(null)
  const [designation, setDesignation] = useState<DiagnosisDesignation | null>(null)
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [showValidation, setShowValidation] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const results = searchDiagnosisCatalogue(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleSelectDiagnosis = (diagnosis: DiagnosisCatalogueResult) => {
    setSelectedDiagnosis(diagnosis)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleChangeSelection = () => {
    setSelectedDiagnosis(null)
    setSearchQuery('')
    setSearchResults([])
    setShowValidation(false)
    searchInputRef.current?.focus()
  }

  const handleSave = () => {
    const validation = validateDiagnosisForm(selectedDiagnosis, designation)

    if (!validation.isValid) {
      setShowValidation(true)
      return
    }

    if (selectedDiagnosis && designation) {
      onSave(selectedDiagnosis, designation, clinicalNotes)
      setShowValidation(false)
    }
  }

  const hasPrimaryDiagnosis = getPrimaryDiagnosis(currentDiagnoses) !== null

  const validation = validateDiagnosisForm(selectedDiagnosis, designation)

  return (
    <div className="add-diagnosis-panel">
      <div className="panel-header">
        <h2>Add New Diagnosis</h2>
        <p className="panel-subtitle">
          Search for and select an appropriate diagnosis from the catalogue
        </p>
      </div>

      <div className="panel-content">
        {!selectedDiagnosis ? (
          <div className="diagnosis-search-section">
            <label htmlFor="diagnosis-search" className="search-label">
              Search Diagnosis Catalogue
            </label>
            <div className="search-box">
              <Icon name="search" size={18} />
              <input
                ref={searchInputRef}
                id="diagnosis-search"
                type="text"
                placeholder="Search by diagnosis name or ICD-10 code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={saveState === 'saving'}
              />
            </div>

            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <div className="search-hint">
                <Icon name="info" size={14} />
                Enter at least 2 characters to search
              </div>
            )}

            {isSearching && (
              <div className="search-loading">
                <div className="loading-spinner small" />
                Searching catalogue...
              </div>
            )}

            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="no-results">
                <Icon name="search" size={32} />
                <h3>No matching diagnoses found</h3>
                <p>Try adjusting your search terms or checking the spelling.</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="search-results">
                <div className="results-header">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </div>
                <div className="results-list">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      className="result-item"
                      onClick={() => handleSelectDiagnosis(result)}
                      disabled={saveState === 'saving'}
                    >
                      <div className="result-main">
                        <div className="result-name">{result.name}</div>
                        <div className="result-code">ICD-10: {result.code}</div>
                      </div>
                      <div className="result-category">{result.category}</div>
                      {result.description && (
                        <div className="result-description">{result.description}</div>
                      )}
                      <Icon name="chevron-right" size={16} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="search-instructions">
                <Icon name="info" size={20} />
                <div>
                  <h4>How to search</h4>
                  <ul>
                    <li>Enter diagnosis name (e.g., "hypertension", "diabetes")</li>
                    <li>Enter ICD-10 code (e.g., "I10", "E11")</li>
                    <li>Enter partial terms to see matching results</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="selected-diagnosis-section">
            <div className="selection-header">
              <Icon name="check-circle" size={20} />
              <span>Selected Diagnosis</span>
            </div>

            <div className="selected-diagnosis-card">
              <div className="selected-main">
                <div className="selected-name">{selectedDiagnosis.name}</div>
                <div className="selected-code">ICD-10: {selectedDiagnosis.code}</div>
                <div className="selected-category">{selectedDiagnosis.category}</div>
              </div>
              <button
                className="change-selection-button"
                onClick={handleChangeSelection}
                disabled={saveState === 'saving'}
              >
                <Icon name="refresh-cw" size={14} />
                Change Selection
              </button>
            </div>

            <div className="diagnosis-form">
              <div className="form-field">
                <label className="form-label required">Diagnosis Designation</label>
                <div className="designation-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="designation"
                      value="primary"
                      checked={designation === 'primary'}
                      onChange={() => setDesignation('primary')}
                      disabled={saveState === 'saving'}
                    />
                    <span className="radio-label">
                      <Icon name="star" size={16} />
                      <span>
                        <strong>Primary Diagnosis</strong>
                        <small>Principal reason for this encounter</small>
                      </span>
                    </span>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="designation"
                      value="secondary"
                      checked={designation === 'secondary'}
                      onChange={() => setDesignation('secondary')}
                      disabled={saveState === 'saving'}
                    />
                    <span className="radio-label">
                      <Icon name="circle" size={16} />
                      <span>
                        <strong>Secondary Diagnosis</strong>
                        <small>Additional diagnosis for this encounter</small>
                      </span>
                    </span>
                  </label>
                </div>

                {hasPrimaryDiagnosis && designation === 'primary' && (
                  <div className="designation-warning">
                    <Icon name="alert-triangle" size={14} />
                    A primary diagnosis already exists. Saving this will change the existing primary
                    diagnosis to secondary.
                  </div>
                )}

                {showValidation && !designation && (
                  <div className="validation-error">
                    <Icon name="alert-circle" size={14} />
                    Please select a diagnosis designation
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="clinical-notes" className="form-label">
                  Clinical Notes <span className="optional">(Optional)</span>
                </label>
                <textarea
                  id="clinical-notes"
                  className="form-textarea"
                  placeholder="Enter any relevant clinical documentation or context for this diagnosis..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={4}
                  disabled={saveState === 'saving'}
                />
                <div className="field-hint">
                  Provide additional context, severity notes, or supporting information
                </div>
              </div>
            </div>
          </div>
        )}

        {showValidation && !validation.isValid && (
          <div className="validation-errors">
            <Icon name="alert-circle" size={16} />
            <div>
              <strong>Please complete the required fields:</strong>
              <ul>
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {saveState === 'error' && (
          <div className="save-error">
            <Icon name="x-circle" size={16} />
            <div>
              <strong>Failed to save diagnosis</strong>
              <p>An error occurred while saving. Please try again.</p>
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <button
          className="button secondary"
          onClick={onCancel}
          disabled={saveState === 'saving'}
        >
          Cancel
        </button>
        <button
          className="button primary"
          onClick={handleSave}
          disabled={!selectedDiagnosis || saveState === 'saving'}
        >
          {saveState === 'saving' ? (
            <>
              <div className="button-spinner" />
              Saving...
            </>
          ) : (
            <>
              <Icon name="check" size={16} />
              Save Diagnosis
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Historical Diagnoses Section
type HistoricalDiagnosesSectionProps = {
  diagnoses: HistoricalDiagnosis[]
  onViewAll: () => void
}

export function HistoricalDiagnosesSection({
  diagnoses,
  onViewAll,
}: HistoricalDiagnosesSectionProps) {
  const recentDiagnoses = diagnoses.slice(0, 3)

  return (
    <div className="historical-diagnoses-section">
      <div className="section-header">
        <h3>
          <Icon name="clock" size={18} />
          Historical Diagnoses
        </h3>
      </div>

      {diagnoses.length === 0 && (
        <div className="historical-empty">
          <p>No historical diagnoses recorded for this patient.</p>
        </div>
      )}

      {diagnoses.length > 0 && (
        <>
          <div className="historical-list">
            {recentDiagnoses.map((diagnosis) => (
              <div key={diagnosis.id} className="historical-item">
                <div className="historical-name">{diagnosis.diagnosisName}</div>
                <div className="historical-code">ICD-10: {diagnosis.icdCode}</div>
                <div className="historical-meta">
                  <div className="meta-line">
                    <Icon name="calendar" size={12} />
                    {formatDate(diagnosis.encounterDate)}
                  </div>
                  <div className="meta-line">
                    <Icon name="hash" size={12} />
                    {diagnosis.encounterId}
                  </div>
                </div>
                <div className={`historical-status status-${diagnosis.status}`}>
                  {getStatusLabel(diagnosis.status)}
                </div>
              </div>
            ))}
          </div>

          <button className="view-all-button" onClick={onViewAll}>
            View Full Medical History
            <Icon name="arrow-right" size={14} />
          </button>
        </>
      )}

      <div className="historical-notice">
        <Icon name="info" size={14} />
        <p>
          Historical diagnoses shown for reference only. To document the same diagnosis for the
          current encounter, add it using the "Add Diagnosis" button above.
        </p>
      </div>
    </div>
  )
}

// Save Status Indicator
type SaveStatusIndicatorProps = {
  saveState: SaveState
  lastSaved: string | null
}

export function SaveStatusIndicator({ saveState, lastSaved }: SaveStatusIndicatorProps) {
  if (saveState === 'idle') return null

  return (
    <div className={`save-status-indicator status-${saveState}`}>
      {saveState === 'saving' && (
        <>
          <div className="status-spinner" />
          Saving diagnosis...
        </>
      )}
      {saveState === 'saved' && (
        <>
          <Icon name="check-circle" size={16} />
          Diagnosis saved successfully
        </>
      )}
      {saveState === 'error' && (
        <>
          <Icon name="x-circle" size={16} />
          Failed to save diagnosis
        </>
      )}
    </div>
  )
}

// Catalogue Unavailable Message
export function CatalogueUnavailableMessage() {
  return (
    <div className="catalogue-unavailable">
      <Icon name="alert-triangle" size={20} />
      <div>
        <strong>Diagnosis Catalogue Unavailable</strong>
        <p>
          The diagnosis catalogue service is currently unavailable. Please try again later or
          contact system support if the issue persists.
        </p>
      </div>
    </div>
  )
}

// Unsaved Changes Dialog
type UnsavedChangesDialogProps = {
  onContinue: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({ onContinue, onCancel }: UnsavedChangesDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="alert-triangle" size={24} />
          <h2>Unsaved Changes</h2>
        </div>
        <div className="dialog-body">
          <p>You have unsaved diagnoses. If you leave now, your changes will be lost.</p>
        </div>
        <div className="dialog-footer">
          <button className="button secondary" onClick={onCancel}>
            Stay and Review
          </button>
          <button className="button danger" onClick={onContinue}>
            Leave Without Saving
          </button>
        </div>
      </div>
    </div>
  )
}

// Duplicate Diagnosis Dialog
type DuplicateDiagnosisDialogProps = {
  diagnosis: DiagnosisCatalogueResult
  onClose: () => void
}

export function DuplicateDiagnosisDialog({ diagnosis, onClose }: DuplicateDiagnosisDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="alert-circle" size={24} />
          <h2>Duplicate Diagnosis</h2>
        </div>
        <div className="dialog-body">
          <p>
            The diagnosis <strong>{diagnosis.name}</strong> (ICD-10: {diagnosis.code}) is already
            recorded for this encounter.
          </p>
          <p>Each diagnosis should only be added once per encounter.</p>
        </div>
        <div className="dialog-footer">
          <button className="button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

// Remove Diagnosis Dialog
type RemoveDiagnosisDialogProps = {
  diagnosis: EncounterDiagnosis
  onConfirm: () => void
  onCancel: () => void
}

export function RemoveDiagnosisDialog({
  diagnosis,
  onConfirm,
  onCancel,
}: RemoveDiagnosisDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <Icon name="alert-triangle" size={24} />
          <h2>Remove Diagnosis</h2>
        </div>
        <div className="dialog-body">
          <p>
            Are you sure you want to remove this diagnosis from the current encounter?
          </p>
          <div className="diagnosis-to-remove">
            <div className="diagnosis-name">{diagnosis.diagnosisName}</div>
            <div className="diagnosis-code">ICD-10: {diagnosis.icdCode}</div>
            <div className="diagnosis-designation">
              {getDesignationLabel(diagnosis.designation)} Diagnosis
            </div>
          </div>
          <p className="warning-text">
            This action cannot be undone. The diagnosis will be permanently removed from this
            encounter.
          </p>
        </div>
        <div className="dialog-footer">
          <button className="button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="button danger" onClick={onConfirm}>
            <Icon name="trash-2" size={16} />
            Remove Diagnosis
          </button>
        </div>
      </div>
    </div>
  )
}
