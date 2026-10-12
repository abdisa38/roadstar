# Specimen Collection and Verification Workspace — Implementation Summary (Prompt 32)

**Completion Date:** October 12, 2026  
**Module:** Specimen Collection and Verification  
**Route:** `/staff/laboratory/specimen-collection`  
**Status:** ✅ Model Complete, Components Pending Integration

---

## Implementation Overview

Successfully created comprehensive data model for specimen collection and verification workflow. This module extends Laboratory Orders (Prompt 30) with dedicated workspace for lab staff to collect, verify, and track specimens through the laboratory workflow.

---

## Files Created

### Core Module Files

**1. Specimen Model (`src/laboratory/specimen-model.ts`) - 530 lines**
- Complete TypeScript type definitions for specimen workflow
- 6 specimen status states (awaiting-collection → verified/rejected)
- Collection draft and rejection draft types
- 7 rejection reasons
- 5 collection locations
- Sample collection context with role-based permissions
- 5 demonstration collection requests
- Comprehensive utility functions
- Validation logic for collection and rejection

---

## Key Features Designed

### 1. Specimen Status Workflow (6 States)

**Complete Workflow:**
1. **Awaiting Collection** - Request submitted, specimen not yet collected
2. **Collection Started** - Staff member has begun collection process (optional state)
3. **Collected — Verification Pending** - Specimen collected, awaiting verification
4. **Verified** - Specimen verified and ready for processing
5. **Rejected** - Specimen cannot be accepted (with documented reason)
6. **Cancelled** - Request cancelled, no specimen needed

**Status Transitions:**
- Awaiting Collection → Collection Started → Collected (Pending) → Verified
- Exception paths: → Rejected (from any pre-verified state)
- Cancelled requests cannot proceed through normal collection

### 2. Collection Request Data

**Patient Information:**
- Patient ID, name, age, sex
- Date of birth (for verification)
- Encounter reference

**Request Information:**
- Request ID
- Requested tests (can be multiple for same specimen)
- Test codes and names
- Specimen requirements per test:
  - Specimen type (blood, urine, etc.)
  - Required volume
  - Container type
  - Special instructions (fasting, timing, etc.)
- Requesting clinician
- Request date
- Priority (routine/urgent/stat)

**Specimen Status Tracking:**
- Current specimen status
- Specimen identifier (barcode/label)
- Collected by (staff member)
- Collection date/time
- Verified by (may be different from collector)
- Verification date
- Rejection information (if rejected)

### 3. Collection Draft (Form Data)

**Patient Confirmation:**
- Patient ID verification
- Patient name confirmation
- Required checkbox: "I have confirmed this is the correct patient"

**Specimen Details:**
- Specimen type (from test catalogue)
- Specimen identifier/barcode
- Collection date
- Collection time
- Collection location (outpatient lab, ward, ER, OR, ICU, other)
- Collection notes (optional observations)
- Collected by (auto-populated from current user)

**Validation Rules:**
- Patient confirmation required
- Specimen type required
- Specimen identifier required (unique)
- Collection date and time required
- Collection location required

### 4. Rejection Workflow

**Rejection Reasons (7 Configured Options):**
1. Incorrect specimen type
2. Container or labeling problem
3. Insufficient specimen quantity
4. Damaged or leaking container
5. Labeling issue
6. Contaminated specimen
7. Other (requires detailed notes)

**Rejection Draft:**
- Request ID
- Specimen ID (if specimen was collected)
- Rejection reason (required)
- Rejection notes (required if "other" selected)
- Rejected by (auto-populated)
- Rejection date (auto-populated)

**Rejection Validation:**
- Reason required
- Notes required for "other" reason
- Cannot reject already-verified specimen
- Rejection is traceable (audit trail preserved)

### 5. Role-Based Permissions

**Specimen Collection Context:**
- Current user identity
- Current role (lab-technician, phlebotomist, nurse, other)
- Can collect permission
- Can verify permission
- Can reject permission
- Requires separate verification flag

