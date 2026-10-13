import React, { useState, useMemo } from 'react'
import {
  HistoricalRecord,
  HistoricalRecordDetail,
  HistorySearchFilters,
  HistoryContext,
  HistoricalOrderStatus,
  HistoricalResultStatus,
  demoHistoricalRecords,
  demoHistoricalRecordDetail,
  demoHistoryContext,
  demoTimelineEvents,
  demoCorrectionRecords,
  demoAmendmentRecords,
  demoResultComparisons,
  createDefaultFilters,
  calculateMetrics,
} from './history-model'
import {
  HistoryPageHeader,
  HistoryMetricsPanel,
  HistorySearchToolbar,
  HistoryRecordsTable,
  RecordDetailView,
  CorrectionHistoryPanel,
  ResultComparisonPanel,
  TimelinePanel,
  ExportConfirmDialog,
  HistoryLoadingState,
  HistoryEmptyState,
} from './history-components'

interface HistoryPageProps {
  onNavigateBack?: () => void
}

export default function HistoryPage({ onNavigateBack }: HistoryPageProps) {
  const [context] = useState<HistoryContext>(demoHistoryContext)
  const [records] = useState<HistoricalRecord[]>(demoHistoricalRecords)
  const [filters, setFilters] = useState<HistorySearchFilters>(createDefaultFilters())
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [recordDetail, setRecordDetail] = useState<HistoricalRecordDetail | null>(null)
  const [isLoadingRecord, setIsLoadingRecord] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showCorrections, setShowCorrections] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matches =
          record.patientName.toLowerCase().includes(searchLower) ||
          record.patientId.toLowerCase().includes(searchLower) ||
          record.orderNumber.toLowerCase().includes(searchLower) ||
          record.testSummary.toLowerCase().includes(searchLower)
        if (!matches) return false
      }

      // Date range
      const orderDate = new Date(record.orderDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      if (orderDate < startDate || orderDate > endDate) return false

      // Patient ID
      if (filters.patientId && record.patientId !== filters.patientId) return false

      // Priority
      if (filters.priority !== 'all' && record.priority !== filters.priority) return false

      // Order status
      if (filters.orderStatus !== 'all' && record.orderStatus !== filters.orderStatus) return false

      // Result status
      if (filters.resultStatus !== 'all' && record.resultStatus !== filters.resultStatus) return false

      // Corrected only
      if (filters.showCorrectedOnly && !record.hasCorrections && !record.hasAmendments) return false

      // Released only
      if (filters.showReleasedOnly && !record.isReleased) return false

      return true
    })
  }, [records, filters])

  const metrics = useMemo(() => calculateMetrics(filteredRecords), [filteredRecords])

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredRecords.slice(startIndex, endIndex)
  }, [filteredRecords, currentPage])

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)

  const handleFilterChange = (newFilters: HistorySearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters(createDefaultFilters())
    setCurrentPage(1)
  }

  const handleViewRecord = (recordId: string) => {
    setIsLoadingRecord(true)
    setSelectedRecordId(recordId)
    
    setTimeout(() => {
      if (recordId === 'rec-001') {
        setRecordDetail(demoHistoricalRecordDetail)
      }
      setIsLoadingRecord(false)
    }, 500)
  }

  const handleCloseRecord = () => {
    setSelectedRecordId(null)
    setRecordDetail(null)
    setShowTimeline(false)
    setShowCorrections(false)
    setShowComparison(false)
  }

  const handleExport = () => {
    setShowExportDialog(true)
  }

  const handleConfirmExport = () => {
    console.log('Exporting records:', {
      count: filteredRecords.length,
      dateRange: filters.dateRange,
    })
    setShowExportDialog(false)
  }

  const handlePrint = () => {
    if (recordDetail) {
      console.log('Printing record:', recordDetail.orderNumber)
      window.print()
    }
  }

  // List view
  if (!selectedRecordId || !recordDetail) {
    return (
      <div className="history-page">
        <HistoryPageHeader
          currentUser={context.currentUser}
          permissions={context.permissions}
          onRefresh={() => console.log('Refresh history')}
          onExport={handleExport}
        />

        <div className="history-container">
          <HistoryMetricsPanel
            metrics={metrics}
            onMetricClick={(metric) => console.log('Metric clicked:', metric)}
          />

          <HistorySearchToolbar
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {filteredRecords.length === 0 ? (
            <HistoryEmptyState
              message="No laboratory records match the selected filters."
              onClearFilters={handleClearFilters}
            />
          ) : (
            <HistoryRecordsTable
              records={paginatedRecords}
              totalCount={filteredRecords.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onViewRecord={handleViewRecord}
              permissions={context.permissions}
            />
          )}
        </div>
      </div>
    )
  }

  // Detail view
  if (isLoadingRecord) {
    return <HistoryLoadingState message="Loading record details..." />
  }

  if (!recordDetail) {
    return <HistoryEmptyState message="Record not found" />
  }

  return (
    <div className="history-page">
      <HistoryPageHeader
        currentUser={context.currentUser}
        permissions={context.permissions}
        onRefresh={() => console.log('Refresh record')}
        onBack={handleCloseRecord}
        onExport={handleExport}
        onPrint={handlePrint}
        selectedRecord={recordDetail}
      />

      <div className="history-container">
        <div className="history-detail-layout">
          <RecordDetailView
            record={recordDetail}
            permissions={context.permissions}
            onToggleTimeline={() => setShowTimeline(!showTimeline)}
            onToggleCorrections={() => setShowCorrections(!showCorrections)}
            onToggleComparison={() => setShowComparison(!showComparison)}
            showTimeline={showTimeline}
            showCorrections={showCorrections}
            showComparison={showComparison}
          />

          {showTimeline && (
            <TimelinePanel
              events={demoTimelineEvents}
              onClose={() => setShowTimeline(false)}
            />
          )}

          {showCorrections && recordDetail.hasCorrections && (
            <CorrectionHistoryPanel
              corrections={demoCorrectionRecords}
              amendments={demoAmendmentRecords}
              onClose={() => setShowCorrections(false)}
            />
          )}

          {showComparison && (
            <ResultComparisonPanel
              comparisons={demoResultComparisons}
              onClose={() => setShowComparison(false)}
            />
          )}
        </div>
      </div>

      {showExportDialog && (
        <ExportConfirmDialog
          recordCount={filteredRecords.length}
          dateRange={filters.dateRange}
          onConfirm={handleConfirmExport}
          onCancel={() => setShowExportDialog(false)}
        />
      )}
    </div>
  )
}
