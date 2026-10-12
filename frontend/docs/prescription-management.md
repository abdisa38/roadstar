# Prescription Management — ORHIMS User Guide

**Module:** Prescription Management  
**Version:** Prompt 29 Implementation  
**Last Updated:** October 12, 2026  
**Route:** `/staff/prescription`

---

## Overview

The **Prescription Management** module provides authorized clinicians with a comprehensive interface to create, review, and manage medication orders for patient encounters. The system emphasizes clinical safety, accurate documentation, and clear communication while supporting the medication ordering workflow.

### Key Capabilities

- **Medication Catalogue Search:** Search and select medications from the hospital's medication catalogue
- **Structured Order Entry:** Enter complete prescription details with validated fields
- **Review Before Submission:** Review all order details before finalizing
- **Order Management:** Track order status from draft to dispensed
- **Allergy Awareness:** Display patient allergy information prominently
- **Diagnosis Context:** Show current encounter diagnoses for clinical reference
- **Historical Reference:** View previous medications from past encounters

### Clinical Safety Features

1. **No Automatic Prescribing:** System never auto-generates or suggests prescriptions
2. **Patient Identity Verification:** Patient details always visible at top of screen
3. **Encounter Context:** Clear display of current encounter information
4. **Allergy Warnings:** Prominent display of documented allergies
5. **Duplicate Prevention:** Warning when adding potentially duplicate medications
6. **Review Step:** Mandatory review before order submission
7. **Status Tracking:** Clear indication of order status (draft, submitted, verified, dispensed)

---

## Interface Layout

### Header Section

**Patient and Encounter Information** (Always visible at top)

- **Breadcrumb Navigation:** Back to Clinical Workspace link
- **Module Title:** "Prescription Management"
- **Patient Identity:**
  - Patient name
  - Hospital patient ID (e.g., ORH-2026-00124)
  - Age and sex
- **Encounter Details:**
  - Encounter type (e.g., General Consultation)
  - Encounter ID (e.g., ENC-2026-00087)
  - Encounter date

### Alert Banners

**Allergy Warning Banner** (If allergies documented)
- Yellow background with alert icon
- Lists medication allergies prominently
- Shows severity (severe, moderate, mild)
- "View Details" button for full allergy information

**Status Notices** (When applicable)
- **Read-Only:** Encounter is completed/cancelled - no editing allowed
- **Permission Denied:** User lacks prescription authoring permission
- **Catalogue Unavailable:** Medication catalogue not accessible

### Main Content Area

**Current Diagnoses Reference**
- Shows diagnoses recorded for this encounter
- Primary diagnosis highlighted with green background and star icon
- Up to 2 secondary diagnoses shown
- "View All" link for complete diagnosis list

**Medication Orders for This Encounter**
- Table/card view of existing medication orders
- Grouped by status (active vs cancelled/expired)
- "Create Prescription" button (when authorized)

**Add Prescription Panel** (When creating new order)
- Medication search interface
- Order details form
- Patient instructions field
- Internal clinical notes field

### Sidebar

**Previous Medications**
- Shows last 3 medications from historical encounters
- Brief details (name, strength, dosage, frequency)
- Encounter date reference
- "View All" link to complete medication history

---

## User Workflows

### 1. Creating a New Prescription

#### Step 1: Initiate Order

1. Review patient identity and encounter information in header
2. Check allergy warning banner if present
3. Click **"Create Prescription"** button

**Access Requirements:**
- User must have prescription authoring permission
- Encounter must not be read-only (completed/cancelled)
- Medication catalogue must be available

#### Step 2: Search and Select Medication

**Search Interface:**
- Minimum 2 characters required to search
- Search matches: medication name, generic name, brand name, strength, category

**Search Results Display:**
- Medication name (bold)
- Generic name • Strength • Formulation
- Category (italicized)

**Selecting a Medication:**
1. Click on desired medication from search results
2. Selected medication displays with all details
3. "Change" button available if need to select different medication

**Duplicate Detection:**
- System checks for existing active/pending orders of same medication
- Shows confirmation dialog if duplicate detected
- Options: "Cancel" or "Continue Anyway"

#### Step 3: Enter Dosage and Administration Details

**Required Fields** (marked with red asterisk *):

**Dosage Amount:** 
- Enter dose per administration (e.g., "1", "1-2", "500")
- Accepts ranges and decimal values

**Dosage Unit:**
- Select from dropdown: tablet, capsule, mg, g, mcg, ml, L, unit, drop, puff, patch, application

**Route of Administration:**
- Select from dropdown:
  - Oral
  - Intravenous (IV)
  - Intramuscular (IM)
  - Subcutaneous (SC)
  - Topical
  - Rectal
  - Inhalation
  - Nasal
  - Ophthalmic (Eye)
  - Otic (Ear)
  - Transdermal
  - Sublingual

**Frequency:**
- Select from dropdown:
  - Once daily
  - Twice daily
  - Three times daily
  - Four times daily
  - Every 4/6/8/12 hours
  - Once weekly
  - As needed (PRN)
  - At bedtime
  - Before meals
  - After meals
  - Other (specify in instructions)

#### Step 4: Enter Duration and Quantity

**Duration** (Required):
- Enter numeric value
- Select unit: days, weeks, or months
- Example: "7 days", "2 weeks", "3 months"

**Quantity to Supply** (Required):
- Enter total quantity to dispense
- Specify unit (e.g., "tablets", "capsules", "ml")
- Example: "28 tablets", "100 ml"

**Optional Fields:**

**Refills Authorized:**
- Number of refills permitted (0-12)
- Default: 0 (no refills)

**Start Date:**
- Defaults to today's date
- Can be adjusted for future start

**End Date:**
- Optional end date for treatment
- System can calculate from start date + duration

#### Step 5: Add Instructions and Notes

**Patient Instructions** (Recommended):
- Free-text field for patient-facing directions
- Visible to patient on prescription label
- Examples:
  - "Take with food"
  - "Avoid alcohol while on this medication"
  - "Complete the full course even if feeling better"

