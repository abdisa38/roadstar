/**
 * Prescription Dispensing Components
 * ORHIMS Phase 07 - Pharmacy Management (Prompt 37)
 */

import { useState } from 'react'
import Icon from '../Icon'

import {
  PrescriptionContext,
  PrescriptionQueueItem,
  PrescriptionDetail,
  PrescribedMedicineItem,
  QueueFilters,
  BatchInfo,
  getPrescriptionStatusLabel,
  getPriorityLabel,
  getAvailabilityStatusLabel,
  getBatchStatusLabel,
  getHoldReasonLabel,
  formatDateTime,
  formatDate,
  formatTime,
  validateDispensingQuantity
} from './prescription-model'

// ============================================================
// DISPENSING PAGE HEADER
// ============================================================

interface DispensingPageHeaderProps {
  context: PrescriptionContext
  onRefresh: () => void
  onNavigateBack: () => void
}

export function DispensingPageHeader({ context, onRefresh, onNavigateBack }: DispensingPageHeaderProps) {
  return (
    <div className="dispensing-header">
      <div className="header-top">
        <div className="breadcrumb">
          <button className="breadcrumb-link" onClick={onNavigateBack}>
            Dashboard
          </button>
          <Icon name="chevron-right" size={14} />
          <button className="breadcrumb-link" onClick={onNavigateBack}>
            Pharmacy
          </button>
          <Icon name="chevron-right" size={14} />
          <span>Prescription Queue</span>
        </div>
        <div className="header-meta">
          <div className="current-date">
            <Icon name="calendar" size={16} />
            <span>{formatDate(context.currentDate)}</span>
          </div>
          <button className="btn-icon" onClick={onRefresh} title="Refresh Queue">
            <Icon name="refresh-cw" size={18} />
          </button>
        </div>
      </div>

      <div className="header-main">
        <div className="header-title-section">
          <h1>Prescription Queue & Dispensing</h1>
          <p className="header-subtitle">
            Review prescriptions, verify medicine availability, and record authorized dispensing transactions.
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
// PRESCRIPTION QUEUE SECTION
// ============================================================

interface PrescriptionQueueSectionProps {
  prescriptions: PrescriptionQueueItem[]
  filters: Partial<QueueFilters>
  onFilterChange: (filters: Partial<QueueFilters>) => void
  onOpenPrescription: (prescription: PrescriptionQueueItem) => void
  currentPage: number
  totalPages: number
  totalRecords: number
  recordsPerPage: number
  onPageChange: (page: number) => void
}

export function PrescriptionQueueSection({
  prescriptions,
  filters,
  onFilterChange,
  onOpenPrescription,
  currentPage,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange
}: PrescriptionQueueSectionProps) {
  return (
    <div className="queue-section">
      <QueueFilters
        filters={filters}
        onFilterChange={onFilterChange}
      />

      {prescriptions.length === 0 ? (
        <div className="queue-empty-state">
          <Icon name="file-text" size={64} className="empty-icon" />
          <h3>No prescriptions match the selected filters</h3>
          <p>Try adjusting your search criteria or filters.</p>
          <button className="btn-secondary" onClick={() => onFilterChange({ searchQuery: '', status: 'all', priority: 'all', requiresAttention: false })}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="queue-table-container">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Prescription</th>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th>Department</th>
                  <th>Items</th>
                  <th>Date & Time</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.prescriptionId} className={`queue-row priority-${prescription.priority}`}>
                    <td>
                      <span className="prescription-number">
                        {prescription.prescriptionNumber}
                      </span>
                    </td>
                    <td>
                      <div className="patient-cell">
                        <span className="patient-name">{prescription.patientName}</span>
                        <span className="patient-info">{prescription.patientAge}y, {prescription.patientGender}</span>
                      </div>
                    </td>
                    <td>
                      <span className="patient-id">{prescription.patientMRN}</span>
                    </td>
                    <td>{prescription.prescribingDepartment}</td>
                    <td>
                      <div className="items-cell">
                        <span className="item-count">{prescription.itemCount} item{prescription.itemCount !== 1 ? 's' : ''}</span>
                        {prescription.dispensedItemCount > 0 && (
                          <span className="dispensed-count">
                            {prescription.dispensedItemCount} dispensed
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="datetime-cell">
                        <span className="date-value">{formatDate(prescription.prescriptionDate)}</span>
                        <span className="time-value">{formatTime(prescription.prescriptionDate)}</span>
                      </div>
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
                    </td>
                    <td>
                      {prescription.assignedTo ? (
                        <span className="assigned-to">{prescription.assignedTo}</span>
                      ) : (
                        <span className="unassigned">—</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-primary-small"
                        onClick={() => onOpenPrescription(prescription)}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <QueuePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            recordsPerPage={recordsPerPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  )
}

// ============================================================
// QUEUE FILTERS
// ============================================================

interface QueueFiltersProps {
  filters: Partial<QueueFilters>
  onFilterChange: (filters: Partial<QueueFilters>) => void
}

function QueueFilters({ filters, onFilterChange }: QueueFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ searchQuery: localSearch })
  }

  return (
    <div className="queue-filters">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <Icon name="search" className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search prescription number, patient name, or patient ID..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            className="filter-select"
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="partially-dispensed">Partially Dispensed</option>
            <option value="on-hold">On Hold</option>
            <option value="dispensed">Dispensed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            className="filter-select"
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ priority: e.target.value as any })}
          >
            <option value="all">All Priorities</option>
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
            <option value="stat">STAT</option>
          </select>
        </div>

        <div className="filter-group-checkbox">
          <label>
            <input
              type="checkbox"
              checked={filters.requiresAttention || false}
              onChange={(e) => onFilterChange({ requiresAttention: e.target.checked })}
            />
            <span>Requires Attention Only</span>
          </label>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// QUEUE PAGINATION
// ============================================================

interface QueuePaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  recordsPerPage: number
  onPageChange: (page: number) => void
}

function QueuePagination({
  currentPage,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange
}: QueuePaginationProps) {
  const startRecord = (currentPage - 1) * recordsPerPage + 1
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords)

  return (
    <div className="queue-pagination">
      <div className="pagination-info">
        Showing {startRecord}-{endRecord} of {totalRecords} prescriptions
      </div>

      <div className="pagination-controls">
        <button
          className="btn-icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First Page"
        >
          <Icon name="chevrons-left" size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          <Icon name="chevron-left" size={18} />
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
          <Icon name="chevron-right" size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
        >
          <Icon name="chevrons-right" size={18} />
        </button>
      </div>
    </div>
  )
}

// ============================================================
// PRESCRIPTION DETAIL WORKSPACE
// ============================================================

interface PrescriptionDetailWorkspaceProps {
  prescription: PrescriptionDetail
  onClose: () => void
  onReviewDispensing: () => void
  onPlaceOnHold: () => void
}

export function PrescriptionDetailWorkspace({
  prescription,
  onClose,
  onReviewDispensing,
  onPlaceOnHold
}: PrescriptionDetailWorkspaceProps) {
  const [items, setItems] = useState<PrescribedMedicineItem[]>(prescription.items)

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItems(items.map(item =>
      item.itemId === itemId
        ? { ...item, currentDispensingQuantity: quantity }
        : item
    ))
  }

  const handleBatchSelect = (itemId: string, batchId: string) => {
    setItems(items.map(item => {
      if (item.itemId === itemId && item.matchedInventory) {
        const selectedBatch = item.matchedInventory.eligibleBatches.find(b => b.batchId === batchId)
        if (selectedBatch) {
          return {
            ...item,
            selectedBatch: {
              batchId: selectedBatch.batchId,
              batchNumber: selectedBatch.batchNumber,
              quantityFromBatch: item.currentDispensingQuantity,
              expiryDate: selectedBatch.expiryDate
            }
          }
        }
      }
      return item
    }))
  }

  const canReviewDispensing = items.some(item => item.currentDispensingQuantity > 0)

  return (
    <div className="prescription-workspace">
      <div className="workspace-header">
        <button className="btn-back" onClick={onClose}>
          <Icon name="arrow-left" size={18} />
          Back to Queue
        </button>

        <div className="workspace-actions">
          <button className="btn-secondary" onClick={onPlaceOnHold}>
            <Icon name="pause-circle" size={18} />
            Place on Hold
          </button>
          <button
            className="btn-primary"
            onClick={onReviewDispensing}
            disabled={!canReviewDispensing}
          >
            <Icon name="check-circle" size={18} />
            Review Dispensing
          </button>
        </div>
      </div>

      <PrescriptionInfo prescription={prescription} />

      <PatientInfo patient={prescription.patient} />

      <PrescribedMedicinesTable
        items={items}
        onQuantityChange={handleQuantityChange}
        onBatchSelect={handleBatchSelect}
      />

      {prescription.dispensingHistory.length > 0 && (
        <DispensingHistory history={prescription.dispensingHistory} />
      )}
    </div>
  )
}

// ============================================================
// PRESCRIPTION INFO
// ============================================================

interface PrescriptionInfoProps {
  prescription: PrescriptionDetail
}

function PrescriptionInfo({ prescription }: PrescriptionInfoProps) {
  return (
    <div className="prescription-info-card">
      <div className="card-header">
        <h2>Prescription Information</h2>
        <span className={`status-badge status-${prescription.status}`}>
          {getPrescriptionStatusLabel(prescription.status)}
        </span>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>Prescription Number</label>
          <span className="prescription-number">{prescription.prescriptionNumber}</span>
        </div>

        <div className="info-item">
          <label>Prescription Date</label>
          <span>{formatDateTime(prescription.prescriptionDate)}</span>
        </div>

        <div className="info-item">
          <label>Priority</label>
          <span className={`priority-badge priority-${prescription.priority}`}>
            {getPriorityLabel(prescription.priority)}
          </span>
        </div>

        <div className="info-item">
          <label>Clinical Authorization</label>
          <span className={`authorization-badge authorization-${prescription.clinicalAuthorizationStatus}`}>
            {prescription.clinicalAuthorizationStatus}
          </span>
        </div>

        <div className="info-item">
          <label>Prescribing Clinician</label>
          <span>{prescription.prescriber.name}</span>
          <span className="info-subtitle">{prescription.prescriber.title}</span>
        </div>

        <div className="info-item">
          <label>Department</label>
          <span>{prescription.prescriber.department}</span>
        </div>

        {prescription.notes && (
          <div className="info-item span-full">
            <label>Prescription Notes</label>
            <div className="notes-box">
              <Icon name="alert-circle" size={16} />
              <span>{prescription.notes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// PATIENT INFO
// ============================================================

interface PatientInfoProps {
  patient: PrescriptionDetail['patient']
}

function PatientInfo({ patient }: PatientInfoProps) {
  return (
    <div className="patient-info-card">
      <div className="card-header">
        <h2>Patient Information</h2>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>Patient Name</label>
          <span className="patient-name">{patient.name}</span>
        </div>

        <div className="info-item">
          <label>MRN</label>
          <span>{patient.patientMRN}</span>
        </div>

        <div className="info-item">
          <label>Age / Gender</label>
          <span>{patient.age} years / {patient.gender}</span>
        </div>

        <div className="info-item">
          <label>Department</label>
          <span>{patient.department}</span>
        </div>

        {patient.ward && (
          <div className="info-item">
            <label>Ward / Bed</label>
            <span>{patient.ward} / {patient.bedNumber}</span>
          </div>
        )}

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="info-item span-full">
            <label>Known Allergies</label>
            <div className="allergies-box">
              <Icon name="alert-triangle" size={16} />
              <span>{patient.allergies.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// PRESCRIBED MEDICINES TABLE
// ============================================================

interface PrescribedMedicinesTableProps {
  items: PrescribedMedicineItem[]
  onQuantityChange: (itemId: string, quantity: number) => void
  onBatchSelect: (itemId: string, batchId: string) => void
}

function PrescribedMedicinesTable({
  items,
  onQuantityChange,
  onBatchSelect
}: PrescribedMedicinesTableProps) {
  return (
    <div className="prescribed-medicines-section">
      <div className="section-header">
        <h2>Prescribed Medicines</h2>
      </div>

      <div className="medicines-list">
        {items.map((item) => (
          <MedicineItemCard
            key={item.itemId}
            item={item}
            onQuantityChange={onQuantityChange}
            onBatchSelect={onBatchSelect}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// MEDICINE ITEM CARD
// ============================================================

interface MedicineItemCardProps {
  item: PrescribedMedicineItem
  onQuantityChange: (itemId: string, quantity: number) => void
  onBatchSelect: (itemId: string, batchId: string) => void
}

function MedicineItemCard({ item, onQuantityChange, onBatchSelect }: MedicineItemCardProps) {
  const [quantity, setQuantity] = useState(item.currentDispensingQuantity)
  const [errors, setErrors] = useState<any[]>([])

  const handleQuantityBlur = () => {
    const validationErrors = validateDispensingQuantity(
      quantity,
      item.quantityRemaining,
      item.matchedInventory?.totalAvailableQuantity || 0
    )
    setErrors(validationErrors)
    if (validationErrors.length === 0) {
      onQuantityChange(item.itemId, quantity)
    }
  }

  return (
    <div className="medicine-item-card">
      <div className="medicine-header">
        <div className="medicine-name-section">
          <h3>{item.medicineName}</h3>
          {item.strength && <span className="medicine-strength">{item.strength}</span>}
          <span className="medicine-form">{item.dosageForm}</span>
        </div>
        <span className={`availability-badge availability-${item.availabilityStatus}`}>
          {getAvailabilityStatusLabel(item.availabilityStatus)}
        </span>
      </div>

      <div className="prescription-instructions">
        <div className="instruction-row">
          <span className="instruction-label">Route:</span>
          <span className="instruction-value">{item.route}</span>
        </div>
        <div className="instruction-row">
          <span className="instruction-label">Frequency:</span>
          <span className="instruction-value">{item.frequency}</span>
        </div>
        <div className="instruction-row">
          <span className="instruction-label">Duration:</span>
          <span className="instruction-value">{item.duration}</span>
        </div>
        <div className="instruction-row">
          <span className="instruction-label">Instructions:</span>
          <span className="instruction-value">{item.instructions}</span>
        </div>
      </div>

      <div className="quantity-section">
        <div className="quantity-info">
          <div className="quantity-item">
            <label>Prescribed</label>
            <span className="quantity-value">{item.quantityPrescribed} {item.unitOfMeasure}</span>
          </div>
          <div className="quantity-item">
            <label>Previously Dispensed</label>
            <span className="quantity-value">{item.quantityPreviouslyDispensed} {item.unitOfMeasure}</span>
          </div>
          <div className="quantity-item">
            <label>Remaining</label>
            <span className="quantity-value remaining">{item.quantityRemaining} {item.unitOfMeasure}</span>
          </div>
        </div>

        <div className="dispensing-input-section">
          <div className="input-group">
            <label htmlFor={`quantity-${item.itemId}`}>Dispensing Quantity</label>
            <div className="quantity-input-wrapper">
              <input
                id={`quantity-${item.itemId}`}
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                onBlur={handleQuantityBlur}
                min="0"
                max={item.quantityRemaining}
                disabled={item.availabilityStatus === 'unavailable'}
              />
              <span className="input-unit">{item.unitOfMeasure}</span>
            </div>
            {errors.map((error, idx) => (
              <div key={idx} className="input-error">
                <Icon name="alert-circle" size={14} />
                {error.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {item.matchedInventory && item.matchedInventory.eligibleBatches.length > 0 && (
        <BatchSelectionSection
          batches={item.matchedInventory.eligibleBatches}
          selectedBatchId={item.selectedBatch?.batchId}
          onBatchSelect={(batchId) => onBatchSelect(item.itemId, batchId)}
          availableQuantity={item.matchedInventory.totalAvailableQuantity}
          unitOfMeasure={item.unitOfMeasure}
        />
      )}
    </div>
  )
}

// ============================================================
// BATCH SELECTION SECTION
// ============================================================

interface BatchSelectionSectionProps {
  batches: BatchInfo[]
  selectedBatchId?: string
  onBatchSelect: (batchId: string) => void
  availableQuantity: number
  unitOfMeasure: string
}

function BatchSelectionSection({
  batches,
  selectedBatchId,
  onBatchSelect,
  availableQuantity,
  unitOfMeasure
}: BatchSelectionSectionProps) {
  return (
    <div className="batch-selection-section">
      <h4>Available Batches ({availableQuantity} {unitOfMeasure} total)</h4>

      <div className="batches-list">
        {batches.map((batch) => (
          <div
            key={batch.batchId}
            className={`batch-card ${selectedBatchId === batch.batchId ? 'selected' : ''} ${batch.status !== 'eligible' ? 'ineligible' : ''}`}
            onClick={() => batch.status === 'eligible' && onBatchSelect(batch.batchId)}
          >
            <div className="batch-header">
              <div className="batch-info">
                <span className="batch-number">{batch.batchNumber}</span>
                <span className={`batch-status-badge status-${batch.status}`}>
                  {getBatchStatusLabel(batch.status)}
                </span>
              </div>
              {selectedBatchId === batch.batchId && (
                <Icon name="check-circle" size={20} className="selected-icon" />
              )}
            </div>

            <div className="batch-details">
              <div className="batch-detail-item">
                <label>Available:</label>
                <span>{batch.availableQuantity} {unitOfMeasure}</span>
              </div>
              <div className="batch-detail-item">
                <label>Expiry:</label>
                <span>{formatDate(batch.expiryDate)}</span>
              </div>
              <div className="batch-detail-item">
                <label>Days Until Expiry:</label>
                <span className={batch.daysUntilExpiry < 60 ? 'expiring-soon' : ''}>
                  {batch.daysUntilExpiry} days
                </span>
              </div>
            </div>

            {batch.status !== 'eligible' && (
              <div className="batch-warning">
                <Icon name="alert-triangle" size={14} />
                <span>Not eligible for dispensing</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// DISPENSING HISTORY
// ============================================================

interface DispensingHistoryProps {
  history: PrescriptionDetail['dispensingHistory']
}

function DispensingHistory({ history }: DispensingHistoryProps) {
  return (
    <div className="dispensing-history-section">
      <div className="section-header">
        <h2>Dispensing History</h2>
      </div>

      <div className="history-list">
        {history.map((transaction) => (
          <div key={transaction.transactionId} className="history-item">
            <div className="history-header">
              <span className="transaction-ref">{transaction.transactionReference}</span>
              <span className="transaction-date">{formatDateTime(transaction.transactionDate)}</span>
            </div>
            <div className="history-details">
              <span>Performed by: {transaction.performedBy} ({transaction.performedByRole})</span>
              <span className={`transaction-status status-${transaction.status}`}>
                {transaction.status}
              </span>
            </div>
            <div className="history-items">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="history-item-detail">
                  {item.medicineName} {item.strength} - {item.quantityDispensed} {item.unitOfMeasure}
                  {' '}(Batch: {item.batchNumber})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Confirm Dispensing Dialog
// ============================================================================

interface ConfirmDispensingDialogProps {
  prescription: PrescriptionDetailData;
  quantities: Record<string, number>;
  selectedBatches: Record<string, string>;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDispensingDialog({
  prescription,
  quantities,
  selectedBatches,
  onConfirm,
  onCancel
}: ConfirmDispensingDialogProps) {
  // Calculate items being dispensed
  const itemsToDispense = prescription.medicines.filter(
    (med) => quantities[med.id] > 0
  );

  const isPartialDispensing = itemsToDispense.some(
    (med) => quantities[med.id] < med.quantityPrescribed
  );

  const hasWarnings = itemsToDispense.some((med) => {
    const batch = med.availableBatches.find(
      (b) => b.batchNumber === selectedBatches[med.id]
    );
    if (!batch) return false;
    const daysToExpiry = Math.floor(
      (new Date(batch.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiry <= 90;
  });

  return (
    <div className="confirm-dispensing-dialog-overlay">
      <div className="confirm-dispensing-dialog">
        <div className="confirm-dialog-header">
          <h2>Confirm Dispensing</h2>
          <button
            className="dialog-close-button"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <Icon name="x" />
          </button>
        </div>

        <div className="confirm-dialog-content">
          {/* Summary Info */}
          <div className="confirm-summary">
            <div className="confirm-summary-row">
              <span className="confirm-label">Patient:</span>
              <span className="confirm-value">
                {prescription.patient.name} ({prescription.patient.mrn})
              </span>
            </div>
            <div className="confirm-summary-row">
              <span className="confirm-label">Prescription ID:</span>
              <span className="confirm-value">
                {prescription.prescriptionId}
              </span>
            </div>
            <div className="confirm-summary-row">
              <span className="confirm-label">Items to Dispense:</span>
              <span className="confirm-value">
                {itemsToDispense.length} of {prescription.medicines.length}
              </span>
            </div>
          </div>

          {/* Partial Dispensing Warning */}
          {isPartialDispensing && (
            <div className="confirm-warning-box">
              <Icon name="alert-triangle" />
              <div>
                <strong>Partial Dispensing</strong>
                <p>
                  Some medicines will be dispensed in quantities less than
                  prescribed. Remaining quantities will stay in queue.
                </p>
              </div>
            </div>
          )}

          {/* Expiry Warning */}
          {hasWarnings && (
            <div className="confirm-warning-box">
              <Icon name="clock" />
              <div>
                <strong>Short Expiry Notice</strong>
                <p>
                  One or more batches will expire within 90 days. Patient should
                  be advised.
                </p>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="confirm-items-list">
            <h3>Dispensing Details</h3>
            {itemsToDispense.map((med) => {
              const batch = med.availableBatches.find(
                (b) => b.batchNumber === selectedBatches[med.id]
              );
              return (
                <div key={med.id} className="confirm-item">
                  <div className="confirm-item-header">
                    <strong>{med.medicineName}</strong>
                    <span className="confirm-item-quantity">
                      {quantities[med.id]} {med.unit}
                    </span>
                  </div>
                  <div className="confirm-item-details">
                    <span>Strength: {med.strength}</span>
                    <span>•</span>
                    <span>Form: {med.form}</span>
                    {batch && (
                      <>
                        <span>•</span>
                        <span>Batch: {batch.batchNumber}</span>
                      </>
                    )}
                  </div>
                  {med.instructions && (
                    <div className="confirm-item-instructions">
                      <Icon name="file-text" />
                      <span>{med.instructions}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Confirmation Note */}
          <div className="confirm-note">
            <Icon name="info" />
            <p>
              By confirming, you acknowledge that the correct medicines and
              quantities have been verified and prepared for dispensing to the
              patient.
            </p>
          </div>
        </div>

        <div className="confirm-dialog-actions">
          <button
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="button button-primary"
            onClick={onConfirm}
          >
            <Icon name="check" />
            Confirm & Dispense
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Place On Hold Dialog
// ============================================================================

interface PlaceOnHoldDialogProps {
  prescriptionId: string;
  onSubmit: (reason: string, explanation: string) => void;
  onCancel: () => void;
}

export function PlaceOnHoldDialog({
  prescriptionId,
  onSubmit,
  onCancel
}: PlaceOnHoldDialogProps) {
  const [reason, setReason] = React.useState('');
  const [explanation, setExplanation] = React.useState('');

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit(reason, explanation);
  };

  const holdReasons = [
    'Medicine out of stock',
    'Patient not available',
    'Verification required',
    'Insurance authorization pending',
    'Clinical clarification needed',
    'Other'
  ];

  return (
    <div className="hold-dialog-overlay">
      <div className="hold-dialog">
        <div className="hold-dialog-header">
          <h2>Place Prescription on Hold</h2>
          <button
            className="dialog-close-button"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <Icon name="x" />
          </button>
        </div>

        <div className="hold-dialog-content">
          <div className="hold-info">
            <Icon name="pause-circle" />
            <p>
              Prescription <strong>{prescriptionId}</strong> will be placed on
              hold and removed from the active queue. You can resume it later
              from the On Hold filter.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="hold-reason">
              Reason for Hold <span className="required">*</span>
            </label>
            <select
              id="hold-reason"
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select reason...</option>
              {holdReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="hold-explanation">
              Additional Explanation
              <span className="form-hint">(Optional)</span>
            </label>
            <textarea
              id="hold-explanation"
              className="form-textarea"
              rows={4}
              placeholder="Provide additional details if needed..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>

          <div className="hold-note">
            <Icon name="info" />
            <p>
              This action is reversible. You can resume processing this
              prescription at any time.
            </p>
          </div>
        </div>

        <div className="hold-dialog-actions">
          <button
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="button button-warning"
            onClick={handleSubmit}
            disabled={!reason}
          >
            <Icon name="pause-circle" />
            Place on Hold
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Loading State
// ============================================================================

export function DispensingPageLoadingState() {
  return (
    <div className="dispensing-page-loading">
      <div className="dispensing-header-skeleton">
        <div className="skeleton skeleton-text skeleton-title" />
        <div className="skeleton skeleton-button" />
      </div>

      <div className="queue-section">
        <div className="queue-header-skeleton">
          <div className="skeleton skeleton-text skeleton-heading" />
          <div className="skeleton skeleton-input" />
        </div>

        <div className="queue-filters-skeleton">
          <div className="skeleton skeleton-button" />
          <div className="skeleton skeleton-button" />
          <div className="skeleton skeleton-button" />
        </div>

        <div className="queue-table-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="queue-row-skeleton">
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-badge" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error State
// ============================================================================

interface DispensingPageErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function DispensingPageErrorState({
  error,
  onRetry
}: DispensingPageErrorStateProps) {
  return (
    <div className="dispensing-page-error">
      <div className="error-content">
        <div className="error-icon">
          <Icon name="alert-circle" />
        </div>
        <h2>Unable to Load Prescription Queue</h2>
        <p className="error-message">{error}</p>
        <button
          className="button button-primary"
          onClick={onRetry}
        >
          <Icon name="refresh-cw" />
          Try Again
        </button>
      </div>
    </div>
  );
}
