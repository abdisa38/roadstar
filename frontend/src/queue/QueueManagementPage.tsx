import { useEffect, useState } from "react"
import Icon from "../Icon"
import { AccessDeniedPage } from "../permissions/components"
import { Button, Heading, Text } from "../permissions/ui"
import {
  calculateWaitingDuration,
  detectDuplicateQueueEntry,
  emptyQueueDraft,
  filterQueue,
  queueStatusLabel,
  sampleQueueEntries,
  type QueueDraft,
  type QueueEntry,
  type QueueStatus,
} from "./model"
import {
  AddToQueueDialog,
  CallPatientDialog,
  CompleteQueueDialog,
  DateNavigator,
  LeftBeforeServiceDialog,
  QueueEmptyState,
  QueueEntryDetailPanel,
  QueueErrorState,
  QueueFilters,
  QueueLoadingState,
  QueueSummaryCards,
  QueueTable,
  SessionExpiredState,
} from "./components"
import "./queue.css"

type QueueState = "ready" | "loading" | "error" | "expired" | "restricted"

export default function QueueManagementPage({
  state,
  permissions,
  onNavigate,
  onReady,
}: {
  state: QueueState
  permissions: Set<string>
  onNavigate: (id: string, params?: Record<string, string>) => void
  onReady: () => void
}) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })
  const [queue, setQueue] = useState<QueueEntry[]>(sampleQueueEntries)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<QueueStatus | "all">("all")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null)
  const [dialog, setDialog] = useState<
    | { kind: "add" }
    | { kind: "call"; entry: QueueEntry }
    | { kind: "complete"; entry: QueueEntry }
    | { kind: "left"; entry: QueueEntry }
    | null
  >(null)

  useEffect(() => {
    setDialog(null)
    setSelectedEntry(null)
  }, [state])

  if (state === "expired") return <SessionExpiredState />

  if (state === "restricted" || !permissions.has("queue"))
    return (
      <AccessDeniedPage
        onBack={() => onNavigate("home")}
        onHome={() => onNavigate("home")}
      />
    )

  const filtered = filterQueue(queue, search, statusFilter, departmentFilter)

  const handleAddToQueue = (draft: QueueDraft) => {
    const newEntry: QueueEntry = {
      id: `DEMO-Q-${Math.floor(Math.random() * 900 + 400)}`,
      patientId: draft.patientId,
      patientName: draft.patientName,
      appointmentId: draft.appointmentId,
      service: draft.service,
      department: draft.department,
      arrivalTime: new Date().toISOString(),
      calledTime: null,
      serviceStartTime: null,
      completedTime: null,
      status: 'waiting',
      position: queue.filter(e => e.status === 'waiting').length + 1,
      notes: draft.notes,
      registeredBy: 'Demo Receptionist',
    }
    setQueue([...queue, newEntry])
    setDialog(null)
    onReady()
  }

  const handleCallPatient = (id: string) => {
    setQueue(
      queue.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'called',
              calledTime: new Date().toISOString(),
            }
          : entry,
      ),
    )
    setDialog(null)
    setSelectedEntry(null)
    onReady()
  }

  const handleMarkInService = (id: string) => {
    setQueue(
      queue.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'in-service',
              serviceStartTime: new Date().toISOString(),
              position: null,
            }
          : entry,
      ),
    )
    setSelectedEntry(null)
    onReady()
  }

  const handleCompleteQueue = (id: string) => {
    setQueue(
      queue.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'completed',
              completedTime: new Date().toISOString(),
              position: null,
            }
          : entry,
      ),
    )
    setDialog(null)
    setSelectedEntry(null)
    onReady()
  }

  const handleLeftBeforeService = (id: string) => {
    setQueue(
      queue.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'left-before-service',
              position: null,
            }
          : entry,
      ),
    )
    setDialog(null)
    setSelectedEntry(null)
    onReady()
  }

  const handleCancelEntry = (id: string) => {
    setQueue(
      queue.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'cancelled',
              position: null,
            }
          : entry,
      ),
    )
    setSelectedEntry(null)
    onReady()
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
    <div className="queue-page">
      <div className="queue-page-header">
        <div>
          <span className="permission-eyebrow">
            PATIENT OPERATIONS / QUEUE MANAGEMENT
          </span>
          <Heading level={1}>Queue Management</Heading>
          <Text>Monitor arrivals and coordinate patient flow.</Text>
        </div>
        {permissions.has("queue") && (
          <Button className="button" onClick={() => setDialog({ kind: "add" })}>
            <Icon name="user" size={16} />
            Register Arrival
          </Button>
        )}
      </div>

      <div className="queue-demo-note">
        <Icon name="shield" size={14} />
        <span>
          Fictional demonstration queue · All patients, arrival times, and
          statuses are illustrative examples only
        </span>
      </div>

      {state === "loading" ? (
        <QueueLoadingState />
      ) : state === "error" ? (
        <QueueErrorState onRetry={onReady} />
      ) : (
        <>
          <QueueSummaryCards
            queue={queue}
            onFilterByStatus={(status) => setStatusFilter(status)}
          />

          <div className="queue-controls">
            <DateNavigator
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
              onToday={goToToday}
            />

            <div className="queue-search-filter">
              <label className="queue-search">
                <Icon name="search" size={16} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    onReady()
                  }}
                  placeholder="Search by patient name, ID, or queue ID"
                  aria-label="Search queue"
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

              <QueueFilters
                statusFilter={statusFilter}
                departmentFilter={departmentFilter}
                onStatusChange={setStatusFilter}
                onDepartmentChange={setDepartmentFilter}
                onClear={clearFilters}
              />
            </div>
          </div>

          <div className="queue-results-header">
            <div>
              <Heading level={2}>
                Current Queue
                <span className="queue-count">{filtered.length}</span>
              </Heading>
              <span>
                {new Date(selectedDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
                {(search || statusFilter !== "all" || departmentFilter) &&
                  " · Filtered"}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <QueueEmptyState
              hasFilters={!!(search || statusFilter !== "all" || departmentFilter)}
              onClearFilters={clearFilters}
              onAddToQueue={() => setDialog({ kind: "add" })}
              canAdd={permissions.has("queue")}
            />
          ) : (
            <QueueTable
              entries={filtered}
              permissions={permissions}
              selectedId={selectedEntry?.id || null}
              onSelect={setSelectedEntry}
              onCall={(entry) => setDialog({ kind: "call", entry })}
              onMarkInService={handleMarkInService}
              onComplete={(entry) => setDialog({ kind: "complete", entry })}
              onLeft={(entry) => setDialog({ kind: "left", entry })}
              onCancel={handleCancelEntry}
              onViewPatient={(patientId) =>
                onNavigate("patient-profile", { id: patientId })
              }
            />
          )}

          <div className="queue-bottom-note">
            <Icon name="info" size={14} />
            <span>
              Queue entries represent operational workflow only. A queue entry
              does not automatically create a clinical encounter. Waiting
              duration is based on arrival timestamps. Clinical priority must be
              assigned through authorized triage workflows, not reception
              operations.
            </span>
          </div>
        </>
      )}

      <details className="queue-notes">
        <summary>
          <Icon name="info" size={15} />
          Prompt 22 · Queue Management & Patient Flow
          <Icon name="chevron" size={14} />
        </summary>
        <Heading level={3}>Queue workflow guidelines</Heading>
        <Text>
          Queue entries, appointments, arrivals, and encounters are distinct
          concepts. An appointment does not prove arrival. A queue entry does
          not prove an encounter was created. Queue completion does not prove
          that treatment or the entire visit is complete.
        </Text>
        <Text>
          Backend services must enforce queue rules, validate status
          transitions, detect duplicate entries, maintain reliable timestamps,
          and prevent unauthorized workflow changes. Reception staff should not
          make clinical triage decisions through the queue interface.
        </Text>
      </details>

      {dialog?.kind === "add" && (
        <AddToQueueDialog
          existingQueue={queue}
          onSave={handleAddToQueue}
          onCancel={() => setDialog(null)}
          onNavigateToRegistration={() => onNavigate("registration")}
        />
      )}

      {dialog?.kind === "call" && (
        <CallPatientDialog
          entry={dialog.entry}
          onConfirm={() => handleCallPatient(dialog.entry.id)}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.kind === "complete" && (
        <CompleteQueueDialog
          entry={dialog.entry}
          onConfirm={() => handleCompleteQueue(dialog.entry.id)}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.kind === "left" && (
        <LeftBeforeServiceDialog
          entry={dialog.entry}
          onConfirm={() => handleLeftBeforeService(dialog.entry.id)}
          onCancel={() => setDialog(null)}
        />
      )}

      {selectedEntry && (
        <QueueEntryDetailPanel
          entry={selectedEntry}
          permissions={permissions}
          onClose={() => setSelectedEntry(null)}
          onCall={() => setDialog({ kind: "call", entry: selectedEntry })}
          onMarkInService={() => handleMarkInService(selectedEntry.id)}
          onComplete={() => setDialog({ kind: "complete", entry: selectedEntry })}
          onLeft={() => setDialog({ kind: "left", entry: selectedEntry })}
          onCancel={() => {
            handleCancelEntry(selectedEntry.id)
            setSelectedEntry(null)
          }}
          onViewPatient={(patientId) =>
            onNavigate("patient-profile", { id: patientId })
          }
        />
      )}
    </div>
  )
}