**Internal Clinical Notes** (Optional):
- For clinical staff only
- Not visible to patient
- Examples:
  - "For symptomatic relief of fever and body aches"
  - "Review response at next visit"
  - "Monitor for side effects"

#### Step 6: Review Prescription Order

1. Click **"Review Prescription"** button
2. System validates all required fields
3. If validation errors, see "Field Validation" section below
4. Review dialog opens showing complete order summary

**Review Dialog Contents:**
- Medication details (name, generic name, strength, formulation)
- Dosage and administration (dose, route, frequency, duration, quantity)
- Refills (if applicable)
- Start and end dates
- Patient instructions (if provided)
- Internal notes (if provided)
- Prescriber information

**Review Dialog Actions:**

**Edit Details:**
- Return to form to make changes
- All entered data preserved

**Save as Draft:**
- Saves order with "draft" status
- Can be edited later
- Not submitted to pharmacy

**Submit Prescription:**
- Submits order with "submitted" status
- Sends to pharmacy workflow (when backend connected)
- Cannot be directly edited after submission

**Cancel:**
- Close dialog and discard order
- Returns to order list

#### Step 7: Confirmation

After saving draft or submitting:
- Success indicator appears bottom-right
- Order added to "Medication Orders for This Encounter" list
- Add Prescription panel closes
- Can create additional prescriptions if needed

---

### 2. Viewing Existing Medication Orders

#### Order Card Display

Each medication order shows:

**Header:**
- Medication name (large, bold)
- Generic name (italicized)
- Status badge (color-coded by status)

**Key Details:**
- Strength
- Dosage
- Route of administration
- Frequency
- Duration
- Quantity

**Patient Instructions:**
- Blue highlighted box if provided
- Icon indicator

**Expandable Details** (Click "Show More"):
- Order ID
- Prescribed by
- Prescribed date
- Start date
- End date (if applicable)
- Refills (if applicable)
- Internal notes (if provided)

#### Order Status Indicators

**Draft** (Blue):
- Saved but not submitted
- Can be edited
- Not sent to pharmacy

**Submitted** (Yellow):
- Order submitted to pharmacy
- Awaiting verification
- Cannot be directly edited (requires cancellation process)

**Verified** (Green):
- Pharmacist has verified order
- Ready for dispensing

**Dispensed** (Teal):
- Medication has been dispensed to patient
- Order fulfilled

**Cancelled** (Red):
- Order has been cancelled
- No longer active
- Shows in separate "Cancelled / Expired Orders" section

**Expired** (Gray):
- Order has expired without being fulfilled
- Shows in "Cancelled / Expired Orders" section

---

### 3. Cancelling a Medication Order

**Who Can Cancel:**
- Users with prescription authoring permission
- Can cancel own orders and orders from current encounter (permission-dependent)

**Cancellable Statuses:**
- Draft orders
- Submitted orders

**Cancellation Process:**

1. Locate order in list
2. Expand order if needed (click "Show More")
3. Click **"Cancel Order"** button (red, at bottom of card)
4. Confirmation dialog appears showing:
   - Order ID
   - Medication name
   - Dosage and frequency
   - Warning: "This action cannot be undone"
5. Choose:
   - **Keep Order:** Cancel the cancellation request
   - **Cancel Order:** Proceed with cancellation

**After Cancellation:**
- Order status changes to "Cancelled"
- Order moves to "Cancelled / Expired Orders" section
- Order grayed out in display
- Cannot be uncancelled (would require new order)

**Important Notes:**
- Cancelling a submitted order may require pharmacy notification (implementation-dependent)
- Cancelling a verified or dispensed order may have different workflow requirements
- System may restrict cancellation based on order progress and institutional policy

---

### 4. Reviewing Historical Medications

**Sidebar Display:**
- Shows last 3 medications from previous encounters
- Each entry shows:
  - Medication name
  - Strength, dosage, frequency
  - Encounter date

**Purpose:**
- Reference for continuity of care
- Identify patterns in medication use
- Avoid unnecessary duplication
- Support medication reconciliation

**Accessing Full History:**
- Click **"View All"** in sidebar
- Navigates to Medical History module
- Shows complete medication history across all encounters

**Historical vs Current:**
- Historical medications are read-only reference
- Do not imply current medication status
- Previous prescription does not mean patient is currently taking medication
- Always verify current medication list with patient

---

## Field Validation

### Required Field Validation

System validates all required fields before allowing review/submission:

**Medication Selection:**
- Error: "Please select a medication from the catalogue"
- Action: Search and select a medication

**Dosage Amount:**
- Error: "Dosage amount is required"
- Action: Enter dose per administration

**Dosage Unit:**
- Error: "Dosage unit is required"
- Action: Select unit from dropdown

**Route of Administration:**
- Error: "Route of administration is required"
- Action: Select route from dropdown

**Frequency:**
- Error: "Frequency is required"
- Action: Select frequency from dropdown

**Duration:**
- Error: "Duration is required"
- Action: Enter duration value

**Quantity:**
- Error: "Quantity is required"
- Action: Enter quantity to supply

**Start Date:**
- Error: "Start date is required"
- Action: Select or enter start date

### Visual Validation Indicators

**Error State:**
- Red border on field with error
- Error icon and message below field
- Field label remains visible

**Success State:**
- No special indicator (clean design)
- Field appears normal when valid

**Focus State:**
- Blue outline when field has focus
- Indicates current field being edited

---

## Allergy Information Display

### Allergy Warning Banner

**When Displayed:**
- Patient has documented medication allergies OR
- Patient has any documented allergies with severe severity

**Banner Content:**

**Severe Allergy Alert** (when severe allergies present):
- Yellow background with orange border
- Alert triangle icon
- Lists medication allergies prominently
- Shows count of other documented allergies
- "View Details" button

**Documented Allergies** (when non-severe allergies present):
- Yellow background
- Lists medication allergies
- Shows count if multiple allergy types

**Examples:**

```
⚠ Severe Allergy Alert
Medication allergies: Penicillin
[View Details →]
```

