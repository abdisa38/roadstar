/**
 * Pharmacy Dashboard Components
 * ORHIMS Phase 07 - Pharmacy Management (Prompt 36)
 */

import Icon from '../Icon'

import {
  PharmacyContext,
  PharmacyMetrics,
  PrescriptionQueueItem,
  MedicineInventoryItem,
  ExpiryMonitoringItem,
  StockMovement,
  PharmacyAlert,
  getPrescriptionStatusLabel,
  getPriorityLabel,
  getStockStatusLabel,
  getBatchStatusLabel,
  getMovementTypeLabel,
  getAlertSeverityColor,
  formatDateTime,
  formatDate,
  formatTime
} from './pharmacy-model'

// ============================================================
// DASHBOARD HEADER
// ============================================================

interface DashboardHeaderProps {
  context: PharmacyContext
  onRefresh: () => void
}

export function DashboardHeader({ context, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="pharmacy-header">
      <div className="header-top">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <Icon name="chevron-right" size={14} />
          <span>Pharmacy</span>
        </div>
        <div className="header-meta">
          <div className="current-date">
            <Icon name="calendar" size={16} />
            <span>{formatDate(context.currentDate)}</span>
          </div>
          <button className="btn-icon" onClick={onRefresh} title="Refresh Dashboard">
            <Icon name="refresh-cw" size={18} />
          </button>
        </div>
      </div>

      <div className="header-main">
        <div className="header-title-section">
          <h1>Pharmacy Dashboard</h1>
          <p className="header-subtitle">
            Monitor prescriptions, medicine availability, and pharmacy operations.
          </p>
        </div>

        <div className="header-context">
          <div className="context-item">
            <span className="context-label">Location:</span>
            <span className="context-value">{context.pharmacyLocation}</span>
          </div>
          <div className="context-item">
            <span className="context-label">Pharmacist:</span>
            <span className="context-value">
              <Icon name="user" size={14} />
              {context.currentUser.name}
            </span>
          </div>
          {context.lastUpdated && (
            <div className="context-item">
              <span className="context-label">Last updated:</span>
              <span className="context-value text-muted">
                {formatTime(context.lastUpdated)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// METRICS CARDS
// ============================================================

interface MetricsCardsProps {
  metrics: PharmacyMetrics
  onMetricClick: (metricType: string) => void
}

export function MetricsCards({ metrics, onMetricClick }: MetricsCardsProps) {
  return (
    <div className="metrics-cards">
      <button
        className="metric-card metric-pending"
        onClick={() => onMetricClick('pending')}
      >
        <div className="metric-icon">
          <Icon name="file-text" size={20} />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.pendingPrescriptions}</div>
          <div className="metric-label">Pending Prescriptions</div>
          <div className="metric-sublabel">Awaiting dispensing</div>
        </div>
      </button>

      <button
        className="metric-card metric-progress"
        onClick={() => onMetricClick('in-progress')}
      >
        <div className="metric-icon">
          <Icon name="clock" size={20} />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.inProgressPrescriptions}</div>
          <div className="metric-label">In Progress</div>
          <div className="metric-sublabel">Currently processing</div>
        </div>
      </button>

      <button
        className="metric-card metric-dispensed"
        onClick={() => onMetricClick('dispensed')}
      >
        <div className="metric-icon">
          <Icon name="check-circle" size={20} />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.dispensedToday}</div>
          <div className="metric-label">Dispensed Today</div>
          <div className="metric-sublabel">Completed transactions</div>
        </div>
      </button>

      <button
        className="metric-card metric-low-stock"
        onClick={() => onMetricClick('low-stock')}
      >
        <div className="metric-icon">
          <Icon name="trending-down" size={20} />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.lowStockItems}</div>
          <div className="metric-label">Low Stock</div>
          <div className="metric-sublabel">Below reorder threshold</div>
        </div>
      </button>

      <button
        className="metric-card metric-out-stock"
        onClick={() => onMetricClick('out-of-stock')}
      >
        <div className="metric-icon">
          <Icon name="x-circle" size={20} />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.outOfStockItems}</div>
          <div className="metric-label">Out of Stock</div>
          <div className="metric-sublabel">No usable inventory</div>
        </div>
      </button>

      <button
        className="metric-card metric-expiry"
        onClick={() => onMetricClick('expiry')}
      >
        <div className="metric-icon">
          <Icon name="alert-triangle" size={20} />
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.expiryAlerts}</div>
          <div className="metric-label">Expiry Alerts</div>
          <div className="metric-sublabel">Expiring or expired</div>
        </div>
      </button>
    </div>
  )
}

