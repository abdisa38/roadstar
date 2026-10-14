# Pharmacy Dashboard Guide
## ORHIMS Phase 07 - Pharmacy Management (Prompt 36)

**Module:** Pharmacy Dashboard  
**Route:** `/staff/pharmacy`  
**User Roles:** Pharmacist, Pharmacy Technician, Pharmacy Manager  
**Status:** ✅ Complete and Integrated

---

## Overview

The Pharmacy Dashboard provides authorized pharmacy personnel with a comprehensive operational view of prescription workload, medicine inventory status, stock movements, and critical alerts. The dashboard prioritizes actionable information to help staff identify what requires immediate attention.

## User Access

**Authorized Roles:**
- **Pharmacist** - Full dashboard access, all metrics and alerts
- **Pharmacy Technician** - View prescriptions, inventory, limited administrative actions
- **Pharmacy Manager** - Full access including administrative controls and reports
- **Pharmacy Assistant** - Limited view access to prescriptions and basic inventory

**Required Permissions:**
- `view-prescriptions` - Access prescription queue
- `view-inventory` - View medicine inventory
- `dispense` - Dispense medications
- `manage-inventory` - Manage stock and movements

## Dashboard Sections

### 1. Page Header

**Components:**
- **Breadcrumb:** Dashboard / Pharmacy
- **Current Date:** Displays today's date with calendar icon
- **Refresh Button:** Manually refresh dashboard data
- **Pharmacy Location:** Current pharmacy location (e.g., "Main Pharmacy")
- **User Context:** Logged-in pharmacist name and role
- **Last Updated:** Timestamp of last data refresh

**Actions:**
- Click refresh icon to reload all dashboard data
- Timestamp updates automatically on refresh

### 2. Summary Metrics (6 Cards)

#### Metric 1: Pending Prescriptions
- **Count:** Prescriptions awaiting pharmacy action
- **Sublabel:** "Awaiting dispensing"
- **Icon:** Document/file icon (blue)
- **Action:** Click to filter prescription queue to pending only
- **Significance:** Immediate workload requiring attention

#### Metric 2: In Progress
- **Count:** Prescriptions currently being processed
- **Sublabel:** "Currently processing"
- **Icon:** Clock icon (orange)
- **Action:** Click to filter prescription queue to in-progress
- **Significance:** Active work being performed by staff

#### Metric 3: Dispensed Today
- **Count:** Prescriptions successfully dispensed today
- **Sublabel:** "Completed transactions"
- **Icon:** Check circle (green)
- **Action:** Click to view today's dispensed prescriptions
- **Significance:** Daily productivity metric

#### Metric 4: Low Stock
- **Count:** Medicine items below reorder threshold
- **Sublabel:** "Below reorder threshold"
- **Icon:** Trending down (orange)
- **Action:** Click to view low stock items in inventory
- **Significance:** Items requiring procurement action

#### Metric 5: Out of Stock
- **Count:** Medicine items with no usable inventory
- **Sublabel:** "No usable inventory"
- **Icon:** X circle (red)
- **Action:** Click to view out-of-stock items
- **Significance:** Critical shortages affecting dispensing

#### Metric 6: Expiry Alerts
- **Count:** Batches expiring soon or expired
- **Sublabel:** "Expiring or expired"
- **Icon:** Alert triangle (yellow/orange)
- **Action:** Click to open expiry monitoring view
- **Significance:** Stock requiring timely action or removal

**Important Distinctions:**
- Zero vs. unavailable data: Dashboard distinguishes genuine zero from failed data load
- Cancelled prescriptions do not count as "dispensed"
- Out of stock excludes expired or quarantined inventory
- Low stock uses configured reorder thresholds, not fixed percentages

### 3. Quick Search

**Features:**
- **Search input:** Text search across multiple data types
- **Placeholder:** "Search prescription, patient ID, medicine, or batch number..."
- **Search scope:** Prescriptions, patients, medicines, batch numbers

**Quick Action Buttons:**
- **Prescription Queue:** Opens full prescription queue page
- **Medicine Inventory:** Opens complete inventory management

**Search Behavior:**
- Enter search term and press Enter
- Routes to appropriate module with search applied
- Does not expose sensitive data in search preview
- Requires appropriate permissions for each data type

### 4. Prescription Queue (Main Section)

