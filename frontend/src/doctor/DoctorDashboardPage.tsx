import { useCallback, useEffect, useState } from 'react'
import type { PatientEncounter, ClinicalTask, Appointment, EncounterStatus } from './model'
import {
  sampleEncounters,
  sampleClinicalTasks,
  sampleAppointments,
  filterEncounters,
  calculateSummary,
} from './model'
import {
  DashboardSummaryCards,
  PatientQueueTable,
  ClinicalTasksPanel,
  TodaysSchedulePanel,
  SearchAndFilters,
  EmptyQueueState,
} from './components'
import Icon from '../Icon'
import './doctor.css'

type DoctorDashboardPageProps = {
  state: 'loading' | 'error' | 'ready'
  doctorName: string
  onNavigate: (target: string, params?: Record<string, string>) => void
  onReady: () => void
}

export default function DoctorDashboardPage({
  state,
  doctorName,
  onNavigate,
  onReady,
}: DoctorDashboardPageProps) {
  const [encounters, setEncounters] = useState<PatientEncounter[]>(sampleEncounters)
  const [tasks, setTasks] = useState<ClinicalTask[]>(sampleClinicalTasks)
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EncounterStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('today')
  const [assignedToMe, setAssignedToMe] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (state === 'ready') onReady()
  }, [state, onReady])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const filtered = filterEncounters(
    encounters,
    search,
    statusFilter,
    dateFilter,
    assignedToMe,
    doctorName
  )

  const summary = calculateSummary(encounters.filter((e) => {
    if (dateFilter === 'today') {
      return new Date(e.arrivalTime).toDateString() === new Date().toDateString()
    }
    return true
  }))

  const handleOpenPatient = useCallback((encounter: PatientEncounter) => {
    onNavigate('patient-encounter', {
      encounterId: encounter.id,
      patientId: encounter.patientId,
    })
  }, [onNavigate])

  const handleOpenTask = useCallback((task: ClinicalTask) => {
    onNavigate('patient-encounter', {
      encounterId: task.encounterId,
      patientId: task.patientId,
    })
  }, [onNavigate])

  const handleSummaryCardClick = useCallback((status: EncounterStatus) => {
    setStatusFilter(status)
    setDateFilter('today')
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setStatusFilter('all')
    setDateFilter('today')
    setAssignedToMe(true)
  }, [])

  if (state === 'loading') {
    return (
      <div className="doctor-dashboard-loading">
        <div className="spinner" />
        <p>Loading doctor dashboard…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="doctor-dashboard-error">
        <Icon name="alert-circle" size={48} />
        <h2>Unable to Load Dashboard</h2>
        <p>There was an error loading your patient queue and clinical tasks.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="doctor-dashboard">
      <div className="doctor-dashboard-header">
        <div className="doctor-dashboard-header-content">
          <div>
            <h1>Doctor Dashboard</h1>
            <p className="doctor-dashboard-subtitle">
              Your patient queue and clinical tasks.
            </p>
          </div>
          <div className="doctor-dashboard-header-actions">
            <button
              className="button secondary"
              onClick={() => onNavigate('patient-search')}
            >
              <Icon name="search" size={16} />
              Patient Lookup
            </button>
          </div>
        </div>
      </div>

      <div className="doctor-dashboard-content">
        <DashboardSummaryCards
          summary={summary}
          onCardClick={handleSummaryCardClick}
        />

        <div className="doctor-dashboard-main">
          <div className="doctor-queue-section">
            <div className="section-header">
              <h2>Patient Queue</h2>
              <span className="result-count">
                {filtered.length} {filtered.length === 1 ? 'patient' : 'patients'}
              </span>
            </div>

            <SearchAndFilters
              search={search}
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              assignedToMe={assignedToMe}
              onSearchChange={setSearch}
              onStatusFilterChange={setStatusFilter}
              onDateFilterChange={setDateFilter}
              onAssignedToMeChange={setAssignedToMe}
              onClearFilters={handleClearFilters}
              hasActiveFilters={
                search !== '' ||
                statusFilter !== 'all' ||
                dateFilter !== 'today' ||
                !assignedToMe
              }
            />

            {filtered.length === 0 ? (
              <EmptyQueueState
                hasFilters={
                  search !== '' ||
                  statusFilter !== 'all' ||
                  dateFilter !== 'today' ||
                  !assignedToMe
                }
                onClearFilters={handleClearFilters}
              />
            ) : (
              <PatientQueueTable
                encounters={filtered}
                currentTime={currentTime}
                onOpenPatient={handleOpenPatient}
              />
            )}
          </div>

          <div className="doctor-sidebar">
            <ClinicalTasksPanel
              tasks={tasks}
              onOpenTask={handleOpenTask}
            />

            <TodaysSchedulePanel
              appointments={appointments}
              onOpenAppointment={(appointment) => {
                const encounter = encounters.find(
                  (e) => e.patientId === appointment.patientId
                )
                if (encounter) {
                  handleOpenPatient(encounter)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
