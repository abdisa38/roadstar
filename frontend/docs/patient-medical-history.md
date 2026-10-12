# Patient Medical History User Guide (Prompt 27)

## Overview

The Patient Medical History module provides authorized clinicians with comprehensive access to a patient's historical medical records. This interface enables physicians to review previous encounters, documented conditions, allergies, medications, procedures, and laboratory results to inform current clinical decision-making.

**Access URL**: `http://localhost:8443/staff/medical-history`

## Purpose

Enable clinicians to:
- Review comprehensive patient medical history
- Access chronological encounter timeline
- View documented medical conditions and diagnoses
- Review allergy information and verification status
- Examine medication history (active and historical)
- Access procedure and surgical history
- Review family and social history
- View laboratory results and diagnostic reports
- Access uploaded clinical documents

---

## Key Safety Features

### 1. Patient Identity Verification
- Patient name, ID, and demographics always visible at page top
- Current encounter clearly distinguished from historical records
- Prevents wrong-patient record review

### 2. Allergy Information Clarity
- Three distinct states:
  - **No documented allergies** (empty records)
  - **Verified no known allergies** (explicitly documented)
  - **Documented allergies** (with details and severity)
- Never assumes "no allergies" from missing data

### 3. Medication Status Clarity
- Clear distinction between active, inactive, discontinued, and completed medications
- Historical prescriptions not automatically treated as current
- Prescription dates and status always visible

### 4. Record Traceability
- Every record shows:
  - Recording date
  - Recording clinician (when available)
  - Associated encounter
  - Verification status (when applicable)

---

## Page Layout

### Header Section
- **Return to Clinical Workspace** button (top-left)
- **Patient Identity**:
  - Patient name (large, prominent)
  - Patient ID
  - Date of birth
  - Age
  - Sex
- **Current Encounter** (highlighted): Clearly separated from historical records

### Main Content Area
Two-column layout:

1. **Left Sidebar** (240px):
   - Navigation tabs for different history sections
   - Record counts for each section
   - Active section highlighted in green

2. **Content Area** (remainder):
   - Selected section content
   - Search and filter controls
   - Historical records display
   - Detail dialogs

---

## Navigation Sections

### 1. Overview
**Purpose**: Quick summary of available medical history

**Content**:
- Healthcare encounters count and last visit date
- Medical conditions count
- Allergy count and verification status
- Active vs historical medications count
- Procedures count
- Recent laboratory results count
- Documents count
- Family and social history availability

**Features**:
- Summary cards with key statistics
- Quick links to detailed sections
- Recent encounters preview (last 3)
- Active conditions list
- Documented allergies alert
- Current medications list

### 2. Encounters
**Purpose**: Chronological timeline of previous healthcare visits

**Content Per Encounter**:
- Encounter ID
- Date and time
- Visit type (Follow-up, General Consultation, Emergency, etc.)
- Reason for visit
- Status (Completed, Cancelled, No Show)
- Clinician name
- Department
- Clinical summary
- Diagnoses count
- Clinical notes count

**Features**:
- Timeline visualization with date markers
- Search by type, reason, clinician, or department
- Date range filter (All Time, Last Month, 6 Months, 1 Year, 5 Years)
- Click encounter to view full details

### 3. Medical Conditions
**Purpose**: Review documented medical conditions and diagnoses

**Content Per Condition**:
- Condition name
- Status (Active, Inactive, Completed)
- Recorded date
- Associated encounter ID and date
- Recording clinician
- ICD code (when available)
- Clinical notes

**Features**:
- Search by condition name, clinician, or notes
- Status filter (All, Active, Inactive, Completed)
- Color-coded status badges
- Click condition to view full details

### 4. Allergies
**Purpose**: Critical allergy information for patient safety

**Content Per Allergy**:
- Allergen name
- Allergen type (Medication, Food, Environmental, Other)
- Reaction description
- Severity (Mild, Moderate, Severe, Life-Threatening)
- Recorded date
- Last reviewed date
- Verification status (Verified, Not Verified)
- Recording clinician
- Detailed notes

**Features**:
- Color-coded severity badges:
  - Yellow = Mild
  - Orange = Moderate
  - Red = Severe
  - Dark Red = Life-Threatening