```
⚠ Documented Allergies
Medication allergies: Aspirin, NSAIDs
2 other allergies documented
[View Details →]
```

### Allergy Status Types

**Documented:**
- One or more allergies recorded
- Shows allergy warning banner

**No Known Allergies:**
- Explicit record that patient has no allergies
- No banner shown
- Status available in patient profile

**Not Recorded:**
- Allergy information not yet documented
- No banner shown
- Status available in patient profile
- **Important:** Missing data does not mean no allergies

**Not Verified:**
- Allergy information exists but not verified
- No banner shown
- Status available in patient profile

### Accessing Detailed Allergy Information

1. Click **"View Details"** button in allergy banner
2. Navigates to allergy section of patient profile
3. Shows complete allergy list with:
   - Allergen name
   - Allergy type (medication, food, environmental, other)
   - Severity (mild, moderate, severe, unknown)
   - Reaction description
   - Recorded date

---

## Diagnosis Context Reference

### Display Location

**Current Diagnoses Reference** section
- Appears above medication orders list
- Compact card with header and list
- Icon: clipboard

### Information Shown

**Primary Diagnosis:**
- Star icon indicator
- Green background highlight
- Diagnosis name
- ICD-10 code

**Secondary Diagnoses:**
- Up to 2 shown in initial view
- Diagnosis name
- ICD-10 code

**Additional Diagnoses:**
- "+X more diagnoses" button if more than 2 secondaries
- Click to navigate to diagnosis module

### Empty State

When no diagnoses recorded:
```
📋 Current Diagnoses
No diagnoses recorded for this encounter
```

### Purpose

- Provides clinical context for prescribing decisions
- Supports appropriate medication selection
- Facilitates documentation of indication
- Links prescription to clinical condition

### Navigation

**"View All" Button:**
- Navigates to Diagnosis Management module
- Shows complete diagnosis list for encounter
- Maintains encounter context

**Unsaved Changes Protection:**
- If prescription form has unsaved data
- System prompts before navigation
- Options: "Continue Editing" or "Discard Changes"

---

## Save State and Auto-Save

### Save State Indicator

**Location:** Bottom-right of screen, floating above content

**States:**

**Saving:**
- Spinning icon
- Text: "Saving..."
- Blue color scheme

**Saved:**
- Checkmark icon
- Text: "Saved"
- Green color scheme
- Auto-dismisses after 3 seconds

**Error:**
- Alert icon
- Text: "Save failed"
- Red color scheme
- Remains visible until dismissed or retry

### No Auto-Save

**Important:** System does **NOT** automatically save prescription forms

**Reasons:**
1. Clinical safety: prevent accidental/incomplete orders
2. Deliberate action required for prescriptions
3. Clear distinction between drafts and submissions

**User Actions Required:**
- Must explicitly click "Save as Draft" or "Submit Prescription"
- Cannot navigate away without saving (will trigger unsaved changes warning)
- Cannot close browser tab without losing data

### Unsaved Changes Warning

**Triggers:**
- Clicking "Back to Clinical Workspace"
- Clicking "Cancel" on prescription form
- Navigating to diagnosis, allergy, or history sections
- Browser back button (may not catch all cases)

**Dialog Content:**
```
⚠ Unsaved Changes
You have unsaved changes to this prescription. 
Are you sure you want to leave?

[Continue Editing]  [Discard Changes]
```

**Actions:**

**Continue Editing:**
- Closes dialog
- Returns to prescription form
- All data preserved

**Discard Changes:**
- Closes prescription form
- All entered data lost
- Proceeds with navigation

---

## Permission and Access Control

### Required Permissions

**To View Module:**
- Access to clinical modules
- Permission to view encounter details

**To Create Prescriptions:**
- Prescription authoring permission
- Assigned to encounter or appropriate clinical role

**To Cancel Orders:**
- Prescription authoring permission
- May be restricted to own orders (policy-dependent)

### Permission-Denied States

**No Prescription Permission:**
- Yellow notice banner displayed
- "Permission required" heading
- Message: "You do not have permission to create or modify medication orders."
- Can view existing orders
- "Create Prescription" button hidden

**Read-Only Encounter:**
- Blue notice banner displayed
- Lock icon
- "Read-only encounter" heading
- Message: "This encounter is [completed/cancelled]. Medication orders cannot be created or modified."
- Can view existing orders
- Cannot create, edit, or cancel orders

### Catalogue Availability

**Catalogue Unavailable:**
- Red/pink notice banner displayed
- Alert icon
- "Medication catalogue unavailable" heading
- Message: "The medication catalogue is currently unavailable. Prescriptions cannot be created until the catalogue is restored."
- Cannot create new prescriptions
- Can view existing orders
- Can cancel existing draft orders

---

## Medication Search Best Practices

### Effective Search Strategies

**By Medication Name:**
```
Search: "amlodipine"
Results: Amlodipine 5mg Tablet, Amlodipine 10mg Tablet
```

**By Generic Name:**
```
Search: "paracetamol"
Results: Paracetamol 500mg Tablet (Panadol)
```

**By Brand Name:**
```
Search: "brufen"
Results: Ibuprofen 400mg Tablet (Brufen)
```

**By Strength:**
```
Search: "500mg"
Results: Amoxicillin 500mg, Paracetamol 500mg, Metformin 500mg...
```

**By Category:**
```
Search: "antibiotic"
Results: Amoxicillin, Metronidazole, Cephalexin, Doxycycline...
```

### Search Tips

1. **Start Specific, Broaden if Needed:**
   - Try exact medication name first
   - If no results, try generic name
   - Try category as last resort

2. **Use Common Spelling:**
   - System may not handle all spelling variations
   - Use standard international nomenclature

3. **Include Strength for Common Medications:**
   - Faster to search "metformin 500" than just "metformin"
   - Reduces scrolling through multiple formulations

4. **Check All Results:**
   - Multiple strengths may be available
   - Multiple formulations may be available (tablet, capsule, liquid)
   - Select most appropriate for patient

### Search Limitations

**Minimum Characters:**
- Must type at least 2 characters
- "Type at least 2 characters to search" hint shown

