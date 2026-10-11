import { useCallback, useEffect, useState } from 'react'
import type { TriageAssessment, TriageStatus, Priority, TriageDraft, PatientContext } from './model'
import {
  sampleTriageAssessments,
  triageStatusLabel,
  priorityLabel,
  calculateWaitTime,
  timeDisplay,
  dateDisplay,
  filterTriageQueue,
  emptyTriageDraft,
  validateTriageDraft,
  hasUnsavedChanges,
} from './model'
import {
  NurseSummaryCards,
  TriageQueueTable,
  PatientSummaryPanel,
  QuickTriageDialog,
  RecentActivityPanel,
  UnsavedChangesDialog,
} from './components'
import Icon from '../Icon'
import './nurse.css'

type NurseDashboardPageProps = {
  state: 'loading' | 'error' | 'ready'
  permissions: Set<string>
  onNavigate: (target: string) => void
  onReady: () => void
}

export default function NurseDashboardPage({
  state,
  permissions,
  onNavigate,
  onReady,
}: NurseDashboardPageProps) {
  const [assessments, setAssessments] = useState<TriageAssessment[]>(sampleTriageAssessments)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TriageStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [selectedPatient, setSelectedPatient] = useState<PatientContext | null>(null)
  const [showTriage, setShowTriage] = useState(false)
  const [triageDraft, setTriageDraft] = useState<TriageDraft>(emptyTriageDraft)
  const [triageErrors, setTriageErrors] = useState<Record<string, string>>({})
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (state === 'ready') onReady()
  }, [state, onReady])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const filtered = filterTriageQueue(assessments, search, statusFilter, priorityFilter)

  const summary = {
    waitingForTriage: assessments.filter((a) => a.status === 'waiting-for-triage').length,
    inAssessment: assessments.filter((a) => a.status === 'in-assessment').length,
    assessmentCompleted: assessments.filter((a) => a.status === 'assessment-completed').length,
    needsReview: assessments.filter((a) => a.status === 'needs-review').length + assessments.filter((a) => a.status === 'urgent-escalation').length,
  }

  const handleStartTriage = useCallback((assessment: TriageAssessment) => {
    if (hasUnsavedChanges(triageDraft)) {
      setPendingAction(() => () => {
        setCurrentAssessmentId(assessment.id)
        setTriageDraft({
          ...emptyTriageDraft,
          patientId: assessment.patientId,
          encounterId: assessment.encounterId,
          chiefComplaint: assessment.chiefComplaint,
          symptomDescription: assessment.symptomDescription,
        })
        setTriageErrors({})
        setShowTriage(true)
        
        setAssessments((prev) =>
          prev.map((a) =>
            a.id === assessment.id
              ? {
                  ...a,
                  status: 'in-assessment',
                  assignedNurse: 'Nurse Demo',
                  assessmentStartTime: new Date().toISOString(),
                  lastModified: new Date().toISOString(),
                }
              : a
          )
        )
      })
      setShowUnsavedWarning(true)
      return
    }

    setCurrentAssessmentId(assessment.id)
    setTriageDraft({
      ...emptyTriageDraft,
      patientId: assessment.patientId,
      encounterId: assessment.encounterId,
      chiefComplaint: assessment.chiefComplaint,
      symptomDescription: assessment.symptomDescription,
    })
    setTriageErrors({})
    setShowTriage(true)
    
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessment.id
          ? {
              ...a,
              status: 'in-assessment',
              assignedNurse: 'Nurse Demo',
              assessmentStartTime: new Date().toISOString(),
              lastModified: new Date().toISOString(),
            }
          : a
      )
    )
  }, [triageDraft])

  const handleResumeTriage = useCallback((assessment: TriageAssessment) => {
    if (hasUnsavedChanges(triageDraft)) {
      setPendingAction(() => () => {
        setCurrentAssessmentId(assessment.id)
        setTriageDraft({
          patientId: assessment.patientId,
          encounterId: assessment.encounterId,
          chiefComplaint: assessment.chiefComplaint,
          symptomDescription: assessment.symptomDescription,
          bloodPressureSystolic: assessment.vitalSigns?.bloodPressureSystolic?.toString() ?? '',
          bloodPressureDiastolic: assessment.vitalSigns?.bloodPressureDiastolic?.toString() ?? '',
          heartRate: assessment.vitalSigns?.heartRate?.toString() ?? '',
          temperature: assessment.vitalSigns?.temperature?.toString() ?? '',
          temperatureUnit: assessment.vitalSigns?.temperatureUnit ?? 'celsius',
          respiratoryRate: assessment.vitalSigns?.respiratoryRate?.toString() ?? '',
          oxygenSaturation: assessment.vitalSigns?.oxygenSaturation?.toString() ?? '',
          weight: assessment.vitalSigns?.weight?.toString() ?? '',
          height: assessment.vitalSigns?.height?.toString() ?? '',
          painScore: assessment.vitalSigns?.painScore?.toString() ?? '',
          allergies: assessment.allergies.join(', '),
          existingConditions: assessment.existingConditions.join(', '),
          initialObservations: assessment.initialObservations,
          clinicalNotes: assessment.clinicalNotes,
        })
        setTriageErrors({})
        setShowTriage(true)
      })
      setShowUnsavedWarning(true)
      return
    }

    setCurrentAssessmentId(assessment.id)
    setTriageDraft({
      patientId: assessment.patientId,
      encounterId: assessment.encounterId,
      chiefComplaint: assessment.chiefComplaint,
      symptomDescription: assessment.symptomDescription,
      bloodPressureSystolic: assessment.vitalSigns?.bloodPressureSystolic?.toString() ?? '',
      bloodPressureDiastolic: assessment.vitalSigns?.bloodPressureDiastolic?.toString() ?? '',
      heartRate: assessment.vitalSigns?.heartRate?.toString() ?? '',
      temperature: assessment.vitalSigns?.temperature?.toString() ?? '',
      temperatureUnit: assessment.vitalSigns?.temperatureUnit ?? 'celsius',
      respiratoryRate: assessment.vitalSigns?.respiratoryRate?.toString() ?? '',
      oxygenSaturation: assessment.vitalSigns?.oxygenSaturation?.toString() ?? '',
      weight: assessment.vitalSigns?.weight?.toString() ?? '',
      height: assessment.vitalSigns?.height?.toString() ?? '',
      painScore: assessment.vitalSigns?.painScore?.toString() ?? '',
      allergies: assessment.allergies.join(', '),
      existingConditions: assessment.existingConditions.join(', '),
      initialObservations: assessment.initialObservations,
      clinicalNotes: assessment.clinicalNotes,
    })
    setTriageErrors({})
    setShowTriage(true)
  }, [triageDraft])

  const handleViewAssessment = useCallback((assessment: TriageAssessment) => {
    const patient: PatientContext = {
      id: assessment.patientId,
      name: assessment.patientName,
      age: null,
      dateOfBirth: null,
      sex: 'not-recorded',
      contactPhone: '',
      encounterId: assessment.encounterId,
      arrivalTime: assessment.arrivalTime,
      chiefComplaint: assessment.chiefComplaint,
      knownAllergies: assessment.allergies,
      existingConditions: assessment.existingConditions,
      recentVitals: assessment.vitalSigns,
      triageStatus: assessment.status,
    }
    setSelectedPatient(patient)
  }, [])

  const handleSaveDraft = useCallback(() => {
    const errors = validateTriageDraft(triageDraft)
    if (Object.keys(errors).length > 0) {
      setTriageErrors(errors)
      return
    }

    if (!currentAssessmentId) return

    setAssessments((prev) =>
      prev.map((a) =>
        a.id === currentAssessmentId
          ? {
              ...a,
              chiefComplaint: triageDraft.chiefComplaint,
              symptomDescription: triageDraft.symptomDescription,
              allergies: triageDraft.allergies.split(',').map((s) => s.trim()).filter(Boolean),
              existingConditions: triageDraft.existingConditions.split(',').map((s) => s.trim()).filter(Boolean),
              initialObservations: triageDraft.initialObservations,
              clinicalNotes: triageDraft.clinicalNotes,
              vitalSigns: {
                bloodPressureSystolic: triageDraft.bloodPressureSystolic ? Number(triageDraft.bloodPressureSystolic) : null,
                bloodPressureDiastolic: triageDraft.bloodPressureDiastolic ? Number(triageDraft.bloodPressureDiastolic) : null,
                heartRate: triageDraft.heartRate ? Number(triageDraft.heartRate) : null,
                temperature: triageDraft.temperature ? Number(triageDraft.temperature) : null,
                temperatureUnit: triageDraft.temperatureUnit,
                respiratoryRate: triageDraft.respiratoryRate ? Number(triageDraft.respiratoryRate) : null,
                oxygenSaturation: triageDraft.oxygenSaturation ? Number(triageDraft.oxygenSaturation) : null,
                weight: triageDraft.weight ? Number(triageDraft.weight) : null,
                height: triageDraft.height ? Number(triageDraft.height) : null,
                painScore: triageDraft.painScore ? Number(triageDraft.painScore) : null,
                recordedAt: new Date().toISOString(),
                recordedBy: 'Nurse Demo',
              },
              lastModified: new Date().toISOString(),
            }
          : a
      )
    )

    alert('Assessment draft saved successfully')
  }, [triageDraft, currentAssessmentId])

  const handleCompleteAssessment = useCallback(() => {
    const errors = validateTriageDraft(triageDraft)
    if (Object.keys(errors).length > 0) {
      setTriageErrors(errors)
      return
    }

    if (!currentAssessmentId) return

    setAssessments((prev) =>
      prev.map((a) =>
        a.id === currentAssessmentId
          ? {
              ...a,
              chiefComplaint: triageDraft.chiefComplaint,
              symptomDescription: triageDraft.symptomDescription,
              allergies: triageDraft.allergies.split(',').map((s) => s.trim()).filter(Boolean),
              existingConditions: triageDraft.existingConditions.split(',').map((s) => s.trim()).filter(Boolean),
              initialObservations: triageDraft.initialObservations,
              clinicalNotes: triageDraft.clinicalNotes,
              vitalSigns: {
                bloodPressureSystolic: triageDraft.bloodPressureSystolic ? Number(triageDraft.bloodPressureSystolic) : null,
                bloodPressureDiastolic: triageDraft.bloodPressureDiastolic ? Number(triageDraft.bloodPressureDiastolic) : null,
                heartRate: triageDraft.heartRate ? Number(triageDraft.heartRate) : null,
                temperature: triageDraft.temperature ? Number(triageDraft.temperature) : null,
                temperatureUnit: triageDraft.temperatureUnit,
                respiratoryRate: triageDraft.respiratoryRate ? Number(triageDraft.respiratoryRate) : null,
                oxygenSaturation: triageDraft.oxygenSaturation ? Number(triageDraft.oxygenSaturation) : null,
                weight: triageDraft.weight ? Number(triageDraft.weight) : null,
                height: triageDraft.height ? Number(triageDraft.height) : null,
                painScore: triageDraft.painScore ? Number(triageDraft.painScore) : null,
                recordedAt: new Date().toISOString(),
                recordedBy: 'Nurse Demo',
              },
              status: 'assessment-completed',
              assessmentCompletedTime: new Date().toISOString(),
              lastModified: new Date().toISOString(),
            }
          : a
      )
    )

    setShowTriage(false)
    setTriageDraft(emptyTriageDraft)
    setCurrentAssessmentId(null)
    alert('Assessment completed successfully')
  }, [triageDraft, currentAssessmentId])

  const handleCancelTriage = useCallback(() => {
    if (hasUnsavedChanges(triageDraft)) {
      setPendingAction(() => () => {
        setShowTriage(false)
        setTriageDraft(emptyTriageDraft)
        setTriageErrors({})
        setCurrentAssessmentId(null)
      })
      setShowUnsavedWarning(true)
      return
    }

    setShowTriage(false)
    setTriageDraft(emptyTriageDraft)
    setTriageErrors({})
    setCurrentAssessmentId(null)
  }, [triageDraft])

  const handleConfirmDiscard = useCallback(() => {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
    setShowUnsavedWarning(false)
    setTriageDraft(emptyTriageDraft)
    setTriageErrors({})
  }, [pendingAction])

  const handleCancelDiscard = useCallback(() => {
    setShowUnsavedWarning(false)
    setPendingAction(null)
  }, [])

  if (state === 'loading') {
    return (
      <div className="nurse-dashboard-loading">
        <div className="spinner" />
        <p>Loading nurse dashboard…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="nurse-dashboard-error">
        <Icon name="alert-circle" size={48} />
        <h2>Unable to load dashboard</h2>
        <p>There was an error loading the nurse dashboard. Please try again.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload dashboard
        </button>
      </div>
    )
  }

  const nextPatient = assessments.find((a) => a.status === 'waiting-for-triage')

  return (
    <div className="nurse-dashboard">
      <div className="nurse-dashboard-header">
        <div className="nurse-dashboard-header-content">
          <div>
            <h1>Nurse Dashboard</h1>
            <p className="nurse-dashboard-subtitle">
              Monitor patient flow, complete nursing assessments, and prioritize care.
            </p>
          </div>
          <div className="nurse-dashboard-header-actions">
            <span className="nurse-dashboard-date">
              {dateDisplay(currentTime.toISOString())}
            </span>
            <button
              className="button"
              onClick={() => nextPatient && handleStartTriage(nextPatient)}
              disabled={!nextPatient}
            >
              <Icon name="clipboard" size={16} />
              {nextPatient ? 'Assess next patient' : 'No patients waiting'}
            </button>
            <button
              className="button secondary"
              onClick={() => onNavigate('queue')}
            >
              View patient queue
            </button>
          </div>
        </div>
      </div>

      <div className="nurse-dashboard-content">
        <NurseSummaryCards summary={summary} />

        <div className="nurse-dashboard-workspace">
          <div className="nurse-dashboard-main">
            <div className="nurse-dashboard-controls">
              <div className="search-input-wrapper">
                <Icon name="search" size={16} />
                <input
                  type="text"
                  placeholder="Search patients by name, ID, or complaint…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="nurse-dashboard-filters">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TriageStatus | 'all')}
                  className="filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="waiting-for-triage">Waiting for Triage</option>
                  <option value="in-assessment">In Assessment</option>
                  <option value="assessment-completed">Assessment Completed</option>
                  <option value="needs-review">Needs Review</option>
                  <option value="urgent-escalation">Urgent Escalation</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                  className="filter-select"
                >
                  <option value="all">All Priorities</option>
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
                {(search || statusFilter !== 'all' || priorityFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('all')
                      setPriorityFilter('all')
                    }}
                    className="button text"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            <TriageQueueTable
              assessments={filtered}
              currentTime={currentTime}
              onStartTriage={handleStartTriage}
              onResumeTriage={handleResumeTriage}
              onViewAssessment={handleViewAssessment}
            />
          </div>

          <div className="nurse-dashboard-sidebar">
            {selectedPatient ? (
              <PatientSummaryPanel
                patient={selectedPatient}
                onClose={() => setSelectedPatient(null)}
              />
            ) : (
              <RecentActivityPanel assessments={assessments} />
            )}
          </div>
        </div>
      </div>

      {showTriage && (
        <QuickTriageDialog
          draft={triageDraft}
          errors={triageErrors}
          onUpdate={setTriageDraft}
          onSaveDraft={handleSaveDraft}
          onComplete={handleCompleteAssessment}
          onCancel={handleCancelTriage}
        />
      )}

      {showUnsavedWarning && (
        <UnsavedChangesDialog
          onConfirm={handleConfirmDiscard}
          onCancel={handleCancelDiscard}
        />
      )}
    </div>
  )
}
