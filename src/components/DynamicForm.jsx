import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
import FormFields from './FormFields';

const DynamicForm = ({ instanceId, settings }) => {
  const formData = settings?.formData 
    ? JSON.parse(settings.formData).questions 
    : defaultFormData.questions;

  // Initialize form responses with empty values
  const initializeFormResponses = () => {
    const initialResponses = {};
    formData.forEach((item, index) => {
      const questionId = `question_${index}`;
      if (item.inputType === 'checkbox') {
        initialResponses[questionId] = [];
      } else {
        initialResponses[questionId] = '';
      }
    });
    return initialResponses;
  };

  const [formResponses, setFormResponses] = useState(initializeFormResponses());

  // Reset form when formData changes
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
    
    // Calculate the energy label
    const result = calculateEnergyLabel(formResponses);
    
    // Log the result
    console.log('Energy Label Result:', result);
    
    // You can show the result to the user here
    alert(`Calculated Energy Label: ${result.label}\n${result.details}`);
  };

  const shouldShowQuestion = (item, index) => {
    if (!item.showIf) return true;

    const dependentQuestionIndex = formData.findIndex(
      q => q.question === item.showIf.question
    );
    const dependentQuestionId = `question_${dependentQuestionIndex}`;
    
    let result = true;

    // Check equals condition
    if (item.showIf.equals) {
      result = result && (formResponses[dependentQuestionId] === item.showIf.equals);
    }
    
    // Check notEquals condition
    if (item.showIf.notEquals) {
      const notEqualsArray = Array.isArray(item.showIf.notEquals) 
        ? item.showIf.notEquals 
        : [item.showIf.notEquals];
      result = result && !notEqualsArray.includes(formResponses[dependentQuestionId]);
    }

    // Check contains condition (for checkboxes)
    if (item.showIf.contains) {
      const checkboxValues = formResponses[dependentQuestionId] || [];
      result = result && checkboxValues.includes(item.showIf.contains);
    }

    // Check additional condition if andQuestion exists
    if (item.showIf.andQuestion) {
      const andQuestionIndex = formData.findIndex(
        q => q.question === item.showIf.andQuestion
      );
      const andQuestionId = `question_${andQuestionIndex}`;
      
      if (item.showIf.notEquals) {
        const notEqualsArray = Array.isArray(item.showIf.notEquals) 
          ? item.showIf.notEquals 
          : [item.showIf.notEquals];
        result = result && !notEqualsArray.includes(formResponses[andQuestionId]);
      }
    }

    return result;
  };

  return (
    <div className="energy-calculator-form-container">
      <FormHeader />
      <form onSubmit={handleSubmit} className="dynamic-form">
        <TransitionGroup>
          {formData.map((item, index) => (
            shouldShowQuestion(item, index) && (
              <CSSTransition
                key={index}
                timeout={300}
                classNames="form-field"
                unmountOnExit
              >
                <div className="energy-calculator-form-group">
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
              </CSSTransition>
            )
          ))}
        </TransitionGroup>
        <button type="submit" className="energy-calculator-submit-button">
          Bereken Energielabel
        </button>
      </form>
    </div>
  );
};

export default DynamicForm; 