**No Results:**
- "No medications found matching [query]"
- Suggestions:
  - Check spelling
  - Try different search term
  - Try generic instead of brand name
  - Check with pharmacy if medication should be in catalogue

**Catalogue Unavailable:**
- Search will not function
- System notice displayed
- Contact IT support or wait for restoration

---

## Common Workflows and Examples

### Example 1: Simple Oral Medication

**Scenario:** Prescribe paracetamol for fever and pain

**Steps:**

1. Click "Create Prescription"

2. Search medication:
   - Enter "paracetamol"
   - Select "Paracetamol • 500 mg • Tablet"

3. Enter details:
   - Dosage Amount: 1-2
   - Dosage Unit: tablet
   - Route: Oral
   - Frequency: Every 6 hours as needed
   - Duration: 7
   - Duration Unit: days
   - Quantity: 28
   - Quantity Unit: tablets

4. Add patient instructions:
   "Take 1-2 tablets every 6 hours as needed for pain or fever. Do not exceed 8 tablets in 24 hours."

5. Add internal notes:
   "For symptomatic relief of fever and body aches"

6. Click "Review Prescription"

7. Verify all details in review dialog

8. Click "Submit Prescription"

**Result:** Order submitted with ID RX-2026-XXXXX

---

### Example 2: Chronic Medication with Refills

**Scenario:** Prescribe amlodipine for hypertension management

**Steps:**

1. Click "Create Prescription"

2. Search and select:
   - Search "amlodipine 5"
   - Select "Amlodipine • 5 mg • Tablet"

3. Enter details:
   - Dosage Amount: 1
   - Dosage Unit: tablet
   - Route: Oral
   - Frequency: Once daily
   - Duration: 30
   - Duration Unit: days
   - Quantity: 30
   - Quantity Unit: tablets
   - Refills: 3

4. Set dates:
   - Start Date: Today
   - End Date: 3 months from today

5. Add patient instructions:
   "Take 1 tablet once daily in the morning for blood pressure control. Do not stop suddenly without consulting your doctor."

6. Add internal notes:
   "For essential hypertension. Review BP readings and response at next visit."

7. Review and submit

**Result:** 30-day supply with 3 refills (120 days total coverage)

---

### Example 3: Short-Course Antibiotic

**Scenario:** Prescribe antibiotic for respiratory infection, patient has penicillin allergy

**Pre-Check:**
- Allergy banner shows: "Medication allergies: Penicillin"
- Must select non-penicillin antibiotic

**Steps:**

1. Click "Create Prescription"

2. Search and select:
   - Search "doxycycline"
   - Select "Doxycycline • 100 mg • Capsule"

3. Enter details:
   - Dosage Amount: 1
   - Dosage Unit: capsule
   - Route: Oral
   - Frequency: Twice daily
   - Duration: 7
   - Duration Unit: days
   - Quantity: 14
   - Quantity Unit: capsules

4. Add patient instructions:
   "Take 1 capsule twice daily with food for 7 days. Complete the full course even if you feel better. Avoid dairy products within 2 hours of taking this medication."

5. Add internal notes:
   "For acute bacterial respiratory infection. Patient allergic to penicillin."

6. Review and submit

**Result:** 7-day course, no refills (appropriate for antibiotic)

---

### Example 4: Inhaled Medication

**Scenario:** Prescribe salbutamol inhaler for asthma

**Steps:**

1. Click "Create Prescription"

2. Search and select:
   - Search "salbutamol inhaler"
   - Select "Salbutamol • 100 mcg • Inhaler"

3. Enter details:
   - Dosage Amount: 1-2
   - Dosage Unit: puff
   - Route: Inhalation
   - Frequency: As needed (PRN)
   - Duration: 30
   - Duration Unit: days
   - Quantity: 1
   - Quantity Unit: inhaler (200 doses)

4. Add patient instructions:
   "Inhale 1-2 puffs as needed for shortness of breath or wheezing. Shake well before use. Wait 1 minute between puffs if using 2 puffs. If using more than 4 times per day, consult your doctor."

5. Add internal notes:
   "For asthma rescue therapy. Educate on proper inhaler technique."

6. Review and submit

**Result:** PRN inhaler with usage instructions

---

### Example 5: Handling Duplicate Order Warning

**Scenario:** Patient already has active paracetamol order, need to add another for increased dosing

**Steps:**

1. Click "Create Prescription"

2. Search and select:
   - Search "paracetamol"
   - Select "Paracetamol • 500 mg • Tablet"

3. **Duplicate Dialog Appears:**
   ```
   ⚠ Potential Duplicate Order
   An active or pending order for Paracetamol 
   already exists for this encounter.
   
   Do you want to continue creating a new order 
   for this medication?
   
   [Cancel]  [Continue Anyway]
   ```

4. Consider options:
   - **Cancel:** Review existing order, potentially cancel old one first
   - **Continue Anyway:** Create new order (appropriate if changing dose/frequency)

5. If continuing:
   - Complete order form as normal
   - Add clear notes explaining reason for new order
   - Example note: "Increased frequency due to persistent fever. Previous order to be cancelled."

6. Review and submit

7. Cancel previous order if needed

**Result:** New order created, old order should be cancelled to avoid confusion

---

## Troubleshooting

### Issue: Cannot Click "Create Prescription" Button

**Possible Causes:**

1. **Button is Disabled/Not Visible**
   - Check for permission notice banner
   - Check for read-only encounter notice
   - Check for catalogue unavailable notice

**Solutions:**
- If permission issue: Contact supervisor for prescription privileges
- If read-only encounter: Cannot create orders for completed encounters
- If catalogue unavailable: Wait for system restoration or contact IT

2. **Button Not Responding**
   - Browser compatibility issue
   - JavaScript error

**Solutions:**
- Refresh page
- Try different browser
- Clear browser cache
- Check browser console for errors

---

### Issue: Search Returns No Results

**Possible Causes:**

1. **Query Too Short**
   - Need at least 2 characters

**Solution:**
- Type more characters

2. **Spelling Error**
   - Medication name misspelled

