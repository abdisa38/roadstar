// Laboratory Result Entry Model (Prompt 33)
// Data model for laboratory result entry and validation

import type { RequestPriority } from './model';

// Result entry status
export type ResultEntryStatus = 
  | 'draft'
  | 'ready-for-review'
  | 'pending-review'
  | 'approved'
  | 'released';

// Analyte result flag
export type ResultFlag = 
  | 'normal'
  | 'low'
  | 'high'
  | 'critical-low'
  | 'critical-high'
  | 'abnormal'
  | 'not-applicable';

// Specimen status for result entry
export type SpecimenStatusForEntry = 
  | 'not-received'
  | 'received'
  | 'verified'
  | 'rejected'
  | 'unsuitable';

// Save state
export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// Reference interval
export interface ReferenceInterval {
  min?: number;
  max?: number;
  text?: string;
  ageGroup?: string;
  gender?: 'male' | 'female' | 'all';
}

// Analyte definition
export interface AnalyteDefinition {
  id: string;
  name: string;
  shortName: string;
  unit: string;
  dataType: 'numeric' | 'text' | 'categorical';
  required: boolean;
  referenceInterval?: ReferenceInterval;
  criticalLow?: number;
  criticalHigh?: number;
  decimalPlaces: number;
  options?: string[]; // For categorical results
}

// Analyte result
export interface AnalyteResult {
  analyteId: string;
  analyteName: string;
  value: string;
  unit: string;
  flag: ResultFlag;
  comment?: string;
  enteredBy?: string;
  enteredAt?: Date;
  validationErrors: string[];
}

// Test result
export interface TestResult {
  testId: string;
  testName: string;
  testCode: string;
  analytes: AnalyteResult[];
  overallComment?: string;
  technicalNotes?: string;
  status: ResultEntryStatus;
  completedAnalytes: number;
  totalAnalytes: number;
  hasValidationErrors: boolean;
  hasCriticalValues: boolean;
}

// Order for result entry
export interface ResultEntryOrder {
  orderId: string;
  patientName: string;
  patientId: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  encounterId: string;
  orderingDepartment: string;
  orderingClinician: string;
  orderDate: Date;
  priority: RequestPriority;
  specimenType: string;
  specimenStatus: SpecimenStatusForEntry;
  specimenCollectionTime?: Date;
  specimenReceiptTime?: Date;
  requestedTests: TestResult[];
  canEnterResults: boolean;
  canSubmitForReview: boolean;
}

// Result entry context
export interface ResultEntryContext {
  currentUser: {
    staffId: string;
    staffName: string;
    role: string;
  };
  canEnterResults: boolean;
  canSubmitForReview: boolean;
  requiresReview: boolean;
  currentDateTime: Date;
}

// Result entry state
export interface ResultEntryState {
  order: ResultEntryOrder;
  context: ResultEntryContext;
  selectedTestId: string;
  saveState: SaveState;
  lastSaved?: Date;
  hasUnsavedChanges: boolean;
  validationSummary: ValidationSummary;
  showSubmitConfirmation: boolean;
  showUnsavedWarning: boolean;
}

