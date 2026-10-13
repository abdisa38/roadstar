# Laboratory Dashboard User Guide (Prompt 31)

## Overview
The Laboratory Dashboard is your central command center for managing all laboratory operations. It provides instant visibility into workload, highlights items needing attention, and serves as the starting point for all laboratory workflows.

## Access
- **URL**: `/staff/laboratory`
- **Role**: Laboratory technicians, technologists, supervisors
- **Entry Point**: Main laboratory module landing page

## Dashboard Layout

### Header Section
**Breadcrumb Navigation**: Staff Portal / Laboratory / Dashboard

**Page Title**: Laboratory Dashboard

**Subtitle**: Manage test orders, specimens, processing, and results

**Current Date**: Today's date displayed prominently

**Primary Action**: "View Pending Orders" button

## Workload Summary Cards

At the top of the dashboard, six cards provide instant workload visibility:

### 1. New Orders
**What it shows**: Newly received laboratory orders not yet processed

**Icon**: Document with plus sign

**What to do**:
- Click card to filter dashboard to new orders
- Review and acknowledge new requests
- Begin specimen collection process

**Example**: "12 new orders" means 12 orders just came in from clinicians

### 2. Awaiting Specimen
**What it shows**: Orders where specimen hasn't been collected yet

**Icon**: Test tubes

**What to do**:
- Click card to see all orders needing specimen collection
- Prioritize by patient location and urgency
- Navigate to Specimen Collection module

**Example**: "8 awaiting specimen" means 8 patients need blood drawn or samples collected

### 3. In Progress
**What it shows**: Tests currently being analyzed

**Icon**: Clock

**What to do**:
- Monitor ongoing analytical work
- Check if any tests need attention
- Estimate completion times

**Example**: "15 in progress" means 15 tests are running on analyzers or being manually processed

### 4. Pending Results
**What it shows**: Tests complete but results not yet entered into system

**Icon**: Clipboard with list

**What to do**:
- Enter results from analyzer printouts
- Transcribe manual test results
- Quality check data entry

**Example**: "6 pending results" means 6 tests finished but need data input

### 5. Awaiting Review
**What it shows**: Results entered but requiring authorized review before release

**Icon**: Badge with checkmark

**What to do**:
- Review results for accuracy
- Check for critical values
- Authorize release to clinicians

**Example**: "4 awaiting review" means 4 results need supervisor sign-off

### 6. Completed Today
**What it shows**: Tests finished and released today

**Icon**: Checkmark circle

**What to do**:
- Monitor daily productivity
- Track turnaround times
- Reference completed work

**Example**: "23 completed today" shows 23 tests done from midnight to now

## Laboratory Attention Required

**Purpose**: Highlights items needing immediate action

**Priority Levels**:
- 🔴 **Critical**: Urgent clinical situations (e.g., critical lab values)
- 🟠 **High**: Important operational issues (e.g., specimen problems)
- 🟡 **Medium**: Moderate concerns (e.g., delayed tests)
- 🔵 **Low**: Routine reminders

### Attention Item Structure
Each item shows:
- **Priority badge**: Color-coded urgency level
- **Attention type**: What kind of issue it is
- **Time**: When the issue occurred
- **Patient info**: Name and ID
- **Test info**: Test name and order ID
- **Message**: Clear description of the issue
- **Action button**: What to do next

### Common Attention Types

#### Specimen Not Received
**Issue**: Ordered specimen hasn't arrived at lab

**Message**: "Specimen not received for 2 hours after order"

**Action**: "Contact specimen collection"

**What to do**:
1. Check if specimen was actually collected
2. Call floor/clinic to check status
3. Locate specimen if in transit
4. Update clinician if delay expected

#### Specimen Rejected
**Issue**: Received specimen unsuitable for testing

**Message**: "Specimen hemolyzed, recollection required"

**Action**: "Request recollection"

**What to do**:
1. Document rejection reason
2. Contact ordering clinician
3. Arrange recollection
4. Dispose of unsuitable specimen properly

#### Awaiting Review
**Issue**: Critical or abnormal result needs review

**Message**: "Critical low hemoglobin result awaiting review"

**Action**: "Review result"

**What to do**:
1. Review result immediately
2. Check against patient history if available
3. Verify no analytical errors
4. Authorize release or flag for clinician call

#### Delayed Test
**Issue**: Test taking longer than target turnaround time

**Message**: "Test delayed beyond 4-hour target"

**Action**: "Prioritize processing"

**What to do**:
1. Check reason for delay
2. Expedite processing if possible
3. Inform clinician of expected time
4. Document cause for quality review

## Laboratory Orders Table

The main table shows all active laboratory orders with comprehensive details:

### Table Columns

**Order ID / Time**:
- Unique order identifier (e.g., LABREQ-2026-00150)
- Date and time order was placed
- **Sortable**: Click to sort by newest/oldest

**Patient**:
- Patient full name
- Patient identifier (ORH-2026-XXXXX)
- Encounter ID
- Helps verify correct patient

