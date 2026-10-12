# Specimen Collection & Verification User Guide (Prompt 32)

## Overview
The Specimen Collection module enables laboratory staff to systematically collect specimens, verify their quality, and manage the pre-analytical phase of laboratory testing.

## Access
- **URL**: `/staff/laboratory/specimen-collection`
- **Role**: Laboratory technologists, phlebotomists
- **Navigation**: From Laboratory Orders page via "Specimen Collection" link

## Key Features

### 1. Collection Queue Management
- **Real-time queue** of pending collection requests
- **Color-coded status** for quick triage
- **Priority visibility** (STAT/urgent/routine)
- **Patient identification** with name and ID
- **Test information** showing what specimens to collect

### 2. Queue Filters and Search

#### Search
- Search by patient name, patient ID, request ID, or specimen type
- Minimum 2 characters required
- Real-time filtering as you type

#### Status Filter
- **Awaiting Collection**: New requests ready for collection
- **Collection Started**: Collection in progress
- **Pending Verification**: Awaiting quality verification
- **Verified**: Complete and ready for analysis
- **Rejected**: Unsuitable specimens

#### Priority Filter
- **STAT**: Critical/emergency requests
- **Urgent**: Same-day priority
- **Routine**: Standard processing

#### Sorting
- Sort by: Requested Date, Patient Name, Priority, Status
- Toggle ascending/descending with ↑/↓ button

### 3. Specimen Collection Process

#### Step 1: Select Request
1. Review queue for next priority specimen
2. Click "Collect" button on request row
3. Collection form opens with patient details

#### Step 2: Verify Patient Identity
1. **Critical Safety Step**: Confirm patient identity using TWO identifiers
2. Check checkbox: "I have confirmed the patient's identity using two identifiers (name and ID)"
3. This confirmation is **required** before proceeding

#### Step 3: Complete Collection Details

**Specimen Identifier** (required):
- Scan or enter specimen barcode/label
- Must be unique
- Links specimen to patient throughout laboratory process

**Collection Location** (required):
- Outpatient Laboratory
- Inpatient Ward
- Emergency Department
- Operating Room
- ICU
- Other

**Collection Date/Time** (required):
- Defaults to current date/time
- Adjust if needed for documentation accuracy

**Collection Notes** (optional):
- Document any issues during collection
- Note patient cooperation, vein condition, etc.
- Relevant observations for laboratory staff

#### Step 4: Review and Confirm
1. Verify all information is correct
2. Note if separate verification is required (shown if applicable)
3. Click "Confirm Collection" to complete
4. Success notice displays
5. Request advances to verification queue

### 4. Specimen Verification Process

#### When Verification is Required
- **High-risk tests**: Critical values, blood bank
- **Regulatory requirements**: Tests requiring dual-check
- **Quality assurance**: Hospital policy for certain specimens
- **Configuration**: Set per test type in catalogue

#### Verification Rules
- **Separate verifier required**: Collector cannot verify own specimen
- **Independent check**: Verifier reviews without knowing collector
- **Quality criteria**: All acceptance criteria must be met

#### Verification Steps
1. Click "Verify" button on pending-verification request
2. Review panel opens showing:
   - Complete patient information
   - Request and test details
   - Collection details (identifier, location, date/time, collector)
   - Collection notes if any
3. Verify against checklist:
   - ☑ Specimen label matches patient identifier
   - ☑ Specimen type is correct for ordered tests
   - ☑ Specimen volume is sufficient
   - ☑ Container is intact without leakage
   - ☑ No visible contamination or hemolysis
4. Click "Verify Specimen" to approve
5. Success notice displays
6. Specimen ready for laboratory analysis

### 5. Specimen Rejection

#### When to Reject
- **Incorrect specimen type**: Wrong tube/container for test
- **Container problem**: Wrong tube type, expired additive
- **Insufficient quantity**: Not enough volume for ordered tests
- **Damaged container**: Broken, leaking, compromised
- **Labeling issue**: Missing label, illegible, mismatched
- **Contaminated**: Visible contamination, hemolyzed blood
- **Other**: Any quality issue compromising results

#### Rejection Process
1. Click "Reject Specimen" button (available during collection or verification)
2. Rejection dialog opens with warning
3. Select rejection reason from dropdown
4. Enter detailed notes explaining specific issue
5. Click "Confirm Rejection"
6. Clinician notified to create new request

#### Important Notes
- **Documented reason required**: Cannot reject without explanation
- **New request needed**: Rejected specimens require recollection
- **Communication**: System notifies ordering clinician
- **Quality tracking**: Rejections tracked for process improvement

### 6. Status Workflow

```
awaiting-collection → collection-started → collected-pending-verification → 
verified (or rejected at any stage)
```

**Status Definitions**:
- **awaiting-collection**: New request, specimen not yet collected
- **collection-started**: Collection in progress (auto-set when form opened)
- **collected-pending-verification**: Collection complete, awaiting verification
- **verified**: Quality verified, ready for analysis
- **rejected**: Specimen rejected, recollection needed
- **cancelled**: Request cancelled (rare, from clinician side)

### 7. Role-Based Permissions

**Collector Permissions**:
- Start collection
- Record collection details
- Reject specimens during collection
- Cannot verify own specimens (if separate verification required)

