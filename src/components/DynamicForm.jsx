import React, { useState, useEffect, useRef, useMemo } from 'react';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
import FormFields from './FormFields';
import ResultDisplay from './ResultDisplay';

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
    // ... rest of shouldShowQuestion logic ...
    return true;
  };

  return (
    <div className="energy-calculator-form-container" ref={formContainerRef}>
      <FormHeader />
      <div className="energy-calculator-content-wrapper">
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
  );
};

export default DynamicForm; 