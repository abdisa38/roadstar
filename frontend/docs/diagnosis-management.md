# Diagnosis Management User Guide (Prompt 28)

## Overview

The Diagnosis Management module enables authorized clinicians to search for, select, and record diagnoses for patient encounters. This interface provides structured diagnosis documentation with ICD-10 code support, primary/secondary designation, and integration with patient medical history.

**Access URL**: `http://localhost:8443/staff/diagnosis`

## Purpose

Enable doctors to:
- Review diagnoses already recorded for the current encounter
- Search the diagnosis catalogue using name or ICD-10 code
- Select appropriate diagnoses from standardized terminology
- Designate diagnoses as primary or secondary
- Add clinical notes and context to diagnoses
- Review and remove diagnoses when appropriate
- Access historical diagnoses for reference

---

## Key Principles

### Clinical Safety
1. **Clinician Decision-Making**: The interface supports but does not make diagnostic decisions
2. **Patient Identity**: Always visible at top of screen
3. **Encounter Context**: Current encounter clearly distinguished from history
4. **No Automatic Diagnosis**: System never suggests or generates diagnoses
5. **Standardized Codes**: ICD-10 codes from configured catalogue

### Data Integrity
- Each diagnosis linked to correct patient and encounter
- Primary diagnosis clearly identified
- Duplicate prevention with confirmation
- Unsaved changes protection
- Historical diagnoses remain unchanged

---

## Page Layout

### Header Section
- **Return to Clinical Workspace** button
- **Patient Identity**:
  - Patient name (large, prominent)
  - Patient ID
  - Age and sex
  - Current encounter ID
  - Encounter date and type
  - Encounter status

### Main Content Area (Left)
1. **Primary Diagnosis Summary** (if exists)
   - Featured display with star icon
   - Diagnosis name and ICD-10 code
   - Recording details and clinical notes

2. **Diagnoses for This Encounter**
   - List of all recorded diagnoses
   - Primary designation badge (star icon)
   - Secondary designation badge (circle icon)
   - Remove button (when permitted)

3. **Add Diagnosis** button or panel

### Sidebar (Right - 340px)
- **Historical Diagnoses** (last 3)
  - From previous encounters
  - For reference only
  - Link to full medical history

---

## Step-by-Step Usage

### 1. Accessing Diagnosis Management

**Direct URL**:
```
http://localhost:8443/staff/diagnosis
```

**From Clinical Workspace**:
- Click "Add Diagnosis" quick action
- Or navigate via menu

**Demo Patient**: Hana Mohammed (ORH-2026-00124)
**Demo Encounter**: ENC-2026-00087

---

### 2. Reviewing Current Encounter Diagnoses

**When Page Loads**:
1. Check patient identity header
   - Verify correct patient name and ID
   - Confirm current encounter ID
2. Review existing diagnoses section
   - See count: "1 diagnosis" or "3 diagnoses"
   - Identify primary diagnosis (green card with star)
   - Review secondary diagnoses

**Diagnosis Card Information**:
- **Designation badge**: Primary (star icon) or Secondary (circle icon)
- **Diagnosis name**: Full standardized name
- **ICD-10 code**: Standardized code (e.g., "I10", "J06.9")
- **Status**: Active, Resolved, or Inactive
- **Recorded date**: When diagnosis was added
- **Recorded by**: Clinician who added it
- **Clinical notes**: Additional context (if any)
- **Remove button**: X icon (top-right, when editable)

**Primary Diagnosis Features**:
- Green background card
- Larger featured display above diagnosis list
- Star icon on designation badge
- Only one primary diagnosis per encounter

**Empty State**:
If no diagnoses recorded yet:
```
📋 Icon
"No diagnoses recorded"
"No diagnoses have been added to this encounter yet."
```

---

### 3. Adding a New Diagnosis

#### Step 1: Open Add Diagnosis Panel

Click **"Add Diagnosis"** button:
- Large button with plus icon
- Below current diagnoses list
- Disabled if catalogue unavailable

**Result**: Add Diagnosis panel opens with:
- Green border (ORHIMS primary color)
- Panel header: "Add New Diagnosis"
- Search interface

#### Step 2: Search for Diagnosis

