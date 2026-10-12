import { useState } from 'react'
import Icon from '../Icon'
import {
  canCancelRequest,
  canViewResult,
  formatDate,
  formatDateTime,
  formatTime,
  getCategoryLabel,
  getPriorityClass,
  getPriorityLabel,
  getRequestStatusClass,
  getRequestStatusLabel,
  getSpecimenTypeLabel,
  getStatusTimestamp,
  searchLabTestCatalogue,
  validateLabRequest,
  type LabTestCatalogueEntry,
  type LaboratoryOrderContext,
  type LaboratoryOrdersState,
  type LaboratoryRequest,
  type RequestDraft,
  type RequestPriority,
  type RequestStatus,
} from './model'

// ============================================================================
// PATIENT AND ENCOUNTER HEADER
// ============================================================================

export type PatientEncounterHeaderProps = {
  context: LaboratoryOrderContext
  onNavigate: (destination: string) => void
  title: string
}

export function PatientEncounterHeader({
  context,
  onNavigate,
  title,
}: PatientEncounterHeaderProps) {
  return (
    <div className="lab-header">
      <div className="lab-header-breadcrumb">
        <button
          className="lab-header-back"
          onClick={() => onNavigate('clinical-workspace')}
          aria-label="Back to Clinical Workspace"
        >
          <Icon name="arrow-left" size={16} />
          Clinical Workspace
        </button>
      </div>

      <div className="lab-header-content">
        <div className="lab-header-title">
          <h1>{title}</h1>
        </div>

        <div className="lab-header-patient">
          <div className="lab-header-patient-primary">
            <div className="lab-header-patient-name">
              <Icon name="user" size={18} />
              <span className="lab-header-patient-name-text">{context.patientName}</span>
            </div>
            <div className="lab-header-patient-details">
              <span className="lab-header-patient-id">{context.patientId}</span>
              <span className="lab-header-patient-separator">•</span>
              <span className="lab-header-patient-demographics">
                {context.age}
                {context.sex === 'male' ? 'M' : context.sex === 'female' ? 'F' : ''}
              </span>
            </div>
          </div>

          <div className="lab-header-encounter">
            <div className="lab-header-encounter-primary">
              <Icon name="file-text" size={16} />
              <span className="lab-header-encounter-type">{context.encounterType}</span>
            </div>
            <div className="lab-header-encounter-details">
              <span className="lab-header-encounter-id">{context.encounterId}</span>
              <span className="lab-header-encounter-separator">•</span>
              <span className="lab-header-encounter-date">{formatDate(context.encounterDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// REQUESTS SECTION
// ============================================================================

export type RequestsSectionProps = {
  requests: LaboratoryRequest[]
  context: LaboratoryOrderContext
  searchQuery: string
  statusFilter: RequestStatus | 'all'
  onSearchChange: (query: string) => void
  onStatusFilterChange: (status: RequestStatus | 'all') => void
  onNewRequest: () => void
  onViewRequest: (request: LaboratoryRequest) => void
  onCancelRequest: (request: LaboratoryRequest) => void
  catalogueAvailable: boolean
}

export function RequestsSection({
  requests,
  context,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onNewRequest,
  onViewRequest,
  onCancelRequest,
  catalogueAvailable,
}: RequestsSectionProps) {
  const canOrder = !context.isReadOnly && context.canOrderTests && catalogueAvailable

  return (
    <div className="lab-requests-section">
      <div className="lab-requests-header">
        <h2>
          <Icon name="beaker" size={20} />
          Laboratory Requests for This Encounter
        </h2>
        {canOrder && (
          <button className="lab-requests-create-button" onClick={onNewRequest}>
            <Icon name="plus" size={16} />
            New Laboratory Request
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="lab-requests-filters">
        <div className="lab-search-field">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Search by test name, request ID, or indication..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="lab-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        <div className="lab-filter-field">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as RequestStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="specimen-collection-pending">Specimen Collection Pending</option>
            <option value="specimen-collected">Specimen Collected</option>
            <option value="in-progress">In Progress</option>
            <option value="result-available">Result Available</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {(searchQuery || statusFilter !== 'all') && (
          <button
            className="lab-filters-clear"
            onClick={() => {
              onSearchChange('')
              onStatusFilterChange('all')
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Empty state */}
      {requests.length === 0 && !searchQuery && statusFilter === 'all' && (
        <div className="lab-requests-empty">
          <Icon name="beaker" size={48} />
          <p className="lab-requests-empty-title">No laboratory requests yet</p>
          <p className="lab-requests-empty-description">
            {canOrder
              ? 'Create a laboratory request to order tests for this encounter'
              : 'No laboratory tests have been ordered for this encounter'}
          </p>
        </div>
      )}

      {/* No results state */}
      {requests.length === 0 && (searchQuery || statusFilter !== 'all') && (
        <div className="lab-requests-empty">
          <Icon name="search" size={48} />
          <p className="lab-requests-empty-title">No matching requests found</p>
          <p className="lab-requests-empty-description">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Requests list */}
      {requests.length > 0 && (
        <div className="lab-requests-list">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              context={context}
              onView={onViewRequest}
              onCancel={onCancelRequest}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// REQUEST CARD
// ============================================================================

export type RequestCardProps = {
  request: LaboratoryRequest
  context: LaboratoryOrderContext
  onView: (request: LaboratoryRequest) => void
  onCancel: (request: LaboratoryRequest) => void
}

export function RequestCard({ request, context, onView, onCancel }: RequestCardProps) {
  const canCancel = canCancelRequest(request, context.canOrderTests)
  const hasResult = canViewResult(request)
  const statusTimestamp = getStatusTimestamp(request)

  return (
    <div className={`lab-request-card ${request.status === 'cancelled' ? 'cancelled' : ''}`}>
      <div className="lab-request-card-header">
        <div className="lab-request-card-primary">
          <div className="lab-request-card-id">{request.id}</div>
          <div className="lab-request-card-tests">
            {request.requestedTests.map((test, i) => (
              <span key={test.id}>
                {test.testName}
                {i < request.requestedTests.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
        <div className="lab-request-card-status-group">
          {request.priority !== 'routine' && (
            <div className={`lab-request-card-priority ${getPriorityClass(request.priority)}`}>
              {getPriorityLabel(request.priority)}
            </div>
          )}
          <div className={`lab-request-card-status ${getRequestStatusClass(request.status)}`}>
            {getRequestStatusLabel(request.status)}
          </div>
        </div>
      </div>

      <div className="lab-request-card-details">
        <div className="lab-request-card-detail">
          <Icon name="calendar" size={14} />
          <span>Ordered: {formatDateTime(request.orderedDate)}</span>
        </div>
        <div className="lab-request-card-detail">
          <Icon name="user" size={14} />
          <span>{request.orderedBy}</span>
        </div>
        {request.status !== 'draft' && request.status !== 'requested' && (
          <div className="lab-request-card-detail">
            <Icon name="clock" size={14} />
            <span>{formatDateTime(statusTimestamp)}</span>
          </div>
        )}
      </div>

      {request.clinicalIndication && (
        <div className="lab-request-card-indication">
          <strong>Indication:</strong> {request.clinicalIndication}
        </div>
      )}

      <div className="lab-request-card-actions">
        <button className="lab-request-card-action-view" onClick={() => onView(request)}>
          View Details
          <Icon name="arrow-right" size={14} />
        </button>

        {hasResult && (
          <button
            className="lab-request-card-action-result"
            onClick={() => console.log('View result:', request.id)}
          >
            <Icon name="file-text" size={14} />
            View Result
          </button>
        )}

        {canCancel && (
          <button
            className="lab-request-card-action-cancel"
            onClick={() => onCancel(request)}
          >
            <Icon name="x" size={14} />
            Cancel Request
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// NEW REQUEST PANEL
// ============================================================================

export type NewRequestPanelProps = {
  draft: RequestDraft
  context: LaboratoryOrderContext
  catalogue: LabTestCatalogueEntry[]
  onUpdateDraft: (updates: Partial<RequestDraft>) => void
  onSelectTest: (test: LabTestCatalogueEntry) => void
  onRemoveTest: (testId: string) => void
  onReview: () => void
  onCancel: () => void
}

export function NewRequestPanel({
  draft,
  context,
  catalogue,
  onUpdateDraft,
  onSelectTest,
  onRemoveTest,
  onReview,
  onCancel,
}: NewRequestPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const searchResults = searchQuery.length >= 2 ? searchLabTestCatalogue(searchQuery) : []

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowResults(query.length >= 2)
  }

  const handleSelectTest = (test: LabTestCatalogueEntry) => {
    onSelectTest(test)
    setSearchQuery('')
    setShowResults(false)
  }

  const handleReview = () => {
    const validation = validateLabRequest(draft)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }
    setValidationErrors({})
    onReview()
  }

  return (
    <div className="lab-new-request-panel">
      <div className="lab-new-request-header">
        <h2>
          <Icon name="plus" size={20} />
          New Laboratory Request
        </h2>
        <button
          className="lab-new-request-close"
          onClick={onCancel}
          aria-label="Cancel request"
        >
          <Icon name="x" size={20} />
        </button>
      </div>

      <div className="lab-new-request-content">
        {/* Test Selection */}
        <div className="lab-form-section">
          <h3>Test Selection</h3>

          <div className="lab-test-search">
            <div className="lab-form-field">
              <label htmlFor="test-search">Search Laboratory Test Catalogue</label>
              <div className="lab-search-input-wrapper">
                <Icon name="search" size={16} />
                <input
                  id="test-search"
                  type="text"
                  placeholder="Search by test name, code, or category..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className={validationErrors.tests ? 'error' : ''}
                />
              </div>
              {validationErrors.tests && (
                <div className="lab-form-error">
                  <Icon name="alert-circle" size={14} />
                  {validationErrors.tests}
                </div>
              )}
              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <div className="lab-search-hint">Type at least 2 characters to search</div>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="lab-search-results">
                <div className="lab-search-results-header">
                  {searchResults.length} test{searchResults.length === 1 ? '' : 's'} found
                </div>
                <div className="lab-search-results-list">
                  {searchResults.map((test) => (
                    <button
                      key={test.id}
                      className="lab-search-result-item"
                      onClick={() => handleSelectTest(test)}
                    >
                      <div className="lab-search-result-header">
                        <div className="lab-search-result-name">{test.testName}</div>
                        <div className="lab-search-result-code">{test.testCode}</div>
                      </div>
                      <div className="lab-search-result-details">
                        <span className="lab-search-result-category">
                          {getCategoryLabel(test.category)}
                        </span>
                        <span>•</span>
                        <span>{getSpecimenTypeLabel(test.specimenType)}</span>
                        <span>•</span>
                        <span>{test.turnaroundTime}</span>
                      </div>
                      {test.requiresFasting && (
                        <div className="lab-search-result-fasting">
                          <Icon name="alert-circle" size={12} />
                          Fasting required
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showResults && searchResults.length === 0 && (
              <div className="lab-search-no-results">
                <Icon name="search" size={32} />
                <p>No tests found matching "{searchQuery}"</p>
                <p className="lab-search-no-results-hint">
                  Try a different search term or check the spelling
                </p>
              </div>
            )}
          </div>

          {/* Selected Tests */}
          {draft.selectedTests.length > 0 && (
            <div className="lab-selected-tests">
              <div className="lab-selected-tests-header">
                <h4>Selected Tests ({draft.selectedTests.length})</h4>
              </div>
              <div className="lab-selected-tests-list">
                {draft.selectedTests.map((test) => (
                  <div key={test.id} className="lab-selected-test-item">
                    <div className="lab-selected-test-content">
                      <div className="lab-selected-test-name">{test.testName}</div>
                      <div className="lab-selected-test-details">
                        {test.testCode} • {getSpecimenTypeLabel(test.specimenType)}
                      </div>
                    </div>
                    <button
                      className="lab-selected-test-remove"
                      onClick={() => onRemoveTest(test.id)}
                      aria-label={`Remove ${test.testName}`}
                    >
                      <Icon name="x" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clinical Information */}
        {draft.selectedTests.length > 0 && (
          <>
            <div className="lab-form-section">
              <h3>Clinical Information</h3>

              <div className="lab-form-field">
                <label htmlFor="clinical-indication">
                  Clinical Indication <span className="lab-form-required">*</span>
                </label>
                <textarea
                  id="clinical-indication"
                  rows={3}
                  placeholder="Reason for requesting these tests (e.g., symptoms, suspected diagnosis, monitoring)..."
                  value={draft.clinicalIndication}
                  onChange={(e) => onUpdateDraft({ clinicalIndication: e.target.value })}
                  className={validationErrors.clinicalIndication ? 'error' : ''}
                />
                {validationErrors.clinicalIndication && (
                  <div className="lab-form-error">
                    <Icon name="alert-circle" size={14} />
                    {validationErrors.clinicalIndication}
                  </div>
                )}
                <div className="lab-form-hint">
                  Provide clinical context to help the laboratory team
                </div>
              </div>

              <div className="lab-form-field">
                <label htmlFor="request-notes">Additional Notes (Optional)</label>
                <textarea
                  id="request-notes"
                  rows={2}
                  placeholder="Additional information for the laboratory team..."
                  value={draft.requestNotes}
                  onChange={(e) => onUpdateDraft({ requestNotes: e.target.value })}
                />
                <div className="lab-form-hint">For laboratory staff only</div>
              </div>

              <div className="lab-form-field">
                <label htmlFor="priority">Request Priority</label>
                <select
                  id="priority"
                  value={draft.priority}
                  onChange={(e) => onUpdateDraft({ priority: e.target.value as RequestPriority })}
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT (Immediate)</option>
                </select>
                <div className="lab-form-hint">
                  Select "Urgent" or "STAT" only when clinically necessary
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {draft.selectedTests.length > 0 && (
        <div className="lab-new-request-footer">
          <button className="lab-button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="lab-button-primary" onClick={handleReview}>
            <Icon name="eye" size={16} />
            Review Request
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// REQUEST REVIEW DIALOG
// ============================================================================

export type RequestReviewDialogProps = {
  draft: RequestDraft
  context: LaboratoryOrderContext
  onSaveDraft: () => void
  onSubmit: () => void
  onEdit: () => void
  onCancel: () => void
}

export function RequestReviewDialog({
  draft,
  context,
  onSaveDraft,
  onSubmit,
  onEdit,
  onCancel,
}: RequestReviewDialogProps) {
  // Get unique specimen types
  const specimenTypes = Array.from(
    new Set(draft.selectedTests.map((t) => t.specimenType))
  ).map((type) => getSpecimenTypeLabel(type))

  return (
    <div className="lab-dialog-overlay" onClick={onCancel}>
      <div className="lab-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lab-dialog-header">
          <h2>
            <Icon name="eye" size={20} />
            Review Laboratory Request
          </h2>
          <button className="lab-dialog-close" onClick={onCancel} aria-label="Close">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="lab-dialog-content">
          <div className="lab-review-notice">
            <Icon name="info" size={16} />
            <p>
              Please review this laboratory request carefully before submission. Ensure all details
              are correct.
            </p>
          </div>

          <div className="lab-review-section">
            <h3>Patient Information</h3>
            <div className="lab-review-patient">
              <div className="lab-review-patient-name">{context.patientName}</div>
              <div className="lab-review-patient-details">
                {context.patientId} • {context.age}
                {context.sex === 'male' ? 'M' : context.sex === 'female' ? 'F' : ''} •{' '}
                {context.encounterId}
              </div>
            </div>
          </div>

          <div className="lab-review-section">
            <h3>Requested Tests ({draft.selectedTests.length})</h3>
            <div className="lab-review-tests">
              {draft.selectedTests.map((test) => (
                <div key={test.id} className="lab-review-test-item">
                  <div className="lab-review-test-name">{test.testName}</div>
                  <div className="lab-review-test-details">
                    {test.testCode} • {getSpecimenTypeLabel(test.specimenType)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-review-section">
            <h3>Specimen Requirements</h3>
            <div className="lab-review-specimen">
              {specimenTypes.map((type, i) => (
                <span key={i}>
                  {type}
                  {i < specimenTypes.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>

          <div className="lab-review-section">
            <h3>Clinical Information</h3>
            <div className="lab-review-grid">
              <div className="lab-review-item">
                <span className="lab-review-label">Clinical Indication:</span>
                <span className="lab-review-value">{draft.clinicalIndication}</span>
              </div>
              {draft.requestNotes && (
                <div className="lab-review-item">
                  <span className="lab-review-label">Additional Notes:</span>
                  <span className="lab-review-value">{draft.requestNotes}</span>
                </div>
              )}
              <div className="lab-review-item">
                <span className="lab-review-label">Priority:</span>
                <span className={`lab-review-value ${getPriorityClass(draft.priority)}`}>
                  {getPriorityLabel(draft.priority)}
                </span>
              </div>
            </div>
          </div>

          <div className="lab-review-section">
            <h3>Ordering Clinician</h3>
            <div className="lab-review-clinician">{context.assignedClinician}</div>
          </div>
        </div>

        <div className="lab-dialog-footer">
          <button className="lab-button-text" onClick={onEdit}>
            <Icon name="edit-2" size={16} />
            Edit Request
          </button>
          <div className="lab-dialog-footer-actions">
            <button className="lab-button-secondary" onClick={onSaveDraft}>
              Save as Draft
            </button>
            <button className="lab-button-primary" onClick={onSubmit}>
              <Icon name="check" size={16} />
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// REQUEST DETAILS DIALOG
// ============================================================================

export type RequestDetailsDialogProps = {
  request: LaboratoryRequest
  context: LaboratoryOrderContext
  onClose: () => void
  onViewResult: (requestId: string) => void
  onCancel: (request: LaboratoryRequest) => void
}

export function RequestDetailsDialog({
  request,
  context,
  onClose,
  onViewResult,
  onCancel,
}: RequestDetailsDialogProps) {
  const canCancel = canCancelRequest(request, context.canOrderTests)
  const hasResult = canViewResult(request)

  return (
    <div className="lab-dialog-overlay" onClick={onClose}>
      <div className="lab-dialog large" onClick={(e) => e.stopPropagation()}>
        <div className="lab-dialog-header">
          <h2>
            <Icon name="beaker" size={20} />
            Laboratory Request Details
          </h2>
          <button className="lab-dialog-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="lab-dialog-content">
          <div className="lab-details-header">
            <div className="lab-details-id">{request.id}</div>
            <div className="lab-details-status-group">
              {request.priority !== 'routine' && (
                <div className={`lab-details-priority ${getPriorityClass(request.priority)}`}>
                  {getPriorityLabel(request.priority)}
                </div>
              )}
              <div className={`lab-details-status ${getRequestStatusClass(request.status)}`}>
                {getRequestStatusLabel(request.status)}
              </div>
            </div>
          </div>

          <div className="lab-details-section">
            <h3>Requested Tests ({request.requestedTests.length})</h3>
            <div className="lab-details-tests">
              {request.requestedTests.map((test) => (
                <div key={test.id} className="lab-details-test-item">
                  <div className="lab-details-test-name">{test.testName}</div>
                  <div className="lab-details-test-details">
                    {test.testCode} • {getSpecimenTypeLabel(test.specimenType)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-details-section">
            <h3>Clinical Information</h3>
            <div className="lab-details-grid">
              <div className="lab-details-item">
                <span className="lab-details-label">Clinical Indication:</span>
                <span className="lab-details-value">{request.clinicalIndication}</span>
              </div>
              {request.requestNotes && (
                <div className="lab-details-item">
                  <span className="lab-details-label">Additional Notes:</span>
                  <span className="lab-details-value">{request.requestNotes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lab-details-section">
            <h3>Request Information</h3>
            <div className="lab-details-grid">
              <div className="lab-details-item">
                <span className="lab-details-label">Ordered By:</span>
                <span className="lab-details-value">{request.orderedBy}</span>
              </div>
              <div className="lab-details-item">
                <span className="lab-details-label">Ordered Date:</span>
                <span className="lab-details-value">{formatDateTime(request.orderedDate)}</span>
              </div>
              <div className="lab-details-item">
                <span className="lab-details-label">Priority:</span>
                <span className="lab-details-value">{getPriorityLabel(request.priority)}</span>
              </div>
            </div>
          </div>

          {request.specimenCollectedDate && (
            <div className="lab-details-section">
              <h3>Specimen Information</h3>
              <div className="lab-details-grid">
                <div className="lab-details-item">
                  <span className="lab-details-label">Collected Date:</span>
                  <span className="lab-details-value">
                    {formatDateTime(request.specimenCollectedDate)}
                  </span>
                </div>
                {request.specimenCollectedBy && (
                  <div className="lab-details-item">
                    <span className="lab-details-label">Collected By:</span>
                    <span className="lab-details-value">{request.specimenCollectedBy}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {request.resultAvailableDate && (
            <div className="lab-details-section">
              <h3>Result Information</h3>
              <div className="lab-details-grid">
                <div className="lab-details-item">
                  <span className="lab-details-label">Result Available:</span>
                  <span className="lab-details-value">
                    {formatDateTime(request.resultAvailableDate)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {request.status === 'cancelled' && request.cancelledReason && (
            <div className="lab-details-section">
              <h3>Cancellation</h3>
              <div className="lab-details-cancelled">
                <Icon name="alert-circle" size={16} />
                <div>
                  <div className="lab-details-cancelled-reason">{request.cancelledReason}</div>
                  {request.statusChangedDate && (
                    <div className="lab-details-cancelled-date">
                      Cancelled: {formatDateTime(request.statusChangedDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lab-dialog-footer">
          <button className="lab-button-secondary" onClick={onClose}>
            Close
          </button>
          <div className="lab-dialog-footer-actions">
            {hasResult && (
              <button
                className="lab-button-primary"
                onClick={() => onViewResult(request.id)}
              >
                <Icon name="file-text" size={16} />
                View Result
              </button>
            )}
            {canCancel && (
              <button
                className="lab-button-danger"
                onClick={() => {
                  onClose()
                  onCancel(request)
                }}
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
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
    <div className="lab-dialog-overlay" onClick={onContinue}>
      <div className="lab-dialog small" onClick={(e) => e.stopPropagation()}>
        <div className="lab-dialog-header">
          <h2>
            <Icon name="alert-triangle" size={20} />
            Unsaved Changes
          </h2>
        </div>
        <div className="lab-dialog-content">
          <p>You have unsaved changes to this laboratory request. Are you sure you want to leave?</p>
        </div>
        <div className="lab-dialog-footer">
          <button className="lab-button-secondary" onClick={onContinue}>
            Continue Editing
          </button>
          <button className="lab-button-danger" onClick={onDiscard}>
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export type DuplicateTestDialogProps = {
  testName: string
  onContinue: () => void
  onCancel: () => void
}

export function DuplicateTestDialog({ testName, onContinue, onCancel }: DuplicateTestDialogProps) {
  return (
    <div className="lab-dialog-overlay" onClick={onCancel}>
      <div className="lab-dialog small" onClick={(e) => e.stopPropagation()}>
        <div className="lab-dialog-header">
          <h2>
            <Icon name="alert-triangle" size={20} />
            Duplicate Test
          </h2>
        </div>
        <div className="lab-dialog-content">
          <p>
            The test <strong>{testName}</strong> is already selected for this request.
          </p>
          <p>Do you want to continue and add it again?</p>
        </div>
        <div className="lab-dialog-footer">
          <button className="lab-button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="lab-button-primary" onClick={onContinue}>
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  )
}

export type CancelRequestDialogProps = {
  request: LaboratoryRequest
  onConfirm: () => void
  onCancel: () => void
}

export function CancelRequestDialog({ request, onConfirm, onCancel }: CancelRequestDialogProps) {
  return (
    <div className="lab-dialog-overlay" onClick={onCancel}>
      <div className="lab-dialog small" onClick={(e) => e.stopPropagation()}>
        <div className="lab-dialog-header">
          <h2>
            <Icon name="alert-triangle" size={20} />
            Cancel Laboratory Request
          </h2>
        </div>
        <div className="lab-dialog-content">
          <p>
            Are you sure you want to cancel this laboratory request?
          </p>
          <div className="lab-cancel-request-details">
            <div>Request ID: {request.id}</div>
            <div>Tests: {request.requestedTests.map((t) => t.testName).join(', ')}</div>
          </div>
          <p className="lab-cancel-request-warning">This action cannot be undone.</p>
        </div>
        <div className="lab-dialog-footer">
          <button className="lab-button-secondary" onClick={onCancel}>
            Keep Request
          </button>
          <button className="lab-button-danger" onClick={onConfirm}>
            Cancel Request
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
  state: LaboratoryOrdersState['saveState']
  lastSaved: string | null
}

export function SaveStateIndicator({ state, lastSaved }: SaveStateIndicatorProps) {
  if (state === 'idle') return null

  return (
    <div className={`lab-save-indicator ${state}`}>
      {state === 'saving' && (
        <>
          <span className="lab-save-indicator-spinner" />
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
    <div className="lab-notice read-only">
      <Icon name="lock" size={18} />
      <div>
        <strong>Read-only encounter</strong>
        <p>
          This encounter is {encounterStatus}. Laboratory requests cannot be created or modified.
        </p>
      </div>
    </div>
  )
}

export function PermissionDeniedNotice() {
  return (
    <div className="lab-notice permission-denied">
      <Icon name="alert-circle" size={18} />
      <div>
        <strong>Permission required</strong>
        <p>You do not have permission to create or modify laboratory requests.</p>
      </div>
    </div>
  )
}

export function CatalogueUnavailableNotice() {
  return (
    <div className="lab-notice catalogue-unavailable">
      <Icon name="alert-triangle" size={18} />
      <div>
        <strong>Test catalogue unavailable</strong>
        <p>
          The laboratory test catalogue is currently unavailable. Laboratory requests cannot be created
          until the catalogue is restored.
        </p>
      </div>
    </div>
  )
}
