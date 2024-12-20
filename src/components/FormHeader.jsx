import React from 'react';

const FormHeader = () => {
  return (
    <div className="energy-calculator-header">
      <h1 className="energy-calculator-title">Energielabel berekenen</h1>
      
      <div className="energy-calculator-benefits">
        <div className="energy-calculator-benefit">
          <span className="energy-calculator-benefit-icon">✓</span>
          <span>Energielabel snel berekenen</span>
        </div>
        <div className="energy-calculator-benefit">
          <span className="energy-calculator-benefit-icon">✓</span>
          <span>Gratis indicatie</span>
        </div>
        <div className="energy-calculator-benefit">
          <span className="energy-calculator-benefit-icon">✓</span>
          <span>Meteen resultaat</span>
        </div>
      </div>

      <div className="energy-calculator-info">
        <div className="energy-calculator-info-icon">i</div>
        <p>
          Deze energielabel tool is gebaseerd op het rekenmodel van de overheid. 
          Wil je een indicatie van wat jouw woning mogelijk als energielabel heeft? 
          Vul dan de onderstaande vragen in en krijg snel een indicatie.
        </p>
      </div>
    </div>
  );
};

export default FormHeader; 