import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react"

import Icon from "./Icon"
import type { BookingEntry } from "./booking/model"
import PageReady from "./PageReady"
const Home = lazy(() => import("./Home"))
const About = lazy(() => import("./About"))
const Directory = lazy(() => import("./Directory"))
const Doctors = lazy(() => import("./Doctors"))
const AppointmentBooking = lazy(() => import("./AppointmentBooking"))
const Contact = lazy(() => import("./Contact"))
const PatientServices = lazy(() => import("./PatientServices"))
const StaffAuthentication = lazy(() => import("./StaffAuthentication"))
const StaffPermissions = lazy(() => import("./StaffPermissions"))
const AppointmentManagement = lazy(() => import("./appointments/AppointmentManagementPage"))
const PatientProfile = lazy(() => import("./patient-profile/PatientProfilePage"))
const QueueManagement = lazy(() => import("./queue/QueueManagementPage"))
const NurseDashboard = lazy(() => import("./nurse/NurseDashboardPage"))
const TriageAssessment = lazy(() => import("./triage/TriageAssessmentPage"))
const DoctorDashboard = lazy(() => import("./doctor/DoctorDashboardPage"))
const ClinicalWorkspace = lazy(() => import("./clinical/ClinicalWorkspacePage"))
const MedicalHistory = lazy(() => import("./medical-history/MedicalHistoryPage"))
const DiagnosisManagement = lazy(() => import("./diagnosis/DiagnosisManagementPage"))
const PrescriptionManagement = lazy(() => import("./prescription/PrescriptionManagementPage"))
const LaboratoryDashboard = lazy(() => import("./laboratory/LaboratoryDashboardPage"))
const LaboratoryOrders = lazy(() => import("./laboratory/LaboratoryOrdersPage"))
const SpecimenCollection = lazy(() => import("./laboratory/SpecimenCollectionPage"))
const ResultEntry = lazy(() => import("./laboratory/ResultEntryPage"))

type PublicPage = "home" | "about" | "directory" | "doctors" | "appointments" | "contact" | "patient-services" | "staff-auth" | "staff-permissions" | "staff-reception" | "staff-appointments" | "staff-patient-profile" | "staff-queue" | "staff-nurse" | "staff-triage" | "staff-doctor" | "staff-clinical" | "staff-medical-history" | "staff-diagnosis" | "staff-prescription" | "staff-laboratory" | "staff-laboratory-orders" | "staff-specimen-collection" | "staff-result-entry"
function pageFromPath(path: string): PublicPage {
  if (path === "/staff/laboratory/result-entry" || path.startsWith("/staff/laboratory/result-entry/")) return "staff-result-entry"
  if (path === "/staff/laboratory/specimen-collection" || path.startsWith("/staff/laboratory/specimen-collection/")) return "staff-specimen-collection"
  if (path === "/staff/laboratory/orders" || path.startsWith("/staff/laboratory/orders/")) return "staff-laboratory-orders"
  if (path === "/staff/laboratory" || path.startsWith("/staff/laboratory/")) return "staff-laboratory"
  if (path === "/staff/prescription" || path.startsWith("/staff/prescription/")) return "staff-prescription"
  if (path === "/staff/diagnosis" || path.startsWith("/staff/diagnosis/")) return "staff-diagnosis"
  if (path === "/staff/medical-history" || path.startsWith("/staff/medical-history/")) return "staff-medical-history"
  if (path === "/staff/clinical" || path.startsWith("/staff/clinical/")) return "staff-clinical"
  if (path === "/staff/doctor" || path.startsWith("/staff/doctor/")) return "staff-doctor"
  if (path === "/staff/triage" || path.startsWith("/staff/triage/")) return "staff-triage"
  if (path === "/staff/nurse" || path.startsWith("/staff/nurse/")) return "staff-nurse"
  if (path === "/staff/queue" || path.startsWith("/staff/queue/")) return "staff-queue"
  if (path === "/staff/patient-profile" || path.startsWith("/staff/patient-profile/")) return "staff-patient-profile"
  if (path === "/staff/appointments" || path.startsWith("/staff/appointments/")) return "staff-appointments"
  if (path === "/staff/reception" || path.startsWith("/staff/reception/")) return "staff-reception"
  if (path === "/staff/permissions" || path.startsWith("/staff/permissions/")) return "staff-permissions"
  if (path === "/" || path.startsWith("/staff/")) return "staff-auth"
  if (path === "/home") return "home"
  if (path === "/about") return "about"
  if (path.startsWith("/departments") || path.startsWith("/services"))
    return "directory"
  if (path.startsWith("/doctors")) return "doctors"
  if (path.startsWith("/appointments")) return "appointments"
  if (path.startsWith("/patient-services")) return "patient-services"
  if (path.startsWith("/contact")) return "contact"
  return "appointments"
}

