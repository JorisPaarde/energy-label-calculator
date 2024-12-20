import React, { useState, useEffect } from 'react';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';

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

  const renderFormField = (item, index) => {
    const questionId = `question_${index}`;

    switch (item.inputType.toLowerCase()) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <input
            type={item.inputType}
            id={questionId}
            value={formResponses[questionId]}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            className="energy-calculator-form-input"
            placeholder={item.placeholder}
            required
          />
        );
      
      case 'select':
        return (
          <select
            id={questionId}
            value={formResponses[questionId]}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            className="energy-calculator-form-select"
            required
          >
            {item.placeholder && <option value="">{item.placeholder}</option>}
            {item.choices.map((choice, choiceIndex) => (
              <option key={choiceIndex} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="energy-calculator-radio-group">
            {item.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} className="energy-calculator-radio-label">
                <input
                  type="radio"
                  name={questionId}
                  value={choice}
                  checked={formResponses[questionId] === choice}
                  onChange={(e) => handleInputChange(questionId, e.target.value)}
                  className="energy-calculator-radio-input"
                  required
                />
                {choice}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="energy-calculator-checkbox-group">
            {item.choices.map((choice, choiceIndex) => {
              // Handle conditional choices
              if (typeof choice === 'object' && choice.showIf) {
                if (!shouldShowQuestion({ showIf: choice.showIf }, index)) {
                  return null;
                }
                choice = choice.value;
              }

              return (
                <label key={choiceIndex} className="energy-calculator-checkbox-label">
                  <input
                    type="checkbox"
                    name={questionId}
                    value={choice}
                    checked={formResponses[questionId]?.includes(choice)}
                    onChange={(e) => {
                      const currentValues = formResponses[questionId] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, choice]
                        : currentValues.filter(v => v !== choice);
                      handleInputChange(questionId, newValues);
                    }}
                    className="energy-calculator-checkbox-input"
                  />
                  {choice}
                </label>
              );
            })}
          </div>
        );

      default:
        return <p>Unsupported input type: {item.inputType}</p>;
    }
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

  const evaluateConditions = (conditions) => {
    // Handle single condition object or array of conditions
    const conditionsArray = Array.isArray(conditions) ? conditions : [conditions];
    
    // All conditions must be true (AND logic)
    return conditionsArray.every(condition => {
      const dependentQuestionIndex = formData.findIndex(
        q => q.question === condition.question
      );
      
      if (dependentQuestionIndex === -1) {
        console.warn(`Question not found: ${condition.question}`);
        return true;
      }

      const dependentQuestionId = `question_${dependentQuestionIndex}`;
      const dependentValue = formResponses[dependentQuestionId];

      switch (condition.type) {
        // ... existing cases ...
      }
    });
  };

  return (
    <div className="energy-calculator-form-container">
      <FormHeader />
      <form onSubmit={handleSubmit} className="dynamic-form">
        {formData.map((item, index) => (
          shouldShowQuestion(item, index) && (
            <div key={index} className="energy-calculator-form-group">
              <label htmlFor={`question_${index}`} className="energy-calculator-form-label">
                {item.question}
              </label>
              {renderFormField(item, index)}
            </div>
          )
        ))}
        <button type="submit" className="energy-calculator-submit-button">
          Bereken Energielabel
        </button>
      </form>
    </div>
  );
};

export default DynamicForm; 