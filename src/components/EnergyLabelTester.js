import React, { useState } from 'react';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
import { getLabelColor } from '../utils/colorUtils';
import formData from '../data/formquestions.json';

const generateRandomAnswers = () => {
  const answers = {};
  formData.questions.forEach((question, index) => {
    const questionId = `question_${index}`;
    
    if (question.inputType === 'select') {
      // Get random answer from available options
      const options = Object.keys(question.answers);
      answers[questionId] = options[Math.floor(Math.random() * options.length)];
    } else if (question.inputType === 'number') {
      // Generate random number within the ranges
      const ranges = question.scoring.ranges;
      const minRange = ranges[0].min || 0;
      const maxRange = ranges[ranges.length - 1].max || 300;
      answers[questionId] = Math.floor(Math.random() * (maxRange - minRange) + minRange).toString();
    }
  });

  // Handle apartment type dependency
  if (answers.question_1 === 'Appartement') {
    const apartmentTypes = Object.keys(formData.questions[2].answers);
    answers.question_2 = apartmentTypes[Math.floor(Math.random() * apartmentTypes.length)];
  }

  return answers;
};

const EnergyLabelTester = () => {
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});

  const runTests = () => {
    // Generate 5 random test scenarios
    const newResults = Array.from({ length: 5 }, (_, i) => {
      const answers = generateRandomAnswers();
      return {
        name: `Random Test ${i + 1}`,
        answers,
        result: calculateEnergyLabel(answers)
      };
    });
    setResults(newResults);
  };

  const toggleDetails = (index) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };



  return (
    <div className="energy-label-tester">
      <div className="energy-label-tester__header">
        <h2 className="energy-label-tester__title">Random Energy Label Tests</h2>
        <button
          onClick={runTests}
          className="energy-calculator-submit-button"
        >
          Run Random Tests
        </button>
      </div>

      <div className="energy-label-tester__grid">
        {results.map((result, index) => (
          <div
            key={index}
            className="energy-label-tester__card"
          >
            <h3 className="energy-label-tester__card-title">{result.name}</h3>
            <div className="energy-label-tester__result-section">
              <div
                className="energy-label-tester__label-badge"
                style={{ backgroundColor: getLabelColor(result.result?.label) }}
              >
                {result.result?.label || 'N/A'}
              </div>
              <div className="energy-label-tester__score">
                Score: {result.result?.score || 'N/A'}
              </div>
            </div>

            <button
              onClick={() => toggleDetails(index)}
              className="energy-label-tester__toggle-button"
            >
              {expanded[index] ? 'Hide Details' : 'Show Details'}
            </button>

            {expanded[index] && (
              <div className="energy-label-tester__details">
                <div className="energy-label-tester__details-title">
                  <strong>Details:</strong>
                  <pre className="energy-label-tester__details-pre">
                    {result.result?.details}
                  </pre>
                </div>
                <div>
                  <strong>Inputs:</strong>
                  <pre className="energy-label-tester__details-pre">
                    {JSON.stringify(result.answers, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyLabelTester; 