export default function App() {
  const [bookingEntry, setBookingEntry] = useState<BookingEntry | null>(null)
  const [bookingSession, setBookingSession] = useState(0)
  const bookingLeaveGuard = useRef<((action: () => void) => void) | null>(null)
  const registerBookingLeave = useCallback(
    (guard: ((action: () => void) => void) | null) => {
      bookingLeaveGuard.current = guard
    },
    [],
  )
  const staffAppointment = useRef<(() => void) | null>(null)
  const registerStaffAppointment = useCallback(
    (action: (() => void) | null) => {
      staffAppointment.current = action
    },
    [],
  )
  const [page, setPage] = useState<PublicPage>(() =>
    pageFromPath(window.location.pathname),
  )
  const [directoryVisit, setDirectoryVisit] = useState(0)
  const [menu, setMenu] = useState(false)
  const [modal, setModal] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const onPopState = () => {
      if (bookingLeaveGuard.current) {
        setModal(null)
        const destination = window.location.pathname + window.location.hash
        window.history.pushState({}, "", "/appointments")
        bookingLeaveGuard.current(() => {
          window.history.replaceState({}, "", destination)
          setPage(pageFromPath(destination.split("#")[0]))
          setDirectoryVisit((visit) => visit + 1)
          setMenu(false)
        })
        return
      }
      setPage(pageFromPath(window.location.pathname))
      setDirectoryVisit((visit) => visit + 1)
      setMenu(false)
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])
  useEffect(() => {
    document.title =
      page === "staff-reception"
        ? "Reception Overview | ORHIMS Design Preview"
        : page === "staff-permissions"
        ? "Role-Based Navigation & Permissions | ORHIMS Design Preview"
        : page === "staff-auth"
        ? "Staff Sign In | ORHIMS · Oda Roba Hospital"
        : page === "patient-services"
          ? "Patient Services | Oda Roba Hospital"
          : page === "contact"
            ? "Contact & Emergency Information | Oda Roba Hospital"
            : page === "appointments"
              ? "Book an Appointment | Oda Roba Hospital"
              : page === "doctors"
                ? window.location.pathname.startsWith("/doctors/")
                  ? "Medical Professional Profile | Oda Roba Hospital"
                  : "Doctors & Medical Staff | Oda Roba Hospital"
                : page === "directory"
                  ? "Departments & Services | Oda Roba Hospital"
                  : page === "about"
                    ? "About Oda Roba Hospital | Bale Robe, Ethiopia"
                    : "Oda Roba Hospital | Bale Robe, Ethiopia"
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        page === "staff-reception"
          ? "ORHIMS reception dashboard design preview. Fictional patient records and illustrative workload only; no backend is connected."
          : page === "staff-permissions"
          ? "ORHIMS role-aware navigation design preview. Fictional scenarios and proposed permissions require hospital approval and backend authorization."
          : page === "staff-auth"
          ? "ORHIMS staff authentication design preview for Oda Roba Hospital. Authorized staff access requires a connected authentication service."
          : page === "patient-services"
            ? "Prepare for your visit, explore the appointment demo, and find patient service information at Oda Roba Hospital. Digital patient services are coming soon."
            : page === "contact"
              ? "Find contact, location, and emergency guidance for Oda Roba Hospital in Bale Robe. Official contact details are pending verification."
              : page === "appointments"
                ? "Preview the planned-care appointment journey at Oda Roba Hospital in Bale Robe. Care availability and live requests require hospital verification."
                : page === "doctors"
                  ? "Explore the Oda Roba Hospital medical staff directory and profile design. Staff information and schedules await hospital verification."
                  : page === "directory"
                    ? "Explore the Oda Roba Hospital departments and services directory design, search care examples, and find appointment and emergency information. Hospital offerings await verification."
                    : page === "about"
                      ? "Get to know Oda Roba Hospital in Bale Robe, Oromia, Ethiopia. Explore our proposed care principles, patient experience, and community focus."
                      : "Oda Roba Hospital in Bale Robe, Oromia, Ethiopia. Explore patient information, care services, appointment guidance, and emergency information.",
      )
  }, [page, directoryVisit])
  function navigate(
    destination: PublicPage,
    section?: string,
    doctorSlug?: string,
  ) {
    window.history.pushState(
      {},
      "",
      `/${destination === "directory" ? "departments" : destination}${
        doctorSlug ? `/${doctorSlug}` : section ? `#${section}` : ""
      }`,
    )
    setPage(destination)
    setDirectoryVisit((visit) => visit + 1)
    setMenu(false)
    document
      .querySelectorAll<HTMLDetailsElement>(".nav-dropdown")
      .forEach((dropdown) => {
        dropdown.open = false
      })
  }
  useEffect(() => {
    if (modal) {
      previousFocus.current = (document.activeElement as HTMLElement)
      dialogRef.current?.showModal()
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = previousOverflow
      }
    } else {
      dialogRef.current?.close()
      previousFocus.current?.focus()
    }
  }, [modal])
  function startBooking(entry: BookingEntry | null = null) {
    setModal(null)
    setBookingEntry(entry)
    setBookingSession((session) => session + 1)
    navigate("appointments")
  }
  function open(title: string) {
    if (title === "Contact the hospital") return navigate("contact")
    if (title === "Find a doctor") return navigate("doctors")
    if (title === "About Oda Roba") return navigate("about")
    if (title === "All services") return navigate("directory", "care-services")
    if (title === "All departments")
      return navigate("directory", "department-directory")
    setMenu(false)
    document
      .querySelectorAll<HTMLDetailsElement>(".nav-dropdown")
      .forEach((dropdown) => {
        dropdown.open = false
      })
    if (
      title === "Request an appointment" &&
      page === "doctors" &&
      staffAppointment.current
    ) {
      staffAppointment.current()
      return
    }
    if (title === "Request an appointment") {
      startBooking()
      return
    }
    setModal(title)
  }
  useEffect(() => {
    if (!menu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false)
        document.querySelector<HTMLButtonElement>(".mobile-menu")?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menu])
  const close = () => setModal(null)
  function go(id: string) {
    if (id === "contact") navigate("contact")
    else if (id === "patients") navigate("patient-services")
    else if (id === "results") navigate("patient-services", "patient-records")
    else if (id === "billing") navigate("patient-services", "patient-billing")
    else if (id === "directions") navigate("contact", "contact-location")
    else if (id === "pharmacy") navigate("directory", undefined, "pharmacy")
    else if (id === "emergency-department")
      navigate("directory", undefined, "emergency")
    else if (id === "about") navigate("about")
    else if (id === "doctors") navigate("doctors")
    else if (id === "departments") navigate("directory", "department-directory")
    else if (id === "services") navigate("directory", "care-services")
    else navigate("home", id)
  }
  if (page === "staff-permissions")
    return <Suspense fallback={<div className="notice">Loading design-review workspace…</div>}><StaffPermissions key="permissions" /></Suspense>
  if (page === "staff-result-entry")
    return <Suspense fallback={<div className="notice">Loading result entry…</div>}><ResultEntry orderId="ORD-LAB-2026-00124" onNavigateBack={() => { window.history.pushState({}, "", "/staff/laboratory"); setPage("staff-laboratory"); }} /></Suspense>
  if (page === "staff-specimen-collection")
    return <Suspense fallback={<div className="notice">Loading specimen collection…</div>}><SpecimenCollection onNavigateBack={() => { window.history.pushState({}, "", "/staff/laboratory"); setPage("staff-laboratory"); }} /></Suspense>
  if (page === "staff-laboratory-orders")
    return <Suspense fallback={<div className="notice">Loading laboratory orders…</div>}><LaboratoryOrders state="ready" patientId="ORH-2026-00124" encounterId="ENC-2026-00087" onNavigate={(id, params) => { console.log('Navigate to:', id, params); }} onReady={() => {}} /></Suspense>
  if (page === "staff-laboratory")
    return <Suspense fallback={<div className="notice">Loading laboratory dashboard…</div>}><LaboratoryDashboard onNavigate={(destination, orderId) => { if (destination === 'orders') { window.history.pushState({}, "", "/staff/laboratory/orders"); setPage("staff-laboratory-orders"); } else if (destination === 'specimen-collection') { window.history.pushState({}, "", "/staff/laboratory/specimen-collection"); setPage("staff-specimen-collection"); } else if (destination === 'result-entry') { window.history.pushState({}, "", "/staff/laboratory/result-entry"); setPage("staff-result-entry"); } else if (destination === 'order-details') { console.log('Navigate to order details:', orderId); } }} /></Suspense>
  if (page === "staff-prescription")
    return <Suspense fallback={<div className="notice">Loading prescription management…</div>}><PrescriptionManagement state="ready" patientId="ORH-2026-00124" encounterId="ENC-2026-00087" onNavigate={(id, params) => console.log('Navigate to:', id, params)} onReady={() => {}} /></Suspense>
  if (page === "staff-diagnosis")
    return <Suspense fallback={<div className="notice">Loading diagnosis management…</div>}><DiagnosisManagement state="ready" patientId="ORH-2026-00124" encounterId="ENC-2026-00087" onNavigate={(id, params) => console.log('Navigate to:', id, params)} onReady={() => {}} /></Suspense>
  if (page === "staff-medical-history")
    return <Suspense fallback={<div className="notice">Loading medical history…</div>}><MedicalHistory state="ready" patientId="ORH-2026-00124" currentEncounterId="ENC-2026-00087" onNavigate={(id, params) => console.log('Navigate to:', id, params)} onReady={() => {}} /></Suspense>
  if (page === "staff-clinical")
    return <Suspense fallback={<div className="notice">Loading clinical workspace…</div>}><ClinicalWorkspace state="ready" patientId="ORH-2026-00124" encounterId="ENC-2026-00087" onNavigate={(id, params) => console.log('Navigate to:', id, params)} onReady={() => {}} /></Suspense>
  if (page === "staff-doctor")
    return <Suspense fallback={<div className="notice">Loading doctor dashboard…</div>}><DoctorDashboard state="ready" doctorName="Dr. Demo" onNavigate={(id, params) => console.log('Navigate to:', id, params)} onReady={() => {}} /></Suspense>
  if (page === "staff-triage")
    return <Suspense fallback={<div className="notice">Loading triage assessment…</div>}><TriageAssessment state="ready" patientId="ORH-2026-00124" encounterId="ENC-2026-00087" onNavigate={(id) => console.log('Navigate to:', id)} onReady={() => {}} /></Suspense>
  if (page === "staff-nurse")
    return <Suspense fallback={<div className="notice">Loading nurse dashboard…</div>}><NurseDashboard state="ready" permissions={new Set(["triage", "vital-signs", "nursing-notes", "patient-records", "queue"])} onNavigate={(id) => console.log('Navigate to:', id)} onReady={() => {}} /></Suspense>
  if (page === "staff-patient-profile")
    return <Suspense fallback={<div className="notice">Loading patient profile…</div>}><PatientProfile state="ready" patientId="DEMO-EX-101" permissions={new Set(["directory", "appointments", "encounters", "clinical-records", "laboratory", "prescriptions", "billing", "registration", "queue"])} onNavigate={(id) => console.log('Navigate to:', id)} onReady={() => {}} /></Suspense>
  if (page === "staff-appointments")
    return <Suspense fallback={<div className="notice">Loading appointment management…</div>}><AppointmentManagement state="ready" permissions={new Set(["appointments", "queue", "directory"])} onNavigate={(id) => console.log('Navigate to:', id)} onReady={() => {}} /></Suspense>
  if (page === "staff-queue")
    return <Suspense fallback={<div className="notice">Loading queue management…</div>}><QueueManagement state="ready" permissions={new Set(["queue", "appointments", "directory", "encounters"])} onNavigate={(id) => console.log('Navigate to:', id)} onReady={() => {}} /></Suspense>
  if (page === "staff-reception")
    return <Suspense fallback={<div className="notice">Loading reception preview…</div>}><StaffPermissions key="reception" reception /></Suspense>
  if (page === "staff-auth")
    return (
      <Suspense
        fallback={
          <main className="wide section" role="status">
            Loading staff sign-in…
          </main>
        }
      >
        <StaffAuthentication />
      </Suspense>
    )
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {page !== "appointments" && (
        <>
          <div className="utility">
            <div className="wide">
              <span>
                <Icon name="pin" size={14} /> Bale Robe, Oromia, Ethiopia
              </span>
              <div>
                <span className="utility-message">
                  Contact details & service hours pending verification.
                </span>
                <button onClick={() => open("Patient portal")}>
                  <Icon name="user" size={14} /> Patient portal{" "}
                  <Icon name="arrow" size={14} />
                </button>
              </div>
            </div>
          </div>
          <header className="header">
            <div className="wide header-inner">
              <button
                className="brand"
                onClick={() => navigate("home")}
                aria-label="Oda Roba Hospital home"
              >
                <span className="brand-symbol">
                  <Icon name="cross" size={30} />
                </span>
                <span>
                  <strong>ODA ROBA</strong>
                  <small>HOSPITAL</small>
                </span>
              </button>
              <nav
                className={menu ? "nav open" : "nav"}
                aria-label="Main navigation"
                id="main-navigation"
              >
                <a
                  href="/home"
                  className={page === "home" ? "nav-active" : ""}
                  aria-current={page === "home" ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return
                    event.preventDefault()
                    navigate("home")
                  }}
                >
                  Home
                </a>
                <a
                  href="/about"
                  className={page === "about" ? "nav-active" : ""}
                  aria-current={page === "about" ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return
                    event.preventDefault()
                    navigate("about")
                  }}
                >
                  About
                </a>
                <a
                  href="/departments"
                  className={page === "directory" ? "nav-active" : ""}
                  aria-current={page === "directory" ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return
                    event.preventDefault()
                    navigate("directory")
                  }}
                >
                  Departments
                </a>
                <a
                  href="/departments#care-services"
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return
                    event.preventDefault()
                    go("services")
                  }}
                >
                  Services
                </a>
                <a
                  href="/doctors"
                  className={page === "doctors" ? "nav-active" : ""}
                  aria-current={page === "doctors" ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return
                    event.preventDefault()
                    navigate("doctors")
                  }}
                >
                  Doctors
                </a>
                <details className="nav-dropdown">
                  <summary
                    className={page === "patient-services" ? "nav-active" : ""}
                    aria-current={
                      page === "patient-services" ? "page" : undefined
                    }
                  >
                    Patient services <Icon name="chevron" size={12} />
                  </summary>
                  <div className="nav-dropdown-panel">
                    <button onClick={() => go("patients")}>
                      Patient services overview
                    </button>
                    <button onClick={() => open("Request an appointment")}>
                      Appointment requests
                    </button>
                    <button onClick={() => open("Patient portal")}>
                      Patient portal · coming soon
                    </button>
                    <button onClick={() => open("Visiting information")}>
                      Visiting information
                    </button>
                  </div>
                </details>
                <button onClick={() => go("resources")}>News</button>
                <a
                  href="/contact"
                  className={page === "contact" ? "nav-active" : ""}
                  aria-current={page === "contact" ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return
                    event.preventDefault()
                    go("contact")
                  }}
                >
                  Contact
                </a>
              </nav>
              <div className="header-actions">
                <button
                  className="emergency-link"
                  onClick={() => open("Emergency information")}
                >
                  <Icon name="phone" size={16} /> Emergency
                </button>
                <button
                  className="button compact"
                  onClick={() => open("Request an appointment")}
                >
                  Book an appointment <Icon name="arrow" size={16} />
                </button>
              </div>
              <button
                className="mobile-menu icon-button"
                aria-label={menu ? "Close menu" : "Open menu"}
                aria-expanded={menu}
                aria-controls="main-navigation"
                onClick={() => setMenu(!menu)}
              >
                <Icon name={menu ? "close" : "menu"} />
              </button>
            </div>
          </header>
        </>
      )}
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <section className="page-loading wide section" role="status">
              <div className="eyebrow">ODA ROBA HOSPITAL</div>
              <p>Loading your care information…</p>
            </section>
          }
        >
          <PageReady visit={directoryVisit}>
            {page === "patient-services" ? (
              <PatientServices
                open={open}
                go={go}
                home={() => navigate("home")}
              />
            ) : page === "contact" ? (
              <Contact open={open} go={go} home={() => navigate("home")} />
            ) : page === "appointments" ? (
              <AppointmentBooking
                key={bookingSession}
                entry={bookingEntry}
                open={open}
                onExit={() => navigate("home")}
                registerLeave={registerBookingLeave}
              />
            ) : page === "doctors" ? (
              <Doctors
                path={window.location.pathname}
                registerAppointment={registerStaffAppointment}
                onBook={(doctor) =>
                  startBooking(
                    doctor
                      ? {
                          doctorId: doctor.id,
                          departmentSlug: doctor.departmentId,
                        }
                      : null,
                  )
                }
                onProfile={(slug) => navigate("doctors", undefined, slug)}
                open={open}
                go={go}
                home={() => navigate("home")}
              />
            ) : page === "directory" ? (
              <Directory
                key={directoryVisit}
                onBook={(item) =>
                  startBooking(
                    item
                      ? item.kind === "department"
                        ? { departmentSlug: item.slug }
                        : {
                            serviceSlug: item.slug,
                            departmentSlug: item.department,
                          }
                      : null,
                  )
                }
                open={open}
                go={go}
                home={() => navigate("home")}
              />
            ) : page === "about" ? (
              <About open={open} go={go} home={() => navigate("home")} />
            ) : (
              <Home open={open} go={go} />
            )}
          </PageReady>
        </Suspense>
      </main>
      {page !== "appointments" && (
        <>
          <footer>
            <div className="wide">
              <div className="footer-top">
                <div className="footer-brand">
                  <div className="brand">
                    <span className="brand-symbol">
                      <Icon name="cross" size={30} />
                    </span>
                    <span>
                      <strong>ODA ROBA</strong>
                      <small>HOSPITAL</small>
                    </span>
                  </div>
                  <p>
                    Compassionate care.
                    <br />
                    Connected to our community.
                  </p>
                  <span className="footer-location">
                    <Icon name="pin" size={16} /> Bale Robe, Oromia, Ethiopia
                  </span>
                </div>
                <div>
                  <h3>Hospital</h3>
                  {[
                    "Home",
                    "About Oda Roba",
                    "Departments",
                    "Services",
                    "Doctors",
                    "Patient services",
                    "News",
                    "Contact",
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        if (t === "Home") navigate("home")
                        else if (t === "About Oda Roba") navigate("about")
                        else
                          go(
                            t === "News"
                              ? "resources"
                              : t === "Patient services"
                                ? "patients"
                                : t.toLowerCase(),
                          )
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div>
                  <h3>Patient services</h3>
                  {[
                    "Appointments",
                    "Patient portal",
                    "Laboratory results",
                    "Billing information",
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        t === "Laboratory results"
                          ? go("results")
                          : t === "Billing information"
                            ? go("billing")
                            : open(
                                t === "Appointments"
                                  ? "Request an appointment"
                                  : t,
                              )
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div>
                  <h3>Get in touch</h3>
                  <button onClick={() => open("Contact the hospital")}>
                    Contact & directions <Icon name="arrow" size={14} />
                  </button>
                  <button
                    className="footer-emergency"
                    onClick={() => open("Emergency information")}
                  >
                    <Icon name="phone" size={14} /> Emergency information
                  </button>
                  <p className="footer-note">
                    Phone: [Official hospital number]
                    <br />
                    Email: [Official contact email]
                    <br />
                    Emergency: [Official emergency number]
                  </p>
                </div>
              </div>
              <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Oda Roba Hospital.</span>
                <div>
                  {["Privacy policy", "Terms", "Accessibility"].map((t) => (
                    <button key={t} onClick={() => open(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </footer>
          <div className="mobile-action-bar">
            <button onClick={() => open("Request an appointment")}>
              <Icon name="calendar" size={18} /> Book appointment
            </button>
            <button onClick={() => open("Emergency information")}>
              <Icon name="phone" size={18} /> Emergency
            </button>
          </div>
        </>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby="dialog-title"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <button
          className="dialog-close icon-button"
          onClick={close}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
        <div className="eyebrow">ODA ROBA HOSPITAL</div>
        <h2 id="dialog-title">{modal}</h2>
        {modal === "Emergency information" ? (
          <div className="emergency-dialog">
            <span className="emergency-icon">
              <Icon name="phone" size={26} />
            </span>
            <h3>Do not wait for an online response.</h3>
            <p>
              If you or someone else may be experiencing a medical emergency,
              seek immediate help at the nearest emergency department or contact
              verified local emergency services.
            </p>
            <div className="notice">
              <strong>Hospital emergency phone: pending verification</strong>
              <p>
                No telephone number or emergency service hours have been
                provided. These must be confirmed before public launch.
              </p>
            </div>
          </div>
        ) : modal === "Find a doctor" ? (
          <>
            <p>
              Search pattern for the future verified medical team directory.
            </p>
            <label htmlFor="doctor-search">Search by name or specialty</label>
            <input
              id="doctor-search"
              placeholder="e.g. general medicine"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="notice">
              <strong>
                {search
                  ? `No verified profiles matching “${search}”`
                  : "Verified doctor profiles coming soon"}
              </strong>
              <p>No names or credentials are fabricated in this prototype.</p>
            </div>
          </>
        ) : modal === "Patient portal" ? (
          <>
            <p>
              Secure patient services are separate from this public website.
            </p>
            <div className="notice">
              <Icon name="shield" size={25} />
              <h3>Portal connection pending</h3>
              <p>
                A verified, authenticated hospital portal must be connected
                before access to records, laboratory results, prescriptions, or
                billing is offered. Please do not enter patient information
                here.
              </p>
            </div>
            <button className="button" onClick={() => startBooking()}>
              Book an appointment <Icon name="arrow" size={16} />
            </button>
          </>
        ) : (
          <>
            <span className="example-label">
              INFORMATION AWAITING VERIFICATION
            </span>
            <p className="dialog-intro">
              {modal === "All services"
                ? "The final service directory will help visitors browse and find verified hospital services."
                : modal === "All departments"
                  ? "The final department directory will connect services, verified care teams, and visitor information."
                  : "Official information from Oda Roba Hospital will be available here once verified."}
            </p>
            <div className="notice">
              <h3>Accurate information comes first.</h3>
              <p>
                {modal === "Contact the hospital" || modal === "Get directions"
                  ? "Location: Bale Robe, Oromia, Ethiopia. The exact address, contact number, opening hours, and map coordinates await confirmation."
                  : "Hospital-approved content will be added before public launch. No unverified services, policies, credentials, or medical claims are presented as facts."}
              </p>
            </div>
            <button className="button secondary" onClick={close}>
              Back to the website <Icon name="arrow" size={16} />
            </button>
          </>
        )}
      </dialog>
    </>
  )
}