- Prominent visual alerts for documented allergies
- Clear distinction between verified and unverified allergies
- Empty state clarifies "no documented allergies ≠ no allergies"

### 5. Medications
**Purpose**: Review medication and prescription history

**Content Per Medication**:
- Medication name and strength
- Formulation (Tablet, Capsule, Cream, etc.)
- Dose
- Frequency
- Route (Oral, Topical, IV, etc.)
- Status (Active, Inactive, Discontinued, Completed, Unknown)
- Prescription date
- Start date and end date (if applicable)
- Prescriber name
- Associated encounter
- Indication (reason for prescription)
- Special instructions

**Features**:
- Search by medication name, indication, or prescriber
- Status filter (All, Active, Inactive, Completed)
- Color-coded status badges
- Dosing information in dedicated panel
- Clear start and end dates for completed medications
- Click medication to view full details

### 6. Procedures
**Purpose**: Review documented procedures and surgical history

**Content Per Procedure**:
- Procedure name
- Procedure date
- Performed by (clinician)
- Facility
- Associated encounter
- Procedure notes
- Outcome

**Features**:
- Chronological listing
- Clear procedure details
- Outcome documentation
- Empty state clarifies missing records don't confirm absence of procedures

### 7. Family & Social History
**Purpose**: Access family medical history and social history information

**Family History Per Record**:
- Relationship (Mother, Father, Sibling, etc.)
- Condition
- Age at diagnosis (if known)
- Age at death (if applicable)
- Recorded date
- Recording clinician
- Notes

**Social History Per Category**:
- Category (Smoking, Alcohol, Substance Use, Occupation, Living Situation, Other)
- Status
- Details
- Recorded date
- Last updated date
- Recording clinician

**Features**:
- Separate subsections for family and social history
- Clear empty states when not recorded
- Organized by category

### 8. Laboratory
**Purpose**: Review laboratory test results and diagnostic reports

**Content Per Lab Result**:
- Test name
- Status (Ordered, Collected, Pending, Completed, Cancelled)
- Ordered date
- Collection date (if collected)
- Result date (if completed)
- Ordering clinician
- Associated encounter
- Result summary (if completed)
- Abnormal flag (yes/no)

**Features**:
- Search by test name or clinician
- Color-coded status badges
- Abnormal results highlighted with red background
- Timeline showing ordered → collected → result dates
- Click result to view full details

### 9. Documents
**Purpose**: Access uploaded clinical documents and reports

**Content Per Document**:
- Document title
- Document type (Imaging Report, Pathology Report, etc.)
- Upload date
- Uploaded by
- Related encounter (if applicable)
- File size
- File format (PDF, DOCX, etc.)

**Features**:
- Visual document icons
- Clear file metadata
- Click to view document details (download in demo)
- Empty state when no documents available

---

## Step-by-Step Usage

### Accessing Medical History

**From Clinical Workspace**:
1. Navigate to Clinical Workspace (`/staff/clinical`)
2. Click "Medical History" tab in left navigation
3. Or click direct link to view patient history

**Direct URL**:
```
http://localhost:8443/staff/medical-history
```

**Demo Patient**: Hana Mohammed (ORH-2026-00124)

---

### Workflow 1: Reviewing Patient Before Consultation

**Scenario**: Doctor preparing for patient appointment

**Steps**:
1. Access Medical History from Clinical Workspace
2. Review **Overview** section:
   - Note total encounters (8 previous visits)
   - Check allergy status (1 documented allergy: Penicillin)
   - Review active conditions (Essential Hypertension)
   - Note active medications (Amlodipine 5mg, Vitamin D3)
3. Click **"View allergy details"** to review:
   - Penicillin allergy, moderate severity
   - Reaction: Rash, itching, urticaria
   - Verified status
4. Click **Encounters** tab:
   - Review last visit (December 15, 2025)
   - Note: Blood pressure well controlled
5. Click **Medical Conditions** tab:
   - Confirm Essential Hypertension (Active)
   - Note Vitamin D Deficiency (Inactive - corrected)
6. Click **"Return to Clinical Workspace"** to begin consultation

**Time**: 2-3 minutes

---

### Workflow 2: Reviewing Medication History Before Prescribing

**Scenario**: Doctor needs to prescribe antibiotic, must check allergy history