**Permission Rules:**
- **canCollect:** Can record specimen collection
- **canVerify:** Can verify collected specimens
- **canReject:** Can reject unsuitable specimens
- **requiresSeparateVerification:** If true, collector cannot verify their own collection

**Sample Demo User:**
- Name: "Nurse Sarah Bekele"
- Role: nurse
- Can collect: true
- Can verify: true
- Can reject: true
- Requires separate verification: false (can verify own collections)

### 6. Collection Queue Features

**Search and Filter:**
- Search by patient ID, patient name, or request ID
- Filter by specimen status
- Filter by date (today, yesterday, week, all)
- Sort by request date, patient name

**Queue Display:**
- Request ID
- Patient ID and name
- Encounter reference
- Requested tests
- Specimen type required
- Request date/time
- Requesting clinician
- Specimen status
- Primary action button (based on status and permissions)

### 7. Safety Features

**Patient Identity Verification:**
- Patient ID prominently displayed
- Patient name visible
- Date of birth shown for verification
- Required confirmation checkbox

**Request Verification:**
- Request ID clearly shown
- Requested tests list visible
- Specimen requirements displayed
- Requesting clinician documented

**Specimen Tracking:**
- Unique specimen identifier required
- Collection date/time captured
- Collector identity recorded
- Verification separate from collection (configurable)
- Cannot advance rejected specimen without recollection

**Audit Trail:**
- All actions timestamped
- All actions attributed to user
- Status transitions preserved
- Rejection reasons documented
- Cannot silently delete rejected specimens

### 8. Validation and Error Handling

**Collection Form Validation:**
- Patient confirmation not checked → Error: "You must confirm the patient identity before proceeding"
- Missing specimen type → Error: "Specimen type is required"
- Missing specimen ID → Error: "Specimen identifier is required"
- Missing date → Error: "Collection date is required"
- Missing time → Error: "Collection time is required"
- Missing location → Error: "Collection location is required"

**Rejection Validation:**
- No reason selected → Error: "Rejection reason is required"
- "Other" selected without notes → Error: "Please provide details when selecting 'Other' as rejection reason"

**Permission Checks:**
- Cannot start collection without canCollect permission
- Cannot verify without canVerify permission
- Cannot verify own collection if separate verification required
- Cannot reject without canReject permission
- Cannot collect for cancelled requests

---

## Sample Data Specifications

### Demo Collection Requests (5 Requests)

**Request 1: LABREQ-2026-00145**
- Patient: Hana Mohammed (ORH-2026-00124), 34F
- Tests: CBC, ESR (both use whole blood, EDTA tube)
- Clinician: Dr. Abebe Tadesse
- Priority: Routine
- Status: Awaiting Collection

**Request 2: LABREQ-2026-00156**
- Patient: Ahmed Hassan (ORH-2026-00089), 52M
- Tests: Fasting Blood Glucose, Lipid Profile (both serum, fasting required)
- Clinician: Dr. Marta Alemayehu
- Priority: Routine
- Status: Awaiting Collection
- Special Instructions: Patient must be fasting 8-12 hours

**Request 3: LABREQ-2026-00148**
- Patient: Fatima Yusuf (ORH-2026-00112), 28F
- Test: Urinalysis (urine, clean-catch midstream)
- Clinician: Dr. Abebe Tadesse
- Priority: Routine
- Status: Awaiting Collection

**Request 4: LABREQ-2026-00122**
- Patient: Hana Mohammed (ORH-2026-00124), 34F
- Test: Malaria Rapid Test
- Clinician: Dr. Abebe Tadesse
- Priority: Urgent
- Status: **Verified** (already collected and verified)
- Specimen: SPEC-2026-00089
- Collected by: Nurse Sarah Bekele