**Test / Category**:
- Test name (e.g., "Complete Blood Count")
- Category (e.g., "Hematology")
- Helps identify test type

**Ordering Department**:
- Department requesting test (e.g., "Emergency Department")
- Ordering clinician name
- Context for urgency and questions

**Specimen Status**:
- Current specimen state:
  - 🔵 **Awaiting Collection**: Not yet collected
  - 🟢 **Collected**: Received at lab
  - 🟠 **Pending Verification**: Needs quality check
  - ✅ **Verified**: Approved for processing
  - 🔴 **Rejected**: Unsuitable, needs recollection
- Specimen identifier (barcode) when available

**Processing Status**:
- Current test state:
  - 🔵 **Ordered**: Just received
  - 🟠 **Awaiting Specimen**: Waiting for sample
  - 🟣 **Specimen Received**: Ready to process
  - 🟣 **In Progress**: Being analyzed
  - 🟢 **Result Available**: Complete

**Priority**:
- 🔴 **STAT**: Emergency, process immediately
- 🟠 **Urgent**: Same-day required
- ⚪ **Routine**: Standard turnaround

**Actions**:
- **Collect Specimen**: Go to specimen collection
- **Verify Specimen**: Check specimen quality
- **Continue Processing**: Monitor progress
- **Review Result**: Authorize result
- **Enter Result**: Input data
- **View Order**: See full details

### Using the Table

#### Sorting
- Click any sortable column header
- First click: Ascending order
- Second click: Descending order
- Arrow icon shows current sort

**Sort Options**:
- **Order Time**: Newest or oldest first
- **Patient Name**: Alphabetical
- **Priority**: STAT first, then urgent, then routine
- **Status**: Group by current state

#### Taking Action
1. Find the order you need
2. Click the action button in the Actions column
3. System navigates to appropriate workflow
4. Complete the action
5. Return to dashboard to see updated status

## Search and Filtering

### Search Box
**Location**: Top-left of filters toolbar

**What you can search**:
- Patient name (e.g., "Hana Mohammed")
- Patient ID (e.g., "ORH-2026-00124")
- Order ID (e.g., "LABREQ-2026-00150")
- Test name (e.g., "CBC" or "malaria")

**How to use**:
1. Type at least 2 characters
2. Results filter automatically as you type
3. Clear search to see all orders again

### Filter Options

#### Test Type Filter
**Categories**:
- Hematology (CBC, ESR, Blood Smear, etc.)
- Biochemistry (Glucose, LFT, RFT, Electrolytes, etc.)
- Microbiology (Blood Culture, Urine Culture, etc.)
- Serology (Malaria, HIV, Hepatitis, etc.)
- Parasitology (Stool O&P)
- Urinalysis

**Use when**: You want to focus on specific test category

#### Order Status Filter
**Options**:
- Ordered: Just received
- Awaiting Specimen: Needs collection
- Specimen Received: Ready to process
- Processing: Being analyzed
- Result Available: Complete

**Use when**: You want to see all orders at a specific workflow stage

#### Priority Filter
**Options**:
- STAT: Emergency requests
- Urgent: Same-day priority
- Routine: Standard turnaround

**Use when**: You want to prioritize STAT or urgent work

#### Date Range Filter
**Options**:
- Today: Orders from midnight to now
- Last 7 Days: Past week
- Last 30 Days: Past month
- All Time: Everything in system

**Use when**: You want to limit to recent orders or see historical data

### Active Filters Display
- **Result count**: Shows how many orders match filters
- **Clear Filters button**: Appears when filters active
- Click "Clear Filters" to reset all filters and search

## Common Workflows

### Morning Start-Up Routine
1. **Check workload cards**
   - Review overnight accumulation
   - Identify bottlenecks
   - Plan day's work

2. **Review attention items**
   - Address critical issues first
   - Delegate high-priority tasks
   - Document medium/low items

3. **Filter by awaiting specimen**
   - Click "Awaiting Specimen" card
   - Prioritize STAT and urgent
   - Coordinate with collection staff

4. **Check in-progress tests**
   - Monitor analyzer status
   - Estimate completion times
   - Prepare for result entry

### STAT Request Handling
1. **Attention item appears** (if critical)
   - Click "Review result" or action button
   - Navigate to appropriate workflow

2. **Or filter for STAT priority**
   - Use Priority filter → STAT
   - See all emergency requests
   - Process in order received or clinical urgency

3. **Take action**
   - Click action button on each order
   - Complete specimen collection or processing
   - Enter and review results quickly

4. **Verify completion**
   - Return to dashboard
   - Confirm order moved to "Completed Today"
   - Check attention section cleared

### End-of-Shift Handoff
1. **Review pending work**
   - Note orders still in progress
   - Identify any problems for next shift
   - Document issues in attention items

2. **Check awaiting review**
   - Complete any pending authorizations
   - Hand off critical reviews to supervisor
   - Note expected completion times

