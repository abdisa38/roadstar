# Laboratory History and Record Retrieval Module

## Overview

The Laboratory History module (Prompt 35) provides authorized laboratory personnel with comprehensive access to finalized laboratory records. Staff can search, filter, view detailed results, inspect correction history, compare trends across time, and export records for analysis or reporting.

## User Roles

**Authorized Users:**
- Laboratory Technologists (view and export)
- Senior Laboratory Staff (view, export, audit)
- Laboratory Supervisors (full access including audit trails)
- Quality Assurance Personnel (view, audit, trend analysis)

## Module Access

**Route:** `/staff/laboratory/history`

**Navigation:** Laboratory Dashboard → "History & Records" quick action

**Access Control:** Requires `laboratory-history` permission

## Key Features

### 1. Comprehensive Search and Filtering

**Search Capabilities:**
- Text search across patient names, MRN, order ID, test types
- Date range filtering (collection date, release date)
- Patient-specific search
- Test type filtering
- Order status filtering (completed, approved, released, corrected, amended, cancelled)
- Result status filtering (finalized, approved, released, corrected, amended)
- Priority filtering (routine, urgent, stat)
- Correction history filtering (show only corrected/amended records)

**Date Range Presets:**
- Today
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range

### 2. Summary Metrics Dashboard

**Real-time Statistics:**
- **Completed Orders:** Total records in selected period
- **Results Released:** Count of released results
- **Corrected/Amended:** Records with correction history
- **Records in Period:** Total matching filters

**Trend Indicators:**
- Percentage change from previous period
- Visual up/down indicators
- Color-coded trends

### 3. Historical Records Table

**Display Columns:**
- Order ID (clickable for details)
- Patient Name and MRN
- Test Type and Code
- Collection Date
- Release Date
- Order Status (badge with color coding)
- Priority Level
- Correction Count (if any)
- Performed By (technologist name and role)
- Actions (view details button)

**Table Features:**
- Sortable columns (click header to sort)
- Pagination controls (10, 25, 50, 100 records per page)
- Record count display
- Hover highlights
- Correction indicators (warning icon with count)

### 4. Detailed Record View

**Six Information Sections:**

#### a) Order Information
- Order ID, date, and source
- Test type and code
- Order and result status
- Priority level
- Ordered by and department

#### b) Patient Information
- Full name and MRN
- Age and gender
- Patient department/location

#### c) Specimen Information
- Specimen type and quality
- Collection date and personnel
- Receipt date
- Specimen notes (if any)

#### d) Test Results Tab
- Complete result table with all parameters
- Result values with interpretation
- Reference ranges
- Flags (normal, abnormal, critical)
- Correction indicators on modified values

#### e) Corrections Tab
- Complete correction/amendment history
- Original vs. corrected value comparison
- Correction reasons and timestamps
- Corrector identification
- Review status for each correction

#### f) Timeline Tab
- Chronological event history
- Order creation through result release
- All corrections and amendments
- Personnel involved at each step
- Event timestamps and notes

**Action Buttons:**
- Compare Results (trend analysis)
- Print Record
- Export Record
- Close Detail View

### 5. Correction and Amendment History

**Tracking System:**
- Original value preservation
- Corrected value documentation
- Correction reason (6 categories)
- Correction timestamp
- Corrector identification and role
- Review status (if reviewed)

**Correction Reasons:**
- Transcription error
- Calculation error
- Wrong specimen
- Instrument malfunction
- Quality control failure
- Administrative correction

**Visual Display:**
- Original value in red box (crossed out)
- Corrected value in green box (highlighted)
- Arrow showing change direction
- Reason prominently displayed
- Review confirmation if applicable

### 6. Result Comparison and Trend Analysis

**Comparison Features:**
- Current result vs. historical results
- Up to 5 previous results shown
- Trend direction indicators (↑ increasing, ↓ decreasing, — stable)
- Percentage change calculations
- Visual trend icons with color coding
- Reference range comparison

**Parameter-by-Parameter Analysis:**
- Individual parameter trends
- Historical value timeline
- Current vs. previous comparison
- Abnormal/critical flagging
- Range compliance checking

