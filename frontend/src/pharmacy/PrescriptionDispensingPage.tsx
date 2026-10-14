/**
 * Prescription Queue and Dispensing Page
 * ORHIMS Phase 07 - Pharmacy Management (Prompt 37)
 */

import { useState } from 'react'
import {
  PrescriptionContext,
  PrescriptionQueueItem,
  PrescriptionDetail,
  QueueFilters,
  demoPrescriptionContext,
  demoPrescriptionQueue,
  demoPrescriptionDetail,
  applyQueueFilters
} from './prescription-model'

import {
  DispensingPageHeader,
  PrescriptionQueueSection,
  PrescriptionDetailWorkspace,
  ConfirmDispensingDialog,
  PlaceOnHoldDialog,
  DispensingPageLoadingState,
  DispensingPageErrorState
} from './prescription-components'

import './pharmacy.css'

interface PrescriptionDispensingPageProps {
  onNavigateBack: () => void
}

export default function PrescriptionDispensingPage({ onNavigateBack }: PrescriptionDispensingPageProps) {
  const [context] = useState<PrescriptionContext>(demoPrescriptionContext)
  const [prescriptionQueue] = useState<PrescriptionQueueItem[]>(demoPrescriptionQueue)
  const [filteredQueue, setFilteredQueue] = useState<PrescriptionQueueItem[]>(demoPrescriptionQueue)
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionDetail | null>(null)
  const [isLoading] = useState<boolean>(false)
  const [error] = useState<string | null>(null)
  
  // Filters state
  const [filters, setFilters] = useState<Partial<QueueFilters>>({
    searchQuery: '',
    status: 'all',
    priority: 'all',
    requiresAttention: false
  })

  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
  const [showHoldDialog, setShowHoldDialog] = useState<boolean>(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [recordsPerPage] = useState<number>(10)

  const handleRefresh = () => {
    console.log('Refreshing prescription queue...')
    // In real implementation, reload from API
  }

  const handleFilterChange = (newFilters: Partial<QueueFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    const filtered = applyQueueFilters(prescriptionQueue, updatedFilters)
    setFilteredQueue(filtered)
    setCurrentPage(1)
  }

  const handleOpenPrescription = (prescription: PrescriptionQueueItem) => {
    console.log('Opening prescription:', prescription.prescriptionNumber)
    // In real implementation, load full prescription details from API
    setSelectedPrescription(demoPrescriptionDetail)
  }

  const handleClosePrescription = () => {
    setSelectedPrescription(null)
  }

  const handleReviewDispensing = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmDispensing = () => {
    console.log('Dispensing confirmed')
    // In real implementation, submit to backend
    setShowConfirmDialog(false)
    setSelectedPrescription(null)
    // Refresh queue
  }

  const handleCancelDispensing = () => {
    setShowConfirmDialog(false)
  }

  const handlePlaceOnHold = () => {
    setShowHoldDialog(true)
  }

  const handleConfirmHold = (reason: string, explanation: string) => {
    console.log('Placing on hold:', reason, explanation)
    // In real implementation, submit to backend
    setShowHoldDialog(false)
    setSelectedPrescription(null)
    // Refresh queue
  }

  const handleCancelHold = () => {
    setShowHoldDialog(false)
  }

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredQueue.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(filteredQueue.length / recordsPerPage)

  if (isLoading) {
    return <DispensingPageLoadingState />
  }

  if (error) {
    return <DispensingPageErrorState error={error} onRetry={handleRefresh} />
  }

  return (
    <div className="prescription-dispensing-page">
      <DispensingPageHeader
        context={context}
        onRefresh={handleRefresh}
        onNavigateBack={onNavigateBack}
      />

      <div className="dispensing-content">
        {!selectedPrescription ? (
          <PrescriptionQueueSection
            prescriptions={currentRecords}
            filters={filters}
            onFilterChange={handleFilterChange}
            onOpenPrescription={handleOpenPrescription}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredQueue.length}
            recordsPerPage={recordsPerPage}
            onPageChange={setCurrentPage}
          />
        ) : (
          <PrescriptionDetailWorkspace
            prescription={selectedPrescription}
            onClose={handleClosePrescription}
            onReviewDispensing={handleReviewDispensing}
            onPlaceOnHold={handlePlaceOnHold}
          />
        )}
      </div>

      {showConfirmDialog && selectedPrescription && (
        <ConfirmDispensingDialog
          prescription={selectedPrescription}
          onConfirm={handleConfirmDispensing}
          onCancel={handleCancelDispensing}
        />
      )}

      {showHoldDialog && selectedPrescription && (
        <PlaceOnHoldDialog
          prescriptionNumber={selectedPrescription.prescriptionNumber}
          onConfirm={handleConfirmHold}
          onCancel={handleCancelHold}
        />
      )}
    </div>
  )
}
