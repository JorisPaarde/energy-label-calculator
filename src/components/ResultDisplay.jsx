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
        height: '300px',
        perspective: '1000px'
      }}>
        <div className="energy-label-bars" style={{ 
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          height: '100%',
          width: '100%',
          maxWidth: '800px',
          justifyContent: 'center',
          padding: '0 1rem',
          transform: 'rotateX(10deg)',
          transformStyle: 'preserve-3d'
        }}>
          {ENERGY_LABELS.map((label, index) => {
            const baseHeight = 20;
            const increment = 8;
            const height = baseHeight + (index * increment);
            const isColored = index <= animatedIndex;
            const barColor = getBarColor(label, result?.label);
            const isActive = result?.label === label;
            
            return (
              <div 
                key={label}
                className={`energy-label-bar ${isActive ? 'active' : ''}`}
                style={{ 
                  backgroundColor: barColor,
                  height: `${height}%`,
                  flex: '1',
                  minWidth: '20px',
                  maxWidth: '45px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isActive ? 'scale(1, 1.05) translateZ(20px)' : 'translateZ(0)',
                  transformOrigin: 'bottom center',
                  borderRadius: '12px 12px 8px 8px',
                  boxShadow: isActive 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.05)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
                    borderRadius: '12px 12px 0 0',
                    opacity: isColored ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                <div className="energy-label-text-container" style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(4px)',
                  textShadow: isColored ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                }}>
                  {label.includes('+') ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <span className="energy-label-text" style={{
                        color: isColored ? '#FFFFFF' : '#000000',
                        fontWeight: isColored ? '600' : '400',
                        transition: 'all 0.3s ease',
                      }}>A</span>
                      {Array.from(label.match(/\+/g)).map((plus, i) => (
                        <span 
                          key={i}
                          className="energy-label-text" 
                          style={{
                            color: isColored ? '#FFFFFF' : '#000000',
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
                      color: isColored ? '#FFFFFF' : '#000000',
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