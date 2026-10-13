/**
 * Laboratory Result Review Components (Prompt 34)
 * UI components for result review and approval workflow
 */

import React, { useState } from 'react'
import type {
  ReviewQueueItem,
  ReviewOrder,
  ReviewContext,
  ReviewStatus,
  CorrectionReason,
  CorrectionRequest,
  ReviewResult,
  HistoricalResult,
  TestResultSet,
  AuditEvent,
} from './review-model'
import {
  getReviewStatusLabel,
  getReviewStatusColor,
  getCorrectionReasonLabel,
  getAuditEventLabel,
  formatWaitingDuration,
  formatDateTime,
  formatDate,
  formatTime,
  canApproveOrder,
  canRequestCorrection,
  validateCorrectionRequest,
  hasCriticalRequiringEscalation,
} from './review-model'
import { getPriorityLabel, getPriorityColor } from './model'

// ============================================================================
// 1. REVIEW PAGE HEADER
// ============================================================================

interface ReviewPageHeaderProps {
  currentUser: string
  currentRole: string
  onRefresh: () => void
  onBack?: () => void
  selectedOrder?: ReviewOrder
}

export function ReviewPageHeader({
  currentUser,
  currentRole,
  onRefresh,
  onBack,
  selectedOrder,
}: ReviewPageHeaderProps) {
  return (
    <div className="review-header">
      <div className="review-header-content">
        <div className="review-header-left">
          {onBack && (
            <button
              className="review-back-button"
              onClick={onBack}
              aria-label="Back to review queue"
            >
              <svg className="icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Queue
            </button>
          )}
          
          <div className="review-header-info">
            <h1>Laboratory Result Review</h1>
            <p className="review-breadcrumb">
              Dashboard / Laboratory / Result Review
              {selectedOrder && ` / ${selectedOrder.orderNumber}`}
            </p>
          </div>
        </div>
        
        <div className="review-header-right">
          <div className="review-user-info">
            <span className="review-user-name">{currentUser}</span>
            <span className="review-user-role">{currentRole}</span>
          </div>
          
          <button
            className="review-refresh-button"
            onClick={onRefresh}
            aria-label="Refresh"
          >
            <svg className="icon-refresh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. REVIEW QUEUE PANEL (Summary Metrics)
// ============================================================================

interface ReviewQueuePanelProps {
  metrics: {
    pending: number
    urgent: number
    critical: number
    returned: number
  }
  onFilterCritical: () => void
  criticalFilterActive: boolean
}

export function ReviewQueuePanel({
  metrics,
  onFilterCritical,
  criticalFilterActive,
}: ReviewQueuePanelProps) {
  return (
    <div className="review-queue-panel">
      <h2 className="review-queue-title">Review Queue</h2>
      <p className="review-queue-subtitle">
        All demonstration figures are fictional for design preview purposes
      </p>
      
      <div className="review-metrics-grid">
        <div className="review-metric-card">
          <div className="review-metric-icon pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="review-metric-content">
            <span className="review-metric-value">{metrics.pending}</span>
            <span className="review-metric-label">Pending Review</span>
          </div>
        </div>
        
        <div className="review-metric-card">
          <div className="review-metric-icon urgent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="review-metric-content">
            <span className="review-metric-value">{metrics.urgent}</span>
            <span className="review-metric-label">Urgent Orders</span>
          </div>
        </div>
        
        <div
          className={`review-metric-card ${criticalFilterActive ? 'active' : ''}`}
          onClick={onFilterCritical}
          style={{ cursor: 'pointer' }}
        >
          <div className="review-metric-icon critical">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
          <div className="review-metric-content">
            <span className="review-metric-value">{metrics.critical}</span>
            <span className="review-metric-label">Critical Findings</span>
          </div>
        </div>
        
        <div className="review-metric-card">
          <div className="review-metric-icon returned">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          <div className="review-metric-content">
            <span className="review-metric-value">{metrics.returned}</span>
            <span className="review-metric-label">Returned for Correction</span>
          </div>
        </div>
      </div>
    </div>
  )
}


// ============================================================================
// 3. REVIEW QUEUE TABLE
// ============================================================================

interface ReviewQueueTableProps {
  items: ReviewQueueItem[]
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: ReviewStatus | 'all'
  onStatusFilterChange: (status: ReviewStatus | 'all') => void
  priorityFilter: 'all' | 'urgent' | 'stat'
  onPriorityFilterChange: (priority: 'all' | 'urgent' | 'stat') => void
  onOpenOrder: (orderId: string) => void
}

export function ReviewQueueTable({
  items,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onOpenOrder,
}: ReviewQueueTableProps) {
  return (
    <div className="review-queue-table-container">
      <div className="review-queue-filters">
        <div className="review-search-box">
          <svg className="review-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="review-search-input"
            placeholder="Search patient name, ID, order number, or test..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <select
          className="review-filter-select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as ReviewStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value="pending-review">Pending Review</option>
          <option value="under-review">Under Review</option>
          <option value="returned-for-correction">Returned for Correction</option>
          <option value="approved">Approved</option>
        </select>
        
        <select
          className="review-filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as 'all' | 'urgent' | 'stat')}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="stat">Stat</option>
        </select>
      </div>
      
      {items.length === 0 ? (
        <div className="review-empty-queue">
          <svg className="review-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <h3>No orders match these filters</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <table className="review-queue-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Patient</th>
              <th>Test</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Submitted</th>
              <th>Waiting</th>
              <th>Status</th>
              <th>Flags</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.orderId} className="review-queue-row">
                <td className="review-order-number">{item.orderNumber}</td>
                <td>
                  <div className="review-patient-cell">
                    <span className="review-patient-name">{item.patientName}</span>
                    <span className="review-patient-id">{item.patientId}</span>
                  </div>
                </td>
                <td>{item.testSummary}</td>
                <td>{item.orderingDepartment}</td>
                <td>
                  <span className={`review-priority-badge priority-${item.priority}`}>
                    {getPriorityLabel(item.priority)}
                  </span>
                </td>
                <td>{formatTime(item.submittedAt)}</td>
                <td>
                  <span className={item.waitingDuration > 120 ? 'review-waiting-long' : ''}>
                    {formatWaitingDuration(item.waitingDuration)}
                  </span>
                </td>
                <td>
                  <span className={`review-status-badge status-${getReviewStatusColor(item.reviewStatus)}`}>
                    {getReviewStatusLabel(item.reviewStatus)}
                  </span>
                </td>
                <td>
                  <div className="review-flags-cell">
                    {item.hasCriticalFindings && (
                      <span className="review-flag-indicator critical" title="Critical findings">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        </svg>
                      </span>
                    )}
                    {item.hasAbnormalFindings && !item.hasCriticalFindings && (
                      <span className="review-flag-indicator abnormal" title="Abnormal findings">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    className="review-open-button"
                    onClick={() => onOpenOrder(item.orderId)}
                  >
                    Open Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}


// ============================================================================
// 4. ORDER SUMMARY CARD
// ============================================================================

interface OrderSummaryCardProps {
  order: ReviewOrder
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <div className="review-order-summary">
      <div className="review-summary-header">
        <h2>Patient and Order Summary</h2>
        <span className={`review-status-badge status-${getReviewStatusColor(order.reviewStatus)}`}>
          {getReviewStatusLabel(order.reviewStatus)}
        </span>
      </div>
      
      <div className="review-summary-grid">
        <div className="review-summary-field">
          <span className="review-summary-label">Patient Name</span>
          <span className="review-summary-value">{order.patientName}</span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Patient ID</span>
          <span className="review-summary-value">{order.patientId}</span>
        </div>
        
        {order.age && (
          <div className="review-summary-field">
            <span className="review-summary-label">Age</span>
            <span className="review-summary-value">{order.age} years</span>
          </div>
        )}
        
        {order.sex && (
          <div className="review-summary-field">
            <span className="review-summary-label">Sex</span>
            <span className="review-summary-value">{order.sex}</span>
          </div>
        )}
        
        <div className="review-summary-field">
          <span className="review-summary-label">Order Number</span>
          <span className="review-summary-value">{order.orderNumber}</span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Ordering Clinician</span>
          <span className="review-summary-value">{order.orderingClinician}</span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Department</span>
          <span className="review-summary-value">{order.orderingDepartment}</span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Order Date</span>
          <span className="review-summary-value">{formatDateTime(order.orderDate)}</span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Priority</span>
          <span className={`review-priority-badge priority-${order.priority}`}>
            {getPriorityLabel(order.priority)}
          </span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Specimen Type</span>
          <span className="review-summary-value">{order.specimenType}</span>
        </div>
        
        {order.specimenCollectedAt && (
          <div className="review-summary-field">
            <span className="review-summary-label">Specimen Collected</span>
            <span className="review-summary-value">{formatDateTime(order.specimenCollectedAt)}</span>
          </div>
        )}
        
        {order.specimenReceivedAt && (
          <div className="review-summary-field">
            <span className="review-summary-label">Specimen Received</span>
            <span className="review-summary-value">{formatDateTime(order.specimenReceivedAt)}</span>
          </div>
        )}
        
        <div className="review-summary-field">
          <span className="review-summary-label">Submitted By</span>
          <span className="review-summary-value">{order.submittedBy}</span>
        </div>
        
        <div className="review-summary-field">
          <span className="review-summary-label">Submitted At</span>
          <span className="review-summary-value">{formatDateTime(order.submittedAt)}</span>
        </div>
      </div>
      
      <div className="review-summary-notice">
        All patient records are fictional for design preview purposes
      </div>
    </div>
  )
}

// ============================================================================
// 5. TEST RESULTS REVIEW TABLE
// ============================================================================

interface TestResultsReviewTableProps {
  tests: TestResultSet[]
  historicalResults?: HistoricalResult[]
  onToggleHistorical: () => void
  hasHistoricalResults: boolean
  canViewHistorical: boolean
}

export function TestResultsReviewTable({
  tests,
  historicalResults,
  onToggleHistorical,
  hasHistoricalResults,
  canViewHistorical,
}: TestResultsReviewTableProps) {
  return (
    <div className="review-results-container">
      <div className="review-results-header">
        <h2>Test Results</h2>
        {canViewHistorical && hasHistoricalResults && (
          <button
            className="review-toggle-historical"
            onClick={onToggleHistorical}
          >
            <svg className="icon-history" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {historicalResults ? 'Hide' : 'Show'} Historical Comparison
          </button>
        )}
      </div>
      
      {tests.map((test) => (
        <div key={test.testId} className="review-test-section">
          <div className="review-test-header">
            <h3>{test.testName}</h3>
            <div className="review-test-meta">
              <span className="review-test-submitter">
                Submitted by {test.submittedBy}
              </span>
              <span className="review-test-time">{formatDateTime(test.submittedAt)}</span>
            </div>
          </div>
          
          {test.criticalCount > 0 && (
            <div className="review-critical-alert">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <span>
                <strong>Critical Findings:</strong> {test.criticalCount} result{test.criticalCount !== 1 && 's'} require immediate attention
              </span>
            </div>
          )}
          
          <table className="review-results-table">
            <thead>
              <tr>
                <th>Test / Analyte</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Reference Interval</th>
                <th>Flag</th>
                {historicalResults && <th>Previous Result</th>}
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {test.results.map((result, index) => {
                const historical = historicalResults?.find(h => h.analyteName === result.analyteName)
                return (
                  <tr key={index} className={`review-result-row ${result.flag === 'critical-low' || result.flag === 'critical-high' ? 'critical' : ''}`}>
                    <td className="review-analyte-name">{result.analyteName}</td>
                    <td className="review-result-value">{result.value}</td>
                    <td className="review-result-unit">{result.unit}</td>
                    <td className="review-reference-range">{result.referenceInterval}</td>
                    <td>
                      <span className={`review-result-flag flag-${result.flag}`}>
                        {result.flag === 'normal' && 'Normal'}
                        {result.flag === 'low' && 'Low'}
                        {result.flag === 'high' && 'High'}
                        {result.flag === 'critical-low' && (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            </svg>
                            Critical Low
                          </>
                        )}
                        {result.flag === 'critical-high' && (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            </svg>
                            Critical High
                          </>
                        )}
                        {result.flag === 'abnormal' && 'Abnormal'}
                        {result.flag === 'not-applicable' && 'N/A'}
                      </span>
                    </td>
                    {historicalResults && (
                      <td className="review-historical-value">
                        {historical ? (
                          <div>
                            <span>{historical.value} {historical.unit}</span>
                            <span className="review-historical-date">
                              ({formatDate(historical.resultDate)})
                            </span>
                          </div>
                        ) : (
                          <span className="review-no-historical">—</span>
                        )}
                      </td>
                    )}
                    <td className="review-result-comments">
                      {result.entryComments || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {test.laboratoryComments && (
            <div className="review-lab-comments">
              <strong>Laboratory Comments:</strong> {test.laboratoryComments}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


// ============================================================================
// 6. SPECIMEN CONTEXT PANEL
// ============================================================================

interface SpecimenContextPanelProps {
  order: ReviewOrder
  onClose: () => void
}

export function SpecimenContextPanel({ order, onClose }: SpecimenContextPanelProps) {
  return (
    <div className="review-specimen-panel">
      <div className="review-panel-header">
        <h3>Specimen Information</h3>
        <button className="review-panel-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="review-panel-content">
        <div className="review-specimen-field">
          <span className="review-field-label">Specimen Type</span>
          <span className="review-field-value">{order.specimenType}</span>
        </div>
        
        {order.specimenId && (
          <div className="review-specimen-field">
            <span className="review-field-label">Specimen ID</span>
            <span className="review-field-value">{order.specimenId}</span>
          </div>
        )}
        
        {order.specimenCollectedAt && (
          <div className="review-specimen-field">
            <span className="review-field-label">Collection Time</span>
            <span className="review-field-value">{formatDateTime(order.specimenCollectedAt)}</span>
          </div>
        )}
        
        {order.specimenReceivedAt && (
          <div className="review-specimen-field">
            <span className="review-field-label">Received Time</span>
            <span className="review-field-value">{formatDateTime(order.specimenReceivedAt)}</span>
          </div>
        )}
        
        {order.specimenCondition && (
          <div className="review-specimen-field">
            <span className="review-field-label">Specimen Condition</span>
            <span className="review-field-value">{order.specimenCondition}</span>
          </div>
        )}
        
        {order.specimenNotes && (
          <div className="review-specimen-field">
            <span className="review-field-label">Collection Notes</span>
            <span className="review-field-value">{order.specimenNotes}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 7. HISTORICAL COMPARISON PANEL
// ============================================================================

interface HistoricalComparisonPanelProps {
  currentResults: ReviewResult[]
  historicalResults: HistoricalResult[]
  onClose: () => void
}

export function HistoricalComparisonPanel({
  currentResults,
  historicalResults,
  onClose,
}: HistoricalComparisonPanelProps) {
  return (
    <div className="review-historical-panel">
      <div className="review-panel-header">
        <h3>Historical Comparison</h3>
        <button className="review-panel-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="review-panel-content">
        <p className="review-historical-note">
          Previous results from {historicalResults.length > 0 ? formatDate(historicalResults[0].resultDate) : 'earlier order'}
        </p>
        
        <table className="review-comparison-table">
          <thead>
            <tr>
              <th>Analyte</th>
              <th>Previous</th>
              <th>Current</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {currentResults.map((current) => {
              const historical = historicalResults.find(h => h.analyteName === current.analyteName)
              if (!historical) return null
              
              const prevValue = parseFloat(historical.value)
              const currValue = parseFloat(current.value)
              const change = currValue - prevValue
              const percentChange = ((change / prevValue) * 100).toFixed(1)
              
              return (
                <tr key={current.analyteName}>
                  <td className="review-comparison-analyte">{current.analyteName}</td>
                  <td className="review-comparison-previous">
                    {historical.value} {historical.unit}
                  </td>
                  <td className="review-comparison-current">
                    {current.value} {current.unit}
                  </td>
                  <td className={`review-comparison-change ${change > 0 ? 'increase' : change < 0 ? 'decrease' : 'no-change'}`}>
                    {change > 0 && '↑'}
                    {change < 0 && '↓'}
                    {change === 0 && '—'}
                    {change !== 0 && ` ${Math.abs(change).toFixed(1)} (${percentChange}%)`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        <p className="review-historical-disclaimer">
          Historical comparison is for reference only. Clinical interpretation requires full context.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 8. REVIEW DECISION PANEL
// ============================================================================

interface ReviewDecisionPanelProps {
  order: ReviewOrder
  context: ReviewContext
  reviewNotes: string
  onReviewNotesChange: (notes: string) => void
  onSaveNotes: () => void
  isSavingNotes: boolean
  onApprove: () => void
  onRequestCorrection: () => void
  onToggleSpecimenContext: () => void
  onToggleAuditHistory: () => void
  showSpecimenContext: boolean
  showAuditHistory: boolean
}

export function ReviewDecisionPanel({
  order,
  context,
  reviewNotes,
  onReviewNotesChange,
  onSaveNotes,
  isSavingNotes,
  onApprove,
  onRequestCorrection,
  onToggleSpecimenContext,
  onToggleAuditHistory,
  showSpecimenContext,
  showAuditHistory,
}: ReviewDecisionPanelProps) {
  const approvalCheck = canApproveOrder(order, context.permissions)
  const correctionCheck = canRequestCorrection(order, context.permissions)
  
  return (
    <div className="review-decision-panel">
      <div className="review-decision-header">
        <h3>Review Decision</h3>
        <span className={`review-status-badge status-${getReviewStatusColor(order.reviewStatus)}`}>
          {getReviewStatusLabel(order.reviewStatus)}
        </span>
      </div>
      
      <div className="review-decision-summary">
        <div className="review-summary-item">
          <span className="review-summary-label">Tests Requested</span>
          <span className="review-summary-count">{order.totalTests}</span>
        </div>
        
        <div className="review-summary-item">
          <span className="review-summary-label">Tests Completed</span>
          <span className="review-summary-count">{order.completedTests}</span>
        </div>
        
        {order.totalValidationIssues > 0 && (
          <div className="review-summary-item warning">
            <span className="review-summary-label">Validation Issues</span>
            <span className="review-summary-count">{order.totalValidationIssues}</span>
          </div>
        )}
        
        {order.totalAbnormalFindings > 0 && (
          <div className="review-summary-item">
            <span className="review-summary-label">Abnormal Findings</span>
            <span className="review-summary-count">{order.totalAbnormalFindings}</span>
          </div>
        )}
        
        {order.totalCriticalFindings > 0 && (
          <div className="review-summary-item critical">
            <span className="review-summary-label">Critical Findings</span>
            <span className="review-summary-count">{order.totalCriticalFindings}</span>
          </div>
        )}
      </div>
      
      <div className="review-notes-section">
        <label className="review-notes-label">
          Review Notes (Internal)
        </label>
        <textarea
          className="review-notes-textarea"
          placeholder="Add internal review notes..."
          value={reviewNotes}
          onChange={(e) => onReviewNotesChange(e.target.value)}
          rows={4}
        />
        <button
          className="review-save-notes-button"
          onClick={onSaveNotes}
          disabled={isSavingNotes}
        >
          {isSavingNotes ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
      
      <div className="review-actions-section">
        <h4>Review Actions</h4>
        
        <button
          className="review-action-button primary"
          onClick={onApprove}
          disabled={!approvalCheck.allowed}
          title={!approvalCheck.allowed ? approvalCheck.reason : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Approve Results
        </button>
        
        {!approvalCheck.allowed && (
          <p className="review-action-reason">{approvalCheck.reason}</p>
        )}
        
        <button
          className="review-action-button secondary"
          onClick={onRequestCorrection}
          disabled={!correctionCheck.allowed}
          title={!correctionCheck.allowed ? correctionCheck.reason : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
          Request Correction
        </button>
      </div>
      
      <div className="review-info-section">
        <h4>Additional Information</h4>
        
        <button
          className={`review-info-button ${showSpecimenContext ? 'active' : ''}`}
          onClick={onToggleSpecimenContext}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          Specimen Context
        </button>
        
        {context.permissions.canViewAuditHistory && (
          <button
            className={`review-info-button ${showAuditHistory ? 'active' : ''}`}
            onClick={onToggleAuditHistory}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Audit History
          </button>
        )}
      </div>
    </div>
  )
}


// ============================================================================
// 9. APPROVAL CONFIRMATION DIALOG
// ============================================================================

interface ApprovalConfirmationDialogProps {
  order: ReviewOrder
  reviewNotes?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ApprovalConfirmationDialog({
  order,
  reviewNotes,
  onConfirm,
  onCancel,
}: ApprovalConfirmationDialogProps) {
  return (
    <div className="review-modal-overlay" onClick={onCancel}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>Approve Laboratory Results</h3>
          <button className="review-modal-close" onClick={onCancel} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="review-modal-body">
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Patient:</strong> {order.patientName} ({order.patientId})</p>
          <p><strong>Test:</strong> {order.tests[0].testName}</p>
          
          {order.totalCriticalFindings > 0 && (
            <div className="review-modal-warning">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <div>
                <strong>Critical Findings Present</strong>
                <p>
                  This order contains {order.totalCriticalFindings} critical finding{order.totalCriticalFindings !== 1 && 's'}. 
                  Ensure ordering clinician has been notified according to hospital policy.
                </p>
              </div>
            </div>
          )}
          
          {reviewNotes && (
            <div className="review-modal-notes">
              <strong>Your Review Notes:</strong>
              <p>{reviewNotes}</p>
            </div>
          )}
          
          <p className="review-modal-confirm-text">
            By approving these results, you confirm that:
          </p>
          <ul className="review-modal-checklist">
            <li>All test results have been reviewed for accuracy</li>
            <li>Reference intervals and flags are appropriate</li>
            <li>Critical findings have been handled per hospital policy</li>
            <li>Results are ready for clinical use</li>
          </ul>
          
          <p className="review-modal-note">
            Approval does not automatically release results to the patient. 
            Separate release authorization may be required.
          </p>
        </div>
        
        <div className="review-modal-footer">
          <button className="review-modal-button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="review-modal-button primary" onClick={onConfirm}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. CORRECTION REQUEST DIALOG
// ============================================================================

interface CorrectionRequestDialogProps {
  order: ReviewOrder
  onConfirm: (request: CorrectionRequest) => void
  onCancel: () => void
}

export function CorrectionRequestDialog({
  order,
  onConfirm,
  onCancel,
}: CorrectionRequestDialogProps) {
  const [reason, setReason] = useState<CorrectionReason>('missing-required-result')
  const [affectedTest, setAffectedTest] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleSubmit = () => {
    const request: Partial<CorrectionRequest> = {
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      reason,
      affectedTest: affectedTest || undefined,
      description,
      requestedBy: 'Current User', // Would come from context
      requestedAt: new Date().toISOString(),
    }
    
    const validation = validateCorrectionRequest(request)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    onConfirm(request as CorrectionRequest)
  }
  
  return (
    <div className="review-modal-overlay" onClick={onCancel}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>Request Correction</h3>
          <button className="review-modal-close" onClick={onCancel} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="review-modal-body">
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Patient:</strong> {order.patientName} ({order.patientId})</p>
          
          <div className="review-form-field">
            <label className="review-form-label">
              Correction Reason <span className="review-required">*</span>
            </label>
            <select
              className="review-form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value as CorrectionReason)}
            >
              <option value="missing-required-result">Missing Required Result</option>
              <option value="incorrect-unit">Incorrect Unit</option>
              <option value="inconsistent-test-information">Inconsistent Test Information</option>
              <option value="invalid-result-format">Invalid Result Format</option>
              <option value="insufficient-documentation">Insufficient Documentation</option>
              <option value="other">Other (see description)</option>
            </select>
            {errors.reason && <span className="review-form-error">{errors.reason}</span>}
          </div>
          
          <div className="review-form-field">
            <label className="review-form-label">
              Affected Test (Optional)
            </label>
            <input
              type="text"
              className="review-form-input"
              placeholder="e.g., Hemoglobin, WBC Count"
              value={affectedTest}
              onChange={(e) => setAffectedTest(e.target.value)}
            />
          </div>
          
          <div className="review-form-field">
            <label className="review-form-label">
              Detailed Description <span className="review-required">*</span>
            </label>
            <textarea
              className="review-form-textarea"
              placeholder="Provide specific details about what needs to be corrected and why..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
            {errors.description && <span className="review-form-error">{errors.description}</span>}
          </div>
          
          <p className="review-modal-note">
            The laboratory technician will be notified and the order will be returned with your feedback. 
            A corrected submission will be placed back in the review queue.
          </p>
        </div>
        
        <div className="review-modal-footer">
          <button className="review-modal-button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="review-modal-button primary" onClick={handleSubmit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
            Submit Correction Request
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 11. AUDIT HISTORY PANEL
// ============================================================================

interface AuditHistoryPanelProps {
  events: AuditEvent[]
  onClose: () => void
}

export function AuditHistoryPanel({ events, onClose }: AuditHistoryPanelProps) {
  return (
    <div className="review-audit-panel">
      <div className="review-panel-header">
        <h3>Audit History</h3>
        <button className="review-panel-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="review-panel-content">
        <p className="review-audit-note">
          Audit events are recorded automatically and cannot be edited
        </p>
        
        <div className="review-audit-timeline">
          {events.map((event) => (
            <div key={event.eventId} className="review-audit-event">
              <div className="review-audit-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              
              <div className="review-audit-content">
                <div className="review-audit-header">
                  <strong>{getAuditEventLabel(event.eventType)}</strong>
                  <span className="review-audit-time">{formatDateTime(event.timestamp)}</span>
                </div>
                
                <div className="review-audit-meta">
                  <span>by {event.userName}</span>
                  {event.previousStatus && event.newStatus && (
                    <span>
                      • Status: {getReviewStatusLabel(event.previousStatus)} → {getReviewStatusLabel(event.newStatus)}
                    </span>
                  )}
                </div>
                
                {event.details && (
                  <p className="review-audit-details">{event.details}</p>
                )}
                
                {event.reason && (
                  <p className="review-audit-reason">
                    <strong>Reason:</strong> {event.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 12. LOADING AND EMPTY STATES
// ============================================================================

interface ReviewLoadingStateProps {
  message?: string
}

export function ReviewLoadingState({ message = 'Loading...' }: ReviewLoadingStateProps) {
  return (
    <div className="review-loading-state">
      <div className="review-loading-spinner" />
      <p>{message}</p>
    </div>
  )
}

interface ReviewEmptyStateProps {
  message?: string
}

export function ReviewEmptyState({ message = 'No data available' }: ReviewEmptyStateProps) {
  return (
    <div className="review-empty-state">
      <svg className="review-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <h3>{message}</h3>
    </div>
  )
}
