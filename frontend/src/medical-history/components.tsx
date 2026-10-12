import type {
  PatientMedicalHistory,
  HistorySection,
  HistoryOverview,
  HistoricalEncounter,
  MedicalCondition,
  AllergyRecord,
  MedicationRecord,
  ProcedureRecord,
  FamilyHistoryRecord,
  SocialHistoryRecord,
  LaboratoryRecord,
  ClinicalDocument,
} from './model'
import {
  formatDateTime,
  formatDate,
  formatDateLong,
  getRecordStatusLabel,
  getSeverityLabel,
  getAllergenTypeLabel,
  getLabStatusLabel,
  getRelativeTime,
} from './model'
import Icon from '../Icon'

// Patient History Header
type PatientHistoryHeaderProps = {
  history: PatientMedicalHistory
  onReturn: () => void
}

export function PatientHistoryHeader({ history, onReturn }: PatientHistoryHeaderProps) {
  return (
    <div className="patient-history-header">
      <div className="header-content">
        <button className="return-button" onClick={onReturn}>
          <Icon name="arrow-left" size={16} />
          Return to Clinical Workspace
        </button>

        <div className="patient-identity">
          <div className="patient-primary">
            <h1>Patient Medical History</h1>
            <div className="patient-name">{history.patientName}</div>
          </div>

          <div className="patient-demographics">
            <div className="demographic-item">
              <span className="demographic-label">Patient ID</span>
              <span className="demographic-value">{history.patientId}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Date of Birth</span>
              <span className="demographic-value">{formatDate(history.dateOfBirth)}</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Age</span>
              <span className="demographic-value">{history.age} years</span>
            </div>
            <div className="demographic-item">
              <span className="demographic-label">Sex</span>
              <span className="demographic-value">
                {history.sex === 'not-recorded' ? 'Not recorded' : history.sex}
              </span>
            </div>
            <div className="demographic-item current-encounter">
              <span className="demographic-label">Current Encounter</span>
              <span className="demographic-value">{history.currentEncounterId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// History Navigation Tabs
type HistoryNavigationTabsProps = {
  activeSection: HistorySection
  onSectionChange: (section: HistorySection) => void
  recordCounts: {
    encounters: number
    conditions: number
    allergies: number
    medications: number
    procedures: number
    laboratory: number
    documents: number
    familySocialHistory: number
  }
}

export function HistoryNavigationTabs({
  activeSection,
  onSectionChange,
  recordCounts,
}: HistoryNavigationTabsProps) {
  const tabs: Array<{ id: HistorySection; label: string; icon: string; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'encounters', label: 'Encounters', icon: 'calendar', count: recordCounts.encounters },
    { id: 'conditions', label: 'Medical Conditions', icon: 'file-text', count: recordCounts.conditions },
    { id: 'allergies', label: 'Allergies', icon: 'alert-circle', count: recordCounts.allergies },
    { id: 'medications', label: 'Medications', icon: 'pill', count: recordCounts.medications },
    { id: 'procedures', label: 'Procedures', icon: 'activity', count: recordCounts.procedures },
    { id: 'family-social', label: 'Family & Social History', icon: 'users', count: recordCounts.familySocialHistory },
    { id: 'laboratory', label: 'Laboratory', icon: 'lab', count: recordCounts.laboratory },
    { id: 'documents', label: 'Documents', icon: 'folder', count: recordCounts.documents },
  ]

  return (
    <nav className="history-navigation">
      <div className="nav-title">Medical History</div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeSection === tab.id ? 'active' : ''}`}
          onClick={() => onSectionChange(tab.id)}
        >
          <Icon name={tab.icon} size={18} />
          <span className="nav-tab-label">{tab.label}</span>
          {tab.count !== undefined && (
            <span className="nav-tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </nav>
  )
}

// History Overview Panel
type HistoryOverviewPanelProps = {
  overview: HistoryOverview
  recentEncounters: HistoricalEncounter[]
  activeConditions: MedicalCondition[]
  allergies: AllergyRecord[]
  activeMedications: MedicationRecord[]
  onNavigateToSection: (section: HistorySection) => void
  onViewEncounter: (encounter: HistoricalEncounter) => void
  onViewCondition: (condition: MedicalCondition) => void
  onViewAllergy: (allergy: AllergyRecord) => void
  onViewMedication: (medication: MedicationRecord) => void
}

export function HistoryOverviewPanel({
  overview,
  recentEncounters,
  activeConditions,
  allergies,
  activeMedications,
  onNavigateToSection,
  onViewEncounter,
  onViewCondition,
  onViewAllergy,
  onViewMedication,
}: HistoryOverviewPanelProps) {
  return (
    <div className="history-overview">
      <div className="overview-header">
        <h2>Medical History Overview</h2>
        <p className="overview-subtitle">
          Summary of recorded medical information for this patient
        </p>
      </div>

      <div className="overview-grid">
        {/* Healthcare Encounters */}
        <div className="overview-card">
          <div className="overview-card-header">
            <Icon name="calendar" size={20} />
            <h3>Healthcare Encounters</h3>
          </div>
          <div className="overview-stat">
            <div className="stat-value">{overview.totalEncounters}</div>
            <div className="stat-label">Total Recorded Encounters</div>
          </div>
          {overview.totalEncounters > 0 && (
            <div className="overview-detail">
              Last encounter: {getRelativeTime(overview.lastEncounterDate)}
            </div>
          )}
          <button className="overview-link" onClick={() => onNavigateToSection('encounters')}>
            View encounter timeline <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {/* Medical Conditions */}
        <div className="overview-card">
          <div className="overview-card-header">
            <Icon name="file-text" size={20} />
            <h3>Medical Conditions</h3>
          </div>
          <div className="overview-stat">
            <div className="stat-value">{overview.recordedConditionsCount}</div>
            <div className="stat-label">Documented Conditions</div>
          </div>
          {overview.recordedConditionsCount === 0 && (
            <div className="overview-detail empty">
              No medical conditions have been recorded
            </div>
          )}
          <button className="overview-link" onClick={() => onNavigateToSection('conditions')}>
            View medical conditions <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {/* Allergies */}
        <div className={`overview-card ${allergies.length > 0 ? 'alert' : ''}`}>
          <div className="overview-card-header">
            <Icon name="alert-circle" size={20} />
            <h3>Allergies</h3>
          </div>
          <div className="overview-stat">
            <div className="stat-value">{overview.allergyCount}</div>
            <div className="stat-label">
              {overview.allergyCount === 1 ? 'Documented Allergy' : 'Documented Allergies'}
            </div>
          </div>
          <div className="overview-detail">
            {overview.verifiedAllergies ? (
              <span className="verified">
                <Icon name="check-circle" size={14} /> Allergy information verified
              </span>
            ) : (
              <span className="unverified">
                <Icon name="alert-triangle" size={14} /> Allergy information not verified
              </span>
            )}
          </div>
          <button className="overview-link" onClick={() => onNavigateToSection('allergies')}>
            View allergy details <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {/* Medications */}
        <div className="overview-card">
          <div className="overview-card-header">
            <Icon name="pill" size={20} />
            <h3>Medications</h3>
          </div>
          <div className="overview-stats-row">
            <div className="stat-item">
              <div className="stat-value">{overview.activeMedicationsCount}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{overview.historicalMedicationsCount}</div>
              <div className="stat-label">Historical</div>
            </div>
          </div>
          <button className="overview-link" onClick={() => onNavigateToSection('medications')}>
            View medication history <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {/* Procedures & Surgery */}
        <div className="overview-card">
          <div className="overview-card-header">
            <Icon name="activity" size={20} />
            <h3>Procedures & Surgery</h3>
          </div>
          <div className="overview-stat">
            <div className="stat-value">{overview.proceduresCount}</div>
            <div className="stat-label">Documented Procedures</div>
          </div>
          {overview.proceduresCount === 0 && (
            <div className="overview-detail empty">
              No procedures have been recorded
            </div>
          )}
          <button className="overview-link" onClick={() => onNavigateToSection('procedures')}>
            View procedure history <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {/* Laboratory & Diagnostics */}
        <div className="overview-card">
          <div className="overview-card-header">
            <Icon name="lab" size={20} />
            <h3>Laboratory & Diagnostics</h3>
          </div>
          <div className="overview-stat">
            <div className="stat-value">{overview.recentLabsCount}</div>
            <div className="stat-label">Recent Lab Results</div>
          </div>
          <button className="overview-link" onClick={() => onNavigateToSection('laboratory')}>
            View laboratory results <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>

      {/* Recent Encounters */}
      {recentEncounters.length > 0 && (
        <div className="overview-section">
          <div className="section-header">
            <h3>Recent Encounters</h3>
            <button
              className="view-all-link"
              onClick={() => onNavigateToSection('encounters')}
            >
              View all encounters <Icon name="arrow-right" size={14} />
            </button>
          </div>
          <div className="encounters-list">
            {recentEncounters.map((encounter) => (
              <div key={encounter.id} className="encounter-summary-card">
                <div className="encounter-date">{formatDate(encounter.date)}</div>
                <div className="encounter-type">{encounter.type}</div>
                <div className="encounter-reason">{encounter.reason}</div>
                <div className="encounter-clinician">{encounter.clinician}</div>
                <button
                  className="view-encounter-btn"
                  onClick={() => onViewEncounter(encounter)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Conditions */}
      {activeConditions.length > 0 && (
        <div className="overview-section">
          <div className="section-header">
            <h3>Active Medical Conditions</h3>
            <button
              className="view-all-link"
              onClick={() => onNavigateToSection('conditions')}
            >
              View all conditions <Icon name="arrow-right" size={14} />
            </button>
          </div>
          <div className="conditions-list">
            {activeConditions.map((condition) => (
              <div key={condition.id} className="condition-summary-card">
                <div className="condition-name">{condition.condition}</div>
                <div className="condition-meta">
                  Diagnosed: {formatDate(condition.recordedDate)} · {condition.clinician}
                </div>
                <button
                  className="view-condition-btn"
                  onClick={() => onViewCondition(condition)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documented Allergies */}
      {allergies.length > 0 && (
        <div className="overview-section alert">
          <div className="section-header">
            <h3>
              <Icon name="alert-circle" size={20} />
              Documented Allergies
            </h3>
          </div>
          <div className="allergies-list">
            {allergies.map((allergy) => (
              <div key={allergy.id} className="allergy-summary-card">
                <div className="allergy-allergen">{allergy.allergen}</div>
                <div className="allergy-severity">
                  Severity: {getSeverityLabel(allergy.severity)}
                </div>
                <div className="allergy-reaction">{allergy.reaction}</div>
                <button
                  className="view-allergy-btn"
                  onClick={() => onViewAllergy(allergy)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Medications */}
      {activeMedications.length > 0 && (
        <div className="overview-section">
          <div className="section-header">
            <h3>Current Medications</h3>
            <button
              className="view-all-link"
              onClick={() => onNavigateToSection('medications')}
            >
              View all medications <Icon name="arrow-right" size={14} />
            </button>
          </div>
          <div className="medications-list">
            {activeMedications.map((medication) => (
              <div key={medication.id} className="medication-summary-card">
                <div className="medication-name">
                  {medication.medicationName} {medication.strength}
                </div>
                <div className="medication-dose">{medication.dose} · {medication.frequency}</div>
                <div className="medication-indication">For: {medication.indication}</div>
                <button
                  className="view-medication-btn"
                  onClick={() => onViewMedication(medication)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Encounter Timeline View
type EncounterTimelineViewProps = {
  encounters: HistoricalEncounter[]
  searchQuery: string
  dateRangeFilter: 'all' | '1-month' | '6-months' | '1-year' | '5-years'
  onSearchChange: (query: string) => void
  onDateRangeChange: (range: 'all' | '1-month' | '6-months' | '1-year' | '5-years') => void
  onClearFilters: () => void
  onViewEncounter: (encounter: HistoricalEncounter) => void
}

export function EncounterTimelineView({
  encounters,
  searchQuery,
  dateRangeFilter,
  onSearchChange,
  onDateRangeChange,
  onClearFilters,
  onViewEncounter,
}: EncounterTimelineViewProps) {
  // Filter encounters
  const filteredEncounters = encounters.filter((encounter) => {
    const matchesSearch =
      searchQuery === '' ||
      encounter.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encounter.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encounter.clinician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encounter.department.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (dateRangeFilter === 'all') return true

    const encounterDate = new Date(encounter.date)
    const now = new Date()
    const monthsAgo = {
      '1-month': 1,
      '6-months': 6,
      '1-year': 12,
      '5-years': 60,
    }[dateRangeFilter]

    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo)

    return encounterDate >= cutoffDate
  })

  const hasActiveFilters = searchQuery !== '' || dateRangeFilter !== 'all'

  return (
    <div className="encounter-timeline-view">
      <div className="view-header">
        <h2>Encounter History</h2>
        <p className="view-subtitle">
          Chronological record of previous healthcare visits and consultations
        </p>
      </div>

      <div className="view-controls">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search encounters by type, reason, clinician, or department..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <label htmlFor="date-range-filter">Date Range:</label>
          <select
            id="date-range-filter"
            value={dateRangeFilter}
            onChange={(e) => onDateRangeChange(e.target.value as any)}
          >
            <option value="all">All Time</option>
            <option value="1-month">Last Month</option>
            <option value="6-months">Last 6 Months</option>
            <option value="1-year">Last Year</option>
            <option value="5-years">Last 5 Years</option>
          </select>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              <Icon name="x" size={14} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredEncounters.length === 0 && encounters.length > 0 && (
        <div className="empty-state">
          <Icon name="search" size={48} />
          <h3>No encounters match your filters</h3>
          <p>Try adjusting your search query or date range filter.</p>
          <button className="button" onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {encounters.length === 0 && (
        <div className="empty-state">
          <Icon name="calendar" size={48} />
          <h3>No Previous Encounters Recorded</h3>
          <p>This patient has no documented encounter history in the system.</p>
        </div>
      )}

      {filteredEncounters.length > 0 && (
        <div className="timeline">
          {filteredEncounters.map((encounter) => (
            <div key={encounter.id} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <div className="encounter-date-time">
                    <div className="encounter-date">{formatDate(encounter.date)}</div>
                    <div className="encounter-relative">{getRelativeTime(encounter.date)}</div>
                  </div>
                  <div className={`encounter-status status-${encounter.status}`}>
                    {encounter.status === 'completed' ? 'Completed' : encounter.status === 'cancelled' ? 'Cancelled' : 'No Show'}
                  </div>
                </div>

                <div className="encounter-details">
                  <div className="encounter-type">{encounter.type}</div>
                  <div className="encounter-reason">
                    <Icon name="file-text" size={14} />
                    {encounter.reason}
                  </div>
                  <div className="encounter-provider">
                    <Icon name="user" size={14} />
                    {encounter.clinician} · {encounter.department}
                  </div>
                  <div className="encounter-id">
                    <Icon name="hash" size={14} />
                    {encounter.id}
                  </div>
                </div>

                <div className="encounter-summary">{encounter.summary}</div>

                <div className="encounter-metadata">
                  <span className="metadata-item">
                    {encounter.diagnosesCount} {encounter.diagnosesCount === 1 ? 'diagnosis' : 'diagnoses'}
                  </span>
                  <span className="metadata-item">
                    {encounter.notesCount} clinical {encounter.notesCount === 1 ? 'note' : 'notes'}
                  </span>
                </div>

                <button
                  className="view-encounter-detail-btn"
                  onClick={() => onViewEncounter(encounter)}
                >
                  View Encounter Details
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Medical Conditions View
type MedicalConditionsViewProps = {
  conditions: MedicalCondition[]
  searchQuery: string
  statusFilter: 'all' | 'active' | 'inactive' | 'completed'
  onSearchChange: (query: string) => void
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive' | 'completed') => void
  onClearFilters: () => void
  onViewCondition: (condition: MedicalCondition) => void
}

export function MedicalConditionsView({
  conditions,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
  onViewCondition,
}: MedicalConditionsViewProps) {
  const filteredConditions = conditions.filter((condition) => {
    const matchesSearch =
      searchQuery === '' ||
      condition.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.clinician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.notes.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || condition.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all'

  return (
    <div className="conditions-view">
      <div className="view-header">
        <h2>Medical Conditions</h2>
        <p className="view-subtitle">
          Previously documented medical conditions and diagnoses
        </p>
      </div>

      <div className="view-controls">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search conditions by name, clinician, or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              <Icon name="x" size={14} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredConditions.length === 0 && conditions.length > 0 && (
        <div className="empty-state">
          <Icon name="search" size={48} />
          <h3>No conditions match your filters</h3>
          <p>Try adjusting your search query or status filter.</p>
          <button className="button" onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {conditions.length === 0 && (
        <div className="empty-state">
          <Icon name="file-text" size={48} />
          <h3>No Medical Conditions Recorded</h3>
          <p>No medical conditions have been documented in this patient's history.</p>
        </div>
      )}

      {filteredConditions.length > 0 && (
        <div className="conditions-list">
          {filteredConditions.map((condition) => (
            <div key={condition.id} className="condition-card">
              <div className="condition-header">
                <div className="condition-name">{condition.condition}</div>
                <div className={`condition-status status-${condition.status}`}>
                  {getRecordStatusLabel(condition.status)}
                </div>
              </div>

              <div className="condition-meta">
                <div className="meta-item">
                  <Icon name="calendar" size={14} />
                  Recorded: {formatDate(condition.recordedDate)}
                </div>
                <div className="meta-item">
                  <Icon name="user" size={14} />
                  {condition.clinician}
                </div>
                <div className="meta-item">
                  <Icon name="hash" size={14} />
                  Encounter: {condition.encounterId}
                </div>
                {condition.icdCode && (
                  <div className="meta-item">
                    <Icon name="tag" size={14} />
                    ICD: {condition.icdCode}
                  </div>
                )}
              </div>

              {condition.notes && (
                <div className="condition-notes">{condition.notes}</div>
              )}

              <button
                className="view-detail-btn"
                onClick={() => onViewCondition(condition)}
              >
                View Full Details
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Allergies View
type AllergiesViewProps = {
  allergies: AllergyRecord[]
  onViewAllergy: (allergy: AllergyRecord) => void
}

export function AllergiesView({ allergies, onViewAllergy }: AllergiesViewProps) {
  return (
    <div className="allergies-view">
      <div className="view-header">
        <h2>
          <Icon name="alert-circle" size={24} />
          Allergy Information
        </h2>
        <p className="view-subtitle">
          Documented allergies and adverse reactions for this patient
        </p>
      </div>

      {allergies.length === 0 && (
        <div className="allergy-empty-state">
          <Icon name="check-circle" size={48} />
          <h3>No Documented Allergies</h3>
          <p>
            No allergies have been documented in this patient's medical history.
            This does not confirm the absence of allergies—allergy information may
            not have been recorded or verified.
          </p>
        </div>
      )}

      {allergies.length > 0 && (
        <div className="allergies-list">
          {allergies.map((allergy) => (
            <div key={allergy.id} className={`allergy-card severity-${allergy.severity}`}>
              <div className="allergy-header">
                <div className="allergy-main">
                  <Icon name="alert-triangle" size={20} />
                  <div className="allergy-allergen">{allergy.allergen}</div>
                </div>
                <div className={`allergy-severity severity-${allergy.severity}`}>
                  {getSeverityLabel(allergy.severity)}
                </div>
              </div>

              <div className="allergy-type">
                {getAllergenTypeLabel(allergy.allergenType)} Allergy
              </div>

              <div className="allergy-reaction">
                <strong>Reaction:</strong> {allergy.reaction}
              </div>

              <div className="allergy-meta">
                <div className="meta-item">
                  <Icon name="calendar" size={14} />
                  Recorded: {formatDate(allergy.recordedDate)}
                </div>
                <div className="meta-item">
                  <Icon name="refresh-cw" size={14} />
                  Last reviewed: {formatDate(allergy.lastReviewedDate)}
                </div>
                <div className="meta-item">
                  <Icon name="user" size={14} />
                  {allergy.clinician}
                </div>
                <div className="meta-item">
                  <Icon 
                    name={allergy.verificationStatus === 'verified' ? 'check-circle' : 'alert-circle'} 
                    size={14} 
                  />
                  {allergy.verificationStatus === 'verified' ? 'Verified' : 'Not Verified'}
                </div>
              </div>

              {allergy.notes && (
                <div className="allergy-notes">{allergy.notes}</div>
              )}

              <button
                className="view-detail-btn"
                onClick={() => onViewAllergy(allergy)}
              >
                View Full Details
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Medications View
type MedicationsViewProps = {
  medications: MedicationRecord[]
  searchQuery: string
  statusFilter: 'all' | 'active' | 'inactive' | 'completed'
  onSearchChange: (query: string) => void
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive' | 'completed') => void
  onClearFilters: () => void
  onViewMedication: (medication: MedicationRecord) => void
}

export function MedicationsView({
  medications,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
  onViewMedication,
}: MedicationsViewProps) {
  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      searchQuery === '' ||
      med.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.prescriber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || med.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all'

  return (
    <div className="medications-view">
      <div className="view-header">
        <h2>Medication History</h2>
        <p className="view-subtitle">
          Previously prescribed medications and prescriptions
        </p>
      </div>

      <div className="view-controls">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search medications by name, indication, or prescriber..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <label htmlFor="med-status-filter">Status:</label>
          <select
            id="med-status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              <Icon name="x" size={14} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredMedications.length === 0 && medications.length > 0 && (
        <div className="empty-state">
          <Icon name="search" size={48} />
          <h3>No medications match your filters</h3>
          <p>Try adjusting your search query or status filter.</p>
          <button className="button" onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {medications.length === 0 && (
        <div className="empty-state">
          <Icon name="pill" size={48} />
          <h3>No Medication History</h3>
          <p>No medications have been prescribed or documented for this patient.</p>
        </div>
      )}

      {filteredMedications.length > 0 && (
        <div className="medications-list">
          {filteredMedications.map((medication) => (
            <div key={medication.id} className="medication-card">
              <div className="medication-header">
                <div className="medication-name">
                  {medication.medicationName} {medication.strength}
                </div>
                <div className={`medication-status status-${medication.status}`}>
                  {getRecordStatusLabel(medication.status)}
                </div>
              </div>

              <div className="medication-dosing">
                <div className="dosing-item">
                  <strong>Dose:</strong> {medication.dose}
                </div>
                <div className="dosing-item">
                  <strong>Frequency:</strong> {medication.frequency}
                </div>
                <div className="dosing-item">
                  <strong>Route:</strong> {medication.route}
                </div>
              </div>

              <div className="medication-indication">
                <Icon name="target" size={14} />
                <strong>Indication:</strong> {medication.indication}
              </div>

              <div className="medication-meta">
                <div className="meta-item">
                  <Icon name="calendar" size={14} />
                  Prescribed: {formatDate(medication.prescriptionDate)}
                </div>
                {medication.endDate && (
                  <div className="meta-item">
                    <Icon name="calendar" size={14} />
                    Ended: {formatDate(medication.endDate)}
                  </div>
                )}
                <div className="meta-item">
                  <Icon name="user" size={14} />
                  {medication.prescriber}
                </div>
                <div className="meta-item">
                  <Icon name="hash" size={14} />
                  Encounter: {medication.encounterId}
                </div>
              </div>

              {medication.instructions && (
                <div className="medication-instructions">
                  <strong>Instructions:</strong> {medication.instructions}
                </div>
              )}

              <button
                className="view-detail-btn"
                onClick={() => onViewMedication(medication)}
              >
                View Full Details
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Continue in next message due to length...

// Procedures View
type ProceduresViewProps = {
  procedures: ProcedureRecord[]
  onViewProcedure: (procedure: ProcedureRecord) => void
}

export function ProceduresView({ procedures, onViewProcedure }: ProceduresViewProps) {
  return (
    <div className="procedures-view">
      <div className="view-header">
        <h2>Procedures & Surgery History</h2>
        <p className="view-subtitle">
          Documented procedures and surgical interventions
        </p>
      </div>

      {procedures.length === 0 && (
        <div className="empty-state">
          <Icon name="activity" size={48} />
          <h3>No Procedures Recorded</h3>
          <p>
            No procedures or surgical history has been documented for this patient.
            This does not confirm the absence of previous procedures.
          </p>
        </div>
      )}

      {procedures.length > 0 && (
        <div className="procedures-list">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="procedure-card">
              <div className="procedure-header">
                <div className="procedure-name">{procedure.procedureName}</div>
                <div className="procedure-date">{formatDate(procedure.procedureDate)}</div>
              </div>

              <div className="procedure-meta">
                <div className="meta-item">
                  <Icon name="user" size={14} />
                  Performed by: {procedure.performedBy}
                </div>
                <div className="meta-item">
                  <Icon name="map-pin" size={14} />
                  {procedure.facility}
                </div>
                <div className="meta-item">
                  <Icon name="hash" size={14} />
                  Encounter: {procedure.encounterId}
                </div>
              </div>

              {procedure.notes && (
                <div className="procedure-notes">
                  <strong>Procedure Notes:</strong> {procedure.notes}
                </div>
              )}

              {procedure.outcome && (
                <div className="procedure-outcome">
                  <strong>Outcome:</strong> {procedure.outcome}
                </div>
              )}

              <button
                className="view-detail-btn"
                onClick={() => onViewProcedure(procedure)}
              >
                View Full Details
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Family & Social History View
type FamilySocialHistoryViewProps = {
  familyHistory: FamilyHistoryRecord[]
  socialHistory: SocialHistoryRecord[]
}

export function FamilySocialHistoryView({
  familyHistory,
  socialHistory,
}: FamilySocialHistoryViewProps) {
  return (
    <div className="family-social-view">
      <div className="view-header">
        <h2>Family & Social History</h2>
        <p className="view-subtitle">
          Family medical history and social history information
        </p>
      </div>

      {/* Family History */}
      <div className="history-subsection">
        <h3>
          <Icon name="users" size={20} />
          Family Medical History
        </h3>

        {familyHistory.length === 0 && (
          <div className="subsection-empty">
            <p>No family medical history has been recorded for this patient.</p>
          </div>
        )}

        {familyHistory.length > 0 && (
          <div className="family-history-list">
            {familyHistory.map((record) => (
              <div key={record.id} className="family-history-card">
                <div className="family-member">
                  <strong>{record.relationship}</strong> · {record.condition}
                </div>
                {record.ageAtDiagnosis && (
                  <div className="family-detail">
                    Diagnosed at age {record.ageAtDiagnosis}
                  </div>
                )}
                {record.ageAtDeath && (
                  <div className="family-detail">
                    Deceased at age {record.ageAtDeath}
                  </div>
                )}
                {record.notes && (
                  <div className="family-notes">{record.notes}</div>
                )}
                <div className="record-meta">
                  Recorded: {formatDate(record.recordedDate)} by {record.clinician}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social History */}
      <div className="history-subsection">
        <h3>
          <Icon name="home" size={20} />
          Social History
        </h3>

        {socialHistory.length === 0 && (
          <div className="subsection-empty">
            <p>No social history has been recorded for this patient.</p>
          </div>
        )}

        {socialHistory.length > 0 && (
          <div className="social-history-list">
            {socialHistory.map((record, index) => (
              <div key={index} className="social-history-card">
                <div className="social-category">
                  {record.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div className="social-status">
                  <strong>Status:</strong> {record.status}
                </div>
                <div className="social-details">{record.details}</div>
                <div className="record-meta">
                  Recorded: {formatDate(record.recordedDate)} · Last updated: {formatDate(record.lastUpdated)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Laboratory View
type LaboratoryViewProps = {
  laboratoryResults: LaboratoryRecord[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearFilters: () => void
  onViewResult: (result: LaboratoryRecord) => void
}

export function LaboratoryView({
  laboratoryResults,
  searchQuery,
  onSearchChange,
  onClearFilters,
  onViewResult,
}: LaboratoryViewProps) {
  const filteredResults = laboratoryResults.filter((result) =>
    searchQuery === '' ||
    result.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.orderingClinician.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.resultSummary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasActiveFilters = searchQuery !== ''

  return (
    <div className="laboratory-view">
      <div className="view-header">
        <h2>Laboratory & Diagnostic Results</h2>
        <p className="view-subtitle">
          Historical laboratory test results and diagnostic reports
        </p>
      </div>

      <div className="view-controls">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search laboratory tests by name or clinician..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <div className="filter-controls">
            <button className="clear-filters-btn" onClick={onClearFilters}>
              <Icon name="x" size={14} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {filteredResults.length === 0 && laboratoryResults.length > 0 && (
        <div className="empty-state">
          <Icon name="search" size={48} />
          <h3>No results match your search</h3>
          <p>Try adjusting your search query.</p>
          <button className="button" onClick={onClearFilters}>
            Clear Search
          </button>
        </div>
      )}

      {laboratoryResults.length === 0 && (
        <div className="empty-state">
          <Icon name="lab" size={48} />
          <h3>No Laboratory Results</h3>
          <p>No laboratory tests or results have been recorded for this patient.</p>
        </div>
      )}

      {filteredResults.length > 0 && (
        <div className="laboratory-list">
          {filteredResults.map((result) => (
            <div key={result.id} className={`laboratory-card ${result.abnormalFlag ? 'abnormal' : ''}`}>
              <div className="lab-header">
                <div className="lab-test-name">{result.testName}</div>
                <div className={`lab-status status-${result.status}`}>
                  {getLabStatusLabel(result.status)}
                </div>
              </div>

              {result.abnormalFlag && (
                <div className="lab-abnormal-flag">
                  <Icon name="alert-circle" size={14} />
                  Abnormal result
                </div>
              )}

              <div className="lab-dates">
                <div className="date-item">
                  <Icon name="calendar" size={14} />
                  Ordered: {formatDate(result.orderedDate)}
                </div>
                {result.collectedDate && (
                  <div className="date-item">
                    <Icon name="droplet" size={14} />
                    Collected: {formatDate(result.collectedDate)}
                  </div>
                )}
                {result.resultDate && (
                  <div className="date-item">
                    <Icon name="check-circle" size={14} />
                    Result: {formatDate(result.resultDate)}
                  </div>
                )}
              </div>

              <div className="lab-meta">
                <div className="meta-item">
                  <Icon name="user" size={14} />
                  Ordered by: {result.orderingClinician}
                </div>
                <div className="meta-item">
                  <Icon name="hash" size={14} />
                  Encounter: {result.encounterId}
                </div>
              </div>

              {result.resultSummary && result.status === 'completed' && (
                <div className="lab-result-summary">
                  <strong>Result Summary:</strong> {result.resultSummary}
                </div>
              )}

              <button
                className="view-detail-btn"
                onClick={() => onViewResult(result)}
              >
                View Full Results
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Documents View
type DocumentsViewProps = {
  documents: ClinicalDocument[]
  onViewDocument: (document: ClinicalDocument) => void
}

export function DocumentsView({ documents, onViewDocument }: DocumentsViewProps) {
  return (
    <div className="documents-view">
      <div className="view-header">
        <h2>Clinical Documents</h2>
        <p className="view-subtitle">
          Uploaded reports, imaging results, and clinical documents
        </p>
      </div>

      {documents.length === 0 && (
        <div className="empty-state">
          <Icon name="folder" size={48} />
          <h3>No Documents Available</h3>
          <p>No clinical documents have been uploaded for this patient.</p>
        </div>
      )}

      {documents.length > 0 && (
        <div className="documents-list">
          {documents.map((document) => (
            <div key={document.id} className="document-card">
              <div className="document-icon">
                <Icon name="file-text" size={32} />
              </div>
              <div className="document-details">
                <div className="document-title">{document.title}</div>
                <div className="document-type">{document.documentType}</div>
                <div className="document-meta">
                  <div className="meta-item">
                    <Icon name="calendar" size={14} />
                    Uploaded: {formatDate(document.uploadedDate)}
                  </div>
                  <div className="meta-item">
                    <Icon name="user" size={14} />
                    By: {document.uploadedBy}
                  </div>
                  {document.relatedEncounterId && (
                    <div className="meta-item">
                      <Icon name="hash" size={14} />
                      Encounter: {document.relatedEncounterId}
                    </div>
                  )}
                  <div className="meta-item">
                    <Icon name="file" size={14} />
                    {document.fileSize} · {document.format}
                  </div>
                </div>
              </div>
              <button
                className="view-document-btn"
                onClick={() => onViewDocument(document)}
              >
                <Icon name="eye" size={16} />
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Detail Dialogs

// Encounter Detail Dialog
type EncounterDetailDialogProps = {
  encounter: HistoricalEncounter
  onClose: () => void
}

export function EncounterDetailDialog({ encounter, onClose }: EncounterDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Encounter Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Encounter ID</div>
            <div className="detail-value">{encounter.id}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Date & Time</div>
            <div className="detail-value">{formatDateTime(encounter.date)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Visit Type</div>
            <div className="detail-value">{encounter.type}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Reason for Visit</div>
            <div className="detail-value">{encounter.reason}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Clinician</div>
            <div className="detail-value">{encounter.clinician}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Department</div>
            <div className="detail-value">{encounter.department}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <span className={`status-badge status-${encounter.status}`}>
                {encounter.status === 'completed' ? 'Completed' : encounter.status === 'cancelled' ? 'Cancelled' : 'No Show'}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Clinical Summary</div>
            <div className="detail-value">{encounter.summary}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Associated Records</div>
            <div className="detail-value">
              {encounter.diagnosesCount} {encounter.diagnosesCount === 1 ? 'diagnosis' : 'diagnoses'} · {' '}
              {encounter.notesCount} clinical {encounter.notesCount === 1 ? 'note' : 'notes'}
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Condition Detail Dialog
type ConditionDetailDialogProps = {
  condition: MedicalCondition
  onClose: () => void
}

export function ConditionDetailDialog({ condition, onClose }: ConditionDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Medical Condition Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Condition</div>
            <div className="detail-value">{condition.condition}</div>
          </div>

          {condition.icdCode && (
            <div className="detail-section">
              <div className="detail-label">ICD Code</div>
              <div className="detail-value">{condition.icdCode}</div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <span className={`status-badge status-${condition.status}`}>
                {getRecordStatusLabel(condition.status)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Recorded Date</div>
            <div className="detail-value">{formatDateLong(condition.recordedDate)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Recording Clinician</div>
            <div className="detail-value">{condition.clinician}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Associated Encounter</div>
            <div className="detail-value">
              {condition.encounterId} · {formatDate(condition.encounterDate)}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Clinical Notes</div>
            <div className="detail-value">{condition.notes}</div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Allergy Detail Dialog
type AllergyDetailDialogProps = {
  allergy: AllergyRecord
  onClose: () => void
}

export function AllergyDetailDialog({ allergy, onClose }: AllergyDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content allergy-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header alert">
          <Icon name="alert-triangle" size={24} />
          <h2>Allergy Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Allergen</div>
            <div className="detail-value">{allergy.allergen}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Allergen Type</div>
            <div className="detail-value">{getAllergenTypeLabel(allergy.allergenType)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Severity</div>
            <div className="detail-value">
              <span className={`severity-badge severity-${allergy.severity}`}>
                {getSeverityLabel(allergy.severity)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Reaction</div>
            <div className="detail-value">{allergy.reaction}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Recorded Date</div>
            <div className="detail-value">{formatDateLong(allergy.recordedDate)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Last Reviewed</div>
            <div className="detail-value">{formatDateLong(allergy.lastReviewedDate)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Verification Status</div>
            <div className="detail-value">
              {allergy.verificationStatus === 'verified' ? (
                <span className="verified-badge">
                  <Icon name="check-circle" size={16} /> Verified
                </span>
              ) : (
                <span className="unverified-badge">
                  <Icon name="alert-circle" size={16} /> Not Verified
                </span>
              )}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Recording Clinician</div>
            <div className="detail-value">{allergy.clinician}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Clinical Notes</div>
            <div className="detail-value">{allergy.notes}</div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Medication Detail Dialog
type MedicationDetailDialogProps = {
  medication: MedicationRecord
  onClose: () => void
}

export function MedicationDetailDialog({ medication, onClose }: MedicationDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Medication Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Medication</div>
            <div className="detail-value">
              {medication.medicationName} {medication.strength}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Formulation</div>
            <div className="detail-value">{medication.formulation}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <span className={`status-badge status-${medication.status}`}>
                {getRecordStatusLabel(medication.status)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Dose</div>
            <div className="detail-value">{medication.dose}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Frequency</div>
            <div className="detail-value">{medication.frequency}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Route</div>
            <div className="detail-value">{medication.route}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Indication</div>
            <div className="detail-value">{medication.indication}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Prescription Date</div>
            <div className="detail-value">{formatDateLong(medication.prescriptionDate)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Start Date</div>
            <div className="detail-value">{formatDateLong(medication.startDate)}</div>
          </div>

          {medication.endDate && (
            <div className="detail-section">
              <div className="detail-label">End Date</div>
              <div className="detail-value">{formatDateLong(medication.endDate)}</div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-label">Prescriber</div>
            <div className="detail-value">{medication.prescriber}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Associated Encounter</div>
            <div className="detail-value">{medication.encounterId}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Instructions</div>
            <div className="detail-value">{medication.instructions}</div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Procedure Detail Dialog
type ProcedureDetailDialogProps = {
  procedure: ProcedureRecord
  onClose: () => void
}

export function ProcedureDetailDialog({ procedure, onClose }: ProcedureDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Procedure Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Procedure</div>
            <div className="detail-value">{procedure.procedureName}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Procedure Date</div>
            <div className="detail-value">{formatDateLong(procedure.procedureDate)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Performed By</div>
            <div className="detail-value">{procedure.performedBy}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Facility</div>
            <div className="detail-value">{procedure.facility}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Associated Encounter</div>
            <div className="detail-value">{procedure.encounterId}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Procedure Notes</div>
            <div className="detail-value">{procedure.notes}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Outcome</div>
            <div className="detail-value">{procedure.outcome}</div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Laboratory Detail Dialog
type LaboratoryDetailDialogProps = {
  laboratory: LaboratoryRecord
  onClose: () => void
}

export function LaboratoryDetailDialog({ laboratory, onClose }: LaboratoryDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Laboratory Result Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Test Name</div>
            <div className="detail-value">{laboratory.testName}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <span className={`status-badge status-${laboratory.status}`}>
                {getLabStatusLabel(laboratory.status)}
              </span>
            </div>
          </div>

          {laboratory.abnormalFlag && (
            <div className="detail-section alert">
              <div className="detail-label">Result Flag</div>
              <div className="detail-value">
                <Icon name="alert-circle" size={16} /> Abnormal Result
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-label">Ordered Date</div>
            <div className="detail-value">{formatDateLong(laboratory.orderedDate)}</div>
          </div>

          {laboratory.collectedDate && (
            <div className="detail-section">
              <div className="detail-label">Collection Date</div>
              <div className="detail-value">{formatDateLong(laboratory.collectedDate)}</div>
            </div>
          )}

          {laboratory.resultDate && (
            <div className="detail-section">
              <div className="detail-label">Result Date</div>
              <div className="detail-value">{formatDateLong(laboratory.resultDate)}</div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-label">Ordering Clinician</div>
            <div className="detail-value">{laboratory.orderingClinician}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Associated Encounter</div>
            <div className="detail-value">{laboratory.encounterId}</div>
          </div>

          {laboratory.resultSummary && (
            <div className="detail-section">
              <div className="detail-label">Result Summary</div>
              <div className="detail-value">{laboratory.resultSummary}</div>
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Document Detail Dialog
type DocumentDetailDialogProps = {
  document: ClinicalDocument
  onClose: () => void
}

export function DocumentDetailDialog({ document, onClose }: DocumentDetailDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Document Details</h2>
          <button className="dialog-close" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="detail-section">
            <div className="detail-label">Document Title</div>
            <div className="detail-value">{document.title}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Document Type</div>
            <div className="detail-value">{document.documentType}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Upload Date</div>
            <div className="detail-value">{formatDateLong(document.uploadedDate)}</div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Uploaded By</div>
            <div className="detail-value">{document.uploadedBy}</div>
          </div>

          {document.relatedEncounterId && (
            <div className="detail-section">
              <div className="detail-label">Related Encounter</div>
              <div className="detail-value">{document.relatedEncounterId}</div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-label">File Information</div>
            <div className="detail-value">
              {document.format} · {document.fileSize}
            </div>
          </div>

          <div className="document-preview-notice">
            <Icon name="info" size={16} />
            <p>
              Document preview is not available in this demonstration version.
              In production, the full document would be displayed here.
            </p>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="button" onClick={onClose}>
            <Icon name="download" size={16} />
            Download Document (Demo)
          </button>
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
