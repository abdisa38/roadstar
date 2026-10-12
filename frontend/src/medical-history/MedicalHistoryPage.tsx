import { useState } from 'react'
import type { PatientMedicalHistory, HistorySection, HistoricalEncounter, MedicalCondition, AllergyRecord, MedicationRecord, ProcedureRecord, LaboratoryRecord, ClinicalDocument } from './model'
import { sampleMedicalHistory } from './model'
import {
  PatientHistoryHeader,
  HistoryOverviewPanel,
  HistoryNavigationTabs,
  EncounterTimelineView,
  MedicalConditionsView,
  AllergiesView,
  MedicationsView,
  ProceduresView,
  FamilySocialHistoryView,
  LaboratoryView,
  DocumentsView,
  EncounterDetailDialog,
  ConditionDetailDialog,
  AllergyDetailDialog,
  MedicationDetailDialog,
  ProcedureDetailDialog,
  LaboratoryDetailDialog,
  DocumentDetailDialog,
} from './components'
import './medical-history.css'

type MedicalHistoryPageProps = {
  state: 'loading' | 'ready' | 'error'
  patientId: string
  currentEncounterId: string
  onNavigate: (destination: string, params?: Record<string, string>) => void
  onReady: () => void
}

export default function MedicalHistoryPage({
  state,
  patientId,
  currentEncounterId,
  onNavigate,
  onReady,
}: MedicalHistoryPageProps) {
  const [activeSection, setActiveSection] = useState<HistorySection>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '1-month' | '6-months' | '1-year' | '5-years'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'completed'>('all')
  
  // Detail dialog states
  const [selectedEncounter, setSelectedEncounter] = useState<HistoricalEncounter | null>(null)
  const [selectedCondition, setSelectedCondition] = useState<MedicalCondition | null>(null)
  const [selectedAllergy, setSelectedAllergy] = useState<AllergyRecord | null>(null)
  const [selectedMedication, setSelectedMedication] = useState<MedicationRecord | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureRecord | null>(null)
  const [selectedLaboratory, setSelectedLaboratory] = useState<LaboratoryRecord | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<ClinicalDocument | null>(null)

  // In production, this would fetch real patient history
  const history: PatientMedicalHistory = sampleMedicalHistory

  if (state === 'loading') {
    return (
      <div className="medical-history-page loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Loading patient medical history...</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="medical-history-page error">
        <div className="error-content">
          <div className="error-icon">⚠</div>
          <h2>Unable to Load Medical History</h2>
          <p>The patient's medical history could not be retrieved at this time.</p>
          <div className="error-actions">
            <button className="button" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <button className="button secondary" onClick={() => onNavigate('clinical-workspace')}>
              Return to Clinical Workspace
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleReturnToClinical = () => {
    onNavigate('clinical-workspace', { patientId, encounterId: currentEncounterId })
  }

  const handleSectionChange = (section: HistorySection) => {
    setActiveSection(section)
    setSearchQuery('')
    setDateRangeFilter('all')
    setStatusFilter('all')
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDateRangeFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="medical-history-page">
      <PatientHistoryHeader
        history={history}
        onReturn={handleReturnToClinical}
      />

      <div className="history-container">
        <HistoryNavigationTabs
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          recordCounts={{
            encounters: history.encounters.length,
            conditions: history.conditions.length,
            allergies: history.allergies.length,
            medications: history.medications.length,
            procedures: history.procedures.length,
            laboratory: history.laboratoryResults.length,
            documents: history.documents.length,
            familySocialHistory: history.familyHistory.length + history.socialHistory.length,
          }}
        />

        <div className="history-content">
          {activeSection === 'overview' && (
            <HistoryOverviewPanel
              overview={history.overview}
              recentEncounters={history.encounters.slice(0, 3)}
              activeConditions={history.conditions.filter(c => c.status === 'active')}
              allergies={history.allergies}
              activeMedications={history.medications.filter(m => m.status === 'active')}
              onNavigateToSection={handleSectionChange}
              onViewEncounter={(encounter) => setSelectedEncounter(encounter)}
              onViewCondition={(condition) => setSelectedCondition(condition)}
              onViewAllergy={(allergy) => setSelectedAllergy(allergy)}
              onViewMedication={(medication) => setSelectedMedication(medication)}
            />
          )}

          {activeSection === 'encounters' && (
            <EncounterTimelineView
              encounters={history.encounters}
              searchQuery={searchQuery}
              dateRangeFilter={dateRangeFilter}
              onSearchChange={setSearchQuery}
              onDateRangeChange={setDateRangeFilter}
              onClearFilters={handleClearFilters}
              onViewEncounter={(encounter) => setSelectedEncounter(encounter)}
            />
          )}

          {activeSection === 'conditions' && (
            <MedicalConditionsView
              conditions={history.conditions}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
              onClearFilters={handleClearFilters}
              onViewCondition={(condition) => setSelectedCondition(condition)}
            />
          )}

          {activeSection === 'allergies' && (
            <AllergiesView
              allergies={history.allergies}
              onViewAllergy={(allergy) => setSelectedAllergy(allergy)}
            />
          )}

          {activeSection === 'medications' && (
            <MedicationsView
              medications={history.medications}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
              onClearFilters={handleClearFilters}
              onViewMedication={(medication) => setSelectedMedication(medication)}
            />
          )}

          {activeSection === 'procedures' && (
            <ProceduresView
              procedures={history.procedures}
              onViewProcedure={(procedure) => setSelectedProcedure(procedure)}
            />
          )}

          {activeSection === 'family-social' && (
            <FamilySocialHistoryView
              familyHistory={history.familyHistory}
              socialHistory={history.socialHistory}
            />
          )}

          {activeSection === 'laboratory' && (
            <LaboratoryView
              laboratoryResults={history.laboratoryResults}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
              onViewResult={(result) => setSelectedLaboratory(result)}
            />
          )}

          {activeSection === 'documents' && (
            <DocumentsView
              documents={history.documents}
              onViewDocument={(document) => setSelectedDocument(document)}
            />
          )}
        </div>
      </div>

      {/* Detail Dialogs */}
      {selectedEncounter && (
        <EncounterDetailDialog
          encounter={selectedEncounter}
          onClose={() => setSelectedEncounter(null)}
        />
      )}

      {selectedCondition && (
        <ConditionDetailDialog
          condition={selectedCondition}
          onClose={() => setSelectedCondition(null)}
        />
      )}

      {selectedAllergy && (
        <AllergyDetailDialog
          allergy={selectedAllergy}
          onClose={() => setSelectedAllergy(null)}
        />
      )}

      {selectedMedication && (
        <MedicationDetailDialog
          medication={selectedMedication}
          onClose={() => setSelectedMedication(null)}
        />
      )}

      {selectedProcedure && (
        <ProcedureDetailDialog
          procedure={selectedProcedure}
          onClose={() => setSelectedProcedure(null)}
        />
      )}

      {selectedLaboratory && (
        <LaboratoryDetailDialog
          laboratory={selectedLaboratory}
          onClose={() => setSelectedLaboratory(null)}
        />
      )}

      {selectedDocument && (
        <DocumentDetailDialog
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  )
}