**Search Box**:
- Prominent search field with search icon
- Placeholder: "Search by diagnosis name or ICD-10 code..."
- Requires minimum 2 characters

**Search Examples**:

**By Name**:
- Type: "hypertension" → Shows hypertension-related diagnoses
- Type: "diabetes" → Shows diabetes-related diagnoses
- Type: "upper respiratory" → Shows URI diagnoses

**By ICD-10 Code**:
- Type: "I10" → Shows Essential (primary) hypertension
- Type: "J06" → Shows Acute upper respiratory infection
- Type: "E11" → Shows Type 2 diabetes mellitus

**Search Behavior**:
- Real-time search as you type
- Shows loading spinner during search
- Displays result count: "5 results found"
- No results message if no matches

**Search Hints**:
- If query < 2 characters: "Enter at least 2 characters to search"
- If no results: "No matching diagnoses found. Try adjusting your search terms or checking the spelling."

#### Step 3: Select Diagnosis from Results

**Search Results Display**:
Each result shows:
- **Diagnosis name**: Full standardized name
- **ICD-10 code**: e.g., "ICD-10: J06.9"
- **Category**: e.g., "Diseases of the respiratory system"
- **Description**: Brief explanation (when available)
- **Chevron icon**: Right arrow indicating selectable

**To Select**:
1. Click any result card
2. Search box clears
3. Selected diagnosis appears in featured card

**Selected Diagnosis Card**:
- Green background
- Check mark icon: "Selected Diagnosis"
- Shows full name, code, and category
- **"Change Selection"** button to search again

#### Step 4: Choose Designation

**Two Options**:

**A. Primary Diagnosis**
- Radio button with star icon
- Label: "Primary Diagnosis"
- Description: "Principal reason for this encounter"

**B. Secondary Diagnosis**
- Radio button with circle icon
- Label: "Secondary Diagnosis"
- Description: "Additional diagnosis for this encounter"

**Primary Diagnosis Rules**:
- Only one primary diagnosis allowed per encounter
- If primary already exists, system shows warning:
  ```
  ⚠️ A primary diagnosis already exists. Saving this will change 
  the existing primary diagnosis to secondary.
  ```
- Existing primary automatically becomes secondary

**Required Field**:
- Must select designation before saving
- Red validation error if skipped: "Please select a diagnosis designation"

#### Step 5: Add Clinical Notes (Optional)

**Clinical Notes Field**:
- Large text area (4 rows, expandable)
- Placeholder: "Enter any relevant clinical documentation or context..."
- Hint: "Provide additional context, severity notes, or supporting information"

**When to Use**:
- Add context about severity
- Note contributing factors
- Document examination findings
- Explain clinical reasoning
- Reference relevant history

**Examples**:
```
"Blood pressure consistently elevated 140-150/85-95 mmHg over 
past 3 visits. No target organ damage noted."

"Acute onset 3 days ago. No improvement with paracetamol. 
Associated with nasal congestion and mild fever."

"Long-standing condition, well-controlled on current medication. 
Patient compliant with treatment."
```

**Not Required**: Field is optional, can leave blank

#### Step 6: Save Diagnosis

Click **"Save Diagnosis"** button:
- Green button with check icon
- Located bottom-right of panel

**Validation**:
If diagnosis not selected or designation not chosen:
- Red validation box appears
- Lists required fields
- Cannot save until complete

**Saving Process**:
1. Button shows: "Saving..." with spinner
2. Brief delay (simulated 1 second in demo)
3. Success: Panel closes, diagnosis appears in list
4. Error: Error message appears, panel remains open

**Success Indicator**:
- Green notification bottom-right: "Diagnosis saved successfully"
- Auto-disappears after 2 seconds
- New diagnosis visible in current diagnoses list

**Save Error**:
- Red box in panel: "Failed to save diagnosis. An error occurred while saving. Please try again."
- Your work remains in panel
- Click "Save Diagnosis" again to retry

#### Step 7: Cancel (If Needed)

Click **"Cancel"** button:
- Gray secondary button
- Bottom-left of panel
- Discards current selection
- Returns to diagnosis list

**When to Cancel**:
- Changed mind about adding diagnosis
- Selected wrong diagnosis
- Want to review existing diagnoses first

