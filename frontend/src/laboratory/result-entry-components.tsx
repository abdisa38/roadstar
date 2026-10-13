import React from 'react';
import {
  ResultEntryOrder,
  TestResult,
  AnalyteResult,
  AnalyteDefinition,
  SaveState,
  ValidationSummary,
  formatResultFlag,
  formatSpecimenStatus,
  formatResultEntryStatus
} from './result-entry-model';
import { getPriorityLabel } from './model';

// Result Entry Header Component
interface ResultEntryHeaderProps {
  orderId: string;
  priority: string;
  onNavigateBack: () => void;
}

export function ResultEntryHeader({ orderId, priority, onNavigateBack }: ResultEntryHeaderProps) {
  return (
    <div className="result-entry-header">
      <div className="result-entry-breadcrumb">
        <button
          type="button"
          className="result-entry-breadcrumb-link"
          onClick={onNavigateBack}
        >
          Dashboard
        </button>
        <svg className="result-entry-breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="result-entry-breadcrumb-link">Laboratory</span>
        <svg className="result-entry-breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="result-entry-breadcrumb-link">Pending Orders</span>
        <svg className="result-entry-breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="result-entry-breadcrumb-current">Result Entry</span>
      </div>

      <div className="result-entry-header-content">
        <div>
          <h1 className="result-entry-title">Laboratory Result Entry</h1>
          <p className="result-entry-subtitle">Enter and validate laboratory findings before submitting them for review</p>
        </div>
        <div className="result-entry-header-meta">
          <span className="result-entry-order-id">Order: {orderId}</span>
          <span className={`result-entry-priority-badge result-entry-priority-${priority}`}>
            {getPriorityLabel(priority as any)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Patient and Order Summary Component
interface PatientOrderSummaryProps {
  order: ResultEntryOrder;
}

export function PatientOrderSummary({ order }: PatientOrderSummaryProps) {
  return (
    <div className="result-entry-patient-summary">
      <div className="patient-summary-section">
        <h2 className="patient-summary-title">Patient Information</h2>
        <div className="patient-summary-grid">
          <div className="patient-summary-item">
            <span className="patient-summary-label">Patient Name</span>
            <span className="patient-summary-value">{order.patientName}</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Patient ID</span>
            <span className="patient-summary-value">{order.patientId}</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Age</span>
            <span className="patient-summary-value">{order.patientAge} years</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Gender</span>
            <span className="patient-summary-value">{order.patientGender}</span>
          </div>
        </div>
      </div>

      <div className="patient-summary-section">
        <h2 className="patient-summary-title">Order Details</h2>
        <div className="patient-summary-grid">
          <div className="patient-summary-item">
            <span className="patient-summary-label">Encounter ID</span>
            <span className="patient-summary-value">{order.encounterId}</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Ordering Department</span>
            <span className="patient-summary-value">{order.orderingDepartment}</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Ordering Clinician</span>
            <span className="patient-summary-value">{order.orderingClinician}</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Order Date</span>
            <span className="patient-summary-value">
              {order.orderDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="patient-summary-section">
        <h2 className="patient-summary-title">Specimen Information</h2>
        <div className="patient-summary-grid">
          <div className="patient-summary-item">
            <span className="patient-summary-label">Specimen Type</span>
            <span className="patient-summary-value">{order.specimenType}</span>
          </div>
          <div className="patient-summary-item">
            <span className="patient-summary-label">Specimen Status</span>
            <span className={`specimen-status-badge specimen-status-${order.specimenStatus}`}>
              {formatSpecimenStatus(order.specimenStatus)}
            </span>
          </div>
          {order.specimenCollectionTime && (
            <div className="patient-summary-item">
              <span className="patient-summary-label">Collection Time</span>
              <span className="patient-summary-value">
                {order.specimenCollectionTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
          {order.specimenReceiptTime && (
            <div className="patient-summary-item">
              <span className="patient-summary-label">Receipt Time</span>
              <span className="patient-summary-value">
                {order.specimenReceiptTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Test Navigation Component
interface TestNavigationProps {
  tests: TestResult[];
  selectedTestId: string;
  onTestSelect: (testId: string) => void;
}

export function TestNavigation({ tests, selectedTestId, onTestSelect }: TestNavigationProps) {
  return (
    <div className="test-navigation">
      <h3 className="test-navigation-title">Requested Tests</h3>
      <div className="test-navigation-list">
        {tests.map(test => (
          <button
            key={test.testId}
            type="button"
            className={`test-navigation-item ${selectedTestId === test.testId ? 'test-navigation-item-active' : ''}`}
            onClick={() => onTestSelect(test.testId)}
          >
            <div className="test-navigation-item-header">
              <span className="test-navigation-item-name">{test.testName}</span>
              {test.hasCriticalValues && (
                <svg className="test-navigation-critical-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="test-navigation-item-status">
              <span className="test-navigation-progress">
                {test.completedAnalytes} / {test.totalAnalytes} completed
              </span>
              <span className={`test-navigation-status-badge test-status-${test.status}`}>
                {formatResultEntryStatus(test.status)}
              </span>
            </div>
            {test.hasValidationErrors && (
              <div className="test-navigation-error">
                <svg className="test-navigation-error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Validation errors</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Result Entry Form Component
interface ResultEntryFormProps {
  test: TestResult;
  definitions: AnalyteDefinition[];
  patientGender: 'male' | 'female' | 'other';
  onAnalyteChange: (analyteId: string, value: string) => void;
  onAnalyteCommentChange: (analyteId: string, comment: string) => void;
  onTestCommentChange: (comment: string) => void;
}

export function ResultEntryForm({
  test,
  definitions,
  patientGender,
  onAnalyteChange,
  onAnalyteCommentChange,
  onTestCommentChange
}: ResultEntryFormProps) {
  return (
    <div className="result-entry-form">
      <div className="result-entry-form-header">
        <h2 className="result-entry-form-title">{test.testName}</h2>
        <span className="result-entry-form-code">{test.testCode}</span>
      </div>

      <div className="analytes-table-container">
        <table className="analytes-table">
          <thead>
            <tr>
              <th className="analyte-column-name">Analyte</th>
              <th className="analyte-column-value">Result</th>
              <th className="analyte-column-unit">Unit</th>
              <th className="analyte-column-reference">Reference Interval</th>
              <th className="analyte-column-flag">Flag</th>
            </tr>
          </thead>
          <tbody>
            {test.analytes.map(analyte => {
              const definition = definitions.find(d => d.id === analyte.analyteId);
              if (!definition) return null;

              return (
                <AnalyteRow
                  key={analyte.analyteId}
                  analyte={analyte}
                  definition={definition}
                  patientGender={patientGender}
                  onValueChange={onAnalyteChange}
                  onCommentChange={onAnalyteCommentChange}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="result-entry-comments">
        <label htmlFor="test-comment" className="result-comment-label">
          Test Comment (Optional)
        </label>
        <textarea
          id="test-comment"
          className="result-comment-textarea"
          placeholder="Add any additional comments or observations for this test..."
          rows={3}
          value={test.overallComment || ''}
          onChange={(e) => onTestCommentChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// Analyte Row Component
interface AnalyteRowProps {
  analyte: AnalyteResult;
  definition: AnalyteDefinition;
  patientGender: 'male' | 'female' | 'other';
  onValueChange: (analyteId: string, value: string) => void;
  onCommentChange: (analyteId: string, comment: string) => void;
}

function AnalyteRow({
  analyte,
  definition,
  patientGender,
  onValueChange,
  onCommentChange
}: AnalyteRowProps) {
  const [showComment, setShowComment] = useState(false);

  const hasError = analyte.validationErrors.length > 0;
  const isCritical = analyte.flag === 'critical-low' || analyte.flag === 'critical-high';
  const isAbnormal = analyte.flag === 'low' || analyte.flag === 'high' || isCritical;

  // Format reference interval
  const refInterval = definition.referenceInterval;
  let refIntervalText = 'N/A';
  if (refInterval) {
    if (refInterval.text) {
      refIntervalText = refInterval.text;
    } else if (refInterval.min !== undefined && refInterval.max !== undefined) {
      refIntervalText = `${refInterval.min} - ${refInterval.max}`;
      if (refInterval.gender && refInterval.gender !== 'all') {
        refIntervalText += ` (${refInterval.gender})`;
      }
    }
  }

  return (
    <>
      <tr className={`analyte-row ${hasError ? 'analyte-row-error' : ''} ${isCritical ? 'analyte-row-critical' : ''}`}>
        <td className="analyte-cell-name">
          <div className="analyte-name-container">
            <span className="analyte-name">{analyte.analyteName}</span>
            {definition.required && (
              <span className="analyte-required-mark" title="Required">*</span>
            )}
          </div>
          {analyte.analyteName !== definition.shortName && (
            <span className="analyte-short-name">{definition.shortName}</span>
          )}
        </td>
        <td className="analyte-cell-value">
          <input
            type={definition.dataType === 'numeric' ? 'number' : 'text'}
            className={`analyte-value-input ${hasError ? 'analyte-input-error' : ''}`}
            value={analyte.value}
            onChange={(e) => onValueChange(analyte.analyteId, e.target.value)}
            step={definition.dataType === 'numeric' ? Math.pow(10, -definition.decimalPlaces) : undefined}
            placeholder={definition.required ? 'Required' : 'Optional'}
          />
          {hasError && (
            <div className="analyte-error-message">
              {analyte.validationErrors.map((error, idx) => (
                <span key={idx}>{error}</span>
              ))}
            </div>
          )}
        </td>
        <td className="analyte-cell-unit">
          <span className="analyte-unit">{analyte.unit}</span>
        </td>
        <td className="analyte-cell-reference">
          <span className="analyte-reference">{refIntervalText}</span>
        </td>
        <td className="analyte-cell-flag">
          {analyte.flag !== 'not-applicable' && analyte.flag !== 'normal' && (
            <div className={`analyte-flag-container analyte-flag-${analyte.flag}`}>
              {isCritical && (
                <svg className="analyte-flag-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {!isCritical && isAbnormal && (
                <svg className="analyte-flag-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="analyte-flag-label">{formatResultFlag(analyte.flag)}</span>
            </div>
          )}
        </td>
      </tr>
      {(showComment || analyte.comment) && (
        <tr className="analyte-comment-row">
          <td colSpan={5}>
            <textarea
              className="analyte-comment-input"
              placeholder="Add comment for this analyte..."
              value={analyte.comment || ''}
              onChange={(e) => onCommentChange(analyte.analyteId, e.target.value)}
              rows={2}
            />
          </td>
        </tr>
      )}
    </>
  );
}

// Validation Summary Panel Component
interface ValidationSummaryPanelProps {
  validationSummary: ValidationSummary;
  selectedTest?: TestResult;
}

export function ValidationSummaryPanel({ validationSummary, selectedTest }: ValidationSummaryPanelProps) {
  const hasErrors = validationSummary.errors.length > 0;
  const hasWarnings = validationSummary.warnings.length > 0;
  const hasCriticalValues = validationSummary.warnings.some(w => w.type === 'critical-value');

  return (
    <div className="validation-summary-panel">
      <h3 className="validation-summary-title">Validation Status</h3>

      {selectedTest && (
        <div className="validation-test-status">
          <div className="validation-stat">
            <span className="validation-stat-label">Completed</span>
            <span className="validation-stat-value">
              {selectedTest.completedAnalytes} / {selectedTest.totalAnalytes}
            </span>
          </div>
          <div className="validation-stat">
            <span className="validation-stat-label">Status</span>
            <span className={`validation-stat-badge validation-status-${selectedTest.status}`}>
              {formatResultEntryStatus(selectedTest.status)}
            </span>
          </div>
        </div>
      )}

      {hasCriticalValues && (
        <div className="validation-alert validation-alert-critical">
          <svg className="validation-alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="validation-alert-title">Critical Values Detected</div>
            <div className="validation-alert-message">
              Review critical values before submission
            </div>
          </div>
        </div>
      )}

      {hasErrors && (
        <div className="validation-section">
          <h4 className="validation-section-title">
            <svg className="validation-section-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Errors ({validationSummary.errors.length})
          </h4>
          <div className="validation-items">
            {validationSummary.errors.map((error, idx) => (
              <div key={idx} className="validation-item validation-item-error">
                <span className="validation-item-analyte">{error.analyteName}</span>
                <span className="validation-item-message">{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasWarnings && (
        <div className="validation-section">
          <h4 className="validation-section-title">
            <svg className="validation-section-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Warnings ({validationSummary.warnings.length})
          </h4>
          <div className="validation-items">
            {validationSummary.warnings.map((warning, idx) => (
              <div key={idx} className={`validation-item validation-item-warning validation-type-${warning.type}`}>
                {warning.analyteName && (
                  <span className="validation-item-analyte">{warning.analyteName}</span>
                )}
                <span className="validation-item-message">{warning.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasErrors && !hasWarnings && selectedTest && selectedTest.completedAnalytes > 0 && (
        <div className="validation-success">
          <svg className="validation-success-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>No validation errors</span>
        </div>
      )}
    </div>
  );
}

// Save Status Indicator Component
interface SaveStatusIndicatorProps {
  saveState: SaveState;
  lastSaved?: Date;
  hasUnsavedChanges: boolean;
}

export function SaveStatusIndicator({ saveState, lastSaved, hasUnsavedChanges }: SaveStatusIndicatorProps) {
  if (saveState === 'saving') {
    return (
      <div className="save-status save-status-saving">
        <svg className="save-status-spinner" viewBox="0 0 24 24">
          <circle className="save-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
        <span>Saving...</span>
      </div>
    );
  }

  if (saveState === 'saved') {
    return (
      <div className="save-status save-status-saved">
        <svg className="save-status-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Saved</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="save-status save-status-unsaved">
        <svg className="save-status-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        <span>Unsaved changes</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="save-status save-status-idle">
        <span>Last saved: {lastSaved.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    );
  }

  return null;
}

// Submit Confirmation Dialog Component
interface SubmitConfirmationDialogProps {
  order: ResultEntryOrder;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitConfirmationDialog({ order, onConfirm, onCancel }: SubmitConfirmationDialogProps) {
  const totalTests = order.requestedTests.length;
  const totalAnalytes = order.requestedTests.reduce((sum, test) => sum + test.totalAnalytes, 0);

  return (
    <div className="result-entry-dialog-overlay">
      <div className="result-entry-dialog">
        <div className="result-entry-dialog-header">
          <h3 className="result-entry-dialog-title">Submit Results for Review?</h3>
          <button
            type="button"
            className="result-entry-dialog-close"
            onClick={onCancel}
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="result-entry-dialog-content">
          <div className="submit-confirmation-summary">
            <div className="submit-summary-item">
              <span className="submit-summary-label">Patient</span>
              <span className="submit-summary-value">{order.patientName} ({order.patientId})</span>
            </div>
            <div className="submit-summary-item">
              <span className="submit-summary-label">Order</span>
              <span className="submit-summary-value">{order.orderId}</span>
            </div>
            <div className="submit-summary-item">
              <span className="submit-summary-label">Tests</span>
              <span className="submit-summary-value">{totalTests} test{totalTests !== 1 ? 's' : ''}</span>
            </div>
            <div className="submit-summary-item">
              <span className="submit-summary-label">Total Analytes</span>
              <span className="submit-summary-value">{totalAnalytes}</span>
            </div>
          </div>

          <div className="submit-confirmation-warning">
            <svg className="submit-warning-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              Once submitted, these results will be sent for authorized review. Please verify all entries before proceeding.
            </p>
          </div>
        </div>

        <div className="result-entry-dialog-actions">
          <button
            type="button"
            className="result-entry-button result-entry-button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="result-entry-button result-entry-button-primary"
            onClick={onConfirm}
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// Unsaved Changes Warning Component
interface UnsavedChangesWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesWarning({ onConfirm, onCancel }: UnsavedChangesWarningProps) {
  return (
    <div className="result-entry-dialog-overlay">
      <div className="result-entry-dialog">
        <div className="result-entry-dialog-header">
          <h3 className="result-entry-dialog-title">Unsaved Changes</h3>
        </div>

        <div className="result-entry-dialog-content">
          <div className="unsaved-warning">
            <svg className="unsaved-warning-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>
              You have unsaved changes. If you leave now, your work will be lost.
            </p>
          </div>
        </div>

        <div className="result-entry-dialog-actions">
          <button
            type="button"
            className="result-entry-button result-entry-button-secondary"
            onClick={onCancel}
          >
            Stay on Page
          </button>
          <button
            type="button"
            className="result-entry-button result-entry-button-danger"
            onClick={onConfirm}
          >
            Leave Without Saving
          </button>
        </div>
      </div>
    </div>
  );
}

// Specimen Not Ready State Component
interface SpecimenNotReadyStateProps {
  order: ResultEntryOrder;
  onNavigateBack: () => void;
}

export function SpecimenNotReadyState({ order, onNavigateBack }: SpecimenNotReadyStateProps) {
  return (
    <div className="specimen-not-ready-state">
      <div className="specimen-not-ready-container">
        <svg className="specimen-not-ready-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="specimen-not-ready-title">Specimen Not Ready for Result Entry</h2>
        <p className="specimen-not-ready-message">
          The specimen for this order has status: <strong>{formatSpecimenStatus(order.specimenStatus)}</strong>
        </p>
        <p className="specimen-not-ready-description">
          Results can only be entered for specimens that have been verified and accepted for processing.
          Please ensure the specimen has been received and verified before proceeding with result entry.
        </p>
        <div className="specimen-not-ready-actions">
          <button
            type="button"
            className="result-entry-button result-entry-button-primary"
            onClick={onNavigateBack}
          >
            Return to Orders
          </button>
        </div>
      </div>
    </div>
  );
}
