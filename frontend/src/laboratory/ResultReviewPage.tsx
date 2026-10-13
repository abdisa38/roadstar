import React, { useState, useMemo } from 'react'
import {
  ReviewQueueItem,
  ReviewOrder,
  ReviewContext,
  ReviewStatus,
  CorrectionRequest,
  demoReviewQueue,
  demoReviewOrder,
  demoReviewContext,
  demoHistoricalResults,
  demoAuditHistory,
} from './review-model'
import {
  ReviewPageHeader,
  ReviewQueuePanel,
  ReviewQueueTable,
  OrderSummaryCard,
  TestResultsReviewTable,
  SpecimenContextPanel,
  HistoricalComparisonPanel,
  ReviewDecisionPanel,
  ApprovalConfirmationDialog,
  CorrectionRequestDialog,
  AuditHistoryPanel,
  ReviewLoadingState,
  ReviewEmptyState,
} from './review-components'

interface ResultReviewPageProps {
  onNavigateBack?: () => void
}

export default function ResultReviewPage({ onNavigateBack }: ResultReviewPageProps) {
  const [context] = useState<ReviewContext>(demoReviewContext)
  const [queueItems] = useState<ReviewQueueItem[]>(demoReviewQueue)
  const [queueSearchTerm, setQueueSearchTerm] = useState('')
  const [queueStatusFilter, setQueueStatusFilter] = useState<ReviewStatus | 'all'>('all')
  const [queuePriorityFilter, setQueuePriorityFilter] = useState<'all' | 'urgent' | 'stat'>('all')
  const [queueCriticalFilter, setQueueCriticalFilter] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [reviewOrder, setReviewOrder] = useState<ReviewOrder | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [showHistoricalComparison, setShowHistoricalComparison] = useState(false)
  const [showSpecimenContext, setShowSpecimenContext] = useState(false)
  const [showAuditHistory, setShowAuditHistory] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  
  const filteredQueue = useMemo(() => {
    return queueItems.filter(item => {
      if (queueSearchTerm) {
        const searchLower = queueSearchTerm.toLowerCase()
        const matchesSearch =
          item.patientName.toLowerCase().includes(searchLower) ||
          item.patientId.toLowerCase().includes(searchLower) ||
          item.orderNumber.toLowerCase().includes(searchLower) ||
          item.testSummary.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (queueStatusFilter !== 'all' && item.reviewStatus !== queueStatusFilter) return false
      if (queuePriorityFilter !== 'all' && item.priority !== queuePriorityFilter) return false
      if (queueCriticalFilter && !item.hasCriticalFindings) return false
      return true
    })
  }, [queueItems, queueSearchTerm, queueStatusFilter, queuePriorityFilter, queueCriticalFilter])
  
  const queueMetrics = useMemo(() => {
    const pending = queueItems.filter(item => item.reviewStatus === 'pending-review').length
    const urgent = queueItems.filter(item => item.priority === 'urgent' || item.priority === 'stat').length
    const critical = queueItems.filter(item => item.hasCriticalFindings).length
    const returned = queueItems.filter(item => item.reviewStatus === 'returned-for-correction').length
    return { pending, urgent, critical, returned }
  }, [queueItems])
  
  const handleOpenOrder = (orderId: string) => {
    setIsLoadingOrder(true)
    setSelectedOrderId(orderId)
    setTimeout(() => {
      if (orderId === 'ord-001') {
        setReviewOrder(demoReviewOrder)
      }
      setIsLoadingOrder(false)
    }, 500)
  }
  
  const handleBackToQueue = () => {
    setSelectedOrderId(null)
    setReviewOrder(null)
    setReviewNotes('')
    setShowHistoricalComparison(false)
    setShowSpecimenContext(false)
    setShowAuditHistory(false)
  }

  
  const handleSaveNotes = () => {
    setIsSavingNotes(true)
    setTimeout(() => {
      console.log('Review notes saved:', reviewNotes)
      setIsSavingNotes(false)
    }, 1000)
  }
  
  const handleApprove = () => {
    if (!reviewOrder) return
    console.log('Approving order:', reviewOrder.orderNumber)
    setShowApprovalDialog(false)
    setReviewOrder({
      ...reviewOrder,
      reviewStatus: 'approved',
      reviewedBy: context.currentUser,
      reviewCompletedAt: new Date().toISOString(),
    })
  }
  
  const handleRequestCorrection = (request: CorrectionRequest) => {
    console.log('Requesting correction:', request)
    setShowCorrectionDialog(false)
    if (reviewOrder) {
      setReviewOrder({
        ...reviewOrder,
        reviewStatus: 'returned-for-correction',
      })
    }
  }
  
  if (!selectedOrderId || !reviewOrder) {
    return (
      <div className="review-page">
        <ReviewPageHeader
          currentUser={context.currentUser}
          currentRole={context.currentRole}
          onRefresh={() => console.log('Refresh queue')}
        />
        <div className="review-container">
          <ReviewQueuePanel
            metrics={queueMetrics}
            onFilterCritical={() => setQueueCriticalFilter(!queueCriticalFilter)}
            criticalFilterActive={queueCriticalFilter}
          />
          <ReviewQueueTable
            items={filteredQueue}
            searchTerm={queueSearchTerm}
            onSearchChange={setQueueSearchTerm}
            statusFilter={queueStatusFilter}
            onStatusFilterChange={setQueueStatusFilter}
            priorityFilter={queuePriorityFilter}
            onPriorityFilterChange={setQueuePriorityFilter}
            onOpenOrder={handleOpenOrder}
          />
        </div>
      </div>
    )
  }

  
  const handleSaveNotes = () => {
    setIsSavingNotes(true)
    setTimeout(() => {
      console.log('Review notes saved:', reviewNotes)
      setIsSavingNotes(false)
    }, 1000)
  }
  
  const handleApprove = () => {
    if (!reviewOrder) return
    console.log('Approving order:', reviewOrder.orderNumber)
    setShowApprovalDialog(false)
    setReviewOrder({
      ...reviewOrder,
      reviewStatus: 'approved',
      reviewedBy: context.currentUser,
      reviewCompletedAt: new Date().toISOString(),
    })
  }
  
  const handleRequestCorrection = (request: CorrectionRequest) => {
    console.log('Requesting correction:', request)
    setShowCorrectionDialog(false)
    if (reviewOrder) {
      setReviewOrder({
        ...reviewOrder,
        reviewStatus: 'returned-for-correction',
      })
    }
  }
  
  if (!selectedOrderId || !reviewOrder) {
    return (
      <div className="review-page">
        <ReviewPageHeader
          currentUser={context.currentUser}
          currentRole={context.currentRole}
          onRefresh={() => console.log('Refresh queue')}
        />
        <div className="review-container">
          <ReviewQueuePanel
            metrics={queueMetrics}
            onFilterCritical={() => setQueueCriticalFilter(!queueCriticalFilter)}
            criticalFilterActive={queueCriticalFilter}
          />
          <ReviewQueueTable
            items={filteredQueue}
            searchTerm={queueSearchTerm}
            onSearchChange={setQueueSearchTerm}
            statusFilter={queueStatusFilter}
            onStatusFilterChange={setQueueStatusFilter}
            priorityFilter={queuePriorityFilter}
            onPriorityFilterChange={setQueuePriorityFilter}
            onOpenOrder={handleOpenOrder}
          />
        </div>
      </div>
    )
  }

  
  if (isLoadingOrder) {
    return <ReviewLoadingState message="Loading order for review..." />
  }
  
  if (!reviewOrder) {
    return <ReviewEmptyState message="Order not found" />
  }
  
  return (
    <div className="review-page">
      <ReviewPageHeader
        currentUser={context.currentUser}
        currentRole={context.currentRole}
        onRefresh={() => console.log('Refresh order')}
        onBack={handleBackToQueue}
        selectedOrder={reviewOrder}
      />
      
      <div className="review-container">
        <div className="review-main-content">
          <OrderSummaryCard order={reviewOrder} />
          
          <TestResultsReviewTable
            tests={reviewOrder.tests}
            historicalResults={showHistoricalComparison ? demoHistoricalResults : undefined}
            onToggleHistorical={() => setShowHistoricalComparison(!showHistoricalComparison)}
            hasHistoricalResults={reviewOrder.hasHistoricalResults}
            canViewHistorical={context.permissions.canViewHistoricalResults}
          />
          
          {showHistoricalComparison && reviewOrder.hasHistoricalResults && (
            <HistoricalComparisonPanel
              currentResults={reviewOrder.tests[0].results}
              historicalResults={demoHistoricalResults}
              onClose={() => setShowHistoricalComparison(false)}
            />
          )}
          
          {showSpecimenContext && (
            <SpecimenContextPanel
              order={reviewOrder}
              onClose={() => setShowSpecimenContext(false)}
            />
          )}
          
          {showAuditHistory && context.permissions.canViewAuditHistory && (
            <AuditHistoryPanel
              events={demoAuditHistory}
              onClose={() => setShowAuditHistory(false)}
            />
          )}
        </div>
        
        <ReviewDecisionPanel
          order={reviewOrder}
          context={context}
          reviewNotes={reviewNotes}
          onReviewNotesChange={setReviewNotes}
          onSaveNotes={handleSaveNotes}
          isSavingNotes={isSavingNotes}
          onApprove={() => setShowApprovalDialog(true)}
          onRequestCorrection={() => setShowCorrectionDialog(true)}
          onToggleSpecimenContext={() => setShowSpecimenContext(!showSpecimenContext)}
          onToggleAuditHistory={() => setShowAuditHistory(!showAuditHistory)}
          showSpecimenContext={showSpecimenContext}
          showAuditHistory={showAuditHistory}
        />
      </div>
      
      {showApprovalDialog && (
        <ApprovalConfirmationDialog
          order={reviewOrder}
          reviewNotes={reviewNotes}
          onConfirm={handleApprove}
          onCancel={() => setShowApprovalDialog(false)}
        />
      )}
      
      {showCorrectionDialog && (
        <CorrectionRequestDialog
          order={reviewOrder}
          onConfirm={handleRequestCorrection}
          onCancel={() => setShowCorrectionDialog(false)}
        />
      )}
    </div>
  )
}