---

### 4. Understanding Diagnosis Designations

### Primary Diagnosis

**Definition**: Principal reason for the encounter

**Characteristics**:
- Star icon on badge
- Green highlighted card
- Featured display above list
- Only ONE primary per encounter

**Examples**:
- **Outpatient Visit**: Chief complaint diagnosis
  - Patient presents for cough → "Acute upper respiratory infection" (Primary)
- **Follow-up**: Ongoing condition being managed
  - Hypertension follow-up → "Essential hypertension" (Primary)
- **Emergency**: Main presenting problem
  - Severe headache → "Migraine" (Primary)

**Clinical Significance**:
- Drives encounter coding and billing
- Documents main reason for visit
- Guides treatment plan priority

### Secondary Diagnosis

**Definition**: Additional diagnoses relevant to encounter

**Characteristics**:
- Circle icon on badge
- Standard white card
- Listed below primary
- Multiple secondary diagnoses allowed

**Examples**:
- **Comorbidities**: Pre-existing conditions
  - Diabetic patient with URI → Diabetes (Secondary to URI)
- **Complications**: Related conditions
  - Hypertension with headache → Headache (Secondary)
- **Incidental Findings**: Discovered during visit
  - Routine check finds anemia → Anemia (Secondary)

**Clinical Significance**:
- Provides clinical context
- May affect treatment decisions
- Documents complexity of case

### Changing Primary Designation

**Scenario**: Need to change which diagnosis is primary

**What Happens**:
1. Select new diagnosis from catalogue
2. Choose "Primary Diagnosis" designation
3. System shows warning about existing primary
4. On save: 
   - Existing primary becomes secondary
   - New diagnosis becomes primary
5. Only one primary remains

**Example**:
- Initial: "Headache" (Primary), "Hypertension" (Secondary)
- After change: "Hypertension" (Primary), "Headache" (Secondary)

---

### 5. Removing a Diagnosis

**When Permitted**:
- Current encounter is not finalized
- User has edit permissions
- Encounter status is "in-progress"

**How to Remove**:
1. Locate diagnosis card in list
2. Click **X** button (top-right of card)
3. Confirmation dialog appears

**Confirmation Dialog**:
```
⚠️ Remove Diagnosis

Are you sure you want to remove this diagnosis from the current encounter?

[Diagnosis Name]
ICD-10: [Code]
[Primary/Secondary] Diagnosis

This action cannot be undone. The diagnosis will be permanently 
removed from this encounter.

[Cancel]  [🗑️ Remove Diagnosis]
```

**To Confirm**:
- Click red "Remove Diagnosis" button
- Diagnosis immediately removed from list
- No undo available

**To Cancel**:
- Click "Cancel" button
- Dialog closes
- Diagnosis remains

**Cannot Remove If**:
- Encounter is read-only
- User lacks permissions
- Remove button hidden

---

### 6. Historical Diagnoses Reference

**Purpose**: View diagnoses from previous encounters for clinical context

**Location**: Right sidebar, "Historical Diagnoses" section

**Display** (shows last 3):
Each historical diagnosis shows:
- Diagnosis name
- ICD-10 code
- Encounter date
- Encounter ID
- Status badge (Active, Resolved, Inactive)

**Example**:
```
Essential (primary) hypertension
ICD-10: I10
📅 Sep 20, 2025
#️⃣ ENC-2025-09-321
Status: Active
```

**Important Notes**:
- Historical diagnoses are reference only
- Do NOT automatically apply to current encounter
- To document same diagnosis: Use "Add Diagnosis" button
- Click "View Full Medical History" for complete list

**Notice Box**:
```
ℹ️ Historical diagnoses shown for reference only. To document 
the same diagnosis for the current encounter, add it using the 
"Add Diagnosis" button above.
```

**View Full History**:
- Click "View Full Medical History" button
- Navigates to Medical History module (Prompt 27)
- See complete diagnosis history with all details

---

### 7. Read-Only and Permission States

### Read-Only Encounter

**When Occurs**:
- Encounter status is "Completed"
- Encounter has been finalized
- Record locked for editing

**Visual Indicators**:
- Blue info notice at top:
  ```
  ℹ️ This encounter is read-only
  
  This encounter has been finalized and cannot be edited. 
  View-only access is permitted.
  ```
