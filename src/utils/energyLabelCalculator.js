import formData from '../data/formquestions.json';

export const calculateEnergyLabel = (formResponses) => {
  let details = [];

  // Helper function to get value from answers object
  const getAnswerValue = (question, answer) => {
    if (!question.answers) return 0;
    const value = question.answers[answer];
    return typeof value === 'number' ? value : 0;
  };

  // Helper function to calculate score for number input with ranges
  const calculateRangeScore = (value, ranges) => {
    if (!value) return 0;
    const numValue = Number(value);
    
    for (const range of ranges) {
      if ((!range.min || numValue >= range.min) && (!range.max || numValue < range.max)) {
        return range.value;
      }
    }
    return 0;
  };

  // Get answers for dependency checks
  const getQuestionResponse = (questionText) => {
    const questionIndex = formData.questions.findIndex(q => q.question === questionText);
    return formResponses[`question_${questionIndex}`];
  };

  // Calculate base score
  const calculateBaseScore = () => {
    let baseScore = 0;
    const buildingYear = getQuestionResponse("In welk jaar is uw woning gebouwd?");
    const houseType = getQuestionResponse("Wat voor soort woning heeft u?");
    const apartmentType = getQuestionResponse("Welk type appartement heeft u?");
    const size = getQuestionResponse("Wat is de gebruiksoppervlakte van uw woning?");

    // Get building year score
    const yearQuestion = formData.questions.find(q => q.question === "In welk jaar is uw woning gebouwd?");
    baseScore += getAnswerValue(yearQuestion, buildingYear);

    // Get house type score
    const typeQuestion = formData.questions.find(q => q.question === "Wat voor soort woning heeft u?");
    baseScore += getAnswerValue(typeQuestion, houseType);

    // Add apartment type score if applicable
    if (houseType === "Appartement" && apartmentType) {
      const apartmentQuestion = formData.questions.find(q => q.question === "Welk type appartement heeft u?");
      baseScore += getAnswerValue(apartmentQuestion, apartmentType);
    }

    // Apply size factor
    const sizeQuestion = formData.questions.find(q => q.question === "Wat is de gebruiksoppervlakte van uw woning?");
    const sizeFactor = calculateRangeScore(size, sizeQuestion.scoring.ranges);
    baseScore *= sizeFactor;

    details.push(`Basisscore: ${Math.round(baseScore)} punten`);
    return baseScore;
  };

  // Calculate insulation score
  const calculateInsulationScore = () => {
    let insulationScore = 0;
    const buildingYear = getQuestionResponse("In welk jaar is uw woning gebouwd?");
    const yearQuestion = formData.questions.find(q => q.question === "In welk jaar is uw woning gebouwd?");
    const yearFactor = yearQuestion.metadata.insulation_factor[buildingYear];

    // Sum up insulation scores
    const insulationQuestions = formData.questions.filter(q => q.metadata?.type === "insulation_score");
    insulationQuestions.forEach(question => {
      const response = getQuestionResponse(question.question);
      if (response) {
        insulationScore += getAnswerValue(question, response);
      }
    });

    // Apply building year factor and weight
    insulationScore *= yearFactor;
    insulationScore *= 1.5; // insulation weight factor

    details.push(`Isolatiescore: ${Math.round(insulationScore)} punten`);
    return insulationScore;
  };

  // Calculate installation score
  const calculateInstallationScore = () => {
    let installationScore = 0;
    const heating = getQuestionResponse("Welk type verwarming heeft u?");
    const ventilation = getQuestionResponse("Welk type ventilatiesysteem heeft u?");

    // Sum up installation scores
    const installationQuestions = formData.questions.filter(q => q.metadata?.type === "installation_score");
    installationQuestions.forEach(question => {
      const response = getQuestionResponse(question.question);
      if (response) {
        installationScore += getAnswerValue(question, response);
      }
    });

    // Apply bonus multipliers
    if (heating === "Warmtepomp" && ventilation === "Gebalanceerde ventilatie met WTW") {
      installationScore *= 1.2;
      details.push("Bonus: Warmtepomp + WTW ventilatie (20%)");
    } else if (heating === "Warmtepomp" && ventilation === "Gebalanceerde ventilatie") {
      installationScore *= 1.1;
      details.push("Bonus: Warmtepomp + gebalanceerde ventilatie (10%)");
    }

    // Apply installation weight factor
    installationScore *= 1.3;

    details.push(`Installatiescore: ${Math.round(installationScore)} punten`);
    return installationScore;
  };

  // Calculate renewable score
  const calculateRenewableScore = () => {
    let renewableScore = 0;
    const solarPanels = getQuestionResponse("Heeft u zonnepanelen?");
    const waterHeating = getQuestionResponse("Welk type warmwatervoorziening heeft u?");

    // Add solar panel score
    const solarQuestion = formData.questions.find(q => q.metadata?.type === "renewable_score");
    renewableScore += getAnswerValue(solarQuestion, solarPanels);

    // Add solar water heater bonus
    if (waterHeating === "Zonneboiler") {
      renewableScore += 30;
      details.push("Bonus: Zonneboiler (30 punten)");
    }

    details.push(`Duurzame energiescore: ${Math.round(renewableScore)} punten`);
    return renewableScore;
  };

  // Calculate total score
  const baseScore = calculateBaseScore();
  const insulationScore = calculateInsulationScore();
  const installationScore = calculateInstallationScore();
  const renewableScore = calculateRenewableScore();

  const totalScore = Math.round(baseScore + insulationScore + installationScore + renewableScore);

  // Determine energy label based on total score
  let label;
  if (totalScore > 600) label = 'A++++';
  else if (totalScore >= 550) label = 'A+++';
  else if (totalScore >= 500) label = 'A++';
  else if (totalScore >= 450) label = 'A+';
  else if (totalScore >= 400) label = 'A';
  else if (totalScore >= 350) label = 'B';
  else if (totalScore >= 300) label = 'C';
  else if (totalScore >= 250) label = 'D';
  else if (totalScore >= 200) label = 'E';
  else if (totalScore >= 150) label = 'F';
  else label = 'G';

  return {
    label,
    score: totalScore,
    details: details.join('\n')
  };
};