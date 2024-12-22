import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import defaultFormData from '../data/formquestions.json';
import FormHeader from './FormHeader';
import '@styles/main.scss';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
import FormFields from './FormFields';
import ResultDisplay from './ResultDisplay';

const DynamicForm = ({ instanceId, settings }) => {
  const ANIMATION_DURATION = 500; // Consistent animation duration
  const HEADER_OFFSET = 100; // Adjust this value based on your header height
  const formData = settings?.formData 
    ? JSON.parse(settings.formData).questions 
    : defaultFormData.questions;

  const formContainerRef = useRef(null);
  const formTransitionRef = useRef(null);
  
  // Create refs for each form field
  const fieldRefs = useMemo(() => 
    Array(formData.length).fill(null).map(() => React.createRef()),
    [formData.length]
  );

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
  const [calculationState, setCalculationState] = useState({
    isCalculating: false,
    result: null
  });

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
    
    // Create and log questions and answers object
    const formAnswers = formData.reduce((acc, item, index) => {
      const questionId = `question_${index}`;
      const answer = formResponses[questionId];
      if (answer && answer.length !== 0) {
        acc[item.question] = answer;
      }
      return acc;
    }, {});
    
    console.log(formAnswers);
    
    // Calculate the energy label
    const result = calculateEnergyLabel(formResponses);
    
    setCalculationState({ 
      isCalculating: true, 
      result: result  // Set the result immediately
    });
    
    // Scroll with header offset
    if (formContainerRef.current) {
      const elementPosition = formContainerRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + HEADER_OFFSET;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    setTimeout(() => {
      setCalculationState({
        isCalculating: false,
        result: result  // Keep the same result after calculation
      });
    }, ANIMATION_DURATION);
  };

  const handleReset = () => {
    setCalculationState({ isCalculating: false, result: null });
    setFormResponses(initializeFormResponses());
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
    <div className="energy-calculator-form-container" ref={formContainerRef}>
      <FormHeader />
      <div className="energy-calculator-content-wrapper">
        <CSSTransition
          in={!calculationState.result}
          timeout={ANIMATION_DURATION}
          classNames="energy-calculator-form-fade"
          unmountOnExit
          nodeRef={formTransitionRef}
        >
          <form 
            ref={formTransitionRef}
            onSubmit={handleSubmit} 
            className={`energy-calculator-form ${calculationState.isCalculating ? 'energy-calculator-calculating' : ''}`}
          >
            <TransitionGroup component={null}>
              {formData.map((item, index) => (
                shouldShowQuestion(item, index) && (
                  <CSSTransition
                    key={index}
                    timeout={ANIMATION_DURATION}
                    classNames="energy-calculator-form-field"
                    unmountOnExit
                    nodeRef={fieldRefs[index]}
                  >
                    <div ref={fieldRefs[index]} className="energy-calculator-form-group">
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
        </CSSTransition>

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