**Solution:**
- Check spelling
- Try generic name instead of brand
- Try alternate spelling

3. **Medication Not in Catalogue**
   - Hospital may not stock medication
   - Catalogue may be incomplete

**Solution:**
- Try similar medication in same class
- Contact pharmacy to verify availability
- Consider alternative therapeutic options

4. **Catalogue Unavailable**
   - System issue

**Solution:**
- Check for catalogue unavailable notice
- Contact IT support
- Wait for restoration

---

### Issue: Validation Errors Prevent Review

**Common Validation Errors:**

1. **"Please select a medication from the catalogue"**
   - Medication not selected

**Solution:**
- Search and select medication from results
- Cannot manually type medication name

2. **"Dosage amount is required"**
   - Field is empty

**Solution:**
- Enter dose (e.g., "1", "1-2", "500")

3. **"Dosage unit is required"**
   - No unit selected

**Solution:**
- Select appropriate unit from dropdown

4. **"Route of administration is required"**
   - No route selected

**Solution:**
- Select route from dropdown
- Check that selected route is appropriate for formulation

5. **"Frequency is required"**
   - No frequency selected

**Solution:**
- Select frequency from dropdown

6. **"Duration is required"**
   - Field is empty

**Solution:**
- Enter duration value
- Ensure value is numeric

7. **"Quantity is required"**
   - Field is empty

**Solution:**
- Enter quantity to supply
- Calculate based on dose, frequency, and duration

**Validation Troubleshooting Steps:**

1. Scroll through entire form
2. Look for fields with red border
3. Check for error messages below fields
4. Fill in or correct all required fields
5. Click "Review Prescription" again

---

### Issue: Unsaved Changes Dialog Keeps Appearing

**Cause:**
- Form has unsaved data
- Attempting to navigate away

**Solutions:**

**Option 1 - Save/Submit:**
1. Click "Continue Editing"
2. Complete prescription form
3. Click "Review Prescription"
4. Save as draft or submit
5. Navigate after successful save

**Option 2 - Discard:**
1. Click "Discard Changes"
2. Confirm you want to lose all entered data
3. Navigation proceeds

**Prevention:**
- Complete prescriptions before navigating
- Save drafts if need to leave form temporarily
- Keep browser tab open until prescription saved

---

### Issue: Cannot Cancel an Order

**Possible Causes:**

1. **Order Status Doesn't Allow Cancellation**
   - Verified or dispensed orders may require different process

**Solution:**
- Contact pharmacy for cancellation process
- May require separate documentation

2. **Permission Issue**
   - User lacks cancellation permission
   - Can only cancel own orders (policy-dependent)

**Solution:**
- Contact supervisor or prescribing clinician
- Request they cancel order
- Check with system administrator for permissions

3. **Button Not Visible**
   - Order status doesn't permit cancellation
   - Permission restrictions

**Solution:**
- Expand order card (click "Show More")
- Check order status
- Verify permissions with supervisor

---

### Issue: Review Dialog Shows Incorrect Information

**Possible Cause:**
- Form update not reflected in review
- Browser state issue

**Solution:**

1. Click "Edit Details" in review dialog
2. Verify all fields are correct
3. Click "Review Prescription" again
4. If problem persists:
   - Click "Cancel" in review dialog
   - Close prescription form (cancel button)
   - Re-open form
   - Re-enter prescription details
   - If still occurring, report as bug

---

### Issue: Save/Submit Taking Too Long

**Normal Behavior:**
- Saving indicator appears bottom-right
- Usually completes within 1-2 seconds

**If Slow (>5 seconds):**

**Possible Causes:**
- Network connectivity issue
- Server performance issue
- Large data volume

**Solutions:**

1. Wait for save to complete - do not navigate away
2. If "Saved" confirmation appears, proceed normally
3. If "Save failed" appears:
   - Check network connection
   - Click "Save as Draft" or "Submit Prescription" again
   - If repeated failures, contact IT support
   - Copy prescription details to text file as backup

4. If no response after 30 seconds:
   - Do not close browser
   - Check browser console for errors
   - Contact IT support
   - May need to restart browser after issue resolved

---

## Clinical Best Practices

### Medication Selection

1. **Verify Patient Identity**
   - Always check patient name and ID in header
   - Ensure prescribing for correct patient

2. **Check Allergies First**
   - Review allergy banner before selecting medication
   - Verify no cross-reactivity with documented allergies
   - If unsure, consult pharmacy or drug information resource

3. **Review Historical Medications**
   - Check sidebar for previous medications
   - Consider:
     - Previous response to medications
     - Previous adverse reactions
     - Current medication regimen (avoid duplicates)
     - Potential drug interactions

4. **Consider Diagnosis Context**
   - Review current diagnoses in reference section
   - Select medication appropriate for documented condition
   - Ensure indication is clear

5. **Choose Appropriate Formulation**
   - Consider patient's ability to swallow (tablets vs liquid)
   - Consider route of administration restrictions
   - Choose strength that allows convenient dosing

### Dosing Guidelines

1. **Use Standard Dosing**
   - Follow evidence-based dosing guidelines
   - Reference hospital formulary
   - Consider patient-specific factors (age, weight, renal function)

2. **Calculate Carefully**
   - Verify dose calculations
   - Use calculator for complex calculations
   - Double-check decimal point placement

3. **Specify Clearly**
   - Use standard abbreviations or avoid abbreviations
   - Spell out units if any ambiguity
   - Use ranges when appropriate (e.g., "1-2 tablets")

4. **Avoid High-Risk Patterns**
   - Avoid trailing zeros (5.0 → write as 5)
   - Use leading zeros (0.5, not .5)
   - Specify "units" not "U" (can be misread as zero)

### Duration and Quantity

1. **Appropriate Duration**
   - Short courses for acute conditions
   - Longer supply for chronic medications
   - Consider follow-up timing

2. **Calculate Quantity Correctly**
   ```
   Quantity = Dose frequency × Duration
   Example: 1 tablet, twice daily, 7 days = 14 tablets
   Example: 2 tablets, three times daily, 10 days = 60 tablets
   ```