**Steps**:
1. Navigate to **Allergies** tab
2. Review documented allergies:
   - **Penicillin** - Moderate severity
   - Reaction: Rash, itching, urticaria within 2 hours
   - Verified by Dr. Ahmed Hussein on March 15, 2024
   - Note: Patient advised to avoid all penicillin-class antibiotics
3. Navigate to **Medications** tab
4. Set filter to "Active" to see current medications
5. Review active medications for interactions:
   - Amlodipine 5mg daily (for hypertension)
6. Make informed prescribing decision:
   - Avoid penicillin-class antibiotics
   - Consider macrolides or fluoroquinolones
   - Check for interactions with Amlodipine

**Time**: 1-2 minutes

**Safety Note**: Always review allergy section before prescribing medications.

---

### Workflow 3: Investigating Patient's Chronic Condition

**Scenario**: Review hypertension management over time

**Steps**:
1. Navigate to **Medical Conditions** tab
2. Locate "Essential Hypertension" record:
   - Status: Active
   - Diagnosed: September 20, 2025
   - Diagnosed by: Dr. Meron Bekele
   - ICD Code: I10
3. Click **"View Full Details"**:
   - Notes: "Stage 1 hypertension. BP readings consistently 140-150/85-95. No target organ damage."
   - Associated encounter: ENC-2025-09-321
4. Navigate to **Encounters** tab
5. Search: "hypertension" to find related visits:
   - September 2025: Initial diagnosis, started Amlodipine
   - December 2025: Follow-up, BP well controlled
6. Navigate to **Medications** tab
7. Locate Amlodipine prescription:
   - Started: September 20, 2025
   - Status: Active
   - Dose: 5mg once daily
   - Indication: Essential Hypertension
8. Navigate to **Laboratory** tab
9. Review related lab results:
   - Lipid Profile (September 2025): Normal
   - Complete Blood Count (December 2025): Normal

**Time**: 3-5 minutes

**Result**: Complete picture of hypertension diagnosis, treatment, and monitoring

---

### Workflow 4: Reviewing Previous Encounter Details

**Scenario**: Check what happened at patient's last visit

**Steps**:
1. Navigate to **Encounters** tab
2. Locate most recent encounter:
   - Date: December 15, 2025
   - Type: Follow-up Consultation
   - Reason: Hypertension follow-up
   - Status: Completed
   - Clinician: Dr. Abebe Tadesse
3. Click **"View Encounter Details"**
4. Review detail dialog:
   - Encounter ID: ENC-2025-12-543
   - Department: Internal Medicine
   - Clinical Summary: "Blood pressure well controlled on current medication. Continue Amlodipine 5mg daily."
   - 1 diagnosis recorded
   - 1 clinical note
5. Click **"Close"** to return to timeline
6. Review earlier encounters by scrolling timeline
7. Use date range filter to focus on recent visits:
   - Select "Last 6 Months" from filter dropdown
8. Review filtered encounters

**Time**: 2-3 minutes

---

### Workflow 5: Searching Specific Information

**Example A: Finding All Visits About Specific Symptom**

1. Navigate to **Encounters** tab
2. Type "gastroenteritis" in search box
3. Review filtered results:
   - November 22, 2024: Emergency Visit
   - Treated with IV fluids and ORS
   - Symptoms resolved
4. Click encounter to view full details

**Example B: Finding Medication by Name**

1. Navigate to **Medications** tab
2. Type "vitamin" in search box
3. Review filtered results:
   - Vitamin D3 50,000 IU capsules
   - Status: Completed
   - Prescribed June-September 2025
4. Click medication to view full prescription details

**Example C: Finding Lab Results**

1. Navigate to **Laboratory** tab
2. Type "vitamin" in search box
3. Review filtered results:
   - Serum Vitamin D test (June 2025)
   - Result: 18 ng/mL (Low)
   - Flagged as abnormal
4. Click result to view full details

---

### Workflow 6: Using Filters Effectively

**Date Range Filtering (Encounters)**:
1. Navigate to **Encounters** tab
2. Open "Date Range" dropdown
3. Select filter option:
   - **All Time**: Shows all recorded encounters
   - **Last Month**: Last 30 days
   - **Last 6 Months**: Last 180 days
   - **Last Year**: Last 365 days
   - **Last 5 Years**: Last 1825 days
