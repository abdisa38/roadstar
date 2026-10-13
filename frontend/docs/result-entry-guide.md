# Laboratory Result Entry - User Guide

**Module:** Laboratory Result Entry (Prompt 33)  
**Route:** `/staff/laboratory/result-entry`  
**Role:** Laboratory Technician (authorized)  
**Status:** Design Preview — Fictional data, no backend connected

---

## Overview

The Laboratory Result Entry page allows authorized laboratory technicians to enter, validate, and submit laboratory test results for clinical review. This interface ensures accurate data entry with real-time validation, reference interval checking, and automated flagging of abnormal or critical values.

## Page Structure

### 1. Header Section
- **Back Navigation**: Return to Laboratory Dashboard
- **Order Information**: Display order ID and test name
- **Status Badge**: Shows current entry status (Draft, Ready for Review, Pending Review, Approved, Released)

### 2. Patient Summary Card
Displays essential patient and order context:
- **Patient Name**: Full name and demographics
- **Patient ID**: Hospital identifier (ORH-YYYY-NNNNN)
- **Age/Gender**: For reference range context
- **Order ID**: Laboratory order number
- **Test Type**: Name of the test panel
- **Order Date**: When the test was requested
- **Priority**: Routine, urgent, or stat
- **Specimen Status**: Must be verified/received to enter results

### 3. Test Navigation Bar
- **Test Selector**: Dropdown to switch between multiple tests in the order
- **Test Indicator**: Shows current test position (e.g., "1 of 3 tests")
- **Navigation Buttons**: Previous/Next test quick navigation

### 4. Result Entry Form
Main data entry area with analyte table:
- **Analyte Name**: Parameter being measured (e.g., Hemoglobin, WBC)
- **Unit**: Measurement unit (g/dL, 10³/µL, %, fL, pg)
- **Value Input**: Numeric entry field with validation
- **Reference Interval**: Normal range display (may vary by gender/age)
- **Flag**: Auto-computed status (Normal, Low, High, Critical-Low, Critical-High)
- **Comments**: Optional notes for each test result

### 5. Validation Panel
Real-time validation feedback:
- **Validation Status**: ✓ Valid or ✗ Invalid with issue count
- **Error Messages**: Required fields, invalid formats, out-of-range values
- **Warning Messages**: Critical values, missing optional data
- **Info Messages**: Guidance and reminders

### 6. Action Bar
- **Auto-save Indicator**: Shows saving status and last saved time
- **Save Draft**: Manually save work-in-progress
- **Discard Changes**: Cancel unsaved edits
- **Submit for Review**: Finalize and send for pathologist/senior review

---

## Key Features

### Analyte Definitions (CBC Example)
Complete blood count with 8 analytes:
1. **Hemoglobin (Hb)**: 13.5-17.5 g/dL (male), 12.0-15.5 g/dL (female)
2. **White Blood Cell Count (WBC)**: 4.0-11.0 × 10³/µL
3. **Red Blood Cell Count (RBC)**: 4.5-5.9 × 10⁶/µL (male), 4.0-5.2 × 10⁶/µL (female)
4. **Hematocrit (HCT)**: 38.8-50.0% (male), 34.9-44.5% (female)
5. **Platelet Count**: 150-400 × 10³/µL
6. **Mean Corpuscular Volume (MCV)**: 80-100 fL
7. **Mean Corpuscular Hemoglobin (MCH)**: 27-33 pg
8. **Mean Corpuscular Hemoglobin Concentration (MCHC)**: 32-36 g/dL

### Reference Intervals
- **Gender-specific**: Different ranges for male/female where applicable
- **Age-specific**: Pediatric vs adult ranges (future enhancement)
- **Dynamic Display**: Shows relevant range based on patient demographics

### Critical Value Thresholds
Automated flagging for life-threatening results:
- **Hemoglobin**: Critical-low ≤ 7.0 g/dL, Critical-high ≥ 20.0 g/dL
- **WBC**: Critical-low ≤ 2.0 × 10³/µL, Critical-high ≥ 30.0 × 10³/µL
- **Platelet**: Critical-low ≤ 50 × 10³/µL, Critical-high ≥ 1000 × 10³/µL
- System highlights critical values for immediate clinician notification