**Verifier Permissions**:
- Review pending specimens
- Verify specimen quality
- Reject unsuitable specimens
- Cannot verify specimens they collected

**Full Permissions** (Lab Supervisor):
- All collector and verifier permissions
- Can verify any specimen
- Override capabilities

## Workflow Examples

### Example 1: Routine Blood Collection
1. Queue shows ORH-2026-00124 awaiting CBC collection
2. Click "Collect" button
3. Verify patient Hana Mohammed matches ID
4. Check patient confirmation checkbox
5. Scan specimen barcode: SPEC-2026-00234
6. Select location: Outpatient Laboratory
7. Current date/time auto-filled
8. Click "Confirm Collection"
9. Success: Specimen collected, request advances to verification

### Example 2: STAT Specimen Verification
1. Queue filtered to show "Pending Verification" + "STAT" priority
2. Top request: Emergency malaria test
3. Click "Verify" button
4. Review collection details:
   - Identifier: SPEC-2026-00235
   - Collected 5 minutes ago in Emergency Department
5. Visual inspection: Blood smear properly prepared
6. Check all 5 verification criteria
7. Click "Verify Specimen"
8. Success: Specimen ready for immediate analysis

### Example 3: Specimen Rejection
1. Verifying routine chemistry panel
2. Notice hemolyzed blood in tube (lipemic/reddish serum)
3. Click "Reject Specimen" button
4. Select reason: "Contaminated"
5. Enter notes: "Visible hemolysis, will affect LFT results. Please recollect with proper technique."
6. Click "Confirm Rejection"
7. System notifies clinician
8. Rejection tracked for quality review

### Example 4: Multi-Test Bundle
1. Request shows 4 tests: CBC, LFT, RFT, Electrolytes
2. Requires 3 specimen types: Blood (EDTA), Blood (Plain), Blood (Heparin)
3. Collect all three tubes
4. Use single collection session
5. Enter one identifier per tube in notes
6. Complete collection for entire bundle
7. All specimens advance to verification together

## Tips for Effective Use

### Best Practices
1. **Priority first**: Always check STAT queue before routine
2. **Patient safety**: Never skip identity confirmation
3. **Clear documentation**: Complete notes help next shift
4. **Quality awareness**: Better to reject than compromise results
5. **Efficient workflow**: Process similar specimens together

### Common Patterns
- **Morning rounds**: Batch collect inpatient specimens
- **Emergency department**: STAT specimens take precedence
- **Outpatient clinic**: Scheduled collections by appointment
- **Operating room**: Pre-op specimens require STAT priority

### Quality Assurance
- **Proper tubes**: Match tube type to test requirements
- **Labeling accuracy**: Label tubes at bedside after collection
- **Timing**: Note time-sensitive specimens (e.g., glucose)
- **Handling**: Proper storage and transport of specimens
- **Documentation**: Complete notes for any irregularities

## Safety and Compliance

### Patient Identification
- **Two identifiers required**: Name AND patient ID
- **Ask patient to state name**: Don't suggest the name
- **Check wristband**: Inpatients must have wristband match
- **Never assume**: Verify even for familiar patients

### Infection Control
- **Hand hygiene**: Before and after each patient
- **PPE**: Gloves required for all specimen handling
- **Sharps safety**: Proper disposal of needles/lancets
- **Spill management**: Follow protocol for specimen spills

### Specimen Integrity
- **Proper containers**: Use correct tube for each test
- **Mixing**: Invert tubes properly for anticoagulated specimens
- **Labeling**: Label immediately after collection
- **Transport**: Maintain proper temperature and handling

## Integration Points

### Navigation
- **From Laboratory Orders**: Staff can link directly to collection queue
- **To Main Laboratory**: After verification, specimens enter analytical phase
- **Back to Orders**: Return button navigates to orders page

### Notifications
- **Clinician alerts**: Automatic notification on specimen rejection
- **Lab alerts**: STAT specimens alert analytical staff
- **Status updates**: Real-time queue updates across sessions

### Quality Tracking
- Rejection rates monitored for improvement
- Collection times tracked for efficiency
- Verification turnaround measured

## Demo Data
**Demo User**: Nurse Sarah Bekele (LAB-STAFF-001)
**Demo Requests**:
1. LABREQ-2026-00145 (CBC + ESR, awaiting collection)
2. LABREQ-2026-00146 (Malaria, collected pending verification)
3. LABREQ-2026-00147 (Blood Culture, verified)

## Troubleshooting

### Cannot Verify Specimen
- **Issue**: "Verify" button disabled or error message
- **Cause**: You collected this specimen and separate verification required
- **Solution**: Ask colleague to verify; you cannot verify your own collection

### Specimen Label Won't Scan
- **Issue**: Barcode scanner not reading label
- **Cause**: Damaged barcode or scanner issue
- **Solution**: Manually enter specimen identifier; report scanner issue to IT

### Wrong Patient Queue
- **Issue**: Not seeing expected specimens in queue
- **Cause**: Filtered view or already processed
- **Solution**: Clear all filters, check "Verified" status if processed

## Support
For issues or questions:
- Lab Supervisor: [contact info]
- IT Help Desk: [contact info]
- Quality Manager: [contact info]
- Training Materials: [link to videos/guides]