- No "Add Diagnosis" button
- No remove (X) buttons on diagnoses
- Can view all diagnoses
- Cannot add or remove

### Limited Permissions

**When Occurs**:
- User role lacks diagnosis edit permission
- Viewing encounter assigned to another clinician

**Visual Indicators**:
- Yellow warning notice at top:
  ```
  ⚠️ Limited permissions
  
  You do not have permission to add or edit diagnoses for 
  this encounter.
  ```
- No "Add Diagnosis" button
- No remove buttons
- View-only access

### Catalogue Unavailable

**When Occurs**:
- Diagnosis catalogue service is down
- Network connectivity issues
- System maintenance

**Visual Indicators**:
- Yellow warning banner:
  ```
  ⚠️ Diagnosis Catalogue Unavailable
  
  The diagnosis catalogue service is currently unavailable. 
  Please try again later or contact system support if the 
  issue persists.
  ```
- "Add Diagnosis" button disabled
- Cannot search or add diagnoses
- Can view existing diagnoses

---

## Common Workflows

### Workflow 1: Document Primary Diagnosis for New Encounter

**Scenario**: Patient presents with acute cough

1. Access Diagnosis Management
2. Verify patient identity and encounter
3. Review current diagnoses (empty initially)
4. Click **"Add Diagnosis"**
5. Search: "upper respiratory infection"
6. Select: "Acute upper respiratory infection, unspecified" (J06.9)
7. Choose: **Primary Diagnosis**
8. Add notes: "Patient presents with cough, mild fever, and nasal congestion for 3 days."
9. Click **"Save Diagnosis"**
10. Confirm: Diagnosis appears as primary (green card with star)
11. Return to Clinical Workspace to continue documentation

**Time**: 1-2 minutes

---

### Workflow 2: Add Secondary Diagnosis (Comorbidity)

**Scenario**: Patient with hypertension presents for URI

1. Primary diagnosis already recorded: "Acute URI" (Primary)
2. Click **"Add Diagnosis"**
3. Search: "hypertension"
4. Select: "Essential (primary) hypertension" (I10)
5. Choose: **Secondary Diagnosis**
6. Add notes: "Known hypertension, currently controlled on Amlodipine 5mg."
7. Click **"Save Diagnosis"**
8. Confirm: Both diagnoses visible:
   - "Acute URI" (Primary, green card)
   - "Essential hypertension" (Secondary, white card)

**Time**: 1 minute

---

### Workflow 3: Change Primary Diagnosis

**Scenario**: Initially documented headache as primary, but hypertension is actual focus

**Current State**:
- "Headache" (Primary)
- "Essential hypertension" (Secondary)

**Steps**:
1. Click **"Add Diagnosis"**
2. Search: "hypertension"
3. Select: "Essential (primary) hypertension" (I10)
4. Choose: **Primary Diagnosis**
5. Warning appears: "A primary diagnosis already exists..."
6. Add notes: "Hypertension is primary concern for this visit."
7. Click **"Save Diagnosis"**
8. Confirm change:
   - "Essential hypertension" (Primary, green card)
   - "Headache" (Secondary, white card)

**Note**: Cannot have duplicate - must remove old primary first if same diagnosis

**Time**: 1-2 minutes

---

### Workflow 4: Reference Historical Diagnoses

**Scenario**: Check patient's previous diagnoses before documenting

1. Load Diagnosis Management
2. Review sidebar: "Historical Diagnoses"
3. See previous diagnoses:
   - Essential hypertension (Sep 2025, Active)
   - Vitamin D deficiency (Jun 2025, Resolved)
   - Gastroenteritis (Nov 2024, Resolved)
4. Note active hypertension
5. If relevant to current encounter:
   - Click "Add Diagnosis"
   - Search and add as secondary diagnosis
6. For complete history:
   - Click "View Full Medical History"
   - Review full Medical History module

**Time**: 30 seconds to 2 minutes

---

### Workflow 5: Remove Incorrect Diagnosis

**Scenario**: Added wrong diagnosis, need to remove

