# Clinical Workspace User Guide (Prompt 26)

## Overview

The Clinical Workspace is the doctor's primary patient encounter documentation interface. It provides a structured environment for reviewing patient context, documenting consultation notes, and accessing related clinical workflows.

**Access URL**: `http://localhost:8443/staff/clinical`

## Purpose

Enable physicians to:
- Review patient identity and encounter context
- Access critical clinical safety information (allergies, vital signs)
- Document structured consultation notes
- Navigate to related clinical modules (diagnoses, prescriptions, laboratory orders)
- Manage consultation documentation with clear save states

---

## Page Layout

The Clinical Workspace uses a three-area layout:

### 1. Navigation Tabs (Left Sidebar - 240px)
- **Overview** - Patient demographics and encounter summary
- **Clinical Notes** - Active consultation documentation (default view)
- **Medical History** - Past medical conditions and surgeries
- **Diagnoses** - Current and historical diagnoses
- **Prescriptions** - Current medications and prescriptions
- **Laboratory** - Lab orders and results
- **Documents** - Uploaded clinical documents

### 2. Main Content Area (Center)
Displays the content for the selected navigation tab:
- **Overview**: Patient identity card and encounter details
- **Clinical Notes**: Structured consultation note editor
- **Other tabs**: "Coming soon" placeholders with descriptive text

### 3. Context Panel (Right Sidebar - 340px)
Always visible on desktop, contains:
- **Clinical Safety Summary**: Allergies and vital signs
- **Quick Actions**: Common clinical workflows
  - Add Diagnosis
  - Prescribe Medication
  - Order Laboratory Tests
  - Request Imaging
  - Refer to Specialist

---

## Step-by-Step Usage

### 1. Accessing the Clinical Workspace

**Direct URL Access:**
```
http://localhost:8443/staff/clinical
```

**From Other Modules:**
- Click patient name in Doctor Dashboard patient list
- Click "Document Encounter" from queue management
- Select patient from active encounters list

**Demo Patient Loaded:**
- Name: Hana Mohammed
- MRN: ORH-2026-00124
- Encounter: ENC-2026-00087
- Visit Type: Follow-up Consultation

---

### 2. Understanding the Patient Encounter Header

**Location**: Top of page, always visible

**Information Displayed:**
- **Patient Name**: Full name with age and sex
- **MRN**: Medical Record Number
- **Encounter ID**: Current encounter identifier
- **Visit Type**: Type of visit (e.g., Follow-up Consultation)
- **Visit Date**: Date and time of encounter

**Example Display:**
```
Hana Mohammed (32, Female) | MRN: ORH-2026-00124
Follow-up Consultation | ENC-2026-00087 | January 11, 2026 at 9:30 AM
```

---

### 3. Reviewing Clinical Safety Information

**Location**: Context Panel (right sidebar) → Clinical Safety Summary

#### Allergy Information

Three possible states:

**A. Not Verified (Yellow Alert)**
```
⚠️ ALLERGY STATUS NOT VERIFIED
No allergy information has been documented or verified for this patient.
```
- **Action Required**: Verify allergy status before prescribing
- **Safety Note**: Do not assume "no allergies" from missing data

**B. No Known Allergies (Green Check)**
```
✓ NO KNOWN ALLERGIES
Documented and verified at: [date/time]
```
- Safe to proceed with prescribing
- Status was explicitly documented

**C. Allergies Documented (Red Alert)**
```
🛑 DOCUMENTED ALLERGIES
• Penicillin (Severity: Moderate)
  Reaction: Rash, hives
  Documented: Jan 10, 2026
```
- **Critical Alert**: Patient has known allergies
- Review before prescribing antibiotics or related medications

#### Vital Signs Display

**Format:**
```
VITAL SIGNS
Last recorded: January 11, 2026 at 9:35 AM
By: Nurse Ayaan Gutu

• Blood Pressure: 118/76 mmHg
• Heart Rate: 72 bpm
• Temperature: 36.8 °C
• Respiratory Rate: 16 /min
• SpO₂: 98 %
```

