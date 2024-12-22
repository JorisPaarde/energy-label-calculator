import React, { useState } from 'react';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';
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

  const getLabelColor = (label) => {
    const colors = {
      'A++++': '#1B5E20',
      'A+++': '#2E7D32',
      'A++': '#388E3C',
      'A+': '#43A047',
      'A': '#4CAF50',
      'B': '#7CB342',
      'C': '#9CCC65',
      'D': '#FDD835',
      'E': '#FFB300',
      'F': '#FB8C00',
      'G': '#E64A19'
    };
    return colors[label] || '#000000';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>Random Energy Label Tests</h2>
        <button 
          onClick={runTests}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Run Random Tests
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {results.map((result, index) => (
          <div 
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>{result.name}</h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                backgroundColor: getLabelColor(result.result?.label),
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {result.result?.label || 'N/A'}
              </div>
              <div style={{ fontSize: '16px' }}>
                Score: {result.result?.score || 'N/A'}
              </div>
            </div>

            <button
              onClick={() => toggleDetails(index)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ccc',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {expanded[index] ? 'Hide Details' : 'Show Details'}
            </button>

            {expanded[index] && (
              <div style={{ 
                marginTop: '10px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Details:</strong>
                  <pre style={{ margin: '5px 0', fontSize: '12px' }}>
                    {result.result?.details}
                  </pre>
                </div>
                <div>
                  <strong>Inputs:</strong>
                  <pre style={{ margin: '5px 0', fontSize: '12px' }}>
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