1. Locate incorrect diagnosis in list
2. Click **X** button (top-right of card)
3. Confirmation dialog appears
4. Review diagnosis details shown
5. Click **"Remove Diagnosis"** (red button)
6. Diagnosis immediately removed from list
7. Add correct diagnosis using "Add Diagnosis" button

**Important**: No undo - be certain before confirming

**Time**: 30 seconds

---

### Workflow 6: Review Multiple Diagnoses

**Scenario**: Complex patient with several diagnoses

**View**:
```
PRIMARY DIAGNOSIS (Green card with star)
├─ Essential (primary) hypertension - I10
   Active • Recorded Jan 11, 2026 by Dr. Demo User
   Notes: "Stage 1 hypertension, well-controlled..."

CURRENT DIAGNOSES (3 diagnoses)
├─ Essential (primary) hypertension - I10 [Primary ⭐]
├─ Type 2 diabetes mellitus - E11 [Secondary ○]
└─ Overweight and obesity - E66.9 [Secondary ○]
```

**What to Check**:
- Is primary diagnosis correct focus of visit?
- Are secondary diagnoses relevant to encounter?
- Are all active conditions documented?
- Do diagnoses match clinical documentation?

---

## Visual Design Reference

### Color Coding

**Primary Diagnosis**:
- Background: Light green (`#f0fdf4`)
- Border: Green (`#86efac`)
- Badge: Solid green (`#059669`) with white text
- Icon: Star (⭐)

**Secondary Diagnosis**:
- Background: White
- Border: Light gray (`#e2e8f0`)
- Badge: White with gray border
- Icon: Circle (○)

**Status Colors**:
- Active: Green (`#d1fae5` / `#065f46`)
- Resolved: Blue (`#dbeafe` / `#1e40af`)
- Inactive: Gray (`#f1f5f9` / `#475569`)

**Save States**:
- Saving: Blue (`#dbeafe` / `#1e40af`)
- Saved: Green (`#d1fae5` / `#065f46`)
- Error: Red (`#fee2e2` / `#991b1b`)

**Notices**:
- Read-only: Blue (`#eff6ff`)
- Limited permissions: Yellow (`#fef3c7`)
- Catalogue unavailable: Yellow (`#fef3c7`)

### Icons

**Diagnosis Icons**:
- Star: Primary designation
- Circle: Secondary designation
- Check circle: Selected diagnosis
- Plus: Add diagnosis
- X: Remove diagnosis
- Refresh: Change selection

**Metadata Icons**:
- Calendar: Dates
- User: Clinicians
- Activity: Status
- Clock: Historical
- Hash: IDs

**Action Icons**:
- Search: Catalogue search
- Chevron right: Selectable items
- Arrow left: Return navigation
- Arrow right: View more
- Trash: Remove action

---

## Keyboard Navigation

**Search Box**:
- Tab to focus
- Type to search
- Arrow keys to navigate results
- Enter to select result

**Radio Buttons**:
- Tab to reach
- Arrow keys to change selection
- Space to select

**Buttons**:
- Tab to focus
- Enter or Space to activate

**Dialogs**:
- Escape to close
- Tab through options
- Enter to confirm

---

## Responsive Design

### Desktop (≥1024px)
- Two-column layout (main + sidebar)
- Sidebar fixed during scroll
- Full-width search results
- All features accessible

### Tablet (768px - 1023px)
- Single column layout
- Sidebar below main content
- Full-width panels
- Touch-friendly controls

### Mobile (<768px)
- Stacked layout
- Full-width cards
- Large touch targets
- Simplified display
- Scrollable lists

---

## Demo Data Reference

**Patient**:
- Name: Hana Mohammed
- ID: ORH-2026-00124
- Age: 34 years
- Sex: Female

**Current Encounter**:
- ID: ENC-2026-00087
- Date: January 11, 2026 at 9:30 AM
- Type: General Consultation
- Status: In Progress
- Clinician: Dr. Demo User

**Pre-loaded Diagnosis**:
- Acute upper respiratory infection, unspecified (J06.9)
- Designation: Primary
- Status: Active

**Historical Diagnoses** (Reference):
1. Essential (primary) hypertension (I10) - Sep 2025, Active
2. Vitamin D deficiency (E55.9) - Jun 2025, Resolved
3. Gastroenteritis (A09) - Nov 2024, Resolved