// ============================================================
// SEARCH SECTION
// ============================================================

interface SearchSectionProps {
  searchQuery: string
  onSearch: (query: string) => void
  onNavigate: (destination: string) => void
}

export function SearchSection({ searchQuery, onSearch, onNavigate }: SearchSectionProps) {
  return (
    <div className="search-section">
      <div className="search-input-wrapper">
        <Icon name="search" className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search prescription, patient ID, medicine, or batch number..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="search-actions">
        <button
          className="btn-secondary"
          onClick={() => onNavigate('prescriptions')}
        >
          <Icon name="file-text" size={16} />
          Prescription Queue
        </button>
        <button
          className="btn-secondary"
          onClick={() => onNavigate('inventory')}
        >
          <Icon name="package" size={16} />
          Medicine Inventory
        </button>
      </div>
    </div>
  )
}

// ============================================================
// PRESCRIPTION QUEUE SECTION
// ============================================================

interface PrescriptionQueueSectionProps {
  prescriptions: PrescriptionQueueItem[]
  onPrescriptionClick: (prescription: PrescriptionQueueItem) => void
  onViewAll: () => void
}

export function PrescriptionQueueSection({
  prescriptions,
  onPrescriptionClick,
  onViewAll
}: PrescriptionQueueSectionProps) {
  if (prescriptions.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Prescription Queue</h2>
        </div>
        <div className="empty-state">
          <Icon name="file-text" size={48} className="empty-icon" />
          <p>No prescriptions currently require pharmacy attention.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title-group">
          <h2>Prescription Queue</h2>
          <p className="section-subtitle">
            Review prescriptions that require pharmacy attention.
          </p>
        </div>
        <button className="btn-text" onClick={onViewAll}>
          View All
          <Icon name="chevron-right" size={16} />
        </button>
      </div>

      <div className="table-container">
        <table className="prescription-table">
          <thead>
            <tr>
              <th>Prescription</th>
              <th>Patient</th>
              <th>Patient ID</th>
              <th>Department</th>
              <th>Prescribing Clinician</th>
              <th>Time</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.prescriptionId}>
                <td>
                  <span className="prescription-number">
                    {prescription.prescriptionNumber}
                  </span>
                </td>
                <td>
                  <span className="patient-name">{prescription.patientName}</span>
                </td>
                <td>
                  <span className="patient-id">{prescription.patientMRN}</span>
                </td>
                <td>{prescription.prescribingDepartment}</td>
                <td>{prescription.prescribingClinician}</td>
                <td>
                  <span className="prescription-time">
                    {formatTime(prescription.prescriptionDate)}
                  </span>
                </td>
                <td>
                  <span className={`priority-badge priority-${prescription.priority}`}>
                    {getPriorityLabel(prescription.priority)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${prescription.status}`}>
                    {getPrescriptionStatusLabel(prescription.status)}
                  </span>
                  {prescription.status === 'partially-dispensed' && (
                    <span className="items-count">
                      {prescription.dispensedItemCount}/{prescription.itemCount} items
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => onPrescriptionClick(prescription)}
                    title="Open Prescription"
                  >
                    <Icon name="eye" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// INVENTORY ALERTS SECTION
// ============================================================

interface InventoryAlertsSectionProps {
  items: MedicineInventoryItem[]
  onItemClick: (item: MedicineInventoryItem) => void
  onViewAll: () => void
}

export function InventoryAlertsSection({
  items,
  onItemClick,
  onViewAll
}: InventoryAlertsSectionProps) {
  if (items.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Inventory Requiring Attention</h2>
        </div>
        <div className="empty-state">
          <Icon name="package" size={48} className="empty-icon" />
          <p>No stock alerts match the current view.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title-group">
          <h2>Inventory Requiring Attention</h2>
          <p className="section-subtitle">
            Medicine items that need action.
          </p>
        </div>
        <button className="btn-text" onClick={onViewAll}>
          View Inventory
          <Icon name="chevron-right" size={16} />
        </button>
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Code</th>
              <th>Strength & Form</th>
              <th>Available</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.medicineId} className={`stock-${item.stockStatus}`}>
                <td>
                  <div className="medicine-info">
                    <span className="medicine-name">{item.medicineName}</span>
                    {item.hasExpiredStock && (
                      <span className="expired-indicator" title="Has expired stock">
                        <Icon name="alert-circle" size={14} />
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="medicine-code">{item.medicineCode}</span>
                </td>
                <td>
                  {item.strength && <span className="medicine-strength">{item.strength} </span>}
                  <span className="medicine-form">{item.dosageForm}</span>
                </td>
                <td>
                  <span className={`quantity ${item.availableQuantity === 0 ? 'quantity-zero' : ''}`}>
                    {item.availableQuantity} {item.unitOfMeasure}
                  </span>
                </td>
                <td>
                  <span className="reorder-threshold">
                    {item.reorderThreshold} {item.unitOfMeasure}
                  </span>
                </td>
                <td>
                  <span className={`stock-status-badge status-${item.stockStatus}`}>
                    {getStockStatusLabel(item.stockStatus)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => onItemClick(item)}
                    title="View Inventory"
                  >
                    <Icon name="eye" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// EXPIRY MONITORING SECTION
// ============================================================

interface ExpiryMonitoringSectionProps {
  items: ExpiryMonitoringItem[]
  onItemClick: (item: ExpiryMonitoringItem) => void
  onViewAll: () => void
}

export function ExpiryMonitoringSection({
  items,
  onItemClick,
  onViewAll
}: ExpiryMonitoringSectionProps) {
  if (items.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Expiry Monitoring</h2>
        </div>
        <div className="empty-state-small">
          <Icon name="alert-triangle" size={32} className="empty-icon" />
          <p>No expiry alerts at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title-group">
          <h2>Expiry Monitoring</h2>
        </div>
        <button className="btn-text-small" onClick={onViewAll}>
          View All
          <Icon name="chevron-right" size={14} />
        </button>
      </div>

      <div className="expiry-list">
        {items.map((item) => (
          <div
            key={item.batchId}
            className={`expiry-item expiry-${item.status}`}
            onClick={() => onItemClick(item)}
          >
            <div className="expiry-header">
              <div className="medicine-name">{item.medicineName}</div>
              <span className={`batch-status-badge status-${item.status}`}>
                {getBatchStatusLabel(item.status)}
              </span>
            </div>
            <div className="expiry-details">
              <span className="batch-number">Batch: {item.batchNumber}</span>
              <span className="batch-quantity">
                {item.quantity} {item.unitOfMeasure}
              </span>
            </div>
            <div className="expiry-date-info">
              <span className="expiry-date">Expires: {formatDate(item.expiryDate)}</span>
              {item.daysUntilExpiry >= 0 ? (
                <span className="days-remaining">
                  {item.daysUntilExpiry} day{item.daysUntilExpiry !== 1 ? 's' : ''} remaining
                </span>
              ) : (
                <span className="days-expired">
                  Expired {Math.abs(item.daysUntilExpiry)} day{Math.abs(item.daysUntilExpiry) !== 1 ? 's' : ''} ago
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// STOCK MOVEMENTS SECTION
// ============================================================

interface StockMovementsSectionProps {
  movements: StockMovement[]
  onViewAll: () => void
}

export function StockMovementsSection({ movements, onViewAll }: StockMovementsSectionProps) {
  const getMovementIcon = (type: StockMovement['movementType']) => {
    switch (type) {
      case 'stock-received':
        return 'arrow-down-left'
      case 'dispensed':
        return 'arrow-up-right'
      case 'adjustment':
        return 'activity'
      case 'returned':
        return 'rotate-ccw'
      case 'transferred':
        return 'arrow-right-left'
      default:
        return 'archive'
    }
  }

  if (movements.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Stock Movements</h2>
        </div>
        <div className="empty-state-small">
          <Icon name="archive" size={32} className="empty-icon" />
          <p>No stock movements recorded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title-group">
          <h2>Recent Stock Movements</h2>
        </div>
        <button className="btn-text-small" onClick={onViewAll}>
          View All
          <Icon name="chevron-right" size={14} />
        </button>
      </div>

      <div className="movements-list">
        {movements.map((movement) => (
          <div key={movement.movementId} className={`movement-item movement-${movement.movementType}`}>
            <div className="movement-icon">
              <Icon name={getMovementIcon(movement.movementType)} size={16} />
            </div>
            <div className="movement-content">
              <div className="movement-header">
                <span className="medicine-name">{movement.medicineName}</span>
                <span className="movement-time">{formatTime(movement.movementDate)}</span>
              </div>
              <div className="movement-details">
                <span className="movement-type">{getMovementTypeLabel(movement.movementType)}</span>
                <span className="movement-quantity">
                  {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unitOfMeasure}
                </span>
              </div>
              <div className="movement-meta">
                <span className="performed-by">{movement.performedBy}</span>
                {movement.referenceDocument && (
                  <span className="reference-doc">Ref: {movement.referenceDocument}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// PHARMACY ALERTS SECTION
// ============================================================

interface PharmacyAlertsSectionProps {
  alerts: PharmacyAlert[]
  onAlertClick: (alert: PharmacyAlert) => void
}

export function PharmacyAlertsSection({ alerts, onAlertClick }: PharmacyAlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Pharmacy Alerts</h2>
        </div>
        <div className="empty-state-small">
          <Icon name="check-circle" size={32} className="empty-icon-success" />
          <p>No alerts at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Pharmacy Alerts</h2>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div
            key={alert.alertId}
            className={`alert-item alert-${alert.severity}`}
            onClick={() => onAlertClick(alert)}
            style={{ borderLeftColor: getAlertSeverityColor(alert.severity) }}
          >
            <div className="alert-header">
              <Icon name="alert-circle" size={16} />
              <span className="alert-title">{alert.title}</span>
            </div>
            <p className="alert-description">{alert.description}</p>
            <div className="alert-footer">
              <span className="alert-time">{formatTime(alert.timestamp)}</span>
              <span className="alert-action">{alert.actionRequired}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// LOADING AND ERROR STATES
// ============================================================

export function DashboardLoadingState() {
  return (
    <div className="pharmacy-dashboard loading">
      <div className="pharmacy-header skeleton">
        <div className="skeleton-line" style={{ width: '200px', height: '24px' }}></div>
        <div className="skeleton-line" style={{ width: '400px', height: '16px', marginTop: '8px' }}></div>
      </div>
      <div className="dashboard-content">
        <div className="metrics-cards">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="metric-card skeleton">
              <div className="skeleton-circle" style={{ width: '48px', height: '48px' }}></div>
              <div className="skeleton-line" style={{ width: '60px', height: '32px', marginTop: '12px' }}></div>
              <div className="skeleton-line" style={{ width: '120px', height: '14px', marginTop: '8px' }}></div>
            </div>
          ))}
        </div>
        <div className="loading-message">
          <Icon name="refresh-cw" className="spinning" size={24} />
          <p>Loading pharmacy data...</p>
        </div>
      </div>
    </div>
  )
}

interface DashboardErrorStateProps {
  error: string
  onRetry: () => void
}

export function DashboardErrorState({ error, onRetry }: DashboardErrorStateProps) {
  return (
    <div className="pharmacy-dashboard error">
      <div className="error-state">
        <Icon name="x-circle" size={64} className="error-icon" />
        <h2>Unable to Load Pharmacy Data</h2>
        <p className="error-message">{error}</p>
        <button className="btn-primary" onClick={onRetry}>
          <Icon name="refresh-cw" size={18} />
          Try Again
        </button>
      </div>
    </div>
  )
}
