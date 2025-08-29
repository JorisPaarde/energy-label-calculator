/**
 * Form utilities for handling form initialization and validation
 */

import defaultFormData from '../data/formquestions.json';

/**
 * Get the default value for a form field based on its type
 */
export const getDefaultValue = (item) => {
  if (item.inputType === 'checkbox') {
    return [];
  }

  if (item.inputType === 'select' || item.inputType === 'radio') {
    if (item.answers) {
      const firstAnswer = Object.keys(item.answers)[0];
      return firstAnswer || '';
    }
    if (item.choices && item.choices.length > 0) {
      return typeof item.choices[0] === 'object'
        ? item.choices[0].value
        : item.choices[0];
    }
  }

  if (item.inputType === 'number') {
    if (item.scoring?.ranges && item.scoring.ranges.length > 0) {
      const firstRange = item.scoring.ranges[0];
      return firstRange.min || 0;
    }
    return item.min || 0;
  }

  return item.defaultValue || '';
};

/**
 * Initialize form responses with default values
 */
export const initializeFormResponses = (formData = defaultFormData.questions) => {
  const initialResponses = {};

  formData.forEach((item, index) => {
    const questionId = `question_${index}`;

    // Skip setting default values for conditional questions that shouldn't be shown initially
    if (item.showIf) {
      initialResponses[questionId] = '';
      return;
    }

    initialResponses[questionId] = getDefaultValue(item);
  });

  return initialResponses;
};

/**
 * Check if a question should be shown based on dependencies
 */
export const shouldShowQuestion = (item, formData, formResponses) => {
  if (!item.showIf) return true;

  const dependentQuestionIndex = formData.findIndex(q => q.question === item.showIf.question);
  if (dependentQuestionIndex === -1) return true;

  const dependentResponse = formResponses[`question_${dependentQuestionIndex}`];

  if (item.showIf.equals) {
    return dependentResponse === item.showIf.equals;
  }

  if (item.showIf.notEquals) {
    const notEqualsArray = Array.isArray(item.showIf.notEquals)
      ? item.showIf.notEquals
      : [item.showIf.notEquals];
    return !notEqualsArray.includes(dependentResponse);
  }

  return true;
};

/**
 * Transform form responses to question-based format
 */
export const transformFormAnswers = (formResponses, formData) => {
  return formData.reduce((acc, item, index) => {
    const questionId = `question_${index}`;
    acc[item.question] = formResponses[questionId];
    return acc;
  }, {});
};