**Table Columns:**
1. **Prescription Number** - Format: RX-YYYY-NNNNN (clickable, blue)
2. **Patient Name** - Full patient name
3. **Patient ID** - Medical Record Number (MRN)
4. **Department** - Prescribing department (e.g., Internal Medicine, Emergency)
5. **Prescribing Clinician** - Doctor's name
6. **Time** - Prescription timestamp (time only, hover for full date)
7. **Priority** - Badge: Routine (gray), Urgent (orange), STAT (red)
8. **Status** - Badge with color coding (see status types below)
9. **Action** - Eye icon button to open prescription details

**Prescription Statuses:**
- **Pending** (Blue) - Awaiting pharmacy action
- **In Progress** (Orange) - Currently being dispensed
- **Partially Dispensed** (Teal) - Some items dispensed, shows count (e.g., "2/5 items")
- **Dispensed** (Green) - All items dispensed successfully
- **On Hold** (Yellow) - Requires additional action before dispensing
- **Cancelled** (Red) - Prescription cancelled by prescriber

**Priority Levels:**
- **Routine** - Standard processing
- **Urgent** - Expedited processing required
- **STAT** - Immediate processing (highest priority)

**Actions:**
- Click prescription number or eye icon to open full prescription details
- Table shows 5 most recent prescriptions requiring attention
- "View All" button navigates to complete prescription queue

**Empty State:**
"No prescriptions currently require pharmacy attention."

### 5. Inventory Requiring Attention (Main Section)

**Table Columns:**
1. **Medicine** - Medicine name with expired stock indicator if applicable
2. **Code** - Medicine identifier/code (monospace font)
3. **Strength & Form** - Dosage strength and pharmaceutical form
4. **Available** - Usable quantity with unit (e.g., "150 tablets")
5. **Reorder Level** - Configured reorder threshold
6. **Status** - Stock status badge (see below)
7. **Action** - Eye icon to view inventory details

**Stock Statuses:**
- **In Stock** (Green) - Above reorder threshold
- **Low Stock** (Orange) - At or below reorder threshold
- **Out of Stock** (Red) - Zero usable inventory
- **Restricted** (Gray) - Access restricted or quarantined
- **Expired Stock Present** (Red) - Has expired batches requiring action

**Medicine Examples (Demo Data):**
- Paracetamol 500mg Tablet
- Amoxicillin 250mg Capsule
- Oral Rehydration Salts Sachet
- Normal Saline 0.9% IV Solution 500ml
- Metformin 500mg Tablet

**Key Features:**
- **Quantity Zero Highlight:** Out-of-stock items displayed in red
- **Expired Indicator:** Warning icon if medicine has expired batches
- **Unit of Measure:** Always explicit (tablets, capsules, bottles, sachets, vials)
- **Reorder Threshold:** Facility-configured levels, not percentages

**Actions:**
- Click eye icon to view full inventory details
- "View Inventory" button opens complete inventory management
- Rows highlighted based on urgency (red for out-of-stock)

**Empty State:**
"No stock alerts match the current view."

### 6. Pharmacy Alerts (Side Panel)

**Alert Types:**
1. **Reorder Threshold** (Warning/Orange)
   - Medicine reached configured reorder level
   - Shows current quantity vs. threshold
   - Action: "Create purchase request"

2. **Expiry Approaching** (Warning/Orange)
   - Batch expiring within alert period
   - Shows days until expiry and quantity
   - Action: "Prioritize dispensing or return to supplier"

3. **Expired Stock** (Critical/Red)
   - Batch has expired
   - Must be removed from dispensing inventory
   - Action: "Review and quarantine expired batch"

4. **Unavailable Medicine** (Critical/Red)
   - Medicine out of stock with active prescriptions
   - May affect patient care
   - Action: "Initiate emergency procurement"

5. **Stock Discrepancy** (Warning/Orange)
   - Inventory discrepancy requiring review
   - Action: "Review and reconcile inventory"

6. **Pending Prescription** (Info/Blue)
   - Prescription pending longer than threshold
   - Shows time pending
   - Action: "Process urgent prescription"

**Alert Display:**
- **Title:** Brief alert description
- **Description:** Detailed explanation with relevant references
- **Timestamp:** When alert was generated
- **Severity Indicator:** Color-coded left border (Blue/Orange/Red)
- **Action Required:** Clear next step

**Empty State:**
"No alerts at this time." (with green check icon)

