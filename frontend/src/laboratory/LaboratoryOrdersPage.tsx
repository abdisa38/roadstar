import { useEffect, useState } from 'react'
import {
  createEmptyDraft,
  hasUnsavedChanges,
  isDuplicateTest,
  sampleLabContext,
  sampleLabRequests,
  sampleLabTestCatalogue,
  validateLabRequest,
  type LabTestCatalogueEntry,
  type LaboratoryOrderContext,
  type LaboratoryOrdersState,
  type LaboratoryRequest,
  type RequestDraft,
  type RequestedTest,
  type RequestPriority,
  type RequestStatus,
} from './model'
import {
  PatientEncounterHeader,
  RequestsSection,
  NewRequestPanel,
  RequestReviewDialog,
  RequestDetailsDialog,
  UnsavedChangesDialog,
  DuplicateTestDialog,
  CancelRequestDialog,
  SaveStateIndicator,
  ReadOnlyNotice,
  PermissionDeniedNotice,
  CatalogueUnavailableNotice,
} from './components'

export type LaboratoryOrdersPageProps = {
  state: 'ready' | 'loading' | 'error'
  patientId: string
  encounterId: string
  onNavigate: (destination: string, params?: Record<string, unknown>) => void
  onReady: () => void
}

export default function LaboratoryOrdersPage({
  state: pageState,
  patientId,
  encounterId,
  onNavigate,
  onReady,
}: LaboratoryOrdersPageProps) {
  // Use sample context — real implementation would fetch from backend
  const [context] = useState<LaboratoryOrderContext>(sampleLabContext)
  const [requests, setRequests] = useState<LaboratoryRequest[]>(sampleLabRequests)
  const [activeDraft, setActiveDraft] = useState<RequestDraft | null>(null)
  const [saveState, setSaveState] = useState<LaboratoryOrdersState['saveState']>('idle')
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [catalogueAvailable] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all')

  // Dialog states
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [duplicateTestName, setDuplicateTestName] = useState<string>('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState<LaboratoryRequest | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<LaboratoryRequest | null>(null)
  const [showRequestDetails, setShowRequestDetails] = useState(false)

  useEffect(() => {
    if (pageState === 'ready') {
      onReady()
    }
  }, [pageState, onReady])

  // Create new request
  const handleNewRequest = () => {
    if (context.isReadOnly || !context.canOrderTests || !catalogueAvailable) return
    setActiveDraft(createEmptyDraft())
  }

  // Cancel draft
  const handleCancelDraft = () => {
    if (hasUnsavedChanges(activeDraft)) {
      setShowUnsavedDialog(true)
      setPendingNavigation('cancel-draft')
    } else {
      setActiveDraft(null)
    }
  }

  // Confirm cancel draft
  const handleConfirmCancelDraft = () => {
    setActiveDraft(null)
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
  }

  // Update draft field
  const handleUpdateDraft = (updates: Partial<RequestDraft>) => {
    if (!activeDraft) return
    setActiveDraft({ ...activeDraft, ...updates })
  }

  // Select test from catalogue
  const handleSelectTest = (test: LabTestCatalogueEntry) => {
    if (!activeDraft) return

    // Check for duplicate
    if (isDuplicateTest(test.id, activeDraft.selectedTests)) {
      setDuplicateTestName(test.testName)
      setShowDuplicateDialog(true)
      return
    }

    // Add test to draft
    const newTest: RequestedTest = {
      id: `RT-${Date.now()}`,
      testCatalogueId: test.id,
      testName: test.testName,
      testCode: test.testCode,
      specimenType: test.specimenType,
      notes: '',
    }

    setActiveDraft({
      ...activeDraft,
      selectedTests: [...activeDraft.selectedTests, newTest],
    })
  }

  // Continue with duplicate
  const handleContinueWithDuplicate = () => {
    setShowDuplicateDialog(false)
    setDuplicateTestName('')
  }

  // Remove test from draft
  const handleRemoveTest = (testId: string) => {
    if (!activeDraft) return
    setActiveDraft({
      ...activeDraft,
      selectedTests: activeDraft.selectedTests.filter((t) => t.id !== testId),
    })
  }

  // Review request
  const handleReviewRequest = () => {
    if (!activeDraft) return

    const validation = validateLabRequest(activeDraft)
    if (!validation.isValid) {
      // Validation errors will be shown in the form
      return
    }

    setShowReviewDialog(true)
  }

  // Save draft
  const handleSaveDraft = () => {
    if (!activeDraft) return

    setSaveState('saving')
    setTimeout(() => {
      // Simulate save
      const newRequest: LaboratoryRequest = {
        id: `LABREQ-2026-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        encounterId: context.encounterId,
        patientId: context.patientId,
        requestedTests: activeDraft.selectedTests,
        clinicalIndication: activeDraft.clinicalIndication,
        requestNotes: activeDraft.requestNotes,
        priority: activeDraft.priority,
        orderedBy: context.assignedClinician,
        orderedDate: new Date().toISOString(),
        status: 'draft',
        statusChangedBy: null,
        statusChangedDate: null,
        specimenCollectedDate: null,
        specimenCollectedBy: null,
        resultAvailableDate: null,
        cancelledReason: null,
      }

      setRequests([...requests, newRequest])
      setSaveState('saved')
      setLastSaved(new Date().toISOString())
      setActiveDraft(null)
      setShowReviewDialog(false)

      setTimeout(() => setSaveState('idle'), 3000)
    }, 800)
  }

  // Submit request
  const handleSubmitRequest = () => {
    if (!activeDraft) return

    setSaveState('saving')
    setTimeout(() => {
      // Simulate submit
      const newRequest: LaboratoryRequest = {
        id: `LABREQ-2026-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        encounterId: context.encounterId,
        patientId: context.patientId,
        requestedTests: activeDraft.selectedTests,
        clinicalIndication: activeDraft.clinicalIndication,
        requestNotes: activeDraft.requestNotes,
        priority: activeDraft.priority,
        orderedBy: context.assignedClinician,
        orderedDate: new Date().toISOString(),
        status: 'requested',
        statusChangedBy: null,
        statusChangedDate: null,
        specimenCollectedDate: null,
        specimenCollectedBy: null,
        resultAvailableDate: null,
        cancelledReason: null,
      }

      setRequests([...requests, newRequest])
      setSaveState('saved')
      setLastSaved(new Date().toISOString())
      setActiveDraft(null)
      setShowReviewDialog(false)

      setTimeout(() => setSaveState('idle'), 3000)
    }, 800)
  }

  // View request details
  const handleViewRequest = (request: LaboratoryRequest) => {
    setSelectedRequest(request)
    setShowRequestDetails(true)
  }

  // Cancel request
  const handleCancelRequest = (request: LaboratoryRequest) => {
    setRequestToCancel(request)
    setShowCancelDialog(true)
  }

  // Confirm cancel request
  const handleConfirmCancelRequest = () => {
    if (!requestToCancel) return

    setRequests(
      requests.map((req) =>
        req.id === requestToCancel.id
          ? {
              ...req,
              status: 'cancelled',
              statusChangedBy: context.assignedClinician,
              statusChangedDate: new Date().toISOString(),
              cancelledReason: 'Cancelled by ordering clinician',
            }
          : req
      )
    )

    setRequestToCancel(null)
    setShowCancelDialog(false)
  }

  // Navigate with unsaved changes check
  const handleNavigateWithCheck = (destination: string) => {
    if (hasUnsavedChanges(activeDraft)) {
      setShowUnsavedDialog(true)
      setPendingNavigation(destination)
    } else {
      onNavigate(destination)
    }
  }

  // Confirm navigation
  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      if (pendingNavigation === 'cancel-draft') {
        handleConfirmCancelDraft()
      } else {
        onNavigate(pendingNavigation)
      }
    }
  }

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    // Status filter
    if (statusFilter !== 'all' && req.status !== statusFilter) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = req.id.toLowerCase().includes(query)
      const matchesTests = req.requestedTests.some(
        (test) =>
          test.testName.toLowerCase().includes(query) ||
          test.testCode.toLowerCase().includes(query)
      )
      const matchesIndication = req.clinicalIndication.toLowerCase().includes(query)

      if (!matchesId && !matchesTests && !matchesIndication) return false
    }

    return true
  })

  if (pageState === 'loading') {
    return <div className="lab-loading">Loading laboratory orders...</div>
  }

  if (pageState === 'error') {
    return <div className="lab-error">Error loading laboratory orders</div>
  }

  return (
    <div className="lab-orders-page">
      <PatientEncounterHeader
        context={context}
        onNavigate={handleNavigateWithCheck}
        title="Laboratory Orders"
      />

      {context.isReadOnly && <ReadOnlyNotice encounterStatus={context.encounterStatus} />}

      {!context.canOrderTests && !context.isReadOnly && <PermissionDeniedNotice />}

      {!catalogueAvailable && <CatalogueUnavailableNotice />}

      <div className="lab-content">
        <div className="lab-main">
          <RequestsSection
            requests={filteredRequests}
            context={context}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onNewRequest={handleNewRequest}
            onViewRequest={handleViewRequest}
            onCancelRequest={handleCancelRequest}
            catalogueAvailable={catalogueAvailable}
          />

          {activeDraft && (
            <NewRequestPanel
              draft={activeDraft}
              context={context}
              catalogue={sampleLabTestCatalogue}
              onUpdateDraft={handleUpdateDraft}
              onSelectTest={handleSelectTest}
              onRemoveTest={handleRemoveTest}
              onReview={handleReviewRequest}
              onCancel={handleCancelDraft}
            />
          )}
        </div>
      </div>

      {showReviewDialog && activeDraft && (
        <RequestReviewDialog
          draft={activeDraft}
          context={context}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmitRequest}
          onEdit={() => setShowReviewDialog(false)}
          onCancel={() => {
            setShowReviewDialog(false)
            setActiveDraft(null)
          }}
        />
      )}

      {showRequestDetails && selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          context={context}
          onClose={() => {
            setShowRequestDetails(false)
            setSelectedRequest(null)
          }}
          onViewResult={(requestId) => {
            console.log('View result for request:', requestId)
            // Future: Navigate to result review
          }}
          onCancel={handleCancelRequest}
        />
      )}

      {showUnsavedDialog && (
        <UnsavedChangesDialog
          onDiscard={handleConfirmNavigation}
          onContinue={() => {
            setShowUnsavedDialog(false)
            setPendingNavigation(null)
          }}
        />
      )}

      {showDuplicateDialog && (
        <DuplicateTestDialog
          testName={duplicateTestName}
          onContinue={handleContinueWithDuplicate}
          onCancel={() => {
            setShowDuplicateDialog(false)
            setDuplicateTestName('')
          }}
        />
      )}

      {showCancelDialog && requestToCancel && (
        <CancelRequestDialog
          request={requestToCancel}
          onConfirm={handleConfirmCancelRequest}
          onCancel={() => {
            setShowCancelDialog(false)
            setRequestToCancel(null)
          }}
        />
      )}

      <SaveStateIndicator state={saveState} lastSaved={lastSaved} />
    </div>
  )
}
