import React from 'react';

export const FormFields = ({ 
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
          {Object.entries(item.answers).map(([label, value], choiceIndex) => (
            <option key={choiceIndex} value={label}>
              {label}
            </option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className="energy-calculator-radio-group">
          {Object.entries(item.answers).map(([label, value], choiceIndex) => (
            <label key={choiceIndex} className="energy-calculator-radio-label">
              <input
                type="radio"
                name={questionId}
                value={label}
                checked={formResponses[questionId] === label}
                onChange={(e) => handleInputChange(questionId, e.target.value)}
                className="energy-calculator-radio-input"
                required
              />
              {label}
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="energy-calculator-checkbox-group">
          {Object.entries(item.answers).map(([label, answerData], choiceIndex) => {
            if (answerData.showIf && !shouldShowQuestion({ showIf: answerData.showIf })) {
              return null;
            }

            const value = typeof answerData === 'object' ? answerData.value : answerData;

            return (
              <label key={choiceIndex} className="energy-calculator-checkbox-label">
                <input
                  type="checkbox"
                  name={questionId}
                  value={label}
                  checked={formResponses[questionId]?.includes(label)}
                  onChange={(e) => {
                    const currentValues = formResponses[questionId] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, label]
                      : currentValues.filter(v => v !== label);
                    handleInputChange(questionId, newValues);
                  }}
                  className="energy-calculator-checkbox-input"
                />
                {label}
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