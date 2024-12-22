import React, { useRef, useEffect, useState } from 'react';
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

const ResultDisplay = ({ result, onReset }) => {
  const [animatedIndex, setAnimatedIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const resultRef = useRef(null);
  
  useEffect(() => {
    if (result) {
      // Reset animations
      setIsVisible(false);
      setAnimatedIndex(-1);
      
      // Start animations after a short delay
      setTimeout(() => {
        setIsVisible(true);
        
        // Scroll to result after it becomes visible
        if (resultRef.current) {
          setTimeout(() => {
            resultRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'center'
            });
          }, 100);
        }

        // Start bar animations
        const currentIndex = ENERGY_LABELS.indexOf(result.label);
        for (let i = 0; i <= currentIndex; i++) {
          setTimeout(() => {
            setAnimatedIndex(i);
          }, 500 + (i * ANIMATION_DELAY_PER_BAR)); // Start bar animations after fade-in
        }
      }, 100);
    } else {
      setIsVisible(false);
      setAnimatedIndex(-1);
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

  if (!result) return null;

  return (
    <div ref={resultRef} className={`energy-calculator-result ${isVisible ? 'visible' : ''}`}>
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
      <button onClick={onReset} className="energy-calculator-reset-button" style={{
        marginTop: '2rem'
      }}>
        Opnieuw Berekenen
      </button>
    </div>
  );
};

export default ResultDisplay; 