**Request 5: LABREQ-2026-00163**
- Patient: Dawit Tesfaye (ORH-2026-00098), 19M
- Test: Blood Culture (strict aseptic technique, 2 bottles)
- Clinician: Dr. Solomon Girma
- Priority: Urgent
- Status: **Collected — Verification Pending**
- Specimen: SPEC-2026-00091
- Collected by: Phlebotomist Ahmed Ali
- Awaiting verification by another staff member

---

## Workflow Implementation

### Collection Workflow

1. **View Queue:**
   - Staff sees list of requests awaiting collection
   - Filter/search to find specific request
   - Click "Start Collection" button

2. **Patient Confirmation:**
   - System displays patient ID, name, DOB
   - System displays request ID, requested tests
   - System displays specimen requirements
   - Staff confirms patient identity (checkbox required)

3. **Record Collection:**
   - Enter/scan specimen identifier
   - Confirm collection date/time (auto-populated)
   - Select collection location
   - Add collection notes (optional)
   - Review all information

4. **Submit Collection:**
   - System validates all required fields
   - System creates specimen record
   - Status changes to "Collected — Verification Pending"
   - Specimen ready for verification

5. **Verify Specimen:**
   - Different staff member (if separate verification required)
   - Reviews specimen matches request
   - Confirms specimen identifier
   - Clicks "Verify Specimen"
   - Status changes to "Verified"
   - Specimen ready for processing

### Rejection Workflow

1. **Identify Problem:**
   - Staff identifies unsuitable specimen
   - Clicks "Reject Specimen"

2. **Document Rejection:**
   - Select rejection reason from list
   - Add detailed notes (required for "other")
   - Review patient and request information

3. **Confirm Rejection:**
   - Confirm rejection will change specimen status
   - System records rejection with reason
   - Status changes to "Rejected"
   - Request remains open for recollection or cancellation

---

## Integration Points

### With Laboratory Orders (Prompt 30)

**Data Flow:**
- Laboratory request created by clinician
- Request includes required tests and specimen type
- Request status: "Requested" or "Specimen Collection Pending"
- Specimen Collection module shows these requests
- After verification, request status → "Specimen Collected"
- Laboratory can begin processing

**Shared Data:**
- Request ID
- Patient information
- Test requirements
- Specimen type
- Requesting clinician

### Future Integration (Out of Scope for Prompt 32)

**Laboratory Processing:**
- Verified specimens flow to lab processing queue
- Lab technicians perform tests on verified specimens
- Results entered in separate result-entry module

**Clinician Notification:**
- Rejected specimens may trigger clinician notification
- Recollection orders may be needed
- Status updates visible in Laboratory Orders module

---

## Technical Architecture

### Type System

**Core Types:**
- `SpecimenStatus` - 6 status states
- `SpecimenCollection` - Complete specimen record
- `CollectionRequest` - View of request needing collection
- `CollectionDraft` - Form data during collection
- `RejectionDraft` - Form data during rejection
- `SpecimenCollectionContext` - User permissions and role
- `CollectionQueueState` - Complete workspace state

**Utility Functions:**
- Status label and class getters
- Rejection reason labels
- Collection location labels
- Empty draft creators
- Validation functions (collection and rejection)
- Permission check functions
- Date/time formatters
- Specimen ID generator

### Permission Model

**Role-Based Actions:**
```typescript
canStartCollection(request, context): boolean
  - Checks canCollect permission
  - Checks request is awaiting collection
  
canVerify(request, context): boolean
  - Checks canVerify permission
  - Checks request is collected pending verification
  - Checks not own collection if separate verification required
  
canReject(request, context): boolean
  - Checks canReject permission
  - Checks request is in rejectable status
```

### State Management

**Queue State:**
- List of collection requests
- Selected request (for detail view)
- Active collection draft
- Active rejection draft
- Search query
- Status filter
- Date filter
- Save state

**Workflow States:**
- Default queue view
- Request selected
- Collection form open
- Verification review
- Rejection dialog
- Success/error states
- Loading states

---

## UI Components (Designed, Not Yet Implemented)