**Notes:**
- Always shows units (mmHg, bpm, °C, /min, %)
- Includes timestamp and recording staff member
- Vital signs shown as entered; no automated flagging in this demo

---

### 4. Documenting a Consultation (Clinical Notes Section)

**Navigation**: Click "Clinical Notes" tab in left sidebar

#### Structured Note Sections

The consultation note is divided into five sections:

##### A. Chief Complaint
**Purpose**: Patient's primary reason for visit in their own words

**Example:**
```
"Persistent headache for 3 days, not relieved by paracetamol"
```

**Tips:**
- Use patient's own language when possible
- Keep it brief (1-2 sentences)
- Include duration if relevant

##### B. History of Present Illness (HPI)
**Purpose**: Detailed narrative of the current problem

**Structure** (suggested):
- Onset: When did symptoms begin?
- Location: Where is the problem?
- Duration: How long has it lasted?
- Character: What does it feel like?
- Aggravating/Relieving factors: What makes it better or worse?
- Associated symptoms: What else is happening?

**Example:**
```
Patient reports gradual onset of frontal headache 3 days ago. 
Describes as dull, constant ache rated 6/10 in intensity. 
Associated with photophobia and mild nausea. No vomiting.
Worsens with bright lights and noise. Paracetamol 500mg 
provides minimal relief. No fever, neck stiffness, or visual changes.
```

##### C. Examination Findings
**Purpose**: Objective physical examination results

**Structure** (suggested):
- General appearance
- Vital signs reference
- System-specific findings (relevant to chief complaint)

**Example:**
```
General: Alert, appears uncomfortable with bright lights
Vital Signs: BP 118/76, HR 72, Temp 36.8°C (see vital signs panel)
HEENT: No sinus tenderness. PERRL, no papilledema.
Neck: Supple, no meningismus
Neurological: CN II-XII intact, no focal deficits
```

##### D. Assessment
**Purpose**: Clinical interpretation and working diagnosis

**Example:**
```
1. Tension-type headache, likely stress-related
2. Rule out migraine without aura
3. Continue monitoring for concerning features
```

**Tips:**
- Number multiple problems
- Include differential diagnoses when appropriate
- Note what you're ruling out

##### E. Plan
**Purpose**: Management and follow-up strategy

**Example:**
```
1. Trial of ibuprofen 400mg TID for 3-5 days
2. Recommend stress management techniques
3. Maintain headache diary
4. Return in 1 week or sooner if:
   - Worsening headache
   - New neurological symptoms
   - Fever or neck stiffness
5. Consider neurology referral if no improvement
```

**Tips:**
- Use numbered list for clarity
- Include medications, investigations, referrals
- Specify follow-up plan and "red flags" for early return

---

### 5. Saving Your Documentation

#### Understanding Save States

**Visual Indicator**: Fixed box at bottom-right of screen

**Four States:**

**1. Unsaved Changes (Yellow)**
```
○ Unsaved changes
```
- You've edited notes but haven't saved
- Data exists only in browser, not persisted
- **Action**: Click "Save Consultation" button

**2. Saving (Blue with Animation)**
```
⟳ Saving...
```
- Save operation in progress
- Brief animation while data is being stored
- Wait for confirmation

**3. Saved Successfully (Green)**
```
✓ All changes saved
Last saved: 2 minutes ago
```
- All edits are safely stored
- Shows relative time since last save
- Safe to navigate away or close browser

**4. Save Failed (Red)**
```
✕ Save failed - please try again
```
- Network error or validation issue occurred
- Your work is still in browser memory
- **Action**: Review notes and click "Save Consultation" again

#### How to Save

**Method 1: Manual Save (Recommended)**
1. Complete your documentation
2. Review all sections
3. Click green "Save Consultation" button (top-right of editor)
4. Wait for "All changes saved" confirmation

**Method 2: Auto-detection**
- System tracks when you make changes
- Save state indicator updates automatically
- You still must click "Save Consultation" to persist

---

### 6. Unsaved Changes Protection

#### Navigation Warning Dialog

If you try to leave the Clinical Notes section with unsaved changes, you'll see:

