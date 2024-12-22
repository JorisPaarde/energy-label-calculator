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
        // Apply non-linear scaling for very large homes
        if (range.max && range.max > 200) {
          const scale = 1 - (Math.log(numValue) / Math.log(range.max)) * 0.2;
          return range.value * scale;
        }
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

  // Calculate base score with reduced impact
  const calculateBaseScore = () => {
    let baseScore = 0;
    const buildingYear = getQuestionResponse("In welk jaar is uw woning gebouwd?");
    const houseType = getQuestionResponse("Wat voor soort woning heeft u?");
    const apartmentType = getQuestionResponse("Welk type appartement heeft u?");
    const size = getQuestionResponse("Wat is de gebruiksoppervlakte van uw woning?");

    // Get building year score with more granular periods
    const yearQuestion = formData.questions.find(q => q.question === "In welk jaar is uw woning gebouwd?");
    const yearScore = getAnswerValue(yearQuestion, buildingYear);
    baseScore += yearScore * 0.7; // Reduce base year impact

    // Get house type score
    const typeQuestion = formData.questions.find(q => q.question === "Wat voor soort woning heeft u?");
    baseScore += getAnswerValue(typeQuestion, houseType);

    if (houseType === "Appartement" && apartmentType) {
      const apartmentQuestion = formData.questions.find(q => q.question === "Welk type appartement heeft u?");
      baseScore += getAnswerValue(apartmentQuestion, apartmentType);
    }

    // Apply non-linear size factor
    const sizeQuestion = formData.questions.find(q => q.question === "Wat is de gebruiksoppervlakte van uw woning?");
    const sizeFactor = calculateRangeScore(size, sizeQuestion.scoring.ranges);
    baseScore *= sizeFactor;

    // Reduce overall base score impact
    baseScore *= 0.8;

    details.push(`Basisscore: ${Math.round(baseScore)} punten`);
    return baseScore;
  };

  // Calculate insulation score
  const calculateInsulationScore = () => {
    let insulationScore = 0;
    const buildingYear = getQuestionResponse("In welk jaar is uw woning gebouwd?");
    const yearQuestion = formData.questions.find(q => q.question === "In welk jaar is uw woning gebouwd?");
    const yearFactor = yearQuestion.metadata.insulation_factor[buildingYear];

    // Sum up insulation scores with weighted components
    const insulationQuestions = formData.questions.filter(q => q.metadata?.type === "insulation_score");
    let roofScore = 0, wallScore = 0, floorScore = 0, otherScore = 0;
    
    insulationQuestions.forEach(question => {
      const response = getQuestionResponse(question.question);
      if (!response) return;
      
      const score = getAnswerValue(question, response);
      if (question.question.toLowerCase().includes('dak')) {
        roofScore = score;
      } else if (question.question.toLowerCase().includes('muur') || question.question.toLowerCase().includes('gevel')) {
        wallScore = score;
      } else if (question.question.toLowerCase().includes('vloer')) {
        floorScore = score;
      } else {
        otherScore += score;
      }
    });

    // Apply weighted averaging for main insulation components
    insulationScore = (roofScore * 0.4) + (wallScore * 0.4) + (floorScore * 0.2) + otherScore;

    // Apply building year factor and increased weight
    insulationScore *= yearFactor;
    insulationScore *= 1.8; // Increased insulation weight factor

    details.push(`Isolatiescore: ${Math.round(insulationScore)} punten`);
    return insulationScore;
  };

  // Calculate installation score with insulation dependency
  const calculateInstallationScore = () => {
    let installationScore = 0;
    const heating = getQuestionResponse("Welk type verwarming heeft u?");
    const ventilation = getQuestionResponse("Welk type ventilatiesysteem heeft u?");

    // Calculate insulation quality factor (0.5 - 1.5)
    const insulationQuality = calculateInsulationScore() / 200; // Normalize to 0-1 range
    const insulationFactor = 0.5 + insulationQuality;

    // Sum up installation scores
    const installationQuestions = formData.questions.filter(q => q.metadata?.type === "installation_score");
    installationQuestions.forEach(question => {
      const response = getQuestionResponse(question.question);
      if (response) {
        installationScore += getAnswerValue(question, response);
      }
    });

    // Apply bonus multipliers with increased values and insulation dependency
    if (heating === "Warmtepomp" && ventilation === "Gebalanceerde ventilatie met WTW") {
      installationScore *= 1.4 * insulationFactor;
      details.push(`Bonus: Warmtepomp + WTW ventilatie (${Math.round(40 * insulationFactor)}%)`);
    } else if (heating === "Warmtepomp" && ventilation === "Gebalanceerde ventilatie") {
      installationScore *= 1.25 * insulationFactor;
      details.push(`Bonus: Warmtepomp + gebalanceerde ventilatie (${Math.round(25 * insulationFactor)}%)`);
    } else if (heating === "Hybride warmtepomp") {
      installationScore *= 1.15 * insulationFactor;
      details.push(`Bonus: Hybride warmtepomp (${Math.round(15 * insulationFactor)}%)`);
    }

    // Apply increased installation weight factor
    installationScore *= 1.6;

    details.push(`Installatiescore: ${Math.round(installationScore)} punten`);
    return installationScore;
  };

  // Calculate renewable score with installation integration
  const calculateRenewableScore = () => {
    let renewableScore = 0;
    const solarPanels = getQuestionResponse("Heeft u zonnepanelen?");
    const waterHeating = getQuestionResponse("Welk type warmwatervoorziening heeft u?");
    const heating = getQuestionResponse("Welk type verwarming heeft u?");

    // Add solar panel score
    const solarQuestion = formData.questions.find(q => q.metadata?.type === "renewable_score");
    renewableScore += getAnswerValue(solarQuestion, solarPanels);

    // Add solar water heater bonus with heating system synergy
    if (waterHeating === "Zonneboiler") {
      let solarBoilerBonus = 30;
      if (heating === "Warmtepomp" || heating === "Hybride warmtepomp") {
        solarBoilerBonus *= 1.2;
        details.push("Extra bonus: Zonneboiler + Warmtepomp synergie (20%)");
      }
      renewableScore += solarBoilerBonus;
      details.push(`Bonus: Zonneboiler (${solarBoilerBonus} punten)`);
    }

    // Apply renewable energy weight factor
    renewableScore *= 1.2;

    details.push(`Duurzame energiescore: ${Math.round(renewableScore)} punten`);
    return renewableScore;
  };

  // Calculate total score
  const baseScore = calculateBaseScore();
  const insulationScore = calculateInsulationScore();
  const installationScore = calculateInstallationScore();
  const renewableScore = calculateRenewableScore();

  const totalScore = Math.round(baseScore + insulationScore + installationScore + renewableScore);

  // Determine energy label based on total score with adjusted thresholds
  let label;
  if (totalScore >= 1400) label = 'A++++';
  else if (totalScore >= 1200) label = 'A+++';
  else if (totalScore >= 1000) label = 'A++';
  else if (totalScore >= 800) label = 'A+';
  else if (totalScore >= 600) label = 'A';
  else if (totalScore >= 500) label = 'B';
  else if (totalScore >= 400) label = 'C';
  else if (totalScore >= 300) label = 'D';
  else if (totalScore >= 200) label = 'E';
  else if (totalScore >= 100) label = 'F';
  else label = 'G';

  return {
    label,
    score: totalScore,
    details: details.join('\n')
  };
};