**Sample Catalogue** (20 diagnoses):
- Essential hypertension (I10)
- Type 2 diabetes mellitus (E11)
- Acute upper respiratory infection (J06.9)
- Pneumonia (J18.9)
- Gastroenteritis (A09)
- Fever of unknown origin (R50.9)
- Headache (R51)
- GERD (K21.9)
- Vitamin D deficiency (E55.9)
- And 11 more...

---

## Troubleshooting

### Issue: Cannot find diagnosis in search
**Solutions**:
1. Check spelling - try alternative terms
2. Search by ICD-10 code if known
3. Use partial terms (e.g., "respira" instead of "respiratory")
4. Try broader category (e.g., "infection" instead of specific type)

### Issue: "Save Diagnosis" button is disabled
**Causes**:
- No diagnosis selected from search results
- Click a result first to select

**Solution**: Complete diagnosis selection

### Issue: Validation error when saving
**Cause**: Missing required field
**Shows**: "Please select a diagnosis designation"
**Solution**: Choose Primary or Secondary radio button

### Issue: Save failed error
**Cause**: Network issue or system error (demo: random 10% failure)
**Solution**:
1. Your selection is still in panel
2. Click "Save Diagnosis" again to retry
3. If persistent, copy diagnosis details and refresh page

### Issue: Cannot add diagnosis - button disabled
**Cause**: Catalogue unavailable
**Indicator**: Yellow warning banner
**Solution**:
1. Wait and try again later
2. Contact system support
3. Document in clinical notes temporarily

### Issue: Cannot remove diagnosis
**Causes**:
- Encounter is read-only (blue notice)
- Lack edit permissions (yellow notice)
- X button not visible

**Solution**: Check encounter status and permissions

### Issue: Duplicate diagnosis warning
**Meaning**: This exact diagnosis (same ICD code) already exists in encounter
**Solution**: Each diagnosis should only be added once per encounter

---

## Clinical Best Practices

### Before Adding Diagnosis

1. **Verify Patient Identity**: Always check header
2. **Review History**: Check historical diagnoses
3. **Consider Context**: Review chief complaint and examination
4. **Check Existing**: See what's already documented

### Selecting Diagnoses

1. **Use Specific Codes**: Choose most specific diagnosis available
2. **Primary Focus**: Primary should be main reason for visit
3. **Relevant Secondary**: Only add secondary if clinically relevant
4. **Avoid Over-documenting**: Don't add diagnoses not related to encounter

### Documentation

1. **Add Clinical Notes**: Provide context and severity
2. **Be Specific**: Document examination findings supporting diagnosis
3. **Link History**: Reference relevant historical information
4. **Follow-up**: Document plan for diagnosis management

### Data Quality

1. **Accurate Coding**: Use correct ICD-10 codes from catalogue
2. **Consistent Terminology**: Use standardized names from catalogue
3. **Complete Documentation**: Fill in relevant clinical notes
4. **Review Before Finalizing**: Check all diagnoses before completing encounter

---

## Integration with Other Modules

### From Clinical Workspace (Prompt 26)
- Quick action: "Add Diagnosis"
- Part of clinical documentation workflow
- Returns to Clinical Workspace after

### From Medical History (Prompt 27)
- Reference historical diagnoses
- View full diagnosis history
- One-way reference (history → current)

### To Future Modules
- **Prescription (Prompt 29)**: Diagnosis influences medication selection
- **Laboratory (Prompt 30)**: Diagnosis justifies test orders
- **Billing**: Diagnosis codes drive billing and reimbursement

---

## Summary Checklist

Before finalizing encounter diagnoses:

- [ ] Verified correct patient identity
- [ ] Confirmed current encounter context
- [ ] Primary diagnosis correctly designated
- [ ] All relevant secondary diagnoses added
- [ ] Clinical notes provide adequate context
- [ ] ICD-10 codes are accurate
- [ ] No duplicate diagnoses
- [ ] Historical diagnoses reviewed for context
- [ ] Diagnoses support treatment plan
- [ ] Ready to proceed to prescription/orders

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Module**: Diagnosis Management (Prompt 28)  
**Part of**: ORHIMS (Oda Roba Hospital Information Management System)
