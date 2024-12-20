import React, { useState, useEffect } from 'react';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';

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
    console.log('Form responses:', formResponses);
    // Here you can add your form submission logic
    alert('Form submitted! Check console for responses.');
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
            {item.choices.map((choice, choiceIndex) => (
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
            ))}
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
    
    if (item.showIf.equals) {
      return formResponses[dependentQuestionId] === item.showIf.equals;
    }
    
    if (item.showIf.notEquals) {
      const notEqualsArray = Array.isArray(item.showIf.notEquals) 
        ? item.showIf.notEquals 
        : [item.showIf.notEquals];
      return !notEqualsArray.includes(formResponses[dependentQuestionId]);
    }

    return true;
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