### Result Flags
Automatic classification based on reference intervals:
- **Normal**: Value within reference range (green badge)
- **Low**: Below normal range (yellow badge)
- **High**: Above normal range (yellow badge)
- **Critical-Low**: Dangerously low value (red badge)
- **Critical-High**: Dangerously high value (red badge)
- **Abnormal**: Qualitative abnormality (gray badge)
- **Not Applicable**: Parameter not tested (light gray badge)

### Auto-Save Functionality
- **Interval**: Every 30 seconds if unsaved changes exist
- **Manual Save**: "Save Draft" button for immediate save
- **Status Indicator**: Shows "Saved", "Saving...", or "Unsaved changes"
- **Persistence**: Work preserved across browser refresh

### Validation Rules
Real-time input validation:
1. **Required Fields**: All analyte values must be entered or marked N/A
2. **Numeric Format**: Values must be valid numbers (no text)
3. **Range Checking**: Values must be physiologically plausible
4. **Critical Value Confirmation**: Extra dialog for critical results
5. **Specimen Prerequisites**: Can only enter results if specimen is verified/received

### Result Entry Status Workflow
1. **Draft**: Work in progress, not yet complete
2. **Ready for Review**: All fields valid, technician indicates completion
3. **Pending Review**: Submitted, awaiting pathologist/senior review
4. **Approved**: Reviewed and approved by authorized personnel
5. **Released**: Published to patient record and clinician view

---

## Workflows

### 1. Enter Results for New Order
```
1. Navigate from Laboratory Dashboard → Orders Table
2. Click "Enter Result" action on pending order
3. System validates specimen status (must be verified/received)
4. Review patient and order context in summary card
5. Enter value for each analyte in the table
6. System auto-computes flags and validates ranges
7. Add comments for any abnormal or critical values
8. Review validation panel — ensure all errors cleared
9. Click "Save Draft" to preserve work (or wait for auto-save)
10. When complete, click "Submit for Review"
11. Confirm submission in dialog
12. System changes status to "Pending Review"
13. Return to dashboard
```

### 2. Resume Draft Results
```
1. Navigate to Laboratory Dashboard
2. Identify order with "Draft Results" status
3. Click "Continue Entry" action
4. System loads previously saved values
5. Complete remaining fields or edit existing
6. Save and submit when ready
```

### 3. Handle Critical Values
```
1. Enter value that exceeds critical threshold (e.g., Hb 6.5 g/dL)
2. System flags value as "Critical-Low" (red badge)
3. Validation panel shows critical value warning
4. Add mandatory comment explaining context
5. On submit, system displays critical value confirmation dialog
6. Review list of critical findings
7. Confirm submission — critical alerts will notify clinicians
```

### 4. Multi-Test Order Entry
```
1. Open order with multiple tests (e.g., CBC + Blood Type)
2. Test navigation shows "1 of 2 tests"
3. Complete first test (CBC) and save draft
4. Click "Next Test" or use test selector dropdown
5. Enter results for second test (Blood Type)
6. Submit entire order when all tests complete
```

### 5. Handle Invalid Specimen
```
1. Attempt to enter results for order
2. System checks specimen status
3. If specimen status is "rejected" or "not-received":
   - Display error message
   - Block result entry
   - Prompt to resolve specimen issue first
4. Navigate to Specimen Collection to update status
5. Return and retry result entry
```

---

## Validation Messages

### Error (Red — Blocks Submission)
- "Hemoglobin value is required"
- "Invalid numeric format for WBC count"
- "Value out of physiologically plausible range"
- "Specimen must be verified before entering results"

### Warning (Yellow — Caution)
- "Critical low value detected: Hb 6.5 g/dL. Add comment required."
- "Critical high value detected: WBC 32.0 × 10³/µL. Verify immediately."
- "Multiple critical values in this result set"

### Info (Blue — Guidance)
- "Remember to add comments for any abnormal findings"
- "Reference intervals shown are for adult male patients"
- "Results will be sent for pathologist review before release"

### Success (Green — Confirmation)
- "All required fields completed"
- "Validation passed — ready to submit"
- "Draft saved successfully"

