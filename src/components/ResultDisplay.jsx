import React, { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '@styles/main.scss';

const ENERGY_LABELS = ['F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++', 'A++++'];
const ANIMATION_DELAY_PER_BAR = 100; // ms between each bar animation

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
  const [animatedIndex, setAnimatedIndex] = useState(-1);
  
  useEffect(() => {
    if (result) {
      console.log('Energy Label Result:', result);
      // Reset animation state when result changes
      setAnimatedIndex(-1);
      // Start animation sequence
      const currentIndex = ENERGY_LABELS.indexOf(result.label);
      for (let i = 0; i <= currentIndex; i++) {
        setTimeout(() => {
          setAnimatedIndex(i);
        }, i * ANIMATION_DELAY_PER_BAR);
      }
    }
  }, [result]);

  const getBarColor = (label, currentLabel) => {
    if (!currentLabel) return 'var(--grey-300)';
    
    const currentIndex = ENERGY_LABELS.indexOf(currentLabel);
    const labelIndex = ENERGY_LABELS.indexOf(label);
    
    // Only show color if it's been animated
    if (labelIndex > animatedIndex) return 'var(--grey-300)';
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
            maxWidth: '800px',
            justifyContent: 'center'
          }}>
            {ENERGY_LABELS.map((label, index) => {
              const baseHeight = 20;
              const increment = 8;
              const height = baseHeight + (index * increment);
              const isColored = index <= animatedIndex;
              const barColor = getBarColor(label, result?.label);
              
              return (
                <div 
                  key={label}
                  className={`energy-label-bar ${result?.label === label ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: barColor,
                    height: `${height}%`,
                    width: '50px',
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
                  <div className="energy-label-text-container" style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: isColored ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                    transition: 'all 0.3s ease',
                  }}>
                    {label.includes('+') ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <span className="energy-label-text" style={{
                          color: isColored ? barColor : 'var(--grey-600)',
                          fontWeight: isColored ? '600' : '400',
                          transition: 'all 0.3s ease',
                        }}>A</span>
                        {Array.from(label.match(/\+/g)).map((plus, i) => (
                          <span 
                            key={i}
                            className="energy-label-text" 
                            style={{
                              color: isColored ? barColor : 'var(--grey-600)',
                              fontWeight: isColored ? '600' : '400',
                              transition: 'all 0.3s ease',
                              fontSize: '0.9em',
                              lineHeight: '0.8'
                            }}
                          >
                            +
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="energy-label-text" style={{
                        color: isColored ? barColor : 'var(--grey-600)',
                        fontWeight: isColored ? '600' : '400',
                        transition: 'all 0.3s ease',
                      }}>{label}</span>
                    )}
                  </div>
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