```
┌─────────────────────────────────────────┐
│ Unsaved Changes                         │
├─────────────────────────────────────────┤
│ You have unsaved changes to this        │
│ consultation note. If you leave now,    │
│ your changes will be lost.              │
│                                         │
│ [Discard Changes]  [Continue Editing]   │
└─────────────────────────────────────────┘
```

**Options:**
- **Continue Editing** (Blue button): Returns to editor, preserves your work
- **Discard Changes** (Gray button): Abandons unsaved edits and navigates away

**When This Appears:**
- Clicking different navigation tabs
- Clicking browser back button
- Attempting to close browser tab
- Clicking "Appointments", "Queue", or other quick actions

---

### 7. Using Quick Actions (Context Panel)

**Location**: Context Panel → Quick Actions section

**Available Actions:**

#### Add Diagnosis
- Opens diagnosis search and documentation interface
- Link conditions to current encounter
- Specify primary vs secondary diagnosis

#### Prescribe Medication
- Opens prescription interface
- Pre-filled with patient context
- Checks against documented allergies

#### Order Laboratory Tests
- Opens lab order workflow
- Select tests and specify clinical indication
- Track pending results

#### Request Imaging
- Opens radiology order interface
- Specify modality and urgency
- Provide clinical indication

#### Refer to Specialist
- Opens referral documentation
- Select specialty and urgency level
- Attach relevant clinical notes

**Current Status**: These buttons show "Coming soon" messages in this demo version.

---

### 8. Navigating Between Sections

#### Overview Tab

**Purpose**: Review patient demographics and encounter context

**Content:**
- Patient Identity Card
  - Full name, age, sex
  - MRN and contact information
  - Primary care provider
- Encounter Summary
  - Encounter ID and type
  - Visit date and time
  - Assigned doctor
  - Current encounter status

**Use Case**: Quick reference before starting documentation

#### Medical History Tab

**Coming Soon**: Will display
- Past medical conditions
- Previous surgeries
- Family history
- Social history

#### Diagnoses Tab

**Coming Soon**: Will display
- Active diagnoses
- Resolved conditions
- Diagnosis dates and ICD codes

#### Prescriptions Tab

**Coming Soon**: Will display
- Current medications
- Medication history
- Prescription refills

#### Laboratory Tab

**Coming Soon**: Will display
- Pending lab orders
- Recent results
- Historical lab trends

#### Documents Tab

**Coming Soon**: Will display
- Uploaded reports
- Referral letters
- Consent forms

---

## Common Workflows

### Workflow 1: Documenting a New Patient Encounter

1. **Access**: Navigate to `/staff/clinical`
2. **Verify Patient**: Check patient name and MRN in header
3. **Review Safety Info**: Check allergies and vital signs (context panel)
4. **Start Documentation**: Click "Clinical Notes" tab
5. **Complete Sections**:
   - Enter Chief Complaint
   - Document History of Present Illness
   - Record Examination Findings
   - Formulate Assessment
   - Document Plan
6. **Save**: Click "Save Consultation" button
7. **Confirm**: Wait for "All changes saved" message
8. **Additional Actions**: Use Quick Actions if needed (prescriptions, lab orders)

**Estimated Time**: 5-10 minutes depending on complexity

---

### Workflow 2: Reviewing Patient Before Consultation

1. **Access**: Navigate to `/staff/clinical`
2. **Review Overview**: Click "Overview" tab
   - Confirm patient identity
   - Review encounter details
3. **Check Safety**: Review Clinical Safety Summary
   - Verify allergy status
   - Review latest vital signs
4. **Review History**: Click "Medical History" tab (when available)
5. **Check Previous Notes**: Review past encounters
6. **Begin Consultation**: Click "Clinical Notes" tab to start documenting

**Estimated Time**: 2-3 minutes

---

### Workflow 3: Editing Existing Consultation Notes

1. **Access**: Navigate to `/staff/clinical`
2. **Navigate**: Click "Clinical Notes" tab
3. **Edit**: Click into any section and modify text
4. **Monitor Status**: Watch for "Unsaved changes" indicator
5. **Save**: Click "Save Consultation" button
6. **Verify**: Confirm "All changes saved" appears
7. **Close**: Safe to navigate away

