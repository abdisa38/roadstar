import { useEffect, useState } from "react"
import Icon from "../Icon"
import { AccessDeniedPage } from "../permissions/components"
import { Button, Heading, Input, Select, Text } from "../permissions/ui"
import {
  appointmentStatusLabel,
  dateLabel,
  emptyDraft,
  filterAppointments,
  sampleAppointments,
  type AppointmentDraft,
  type AppointmentRecord,
  type AppointmentStatus,
} from "./model"
import {
  AppointmentDetailPanel,
  AppointmentFilters,
  AppointmentLoadingState,
  AppointmentSummaryCards,
  AppointmentTable,
  AppointmentsEmptyState,
  AppointmentsErrorState,
  CancelAppointmentDialog,
  DateNavigator,
  RescheduleDialog,
  ScheduleAppointmentDialog,
  SessionExpiredState,
} from "./components"
import "./appointments.css"

type AppointmentState = "ready" | "loading" | "error" | "expired" | "restricted"
type DialogType = 
  | { kind: "schedule"; draft?: AppointmentDraft }
  | { kind: "reschedule"; appointment: AppointmentRecord }
  | { kind: "cancel"; appointment: AppointmentRecord }
  | { kind: "detail"; appointment: AppointmentRecord }
  | null

export default function AppointmentManagementPage({
  state,
  permissions,
  onNavigate,
  onReady,
}: {
  state: AppointmentState
  permissions: Set<string>
  onNavigate: (id: string, params?: Record<string, string>) => void
  onReady: () => void
}) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(sampleAppointments)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [dialog, setDialog] = useState<DialogType>(null)

  useEffect(() => {
    setDialog(null)
  }, [state])

  if (state === "expired") return <SessionExpiredState />

  if (state === "restricted" || !permissions.has("appointments"))
    return (
      <AccessDeniedPage
        onBack={() => onNavigate("home")}
        onHome={() => onNavigate("home")}
      />
    )

  const filtered = filterAppointments(
    appointments,
    selectedDate,
    search,
    statusFilter,
    departmentFilter,
  )

  const handleSchedule = (draft: AppointmentDraft) => {
    const newAppointment: AppointmentRecord = {
      id: `DEMO-APT-${Math.floor(Math.random() * 9000 + 1000)}`,
      patientId: draft.patientId,
      patientName: draft.patientName,
      date: draft.date,
      time: draft.time,
      service: draft.service,
      department: draft.department,
      clinician: draft.clinician,
      status: 'scheduled',
      reason: draft.reason,
      notes: draft.notes,
      bookedBy: 'Demo Receptionist',
      bookedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setAppointments([...appointments, newAppointment])
    setDialog(null)
    onReady()
  }

  const handleReschedule = (id: string, draft: AppointmentDraft) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              date: draft.date,
              time: draft.time,
              service: draft.service,
              department: draft.department,
              clinician: draft.clinician,
              updatedAt: new Date().toISOString(),
            }
          : apt,
      ),
    )
    setDialog(null)
    onReady()
  }

  const handleCancel = (id: string, reason: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: 'cancelled',
              cancellationReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : apt,
      ),
    )
    setDialog(null)
    onReady()
  }

  const handleArrival = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: 'arrived',
              updatedAt: new Date().toISOString(),
            }
          : apt,
      ),
    )
  }

  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today.toISOString().slice(0, 10))
  }

  const goToPreviousDay = () => {
    const current = new Date(`${selectedDate}T00:00:00Z`)
    current.setUTCDate(current.getUTCDate() - 1)
    setSelectedDate(current.toISOString().slice(0, 10))
  }

  const goToNextDay = () => {
    const current = new Date(`${selectedDate}T00:00:00Z`)
    current.setUTCDate(current.getUTCDate() + 1)
    setSelectedDate(current.toISOString().slice(0, 10))
  }

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setDepartmentFilter("")
    onReady()
  }

  return (
    <div className="appointments-page">
      <div className="appointments-page-header">
        <div>
          <span className="permission-eyebrow">
            PATIENT OPERATIONS / APPOINTMENT MANAGEMENT
          </span>
          <Heading level={1}>Appointment Management</Heading>
          <Text>Schedule, review, and manage patient appointments.</Text>
        </div>
        {permissions.has("appointments") && (
          <Button
            className="button"
            onClick={() => setDialog({ kind: "schedule" })}
          >
            <Icon name="calendar" size={16} />
            Schedule Appointment
          </Button>
        )}
      </div>

      <div className="appointments-demo-note">
        <Icon name="shield" size={14} />
        <span>
          Fictional demonstration records · All appointments, patients, and dates
          are illustrative examples only
        </span>
      </div>

      {state === "loading" ? (
        <AppointmentLoadingState />
      ) : state === "error" ? (
        <AppointmentsErrorState onRetry={onReady} />
      ) : (
        <>
          <AppointmentSummaryCards
            appointments={appointments}
            selectedDate={selectedDate}
          />

          <div className="appointments-controls">
            <DateNavigator
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
              onToday={goToToday}
            />

            <div className="appointments-search-filter">
              <label className="appointments-search">
                <Icon name="search" size={16} />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    onReady()
                  }}
                  placeholder="Search by patient name, ID, or appointment ID"
                  aria-label="Search appointments"
                />
                {search && (
                  <Button
                    className="icon-button"
                    onClick={() => {
                      setSearch("")
                      onReady()
                    }}
                    aria-label="Clear search"
                  >
                    <Icon name="close" size={14} />
                  </Button>
                )}
              </label>

              <AppointmentFilters
                statusFilter={statusFilter}
                departmentFilter={departmentFilter}
                onStatusChange={setStatusFilter}
                onDepartmentChange={setDepartmentFilter}
                onClear={clearFilters}
              />
            </div>
          </div>

          <div className="appointments-results-header">
            <div>
              <Heading level={2}>
                Scheduled Appointments
                <span className="appointments-count">{filtered.length}</span>
              </Heading>
              <span>
                {dateLabel(selectedDate)}
                {(search || statusFilter !== "all" || departmentFilter) &&
                  " · Filtered"}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <AppointmentsEmptyState
              hasFilters={!!(search || statusFilter !== "all" || departmentFilter)}
              onClearFilters={clearFilters}
              onSchedule={() => setDialog({ kind: "schedule" })}
              canSchedule={permissions.has("appointments")}
            />
          ) : (
            <AppointmentTable
              appointments={filtered}
              permissions={permissions}
              onView={(apt) => setDialog({ kind: "detail", appointment: apt })}
              onReschedule={(apt) =>
                setDialog({ kind: "reschedule", appointment: apt })
              }
              onCancel={(apt) => setDialog({ kind: "cancel", appointment: apt })}
              onArrival={handleArrival}
              onViewPatient={(patientId) =>
                onNavigate("patient-profile", { id: patientId })
              }
            />
          )}

          <div className="appointments-bottom-note">
            <Icon name="info" size={14} />
            <span>
              All appointment records, patient identities, clinician names, and
              timestamps are fictional examples. Scheduling an appointment does
              not automatically register a patient, mark arrival, or create an
              encounter. Backend services must validate all scheduling operations
              and enforce permissions independently.
            </span>
          </div>
        </>
      )}

      <details className="appointments-notes">
        <summary>
          <Icon name="info" size={15} />
          Prompt 21 · Appointment Management & Scheduling
          <Icon name="chevron" size={14} />
        </summary>
        <Heading level={3}>Appointment workflow guidelines</Heading>
        <Text>
          Appointments remain distinct from patient registration, arrival
          check-in, queue management, and clinical encounters. An appointment
          date passing does not prove attendance. Status transitions must follow
          approved hospital workflows.
        </Text>
        <Text>
          Backend services must enforce scheduling rules, detect real-time
          conflicts, validate permissions, maintain appointment history, and
          prevent invalid status changes. Notification capabilities (SMS, email)
          and external calendar integration require separate implementation.
        </Text>
      </details>

      {dialog?.kind === "schedule" && (
        <ScheduleAppointmentDialog
          existingAppointments={appointments}
          initialDraft={dialog.draft}
          onSave={handleSchedule}
          onCancel={() => setDialog(null)}
          onNavigateToRegistration={() => onNavigate("registration")}
        />
      )}

      {dialog?.kind === "reschedule" && (
        <RescheduleDialog
          appointment={dialog.appointment}
          existingAppointments={appointments}
          onSave={(draft) => handleReschedule(dialog.appointment.id, draft)}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.kind === "cancel" && (
        <CancelAppointmentDialog
          appointment={dialog.appointment}
          onConfirm={(reason) => handleCancel(dialog.appointment.id, reason)}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.kind === "detail" && (
        <AppointmentDetailPanel
          appointment={dialog.appointment}
          permissions={permissions}
          onClose={() => setDialog(null)}
          onReschedule={(apt) => setDialog({ kind: "reschedule", appointment: apt })}
          onCancel={(apt) => setDialog({ kind: "cancel", appointment: apt })}
          onArrival={handleArrival}
          onViewPatient={(patientId) =>
            onNavigate("patient-profile", { id: patientId })
          }
        />
      )}
    </div>
  )
}
