import React from 'react';
import {
  CollectionRequest,
  CollectionDraft,
  RejectionDraft,
  SpecimenStatus,
  CollectionLocation,
  RejectionReason,
  RequestPriority,
  SpecimenCollectionContext,
  CollectionQueueState,
  canCollectSpecimen,
  canVerifySpecimen,
  canRejectSpecimen,
  validateCollectionDraft,
  formatSpecimenStatus,
  formatCollectionLocation,
  formatRejectionReason
} from './specimen-model';

// Queue Filters Component
interface QueueFiltersProps {
  state: CollectionQueueState;
  onFilterChange: (updates: Partial<CollectionQueueState>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export function QueueFilters({ state, onFilterChange, onClearFilters, resultCount }: QueueFiltersProps) {
  const hasActiveFilters = !!state.filterStatus || !!state.filterPriority || state.searchQuery.trim().length >= 2;

  return (
    <div className="specimen-queue-filters">
      <div className="specimen-filters-row">
        {/* Search */}
        <div className="specimen-filter-field">
          <label htmlFor="specimen-search" className="specimen-filter-label">
            Search
          </label>
          <input
            id="specimen-search"
            type="text"
            className="specimen-search-input"
            placeholder="Patient name, ID, request ID, specimen type..."
            value={state.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Status filter */}
        <div className="specimen-filter-field">
          <label htmlFor="specimen-status-filter" className="specimen-filter-label">
            Status
          </label>
          <select
            id="specimen-status-filter"
            className="specimen-filter-select"
            value={state.filterStatus || ''}
            onChange={(e) => onFilterChange({ filterStatus: e.target.value as SpecimenStatus || undefined })}
          >
            <option value="">All Statuses</option>
            <option value="awaiting-collection">Awaiting Collection</option>
            <option value="collection-started">Collection Started</option>
            <option value="collected-pending-verification">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Priority filter */}
        <div className="specimen-filter-field">
          <label htmlFor="specimen-priority-filter" className="specimen-filter-label">
            Priority
          </label>
          <select
            id="specimen-priority-filter"
            className="specimen-filter-select"
            value={state.filterPriority || ''}
            onChange={(e) => onFilterChange({ filterPriority: e.target.value as RequestPriority || undefined })}
          >
            <option value="">All Priorities</option>
            <option value="STAT">STAT</option>
            <option value="urgent">Urgent</option>
            <option value="routine">Routine</option>
          </select>
        </div>

        {/* Sort */}
        <div className="specimen-filter-field">
          <label htmlFor="specimen-sort" className="specimen-filter-label">
            Sort By
          </label>
          <select
            id="specimen-sort"
            className="specimen-filter-select"
            value={state.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
          >
            <option value="requested-date">Requested Date</option>
            <option value="patient-name">Patient Name</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Sort direction */}
        <div className="specimen-filter-field">
          <button
            type="button"
            className="specimen-sort-direction-button"
            onClick={() => onFilterChange({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' })}
            title={state.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {state.sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Results summary and clear */}
      <div className="specimen-filters-summary">
        <span className="specimen-results-count">
          {resultCount} {resultCount === 1 ? 'request' : 'requests'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="specimen-clear-filters-button"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

// Collection Request Table Component
interface CollectionRequestTableProps {
  requests: CollectionRequest[];
  context: SpecimenCollectionContext;
  onStartCollection: (request: CollectionRequest) => void;
  onStartVerification: (request: CollectionRequest) => void;
  onReject: (request: CollectionRequest) => void;
}

export function CollectionRequestTable({
  requests,
  context,
  onStartCollection,
  onStartVerification,
  onReject
}: CollectionRequestTableProps) {
  return (
    <div className="specimen-table-container">
      <table className="specimen-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Patient</th>
            <th>Specimen Type</th>
            <th>Tests</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <CollectionRequestRow
              key={request.requestId}
              request={request}
              context={context}
              onStartCollection={onStartCollection}
              onStartVerification={onStartVerification}
              onReject={onReject}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Collection Request Row Component
interface CollectionRequestRowProps {
  request: CollectionRequest;
  context: SpecimenCollectionContext;
  onStartCollection: (request: CollectionRequest) => void;
  onStartVerification: (request: CollectionRequest) => void;
  onReject: (request: CollectionRequest) => void;
}

function CollectionRequestRow({
  request,
  context,
  onStartCollection,
  onStartVerification,
  onReject
}: CollectionRequestRowProps) {
  const canCollect = canCollectSpecimen(request, context);
  const canVerify = canVerifySpecimen(request, context);
  const canReject = canRejectSpecimen(request, context);

  return (
    <tr className={`specimen-table-row specimen-status-${request.status}`}>
      <td className="specimen-cell-id">
        <span className="specimen-request-id">{request.requestId}</span>
      </td>
      <td className="specimen-cell-patient">
        <div className="specimen-patient-info">
          <span className="specimen-patient-name">{request.patientName}</span>
          <span className="specimen-patient-id">{request.patientId}</span>
        </div>
      </td>
      <td className="specimen-cell-type">
        {request.specimenType}
      </td>
      <td className="specimen-cell-tests">
        <div className="specimen-tests-list">
          {request.orderedTests.slice(0, 2).map((test, idx) => (
            <span key={idx} className="specimen-test-tag">{test}</span>
          ))}
          {request.orderedTests.length > 2 && (
            <span className="specimen-test-more">+{request.orderedTests.length - 2} more</span>
          )}
        </div>
      </td>
      <td className="specimen-cell-priority">
        <span className={`specimen-priority-badge specimen-priority-${request.priority}`}>
          {request.priority}
        </span>
      </td>
      <td className="specimen-cell-status">
        <span className={`specimen-status-badge specimen-status-${request.status}`}>
          {formatSpecimenStatus(request.status)}
        </span>
      </td>
      <td className="specimen-cell-date">
        {request.requestedAt.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
      <td className="specimen-cell-actions">
        <div className="specimen-action-buttons">
          {request.status === 'awaiting-collection' && canCollect && (
            <button
              type="button"
              className="specimen-action-button specimen-action-collect"
              onClick={() => onStartCollection(request)}
            >
              Collect
            </button>
          )}
          {request.status === 'collected-pending-verification' && canVerify && (
            <button
              type="button"
              className="specimen-action-button specimen-action-verify"
              onClick={() => onStartVerification(request)}
            >
              Verify
            </button>
          )}
          {canReject && request.status !== 'verified' && request.status !== 'rejected' && request.status !== 'cancelled' && (
            <button
              type="button"
              className="specimen-action-button specimen-action-reject"
              onClick={() => onReject(request)}
            >
              Reject
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Collection Form Panel Component
interface CollectionFormPanelProps {
  request: CollectionRequest;
  draft: CollectionDraft;
  context: SpecimenCollectionContext;
  onChange: (updates: Partial<CollectionDraft>) => void;
  onCancel: () => void;
  onConfirm: () => void;
  onReject: () => void;
}

export function CollectionFormPanel({
  request,
  draft,
  context,
  onChange,
  onCancel,
  onConfirm,
  onReject
}: CollectionFormPanelProps) {
  const validation = validateCollectionDraft(draft);

  return (
    <div className="specimen-collection-form">
      <div className="specimen-form-header">
        <h2 className="specimen-form-title">Specimen Collection</h2>
        <p className="specimen-form-subtitle">Complete all required fields to record specimen collection</p>
      </div>

      {/* Patient information */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Patient Information</h3>
        <div className="specimen-patient-details">
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Patient Name:</span>
            <span className="specimen-detail-value">{request.patientName}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Patient ID:</span>
            <span className="specimen-detail-value">{request.patientId}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Age/Gender:</span>
            <span className="specimen-detail-value">{request.patientAge}y {request.patientGender}</span>
          </div>
        </div>
      </div>

      {/* Request information */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Request Information</h3>
        <div className="specimen-patient-details">
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Request ID:</span>
            <span className="specimen-detail-value">{request.requestId}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Specimen Type:</span>
            <span className="specimen-detail-value">{request.specimenType}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Tests Ordered:</span>
            <span className="specimen-detail-value">{request.orderedTests.join(', ')}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Priority:</span>
            <span className={`specimen-priority-badge specimen-priority-${request.priority}`}>
              {request.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Collection form */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Collection Details</h3>

        {/* Patient confirmation */}
        <div className="specimen-form-field">
          <label className="specimen-checkbox-label">
            <input
              type="checkbox"
              className="specimen-checkbox"
              checked={draft.patientConfirmed}
              onChange={(e) => onChange({ patientConfirmed: e.target.checked })}
            />
            <span className="specimen-checkbox-text">
              I have confirmed the patient's identity using two identifiers (name and ID)
              <span className="specimen-required-mark">*</span>
            </span>
          </label>
        </div>

        {/* Specimen identifier */}
        <div className="specimen-form-field">
          <label htmlFor="specimen-identifier" className="specimen-field-label">
            Specimen Identifier (Barcode/Label)
            <span className="specimen-required-mark">*</span>
          </label>
          <input
            id="specimen-identifier"
            type="text"
            className="specimen-text-input"
            placeholder="Enter specimen barcode or label number"
            value={draft.specimenIdentifier}
            onChange={(e) => onChange({ specimenIdentifier: e.target.value })}
          />
        </div>

        {/* Collection location */}
        <div className="specimen-form-field">
          <label htmlFor="collection-location" className="specimen-field-label">
            Collection Location
            <span className="specimen-required-mark">*</span>
          </label>
          <select
            id="collection-location"
            className="specimen-select-input"
            value={draft.collectionLocation}
            onChange={(e) => onChange({ collectionLocation: e.target.value as CollectionLocation })}
          >
            <option value="outpatient-lab">Outpatient Laboratory</option>
            <option value="inpatient-ward">Inpatient Ward</option>
            <option value="emergency-department">Emergency Department</option>
            <option value="operating-room">Operating Room</option>
            <option value="icu">ICU</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Collection date/time */}
        <div className="specimen-form-field">
          <label htmlFor="collection-datetime" className="specimen-field-label">
            Collection Date/Time
            <span className="specimen-required-mark">*</span>
          </label>
          <input
            id="collection-datetime"
            type="datetime-local"
            className="specimen-text-input"
            value={draft.collectionDateTime.toISOString().slice(0, 16)}
            onChange={(e) => onChange({ collectionDateTime: new Date(e.target.value) })}
          />
        </div>

        {/* Collector notes */}
        <div className="specimen-form-field">
          <label htmlFor="collector-notes" className="specimen-field-label">
            Collection Notes (Optional)
          </label>
          <textarea
            id="collector-notes"
            className="specimen-textarea-input"
            placeholder="Any relevant observations or issues during collection..."
            rows={3}
            value={draft.collectorNotes}
            onChange={(e) => onChange({ collectorNotes: e.target.value })}
          />
        </div>

        {/* Separate verification notice */}
        {draft.requiresSeparateVerification && (
          <div className="specimen-verification-notice">
            <svg className="specimen-notice-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>This specimen requires separate verification by another staff member.</span>
          </div>
        )}
      </div>

      {/* Validation errors */}
      {!validation.valid && validation.errors.length > 0 && (
        <div className="specimen-validation-errors">
          <p className="specimen-error-title">Please complete the following:</p>
          <ul className="specimen-error-list">
            {validation.errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="specimen-form-actions">
        <button
          type="button"
          className="specimen-button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="specimen-button-danger"
          onClick={onReject}
        >
          Reject Specimen
        </button>
        <button
          type="button"
          className="specimen-button-primary"
          onClick={onConfirm}
          disabled={!validation.valid}
        >
          Confirm Collection
        </button>
      </div>
    </div>
  );
}

// Verification Review Panel Component
interface VerificationReviewPanelProps {
  request: CollectionRequest;
  context: SpecimenCollectionContext;
  onCancel: () => void;
  onConfirm: () => void;
  onReject: () => void;
}

export function VerificationReviewPanel({
  request,
  context,
  onCancel,
  onConfirm,
  onReject
}: VerificationReviewPanelProps) {
  return (
    <div className="specimen-verification-panel">
      <div className="specimen-form-header">
        <h2 className="specimen-form-title">Specimen Verification</h2>
        <p className="specimen-form-subtitle">Review collection details and verify specimen quality</p>
      </div>

      {/* Patient information */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Patient Information</h3>
        <div className="specimen-patient-details">
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Patient Name:</span>
            <span className="specimen-detail-value">{request.patientName}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Patient ID:</span>
            <span className="specimen-detail-value">{request.patientId}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Age/Gender:</span>
            <span className="specimen-detail-value">{request.patientAge}y {request.patientGender}</span>
          </div>
        </div>
      </div>

      {/* Request information */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Request Information</h3>
        <div className="specimen-patient-details">
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Request ID:</span>
            <span className="specimen-detail-value">{request.requestId}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Specimen Type:</span>
            <span className="specimen-detail-value">{request.specimenType}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Tests Ordered:</span>
            <span className="specimen-detail-value">{request.orderedTests.join(', ')}</span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Priority:</span>
            <span className={`specimen-priority-badge specimen-priority-${request.priority}`}>
              {request.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Collection details */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Collection Details</h3>
        <div className="specimen-patient-details">
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Specimen Identifier:</span>
            <span className="specimen-detail-value specimen-identifier-highlight">
              {request.specimenIdentifier || 'Not recorded'}
            </span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Collection Location:</span>
            <span className="specimen-detail-value">
              {request.collectionLocation ? formatCollectionLocation(request.collectionLocation) : 'Not recorded'}
            </span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Collection Date/Time:</span>
            <span className="specimen-detail-value">
              {request.collectionDateTime?.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) || 'Not recorded'}
            </span>
          </div>
          <div className="specimen-detail-row">
            <span className="specimen-detail-label">Collected By:</span>
            <span className="specimen-detail-value">
              {request.collectedBy ? `${request.collectedBy.staffName} (${request.collectedBy.staffId})` : 'Not recorded'}
            </span>
          </div>
          {request.collectorNotes && (
            <div className="specimen-detail-row specimen-detail-full">
              <span className="specimen-detail-label">Collection Notes:</span>
              <span className="specimen-detail-value">{request.collectorNotes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification checklist */}
      <div className="specimen-form-section">
        <h3 className="specimen-section-title">Verification Checklist</h3>
        <div className="specimen-checklist">
          <div className="specimen-checklist-item">
            <svg className="specimen-checklist-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Specimen label matches patient identifier</span>
          </div>
          <div className="specimen-checklist-item">
            <svg className="specimen-checklist-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Specimen type is correct for ordered tests</span>
          </div>
          <div className="specimen-checklist-item">
            <svg className="specimen-checklist-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Specimen volume is sufficient</span>
          </div>
          <div className="specimen-checklist-item">
            <svg className="specimen-checklist-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Container is intact without leakage</span>
          </div>
          <div className="specimen-checklist-item">
            <svg className="specimen-checklist-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No visible contamination or hemolysis</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="specimen-form-actions">
        <button
          type="button"
          className="specimen-button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="specimen-button-danger"
          onClick={onReject}
        >
          Reject Specimen
        </button>
        <button
          type="button"
          className="specimen-button-primary"
          onClick={onConfirm}
        >
          Verify Specimen
        </button>
      </div>
    </div>
  );
}

// Rejection Dialog Component
interface RejectionDialogProps {
  request: CollectionRequest;
  draft: RejectionDraft;
  onChange: (updates: Partial<RejectionDraft>) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RejectionDialog({
  request,
  draft,
  onChange,
  onCancel,
  onConfirm
}: RejectionDialogProps) {
  const validation = validateRejectionDraft(draft);

  return (
    <div className="specimen-dialog-overlay">
      <div className="specimen-dialog specimen-rejection-dialog">
        <div className="specimen-dialog-header">
          <h3 className="specimen-dialog-title">Reject Specimen</h3>
          <button
            type="button"
            className="specimen-dialog-close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="specimen-dialog-content">
          <div className="specimen-rejection-warning">
            <svg className="specimen-warning-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>You are about to reject this specimen. The clinician will need to create a new request.</p>
          </div>

          {/* Patient info */}
          <div className="specimen-rejection-info">
            <div className="specimen-detail-row">
              <span className="specimen-detail-label">Patient:</span>
              <span className="specimen-detail-value">{request.patientName} ({request.patientId})</span>
            </div>
            <div className="specimen-detail-row">
              <span className="specimen-detail-label">Request ID:</span>
              <span className="specimen-detail-value">{request.requestId}</span>
            </div>
            <div className="specimen-detail-row">
              <span className="specimen-detail-label">Specimen:</span>
              <span className="specimen-detail-value">{request.specimenType}</span>
            </div>
          </div>

          {/* Rejection reason */}
          <div className="specimen-form-field">
            <label htmlFor="rejection-reason" className="specimen-field-label">
              Rejection Reason
              <span className="specimen-required-mark">*</span>
            </label>
            <select
              id="rejection-reason"
              className="specimen-select-input"
              value={draft.reason}
              onChange={(e) => onChange({ reason: e.target.value as RejectionReason })}
            >
              <option value="incorrect-specimen-type">Incorrect Specimen Type</option>
              <option value="container-problem">Container Problem</option>
              <option value="insufficient-quantity">Insufficient Quantity</option>
              <option value="damaged-container">Damaged Container</option>
              <option value="labeling-issue">Labeling Issue</option>
              <option value="contaminated">Contaminated</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Rejection notes */}
          <div className="specimen-form-field">
            <label htmlFor="rejection-notes" className="specimen-field-label">
              Detailed Notes
              <span className="specimen-required-mark">*</span>
            </label>
            <textarea
              id="rejection-notes"
              className="specimen-textarea-input"
              placeholder="Provide specific details about why this specimen is being rejected..."
              rows={4}
              value={draft.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </div>

          {/* Validation errors */}
          {!validation.valid && validation.errors.length > 0 && (
            <div className="specimen-validation-errors">
              <ul className="specimen-error-list">
                {validation.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="specimen-dialog-actions">
          <button
            type="button"
            className="specimen-button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="specimen-button-danger"
            onClick={onConfirm}
            disabled={!validation.valid}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// Success Notices
interface SuccessNoticeProps {
  message: string;
  onDismiss: () => void;
}

export function CollectionSuccessNotice({ message, onDismiss }: SuccessNoticeProps) {
  return (
    <div className="specimen-notice specimen-notice-success">
      <svg className="specimen-notice-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="specimen-notice-text">{message}</span>
      <button
        type="button"
        className="specimen-notice-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

export function VerificationSuccessNotice({ message, onDismiss }: SuccessNoticeProps) {
  return (
    <div className="specimen-notice specimen-notice-success">
      <svg className="specimen-notice-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="specimen-notice-text">{message}</span>
      <button
        type="button"
        className="specimen-notice-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

export function RejectionNotice({ message, onDismiss }: SuccessNoticeProps) {
  return (
    <div className="specimen-notice specimen-notice-warning">
      <svg className="specimen-notice-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span className="specimen-notice-text">{message}</span>
      <button
        type="button"
        className="specimen-notice-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

// Empty Queue State Component
interface EmptyQueueStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyQueueState({ hasActiveFilters, onClearFilters }: EmptyQueueStateProps) {
  return (
    <div className="specimen-empty-state">
      <svg className="specimen-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <h3 className="specimen-empty-title">
        {hasActiveFilters ? 'No specimens match your filters' : 'No specimens pending collection or verification'}
      </h3>
      <p className="specimen-empty-description">
        {hasActiveFilters
          ? 'Try adjusting or clearing your filters to see more requests.'
          : 'All specimens have been collected and verified. New requests will appear here.'}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          className="specimen-button-primary"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