**Important**: Previous saves are overwritten. Future versions will include version history.

---

## Visual Design Reference

### Color Coding System

**Save States:**
- 🟡 Yellow (Unsaved): `bg-yellow-50 text-yellow-700 border-yellow-200`
- 🔵 Blue (Saving): `bg-blue-50 text-blue-700 border-blue-200`
- 🟢 Green (Saved): `bg-green-50 text-green-700 border-green-200`
- 🔴 Red (Error): `bg-red-50 text-red-700 border-red-200`

**Allergy Alerts:**
- ⚠️ Not Verified: `bg-yellow-50 border-yellow-300`
- ✓ No Known Allergies: `bg-green-50 border-green-300`
- 🛑 Allergies Present: `bg-red-50 border-red-300`

**Interactive Elements:**
- Primary Button: Green background (`bg-green-600 hover:bg-green-700`)
- Secondary Button: Gray background (`bg-slate-100 hover:bg-slate-200`)
- Active Tab: Green left border (`border-l-4 border-l-green-600`)

### Responsive Behavior

**Desktop (≥1024px):**
- Three-column layout
- Context panel fixed on right (340px width)
- Navigation sidebar on left (240px width)
- Content area fills remaining space

**Tablet (768px - 1023px):**
- Navigation sidebar collapses to icons
- Context panel moves below content
- Full-width content area

**Mobile (<768px):**
- Single column layout
- Navigation becomes dropdown menu
- Context panel appears after content
- Save indicator remains fixed at bottom-right

---

## Keyboard Shortcuts

**Navigation:**
- `Tab` - Move between form fields in natural order
- `Shift + Tab` - Move backwards through fields
- `Escape` - Close dialogs

**Editing:**
- Standard text editing shortcuts work in all text areas
- `Ctrl/Cmd + S` - (Future) Quick save consultation

**Accessibility:**
- All interactive elements keyboard-accessible
- Screen reader announcements for save states
- ARIA labels on all form controls

---

## Clinical Safety Features

### 1. Allergy Verification Enforcement
- System distinguishes "not verified" from "no allergies"
- Prevents assumption of "no allergies" from missing data
- Visual alerts persist until verification completed

### 2. Unsaved Changes Protection
- Warns before navigation with unsaved work
- Prevents accidental data loss
- Clear visual indicators of save state

### 3. Patient Identity Confirmation
- Patient header always visible
- MRN and encounter ID prominently displayed
- Reduces wrong-patient documentation risk

### 4. Structured Documentation
- Sections guide complete documentation
- Reduces omitted information
- Improves clinical communication

---

## Troubleshooting

### Issue: Save button is grayed out
**Cause**: No changes detected since last save  
**Solution**: Make an edit to any note section, button will become active

### Issue: "Save failed" error appears
**Cause**: Network issue or validation error (demo: simulated randomly)  
**Solution**: 
1. Check your edits are still visible in the form
2. Review sections for very long text or special characters
3. Click "Save Consultation" again
4. If persistent, copy your notes to clipboard and refresh page

### Issue: Unsaved changes dialog appears but I saved
**Cause**: Save operation didn't complete before navigation  
**Solution**: 
1. Click "Continue Editing"
2. Wait for "All changes saved" confirmation
3. Then navigate away

### Issue: Context panel is missing
**Cause**: Screen width too narrow  
**Solution**: Context panel automatically repositions below content on tablets/mobile. Scroll down to see it.

### Issue: Can't see vital signs
**Cause**: Demo data limitations  
**Solution**: Current demo shows sample vital signs for patient ORH-2026-00124. Real implementation will load patient-specific data.

### Issue: Quick Action buttons don't work
**Cause**: Placeholder functionality in demo  
**Solution**: These features are marked "Coming soon" and will be implemented in future prompts (Diagnosis, Prescription, Laboratory modules).

---

## Demo Data Reference