**Trend Indicators:**
- **Increasing:** Red background, upward arrow
- **Decreasing:** Green background, downward arrow
- **Stable:** Teal background, horizontal line

### 7. Export and Print Functionality

**Export Formats:**
- PDF (formatted report)
- CSV (data analysis)
- Excel (spreadsheet format)

**Export Confirmation Dialog:**
- Record count display
- Content included list
- Privacy notice reminder
- Export button with count

**Export Contents:**
- Patient demographics
- Order and specimen details
- Complete test results
- Correction history
- Review and release information
- Timestamps and personnel

**Privacy Notice:**
All exports contain Protected Health Information (PHI) and must be handled according to facility security policies.

## Workflow Examples

### Scenario 1: Viewing a Patient's Laboratory History

1. Laboratory supervisor needs to review all CBC tests for patient Hana Mohammed
2. Opens History module from dashboard
3. Searches for "Hana Mohammed" in patient search
4. Filters test type to "Complete Blood Count"
5. Sets date range to "Last 90 days"
6. Reviews table showing 3 CBC results
7. Clicks on most recent order to view details
8. Reviews Results tab to see all parameters
9. Clicks "Compare Results" to view trends
10. Observes hemoglobin trend decreasing from 12.1 → 8.9 → 6.8 g/dL

### Scenario 2: Investigating a Corrected Result

1. Quality assurance receives alert about corrected glucose result
2. Opens History module
3. Filters "Has Corrections" = Yes
4. Finds ORD-LAB-2026-00102 in results table (correction indicator visible)
5. Opens record details
6. Switches to "Corrections" tab
7. Reviews correction: 450 mg/dL → 45 mg/dL
8. Reads reason: "Transcription error - decimal point misplaced"
9. Verifies corrector: Sr. Tech Rahel (Lab Technologist)
10. Confirms review by Lab Supervisor
11. Documents review in quality log

### Scenario 3: Exporting Records for Audit

1. Laboratory manager needs quarterly audit report
2. Opens History module
3. Sets date range: January 1 - March 31, 2026
4. Filters status to "Released"
5. Reviews metrics: 1,247 completed orders, 18 corrections
6. Clicks "Export" button
7. Confirms export of 1,247 records in Excel format
8. Reviews privacy notice
9. Clicks "Export 1247 Records"
10. Saves file to secure audit directory

### Scenario 4: Comparing Sequential Results

1. Clinician requests trend analysis for patient with anemia
2. Technologist opens patient record (MRN: ORH-2026-00117)
3. Views historical CBC results
4. Clicks "Compare Results" on most recent test
5. Reviews comparison panel showing 4 previous CBCs
6. Observes:
   - Hemoglobin: decreasing trend, now critical
   - Hematocrit: decreasing trend
   - RBC: stable
   - WBC: within normal range
7. Notes percentage changes for each parameter
8. Prints comparison report for clinical team

## Data Model

### Historical Record Structure

```typescript
interface HistoricalRecord {
  orderId: string
  patientId: string
  patientName: string
  patientMRN: string
  patientAge: number
  patientGender: string
  patientDepartment: string
  testId: string
  testName: string
  testCode?: string
  orderedAt: Date
  orderedBy: string
  orderingDepartment: string
  specimenType: string
  specimenCollectedAt: Date
  specimenCollectedBy: string
  specimenReceivedAt: Date
  specimenQuality: 'acceptable' | 'satisfactory' | 'suboptimal'
  specimenNotes?: string
  orderStatus: HistoricalOrderStatus
  resultStatus: HistoricalResultStatus
  priority: TestPriority
  results: TestResult[]
  performedBy: string
  performedByRole: string
  performedAt: Date
  reviewedBy?: string
  reviewedAt?: Date
  releasedBy?: string
  resultReleasedAt?: Date
  resultNotes?: string
  hasCorrectionHistory: boolean
  correctionHistory?: CorrectionHistory[]
  timeline: TimelineEvent[]
}
```

### Status Types

**Order Status:**
- `completed` - Order fulfilled, results entered
- `approved` - Results approved by reviewer
- `released` - Results released to clinical system
- `corrected` - Contains corrected values
- `amended` - Contains amended information
- `cancelled` - Order cancelled

