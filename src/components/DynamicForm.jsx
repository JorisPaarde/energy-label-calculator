import React, { useState, useEffect, useRef } from 'react';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
import FormFields from './FormFields';
import ResultDisplay from './ResultDisplay';
import EnergyLabelTester from './EnergyLabelTester';
import { initializeFormResponses, shouldShowQuestion, transformFormAnswers } from '../utils/formUtils';

const DynamicForm = ({ instanceId, settings }) => {
  const ANIMATION_DURATION = 500;
  const formData = settings?.formData 
    ? JSON.parse(settings.formData).questions 
    : defaultFormData.questions;

  const formContainerRef = useRef(null);
  
  const [formResponses, setFormResponses] = useState(initializeFormResponses());
  const [calculationState, setCalculationState] = useState({
    isCalculating: false,
    result: null
  });



  useEffect(() => {
    setFormResponses(initializeFormResponses());
  }, [settings?.formData]);

  const handleInputChange = (questionId, value) => {
    setFormResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = calculateEnergyLabel(formResponses);
    result.formAnswers = transformFormAnswers(formResponses, formData);

    setCalculationState({
      isCalculating: true,
      result: result
    });

    setTimeout(() => {
      setCalculationState(prev => ({
        ...prev,
        isCalculating: false
      }));
    }, ANIMATION_DURATION);
  };

  const handleReset = () => {
    setCalculationState({ isCalculating: false, result: null });
    setFormResponses(initializeFormResponses());
  };

  const shouldShowQuestion = (item) => {
    if (!item.showIf) return true;
    
    const dependentQuestionId = formData.findIndex(q => q.question === item.showIf.question);
    if (dependentQuestionId === -1) return true;
    
    const dependentResponse = formResponses[`question_${dependentQuestionId}`];
    
    if (item.showIf.equals) {
      return dependentResponse === item.showIf.equals;
    }
    
    if (item.showIf.notEquals) {
      if (Array.isArray(item.showIf.notEquals)) {
        return !item.showIf.notEquals.includes(dependentResponse);
      }
      return dependentResponse !== item.showIf.notEquals;
    }
    
    return true;
  };

  return (
    <div>
      <div className="energy-calculator-form-container" ref={formContainerRef}>
        <FormHeader />
        <div className={`energy-calculator-content-wrapper ${calculationState.result ? 'has-result' : ''}`}>
          <form 
            onSubmit={handleSubmit} 
            className={`energy-calculator-form ${calculationState.result ? 'has-result' : ''}`}
          >
            {formData.map((item, index) => (
              shouldShowQuestion(item) && (
                <div key={index} className="energy-calculator-form-group">
                  <label htmlFor={`question_${index}`} className="energy-calculator-form-label">
                    {item.question}
                  </label>
                  <FormFields
                    item={item}
                    index={index}
                    formResponses={formResponses}
                    handleInputChange={handleInputChange}
                    shouldShowQuestion={shouldShowQuestion}
                  />
                </div>
              )
            ))}
            <button type="submit" className="energy-calculator-submit-button">
              Bereken Energielabel
            </button>
          </form>

          <ResultDisplay 
            result={calculationState.result}
            onReset={handleReset}
            animationDuration={ANIMATION_DURATION}
          />
        </div>
      </div>

      {/* Show EnergyLabelTester only in development mode */}
      {import.meta.env.DEV && (
        <>
          <div style={{ margin: '40px 0', borderTop: '1px solid #ddd', width: '100%' }} />
          <EnergyLabelTester />
        </>
      )}
    </div>
  );
};

export default DynamicForm; 