**Alert Prioritization:**
- Critical (Red) - Immediate action required
- Warning (Orange) - Action needed soon
- Info (Blue) - Awareness or routine action

### 7. Expiry Monitoring (Side Panel)

**Card Display:**
- **Medicine Name** - Header (bold)
- **Status Badge** - Expiring Soon (orange), Expired (red), Available (green)
- **Batch Number** - Format: XXX2024-MM-NNN (monospace)
- **Quantity** - Batch quantity with unit
- **Expiry Date** - Format: "Expires: Mon DD, YYYY"
- **Days Remaining/Expired** - Dynamic calculation

**Status Types:**
- **Expiring Soon** (Orange) - Within configured alert period
- **Expired** (Red) - Past expiry date
- **Quarantined** (Gray) - Not available for dispensing
- **Available** (Green) - Active, usable stock

**Display Rules:**
- Shows 5 most urgent batches
- Expired batches highlighted in red background
- Days remaining: "16 days remaining"
- Days expired: "Expired 55 days ago"
- "View All" button opens complete expiry monitoring page

**Click Behavior:**
- Click card to view batch details
- Navigate to expiry monitoring module with batch selected

**Empty State:**
"No expiry alerts at this time."

### 8. Recent Stock Movements (Side Panel)

**Movement Types:**
1. **Stock Received** (Green icon, down-left arrow)
   - New inventory received from supplier
   - Shows quantity added
   - References purchase order or GRN

2. **Dispensed** (Blue icon, up-right arrow)
   - Medicine dispensed to patient
   - Negative quantity (deduction)
   - References prescription number

3. **Stock Adjustment** (Orange icon, activity)
   - Manual inventory adjustment
   - Can be positive or negative
   - Includes reason/notes

4. **Returned to Inventory** (Gray icon, rotate)
   - Unused medicine returned
   - Added back to available stock
   - References original prescription

5. **Transferred** (Yellow icon, arrows)
   - Transfer between pharmacy locations
   - Shows source and destination
   - Requires authorization

**Card Display:**
- **Medicine Name** - Header
- **Movement Type** - Label (e.g., "Stock Received")
- **Quantity** - With +/- prefix (e.g., "+1000 tablets", "-60 tablets")
- **Time** - Movement timestamp
- **Performed By** - Staff member name
- **Reference Document** - PO/GRN/RX number when applicable

**Features:**
- Shows 5 most recent movements
- Color-coded icons by movement type
- Quantity includes unit of measure
- "View All" button opens complete stock movement history

**Empty State:**
"No stock movements recorded."

## Workflow Examples

### Scenario 1: Morning Dashboard Review

1. Pharmacist signs in at 8:00 AM
2. Dashboard loads showing:
   - 12 pending prescriptions
   - 5 in progress from night shift
   - 47 dispensed yesterday (resets daily)
   - 8 low stock items
   - 3 out of stock items
   - 6 expiry alerts
3. Reviews critical alerts first (expired stock, out of stock)
4. Checks expiry monitoring for urgent batches
5. Opens prescription queue to process pending prescriptions

### Scenario 2: Handling Out-of-Stock Alert

1. Metric shows "3" out-of-stock items
2. Click metric card to view inventory
3. See Amoxicillin 250mg capsules: 0 available
4. Alert shows: "Medicine out of stock. Active prescriptions may be affected."
5. Click alert: "Initiate emergency procurement"
6. Navigate to procurement workflow
7. Create urgent purchase request
8. Document substitute medicine if available

### Scenario 3: Processing Expiring Medicine

1. Expiry monitoring shows Diazepam batch expiring in 16 days
2. Click expiry card to view batch details
3. See 150 tablets remaining
4. Options:
   - Prioritize dispensing for active prescriptions
   - Return to supplier if eligible
   - Mark for disposal if no return option
5. Update batch status
6. Alert clears from dashboard

### Scenario 4: Daily Dispensing Workflow

1. Click "Pending Prescriptions" metric (12 pending)
2. Prescription queue opens filtered to pending
3. Sort by priority (STAT → Urgent → Routine)
4. Open RX-2026-00126 (STAT priority, Sara Musa, Emergency)
5. Review prescription details
6. Check medicine availability
7. Dispense medication
8. Status updates to "Dispensed"
9. Return to dashboard
10. Pending count now shows "11"

## Access Control

### Permission Matrix