4. Timeline updates to show only encounters in range
5. Click **"Clear Filters"** to reset

**Status Filtering (Medications)**:
1. Navigate to **Medications** tab
2. Open "Status" dropdown
3. Select filter option:
   - **All Statuses**: Shows everything
   - **Active**: Currently prescribed medications
   - **Inactive**: No longer active but not explicitly discontinued
   - **Completed**: Finished course as prescribed
4. List updates to show only matching medications
5. Use search + status filter together for precise results

---

## Understanding Record States

### Allergy Status

**No Documented Allergies**:
```
Empty allergy list
Message: "No allergies have been documented in this patient's 
medical history. This does not confirm the absence of allergies—
allergy information may not have been recorded or verified."
```
**Meaning**: Absence of data, not confirmation of no allergies

**Verified No Known Allergies**:
```
Explicitly documented: "No Known Allergies"
Verification status: Verified
Last reviewed: [date]
```
**Meaning**: Clinician verified patient has no known allergies

**Documented Allergies**:
```
Allergen: Penicillin
Severity: Moderate
Status: Verified ✓
```
**Meaning**: Patient has confirmed documented allergies

### Medication Status

**Active**: Currently prescribed, patient should be taking
**Inactive**: Was active but status unclear (not explicitly stopped)
**Discontinued**: Explicitly stopped by clinician
**Completed**: Finished prescribed course (e.g., antibiotics)
**Unknown**: Status not recorded or unclear

### Encounter Status

**Completed**: Patient attended, visit finished
**Cancelled**: Appointment cancelled before visit
**No Show**: Patient did not attend scheduled appointment

### Laboratory Status

**Ordered**: Test ordered but not yet collected
**Collected**: Sample collected, awaiting processing
**Pending**: Sample processing, results not ready
**Completed**: Results available
**Cancelled**: Test cancelled before completion

---

## Viewing Detail Dialogs

### Opening Detail Dialogs

Most records have a **"View Full Details"** or **"View Details"** button:
- Encounters: Opens encounter detail dialog
- Conditions: Opens condition detail dialog
- Allergies: Opens allergy detail dialog
- Medications: Opens medication detail dialog
- Procedures: Opens procedure detail dialog
- Laboratory: Opens laboratory detail dialog
- Documents: Opens document detail dialog (download in demo)

### Dialog Structure

**Header**:
- Dialog title
- Close button (X, top-right)

**Body**:
- Organized sections with labeled fields
- All available information displayed
- Read-only (cannot edit historical records)

**Footer**:
- Close button
- Additional actions (e.g., Download for documents)

### Closing Dialogs

Three methods:
1. Click **"Close"** button in footer
2. Click **X** in header
3. Click outside dialog (on gray overlay)

---

## Visual Design Elements

### Color Coding

**Status Badges**:
- **Green** (`#d1fae5`): Active, Completed, Verified
- **Blue** (`#dbeafe`): Ordered, Pending, In Progress
- **Yellow** (`#fef3c7`): Pending Results, Not Verified
- **Gray** (`#f1f5f9`): Inactive, Unknown
- **Red** (`#fee2e2`): Cancelled, Discontinued

**Allergy Severity**:
- **Yellow** (`#fef08a`): Mild
- **Orange** (`#fed7aa`): Moderate
- **Red** (`#fecaca`): Severe
- **Dark Red** (`#ef4444`): Life-Threatening

**Abnormal Lab Results**:
- **Red background** (`#fef2f2`): Indicates abnormal result
- **Red alert icon**: Draws attention to flag

### Icons

**Section Icons**:
- Home: Overview
- Calendar: Encounters
- File-text: Medical Conditions
- Alert-circle: Allergies
- Pill: Medications
- Activity: Procedures
- Users: Family & Social History
- Lab: Laboratory
- Folder: Documents