3. **Include Buffer**
   - May add 1-2 days supply as buffer
   - Helps prevent missed doses if appointment delayed

4. **Refills for Chronic Medications**
   - Appropriate for stable chronic conditions
   - Consider prescription expiration laws
   - Ensure follow-up scheduled within coverage period

### Patient Instructions

1. **Be Clear and Specific**
   - Use plain language
   - Avoid medical jargon
   - Include:
     - When to take (time of day, relation to meals)
     - How to take (with water, with food, crush/don't crush)
     - What to avoid (alcohol, certain foods, sun exposure)
     - Duration (how long to continue)
     - What to do if miss dose

2. **Examples of Good Instructions**
   ```
   Good: "Take 1 tablet once daily in the morning with breakfast."
   Better: "Take 1 tablet once daily in the morning with breakfast. May cause drowsiness initially."
   
   Good: "Apply to affected area twice daily."
   Better: "Apply thin layer to affected area twice daily (morning and evening). Wash hands after application."
   
   Good: "Take with food."
   Better: "Take with meals or snack to reduce stomach upset."
   ```

3. **Include Safety Information**
   - Common side effects to expect
   - Serious side effects requiring immediate attention
   - Interactions to avoid
   - Storage instructions if relevant

### Documentation

1. **Use Internal Notes**
   - Document indication for prescription
   - Note clinical reasoning if non-standard choice
   - Record patient education provided
   - Note any special considerations

2. **Example Internal Notes**
   ```
   "For essential hypertension. Target BP <140/90. Review response at 4-week follow-up."
   
   "Patient requested generic formulation due to cost. Counselled on importance of adherence."
   
   "Short course for acute exacerbation. Patient has chronic condition managed by specialist. Notify specialist of this prescription."
   
   "Patient educated on proper inhaler technique. Demonstration provided and return demonstration satisfactory."
   ```

### Safety Checks

**Before Submitting Every Prescription:**

1. ✅ Correct patient (name and ID match)
2. ✅ No allergy or contraindication
3. ✅ Appropriate medication for diagnosis
4. ✅ Correct dose for patient
5. ✅ Correct route and formulation
6. ✅ Appropriate frequency
7. ✅ Appropriate duration
8. ✅ Correct quantity calculation
9. ✅ Clear patient instructions
10. ✅ Indication documented (internal notes)

---

## Integration with Other Modules

### Clinical Workspace

**Navigation:**
- Breadcrumb link: "Back to Clinical Workspace"
- Maintains encounter context

**Usage:**
- Access prescription management from clinical workspace
- Return to workspace after prescribing
- Prescription management is one component of complete encounter documentation

**Workflow:**
1. Open encounter in clinical workspace
2. Navigate to prescription management
3. Create/review prescriptions
4. Return to clinical workspace to complete other documentation

---

### Diagnosis Management

**Connection:**
- Current diagnoses displayed in reference section
- Supports appropriate prescribing decisions

**Navigation:**
- "View All" button in diagnoses section
- Navigates to diagnosis management module
- Unsaved changes warning if prescription form open

**Best Practice:**
- Complete diagnosis documentation before prescribing
- Ensures clear indication for medications
- Supports quality documentation

---

### Medical History

**Connection:**
- Historical medications shown in sidebar
- Supports medication reconciliation

**Navigation:**
- "View All" button in historical medications section
- Navigates to medical history module
- Shows complete medication history

**Usage:**
- Review before prescribing new medications
- Check for:
  - Previous response to similar medications
  - Potential drug interactions
  - Allergies or adverse reactions
  - Patterns in medication use

---

### Patient Allergies

**Connection:**
- Allergy warning banner displayed prominently
- Essential for safe prescribing

**Navigation:**
- "View Details" button in allergy banner
- Navigates to allergy section of patient profile

**Critical Importance:**
- Always review allergies before prescribing
- System shows documented allergies but cannot prevent all errors
- Clinician responsibility to verify appropriateness

---

## Frequently Asked Questions

### General Questions

**Q: Who can create prescriptions?**
A: Only users with prescription authoring permission can create and submit prescriptions. This typically includes physicians, nurse practitioners, and other authorized prescribers as defined by hospital policy and local regulations.

**Q: Can I create prescriptions for completed encounters?**
A: No. Once an encounter is completed or cancelled, it becomes read-only. No new prescriptions can be created for that encounter. If medication is needed, a new encounter must be opened.

**Q: Does the system automatically suggest medications based on diagnosis?**
A: No. The system never automatically generates or suggests prescriptions. All medication selection and prescribing decisions are made by the clinician.

**Q: Can I copy a prescription from a previous encounter?**
A: Not directly through the interface. You can view historical medications in the sidebar for reference, but must manually enter the prescription details. This is a deliberate safety feature to ensure clinician review of all prescription details.

### Search and Selection

**Q: Why do I need to type at least 2 characters to search?**
A: This prevents overwhelming the interface with too many results. A 1-character search would return nearly the entire catalogue and make finding the desired medication difficult.

**Q: The medication I need isn't in the search results. What should I do?**
A: The medication may not be in the hospital formulary. Contact the pharmacy to:
- Verify if medication is available
- Request medication be added to formulary if appropriate
- Identify therapeutic alternatives that are in formulary

**Q: Can I manually type a medication name instead of searching?**
A: No. All medications must be selected from the catalogue. This ensures:
- Medication is available in the hospital formulary
- Medication details are accurate
- Order can be fulfilled by pharmacy
- Standardized naming and documentation

**Q: What's the difference between medication name, generic name, and brand name?**
A: 
- **Medication Name:** Primary name used in catalogue (may be generic or brand)
- **Generic Name:** International nonproprietary name (INN) or generic drug name
- **Brand Name:** Manufacturer's trademark name (may be null if no brand name)
- Example: Medication Name "Paracetamol", Generic Name "Paracetamol (Acetaminophen)", Brand Name "Panadol"

### Dosing and Details

**Q: What if I need a dose that's not in the dropdown?**
A: 
- Use "Dosage Amount" field for flexibility (can enter ranges, decimals)
- Use "Other" option in frequency dropdown
- Specify complete instructions in "Patient Instructions" field
- Document reasoning in "Internal Notes"

**Q: Can I prescribe a medication without entering patient instructions?**
A: Yes, patient instructions are optional. However, providing clear instructions is strongly recommended for:
- Patient safety
- Improved adherence
- Reduced confusion
- Better clinical outcomes

**Q: How do I prescribe "as needed" (PRN) medications?**
A: 
1. Select "As needed (PRN)" from frequency dropdown
2. Specify maximum frequency in patient instructions
3. Example: "Take 1-2 tablets every 6 hours as needed for pain. Do not exceed 8 tablets in 24 hours."

**Q: What's the difference between "Save as Draft" and "Submit Prescription"?**
A:
- **Save as Draft:** Order saved but not submitted to pharmacy. Status is "draft". Can be edited later. Useful for incomplete orders or orders to be reviewed later.
- **Submit Prescription:** Order submitted to pharmacy workflow. Status is "submitted". Cannot be directly edited (requires cancellation process). Pharmacy will verify and dispense.

### Order Management

**Q: Can I edit a submitted prescription?**
A: No. Once submitted, prescriptions enter pharmacy workflow and cannot be directly edited. To change a submitted order:
1. Cancel the incorrect order
2. Create a new correct order
3. Document reason for cancellation in internal notes

**Q: How do I find all prescriptions for a patient across all encounters?**
A: Navigate to Medical History module (click "View All" in historical medications sidebar). This shows complete medication history across all encounters.

**Q: What happens to prescriptions when an encounter is completed?**
A: Prescriptions remain associated with the encounter and are part of the permanent medical record. They become read-only like all other encounter documentation. Active prescriptions may continue to be filled at pharmacy even after encounter is completed.

**Q: Can I cancel a prescription that's already been dispensed?**
A: Cancelling a dispensed prescription in the system doesn't reverse the dispensing. It indicates the order is no longer active. If patient has already received medication, additional steps may be needed:
- Contact pharmacy
- Document patient education about discontinuation
- Ensure patient understands not to continue medication
- Consider requesting patient return unused medication

### Allergies and Safety

**Q: What if patient reports new allergy while I'm prescribing?**
A:
1. Cancel current prescription form (save draft if want to preserve work)
2. Navigate to patient allergy information
3. Document new allergy
4. Return to prescription management
5. Allergy banner should now display new allergy
6. Select appropriate alternative medication

**Q: The system showed a duplicate warning but I think I need both orders. What should I do?**
A: If clinically appropriate to have duplicate orders (rare), you can proceed:
1. Click "Continue Anyway" in duplicate dialog
2. Complete prescription form
3. **Important:** Document clearly in internal notes why duplicate order is clinically appropriate
4. Example note: "Intentional duplicate order for different indication. Previous order for chronic use, this order for acute exacerbation."

**Q: Does the system check for drug interactions?**
A: The current interface does not include a drug interaction checker. Clinician is responsible for:
- Reviewing patient's current medication list
- Consulting drug interaction references when appropriate
- Documenting any potential interactions and risk/benefit assessment

### Technical Issues

**Q: What browsers are supported?**
A: Module is designed to work with modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Must have JavaScript enabled
- Mobile browsers supported but desktop experience recommended

**Q: My prescription form disappeared. Is the data lost?**
A: If you navigated away without saving, data is lost. System does not auto-save prescriptions for safety reasons. Best practices:
- Save draft frequently if working on complex order
- Keep browser tab open while working
- Copy critical details to text file if concerned about losing work

**Q: I'm getting an error message. What should I do?**
A:
1. Take screenshot of error
2. Note what you were doing when error occurred
3. Note any error code or technical details
4. Try refreshing page
5. If error persists, contact IT support with:
   - Screenshot
   - Steps to reproduce
   - Your user ID
   - Patient ID and encounter ID (if applicable)
   - Time error occurred

---

## Appendix A: Status Definitions

### Order Status Lifecycle

```
Draft → Submitted → Verified → Dispensed
   ↓        ↓         ↓
Cancelled ← Cancelled ← Cancelled
```

### Detailed Status Definitions

**Draft**
- **Meaning:** Order saved but not yet submitted
- **Actions Available:** Edit, delete, submit
- **Pharmacy Involvement:** None
- **Color Code:** Blue
- **Use Case:** Incomplete orders, orders pending review, template orders

**Submitted**
- **Meaning:** Order submitted to pharmacy, awaiting verification
- **Actions Available:** Cancel (requires confirmation)
- **Pharmacy Involvement:** Pharmacist reviewing order
- **Color Code:** Yellow/Orange
- **Use Case:** Active orders in pharmacy queue

**Verified**
- **Meaning:** Pharmacist verified order, ready for dispensing
- **Actions Available:** Cancel (may require pharmacy coordination)
- **Pharmacy Involvement:** Order approved, preparing medication
- **Color Code:** Green
- **Use Case:** Orders ready to be filled

**Dispensed**
- **Meaning:** Medication dispensed to patient
- **Actions Available:** View only (cancellation may require special process)
- **Pharmacy Involvement:** Order fulfilled
- **Color Code:** Teal/Blue-green
- **Use Case:** Completed orders

**Cancelled**
- **Meaning:** Order cancelled before completion
- **Actions Available:** View only
- **Pharmacy Involvement:** Order removed from pharmacy workflow
- **Color Code:** Red
- **Use Case:** Incorrect orders, changed clinical decision, patient declined

**Expired**
- **Meaning:** Order expired before being fulfilled
- **Actions Available:** View only
- **Pharmacy Involvement:** Order removed from pharmacy workflow
- **Color Code:** Gray
- **Use Case:** Time-limited orders not filled within validity period

---

## Appendix B: Abbreviations and Terms

### Common Medical Abbreviations

**Route Abbreviations:**
- PO = Per os (oral, by mouth)
- IV = Intravenous
- IM = Intramuscular
- SC / SQ = Subcutaneous
- SL = Sublingual
- PR = Per rectum (rectal)
- TOP = Topical

**Frequency Abbreviations:**
- OD / QD = Once daily (omne in die)
- BD / BID = Twice daily (bis in die)
- TDS / TID = Three times daily (ter in die)
- QDS / QID = Four times daily (quater in die)
- PRN = As needed (pro re nata)
- STAT = Immediately

**Dosing Terms:**
- mg = Milligram
- g = Gram
- mcg / μg = Microgram
- mL = Milliliter
- L = Liter
- IU / U = International Unit

### ORHIMS-Specific Terms

**Encounter:**
- A single patient visit or admission
- Contains all documentation for that visit
- Has unique encounter ID

**Catalogue:**
- Hospital medication formulary
- List of medications available for prescribing
- Searchable database

**Draft:**
- Saved but not submitted order
- Can be edited
- Not sent to pharmacy

**Prescriber:**
- Clinician authorized to write prescriptions
- Has prescription authoring permission

**Clinical Workspace:**
- Main encounter documentation interface
- Centralized access to all clinical modules

---

## Appendix C: Sample Medication Orders

### Sample 1: Short-Term Analgesic

**Medication:** Paracetamol 500mg Tablet  
**Dosage:** 1-2 tablets  
**Route:** Oral  
**Frequency:** Every 6 hours as needed  
**Duration:** 7 days  
**Quantity:** 28 tablets  
**Refills:** 0  
**Patient Instructions:** "Take 1-2 tablets every 6 hours as needed for pain or fever. Do not exceed 8 tablets in 24 hours. Take with food if stomach upset occurs."  
**Internal Notes:** "For symptomatic relief of fever and body aches associated with URI."

---

### Sample 2: Chronic Antihypertensive

**Medication:** Amlodipine 5mg Tablet  
**Dosage:** 1 tablet  
**Route:** Oral  
**Frequency:** Once daily  
**Duration:** 30 days  
**Quantity:** 30 tablets  
**Refills:** 3  
**Start Date:** Today  
**End Date:** 120 days from today  
**Patient Instructions:** "Take 1 tablet once daily in the morning for blood pressure control. Continue taking even if you feel well. Do not stop suddenly without consulting your doctor. If you experience swelling of ankles, dizziness, or irregular heartbeat, contact your doctor."  
**Internal Notes:** "For essential hypertension. Target BP <140/90. Monitor BP and adjust dose at 4-week follow-up. Patient counseled on importance of adherence and lifestyle modifications."

---

### Sample 3: Antibiotic Course

**Medication:** Metronidazole 400mg Tablet  
**Dosage:** 1 tablet  
**Route:** Oral  
**Frequency:** Three times daily  
**Duration:** 7 days  
**Quantity:** 21 tablets  
**Refills:** 0  
**Patient Instructions:** "Take 1 tablet three times daily (morning, afternoon, evening) with or after meals for 7 days. Complete the full course even if you feel better. Avoid alcohol during treatment and for 48 hours after last dose as this may cause severe nausea and vomiting."  
**Internal Notes:** "For bacterial infection. Patient counseled on importance of completing full course and alcohol restriction. Return if symptoms worsen or no improvement after 3 days."

---

### Sample 4: Inhaled Medication

**Medication:** Salbutamol 100mcg Inhaler  
**Dosage:** 1-2 puffs  
**Route:** Inhalation  
**Frequency:** As needed  
**Duration:** 30 days  
**Quantity:** 1 inhaler (200 doses)  
**Refills:** 2  
**Patient Instructions:** "Shake well before use. Inhale 1-2 puffs as needed for shortness of breath or wheezing. Wait 1 minute between puffs if using 2 puffs. Rinse mouth after use. If using more than 4 times per day, or if inhaler not providing relief, consult your doctor. Keep track of remaining doses - replace inhaler when counter reaches zero."  
**Internal Notes:** "For asthma rescue therapy. Patient demonstrated proper inhaler technique. Educated on when to seek emergency care (respiratory distress, no response to inhaler, need for frequent use). Has written asthma action plan."

---

### Sample 5: Topical Medication

**Medication:** Hydrocortisone 1% Cream  
**Dosage:** Apply thin layer  
**Route:** Topical  
**Frequency:** Twice daily  
**Duration:** 14 days  
**Quantity:** 15g tube  
**Refills:** 0  
**Patient Instructions:** "Wash and dry affected area. Apply thin layer to affected area twice daily (morning and evening). Rub in gently until absorbed. Wash hands after application unless treating hands. Do not cover with airtight dressing unless instructed. Avoid contact with eyes. If no improvement after 1 week, or if condition worsens, contact your doctor. Do not use for more than 2 weeks without medical advice."  
**Internal Notes:** "For localized eczema. Advised to use moisturizer regularly. Return if no improvement or signs of infection develop."

---

## Version History

**Version 1.0 - October 12, 2026**
- Initial implementation of Prescription Management module
- Prompt 29 completion
- Integrated with ORHIMS clinical workflow
- Comprehensive user guide created

---

## Support and Feedback

### Getting Help

**For Clinical Questions:**
- Contact your clinical supervisor
- Consult pharmacy for medication-specific questions
- Reference hospital formulary and prescribing guidelines

**For Technical Issues:**
- Contact IT Help Desk
- Report bugs through ticketing system
- Include screenshots and detailed steps to reproduce

**For Feature Requests:**
- Submit through ORHIMS feedback portal
- Include use case description
- Describe desired functionality

### Training Resources

**Available Training:**
- ORHIMS orientation for new users
- Prescription module in-person training
- Video tutorials (if available)
- Quick reference guides
- This user guide

**Self-Service Learning:**
- Practice with demonstration data
- Review sample prescriptions in Appendix C
- Follow example workflows in this guide
- Explore interface in training environment

---

**Document End**

This guide is part of the ORHIMS documentation suite. For other module guides, see:
- Clinical Workspace User Guide
- Diagnosis Management User Guide  
- Medical History User Guide
- Triage Assessment User Guide

For questions or feedback about this guide, contact the ORHIMS documentation team.
