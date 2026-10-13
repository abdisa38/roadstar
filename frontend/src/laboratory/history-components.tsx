/**
 * Laboratory History Components (Prompt 35)
 * UI components for historical laboratory record retrieval
 */

import React, { useState } from 'react'
import type {
  HistoricalRecord,
  HistoricalRecordDetail,
  HistorySearchFilters,
  HistoryMetrics,
  HistoryPermissions,
  CorrectionRecord,
  AmendmentRecord,
  HistoricalTimelineEvent,
  ResultComparison,
} from './history-model'
import {
  getHistoricalOrderStatusLabel,
  getHistoricalOrderStatusColor,
  getHistoricalResultStatusLabel,
  getHistoricalResultStatusColor,
  getTimelineEventLabel,
  formatDateTime,
  formatDate,
  formatTime,
  createDefaultFilters,
} from './history-model'
import { getPriorityLabel } from './model'

// ============================================================================
// 1. HISTORY PAGE HEADER
// ============================================================================

interface HistoryPageHeaderProps {
  currentUser: string
  permissions: HistoryPermissions
  onRefresh: () => void
  onBack?: () => void
  onExport?: () => void
  onPrint?: () => void
  selectedRecord?: HistoricalRecordDetail
}

export function HistoryPageHeader({
  currentUser,
  permissions,
  onRefresh,
  onBack,
  onExport,
  onPrint,
  selectedRecord,
}: HistoryPageHeaderProps) {
  return (
    <div className="history-header">
      <div className="history-header-content">
        <div className="history-header-left">
          {onBack && (
            <button className="history-back-button" onClick={onBack}>
              <svg className="icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to History
            </button>
          )}

          <div className="history-header-info">
            <h1>Laboratory History</h1>
            <p className="history-breadcrumb">
              Dashboard / Laboratory / History
              {selectedRecord && ` / ${selectedRecord.orderNumber}`}
            </p>
          </div>
        </div>

        <div className="history-header-right">
          <div className="history-user-info">
            <span className="history-user-name">{currentUser}</span>
            <span className="history-user-note">
              Records displayed per access permissions
            </span>
          </div>

          {selectedRecord && permissions.canPrintRecords && (
            <button className="history-action-button" onClick={onPrint}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <path d="M6 14h12v8H6z" />
              </svg>
              Print
            </button>
          )}

          {permissions.canExportRecords && (
            <button className="history-action-button" onClick={onExport}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export
            </button>
          )}

          <button className="history-refresh-button" onClick={onRefresh}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="history-description">
        Search historical laboratory orders, review finalized results, and trace recorded changes.
      </div>
    </div>
  )
}

// ============================================================================
// 2. HISTORY METRICS PANEL
// ============================================================================

interface HistoryMetricsPanelProps {
  metrics: HistoryMetrics
  onMetricClick: (metric: keyof HistoryMetrics) => void
}

