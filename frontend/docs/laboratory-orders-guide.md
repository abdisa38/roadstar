# Laboratory Orders User Guide (Prompt 30)

## Overview
The Laboratory Orders module enables clinicians to order laboratory tests, track request status, and access results within the clinical workflow.

## Access
- **URL**: `/staff/laboratory`
- **Role**: Clinical staff (doctors, nurses with ordering privileges)
- **Patient Context**: Active patient encounter required

## Key Features

### 1. Test Catalogue Search
- **22 laboratory tests** organized into 6 categories:
  - Hematology (CBC, ESR, Blood Smear, Reticulocyte Count)
  - Biochemistry (Fasting Blood Sugar, Random Blood Sugar, HbA1c, Lipid Profile, Liver Function, Renal Function, Electrolytes)
  - Microbiology (Blood Culture, Urine Culture, Wound Culture, Stool Culture)
  - Serology (Malaria Test, HIV Test, Hepatitis B, Hepatitis C)
  - Parasitology (Stool Ova & Parasites)
  - Urinalysis (Urinalysis)
- **Search**: Type 2+ characters to filter tests by name, code, category
- **Multi-select**: Check multiple tests for a single request

### 2. Creating Laboratory Requests

#### Step 1: Search and Select Tests
1. Type test name in search box (minimum 2 characters)
2. Browse filtered categories
3. Click checkboxes to select tests
4. Selected tests appear at top of panel with blue tags
5. Click × on tag to remove test

#### Step 2: Specify Request Details
- **Clinical Indication** (required): Brief reason for ordering tests
- **Priority Level**:
  - **Routine**: Standard turnaround (default)
  - **Urgent**: Expedited processing
  - **STAT**: Immediate processing for critical situations
- **Request Notes** (optional): Additional instructions or clinical context

#### Step 3: Review and Submit
1. Click "Review Request" button
2. Verify all details in review dialog:
   - Patient information
   - Selected tests and specimen types
   - Clinical indication and priority
3. Click "Confirm & Submit" to create request
4. Success notice appears with request ID
5. New request panel clears for next order

### 3. Request Tracking

#### Request Status Flow
```
draft → requested → accepted → specimen-collection-pending → 
specimen-collected → in-progress → result-available → cancelled
```

**Status Definitions**:
- **draft**: Request saved but not submitted
- **requested**: Submitted to laboratory, awaiting acceptance
- **accepted**: Lab accepted request, awaiting specimen
- **specimen-collection-pending**: Specimen collection in progress
- **specimen-collected**: Specimen received, ready for processing
- **in-progress**: Laboratory analysis underway
- **result-available**: Results complete and available
- **cancelled**: Request cancelled by clinician or lab

#### Viewing Requests
- All requests for current patient encounter appear in left panel
- **Color-coded status badges** for quick recognition
- **Priority badges** (STAT/urgent/routine) visible on each card
- Click any request card to view full details

#### Filtering Requests
- **Status filter**: Show only specific status (e.g., result-available)
- **Date filter**: Last 7 days, 30 days, 90 days, or all time
- **Search**: Filter by request ID or test names
- **Clear filters**: Reset all filters to show all requests

### 4. Request Details Dialog

Click any request card to open details dialog with 3 tabs:

#### Overview Tab
- Request ID and status
- Patient information
- Requested date/time
- Ordered by (clinician name)
- Clinical indication and notes
- Priority level
- Complete list of ordered tests with specimen types

#### Tests Tab
- Detailed test listing
- Test codes and specimen requirements
- Category grouping

#### Actions Tab
Available actions depend on status:
- **result-available**: "View Result" button (navigates to results interface)
- **draft/requested/accepted**: "Cancel Request" button with confirmation
- **Other statuses**: No actions available (lab processing)

### 5. Duplicate Test Warning
- System detects if selected test was ordered in last 7 days
- Warning dialog shows:
  - Previous request date
  - Previous request status
  - List of duplicate tests
- Options:
  - **Cancel**: Remove duplicates from selection
  - **Continue Anyway**: Proceed with duplicate order (clinical judgment)

### 6. Validation and Safeguards
- **No empty requests**: At least one test required
- **Clinical indication required**: Cannot submit without reason
- **Review before submit**: Mandatory review dialog prevents accidental submission
- **Cancel confirmation**: Requires explicit confirmation to cancel
- **Status-appropriate actions**: Only valid actions shown per status

## Workflow Examples

### Example 1: Routine CBC Order
1. Open Laboratory Orders for patient encounter
2. Type "CBC" in search box
3. Check "Complete Blood Count (CBC)" checkbox
4. Enter clinical indication: "Routine anemia workup"
5. Leave priority as "routine"
6. Click "Review Request"
7. Verify details, click "Confirm & Submit"
8. Success: Request created with ID LABREQ-2026-XXXXX

### Example 2: STAT Malaria Test
1. Search "malaria"
2. Select "Malaria Test (Blood Smear)"
3. Clinical indication: "High fever, suspected malaria"
4. Change priority to "STAT"
5. Review and submit
6. Specimen collection team notified immediately

### Example 3: Comprehensive Metabolic Panel
1. Search and select multiple tests:
   - Fasting Blood Sugar
   - Renal Function Test
   - Liver Function Test
   - Electrolytes
2. Clinical indication: "Diabetes follow-up with renal monitoring"
3. Priority: urgent
4. Add note: "Patient fasting since 8pm yesterday"
5. Review and submit
6. Lab receives bundled request with all 4 tests

## Tips for Effective Use

### Best Practices
1. **Search efficiently**: Use test abbreviations (CBC, ESR, LFT)
2. **Bundle related tests**: Order all needed tests in single request
3. **Clear indications**: Helps lab prioritize and interpret results
4. **Appropriate priority**: Reserve STAT for true emergencies
5. **Check history**: Review existing requests before ordering duplicates

### Common Patterns
- **Anemia workup**: CBC + Blood Smear + Reticulocyte Count
- **Diabetes monitoring**: FBS + HbA1c
- **Sepsis workup**: CBC + Blood Culture + Electrolytes
- **Hepatitis screening**: Hepatitis B + Hepatitis C
- **Pre-operative**: CBC + Renal Function + Liver Function

### Priority Guidelines
- **STAT**: Life-threatening conditions, emergency surgery prep
- **Urgent**: Acute illness requiring same-day results
- **Routine**: Chronic disease monitoring, screening, elective surgery

## Integration Points

### Navigation
- **From Clinical Workspace**: "Lab Orders" button in left sidebar
- **To Specimen Collection**: Lab staff navigate to collection module
- **To Results**: "View Result" button when result-available

### Patient Context
- Automatically loads active encounter
- Shows patient demographics in header
- All requests tied to current encounter

### Permissions
- Ordering: Requires clinical ordering privileges
- Viewing: All clinical staff can view orders
- Cancelling: Only ordering clinician or supervisor

## Demo Data
**Demo Patient**: Hana Mohammed (ORH-2026-00124), 34F
**Demo Requests**:
1. LABREQ-2026-00145 (CBC + ESR, specimen-collected)
2. LABREQ-2026-00122 (Malaria, result-available)

## Technical Notes
- Requests persist across sessions
- Status updates in real-time (when backend connected)
- Test catalogue configurable by hospital laboratory
- Specimen types mapped to tests (blood, urine, stool, etc.)

## Support
For issues or questions:
- IT Help Desk: [contact info]
- Laboratory Manager: [contact info]
- Training Materials: [link to videos/guides]
