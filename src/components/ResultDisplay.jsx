import React, { useRef, useEffect, useState } from 'react';
import '@styles/main.scss';

const ENERGY_LABELS = ['F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++', 'A++++'];
const ANIMATION_DELAY_PER_BAR = 100; // ms between each bar animation
const TRANSITION_DURATION = 600; // match the CSS transition duration

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
  const [shouldRender, setShouldRender] = useState(false);
  const resultRef = useRef(null);
  
  useEffect(() => {
    if (result) {
      setShouldRender(true);
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
          }, 500 + (i * ANIMATION_DELAY_PER_BAR));
        }
      }, 100);
    }
  }, [result]);

  const handleReset = () => {
    setIsVisible(false);
    setAnimatedIndex(-1);

    // Find the form container and scroll to it
    const formContainer = document.querySelector('.energy-calculator-form-container');
    if (formContainer) {
      formContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Wait for the transition to complete before removing the component
    setTimeout(() => {
      setShouldRender(false);
      onReset();
    }, TRANSITION_DURATION);
  };

  const getBarColor = (label, currentLabel) => {
    if (!currentLabel) return 'var(--grey-300)';
    
    const currentIndex = ENERGY_LABELS.indexOf(currentLabel);
    const labelIndex = ENERGY_LABELS.indexOf(label);
    
    // Only show color if it's been animated
    if (labelIndex > animatedIndex) return 'var(--grey-300)';
    return labelIndex <= currentIndex ? LABEL_COLORS[label] : 'var(--grey-300)';
  };

  if (!shouldRender) return null;

  return (
    <div ref={resultRef} className={`energy-calculator-result ${isVisible ? 'visible' : ''}`}>
      <h2>Uw Energielabel indicatie</h2>
      <div className="result-chart-container">
        <div className="energy-label-bars">
          {ENERGY_LABELS.map((label, index) => {
            const baseHeight = window.innerWidth <= 768 ? 16 : 20;
            const increment = window.innerWidth <= 768 ? 6.4 : 8;
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
                  height: `${height}%`
                }}
              >
                <div className={`bar-gradient ${isColored ? 'colored' : ''}`} />
                <div className="energy-label-text-container">
                  {label.includes('+') ? (
                    <div className="plus-container">
                      <span className={`energy-label-text ${isColored ? 'colored' : ''}`}>A</span>
                      {Array.from(label.match(/\+/g)).map((plus, i) => (
                        <span 
                          key={i}
                          className={`energy-label-text plus ${isColored ? 'colored' : ''}`}
                        >
                          +
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className={`energy-label-text ${isColored ? 'colored' : ''}`}>
                      {label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={handleReset} className="energy-calculator-reset-button">
        Opnieuw Berekenen
      </button>
    </div>
  );
};

export default ResultDisplay; 