// Validation summary
export interface ValidationSummary {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Validation error
export interface ValidationError {
  testId: string;
  testName: string;
  analyteId: string;
  analyteName: string;
  message: string;
}

// Validation warning
export interface ValidationWarning {
  testId: string;
  testName: string;
  analyteId?: string;
  analyteName?: string;
  message: string;
  type: 'critical-value' | 'missing-comment' | 'unusual-value' | 'other';
}

// Demo CBC analyte definitions
export const cbcAnalyteDefinitions: AnalyteDefinition[] = [
  {
    id: 'hemoglobin',
    name: 'Hemoglobin',
    shortName: 'Hb',
    unit: 'g/dL',
    dataType: 'numeric',
    required: true,
    referenceInterval: { min: 13.5, max: 17.5, gender: 'male' },
    criticalLow: 7.0,
    criticalHigh: 20.0,
    decimalPlaces: 1
  },
  {
    id: 'wbc',
    name: 'White Blood Cell Count',
    shortName: 'WBC',
    unit: '×10³/µL',
    dataType: 'numeric',
    required: true,
    referenceInterval: { min: 4.0, max: 11.0 },
    criticalLow: 2.0,
    criticalHigh: 30.0,
    decimalPlaces: 1
  },
  {
    id: 'rbc',
    name: 'Red Blood Cell Count',
    shortName: 'RBC',
    unit: '×10⁶/µL',
    dataType: 'numeric',
    required: true,
    referenceInterval: { min: 4.5, max: 5.9, gender: 'male' },
    criticalLow: 2.0,
    criticalHigh: 7.0,
    decimalPlaces: 2
  },
  {
    id: 'hematocrit',
    name: 'Hematocrit',
    shortName: 'HCT',
    unit: '%',
    dataType: 'numeric',
    required: true,
    referenceInterval: { min: 38.3, max: 48.6, gender: 'male' },
    criticalLow: 20.0,
    criticalHigh: 60.0,
    decimalPlaces: 1
  },
  {
    id: 'platelet',
    name: 'Platelet Count',
    shortName: 'PLT',
    unit: '×10³/µL',
    dataType: 'numeric',
    required: true,
    referenceInterval: { min: 150, max: 400 },
    criticalLow: 50,
    criticalHigh: 1000,
    decimalPlaces: 0
  },
  {
    id: 'mcv',
    name: 'Mean Corpuscular Volume',
    shortName: 'MCV',
    unit: 'fL',
    dataType: 'numeric',
    required: false,
    referenceInterval: { min: 80, max: 100 },
    decimalPlaces: 1
  },
  {
    id: 'mch',
    name: 'Mean Corpuscular Hemoglobin',
    shortName: 'MCH',
    unit: 'pg',
    dataType: 'numeric',
    required: false,
    referenceInterval: { min: 27, max: 33 },
    decimalPlaces: 1
  },
  {
    id: 'mchc',
    name: 'Mean Corpuscular Hemoglobin Concentration',
    shortName: 'MCHC',
    unit: 'g/dL',
    dataType: 'numeric',
    required: false,
    referenceInterval: { min: 32, max: 36 },
    decimalPlaces: 1
  }
];

// Demo order
export const demoResultEntryOrder: ResultEntryOrder = {
  orderId: 'ORD-LAB-2026-00124',
  patientName: 'Abebe Bekele',
  patientId: 'ORH-P-000124',
  patientAge: 42,
  patientGender: 'male',
  encounterId: 'ENC-2026-00091',
  orderingDepartment: 'Outpatient Clinic',
  orderingClinician: 'Dr. Solomon Tadesse',
  orderDate: new Date('2026-10-13T08:30:00'),
  priority: 'routine',
  specimenType: 'EDTA Blood',
  specimenStatus: 'verified',
  specimenCollectionTime: new Date('2026-10-13T08:45:00'),
  specimenReceiptTime: new Date('2026-10-13T09:00:00'),
  requestedTests: [
    {
      testId: 'cbc-001',
      testName: 'Complete Blood Count',
      testCode: 'CBC',
      analytes: cbcAnalyteDefinitions.map(def => ({
        analyteId: def.id,
        analyteName: def.name,
        value: '',
        unit: def.unit,
        flag: 'not-applicable',
        validationErrors: []
      })),
      status: 'draft',
      completedAnalytes: 0,
      totalAnalytes: cbcAnalyteDefinitions.length,
      hasValidationErrors: false,
      hasCriticalValues: false
    }
  ],
  canEnterResults: true,
  canSubmitForReview: true
};

// Demo context
export const demoResultEntryContext: ResultEntryContext = {
  currentUser: {
    staffId: 'LAB-TECH-001',
    staffName: 'Ahmed Hassan',
    role: 'Laboratory Technician'
  },
  canEnterResults: true,
  canSubmitForReview: true,
  requiresReview: true,
  currentDateTime: new Date()
};

// Utility functions
export function calculateResultFlag(
  value: string,
  definition: AnalyteDefinition,
  patientGender?: 'male' | 'female' | 'other'
): ResultFlag {
  if (!value || value.trim() === '') return 'not-applicable';
  if (definition.dataType !== 'numeric') return 'normal';

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'not-applicable';

  // Check critical values
  if (definition.criticalLow !== undefined && numValue <= definition.criticalLow) {
    return 'critical-low';
  }
  if (definition.criticalHigh !== undefined && numValue >= definition.criticalHigh) {
    return 'critical-high';
  }

  // Check reference interval
  if (definition.referenceInterval) {
    const interval = definition.referenceInterval;
    
    // Check if gender-specific
    if (interval.gender && interval.gender !== 'all' && interval.gender !== patientGender) {
      // Would need to look up appropriate interval for this gender
      return 'normal'; // Default for now
    }

    if (interval.min !== undefined && numValue < interval.min) {
      return 'low';
    }
    if (interval.max !== undefined && numValue > interval.max) {
      return 'high';
    }
  }

  return 'normal';
}

export function validateAnalyteResult(
  result: AnalyteResult,
  definition: AnalyteDefinition
): string[] {
  const errors: string[] = [];

  // Required field check
  if (definition.required && (!result.value || result.value.trim() === '')) {
    errors.push('This field is required');
    return errors;
  }

  // Skip validation if empty and not required
  if (!result.value || result.value.trim() === '') {
    return errors;
  }

  // Numeric validation
  if (definition.dataType === 'numeric') {
    const numValue = parseFloat(result.value);
    if (isNaN(numValue)) {
      errors.push('Must be a valid number');
    } else {
      // Range validation (not enforced, just informational)
      if (definition.referenceInterval) {
        // Already handled by flag calculation
      }
    }
  }

  // Categorical validation
  if (definition.dataType === 'categorical' && definition.options) {
    if (!definition.options.includes(result.value)) {
      errors.push('Must select a valid option');
    }
  }

  return errors;
}

export function validateTestResult(test: TestResult, definitions: AnalyteDefinition[]): ValidationError[] {
  const errors: ValidationError[] = [];

  test.analytes.forEach(analyte => {
    const definition = definitions.find(d => d.id === analyte.analyteId);
    if (!definition) return;

    const analyteErrors = validateAnalyteResult(analyte, definition);
    analyteErrors.forEach(message => {
      errors.push({
        testId: test.testId,
        testName: test.testName,
        analyteId: analyte.analyteId,
        analyteName: analyte.analyteName,
        message
      });
    });
  });

  return errors;
}

export function identifyCriticalValues(test: TestResult, definitions: AnalyteDefinition[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  test.analytes.forEach(analyte => {
    if (analyte.flag === 'critical-low' || analyte.flag === 'critical-high') {
      warnings.push({
        testId: test.testId,
        testName: test.testName,
        analyteId: analyte.analyteId,
        analyteName: analyte.analyteName,
        message: `Critical value detected: ${analyte.value} ${analyte.unit}`,
        type: 'critical-value'
      });
    }
  });

  return warnings;
}

export function isTestComplete(test: TestResult, definitions: AnalyteDefinition[]): boolean {
  const requiredAnalytes = definitions.filter(d => d.required);
  const completedRequired = test.analytes.filter(a => {
    const def = definitions.find(d => d.id === a.analyteId);
    return def?.required && a.value && a.value.trim() !== '' && a.validationErrors.length === 0;
  });

  return completedRequired.length === requiredAnalytes.length;
}

export function canSubmitForReview(order: ResultEntryOrder, definitions: AnalyteDefinition[]): boolean {
  if (!order.canSubmitForReview) return false;
  if (order.specimenStatus !== 'verified' && order.specimenStatus !== 'received') return false;

  // All tests must be complete
  return order.requestedTests.every(test => isTestComplete(test, definitions));
}

export function formatResultFlag(flag: ResultFlag): string {
  const labels: Record<ResultFlag, string> = {
    'normal': 'Normal',
    'low': 'Low',
    'high': 'High',
    'critical-low': 'Critical Low',
    'critical-high': 'Critical High',
    'abnormal': 'Abnormal',
    'not-applicable': ''
  };
  return labels[flag];
}

export function formatSpecimenStatus(status: SpecimenStatusForEntry): string {
  const labels: Record<SpecimenStatusForEntry, string> = {
    'not-received': 'Not Received',
    'received': 'Received',
    'verified': 'Verified',
    'rejected': 'Rejected',
    'unsuitable': 'Unsuitable'
  };
  return labels[status];
}

export function formatResultEntryStatus(status: ResultEntryStatus): string {
  const labels: Record<ResultEntryStatus, string> = {
    'draft': 'Draft',
    'ready-for-review': 'Ready for Review',
    'pending-review': 'Pending Review',
    'approved': 'Approved',
    'released': 'Released'
  };
  return labels[status];
}