**Result Status:**
- `finalized` - Results finalized by technologist
- `approved` - Results approved by supervisor
- `released` - Results released to ordering provider
- `corrected` - Result values corrected
- `amended` - Result information amended

**Priority Levels:**
- `routine` - Standard processing
- `urgent` - Priority processing
- `stat` - Immediate processing

## Access Control Matrix

| Role | View Records | Export | Compare Trends | View Corrections | Audit Access |
|------|-------------|---------|----------------|------------------|--------------|
| Lab Tech | ✓ | ✓ | ✓ | ✓ | Limited |
| Senior Tech | ✓ | ✓ | ✓ | ✓ | ✓ |
| Lab Supervisor | ✓ | ✓ | ✓ | ✓ | ✓ |
| QA Personnel | ✓ | ✓ | ✓ | ✓ | ✓ |

## Technical Implementation

**Module Files:**
- `src/laboratory/history-model.ts` - Data models, interfaces, demo data (750+ lines)
- `src/laboratory/HistoryPage.tsx` - Main page component (180 lines)
- `src/laboratory/history-components.tsx` - UI components (2600+ lines)
- `src/laboratory.css` - Module styling (~2000 lines for history)

**Component Structure:**
- `HistoryPage` - Main container with state management
- `HistoryHeader` - Title and action buttons
- `HistoryMetrics` - Summary statistics display
- `HistorySearchToolbar` - Search and filter controls
- `HistoryRecordsTable` - Sortable results table
- `RecordDetailView` - Comprehensive detail panel
- `ResultsTabContent` - Test results display
- `CorrectionHistoryPanel` - Correction tracking
- `ResultComparisonPanel` - Trend analysis
- `TimelinePanel` - Event chronology
- `ExportConfirmDialog` - Export confirmation
- `PaginationControls` - Table pagination

**State Management:**
- Search query and filters
- Sort field and direction
- Pagination state
- View mode (list/detail)
- Selected record
- Comparison data
- Export settings

## Integration Points

**From Dashboard:**
- Quick action card: "History & Records"
- Metric display: Historical record count

**To Other Modules:**
- Patient Profile (patient demographics)
- Order Management (order details)
- Result Entry (original results)
- Result Review (review history)

## Best Practices

1. **Search Before Exporting:** Use filters to limit export scope
2. **Review Corrections Carefully:** Check correction history for quality assurance
3. **Compare Trends Regularly:** Use comparison tool for serial monitoring
4. **Handle PHI Securely:** Follow facility policies for exported data
5. **Document Audit Access:** Log access for compliance purposes
6. **Verify Date Ranges:** Ensure correct time period selected
7. **Check Correction Reasons:** Understand why results were modified
8. **Print When Needed:** Use print for clinical rounds or consultations

## Keyboard Shortcuts

- `Esc` - Close detail view or dialog
- `Arrow Keys` - Navigate table rows
- `Enter` - Open selected record
- `Tab` - Navigate form fields

## Troubleshooting

**Issue:** No records displayed
- **Solution:** Check date range filters, expand search criteria

**Issue:** Export fails
- **Solution:** Reduce record count, check permissions, verify disk space

**Issue:** Trend comparison unavailable
- **Solution:** Ensure patient has multiple results for same test type

**Issue:** Correction history not showing
- **Solution:** Verify record has corrections, check access permissions

## Quality Assurance

**Audit Trail:**
- All access logged with timestamp
- Export actions recorded
- Correction reviews tracked
- Comparison requests documented

**Data Integrity:**
- Original values preserved
- Correction history immutable
- Timeline events chronological
- Review status verified

## Performance Considerations

- Pagination reduces initial load
- Lazy loading for detail views
- Indexed searches for speed
- Cached comparison data
- Efficient date range queries

## Compliance Notes

- HIPAA-compliant access logging
- PHI protection on exports
- Audit trail maintenance
- Data retention policies
- Access control enforcement

## Future Enhancements

- Automated trend alerts
- Statistical analysis tools
- Batch export scheduling
- Custom report templates
- Advanced charting options
- Integration with EHR systems
- Mobile-optimized views

---

**Module Status:** ✅ Complete and Integrated
**Last Updated:** January 2026
**Version:** 1.0.0
