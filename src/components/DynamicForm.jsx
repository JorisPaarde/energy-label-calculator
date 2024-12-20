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

  const findQuestionByText = (questionText) => {
    // Remove colon if present and trim whitespace
    const normalizedText = questionText.replace(':', '').trim();
    
    // First try exact match
    let index = formData.findIndex(q => q.question === normalizedText);
    
    // If not found, try case-insensitive match
    if (index === -1) {
      index = formData.findIndex(q => 
        q.question.toLowerCase() === normalizedText.toLowerCase()
      );
    }
    
    // If still not found, try matching without colon
    if (index === -1) {
      index = formData.findIndex(q => 
        q.question.replace(':', '').trim().toLowerCase() === normalizedText.toLowerCase()
      );
    }

    if (index === -1) return null;
    
    return {
      question: formData[index],
      id: `question_${index}`,
      index
    };
  };

  const getChoiceValue = (question, choiceText) => {
    if (!question || !question.choices) return choiceText;
    if (!choiceText) return choiceText;

    // If choices are objects with label/value
    if (typeof question.choices[0] === 'object') {
      const choice = question.choices.find(c => 
        c.label === choiceText || 
        c.value === choiceText ||
        (c.label && choiceText && c.label.toLowerCase() === choiceText.toLowerCase())
      );
      return choice ? choice.value : choiceText;
    }

    // For string choices, try case-insensitive match if exact match fails
    const exactMatch = question.choices.find(c => c === choiceText);
    if (exactMatch) return exactMatch;

    const caseInsensitiveMatch = question.choices.find(
      c => c.toLowerCase() === choiceText.toLowerCase()
    );
    return caseInsensitiveMatch || choiceText;
  };

  const shouldShowQuestion = (item, index) => {
    if (!item.showIf) return true;

    const dependentQuestion = findQuestionByText(item.showIf.question);
    if (!dependentQuestion) return true;

    const dependentValue = formResponses[dependentQuestion.id];
    let result = true;

    // Check equals condition
    if (item.showIf.equals) {
      const expectedValue = getChoiceValue(dependentQuestion.question, item.showIf.equals);
      result = result && (dependentValue === expectedValue);
    }
    
    // Check notEquals condition
    if (item.showIf.notEquals) {
      const notEqualsArray = Array.isArray(item.showIf.notEquals) 
        ? item.showIf.notEquals 
        : [item.showIf.notEquals];
      
      const notEqualsValues = notEqualsArray.map(value => 
        getChoiceValue(dependentQuestion.question, value)
      );
      
      result = result && !notEqualsValues.includes(dependentValue);
    }

    // Check contains condition (for checkboxes)
    if (item.showIf.contains) {
      const checkboxValues = dependentValue || [];
      const expectedValue = getChoiceValue(dependentQuestion.question, item.showIf.contains);
      result = result && checkboxValues.includes(expectedValue);
    }

    // Check additional condition if andQuestion exists
    if (item.showIf.andQuestion) {
      const andQuestion = findQuestionByText(item.showIf.andQuestion);
      
      if (andQuestion) {
        const andValue = formResponses[andQuestion.id];
        
        if (item.showIf.notEquals) {
          const notEqualsArray = Array.isArray(item.showIf.notEquals) 
            ? item.showIf.notEquals 
            : [item.showIf.notEquals];
          
          const notEqualsValues = notEqualsArray.map(value => 
            getChoiceValue(andQuestion.question, value)
          );
          
          result = result && !notEqualsValues.includes(andValue);
        }
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