export function HistoryMetricsPanel({ metrics, onMetricClick }: HistoryMetricsPanelProps) {
  return (
    <div className="history-metrics-panel">
      <div className="history-metrics-grid">
        <div className="history-metric-card" onClick={() => onMetricClick('completedOrders')}>
          <div className="history-metric-icon completed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="history-metric-content">
            <span className="history-metric-value">{metrics.completedOrders}</span>
            <span className="history-metric-label">Completed Orders</span>
          </div>
        </div>

        <div className="history-metric-card" onClick={() => onMetricClick('resultsReleased')}>
          <div className="history-metric-icon released">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className="history-metric-content">
            <span className="history-metric-value">{metrics.resultsReleased}</span>
            <span className="history-metric-label">Results Released</span>
          </div>
        </div>

        <div className="history-metric-card" onClick={() => onMetricClick('correctedOrAmended')}>
          <div className="history-metric-icon corrected">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div className="history-metric-content">
            <span className="history-metric-value">{metrics.correctedOrAmended}</span>
            <span className="history-metric-label">Corrected or Amended</span>
          </div>
        </div>

        <div className="history-metric-card">
          <div className="history-metric-icon period">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div className="history-metric-content">
            <span className="history-metric-value">{metrics.recordsInPeriod}</span>
            <span className="history-metric-label">Records in Period</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. HISTORY SEARCH TOOLBAR
// ============================================================================

interface HistorySearchToolbarProps {
  filters: HistorySearchFilters
  onFiltersChange: (filters: HistorySearchFilters) => void
  onClearFilters: () => void
}

export function HistorySearchToolbar({
  filters,
  onFiltersChange,
  onClearFilters,
}: HistorySearchToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm })
  }

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: value },
    })
  }

  const activeFiltersCount = 
    (filters.patientId ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0) +
    (filters.orderStatus !== 'all' ? 1 : 0) +
    (filters.resultStatus !== 'all' ? 1 : 0) +
    (filters.showCorrectedOnly ? 1 : 0) +
    (filters.showReleasedOnly ? 1 : 0)

  return (
    <div className="history-search-toolbar">
      <div className="history-search-row">
        <div className="history-search-box">
          <svg className="history-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="history-search-input"
            placeholder="Search patient name, patient ID, order number, or test..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="history-date-range">
          <input
            type="date"
            className="history-date-input"
            value={filters.dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
          />
          <span className="history-date-separator">to</span>
          <input
            type="date"
            className="history-date-input"
            value={filters.dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
          />
        </div>

        <button
          className="history-filter-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          Filters
          {activeFiltersCount > 0 && (
            <span className="history-filter-badge">{activeFiltersCount}</span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button className="history-clear-filters" onClick={onClearFilters}>
            Clear All
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="history-advanced-filters">
          <div className="history-filter-grid">
            <div className="history-filter-field">
              <label>Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as any })}
              >
                <option value="all">All Priorities</option>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">Stat</option>
              </select>
            </div>

            <div className="history-filter-field">
              <label>Order Status</label>
              <select
                value={filters.orderStatus}
                onChange={(e) => onFiltersChange({ ...filters, orderStatus: e.target.value as any })}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="approved">Approved</option>
                <option value="released">Released</option>
                <option value="corrected">Corrected</option>
                <option value="amended">Amended</option>
              </select>
            </div>

            <div className="history-filter-field">
              <label>Result Status</label>
              <select
                value={filters.resultStatus}
                onChange={(e) => onFiltersChange({ ...filters, resultStatus: e.target.value as any })}
              >
                <option value="all">All Statuses</option>
                <option value="finalized">Finalized</option>
                <option value="approved">Approved</option>
                <option value="released">Released</option>
                <option value="corrected">Corrected</option>
              </select>
            </div>

            <div className="history-filter-field">
              <label className="history-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.showCorrectedOnly}
                  onChange={(e) => onFiltersChange({ ...filters, showCorrectedOnly: e.target.checked })}
                />
                Corrected/Amended Only
              </label>
            </div>

            <div className="history-filter-field">
              <label className="history-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.showReleasedOnly}
                  onChange={(e) => onFiltersChange({ ...filters, showReleasedOnly: e.target.checked })}
                />
                Released Results Only
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// HISTORY RECORDS TABLE
// ============================================================

interface HistoryRecordsTableProps {
  records: HistoricalRecord[];
  onViewDetails: (record: HistoricalRecord) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function HistoryRecordsTable({
  records,
  onViewDetails,
  sortField,
  sortDirection,
  onSort
}: HistoryRecordsTableProps) {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronDown className="sort-icon inactive" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="sort-icon active" />
      : <ChevronDown className="sort-icon active" />;
  };

  return (
    <div className="history-records-table-container">
      <table className="history-records-table">
        <thead>
          <tr>
            <th onClick={() => onSort('orderId')}>
              Order ID {renderSortIcon('orderId')}
            </th>
            <th onClick={() => onSort('patientName')}>
              Patient {renderSortIcon('patientName')}
            </th>
            <th onClick={() => onSort('testName')}>
              Test Type {renderSortIcon('testName')}
            </th>
            <th onClick={() => onSort('specimenCollectedAt')}>
              Collection Date {renderSortIcon('specimenCollectedAt')}
            </th>
            <th onClick={() => onSort('resultReleasedAt')}>
              Release Date {renderSortIcon('resultReleasedAt')}
            </th>
            <th>Status</th>
            <th>Priority</th>
            <th>Corrections</th>
            <th>Performed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.orderId} className="history-record-row">
              <td className="order-id-cell">
                <span className="order-id">{record.orderId}</span>
              </td>
              <td>
                <div className="patient-cell">
                  <span className="patient-name">{record.patientName}</span>
                  <span className="patient-mrn">MRN: {record.patientMRN}</span>
                </div>
              </td>
              <td>
                <div className="test-cell">
                  <span className="test-name">{record.testName}</span>
                  {record.testCode && (
                    <span className="test-code">{record.testCode}</span>
                  )}
                </div>
              </td>
              <td>{formatDateTime(record.specimenCollectedAt)}</td>
              <td>
                {record.resultReleasedAt 
                  ? formatDateTime(record.resultReleasedAt)
                  : <span className="text-muted">Not released</span>
                }
              </td>
              <td>
                <span className={`status-badge status-${record.orderStatus}`}>
                  {getOrderStatusLabel(record.orderStatus)}
                </span>
              </td>
              <td>
                <span className={`priority-badge priority-${record.priority}`}>
                  {getPriorityLabel(record.priority)}
                </span>
              </td>
              <td>
                {record.hasCorrectionHistory ? (
                  <div className="correction-indicator">
                    <AlertCircle className="icon-warning" size={16} />
                    <span className="correction-count">
                      {record.correctionHistory?.length || 0}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
              <td>
                <div className="performer-cell">
                  <span className="performer-name">{record.performedBy}</span>
                  <span className="performer-role">{record.performedByRole}</span>
                </div>
              </td>
              <td>
                <button
                  className="btn-icon"
                  onClick={() => onViewDetails(record)}
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// RECORD DETAIL VIEW
// ============================================================

interface RecordDetailViewProps {
  record: HistoricalRecord;
  onClose: () => void;
  onExport: () => void;
  onPrint: () => void;
  onCompareResults: () => void;
}

export function RecordDetailView({
  record,
  onClose,
  onExport,
  onPrint,
  onCompareResults
}: RecordDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'results' | 'corrections' | 'timeline'>('results');

  return (
    <div className="record-detail-view">
      <div className="detail-header">
        <div className="detail-title-section">
          <h2>Laboratory Record Details</h2>
          <span className="order-id-large">{record.orderId}</span>
        </div>
        <div className="detail-actions">
          <button className="btn-secondary" onClick={onCompareResults}>
            <TrendingUp size={18} />
            Compare Results
          </button>
          <button className="btn-secondary" onClick={onPrint}>
            <Printer size={18} />
            Print
          </button>
          <button className="btn-secondary" onClick={onExport}>
            <Download size={18} />
            Export
          </button>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="detail-content">
        {/* Order Information Section */}
        <section className="detail-section">
          <h3 className="section-title">
            <FileText size={18} />
            Order Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Order ID</label>
              <span>{record.orderId}</span>
            </div>
            <div className="info-item">
              <label>Test Type</label>
              <span>{record.testName} {record.testCode && `(${record.testCode})`}</span>
            </div>
            <div className="info-item">
              <label>Order Status</label>
              <span className={`status-badge status-${record.orderStatus}`}>
                {getOrderStatusLabel(record.orderStatus)}
              </span>
            </div>
            <div className="info-item">
              <label>Result Status</label>
              <span className={`status-badge status-${record.resultStatus}`}>
                {getResultStatusLabel(record.resultStatus)}
              </span>
            </div>
            <div className="info-item">
              <label>Priority</label>
              <span className={`priority-badge priority-${record.priority}`}>
                {getPriorityLabel(record.priority)}
              </span>
            </div>
            <div className="info-item">
              <label>Ordered Date</label>
              <span>{formatDateTime(record.orderedAt)}</span>
            </div>
            <div className="info-item">
              <label>Ordered By</label>
              <span>{record.orderedBy}</span>
            </div>
            <div className="info-item">
              <label>Department</label>
              <span>{record.orderingDepartment}</span>
            </div>
          </div>
        </section>

        {/* Patient Information Section */}
        <section className="detail-section">
          <h3 className="section-title">
            <User size={18} />
            Patient Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Patient Name</label>
              <span>{record.patientName}</span>
            </div>
            <div className="info-item">
              <label>MRN</label>
              <span>{record.patientMRN}</span>
            </div>
            <div className="info-item">
              <label>Age/Gender</label>
              <span>{record.patientAge}y / {record.patientGender}</span>
            </div>
            <div className="info-item">
              <label>Department</label>
              <span>{record.patientDepartment}</span>
            </div>
          </div>
        </section>

        {/* Specimen Information Section */}
        <section className="detail-section">
          <h3 className="section-title">
            <TestTube size={18} />
            Specimen Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Specimen Type</label>
              <span>{record.specimenType}</span>
            </div>
            <div className="info-item">
              <label>Collection Date</label>
              <span>{formatDateTime(record.specimenCollectedAt)}</span>
            </div>
            <div className="info-item">
              <label>Collected By</label>
              <span>{record.specimenCollectedBy}</span>
            </div>
            <div className="info-item">
              <label>Received Date</label>
              <span>{formatDateTime(record.specimenReceivedAt)}</span>
            </div>
            <div className="info-item">
              <label>Specimen Quality</label>
              <span className={`quality-badge quality-${record.specimenQuality}`}>
                {record.specimenQuality}
              </span>
            </div>
            {record.specimenNotes && (
              <div className="info-item span-full">
                <label>Specimen Notes</label>
                <span>{record.specimenNotes}</span>
              </div>
            )}
          </div>
        </section>

        {/* Tabs for Results, Corrections, Timeline */}
        <section className="detail-section">
          <div className="detail-tabs">
            <button
              className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <Activity size={18} />
              Test Results
            </button>
            <button
              className={`tab-button ${activeTab === 'corrections' ? 'active' : ''}`}
              onClick={() => setActiveTab('corrections')}
            >
              <AlertCircle size={18} />
              Corrections ({record.correctionHistory?.length || 0})
            </button>
            <button
              className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <Clock size={18} />
              Timeline
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'results' && (
              <ResultsTabContent record={record} />
            )}
            {activeTab === 'corrections' && (
              <CorrectionHistoryPanel corrections={record.correctionHistory || []} />
            )}
            {activeTab === 'timeline' && (
              <TimelinePanel events={record.timeline} />
            )}
          </div>
        </section>

        {/* Review and Release Information Section */}
        <section className="detail-section">
          <h3 className="section-title">
            <CheckCircle size={18} />
            Review & Release Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Performed By</label>
              <span>{record.performedBy} ({record.performedByRole})</span>
            </div>
            <div className="info-item">
              <label>Performed Date</label>
              <span>{formatDateTime(record.performedAt)}</span>
            </div>
            {record.reviewedBy && (
              <>
                <div className="info-item">
                  <label>Reviewed By</label>
                  <span>{record.reviewedBy}</span>
                </div>
                <div className="info-item">
                  <label>Reviewed Date</label>
                  <span>{record.reviewedAt ? formatDateTime(record.reviewedAt) : 'N/A'}</span>
                </div>
              </>
            )}
            {record.releasedBy && (
              <>
                <div className="info-item">
                  <label>Released By</label>
                  <span>{record.releasedBy}</span>
                </div>
                <div className="info-item">
                  <label>Released Date</label>
                  <span>{record.resultReleasedAt ? formatDateTime(record.resultReleasedAt) : 'N/A'}</span>
                </div>
              </>
            )}
            {record.resultNotes && (
              <div className="info-item span-full">
                <label>Result Notes</label>
                <span>{record.resultNotes}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// RESULTS TAB CONTENT
// ============================================================

interface ResultsTabContentProps {
  record: HistoricalRecord;
}

function ResultsTabContent({ record }: ResultsTabContentProps) {
  return (
    <div className="results-tab-content">
      <table className="results-table">
        <thead>
          <tr>
            <th>Test Parameter</th>
            <th>Result</th>
            <th>Unit</th>
            <th>Reference Range</th>
            <th>Status</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {record.results.map((result, index) => (
            <tr key={index} className={result.isCorrected ? 'corrected-row' : ''}>
              <td>
                <div className="parameter-cell">
                  <span className="parameter-name">{result.parameterName}</span>
                  {result.isCorrected && (
                    <span className="corrected-badge">
                      <AlertCircle size={14} />
                      Corrected
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className={`result-value ${result.isCritical ? 'critical' : result.isAbnormal ? 'abnormal' : ''}`}>
                  {result.value}
                </span>
              </td>
              <td>{result.unit}</td>
              <td>{result.referenceRange}</td>
              <td>
                <span className={`interpretation-badge interpretation-${result.interpretation}`}>
                  {result.interpretation}
                </span>
              </td>
              <td>
                <div className="flags-cell">
                  {result.isCritical && (
                    <span className="flag-badge critical">Critical</span>
                  )}
                  {result.isAbnormal && !result.isCritical && (
                    <span className="flag-badge abnormal">Abnormal</span>
                  )}
                  {!result.isAbnormal && !result.isCritical && (
                    <span className="flag-badge normal">Normal</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// CORRECTION HISTORY PANEL
// ============================================================

interface CorrectionHistoryPanelProps {
  corrections: CorrectionHistory[];
}

export function CorrectionHistoryPanel({ corrections }: CorrectionHistoryPanelProps) {
  if (corrections.length === 0) {
    return (
      <div className="empty-corrections">
        <CheckCircle size={48} className="icon-success" />
        <p>No corrections or amendments for this record</p>
      </div>
    );
  }

  return (
    <div className="correction-history-panel">
      {corrections.map((correction, index) => (
        <div key={index} className="correction-item">
          <div className="correction-header">
            <div className="correction-type">
              <AlertCircle size={18} className="icon-warning" />
              <span className="type-label">{correction.type === 'correction' ? 'Correction' : 'Amendment'}</span>
              <span className="correction-date">{formatDateTime(correction.correctedAt)}</span>
            </div>
            <div className="correction-meta">
              <span className="corrected-by">By: {correction.correctedBy}</span>
            </div>
          </div>

          <div className="correction-content">
            <div className="parameter-name">{correction.parameterName}</div>
            
            <div className="value-comparison">
              <div className="value-box original">
                <label>Original Value</label>
                <span className="value">{correction.originalValue} {correction.unit}</span>
              </div>
              <div className="arrow">→</div>
              <div className="value-box corrected">
                <label>Corrected Value</label>
                <span className="value">{correction.correctedValue} {correction.unit}</span>
              </div>
            </div>

            <div className="correction-reason">
              <label>Reason:</label>
              <p>{correction.reason}</p>
            </div>

            {correction.reviewedBy && (
              <div className="correction-review">
                <CheckCircle size={16} className="icon-success" />
                <span>Reviewed by {correction.reviewedBy} on {formatDateTime(correction.reviewedAt!)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// RESULT COMPARISON PANEL
// ============================================================

interface ResultComparisonPanelProps {
  comparison: ResultComparison;
  onClose: () => void;
}

export function ResultComparisonPanel({ comparison, onClose }: ResultComparisonPanelProps) {
  return (
    <div className="result-comparison-panel">
      <div className="comparison-header">
        <div className="comparison-title">
          <TrendingUp size={20} />
          <h3>Result Trend Analysis</h3>
        </div>
        <button className="btn-icon" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="comparison-info">
        <div className="info-item">
          <label>Patient</label>
          <span>{comparison.patientName} (MRN: {comparison.patientMRN})</span>
        </div>
        <div className="info-item">
          <label>Test Type</label>
          <span>{comparison.testName}</span>
        </div>
        <div className="info-item">
          <label>Current Result</label>
          <span>{comparison.currentOrderId} - {formatDateTime(comparison.currentResultDate)}</span>
        </div>
        <div className="info-item">
          <label>Comparing With</label>
          <span>{comparison.historicalResults.length} previous result(s)</span>
        </div>
      </div>

      <div className="comparison-results">
        {comparison.parameters.map((param, index) => (
          <div key={index} className="parameter-comparison">
            <div className="parameter-header">
              <h4>{param.parameterName}</h4>
              <span className="unit-label">Unit: {param.unit}</span>
            </div>

            <div className="trend-visualization">
              <div className="current-value-box">
                <label>Current Value</label>
                <span className={`value ${param.currentResult.isCritical ? 'critical' : param.currentResult.isAbnormal ? 'abnormal' : ''}`}>
                  {param.currentResult.value}
                </span>
                <span className="date">{formatDate(param.currentResult.date)}</span>
              </div>

              <div className="trend-indicator">
                {param.trend === 'increasing' && (
                  <div className="trend-icon increasing">
                    <TrendingUp size={24} />
                    <span>Increasing</span>
                  </div>
                )}
                {param.trend === 'decreasing' && (
                  <div className="trend-icon decreasing">
                    <TrendingDown size={24} />
                    <span>Decreasing</span>
                  </div>
                )}
                {param.trend === 'stable' && (
                  <div className="trend-icon stable">
                    <Minus size={24} />
                    <span>Stable</span>
                  </div>
                )}
                {param.changePercentage !== undefined && (
                  <span className="change-percentage">
                    {param.changePercentage > 0 ? '+' : ''}{param.changePercentage.toFixed(1)}%
                  </span>
                )}
              </div>

              <div className="historical-values">
                <label>Previous Results</label>
                <div className="values-list">
                  {param.previousResults.map((prev, idx) => (
                    <div key={idx} className="historical-value-item">
                      <span className="value">{prev.value}</span>
                      <span className="date">{formatDate(prev.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="reference-range">
              <label>Reference Range:</label>
              <span>{param.referenceRange}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TIMELINE PANEL
// ============================================================

interface TimelinePanelProps {
  events: TimelineEvent[];
}

export function TimelinePanel({ events }: TimelinePanelProps) {
  const getEventIcon = (type: TimelineEvent['eventType']) => {
    switch (type) {
      case 'order-created': return <FileText size={16} />;
      case 'specimen-collected': return <TestTube size={16} />;
      case 'specimen-received': return <Package size={16} />;
      case 'result-entered': return <Edit size={16} />;
      case 'result-reviewed': return <Eye size={16} />;
      case 'result-approved': return <CheckCircle size={16} />;
      case 'result-released': return <Send size={16} />;
      case 'result-corrected': return <AlertCircle size={16} />;
      case 'result-amended': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getEventClass = (type: TimelineEvent['eventType']) => {
    if (type === 'result-corrected' || type === 'result-amended') return 'warning';
    if (type === 'result-released' || type === 'result-approved') return 'success';
    return 'default';
  };

  return (
    <div className="timeline-panel">
      <div className="timeline-list">
        {events.map((event, index) => (
          <div key={index} className={`timeline-event ${getEventClass(event.eventType)}`}>
            <div className="event-icon">
              {getEventIcon(event.eventType)}
            </div>
            <div className="event-content">
              <div className="event-header">
                <span className="event-title">{event.eventTitle}</span>
                <span className="event-time">{formatDateTime(event.timestamp)}</span>
              </div>
              <div className="event-details">
                <span className="event-actor">{event.performedBy} ({event.performedByRole})</span>
              </div>
              {event.notes && (
                <div className="event-notes">{event.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXPORT CONFIRM DIALOG
// ============================================================

interface ExportConfirmDialogProps {
  recordCount: number;
  format: 'pdf' | 'csv' | 'excel';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExportConfirmDialog({
  recordCount,
  format,
  onConfirm,
  onCancel
}: ExportConfirmDialogProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-dialog export-confirm-dialog">
        <div className="modal-header">
          <h3>
            <Download size={20} />
            Confirm Export
          </h3>
        </div>

        <div className="modal-body">
          <p>You are about to export <strong>{recordCount}</strong> laboratory record(s) in <strong>{format.toUpperCase()}</strong> format.</p>
          
          <div className="export-info">
            <AlertCircle size={18} className="icon-info" />
            <div className="info-text">
              <p>The export will include:</p>
              <ul>
                <li>Patient demographics</li>
                <li>Order and specimen details</li>
                <li>Test results and interpretations</li>
                <li>Correction history (if any)</li>
                <li>Review and release information</li>
              </ul>
            </div>
          </div>

          <div className="privacy-notice">
            <strong>Privacy Notice:</strong> Exported files contain protected health information (PHI). 
            Handle with appropriate security measures and in compliance with facility policies.
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            <Download size={18} />
            Export {recordCount} Record{recordCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LOADING AND EMPTY STATES
// ============================================================

export function HistoryLoadingState() {
  return (
    <div className="history-loading-state">
      <div className="loading-spinner"></div>
      <p>Loading historical records...</p>
    </div>
  );
}

interface HistoryEmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function HistoryEmptyState({ hasFilters, onClearFilters }: HistoryEmptyStateProps) {
  return (
    <div className="history-empty-state">
      <FileText size={64} className="empty-icon" />
      {hasFilters ? (
        <>
          <h3>No records found</h3>
          <p>No laboratory records match your current search filters.</p>
          <button className="btn-primary" onClick={onClearFilters}>
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h3>No historical records</h3>
          <p>There are no completed laboratory records in the system yet.</p>
        </>
      )}
    </div>
  );
}

// ============================================================
// PAGINATION CONTROLS
// ============================================================

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (perPage: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange
}: PaginationControlsProps) {
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        Showing {startRecord}-{endRecord} of {totalRecords} records
      </div>

      <div className="pagination-buttons">
        <button
          className="btn-icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First Page"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>
        
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn-icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>

      <div className="records-per-page">
        <label>Records per page:</label>
        <select
          value={recordsPerPage}
          onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}