**Patient:**
- Name: Hana Mohammed
- Age: 32 years
- Sex: Female
- MRN: ORH-2026-00124

**Encounter:**
- Encounter ID: ENC-2026-00087
- Type: Follow-up Consultation
- Date: January 11, 2026 at 9:30 AM
- Provider: Dr. [Current Session User]

**Allergy:**
- Agent: Penicillin
- Severity: Moderate
- Reaction: Rash, hives
- Documented: January 10, 2026

**Vital Signs:**
- Recorded: January 11, 2026 at 9:35 AM
- By: Nurse Ayaan Gutu
- BP: 118/76 mmHg
- HR: 72 bpm
- Temp: 36.8°C
- RR: 16/min
- SpO₂: 98%

**Sample Notes** (pre-filled in demo):
- Chief Complaint: "Follow-up visit for ongoing management"
- Other sections: Empty, ready for documentation

---

## Integration with Other Modules

### From Doctor Dashboard (Prompt 25)
- Click patient in "My Patients Today" list
- Opens Clinical Workspace with selected patient and encounter

### From Queue Management (Prompt 22)
- Click "Begin Consultation" on queued patient
- Opens Clinical Workspace pre-loaded with encounter

### From Triage Assessment (Prompt 24)
- Nurse completes triage
- Doctor receives patient in queue
- Opens Clinical Workspace to continue care

### To Future Modules
- **Diagnosis Module**: Quick Action "Add Diagnosis"
- **Prescription Module**: Quick Action "Prescribe Medication"
- **Laboratory Module**: Quick Action "Order Laboratory Tests"
- **Imaging Module**: Quick Action "Request Imaging"
- **Referral Module**: Quick Action "Refer to Specialist"

---

## Technical Notes

### File Structure
```
src/clinical/
├── model.ts                      # Data types and sample data
├── ClinicalWorkspacePage.tsx     # Main page component
├── components.tsx                # All UI components
└── clinical.css                  # Complete styling
```

### State Management
- Local component state (React useState)
- No external state management library
- Future: May integrate Redux/Context for real-time updates

### Data Persistence
- Demo: Simulated 1-second save delay with 10% random failure rate
- Production: Will integrate with backend API
- Save operations would POST to `/api/encounters/{id}/notes`

### Browser Compatibility
- Tested: Chrome, Firefox, Safari, Edge (latest versions)
- Requires: JavaScript enabled, minimum 1024px width recommended

---

## What's Next (Future Enhancements)

### Immediate Next Steps (After Prompt 26)
1. **Diagnosis Documentation** (Prompt 27) - ICD-10 code search and linking
2. **Prescription Module** (Prompt 28) - Medication prescribing with allergy checks
3. **Laboratory Orders** (Prompt 29) - Lab test ordering and results

### Planned Enhancements
- Auto-save functionality (periodic background saves)
- Voice-to-text dictation for clinical notes
- Template library for common visit types
- Previous note import/amendment
- Co-signature workflow for residents
- Audit trail and version history
- SOAP note format alternative
- Offline mode with sync

---

## Support and Questions

**For Demo/Testing:**
- All data is fictional and for demonstration only
- No real patient information is stored or transmitted
- Safe to experiment with all features

**For Implementation:**
- Review `docs/clinical-workspace.md` (this document)
- Examine `src/clinical/model.ts` for data structures
- Check `src/clinical/components.tsx` for UI implementation
- Consult ORHIMS design system documentation

---

## Summary Checklist

Before using Clinical Workspace in production:

- [ ] Verify patient identity before every documentation session
- [ ] Always check allergy status in Clinical Safety Summary
- [ ] Review vital signs for clinical context
- [ ] Complete all relevant note sections (Chief Complaint through Plan)
- [ ] Wait for "All changes saved" confirmation before navigating away
- [ ] Use Quick Actions to order tests/prescriptions as needed
- [ ] Document follow-up plan clearly in Plan section
- [ ] Review notes for accuracy and completeness before finalizing

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Module**: Clinical Workspace (Prompt 26)  
**Part of**: ORHIMS (Oda Roba Hospital Information Management System)