| Role | View Dashboard | Dispense | Manage Inventory | View Reports | Admin Functions |
|------|---------------|----------|------------------|--------------|-----------------|
| Pharmacist | ✓ | ✓ | ✓ | ✓ | Limited |
| Pharmacy Tech | ✓ | ✓ | ✓ | Limited | ✗ |
| Pharmacy Manager | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pharmacy Assistant | ✓ | Limited | View Only | ✗ | ✗ |

### Data Access Rules

- Prescription data respects patient privacy settings
- Stock movements are auditable and traceable
- Inventory changes require authorization
- Expired stock cannot be dispensed through normal workflow
- Restricted medicines require additional verification

## Technical Implementation

**Module Files:**
- `src/pharmacy/pharmacy-model.ts` - Data models, interfaces, demo data (750+ lines)
- `src/pharmacy/PharmacyDashboardPage.tsx` - Main page component (120 lines)
- `src/pharmacy/pharmacy-components.tsx` - UI components (850+ lines)
- `src/pharmacy/pharmacy.css` - Module styling (1400+ lines)

**State Management:**
- Context with facility and user information
- Metrics object with 6 operational counts
- Prescription queue array (latest 5)
- Inventory alerts array (items requiring attention)
- Expiry monitoring array (urgent batches)
- Stock movements array (recent 5)
- Pharmacy alerts array (active alerts)

**Data Flow:**
1. Dashboard loads on navigation to `/staff/pharmacy`
2. Context initialized with current user and facility
3. Metrics calculated from backend data
4. Tables and lists populated with relevant records
5. User interactions trigger navigation or actions
6. Refresh updates all data from API

**Demo Data:**
- 5 prescription queue items with mixed priorities
- 6 inventory alert items (low stock and out-of-stock)
- 6 expiry monitoring items (expiring soon and expired)
- 5 recent stock movements (various types)
- 5 pharmacy alerts (mixed severity)
- All data clearly marked as demonstration/fictional

## Performance Considerations

**Loading Strategy:**
- Initial load shows skeleton states
- Metrics load first (highest priority)
- Tables and lists load progressively
- Refresh button reloads all sections
- Last updated timestamp shows data freshness

**Error Handling:**
- Network failures show error state with retry option
- Partial data loads show available data with warnings
- Permission errors redirect or show access denied
- Stale data warnings when backend unavailable

**Refresh Behavior:**
- Manual refresh: Click refresh button in header
- Auto-refresh: Configurable interval (default: 5 minutes)
- Smart refresh: Only updated data after initial load
- Loading indicators during refresh

## Best Practices

1. **Check Alerts First:** Review critical alerts before routine tasks
2. **Prioritize STAT Prescriptions:** Process highest priority first
3. **Monitor Expiry Daily:** Check expiry monitoring section every shift
4. **Address Out-of-Stock:** Immediate action for zero inventory items
5. **Verify Before Dispensing:** Always check medicine availability
6. **Document Adjustments:** Stock adjustments require clear notes
7. **Escalate Issues:** Report persistent alerts to pharmacy manager
8. **Review Metrics:** Use metrics to identify workload patterns

## Troubleshooting

**Issue:** Dashboard shows zero for all metrics
- **Solution:** Check if data failed to load vs. actual zero values. Look for error message or stale data warning.

**Issue:** Prescription queue empty but metric shows pending
- **Solution:** Metric shows all pending, queue shows recent 5. Click "View All" to see complete list.

**Issue:** Medicine shows "out of stock" but physical stock exists
- **Solution:** Check if stock is expired, quarantined, or reserved. Out-of-stock refers to usable inventory only.

**Issue:** Expiry alert for medicine still in stock
- **Solution:** Expired batches should not be dispensed. Quarantine expired stock and use available batches.

**Issue:** Alert won't dismiss
- **Solution:** Alerts clear when underlying condition is resolved. Complete the action required (e.g., quarantine expired batch, create purchase request).

## Future Enhancements

- Real-time prescription notifications
- Advanced filtering and search
- Custom alert thresholds
- Batch printing capabilities
- Integration with external pharmacy systems
- Mobile-optimized view
- Analytics and trending reports
- Automated reordering based on usage patterns

---

**Module Status:** ✅ Complete and Integrated  
**Last Updated:** October 2026  
**Version:** 1.0.0  
**Documentation Version:** 1.0
