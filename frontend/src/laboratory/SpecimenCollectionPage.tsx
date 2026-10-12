import React, { useState, useMemo } from 'react';
import {
  CollectionRequest,
  CollectionDraft,
  RejectionDraft,
  SpecimenStatus,
  CollectionLocation,
  RejectionReason,
  SpecimenCollectionContext,
  CollectionQueueState,
  demoCollectionRequests,
  demoCollectionUser,
  validateCollectionDraft,
  validateRejectionDraft,
  canCollectSpecimen,
  canVerifySpecimen,
  canRejectSpecimen,
  getNextSpecimenStatus
} from './specimen-model';
import {
  QueueFilters,
  CollectionRequestTable,
  CollectionFormPanel,
  VerificationReviewPanel,
  RejectionDialog,
  CollectionSuccessNotice,
  VerificationSuccessNotice,
  RejectionNotice,
  EmptyQueueState
} from './specimen-components';

interface SpecimenCollectionPageProps {
  onNavigateBack?: () => void;
}

export function SpecimenCollectionPage({ onNavigateBack }: SpecimenCollectionPageProps) {
  // Context
  const context: SpecimenCollectionContext = {
    currentUser: demoCollectionUser,
    currentDateTime: new Date()
  };

  // Queue state
  const [queueState, setQueueState] = useState<CollectionQueueState>({
    requests: demoCollectionRequests,
    filterStatus: undefined,
    filterPriority: undefined,
    searchQuery: '',
    sortBy: 'requested-date',
    sortDirection: 'desc'
  });

  // UI state
  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(null);
  const [activeView, setActiveView] = useState<'queue' | 'collect' | 'verify'>('queue');
  const [collectionDraft, setCollectionDraft] = useState<CollectionDraft | null>(null);
  const [rejectionDraft, setRejectionDraft] = useState<RejectionDraft | null>(null);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    let filtered = [...queueState.requests];

    // Status filter
    if (queueState.filterStatus) {
      filtered = filtered.filter(r => r.status === queueState.filterStatus);
    }

    // Priority filter
    if (queueState.filterPriority) {
      filtered = filtered.filter(r => r.priority === queueState.filterPriority);
    }

    // Search filter
    if (queueState.searchQuery.trim().length >= 2) {
      const query = queueState.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.patientId.toLowerCase().includes(query) ||
        r.patientName.toLowerCase().includes(query) ||
        r.requestId.toLowerCase().includes(query) ||
        r.specimenType.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (queueState.sortBy) {
        case 'requested-date':
          aVal = a.requestedAt.getTime();
          bVal = b.requestedAt.getTime();
          break;
        case 'patient-name':
          aVal = a.patientName;
          bVal = b.patientName;
          break;
        case 'priority':
          const priorityOrder = { 'STAT': 0, 'urgent': 1, 'routine': 2 };
          aVal = priorityOrder[a.priority];
          bVal = priorityOrder[b.priority];
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }
      if (queueState.sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [queueState]);

  // Handlers
  const handleStartCollection = (request: CollectionRequest) => {
    if (!canCollectSpecimen(request, context)) {
      alert('You do not have permission to collect this specimen.');
      return;
    }

    setSelectedRequest(request);
    setCollectionDraft({
      requestId: request.requestId,
      patientConfirmed: false,
      specimenIdentifier: '',
      collectionLocation: 'outpatient-lab',
      collectionDateTime: new Date(),
      collectorNotes: '',
      requiresSeparateVerification: request.requiresSeparateVerification
    });
    setActiveView('collect');
    setSuccessMessage(null);
  };

  const handleCollectionChange = (updates: Partial<CollectionDraft>) => {
    if (collectionDraft) {
      setCollectionDraft({ ...collectionDraft, ...updates });
    }
  };

  const handleCancelCollection = () => {
    setActiveView('queue');
    setSelectedRequest(null);
    setCollectionDraft(null);
  };

  const handleConfirmCollection = () => {
    if (!collectionDraft || !selectedRequest) return;

    const validation = validateCollectionDraft(collectionDraft);
    if (!validation.valid) {
      alert('Please complete all required fields:\n' + validation.errors.join('\n'));
      return;
    }

    // Update request with collection data
    const nextStatus = getNextSpecimenStatus(selectedRequest.status, 'collect');
    const updatedRequest: CollectionRequest = {
      ...selectedRequest,
      status: nextStatus,
      patientConfirmed: collectionDraft.patientConfirmed,
      specimenIdentifier: collectionDraft.specimenIdentifier,
      collectionDateTime: collectionDraft.collectionDateTime,
      collectionLocation: collectionDraft.collectionLocation,
      collectedBy: {
        staffId: context.currentUser.staffId,
        staffName: context.currentUser.staffName,
        timestamp: new Date()
      },
      collectorNotes: collectionDraft.collectorNotes || undefined
    };

    // Update queue
    setQueueState(prev => ({
      ...prev,
      requests: prev.requests.map(r =>
        r.requestId === updatedRequest.requestId ? updatedRequest : r
      )
    }));

    // Show success
    setSuccessMessage(`Specimen collected successfully for ${updatedRequest.patientName}.`);
    setActiveView('queue');
    setSelectedRequest(null);
    setCollectionDraft(null);

    // Auto-clear success after 5s
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleStartVerification = (request: CollectionRequest) => {
    if (!canVerifySpecimen(request, context)) {
      alert('You cannot verify this specimen. Either you lack permission or you collected it and separate verification is required.');
      return;
    }

    setSelectedRequest(request);
    setActiveView('verify');
    setSuccessMessage(null);
  };

  const handleCancelVerification = () => {
    setActiveView('queue');
    setSelectedRequest(null);
  };

  const handleConfirmVerification = () => {
    if (!selectedRequest) return;

    const nextStatus = getNextSpecimenStatus(selectedRequest.status, 'verify');
    const updatedRequest: CollectionRequest = {
      ...selectedRequest,
      status: nextStatus,
      verifiedBy: {
        staffId: context.currentUser.staffId,
        staffName: context.currentUser.staffName,
        timestamp: new Date()
      }
    };

    setQueueState(prev => ({
      ...prev,
      requests: prev.requests.map(r =>
        r.requestId === updatedRequest.requestId ? updatedRequest : r
      )
    }));

    setSuccessMessage(`Specimen verified successfully for ${updatedRequest.patientName}.`);
    setActiveView('queue');
    setSelectedRequest(null);

    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleInitiateRejection = (request: CollectionRequest) => {
    if (!canRejectSpecimen(request, context)) {
      alert('You do not have permission to reject this specimen.');
      return;
    }

    setSelectedRequest(request);
    setRejectionDraft({
      requestId: request.requestId,
      reason: 'other',
      notes: ''
    });
    setShowRejectionDialog(true);
  };

  const handleRejectionChange = (updates: Partial<RejectionDraft>) => {
    if (rejectionDraft) {
      setRejectionDraft({ ...rejectionDraft, ...updates });
    }
  };

  const handleCancelRejection = () => {
    setShowRejectionDialog(false);
    setRejectionDraft(null);
    if (activeView !== 'queue') {
      // If rejecting from collection/verification view, return to queue
      setActiveView('queue');
      setSelectedRequest(null);
      setCollectionDraft(null);
    }
  };

  const handleConfirmRejection = () => {
    if (!rejectionDraft || !selectedRequest) return;

    const validation = validateRejectionDraft(rejectionDraft);
    if (!validation.valid) {
      alert('Please complete all required fields:\n' + validation.errors.join('\n'));
      return;
    }

    const nextStatus = getNextSpecimenStatus(selectedRequest.status, 'reject');
    const updatedRequest: CollectionRequest = {
      ...selectedRequest,
      status: nextStatus,
      rejectedBy: {
        staffId: context.currentUser.staffId,
        staffName: context.currentUser.staffName,
        timestamp: new Date()
      },
      rejectionReason: rejectionDraft.reason,
      rejectionNotes: rejectionDraft.notes
    };

    setQueueState(prev => ({
      ...prev,
      requests: prev.requests.map(r =>
        r.requestId === updatedRequest.requestId ? updatedRequest : r
      )
    }));

    setSuccessMessage(`Specimen rejected for ${updatedRequest.patientName}. Reason: ${rejectionDraft.reason}`);
    setShowRejectionDialog(false);
    setRejectionDraft(null);
    setActiveView('queue');
    setSelectedRequest(null);
    setCollectionDraft(null);

    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleFilterChange = (updates: Partial<CollectionQueueState>) => {
    setQueueState(prev => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setQueueState(prev => ({
      ...prev,
      filterStatus: undefined,
      filterPriority: undefined,
      searchQuery: ''
    }));
  };

  // Render
  return (
    <div className="specimen-collection-page">
      <div className="specimen-collection-container">
        {/* Header */}
        <div className="specimen-collection-header">
          <div className="specimen-collection-header-content">
            {onNavigateBack && (
              <button
                className="specimen-collection-back-button"
                onClick={onNavigateBack}
                type="button"
              >
                <svg className="icon-back" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Lab Orders
              </button>
            )}
            <div>
              <h1 className="specimen-collection-title">Specimen Collection & Verification</h1>
              <p className="specimen-collection-subtitle">
                Lab Technologist: {context.currentUser.staffName} ({context.currentUser.staffId})
              </p>
            </div>
          </div>
        </div>

        {/* Success notices */}
        {successMessage && activeView === 'queue' && (
          <div className="specimen-collection-notices">
            {successMessage.includes('collected') && (
              <CollectionSuccessNotice message={successMessage} onDismiss={() => setSuccessMessage(null)} />
            )}
            {successMessage.includes('verified') && (
              <VerificationSuccessNotice message={successMessage} onDismiss={() => setSuccessMessage(null)} />
            )}
            {successMessage.includes('rejected') && (
              <RejectionNotice message={successMessage} onDismiss={() => setSuccessMessage(null)} />
            )}
          </div>
        )}

        {/* Main content */}
        {activeView === 'queue' && (
          <>
            <QueueFilters
              state={queueState}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              resultCount={filteredRequests.length}
            />

            {filteredRequests.length === 0 ? (
              <EmptyQueueState
                hasActiveFilters={
                  !!queueState.filterStatus ||
                  !!queueState.filterPriority ||
                  queueState.searchQuery.trim().length >= 2
                }
                onClearFilters={handleClearFilters}
              />
            ) : (
              <CollectionRequestTable
                requests={filteredRequests}
                context={context}
                onStartCollection={handleStartCollection}
                onStartVerification={handleStartVerification}
                onReject={handleInitiateRejection}
              />
            )}
          </>
        )}

        {activeView === 'collect' && selectedRequest && collectionDraft && (
          <CollectionFormPanel
            request={selectedRequest}
            draft={collectionDraft}
            context={context}
            onChange={handleCollectionChange}
            onCancel={handleCancelCollection}
            onConfirm={handleConfirmCollection}
            onReject={() => handleInitiateRejection(selectedRequest)}
          />
        )}

        {activeView === 'verify' && selectedRequest && (
          <VerificationReviewPanel
            request={selectedRequest}
            context={context}
            onCancel={handleCancelVerification}
            onConfirm={handleConfirmVerification}
            onReject={() => handleInitiateRejection(selectedRequest)}
          />
        )}

        {/* Rejection dialog */}
        {showRejectionDialog && selectedRequest && rejectionDraft && (
          <RejectionDialog
            request={selectedRequest}
            draft={rejectionDraft}
            onChange={handleRejectionChange}
            onCancel={handleCancelRejection}
            onConfirm={handleConfirmRejection}
          />
        )}
      </div>
    </div>
  );
}
