import React, { useState, useEffect, useMemo } from 'react';
import {
  ResultEntryOrder,
  ResultEntryContext,
  ResultEntryState,
  TestResult,
  AnalyteResult,
  AnalyteDefinition,
  SaveState,
  ValidationSummary,
  demoResultEntryOrder,
  demoResultEntryContext,
  cbcAnalyteDefinitions,
  calculateResultFlag,
  validateAnalyteResult,
  validateTestResult,
  identifyCriticalValues,
  canSubmitForReview
} from './result-entry-model';
import {
  ResultEntryHeader,
  PatientOrderSummary,
  TestNavigation,
  ResultEntryForm,
  ValidationSummaryPanel,
  SubmitConfirmationDialog,
  UnsavedChangesWarning,
  SpecimenNotReadyState,
  SaveStatusIndicator
} from './result-entry-components';

interface ResultEntryPageProps {
  orderId?: string;
  onNavigateBack?: () => void;
  onSubmitSuccess?: () => void;
}

export function ResultEntryPage({
  orderId,
  onNavigateBack,
  onSubmitSuccess
}: ResultEntryPageProps) {
  // State
  const [state, setState] = useState<ResultEntryState>({
    order: demoResultEntryOrder,
    context: demoResultEntryContext,
    selectedTestId: demoResultEntryOrder.requestedTests[0]?.testId || '',
    saveState: 'idle',
    hasUnsavedChanges: false,
    validationSummary: {
      isValid: false,
      errors: [],
      warnings: []
    },
    showSubmitConfirmation: false,
    showUnsavedWarning: false
  });

  // Get selected test
  const selectedTest = useMemo(() => {
    return state.order.requestedTests.find(t => t.testId === state.selectedTestId);
  }, [state.order.requestedTests, state.selectedTestId]);

  // Get analyte definitions (would come from test catalogue in real implementation)
  const analyteDefinitions = cbcAnalyteDefinitions;

  // Auto-save draft every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (!state.hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      handleSaveDraft(true); // true = silent save
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [state.hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  // Handlers
  const handleTestSelect = (testId: string) => {
    setState(prev => ({ ...prev, selectedTestId: testId }));
  };

  const handleAnalyteChange = (analyteId: string, value: string) => {
    if (!selectedTest) return;

    // Find analyte definition
    const definition = analyteDefinitions.find(d => d.id === analyteId);
    if (!definition) return;

    // Calculate flag
    const flag = calculateResultFlag(value, definition, state.order.patientGender);

    // Validate
    const validationErrors = validateAnalyteResult(
      { analyteId, analyteName: definition.name, value, unit: definition.unit, flag, validationErrors: [] },
      definition
    );

    // Update analyte
    setState(prev => {
      const updatedTests = prev.order.requestedTests.map(test => {
        if (test.testId !== selectedTest.testId) return test;

        const updatedAnalytes = test.analytes.map(analyte => {
          if (analyte.analyteId !== analyteId) return analyte;

          return {
            ...analyte,
            value,
            flag,
            validationErrors,
            enteredBy: prev.context.currentUser.staffName,
            enteredAt: new Date()
          };
        });

        const completedAnalytes = updatedAnalytes.filter(a => {
          const def = analyteDefinitions.find(d => d.id === a.analyteId);
          return def?.required && a.value && a.value.trim() !== '' && a.validationErrors.length === 0;
        }).length;

        const hasValidationErrors = updatedAnalytes.some(a => a.validationErrors.length > 0);
        const hasCriticalValues = updatedAnalytes.some(a => 
          a.flag === 'critical-low' || a.flag === 'critical-high'
        );

        return {
          ...test,
          analytes: updatedAnalytes,
          completedAnalytes,
          hasValidationErrors,
          hasCriticalValues
        };
      });

      return {
        ...prev,
        order: { ...prev.order, requestedTests: updatedTests },
        hasUnsavedChanges: true
      };
    });
  };

  const handleAnalyteCommentChange = (analyteId: string, comment: string) => {
    if (!selectedTest) return;

    setState(prev => {
      const updatedTests = prev.order.requestedTests.map(test => {
        if (test.testId !== selectedTest.testId) return test;

        const updatedAnalytes = test.analytes.map(analyte => {
          if (analyte.analyteId !== analyteId) return analyte;
          return { ...analyte, comment };
        });

        return { ...test, analytes: updatedAnalytes };
      });

      return {
        ...prev,
        order: { ...prev.order, requestedTests: updatedTests },
        hasUnsavedChanges: true
      };
    });
  };

  const handleTestCommentChange = (comment: string) => {
    if (!selectedTest) return;

    setState(prev => {
      const updatedTests = prev.order.requestedTests.map(test => {
        if (test.testId !== selectedTest.testId) return test;
        return { ...test, overallComment: comment };
      });

      return {
        ...prev,
        order: { ...prev.order, requestedTests: updatedTests },
        hasUnsavedChanges: true
      };
    });
  };

  const handleSaveDraft = async (silent: boolean = false) => {
    if (!silent) {
      setState(prev => ({ ...prev, saveState: 'saving' }));
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setState(prev => ({
      ...prev,
      saveState: 'saved',
      lastSaved: new Date(),
      hasUnsavedChanges: false
    }));

    // Reset save state after 2 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, saveState: 'idle' }));
    }, 2000);
  };

  const handleValidate = () => {
    const errors: ValidationSummary['errors'] = [];
    const warnings: ValidationSummary['warnings'] = [];

    // Validate all tests
    state.order.requestedTests.forEach(test => {
      const testErrors = validateTestResult(test, analyteDefinitions);
      errors.push(...testErrors);

      const testWarnings = identifyCriticalValues(test, analyteDefinitions);
      warnings.push(...testWarnings);
    });

    setState(prev => ({
      ...prev,
      validationSummary: {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    }));
  };

  const handleSubmitForReview = () => {
    // Validate first
    handleValidate();

    // Check if can submit
    const canSubmit = canSubmitForReview(state.order, analyteDefinitions);
    
    if (canSubmit) {
      setState(prev => ({ ...prev, showSubmitConfirmation: true }));
    }
  };

  const handleConfirmSubmit = async () => {
    setState(prev => ({ ...prev, saveState: 'saving' }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setState(prev => ({ 
      ...prev, 
      saveState: 'saved',
      showSubmitConfirmation: false,
      hasUnsavedChanges: false
    }));

    // Navigate after success
    setTimeout(() => {
      onSubmitSuccess?.();
    }, 1500);
  };

  const handleCancelSubmit = () => {
    setState(prev => ({ ...prev, showSubmitConfirmation: false }));
  };

  const handleNavigateBack = () => {
    if (state.hasUnsavedChanges) {
      setState(prev => ({ ...prev, showUnsavedWarning: true }));
    } else {
      onNavigateBack?.();
    }
  };

  const handleConfirmNavigateAway = () => {
    setState(prev => ({ ...prev, showUnsavedWarning: false }));
    onNavigateBack?.();
  };

  const handleCancelNavigateAway = () => {
    setState(prev => ({ ...prev, showUnsavedWarning: false }));
  };

  // Check if specimen is ready
  const specimenReady = state.order.specimenStatus === 'verified' || state.order.specimenStatus === 'received';

  // Render
  if (!specimenReady) {
    return (
      <SpecimenNotReadyState
        order={state.order}
        onNavigateBack={handleNavigateBack}
      />
    );
  }

  return (
    <div className="result-entry-page">
      <div className="result-entry-container">
        <ResultEntryHeader
          orderId={state.order.orderId}
          priority={state.order.priority}
          onNavigateBack={handleNavigateBack}
        />

        <PatientOrderSummary order={state.order} />

        <div className="result-entry-workspace">
          <aside className="result-entry-sidebar">
            <TestNavigation
              tests={state.order.requestedTests}
              selectedTestId={state.selectedTestId}
              onTestSelect={handleTestSelect}
            />
          </aside>

          <main className="result-entry-main">
            {selectedTest && (
              <ResultEntryForm
                test={selectedTest}
                definitions={analyteDefinitions}
                patientGender={state.order.patientGender}
                onAnalyteChange={handleAnalyteChange}
                onAnalyteCommentChange={handleAnalyteCommentChange}
                onTestCommentChange={handleTestCommentChange}
              />
            )}
          </main>

          <aside className="result-entry-validation">
            <ValidationSummaryPanel
              validationSummary={state.validationSummary}
              selectedTest={selectedTest}
            />
          </aside>
        </div>

        <div className="result-entry-actions">
          <SaveStatusIndicator
            saveState={state.saveState}
            lastSaved={state.lastSaved}
            hasUnsavedChanges={state.hasUnsavedChanges}
          />

          <div className="result-entry-action-buttons">
            <button
              type="button"
              className="result-entry-button result-entry-button-secondary"
              onClick={() => handleSaveDraft(false)}
              disabled={!state.hasUnsavedChanges || state.saveState === 'saving'}
            >
              Save Draft
            </button>

            <button
              type="button"
              className="result-entry-button result-entry-button-secondary"
              onClick={handleValidate}
            >
              Validate Results
            </button>

            <button
              type="button"
              className="result-entry-button result-entry-button-primary"
              onClick={handleSubmitForReview}
              disabled={!canSubmitForReview(state.order, analyteDefinitions)}
            >
              Submit for Review
            </button>
          </div>
        </div>

        {/* Dialogs */}
        {state.showSubmitConfirmation && (
          <SubmitConfirmationDialog
            order={state.order}
            onConfirm={handleConfirmSubmit}
            onCancel={handleCancelSubmit}
          />
        )}

        {state.showUnsavedWarning && (
          <UnsavedChangesWarning
            onConfirm={handleConfirmNavigateAway}
            onCancel={handleCancelNavigateAway}
          />
        )}
      </div>
    </div>
  );
}

export default ResultEntryPage;
