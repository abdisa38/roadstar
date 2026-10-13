import React from 'react';
import {
  WorkloadSummary,
  AttentionItem,
  DashboardOrder,
  DashboardFilters,
  DashboardState,
  formatAttentionType,
  formatAttentionPriority,
  getNextActionLabel
} from './dashboard-model';
import { formatRequestStatus, formatRequestPriority } from './model';
import { formatSpecimenStatus } from './specimen-model';

// Dashboard Header Component
interface DashboardHeaderProps {
  onViewAllOrders: () => void;
}

export function DashboardHeader({ onViewAllOrders }: DashboardHeaderProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <div>
          <div className="dashboard-breadcrumb">
            <span>Staff Portal</span>
            <svg className="dashboard-breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Laboratory</span>
            <svg className="dashboard-breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="dashboard-breadcrumb-current">Dashboard</span>
          </div>
          <h1 className="dashboard-title">Laboratory Dashboard</h1>
          <p className="dashboard-subtitle">Manage test orders, specimens, processing, and results</p>
        </div>
        <div className="dashboard-header-meta">
          <span className="dashboard-date">{formattedDate}</span>
          <button
            type="button"
            className="dashboard-primary-button"
            onClick={onViewAllOrders}
          >
            View Pending Orders
            <svg className="dashboard-button-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Workload Summary Cards Component
interface WorkloadSummaryCardsProps {
  summary: WorkloadSummary;
  onCardClick: (card: string) => void;
}

export function WorkloadSummaryCards({ summary, onCardClick }: WorkloadSummaryCardsProps) {
  return (
    <div className="dashboard-workload-summary">
      <button
        type="button"
        className="dashboard-workload-card dashboard-card-new"
        onClick={() => onCardClick('newOrders')}
      >
        <div className="dashboard-card-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="dashboard-card-content">
          <span className="dashboard-card-label">New Orders</span>
          <span className="dashboard-card-value">{summary.newOrders}</span>
        </div>
      </button>

      <button
        type="button"
        className="dashboard-workload-card dashboard-card-specimen"
        onClick={() => onCardClick('awaitingSpecimen')}
      >
        <div className="dashboard-card-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
        </div>
        <div className="dashboard-card-content">
          <span className="dashboard-card-label">Awaiting Specimen</span>
          <span className="dashboard-card-value">{summary.awaitingSpecimen}</span>
        </div>
      </button>

      <button
        type="button"
        className="dashboard-workload-card dashboard-card-progress"
        onClick={() => onCardClick('inProgress')}
      >
        <div className="dashboard-card-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="dashboard-card-content">
          <span className="dashboard-card-label">In Progress</span>
          <span className="dashboard-card-value">{summary.inProgress}</span>
        </div>
      </button>

      <div className="dashboard-workload-card dashboard-card-results">
        <div className="dashboard-card-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="dashboard-card-content">
          <span className="dashboard-card-label">Pending Results</span>
          <span className="dashboard-card-value">{summary.pendingResults}</span>
        </div>
      </div>

      <button
        type="button"
        className="dashboard-workload-card dashboard-card-review"
        onClick={() => onCardClick('awaitingReview')}
      >
        <div className="dashboard-card-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="dashboard-card-content">
          <span className="dashboard-card-label">Awaiting Review</span>
          <span className="dashboard-card-value">{summary.awaitingReview}</span>
        </div>
      </button>

      <div className="dashboard-workload-card dashboard-card-completed">
        <div className="dashboard-card-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="dashboard-card-content">
          <span className="dashboard-card-label">Completed Today</span>
          <span className="dashboard-card-value">{summary.completedToday}</span>
        </div>
      </div>
    </div>
  );
}

// Attention Section Component
interface AttentionSectionProps {
  items: AttentionItem[];
  onActionClick: (itemId: string) => void;
}

export function AttentionSection({ items, onActionClick }: AttentionSectionProps) {
  return (
    <div className="dashboard-attention-section">
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">
          <svg className="dashboard-attention-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Laboratory Attention Required
        </h2>
        <span className="dashboard-attention-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="dashboard-attention-list">
        {items.map(item => (
          <div
            key={item.id}
            className={`dashboard-attention-item dashboard-attention-${item.priority}`}
          >
            <div className="dashboard-attention-item-content">
              <div className="dashboard-attention-item-header">
                <span className={`dashboard-attention-badge dashboard-badge-${item.priority}`}>
                  {formatAttentionPriority(item.priority)}
                </span>
                <span className="dashboard-attention-type">{formatAttentionType(item.type)}</span>
                <span className="dashboard-attention-time">
                  {item.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="dashboard-attention-details">
                <div className="dashboard-attention-patient">
                  <strong>{item.patientName}</strong> ({item.patientId})
                </div>
                <div className="dashboard-attention-test">
                  {item.testName} · {item.orderId}
                </div>
                <div className="dashboard-attention-message">{item.message}</div>
              </div>
            </div>
            <button
              type="button"
              className="dashboard-attention-action"
              onClick={() => onActionClick(item.id)}
            >
              {item.action}
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dashboard Filters Toolbar Component
interface DashboardFiltersToolbarProps {
  filters: DashboardFilters;
  onFilterChange: (updates: Partial<DashboardFilters>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export function DashboardFiltersToolbar({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount
}: DashboardFiltersToolbarProps) {
  const hasActiveFilters = 
    filters.searchQuery.length >= 2 ||
    !!filters.testTypeFilter ||
    !!filters.orderStatusFilter ||
    !!filters.specimenStatusFilter ||
    !!filters.priorityFilter;

  return (
    <div className="dashboard-filters-toolbar">
      <div className="dashboard-filters-row">
        {/* Search */}
        <div className="dashboard-filter-field dashboard-filter-search">
          <input
            type="text"
            className="dashboard-search-input"
            placeholder="Search patient name, ID, order ID, test..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
          <svg className="dashboard-search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Test Type Filter */}
        <div className="dashboard-filter-field">
          <select
            className="dashboard-filter-select"
            value={filters.testTypeFilter || ''}
            onChange={(e) => onFilterChange({ testTypeFilter: e.target.value || undefined })}
          >
            <option value="">All Test Types</option>
            <option value="Hematology">Hematology</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Serology">Serology</option>
            <option value="Parasitology">Parasitology</option>
            <option value="Urinalysis">Urinalysis</option>
          </select>
        </div>

        {/* Order Status Filter */}
        <div className="dashboard-filter-field">
          <select
            className="dashboard-filter-select"
            value={filters.orderStatusFilter || ''}
            onChange={(e) => onFilterChange({ orderStatusFilter: e.target.value as any || undefined })}
          >
            <option value="">All Order Statuses</option>
            <option value="requested">Ordered</option>
            <option value="specimen-collection-pending">Awaiting Specimen</option>
            <option value="specimen-collected">Specimen Received</option>
            <option value="in-progress">Processing</option>
            <option value="result-available">Result Available</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="dashboard-filter-field">
          <select
            className="dashboard-filter-select"
            value={filters.priorityFilter || ''}
            onChange={(e) => onFilterChange({ priorityFilter: e.target.value as any || undefined })}
          >
            <option value="">All Priorities</option>
            <option value="STAT">STAT</option>
            <option value="urgent">Urgent</option>
            <option value="routine">Routine</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="dashboard-filter-field">
          <select
            className="dashboard-filter-select"
            value={filters.dateRangeFilter}
            onChange={(e) => onFilterChange({ dateRangeFilter: e.target.value as any })}
          >
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="dashboard-filters-summary">
        <span className="dashboard-results-count">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="dashboard-clear-filters"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

// Dashboard Orders Table Component
interface DashboardOrdersTableProps {
  orders: DashboardOrder[];
  sortBy: DashboardState['sortBy'];
  sortDirection: DashboardState['sortDirection'];
  onSortChange: (sortBy: DashboardState['sortBy']) => void;
  onOrderAction: (orderId: string, action: string) => void;
}

export function DashboardOrdersTable({
  orders,
  sortBy,
  sortDirection,
  onSortChange,
  onOrderAction
}: DashboardOrdersTableProps) {
  const SortButton = ({ column, label }: { column: DashboardState['sortBy']; label: string }) => (
    <button
      type="button"
      className="dashboard-table-sort"
      onClick={() => onSortChange(column)}
    >
      {label}
      {sortBy === column && (
        <svg className={`dashboard-sort-icon ${sortDirection === 'asc' ? 'dashboard-sort-asc' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="dashboard-table-container">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th><SortButton column="order-time" label="Order ID / Time" /></th>
            <th><SortButton column="patient-name" label="Patient" /></th>
            <th>Test / Category</th>
            <th>Ordering Department</th>
            <th>Specimen Status</th>
            <th><SortButton column="status" label="Processing Status" /></th>
            <th><SortButton column="priority" label="Priority" /></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId} className="dashboard-table-row">
              <td className="dashboard-cell-order">
                <div className="dashboard-order-id">{order.orderId}</div>
                <div className="dashboard-order-time">
                  {order.orderTime.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </td>
              <td className="dashboard-cell-patient">
                <div className="dashboard-patient-name">{order.patientName}</div>
                <div className="dashboard-patient-id">{order.patientId}</div>
                <div className="dashboard-encounter-id">{order.encounterId}</div>
              </td>
              <td className="dashboard-cell-test">
                <div className="dashboard-test-name">{order.testName}</div>
                <div className="dashboard-test-category">{order.testCategory}</div>
              </td>
              <td className="dashboard-cell-department">
                <div className="dashboard-department">{order.orderingDepartment}</div>
                <div className="dashboard-clinician">{order.orderingClinician}</div>
              </td>
              <td className="dashboard-cell-specimen">
                <span className={`dashboard-specimen-badge dashboard-specimen-${order.specimenStatus}`}>
                  {formatSpecimenStatus(order.specimenStatus === 'not-collected' ? 'awaiting-collection' : order.specimenStatus)}
                </span>
                {order.specimenIdentifier && (
                  <div className="dashboard-specimen-id">{order.specimenIdentifier}</div>
                )}
              </td>
              <td className="dashboard-cell-processing">
                <span className={`dashboard-processing-badge dashboard-processing-${order.processingStatus}`}>
                  {formatRequestStatus(order.processingStatus)}
                </span>
              </td>
              <td className="dashboard-cell-priority">
                <span className={`dashboard-priority-badge dashboard-priority-${order.priority}`}>
                  {formatRequestPriority(order.priority)}
                </span>
              </td>
              <td className="dashboard-cell-actions">
                <button
                  type="button"
                  className="dashboard-action-button"
                  onClick={() => onOrderAction(order.orderId, order.nextAction)}
                >
                  {order.nextAction}
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Empty State Component
interface DashboardEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function DashboardEmptyState({ hasActiveFilters, onClearFilters }: DashboardEmptyStateProps) {
  return (
    <div className="dashboard-empty-state">
      <svg className="dashboard-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="dashboard-empty-title">
        {hasActiveFilters ? 'No orders match your filters' : 'No laboratory orders'}
      </h3>
      <p className="dashboard-empty-description">
        {hasActiveFilters
          ? 'Try adjusting or clearing your filters to see more orders.'
          : 'Laboratory orders will appear here once they are created.'}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          className="dashboard-button-primary"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

// Loading State Component
export function DashboardLoadingState() {
  return (
    <div className="dashboard-loading-state">
      <div className="dashboard-loading-spinner">
        <svg className="dashboard-spinner-icon" viewBox="0 0 24 24">
          <circle className="dashboard-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
      <p className="dashboard-loading-text">Loading laboratory dashboard...</p>
    </div>
  );
}
