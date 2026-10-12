import { useEffect, useState } from 'react'
import {
  createEmptyDraft,
  hasUnsavedChanges,
  isDuplicateOrder,
  sampleMedicationCatalogue,
  sampleMedicationOrders,
  samplePrescriptionContext,
  sampleHistoricalMedications,
  validatePrescriptionForm,
  type MedicationCatalogueEntry,
  type MedicationOrder,
  type PrescriptionDraft,
  type PrescriptionManagementContext,
  type PrescriptionManagementState,
  type RouteOfAdministration,
  type FrequencyCode,
  type DosageUnit,
  type HistoricalMedication,
} from './model'
import {
  PatientEncounterHeader,
  AllergyWarningBanner,
  CurrentDiagnosesReference,
  MedicationOrdersSection,
  AddPrescriptionPanel,
  PrescriptionReviewDialog,
  UnsavedChangesDialog,
  DuplicateOrderDialog,
  CancelOrderDialog,
  SaveStateIndicator,
  ReadOnlyNotice,
  PermissionDeniedNotice,
  CatalogueUnavailableNotice,
  HistoricalMedicationsSection,
} from './components'

export type PrescriptionManagementPageProps = {
  state: 'ready' | 'loading' | 'error'
  patientId: string
  encounterId: string
  onNavigate: (destination: string, params?: Record<string, unknown>) => void
  onReady: () => void
}

