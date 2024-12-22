import React, { useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import '@styles/main.scss';

const ENERGY_LABELS = ['F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++', 'A++++'];

const LABEL_COLORS = {
  'F': 'var(--energy-red)',
  'E': 'var(--energy-orange)',
  'D': 'var(--energy-yellow)',
  'C': 'var(--energy-lime)',
  'B': 'var(--energy-green-light)',
  'A': 'var(--energy-green)',
  'A+': 'var(--energy-green-dark)',
  'A++': 'var(--energy-green-dark)',
  'A+++': 'var(--energy-green-dark)',
  'A++++': 'var(--energy-green-dark)'
};

const ResultDisplay = ({ result, onReset, animationDuration }) => {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    if (result) {
      console.log('Energy Label Result:', result);
    }
  }, [result]);

  const getBarColor = (label, currentLabel) => {
    if (!currentLabel) return 'var(--grey-300)';
    
    const currentIndex = ENERGY_LABELS.indexOf(currentLabel);
    const labelIndex = ENERGY_LABELS.indexOf(label);
    
    // Show colors for all labels up to and including current label
    return labelIndex <= currentIndex ? LABEL_COLORS[label] : 'var(--grey-300)';
  };

  return (
    <CSSTransition
      in={result !== null}
      timeout={animationDuration}
      classNames="energy-calculator-result-fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef} className="energy-calculator-result">
        <h2>Berekend Energielabel</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '40px auto',
          width: '100%',
          height: '300px'
        }}>
          <div className="energy-label-bars" style={{ 
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            height: '100%',
            width: '100%',
            maxWidth: '800px'
          }}>
            {ENERGY_LABELS.map((label, index) => {
              const baseHeight = 20;
              const increment = 8;
              const height = baseHeight + (index * increment);
              
              return (
                <div 
                  key={label}
                  className={`energy-label-bar ${result?.label === label ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: getBarColor(label, result?.label),
                    height: `${height}%`,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    transform: result?.label === label ? 'scale(1, 1.02)' : 'none',
                    transformOrigin: 'bottom center',
                    borderRadius: '4px 4px 0 0'
                  }}
                >
                  <span className="energy-label-text" style={{
                    marginTop: '8px',
                    color: getBarColor(label, result?.label)
                  }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="energy-calculator-result-details" style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>Resultaat Details</h3>
          <p>Energielabel: <strong>{result?.label}</strong></p>
          <p>Score: <strong>{result?.score} punten</strong></p>
          {result?.details && (
            <div className="details-breakdown">
              {result.details.split('\n').map((detail, index) => (
                <p key={index}>{detail}</p>
              ))}
            </div>
          )}
        </div>
        {/* <div className="energy-calculator-answers" style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h3>Antwoorden</h3>
          <pre>
            {JSON.stringify(result?.formAnswers || {}, null, 2)}
          </pre>
        </div> */}
        <button onClick={onReset} className="energy-calculator-reset-button" style={{
          marginTop: '2rem'
        }}>
          Opnieuw Berekenen
        </button>
      </div>
    </CSSTransition>
  );
};

export default ResultDisplay; 