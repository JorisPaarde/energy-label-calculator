import React, { useState, useEffect } from 'react';
import defaultFormData from '../data/formquestions.json';
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
            className="form-input"
            required
          />
        );
      
      case 'select':
        return (
          <select
            id={questionId}
            value={formResponses[questionId]}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select an option</option>
            {item.choices.map((choice, choiceIndex) => (
              <option key={choiceIndex} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="radio-group">
            {item.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} className="radio-label">
                <input
                  type="radio"
                  name={questionId}
                  value={choice}
                  checked={formResponses[questionId] === choice}
                  onChange={(e) => handleInputChange(questionId, e.target.value)}
                  className="radio-input"
                  required
                />
                {choice}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="checkbox-group">
            {item.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} className="checkbox-label">
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
                  className="checkbox-input"
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

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="dynamic-form">
        {formData.map((item, index) => (
          <div key={index} className="form-group">
            <label htmlFor={`question_${index}`} className="form-label">
              {item.question}
            </label>
            {renderFormField(item, index)}
          </div>
        ))}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm; 