import React from 'react';

const FormFields = ({ 
  item, 
  index, 
  formResponses, 
  handleInputChange, 
  shouldShowQuestion 
}) => {
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

export default FormFields;