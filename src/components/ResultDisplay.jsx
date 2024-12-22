import React, { useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import '@styles/main.scss';

const ENERGY_LABELS = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++', 'A++++'];

const LABEL_COLORS = {
  'G': 'var(--energy-red)',
  'F': 'var(--energy-orange)',
  'E': 'var(--energy-yellow)',
  'D': 'var(--energy-lime)',
  'C': 'var(--energy-green-light)',
  'B': 'var(--energy-green)',
  'A': 'var(--energy-green-dark)',
  'A+': 'var(--energy-green-dark)',
  'A++': 'var(--energy-emerald)',
  'A+++': 'var(--energy-teal)',
  'A++++': 'var(--energy-cyan)'
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
        <div className="energy-label-bars">
          {ENERGY_LABELS.map((label) => (
            <div 
              key={label}
              className={`energy-label-bar ${result?.label === label ? 'active' : ''}`}
              style={{ 
                backgroundColor: getBarColor(label, result?.label),
                width: `${100 / ENERGY_LABELS.length}%`,
                transform: result?.label === label ? 'scale(1.1)' : 'none'
              }}
            >
              <span className="energy-label-text">{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onReset} className="energy-calculator-reset-button">
          Opnieuw Berekenen
        </button>
      </div>
    </CSSTransition>
  );
};

export default ResultDisplay; 