export default function PrescriptionManagementPage({
  state: pageState,
  patientId,
  encounterId,
  onNavigate,
  onReady,
}: PrescriptionManagementPageProps) {
  // Use sample context — real implementation would fetch from backend
  const [context] = useState<PrescriptionManagementContext>(samplePrescriptionContext)
  const [orders, setOrders] = useState<MedicationOrder[]>(sampleMedicationOrders)
  const [historicalMeds] = useState<HistoricalMedication[]>(sampleHistoricalMedications)
  const [activeDraft, setActiveDraft] = useState<PrescriptionDraft | null>(null)
  const [saveState, setSaveState] = useState<PrescriptionManagementState['saveState']>('idle')
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [catalogueAvailable] = useState(true)

  // Dialog states
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [duplicateMedication, setDuplicateMedication] = useState<string>('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<MedicationOrder | null>(null)

  useEffect(() => {
    if (pageState === 'ready') {
      onReady()
    }
  }, [pageState, onReady])

  // Create new prescription
  const handleCreatePrescription = () => {
    if (context.isReadOnly || !context.canPrescribe || !catalogueAvailable) return
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
  const handleUpdateDraft = (updates: Partial<PrescriptionDraft>) => {
    if (!activeDraft) return
    setActiveDraft({ ...activeDraft, ...updates })
  }

  // Select medication from catalogue
  const handleSelectMedication = (medication: MedicationCatalogueEntry) => {
    if (!activeDraft) return

    // Check for duplicate
    if (isDuplicateOrder(medication.id, orders)) {
      setDuplicateMedication(medication.medicationName)
      setShowDuplicateDialog(true)
      return
    }

    setActiveDraft({
      ...activeDraft,
      medicationId: medication.id,
      medicationName: medication.medicationName,
      genericName: medication.genericName,
      strength: medication.strength,
      strengthUnit: medication.strengthUnit,
      formulation: medication.formulation,
      route: medication.route[0] || null,
    })
  }

  // Continue with duplicate
  const handleContinueWithDuplicate = () => {
    setShowDuplicateDialog(false)
    setDuplicateMedication('')
  }

  // Review prescription
  const handleReviewPrescription = () => {
    if (!activeDraft) return

    const validation = validatePrescriptionForm(activeDraft)
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
      const newOrder: MedicationOrder = {
        id: `RX-2026-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        encounterId: context.encounterId,
        medicationId: activeDraft.medicationId!,
        medicationName: activeDraft.medicationName,
        genericName: activeDraft.genericName,
        strength: activeDraft.strength,
        strengthUnit: activeDraft.strengthUnit,
        formulation: activeDraft.formulation,
        dosageAmount: activeDraft.dosageAmount,
        dosageUnit: activeDraft.dosageUnit!,
        route: activeDraft.route!,
        frequency: activeDraft.frequency!,
        frequencyDescription: activeDraft.frequencyDescription,
        duration: activeDraft.duration,
        durationUnit: activeDraft.durationUnit,
        quantity: activeDraft.quantity,
        quantityUnit: activeDraft.quantityUnit,
        refills: activeDraft.refills,
        startDate: activeDraft.startDate,
        endDate: activeDraft.endDate || null,
        patientInstructions: activeDraft.patientInstructions,
        internalNotes: activeDraft.internalNotes,
        prescribedBy: context.assignedClinician,
        prescribedDate: new Date().toISOString(),
        status: 'draft',
        statusChangedBy: null,
        statusChangedDate: null,
      }

      setOrders([...orders, newOrder])
      setSaveState('saved')
      setLastSaved(new Date().toISOString())
      setActiveDraft(null)
      setShowReviewDialog(false)

      setTimeout(() => setSaveState('idle'), 3000)
    }, 800)
  }

  // Submit prescription
  const handleSubmitPrescription = () => {
    if (!activeDraft) return

    setSaveState('saving')
    setTimeout(() => {
      // Simulate submit
      const newOrder: MedicationOrder = {
        id: `RX-2026-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        encounterId: context.encounterId,
        medicationId: activeDraft.medicationId!,
        medicationName: activeDraft.medicationName,
        genericName: activeDraft.genericName,
        strength: activeDraft.strength,
        strengthUnit: activeDraft.strengthUnit,
        formulation: activeDraft.formulation,
        dosageAmount: activeDraft.dosageAmount,
        dosageUnit: activeDraft.dosageUnit!,
        route: activeDraft.route!,
        frequency: activeDraft.frequency!,
        frequencyDescription: activeDraft.frequencyDescription,
        duration: activeDraft.duration,
        durationUnit: activeDraft.durationUnit,
        quantity: activeDraft.quantity,
        quantityUnit: activeDraft.quantityUnit,
        refills: activeDraft.refills,
        startDate: activeDraft.startDate,
        endDate: activeDraft.endDate || null,
        patientInstructions: activeDraft.patientInstructions,
        internalNotes: activeDraft.internalNotes,
        prescribedBy: context.assignedClinician,
        prescribedDate: new Date().toISOString(),
        status: 'submitted',
        statusChangedBy: null,
        statusChangedDate: null,
      }

      setOrders([...orders, newOrder])
      setSaveState('saved')
      setLastSaved(new Date().toISOString())
      setActiveDraft(null)
      setShowReviewDialog(false)

      setTimeout(() => setSaveState('idle'), 3000)
    }, 800)
  }

  // Cancel order
  const handleCancelOrder = (order: MedicationOrder) => {
    setOrderToCancel(order)
    setShowCancelDialog(true)
  }

  // Confirm cancel order
  const handleConfirmCancelOrder = () => {
    if (!orderToCancel) return

    setOrders(
      orders.map((order) =>
        order.id === orderToCancel.id
          ? {
              ...order,
              status: 'cancelled',
              statusChangedBy: context.assignedClinician,
              statusChangedDate: new Date().toISOString(),
            }
          : order
      )
    )

    setOrderToCancel(null)
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

  if (pageState === 'loading') {
    return <div className="prescription-loading">Loading prescription management...</div>
  }

  if (pageState === 'error') {
    return <div className="prescription-error">Error loading prescription management</div>
  }

  return (
    <div className="prescription-management-page">
      <PatientEncounterHeader
        context={context}
        onNavigate={handleNavigateWithCheck}
        title="Prescription Management"
      />

      {context.isReadOnly && <ReadOnlyNotice encounterStatus={context.encounterStatus} />}

      {!context.canPrescribe && !context.isReadOnly && <PermissionDeniedNotice />}

      {!catalogueAvailable && <CatalogueUnavailableNotice />}

      {context.allergyInfo.allergyStatus === 'documented' &&
        context.allergyInfo.documentedAllergies.length > 0 && (
          <AllergyWarningBanner
            allergies={context.allergyInfo.documentedAllergies}
            onViewDetails={() => handleNavigateWithCheck('allergies')}
          />
        )}

      <div className="prescription-content">
        <div className="prescription-main">
          <CurrentDiagnosesReference
            diagnoses={context.currentDiagnoses}
            onViewAll={() => handleNavigateWithCheck('diagnosis')}
          />

          <MedicationOrdersSection
            orders={orders}
            context={context}
            onCreatePrescription={handleCreatePrescription}
            onCancelOrder={handleCancelOrder}
            catalogueAvailable={catalogueAvailable}
          />

          {activeDraft && (
            <AddPrescriptionPanel
              draft={activeDraft}
              context={context}
              catalogue={sampleMedicationCatalogue}
              onUpdateDraft={handleUpdateDraft}
              onSelectMedication={handleSelectMedication}
              onReview={handleReviewPrescription}
              onCancel={handleCancelDraft}
            />
          )}
        </div>

        <div className="prescription-sidebar">
          <HistoricalMedicationsSection
            medications={historicalMeds}
            onViewAll={() => handleNavigateWithCheck('medical-history')}
          />
        </div>
      </div>

      {showReviewDialog && activeDraft && (
        <PrescriptionReviewDialog
          draft={activeDraft}
          context={context}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmitPrescription}
          onEdit={() => setShowReviewDialog(false)}
          onCancel={() => {
            setShowReviewDialog(false)
            setActiveDraft(null)
          }}
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
        <DuplicateOrderDialog
          medicationName={duplicateMedication}
          onContinue={handleContinueWithDuplicate}
          onCancel={() => {
            setShowDuplicateDialog(false)
            setDuplicateMedication('')
            setActiveDraft(null)
          }}
        />
      )}

      {showCancelDialog && orderToCancel && (
        <CancelOrderDialog
          order={orderToCancel}
          onConfirm={handleConfirmCancelOrder}
          onCancel={() => {
            setShowCancelDialog(false)
            setOrderToCancel(null)
          }}
        />
      )}

      <SaveStateIndicator state={saveState} lastSaved={lastSaved} />
    </div>
  )
}
