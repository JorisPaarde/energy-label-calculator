import React, { useState } from 'react';
import { calculateEnergyLabel } from '../utils/energyLabelCalculator';

const testScenarios = [
  {
    name: "Modern Efficient Home",
    answers: {
      question_0: "2005-heden",
      question_1: "Vrijstaande woning",
      question_3: "150",
      question_4: "HR+ /++ /+++ glas",
      question_5: "Goede isolatie",
      question_6: "Goede isolatie",
      question_7: "Goede isolatie",
      question_8: "Warmtepomp",
      question_9: "Zonneboiler",
      question_10: "Gebalanceerde ventilatie met WTW",
      question_11: "Ja, 10 of meer"
    }
  },
  {
    name: "Average 90s Home",
    answers: {
      question_0: "1990-2005",
      question_1: "Tussenwoning",
      question_3: "120",
      question_4: "HR glas",
      question_5: "Matige isolatie",
      question_6: "Matige isolatie",
      question_7: "Matige isolatie",
      question_8: "CV-ketel 2000-2020",
      question_9: "Combiketel",
      question_10: "Mechanische afzuiging",
      question_11: "Nee"
    }
  },
  {
    name: "Old Apartment",
    answers: {
      question_0: "Vóór 1945",
      question_1: "Appartement",
      question_2: "Tussenappartement zonder dak",
      question_3: "75",
      question_4: "Dubbelglas",
      question_6: "Matige isolatie",
      question_7: "Geen isolatie",
      question_8: "CV-ketel voor 2000",
      question_9: "Combiketel",
      question_10: "Natuurlijke ventilatie",
      question_11: "Nee"
    }
  },
  {
    name: "Renovated Old Home",
    answers: {
      question_0: "1945-1975",
      question_1: "Hoekwoning",
      question_3: "140",
      question_4: "HR+ /++ /+++ glas",
      question_5: "Goede isolatie",
      question_6: "Goede isolatie",
      question_7: "Goede isolatie",
      question_8: "Hybride warmtepomp",
      question_9: "Zonneboiler",
      question_10: "Gebalanceerde ventilatie",
      question_11: "Ja, 6 tot 10"
    }
  },
  {
    name: "Basic 80s Home",
    answers: {
      question_0: "1975-1990",
      question_1: "Tussenwoning",
      question_3: "110",
      question_4: "Dubbelglas",
      question_5: "Matige isolatie",
      question_6: "Matige isolatie",
      question_7: "Geen isolatie",
      question_8: "CV-ketel 2000-2020",
      question_9: "Combiketel",
      question_10: "Natuurlijke ventilatie",
      question_11: "Nee"
    }
  }
];

const EnergyLabelTester = () => {
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});

  const runTests = () => {
    const newResults = testScenarios.map(scenario => ({
      ...scenario,
      result: calculateEnergyLabel(scenario.answers)
    }));
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
        <h2>Energy Label Test Scenarios</h2>
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
          Run All Tests
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