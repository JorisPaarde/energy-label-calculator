import React, { useState, useEffect, useRef, useMemo } from 'react';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
import FormFields from './FormFields';
import ResultDisplay from './ResultDisplay';
import EnergyLabelTester from './EnergyLabelTester';

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

  // Initialize form responses with empty values or defaults
  function initializeFormResponses() {
    const initialResponses = {};
    formData.forEach((item, index) => {
      const questionId = `question_${index}`;
      
      // Skip setting default values for conditional questions that shouldn't be shown initially
      if (item.showIf) {
        const dependentQuestionId = formData.findIndex(q => q.question === item.showIf.question);
        if (dependentQuestionId !== -1) {
          // For questions with showIf condition, don't set an initial value
          initialResponses[questionId] = '';
          return;
        }
      }
      
      if (item.inputType === 'checkbox') {
        initialResponses[questionId] = [];
      } else if (item.inputType === 'select' || item.inputType === 'radio') {
        if (item.answers) {
          const firstAnswer = Object.keys(item.answers)[0];
          initialResponses[questionId] = firstAnswer || '';
        } else if (item.choices && item.choices.length > 0) {
          initialResponses[questionId] = typeof item.choices[0] === 'object' 
            ? item.choices[0].value 
            : item.choices[0];
        } else {
          initialResponses[questionId] = '';
        }
      } else if (item.inputType === 'number') {
        if (item.scoring?.ranges && item.scoring.ranges.length > 0) {
          const firstRange = item.scoring.ranges[0];
          initialResponses[questionId] = firstRange.min || 0;
        } else {
          initialResponses[questionId] = item.min || 0;
        }
      } else {
        initialResponses[questionId] = item.defaultValue || '';
      }
    });
    return initialResponses;
  }

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
    
    const formAnswers = formData.reduce((acc, item, index) => {
      const questionId = `question_${index}`;
      const answer = formResponses[questionId];
      acc[item.question] = answer;
      return acc;
    }, {});
    
    const result = calculateEnergyLabel(formResponses);
    result.formAnswers = formAnswers;
    
    setCalculationState({ 
      isCalculating: true, 
      result: result
    });

    setTimeout(() => {
      setCalculationState({
        isCalculating: false,
        result: result
      });
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