import { useState } from 'react'
import Icon from '../Icon'
import {
  formatDate,
  formatDateTime,
  formatShortDate,
  getAllergyStatusClass,
  getAllergyStatusLabel,
  getFrequencyLabel,
  getOrderStatusClass,
  getOrderStatusLabel,
  getRouteLabel,
  searchMedicationCatalogue,
  validatePrescriptionForm,
  type DosageUnit,
  type FrequencyCode,
  type HistoricalMedication,
  type MedicationCatalogueEntry,
  type MedicationOrder,
  type PrescriptionDraft,
  type PrescriptionManagementContext,
  type PrescriptionManagementState,
  type RouteOfAdministration,
} from './model'

// ============================================================================
// PATIENT AND ENCOUNTER HEADER
// ============================================================================

export type PatientEncounterHeaderProps = {
  context: PrescriptionManagementContext
  onNavigate: (destination: string) => void
  title: string
}

export function PatientEncounterHeader({
  context,
  onNavigate,
  title,
}: PatientEncounterHeaderProps) {
  return (
    <div className="prescription-header">
      <div className="prescription-header-breadcrumb">
        <button
          className="prescription-header-back"
          onClick={() => onNavigate('clinical-workspace')}
          aria-label="Back to Clinical Workspace"
        >
          <Icon name="arrow-left" size={16} />
          Clinical Workspace
        </button>
      </div>

      <div className="prescription-header-content">
        <div className="prescription-header-title">
          <h1>{title}</h1>
        </div>

        <div className="prescription-header-patient">
          <div className="prescription-header-patient-primary">
            <div className="prescription-header-patient-name">
              <Icon name="user" size={18} />
              <span className="prescription-header-patient-name-text">{context.patientName}</span>
            </div>
            <div className="prescription-header-patient-details">
              <span className="prescription-header-patient-id">{context.patientId}</span>
              <span className="prescription-header-patient-separator">•</span>
              <span className="prescription-header-patient-demographics">
                {context.age}
                {context.sex === 'male' ? 'M' : context.sex === 'female' ? 'F' : ''}
              </span>
            </div>
          </div>

          <div className="prescription-header-encounter">
            <div className="prescription-header-encounter-primary">
              <Icon name="file-text" size={16} />
              <span className="prescription-header-encounter-type">{context.encounterType}</span>
            </div>
            <div className="prescription-header-encounter-details">
              <span className="prescription-header-encounter-id">{context.encounterId}</span>
              <span className="prescription-header-encounter-separator">•</span>
              <span className="prescription-header-encounter-date">
                {formatDate(context.encounterDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ALLERGY WARNING BANNER
// ============================================================================

export type AllergyWarningBannerProps = {
  allergies: Array<{
    id: string
    allergen: string
    allergyType: 'medication' | 'food' | 'environmental' | 'other'
    severity: 'mild' | 'moderate' | 'severe' | 'unknown'
    reaction: string
  }>
  onViewDetails: () => void
}

export function AllergyWarningBanner({ allergies, onViewDetails }: AllergyWarningBannerProps) {
  const severeAllergies = allergies.filter((a) => a.severity === 'severe')
  const medicationAllergies = allergies.filter((a) => a.allergyType === 'medication')

  return (
    <div className="prescription-allergy-banner">
      <div className="prescription-allergy-banner-icon">
        <Icon name="alert-triangle" size={20} />
      </div>
      <div className="prescription-allergy-banner-content">
        <div className="prescription-allergy-banner-title">
          {severeAllergies.length > 0 ? 'Severe Allergy Alert' : 'Documented Allergies'}
        </div>
        <div className="prescription-allergy-banner-details">
          {medicationAllergies.length > 0 && (
            <div className="prescription-allergy-banner-medications">
              <strong>Medication allergies:</strong>{' '}
              {medicationAllergies.map((a) => a.allergen).join(', ')}
            </div>
          )}
          {medicationAllergies.length < allergies.length && (
            <div className="prescription-allergy-banner-other">
              {allergies.length - medicationAllergies.length} other allerg
              {allergies.length - medicationAllergies.length === 1 ? 'y' : 'ies'} documented
            </div>
          )}
        </div>
      </div>
      <button className="prescription-allergy-banner-action" onClick={onViewDetails}>
        View Details
        <Icon name="arrow-right" size={14} />
      </button>
    </div>
  )
}

// ============================================================================
// CURRENT DIAGNOSES REFERENCE
// ============================================================================

export type CurrentDiagnosesReferenceProps = {
  diagnoses: Array<{
    id: string
    diagnosisName: string
    icdCode: string
    designation: 'primary' | 'secondary'
  }>
  onViewAll: () => void
}

export function CurrentDiagnosesReference({
  diagnoses,
  onViewAll,
}: CurrentDiagnosesReferenceProps) {
  if (diagnoses.length === 0) {
    return (
      <div className="prescription-diagnoses-reference">
        <div className="prescription-diagnoses-reference-header">
          <h2>
            <Icon name="clipboard" size={18} />
            Current Diagnoses
          </h2>
        </div>
        <div className="prescription-diagnoses-reference-empty">
          <p>No diagnoses recorded for this encounter</p>
        </div>
      </div>
    )
  }

  const primary = diagnoses.find((d) => d.designation === 'primary')
  const secondaries = diagnoses.filter((d) => d.designation === 'secondary')

  return (
    <div className="prescription-diagnoses-reference">
      <div className="prescription-diagnoses-reference-header">
        <h2>
          <Icon name="clipboard" size={18} />
          Current Diagnoses
        </h2>
        <button className="prescription-diagnoses-reference-view" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="prescription-diagnoses-reference-list">
        {primary && (
          <div className="prescription-diagnosis-reference-item primary">
            <Icon name="star" size={14} />
            <div className="prescription-diagnosis-reference-content">
              <div className="prescription-diagnosis-reference-name">{primary.diagnosisName}</div>
              <div className="prescription-diagnosis-reference-code">{primary.icdCode}</div>
            </div>
          </div>
        )}

        {secondaries.slice(0, 2).map((diagnosis) => (
          <div key={diagnosis.id} className="prescription-diagnosis-reference-item">
            <div className="prescription-diagnosis-reference-content">
              <div className="prescription-diagnosis-reference-name">{diagnosis.diagnosisName}</div>
              <div className="prescription-diagnosis-reference-code">{diagnosis.icdCode}</div>
            </div>
          </div>
        ))}

        {secondaries.length > 2 && (
          <button className="prescription-diagnoses-reference-more" onClick={onViewAll}>
            +{secondaries.length - 2} more diagnosis
            {secondaries.length - 2 === 1 ? '' : 'es'}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// MEDICATION ORDERS SECTION
// ============================================================================

export type MedicationOrdersSectionProps = {
  orders: MedicationOrder[]
  context: PrescriptionManagementContext
  onCreatePrescription: () => void
  onCancelOrder: (order: MedicationOrder) => void
  catalogueAvailable: boolean
}

export function MedicationOrdersSection({
  orders,
  context,
  onCreatePrescription,
  onCancelOrder,
  catalogueAvailable,
}: MedicationOrdersSectionProps) {
  const activeOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'expired')
  const inactiveOrders = orders.filter((o) => o.status === 'cancelled' || o.status === 'expired')

  const canCreatePrescription = !context.isReadOnly && context.canPrescribe && catalogueAvailable

  return (
    <div className="prescription-orders-section">
      <div className="prescription-orders-header">
        <h2>
          <Icon name="pill" size={20} />
          Medication Orders for This Encounter
        </h2>
        {canCreatePrescription && (
          <button className="prescription-orders-create-button" onClick={onCreatePrescription}>
            <Icon name="plus" size={16} />
            Create Prescription
          </button>
        )}
      </div>

      {activeOrders.length === 0 && inactiveOrders.length === 0 && (
        <div className="prescription-orders-empty">
          <Icon name="pill" size={48} />
          <p className="prescription-orders-empty-title">No medication orders yet</p>
          <p className="prescription-orders-empty-description">
            {canCreatePrescription
              ? 'Create a prescription to add medication orders for this encounter'
              : 'No prescriptions have been created for this encounter'}
          </p>
        </div>
      )}

      {activeOrders.length > 0 && (
        <div className="prescription-orders-list">
          {activeOrders.map((order) => (
            <MedicationOrderCard
              key={order.id}
              order={order}
              context={context}
              onCancel={onCancelOrder}
            />
          ))}
        </div>
      )}

      {inactiveOrders.length > 0 && (
        <>
          <div className="prescription-orders-inactive-header">
            <h3>Cancelled / Expired Orders</h3>
          </div>
          <div className="prescription-orders-list inactive">
            {inactiveOrders.map((order) => (
              <MedicationOrderCard
                key={order.id}
                order={order}
                context={context}
                onCancel={onCancelOrder}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// MEDICATION ORDER CARD
// ============================================================================

export type MedicationOrderCardProps = {
  order: MedicationOrder
  context: PrescriptionManagementContext
  onCancel: (order: MedicationOrder) => void
}

export function MedicationOrderCard({ order, context, onCancel }: MedicationOrderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const canCancel =
    !context.isReadOnly &&
    context.canPrescribe &&
    (order.status === 'draft' || order.status === 'submitted')

  return (
    <div className={`prescription-order-card ${order.status === 'cancelled' ? 'cancelled' : ''}`}>
      <div className="prescription-order-card-header">
        <div className="prescription-order-card-medication">
          <div className="prescription-order-card-medication-name">{order.medicationName}</div>
          <div className="prescription-order-card-medication-generic">{order.genericName}</div>
        </div>
        <div className={`prescription-order-card-status ${getOrderStatusClass(order.status)}`}>
          {getOrderStatusLabel(order.status)}
        </div>
      </div>

      <div className="prescription-order-card-details">
        <div className="prescription-order-card-detail">
          <span className="prescription-order-card-detail-label">Strength:</span>
          <span className="prescription-order-card-detail-value">
            {order.strength} {order.strengthUnit}
          </span>
        </div>
        <div className="prescription-order-card-detail">
          <span className="prescription-order-card-detail-label">Dosage:</span>
          <span className="prescription-order-card-detail-value">
            {order.dosageAmount} {order.dosageUnit}
          </span>
        </div>
        <div className="prescription-order-card-detail">
          <span className="prescription-order-card-detail-label">Route:</span>
          <span className="prescription-order-card-detail-value">
            {getRouteLabel(order.route)}
          </span>
        </div>
        <div className="prescription-order-card-detail">
          <span className="prescription-order-card-detail-label">Frequency:</span>
          <span className="prescription-order-card-detail-value">
            {getFrequencyLabel(order.frequency)}
          </span>
        </div>
        <div className="prescription-order-card-detail">
          <span className="prescription-order-card-detail-label">Duration:</span>
          <span className="prescription-order-card-detail-value">
            {order.duration} {order.durationUnit}
          </span>
        </div>
        <div className="prescription-order-card-detail">
          <span className="prescription-order-card-detail-label">Quantity:</span>
          <span className="prescription-order-card-detail-value">
            {order.quantity} {order.quantityUnit}
          </span>
        </div>
      </div>

      {order.patientInstructions && (
        <div className="prescription-order-card-instructions">
          <div className="prescription-order-card-instructions-label">
            <Icon name="info" size={14} />
            Patient Instructions
          </div>
          <div className="prescription-order-card-instructions-text">{order.patientInstructions}</div>
        </div>
      )}

      {expanded && (
        <div className="prescription-order-card-expanded">
          <div className="prescription-order-card-expanded-section">
            <div className="prescription-order-card-expanded-label">Order Information</div>
            <div className="prescription-order-card-expanded-grid">
              <div className="prescription-order-card-expanded-item">
                <span>Order ID:</span>
                <strong>{order.id}</strong>
              </div>
              <div className="prescription-order-card-expanded-item">
                <span>Prescribed by:</span>
                <strong>{order.prescribedBy}</strong>
              </div>
              <div className="prescription-order-card-expanded-item">
                <span>Prescribed date:</span>
                <strong>{formatDateTime(order.prescribedDate)}</strong>
              </div>
              <div className="prescription-order-card-expanded-item">
                <span>Start date:</span>
                <strong>{formatDate(order.startDate)}</strong>
              </div>
              {order.endDate && (
                <div className="prescription-order-card-expanded-item">
                  <span>End date:</span>
                  <strong>{formatDate(order.endDate)}</strong>
                </div>
              )}
              {order.refills > 0 && (
                <div className="prescription-order-card-expanded-item">
                  <span>Refills:</span>
                  <strong>{order.refills}</strong>
                </div>
              )}
            </div>
          </div>

          {order.internalNotes && (
            <div className="prescription-order-card-expanded-section">
              <div className="prescription-order-card-expanded-label">Internal Notes</div>
              <div className="prescription-order-card-expanded-notes">{order.internalNotes}</div>
            </div>
          )}
        </div>
      )}

      <div className="prescription-order-card-actions">
        <button
          className="prescription-order-card-action-expand"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={14} />
        </button>

        {canCancel && (
          <button
            className="prescription-order-card-action-cancel"
            onClick={() => onCancel(order)}
          >
            <Icon name="x" size={14} />
            Cancel Order
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// ADD PRESCRIPTION PANEL
// ============================================================================

export type AddPrescriptionPanelProps = {
  draft: PrescriptionDraft
  context: PrescriptionManagementContext
  catalogue: MedicationCatalogueEntry[]
  onUpdateDraft: (updates: Partial<PrescriptionDraft>) => void
  onSelectMedication: (medication: MedicationCatalogueEntry) => void
  onReview: () => void
  onCancel: () => void
}

export function AddPrescriptionPanel({
  draft,
  context,
  catalogue,
  onUpdateDraft,
  onSelectMedication,
  onReview,
  onCancel,
}: AddPrescriptionPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const searchResults = searchQuery.length >= 2 ? searchMedicationCatalogue(searchQuery) : []

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowResults(query.length >= 2)
  }

  const handleSelectMedication = (medication: MedicationCatalogueEntry) => {
    onSelectMedication(medication)
    setSearchQuery('')
    setShowResults(false)
  }

  const handleReview = () => {
    const validation = validatePrescriptionForm(draft)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }
    setValidationErrors({})
    onReview()
  }

  return (
    <div className="prescription-add-panel">
      <div className="prescription-add-panel-header">
        <h2>
          <Icon name="plus" size={20} />
          Create New Prescription
        </h2>
        <button
          className="prescription-add-panel-close"
          onClick={onCancel}
          aria-label="Cancel prescription"
        >
          <Icon name="x" size={20} />
        </button>
      </div>

      <div className="prescription-add-panel-content">
        {/* Medication Selection */}
        <div className="prescription-form-section">
          <h3>Medication Selection</h3>

          {!draft.medicationId ? (
            <div className="prescription-medication-search">
              <div className="prescription-form-field">
                <label htmlFor="medication-search">Search Medication Catalogue</label>
                <div className="prescription-search-input-wrapper">
                  <Icon name="search" size={16} />
                  <input
                    id="medication-search"
                    type="text"
                    placeholder="Search by name, generic name, or strength..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                    className={validationErrors.medication ? 'error' : ''}
                  />
                </div>
                {validationErrors.medication && (
                  <div className="prescription-form-error">
                    <Icon name="alert-circle" size={14} />
                    {validationErrors.medication}
                  </div>
                )}
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <div className="prescription-search-hint">Type at least 2 characters to search</div>
                )}
              </div>

              {showResults && searchResults.length > 0 && (
                <div className="prescription-search-results">
                  <div className="prescription-search-results-header">
                    {searchResults.length} result{searchResults.length === 1 ? '' : 's'} found
                  </div>
                  <div className="prescription-search-results-list">
                    {searchResults.map((medication) => (
                      <button
                        key={medication.id}
                        className="prescription-search-result-item"
                        onClick={() => handleSelectMedication(medication)}
                      >
                        <div className="prescription-search-result-name">
                          {medication.medicationName}
                        </div>
                        <div className="prescription-search-result-details">
                          <span>{medication.genericName}</span>
                          <span>•</span>
                          <span>
                            {medication.strength} {medication.strengthUnit}
                          </span>
                          <span>•</span>
                          <span>{medication.formulation}</span>
                        </div>
                        <div className="prescription-search-result-category">
                          {medication.category}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showResults && searchResults.length === 0 && (
                <div className="prescription-search-no-results">
                  <Icon name="search" size={32} />
                  <p>No medications found matching "{searchQuery}"</p>
                  <p className="prescription-search-no-results-hint">
                    Try a different search term or check the spelling
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="prescription-selected-medication">
              <div className="prescription-selected-medication-header">
                <div>
                  <div className="prescription-selected-medication-name">{draft.medicationName}</div>
                  <div className="prescription-selected-medication-generic">{draft.genericName}</div>
                  <div className="prescription-selected-medication-details">
                    {draft.strength} {draft.strengthUnit} • {draft.formulation}
                  </div>
                </div>
                <button
                  className="prescription-selected-medication-change"
                  onClick={() => {
                    onUpdateDraft({
                      medicationId: null,
                      medicationName: '',
                      genericName: '',
                      strength: '',
                      strengthUnit: '',
                      formulation: '',
                    })
                    setSearchQuery('')
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Medication Details */}
        {draft.medicationId && (
          <>
            <div className="prescription-form-section">
              <h3>Dosage and Administration</h3>

              <div className="prescription-form-row">
                <div className="prescription-form-field">
                  <label htmlFor="dosage-amount">
                    Dosage Amount <span className="prescription-form-required">*</span>
                  </label>
                  <input
                    id="dosage-amount"
                    type="text"
                    placeholder="e.g., 1, 1-2, 500"
                    value={draft.dosageAmount}
                    onChange={(e) => onUpdateDraft({ dosageAmount: e.target.value })}
                    className={validationErrors.dosageAmount ? 'error' : ''}
                  />
                  {validationErrors.dosageAmount && (
                    <div className="prescription-form-error">
                      <Icon name="alert-circle" size={14} />
                      {validationErrors.dosageAmount}
                    </div>
                  )}
                </div>

                <div className="prescription-form-field">
                  <label htmlFor="dosage-unit">
                    Dosage Unit <span className="prescription-form-required">*</span>
                  </label>
                  <select
                    id="dosage-unit"
                    value={draft.dosageUnit || ''}
                    onChange={(e) => onUpdateDraft({ dosageUnit: e.target.value as DosageUnit })}
                    className={validationErrors.dosageUnit ? 'error' : ''}
                  >
                    <option value="">Select unit</option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="mcg">mcg</option>
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                    <option value="unit">Unit</option>
                    <option value="drop">Drop</option>
                    <option value="puff">Puff</option>
                    <option value="patch">Patch</option>
                    <option value="application">Application</option>
                  </select>
                  {validationErrors.dosageUnit && (
                    <div className="prescription-form-error">
                      <Icon name="alert-circle" size={14} />
                      {validationErrors.dosageUnit}
                    </div>
                  )}
                </div>
              </div>

              <div className="prescription-form-field">
                <label htmlFor="route">
                  Route of Administration <span className="prescription-form-required">*</span>
                </label>
                <select
                  id="route"
                  value={draft.route || ''}
                  onChange={(e) =>
                    onUpdateDraft({ route: e.target.value as RouteOfAdministration })
                  }
                  className={validationErrors.route ? 'error' : ''}
                >
                  <option value="">Select route</option>
                  <option value="oral">Oral</option>
                  <option value="intravenous">Intravenous (IV)</option>
                  <option value="intramuscular">Intramuscular (IM)</option>
                  <option value="subcutaneous">Subcutaneous (SC)</option>
                  <option value="topical">Topical</option>
                  <option value="rectal">Rectal</option>
                  <option value="inhalation">Inhalation</option>
                  <option value="nasal">Nasal</option>
                  <option value="ophthalmic">Ophthalmic (Eye)</option>
                  <option value="otic">Otic (Ear)</option>
                  <option value="transdermal">Transdermal</option>
                  <option value="sublingual">Sublingual</option>
                </select>
                {validationErrors.route && (
                  <div className="prescription-form-error">
                    <Icon name="alert-circle" size={14} />
                    {validationErrors.route}
                  </div>
                )}
              </div>

              <div className="prescription-form-field">
                <label htmlFor="frequency">
                  Frequency <span className="prescription-form-required">*</span>
                </label>
                <select
                  id="frequency"
                  value={draft.frequency || ''}
                  onChange={(e) => {
                    const freq = e.target.value as FrequencyCode
                    onUpdateDraft({
                      frequency: freq,
                      frequencyDescription: getFrequencyLabel(freq),
                    })
                  }}
                  className={validationErrors.frequency ? 'error' : ''}
                >
                  <option value="">Select frequency</option>
                  <option value="once-daily">Once daily</option>
                  <option value="twice-daily">Twice daily</option>
                  <option value="three-times-daily">Three times daily</option>
                  <option value="four-times-daily">Four times daily</option>
                  <option value="every-4-hours">Every 4 hours</option>
                  <option value="every-6-hours">Every 6 hours</option>
                  <option value="every-8-hours">Every 8 hours</option>
                  <option value="every-12-hours">Every 12 hours</option>
                  <option value="once-weekly">Once weekly</option>
                  <option value="as-needed">As needed (PRN)</option>
                  <option value="at-bedtime">At bedtime</option>
                  <option value="before-meals">Before meals</option>
                  <option value="after-meals">After meals</option>
                  <option value="other">Other (specify in instructions)</option>
                </select>
                {validationErrors.frequency && (
                  <div className="prescription-form-error">
                    <Icon name="alert-circle" size={14} />
                    {validationErrors.frequency}
                  </div>
                )}
              </div>
            </div>

            <div className="prescription-form-section">
              <h3>Duration and Quantity</h3>

              <div className="prescription-form-row">
                <div className="prescription-form-field">
                  <label htmlFor="duration">
                    Duration <span className="prescription-form-required">*</span>
                  </label>
                  <input
                    id="duration"
                    type="text"
                    placeholder="e.g., 7, 14, 30"
                    value={draft.duration}
                    onChange={(e) => onUpdateDraft({ duration: e.target.value })}
                    className={validationErrors.duration ? 'error' : ''}
                  />
                  {validationErrors.duration && (
                    <div className="prescription-form-error">
                      <Icon name="alert-circle" size={14} />
                      {validationErrors.duration}
                    </div>
                  )}
                </div>

                <div className="prescription-form-field">
                  <label htmlFor="duration-unit">Duration Unit</label>
                  <select
                    id="duration-unit"
                    value={draft.durationUnit}
                    onChange={(e) =>
                      onUpdateDraft({
                        durationUnit: e.target.value as 'days' | 'weeks' | 'months',
                      })
                    }
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div className="prescription-form-row">
                <div className="prescription-form-field">
                  <label htmlFor="quantity">
                    Quantity to Supply <span className="prescription-form-required">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    placeholder="e.g., 28, 60"
                    value={draft.quantity}
                    onChange={(e) => onUpdateDraft({ quantity: e.target.value })}
                    className={validationErrors.quantity ? 'error' : ''}
                  />
                  {validationErrors.quantity && (
                    <div className="prescription-form-error">
                      <Icon name="alert-circle" size={14} />
                      {validationErrors.quantity}
                    </div>
                  )}
                </div>

                <div className="prescription-form-field">
                  <label htmlFor="quantity-unit">Quantity Unit</label>
                  <input
                    id="quantity-unit"
                    type="text"
                    placeholder="tablets, capsules, ml"
                    value={draft.quantityUnit}
                    onChange={(e) => onUpdateDraft({ quantityUnit: e.target.value })}
                  />
                </div>
              </div>

              <div className="prescription-form-field">
                <label htmlFor="refills">Refills Authorized</label>
                <input
                  id="refills"
                  type="number"
                  min="0"
                  max="12"
                  value={draft.refills}
                  onChange={(e) => onUpdateDraft({ refills: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="prescription-form-row">
                <div className="prescription-form-field">
                  <label htmlFor="start-date">Start Date</label>
                  <input
                    id="start-date"
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => onUpdateDraft({ startDate: e.target.value })}
                  />
                </div>

                <div className="prescription-form-field">
                  <label htmlFor="end-date">End Date (Optional)</label>
                  <input
                    id="end-date"
                    type="date"
                    value={draft.endDate}
                    onChange={(e) => onUpdateDraft({ endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="prescription-form-section">
              <h3>Instructions and Notes</h3>

              <div className="prescription-form-field">
                <label htmlFor="patient-instructions">Patient Instructions</label>
                <textarea
                  id="patient-instructions"
                  rows={3}
                  placeholder="Instructions for the patient on how to take the medication..."
                  value={draft.patientInstructions}
                  onChange={(e) => onUpdateDraft({ patientInstructions: e.target.value })}
                />
                <div className="prescription-form-hint">
                  These instructions will be visible to the patient
                </div>
              </div>

              <div className="prescription-form-field">
                <label htmlFor="internal-notes">Internal Clinical Notes</label>
                <textarea
                  id="internal-notes"
                  rows={2}
                  placeholder="Internal notes for clinical staff (not visible to patient)..."
                  value={draft.internalNotes}
                  onChange={(e) => onUpdateDraft({ internalNotes: e.target.value })}
                />
                <div className="prescription-form-hint">For clinical staff only</div>
              </div>
            </div>
          </>
        )}
      </div>

      {draft.medicationId && (
        <div className="prescription-add-panel-footer">
          <button className="prescription-button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="prescription-button-primary" onClick={handleReview}>
            <Icon name="eye" size={16} />
            Review Prescription
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// PRESCRIPTION REVIEW DIALOG
// ============================================================================

export type PrescriptionReviewDialogProps = {
  draft: PrescriptionDraft
  context: PrescriptionManagementContext
  onSaveDraft: () => void
  onSubmit: () => void
  onEdit: () => void
  onCancel: () => void
}

export function PrescriptionReviewDialog({
  draft,
  context,
  onSaveDraft,
  onSubmit,
  onEdit,
  onCancel,
}: PrescriptionReviewDialogProps) {
  return (
    <div className="prescription-dialog-overlay" onClick={onCancel}>
      <div className="prescription-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prescription-dialog-header">
          <h2>
            <Icon name="eye" size={20} />
            Review Prescription Order
          </h2>
          <button className="prescription-dialog-close" onClick={onCancel} aria-label="Close">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="prescription-dialog-content">
          <div className="prescription-review-notice">
            <Icon name="info" size={16} />
            <p>
              Please review this medication order carefully before submission. Ensure all details are
              correct.
            </p>
          </div>

          <div className="prescription-review-section">
            <h3>Medication</h3>
            <div className="prescription-review-medication">
              <div className="prescription-review-medication-name">{draft.medicationName}</div>
              <div className="prescription-review-medication-generic">{draft.genericName}</div>
              <div className="prescription-review-medication-strength">
                {draft.strength} {draft.strengthUnit} • {draft.formulation}
              </div>
            </div>
          </div>

          <div className="prescription-review-section">
            <h3>Dosage and Administration</h3>
            <div className="prescription-review-grid">
              <div className="prescription-review-item">
                <span className="prescription-review-label">Dosage:</span>
                <span className="prescription-review-value">
                  {draft.dosageAmount} {draft.dosageUnit}
                </span>
              </div>
              <div className="prescription-review-item">
                <span className="prescription-review-label">Route:</span>
                <span className="prescription-review-value">
                  {draft.route && getRouteLabel(draft.route)}
                </span>
              </div>
              <div className="prescription-review-item">
                <span className="prescription-review-label">Frequency:</span>
                <span className="prescription-review-value">
                  {draft.frequency && getFrequencyLabel(draft.frequency)}
                </span>
              </div>
              <div className="prescription-review-item">
                <span className="prescription-review-label">Duration:</span>
                <span className="prescription-review-value">
                  {draft.duration} {draft.durationUnit}
                </span>
              </div>
              <div className="prescription-review-item">
                <span className="prescription-review-label">Quantity:</span>
                <span className="prescription-review-value">
                  {draft.quantity} {draft.quantityUnit}
                </span>
              </div>
              {draft.refills > 0 && (
                <div className="prescription-review-item">
                  <span className="prescription-review-label">Refills:</span>
                  <span className="prescription-review-value">{draft.refills}</span>
                </div>
              )}
              <div className="prescription-review-item">
                <span className="prescription-review-label">Start Date:</span>
                <span className="prescription-review-value">{formatDate(draft.startDate)}</span>
              </div>
              {draft.endDate && (
                <div className="prescription-review-item">
                  <span className="prescription-review-label">End Date:</span>
                  <span className="prescription-review-value">{formatDate(draft.endDate)}</span>
                </div>
              )}
            </div>
          </div>

          {draft.patientInstructions && (
            <div className="prescription-review-section">
              <h3>Patient Instructions</h3>
              <div className="prescription-review-instructions">{draft.patientInstructions}</div>
            </div>
          )}

          {draft.internalNotes && (
            <div className="prescription-review-section">
              <h3>Internal Notes</h3>
              <div className="prescription-review-notes">{draft.internalNotes}</div>
            </div>
          )}

          <div className="prescription-review-section">
            <h3>Prescriber</h3>
            <div className="prescription-review-prescriber">{context.assignedClinician}</div>
          </div>
        </div>

        <div className="prescription-dialog-footer">
          <button className="prescription-button-text" onClick={onEdit}>
            <Icon name="edit-2" size={16} />
            Edit Details
          </button>
          <div className="prescription-dialog-footer-actions">
            <button className="prescription-button-secondary" onClick={onSaveDraft}>
              Save as Draft
            </button>
            <button className="prescription-button-primary" onClick={onSubmit}>
              <Icon name="check" size={16} />
              Submit Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HISTORICAL MEDICATIONS SECTION
// ============================================================================

export type HistoricalMedicationsSectionProps = {
  medications: HistoricalMedication[]
  onViewAll: () => void
}

export function HistoricalMedicationsSection({
  medications,
  onViewAll,
}: HistoricalMedicationsSectionProps) {
  if (medications.length === 0) {
    return (
      <div className="prescription-historical-section">
        <div className="prescription-historical-header">
          <h3>
            <Icon name="clock" size={18} />
            Previous Medications
          </h3>
        </div>
        <div className="prescription-historical-empty">
          <p>No previous medications recorded</p>
        </div>
      </div>
    )
  }

  const recentMeds = medications.slice(0, 3)

  return (
    <div className="prescription-historical-section">
      <div className="prescription-historical-header">
        <h3>
          <Icon name="clock" size={18} />
          Previous Medications
        </h3>
        <button className="prescription-historical-view-all" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="prescription-historical-list">
        {recentMeds.map((med) => (
          <div key={med.id} className="prescription-historical-item">
            <div className="prescription-historical-item-name">{med.medicationName}</div>
            <div className="prescription-historical-item-details">
              {med.strength} • {med.dosageAmount} • {med.frequency}
            </div>
            <div className="prescription-historical-item-date">
              {formatShortDate(med.encounterDate)}
            </div>
          </div>
        ))}
      </div>

      {medications.length > 3 && (
        <button className="prescription-historical-more" onClick={onViewAll}>
          View {medications.length - 3} more medication
          {medications.length - 3 === 1 ? '' : 's'}
        </button>
      )}
    </div>
  )
}

// ============================================================================
// DIALOGS
// ============================================================================

export type UnsavedChangesDialogProps = {
  onDiscard: () => void
  onContinue: () => void
}

export function UnsavedChangesDialog({ onDiscard, onContinue }: UnsavedChangesDialogProps) {
  return (
    <div className="prescription-dialog-overlay" onClick={onContinue}>
      <div className="prescription-dialog small" onClick={(e) => e.stopPropagation()}>
        <div className="prescription-dialog-header">
          <h2>
            <Icon name="alert-triangle" size={20} />
            Unsaved Changes
          </h2>
        </div>
        <div className="prescription-dialog-content">
          <p>You have unsaved changes to this prescription. Are you sure you want to leave?</p>
        </div>
        <div className="prescription-dialog-footer">
          <button className="prescription-button-secondary" onClick={onContinue}>
            Continue Editing
          </button>
          <button className="prescription-button-danger" onClick={onDiscard}>
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export type DuplicateOrderDialogProps = {
  medicationName: string
  onContinue: () => void
  onCancel: () => void
}

export function DuplicateOrderDialog({
  medicationName,
  onContinue,
  onCancel,
}: DuplicateOrderDialogProps) {
  return (
    <div className="prescription-dialog-overlay" onClick={onCancel}>
      <div className="prescription-dialog small" onClick={(e) => e.stopPropagation()}>
        <div className="prescription-dialog-header">
          <h2>
            <Icon name="alert-triangle" size={20} />
            Potential Duplicate Order
          </h2>
        </div>
        <div className="prescription-dialog-content">
          <p>
            An active or pending order for <strong>{medicationName}</strong> already exists for this
            encounter.
          </p>
          <p>Do you want to continue creating a new order for this medication?</p>
        </div>
        <div className="prescription-dialog-footer">
          <button className="prescription-button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="prescription-button-primary" onClick={onContinue}>
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  )
}

export type CancelOrderDialogProps = {
  order: MedicationOrder
  onConfirm: () => void
  onCancel: () => void
}

export function CancelOrderDialog({ order, onConfirm, onCancel }: CancelOrderDialogProps) {
  return (
    <div className="prescription-dialog-overlay" onClick={onCancel}>
      <div className="prescription-dialog small" onClick={(e) => e.stopPropagation()}>
        <div className="prescription-dialog-header">
          <h2>
            <Icon name="alert-triangle" size={20} />
            Cancel Medication Order
          </h2>
        </div>
        <div className="prescription-dialog-content">
          <p>
            Are you sure you want to cancel this medication order for <strong>{order.medicationName}</strong>?
          </p>
          <div className="prescription-cancel-order-details">
            <div>Order ID: {order.id}</div>
            <div>
              {order.dosageAmount} {order.dosageUnit} • {order.frequency && getFrequencyLabel(order.frequency)}
            </div>
          </div>
          <p className="prescription-cancel-order-warning">This action cannot be undone.</p>
        </div>
        <div className="prescription-dialog-footer">
          <button className="prescription-button-secondary" onClick={onCancel}>
            Keep Order
          </button>
          <button className="prescription-button-danger" onClick={onConfirm}>
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SAVE STATE INDICATOR
// ============================================================================

export type SaveStateIndicatorProps = {
  state: PrescriptionManagementState['saveState']
  lastSaved: string | null
}

export function SaveStateIndicator({ state, lastSaved }: SaveStateIndicatorProps) {
  if (state === 'idle') return null

  return (
    <div className={`prescription-save-indicator ${state}`}>
      {state === 'saving' && (
        <>
          <span className="prescription-save-indicator-spinner" />
          Saving...
        </>
      )}
      {state === 'saved' && (
        <>
          <Icon name="check" size={16} />
          Saved
        </>
      )}
      {state === 'error' && (
        <>
          <Icon name="alert-circle" size={16} />
          Save failed
        </>
      )}
    </div>
  )
}

// ============================================================================
// NOTICES
// ============================================================================

export type ReadOnlyNoticeProps = {
  encounterStatus: string
}

export function ReadOnlyNotice({ encounterStatus }: ReadOnlyNoticeProps) {
  return (
    <div className="prescription-notice read-only">
      <Icon name="lock" size={18} />
      <div>
        <strong>Read-only encounter</strong>
        <p>
          This encounter is {encounterStatus}. Medication orders cannot be created or modified.
        </p>
      </div>
    </div>
  )
}

export function PermissionDeniedNotice() {
  return (
    <div className="prescription-notice permission-denied">
      <Icon name="alert-circle" size={18} />
      <div>
        <strong>Permission required</strong>
        <p>You do not have permission to create or modify medication orders.</p>
      </div>
    </div>
  )
}

export function CatalogueUnavailableNotice() {
  return (
    <div className="prescription-notice catalogue-unavailable">
      <Icon name="alert-triangle" size={18} />
      <div>
        <strong>Medication catalogue unavailable</strong>
        <p>
          The medication catalogue is currently unavailable. Prescriptions cannot be created until
          the catalogue is restored.
        </p>
      </div>
    </div>
  )
}