3. **Update next shift**
   - Show dashboard to incoming staff
   - Highlight attention items
   - Explain any unusual situations

4. **Document shift summary**
   - Note "Completed Today" count
   - Record any quality issues
   - File incident reports if needed

### Troubleshooting Delays
1. **Identify delayed tests**
   - Check attention section for "Delayed Test" items
   - Or review "In Progress" filtered view
   - Note how long test has been pending

2. **Investigate cause**
   - Check analyzer status
   - Verify specimen quality
   - Review workload capacity

3. **Take corrective action**
   - Expedite if possible
   - Inform clinician of delay
   - Document for quality improvement

4. **Update workflow**
   - Click action button to continue
   - Monitor progress
   - Confirm completion

## Integration with Other Modules

### Navigation to Laboratory Orders
**From Dashboard**:
- Click "View Pending Orders" button (top-right)
- Or click any order's action button

**In Laboratory Orders**:
- Create new orders for patients
- View detailed order information
- Track status changes
- Navigate to results

**Return to Dashboard**:
- Use breadcrumb navigation
- Or click back in browser

### Navigation to Specimen Collection
**From Dashboard**:
- Click attention item with specimen issue
- Or click order action "Collect Specimen" or "Verify Specimen"

**In Specimen Collection**:
- View collection queue
- Collect specimens
- Verify quality
- Reject unsuitable specimens

**Return to Dashboard**:
- Use breadcrumb navigation
- Or use back button in specimen collection

## Empty and Loading States

### No Orders Match Filters
**What it means**: Your current filters are too restrictive

**What you see**:
- Empty state icon
- Message: "No orders match your filters"
- "Clear Filters" button

**What to do**:
- Click "Clear Filters" to reset
- Or adjust individual filters
- Check date range isn't too narrow

### No Laboratory Orders
**What it means**: No orders in system yet (rare)

**What you see**:
- Empty state icon
- Message: "No laboratory orders"
- Description of what appears here

**What to do**:
- Normal at system startup
- Wait for clinicians to place orders
- Check system connectivity if unexpected

### Loading Dashboard
**What you see**:
- Spinning loader icon
- Message: "Loading laboratory dashboard..."

**What to do**:
- Wait for data to load
- Should complete in seconds
- Report to IT if loading hangs

## Tips for Effective Use

### Best Practices
1. **Start with attention section**: Address critical items first
2. **Use workload cards**: Quick visual of day's work
3. **Filter strategically**: Focus on specific task types
4. **Sort by priority**: STAT and urgent work first
5. **Monitor in-progress**: Prevent bottlenecks

### Keyboard Shortcuts
- **Tab**: Navigate through filters and buttons
- **Enter**: Activate selected button
- **Escape**: Clear focus (when appropriate)
- **Arrow keys**: Navigate table rows (if supported)

### Common Pitfalls to Avoid
1. **Don't ignore attention items**: They're there for a reason
2. **Don't forget to clear filters**: May hide new work
3. **Don't rely on color alone**: Read status text
4. **Don't skip specimen verification**: Quality matters
5. **Don't delay critical result review**: Patient safety first

## Performance Metrics

### Dashboard as Performance Tool
- **Completed Today**: Track daily throughput
- **Awaiting Review count**: Identify review bottleneck
- **In Progress count**: Monitor analyzer capacity
- **Attention items**: Quality and process issues

### Quality Indicators
- **Specimen rejection rate**: Track unsuitable specimens
- **Delayed test frequency**: Monitor turnaround times
- **Critical result review time**: Patient safety metric
- **Specimen not received**: Collection process efficiency

## Support and Troubleshooting

### Common Issues

**Dashboard not loading**:
- Check internet connection
- Refresh browser (F5)
- Clear browser cache
- Contact IT if persists

**Orders not appearing**:
- Check filters (especially date range)
- Verify you're in correct laboratory
- Confirm system connectivity
- Ask supervisor to check permissions

**Action buttons not working**:
- Ensure you're logged in
- Check role permissions
- Try refreshing page
- Report bug to IT

**Wrong workload counts**:
- Counts are real-time (may change quickly)
- Verify against filtered table
- Report discrepancies to IT

### Getting Help
- **Lab Supervisor**: Workflow and priority questions
- **IT Help Desk**: Technical issues
- **Quality Manager**: Process improvement suggestions
- **Training**: Request refresher if needed

## Demo Data Disclaimer
All patient names, identifiers, and statistics shown in the demo dashboard are entirely **fictional**. They are demonstration data only and do not represent actual Oda Roba Hospital patients or laboratory operations. Real patient data will only appear when the system is connected to the hospital's information system.

---

**Quick Reference**:
- **Main Route**: `/staff/laboratory`
- **Workload Cards**: 6 cards showing daily work distribution
- **Attention Section**: Priority items needing action
- **Orders Table**: Comprehensive view of all orders
- **Filters**: Search, test type, status, priority, date range
- **Navigation**: Links to orders and specimen collection modules