### Main Components

1. **CollectionQueueHeader**
   - Breadcrumb navigation
   - Page title and description
   - Pending count indicator
   - Search field

2. **CollectionQueueTable**
   - Request rows with key information
   - Status badges
   - Action buttons (Start Collection, Verify, Reject)
   - Search and filter controls
   - Empty state
   - No results state

3. **RequestDetailsPanel**
   - Patient identification block
   - Request information
   - Test requirements list
   - Specimen requirements
   - Primary action button

4. **CollectionForm**
   - Patient confirmation section
   - Specimen information fields
   - Collection details
   - Notes field
   - Validation error display

5. **VerificationReview**
   - Summary of all collection information
   - Confirmation controls
   - Edit and submit buttons

6. **RejectionDialog**
   - Request and patient information
   - Rejection reason selector
   - Notes field
   - Confirm/Cancel actions

7. **CollectionSuccessDialog**
   - Success message
   - Specimen ID
   - Next actions

### Supporting Components

- Status badges (color-coded by status)
- Priority badges
- Test list display
- Specimen requirements list
- Date/time pickers
- Location selector
- Validation error messages
- Loading indicators
- Empty states

---

## Responsive Design

### Desktop (>1024px)
- Two-column layout: queue list + details panel
- Full table with all columns
- Side panel for request details
- Modal for collection form

### Tablet (768-1024px)
- Single column with drawer for details
- Condensed table
- Full-screen collection form

### Mobile (<768px)
- Stacked request cards
- Full-screen views
- Touch-friendly controls
- Simplified layout

---

## Clinical Safety Features

✅ Patient identity verification required  
✅ Request confirmation before collection  
✅ Unique specimen identifiers  
✅ Date/time stamps for all actions  
✅ Staff member attribution  
✅ Cannot verify own collection (configurable)  
✅ Rejection requires documented reason  
✅ Audit trail preserved  
✅ Cannot advance rejected specimens  
✅ Cannot collect cancelled requests  
✅ Clear status distinctions  
✅ Permission-based actions  

---

## Next Steps

### For Implementation

1. **Create UI Components:**
   - SpecimenCollectionPage.tsx (main component)
   - specimen-components.tsx (all UI components)
   - specimen-collection.css (complete styling)

2. **Integration:**
   - Add route to App.tsx
   - Link from Laboratory Orders module
   - Connect to laboratory workflow

3. **Testing:**
   - Collection workflow
   - Verification workflow
   - Rejection workflow
   - Permission checks
   - Validation
   - Responsive design

### For Future Enhancement

1. **Barcode Integration:**
   - Scan specimen labels
   - Auto-populate specimen ID
   - Print specimen labels

2. **Advanced Features:**
   - Batch collection for same patient
   - Collection reminders/alerts
   - Specimen tracking (location, temperature)
   - Quality control checks

3. **Reporting:**
   - Collection metrics
   - Rejection analysis
   - Turnaround time tracking

---

## Status Summary

**Completed:**
- ✅ Complete data model (530 lines)
- ✅ Type system with 6 status states
- ✅ Sample data with 5 demonstration requests
- ✅ Validation logic
- ✅ Permission model
- ✅ Utility functions
- ✅ Documentation

**Pending:**
- ⏳ UI component implementation
- ⏳ CSS styling
- ⏳ Route integration
- ⏳ Full testing

**Total Implementation So Far:**
- 530 lines of TypeScript model code
- Complete type safety
- 6 specimen status states
- 7 rejection reasons
- 5 collection locations
- Role-based permission system

---

**Module:** Specimen Collection and Verification Workspace  
**Route:** `/staff/laboratory/specimen-collection`  
**Integration:** Extends Laboratory Orders (Prompt 30)  
**Next Module:** Laboratory result entry or processing workspace

---

**Implementation completed by ORHIMS Development Team**  
**Date: October 12, 2026**  
**Status: Model complete, UI components ready for implementation**
