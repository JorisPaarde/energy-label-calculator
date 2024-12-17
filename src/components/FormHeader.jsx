import React from 'react';

const FormHeader = () => {
  return (
    <div className="energy-calculator-header">
      <h1 className="energy-calculator-title">Energielabel calculator</h1>
      
      <div className="energy-calculator-benefits">
        <div className="energy-calculator-benefit">
          <span className="energy-calculator-benefit-icon">✓</span>
          <span>Energielabel zelf berekenen</span>
        </div>
        <div className="energy-calculator-benefit">
          <span className="energy-calculator-benefit-icon">✓</span>
          <span>Gratis berekening</span>
        </div>
        <div className="energy-calculator-benefit">
          <span className="energy-calculator-benefit-icon">✓</span>
          <span>Binnen 60 seconden</span>
        </div>
      </div>

      <div className="energy-calculator-info">
        <div className="energy-calculator-info-icon">i</div>
        <p>
          Deze energielabel calculator is gebaseerd op het rekenmodel van de overheid. 
          Weet je met welke energiebesparende maatregelen jouw woning is uitgerust? 
          Dan kun je een inschatting genereren welk energielabel je mogelijk hebt.
        </p>
      </div>
    </div>
  );
};

export default FormHeader; 