import React, { useState } from 'react';
import defaultFormData from '../data/formquestions.json';

const styles = {
  light: {
    background: '#f0f0f0',
    color: '#333',
    padding: '20px',
    borderRadius: '8px',
    margin: '10px 0'
  },
  dark: {
    background: '#333',
    color: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    margin: '10px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: 'bold'
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.75rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem'
  }
};

const DynamicForm = ({ instanceId, settings }) => {
  const theme = settings?.theme || 'light';
  const formData = settings?.formData 
    ? JSON.parse(settings.formData).questions 
    : defaultFormData.questions;

  const [formResponses, setFormResponses] = useState({});

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
            value={formResponses[questionId] || ''}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            style={styles.input}
            required
          />
        );
      
      case 'select':
        return (
          <select
            id={questionId}
            value={formResponses[questionId] || ''}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            style={styles.select}
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
          <div>
            {item.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} style={{ marginRight: '1rem' }}>
                <input
                  type="radio"
                  name={questionId}
                  value={choice}
                  checked={formResponses[questionId] === choice}
                  onChange={(e) => handleInputChange(questionId, e.target.value)}
                  required
                />
                {' '}{choice}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div>
            {item.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} style={{ marginRight: '1rem' }}>
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
                />
                {' '}{choice}
              </label>
            ))}
          </div>
        );

      default:
        return <p>Unsupported input type: {item.inputType}</p>;
    }
  };

  return (
    <div style={styles[theme]}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {formData.map((item, index) => (
          <div key={index} style={styles.formGroup}>
            <label htmlFor={`question_${index}`} style={styles.label}>
              {item.question}
            </label>
            {renderFormField(item, index)}
          </div>
        ))}
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm; 