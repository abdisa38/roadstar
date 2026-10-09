# 04 — Reception & Patient Operations
## Prompt 20 — Patient Profile & Unified Patient Record

### Integration & Navigation
- **Entry point**: Accessible via `/staff/reception/module/profile/:id` (or `/staff/permissions/module/profile/:id`).
- **Breadcrumb**: `Workspace / Patient Operations / Patient Directory / Patient Profile` allows returning to the Patient Directory seamlessly without losing application state.
- **Handoff from Directory**: Selecting any patient from the Patient Directory (`/staff/reception/module/directory`) and clicking **"Open Patient Profile"** loads their complete unified profile.

---

## 1. Core Data Model & Separation of Concerns

The interface enforces strict architectural boundaries between distinct healthcare concepts:

1. **Patient**: The person's long-term demographic identity (`UnifiedPatientProfile.demographics`).
2. **Appointment**: A planned booking for a scheduled service (`PatientAppointment`).
3. **Encounter / Visit**: A distinct, independent episode of clinical care with its own date, status, reason for visit, vitals, assessment, and notes (`PatientEncounter`).
4. **Clinical Record**: Encounter-linked diagnoses, allergies, and clinical observations (`ClinicalRecord`).
5. **Laboratory Orders & Results**: Diagnostic orders are strictly distinguished from verified results with reference ranges (`PatientLabRecord`).
6. **Prescriptions**: Medication orders are distinct from physical dispensing records (`PatientPrescription`).
7. **Billing & Financials**: Invoices, fees, and payments are partitioned under cashier permissions. Financial status does not govern clinical care eligibility.

*Encounters and appointments are never merged into an undifferentiated continuous record.*

---

## 2. Profile Tabs & Layout

### A. Patient Identity Header
- Initials avatar placeholder (`HE` for Hana Example).
- Full Patient Name, Monospaced Patient ID (`DEMO-EX-101`), Record Status pill (`Active Demographic Record`).
- DOB / Age, Demographic category (`Adult`), Masked Contact (`••• ••• 0101`), Registration date.
- Contextual actions: `Edit Demographics`, `Schedule Appointment`, `Register Visit`.
- Possible Duplicate Warning Banner when identity matching triggers an alert.

### B. 8 Dedicated Navigation Tabs
1. **Overview (Default)**:
   - Left: Labeled demographic cards, registration metadata, data completeness indicator.
   - Right: Chronological activity feed logging appointments, encounters, lab results, prescriptions, and billing.
2. **Demographics**:
   - Structured display mode with grouped sections.
   - Inline edit form with field validation (required given/family names, DOB/age formatting, phone syntax, emergency contact).
   - Unsaved changes confirmation dialog if cancelling dirty forms.
   - Saving state spinner and success notification.
3. **Appointments**:
   - Tabular and card list of scheduled visits with status badges (`Scheduled`, `Confirmed`, `Completed`, `Cancelled`).
   - Detailed modal preview for individual booking records.
4. **Encounters / Visits**:
   - Separate, identifiable visit cards/table entries with Encounter ID (`ENC-2026-088`), clinician, department, and status.
   - View Visit Summary modal displaying vitals and specific clinical notes for that encounter.
5. **Clinical History**:
   - Permission-aware: Restricted for non-clinical roles (Receptionist, Cashier, Inventory).
   - Authorized view shows documented allergies, encounter-linked diagnoses, and clinical notes.
6. **Laboratory**:
   - Permission-aware: Diagnostic orders vs. reported results, reference ranges, specimen flags.
7. **Prescriptions**:
   - Permission-aware: Prescribed medication details, dosage, instructions, prescriber, and dispensing pharmacist timestamp.
8. **Billing**:
   - Permission-aware: Invoices, Ethiopian Birr (ETB) amounts, payment status, and receipt numbers.

---

## 3. Required UI States (20 States Represented)

1. **Default Profile**: Standard view with rich records (`DEMO-EX-101`).
2. **Incomplete Demographic Info**: Clean handling of missing phone/DOB (`DEMO-EX-102`).
3. **No Appointments**: Empty appointments card with primary schedule action.
4. **No Encounters**: Helpful empty state explaining visits appear once triaged or registered.
5. **No Lab / Prescriptions**: Distinct empty states per diagnostic section.
6. **Extensive Historical Records**: Multi-visit history fixture (`DEMO-EX-103`).
7. **Loading Profile**: Skeleton loader with `aria-busy="true"`.
8. **Profile Retrieval Failure**: Error card with `Retry` action.
9. **Patient Not Found**: Graceful fallback when invalid patient ID is requested.
10. **Permission Denied**: `AccessDeniedPage` if `directory` or `registration` grant is missing.
11. **Restricted Tab / Section**: `RestrictedSectionState` for Clinical, Lab, Rx, or Billing tabs when role lacks grants.
12. **Demographic Edit Mode**: Interactive form with inline inputs.
13. **Validation Failure**: Inline error messages under missing required fields.
14. **Saving Changes**: Button loading indicator.
15. **Successful Save**: Dismissible green status banner.
16. **Unsaved Changes Confirmation**: Native `<dialog>` modal before discarding dirty edits.
17. **Possible Duplicate Warning**: Persistent caution banner with verification guidance.
18. **Encounter Drilldown Modal**: Modal displaying a single visit's vitals and notes.
19. **Appointment Drilldown Modal**: Modal displaying single booking details.
20. **Session Expired**: Connected to ORHIMS session expiry screen.

---

## 4. Open Hospital Decisions

1. **Patient Identifier Standardization**: The demonstration uses `DEMO-EX-###`. Official format (e.g., `ORH-YYYY-######`) requires hospital approval.
2. **Clinical Role Permissions**: Confirm specific authorization thresholds for viewing historical psychiatric, HIV, or sensitive maternal records.
3. **Duplicate Resolution Authority**: Confirm which administrative roles (e.g., Super Administrator or Chief Medical Records Officer) possess authority to investigate duplicate warnings and merge records.