---

## Keyboard Shortcuts & Accessibility

### Navigation
- **Tab**: Move between input fields in table order
- **Shift+Tab**: Move backward
- **Enter**: Move to next field (same as Tab)

### Actions
- **Ctrl+S / Cmd+S**: Save draft
- **Escape**: Close dialogs without action

### Accessibility Features
- **Screen Reader Support**: All fields and status labeled
- **Keyboard Navigation**: Full operation without mouse
- **High Contrast**: Flag colors meet WCAG AA standards
- **Focus Indicators**: Clear visual focus on active field
- **Error Announcements**: Validation feedback read by assistive tech

---

## Dialog Interactions

### Submit for Review Dialog
**Triggered by:** "Submit for Review" button  
**Purpose:** Confirm submission and alert about irreversibility

**Content:**
- Confirmation message
- List of critical values if present
- Explanation that submission cannot be undone
- Note that results will be reviewed before release

**Actions:**
- **Cancel**: Return to editing
- **Confirm Submit**: Proceed with submission

### Unsaved Changes Dialog
**Triggered by:** Navigating away with unsaved changes  
**Purpose:** Prevent accidental data loss

**Content:**
- Warning about unsaved changes
- Prompt to save, discard, or cancel

**Actions:**
- **Save and Exit**: Save draft and navigate away
- **Discard Changes**: Exit without saving
- **Cancel**: Stay on page

### Critical Value Confirmation
**Triggered by:** Submitting results with critical values  
**Purpose:** Extra verification for life-threatening findings

**Content:**
- List of all critical values with parameters and values
- Reminder to notify clinician immediately
- Confirmation required

**Actions:**
- **Go Back**: Return to edit and verify
- **Confirm and Submit**: Proceed despite critical values

---

## Demo Data

The design preview includes one sample order for result entry:

### Order: ORD-LAB-2026-00124
- **Patient**: Abebe Bekele (42 years old, Male)
- **Patient ID**: ORH-2026-00124
- **Test**: Complete Blood Count (CBC)
- **Priority**: Routine
- **Order Date**: 2026-10-13
- **Specimen Status**: Verified (ready for result entry)
- **Analytes**: 8 parameters (Hb, WBC, RBC, HCT, Platelet, MCV, MCH, MCHC)

---

## Technical Notes

### Data Model
- **Result Entry**: `ResultEntryData` interface with order, patient, tests
- **Test Result**: Individual test with analytes array and metadata
- **Analyte Definition**: Reference intervals, units, critical thresholds
- **Status**: Draft → Ready for Review → Pending Review → Approved → Released

### Validation Logic
- **Client-side**: Real-time input validation and flag computation
- **Reference Intervals**: Gender-specific ranges applied dynamically
- **Critical Thresholds**: Separate from reference intervals for urgent alerts
- **Required Fields**: All analytes must have value or explicit "Not Applicable"

### State Management
- **Local State**: React useState for form values and validation
- **Auto-save**: useEffect with 30-second debounce timer
- **Unsaved Changes Tracking**: Dirty flag for navigation guards

### Future Backend Integration
When connected to a real backend:
- Load order and patient data from laboratory system
- Fetch analyte definitions and reference intervals
- Save draft results to temporary storage
- Submit completed results to review queue
- Trigger critical value alerts to clinicians
- Audit trail for all result entries and modifications
- Permission checks for technician authorization

---

## Related Documentation

- **Laboratory Dashboard**: Overview and workload management
- **Laboratory Orders** (Prompt 30): Test request and order management
- **Specimen Collection** (Prompt 32): Sample tracking and verification
- **Laboratory Modules Summary**: Integration across laboratory workflow

---

## Support & Feedback

This is a design preview demonstrating the Laboratory Result Entry interface for ORHIMS. All data is fictional and no backend services are connected. The actual implementation will require integration with laboratory information systems (LIS), validation rule configuration, and clinician notification pathways.

For questions about clinical workflows, reference intervals, or critical value policies, consult with laboratory medicine specialists and hospital administration.

---

**Document Version:** 1.0  
**Last Updated:** October 13, 2026  
**Module:** Laboratory Result Entry (Prompt 33)