**Record Metadata Icons**:
- Calendar: Dates
- User: Clinicians
- Hash (#): IDs
- Tag: Codes
- Pin: Locations
- Droplet: Sample collection
- Check-circle: Verification/completion

---

## Empty States

### Purpose
Empty states communicate why no records are displayed and what it means.

### Examples

**No Encounters**:
```
📅 Icon
"No Previous Encounters Recorded"
"This patient has no documented encounter history in the system."
```

**No Medical Conditions**:
```
📄 Icon
"No Medical Conditions Recorded"
"No medical conditions have been documented in this patient's history."
```

**No Allergies**:
```
✓ Icon (green)
"No Documented Allergies"
"No allergies have been documented in this patient's medical history.
This does not confirm the absence of allergies—allergy information may
not have been recorded or verified."
```

**No Search Results**:
```
🔍 Icon
"No [records] match your filters"
"Try adjusting your search query or [filter type] filter."
[Clear All Filters] button
```

---

## Keyboard Navigation

**Tab**: Move through interactive elements
**Shift + Tab**: Move backwards
**Enter**: Activate buttons and links
**Escape**: Close open dialogs
**Arrow keys**: Scroll content areas

---

## Responsive Design

### Desktop (≥1024px)
- Two-column layout (sidebar + content)
- Sidebar fixed position during scroll
- Full-width tables and cards
- All features accessible

### Tablet (768px - 1023px)
- Sidebar collapses to horizontal scrolling tabs
- Content area full width below tabs
- Cards maintain structure
- Touch-friendly targets

### Mobile (<768px)
- Single column layout
- Tabs in dropdown or horizontal scroll
- Stacked cards (no tables)
- Simplified layouts
- Large touch targets (44px minimum)

---

## Demo Data Reference

**Patient**: Hana Mohammed
- **ID**: ORH-2026-00124
- **DOB**: June 15, 1991
- **Age**: 34 years
- **Sex**: Female

**Current Encounter**: ENC-2026-00087 (January 11, 2026)

**Historical Encounters**: 8 total
- Last visit: December 15, 2025 (Hypertension follow-up)
- First recorded: August 15, 2024 (Dermatology)

**Medical Conditions**: 3 documented
- Essential Hypertension (Active)
- Vitamin D Deficiency (Inactive - corrected)
- Penicillin Allergy (Active)

**Allergies**: 1 documented
- Penicillin (Moderate severity, Verified)

**Medications**:
- 2 Active (Amlodipine 5mg, Vitamin D3)
- 2 Historical/Completed (Hydrocortisone cream, ORS)

**Procedures**: 1 documented
- Minor skin biopsy (August 2024)

**Family History**: 3 records
- Mother: Type 2 Diabetes
- Father: Hypertension
- Maternal Grandmother: Stroke (deceased)

**Social History**: 4 categories
- Smoking: Never
- Alcohol: Occasional
- Occupation: Teacher
- Living Situation: With family

**Laboratory Results**: 3 tests
- Complete Blood Count (Dec 2025) - Normal
- Lipid Profile (Sep 2025) - Normal
- Serum Vitamin D (Jun 2025) - Low (abnormal flag)

**Documents**: 2 uploaded
- Chest X-Ray Report (Nov 2024)
- Skin Biopsy Report (Aug 2024)

---

## Troubleshooting

### Issue: Page won't load or shows error
**Solution**:
1. Check that dev server is running (`npm run dev`)
2. Verify URL is correct: `http://localhost:8443/staff/medical-history`
3. Check browser console for errors (F12)
4. Refresh page (Ctrl+R or Cmd+R)
5. If error persists, click "Try Again" button or return to Clinical Workspace

### Issue: No records showing but patient has history
**Cause**: Search or filter is active
**Solution**:
1. Check search box - clear any text
2. Check filter dropdowns - set to "All"
3. Click "Clear Filters" button if visible
4. Refresh page if issue persists

### Issue: Can't open detail dialog
**Cause**: Button not responding
**Solution**:
1. Try clicking button again
2. Scroll to ensure button is fully visible
3. Check if another dialog is open (close it first)
4. Refresh page if issue persists

### Issue: Dialog won't close
**Solution**:
1. Click X button in top-right
2. Click "Close" button in footer
3. Click outside dialog on gray overlay
4. Press Escape key
5. Refresh page if unresponsive

### Issue: Timeline not showing all encounters
**Cause**: Date range filter is active
**Solution**:
1. Check "Date Range" dropdown in Encounters section
2. Select "All Time" to show all encounters
3. Or adjust date range as needed

### Issue: Medication showing wrong status
**Note**: This is demo data with simulated statuses
**In Production**: Status would reflect actual prescription state from backend

---

## Clinical Safety Notes

### Before Prescribing Medications

**Always**:
1. Review **Allergies** section first
2. Check **Medications** section for current prescriptions
3. Verify active medication status
4. Check for potential interactions

**Never**:
- Assume empty allergy list means no allergies
- Assume historical medication is still active
- Prescribe without checking current medications

### Reading Laboratory Results

**Remember**:
- "Abnormal" flag requires clinical interpretation
- Results shown are from specific test date
- Recent results may not reflect current state
- Follow-up tests may be needed

### Interpreting Historical Records

**Keep in Mind**:
- Historical records are point-in-time documentation
- Patient condition may have changed since recording
- Always perform current assessment
- Use history to inform, not replace, current evaluation

### Record Completeness

**Understand**:
- Empty sections mean "not documented," not "doesn't exist"
- Missing data doesn't confirm absence of condition
- Records depend on what was documented
- Always ask patient directly about critical information

---

## Integration with Other Modules

### From Clinical Workspace
- Click "Medical History" tab in left navigation
- Auto-loads current patient and encounter context
- Return button brings you back to clinical workspace

### To Clinical Workspace
- Click "Return to Clinical Workspace" button
- Preserves current patient and encounter
- Returns to active documentation

### Future Integrations (Coming)
- Link from Doctor Dashboard patient list
- Quick access from Patient Profile
- Integration with Diagnosis module (Prompt 28)
- Integration with Prescription module (Prompt 29)
- Integration with Laboratory module (Prompt 30)

---

## Technical Notes

### File Structure
```
src/medical-history/
├── model.ts (880 lines)
│   ├── Type definitions
│   ├── Sample patient history data
│   └── Utility functions
│
├── MedicalHistoryPage.tsx (190 lines)
│   ├── Main page component
│   ├── State management
│   ├── Section navigation
│   └── Dialog control
│
├── components.tsx (1,850 lines)
│   ├── PatientHistoryHeader
│   ├── HistoryNavigationTabs
│   ├── HistoryOverviewPanel
│   ├── Section views (8 sections)
│   └── Detail dialogs (7 dialogs)
│
└── medical-history.css (1,950 lines)
    ├── Layout and structure
    ├── Component styling
    ├── Color system
    └── Responsive breakpoints
```

**Total**: ~4,870 lines of code

### Data Flow
1. Page loads with patient ID and encounter ID
2. Component fetches patient history (demo: uses sample data)
3. User navigates between sections
4. Filters and search applied locally
5. Detail dialogs opened with selected record
6. All read-only (no data modification)

### Performance
- Lazy-loaded via React.lazy()
- Only loads when navigating to medical history
- Efficient filtering and search (client-side in demo)
- Minimal re-renders with React state management

---

## Accessibility Features

**Keyboard Navigation**:
- All interactive elements keyboard-accessible
- Logical tab order
- Escape closes dialogs
- Focus management in dialogs

**Screen Readers**:
- Semantic HTML structure
- ARIA labels on icons and buttons
- Status badges have readable text
- Empty states provide context

**Visual**:
- Color contrast meets WCAG AA standards
- Status communicated with text + color
- Icons paired with labels
- Clear visual hierarchy

**Touch**:
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Large buttons for primary actions

---

## Best Practices

### For Clinicians

1. **Always verify patient identity** before reviewing records
2. **Check allergy section first** when prescribing
3. **Don't assume** empty sections mean absence of condition
4. **Review recent encounters** for context
5. **Check medication status** before prescribing
6. **Use search and filters** to find specific information quickly
7. **Read historical notes** for important details
8. **Verify current state** - history may not reflect now

### For System Administrators

1. Ensure patient data is backed up
2. Monitor system performance with large histories
3. Regular data integrity checks
4. Audit access logs
5. User training on proper usage
6. Clear policies on data entry standards

---

## Summary Checklist

Before clinical decision-making:

- [ ] Verified correct patient (name, ID, DOB)
- [ ] Reviewed allergy information
- [ ] Checked current medication list
- [ ] Reviewed relevant recent encounters
- [ ] Checked laboratory results if relevant
- [ ] Read historical clinical notes
- [ ] Noted any important family history
- [ ] Understood record limitations (what's missing)

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Module**: Patient Medical History (Prompt 27)  
**Part of**: ORHIMS (Oda Roba Hospital Information Management System)
