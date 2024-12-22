import formData from '../data/formquestions.json';

export const calculateEnergyLabel = (formResponses) => {
  let totalScore = 0;
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

  // Calculate bonus points for efficient combinations
  const calculateBonus = () => {
    let bonus = 0;

    // Get key responses
    const heating = getQuestionResponse("Welk type verwarming heeft u?");
    const ventilation = getQuestionResponse("Welk type ventilatiesysteem heeft u?");
    const solarPanels = getQuestionResponse("Heeft u zonnepanelen?");
    const glass = getQuestionResponse("Welk type glas heeft u?");
    const buildingYear = getQuestionResponse("In welk jaar is uw woning gebouwd?");

    // Bonus for complete insulation package
    const hasGoodInsulation = ['dak', 'gevel', 'vloer'].every(type => {
      const response = getQuestionResponse(`Hoe goed is de isolatie van uw ${type}?`);
      return response?.includes('Goede isolatie');
    });
    if (hasGoodInsulation) {
      bonus += 100;
      if (buildingYear === "Vóór 1945" || buildingYear === "1945-1975") {
        bonus += 50; // Extra bonus for well-insulated older buildings
      }
    }

    // Sustainable heating and ventilation combination
    if (heating?.includes('Warmtepomp') && ventilation?.includes('WTW')) {
      bonus += 150;
    }

    // Solar panels with heat pump
    if (heating?.includes('Warmtepomp') && solarPanels && solarPanels !== "Nee") {
      bonus += 100;
    }

    // Modern glass in older buildings
    if ((buildingYear === "Vóór 1945" || buildingYear === "1945-1975") && 
        (glass?.includes('HR++') || glass?.includes('HR+++'))) {
      bonus += 75;
    }

    // Complete energy efficiency package
    const hasCompletePackage = heating?.includes('Warmtepomp') && 
                              ventilation?.includes('WTW') &&
                              hasGoodInsulation &&
                              solarPanels !== "Nee";
    if (hasCompletePackage) {
      bonus += 200;
    }

    return bonus;
  };

  // Calculate base scores from questions
  formData.questions.forEach((question, index) => {
    const response = formResponses[`question_${index}`];
    if (!response) return;

    let questionScore = 0;

    if (question.inputType === 'number' && question.scoring?.ranges) {
      questionScore = calculateRangeScore(response, question.scoring.ranges);
    }
    else if (question.inputType === 'checkbox') {
      if (Array.isArray(response)) {
        questionScore = response.reduce((sum, answer) => 
          sum + getAnswerValue(question, answer), 0);
      }
    }
    else {
      questionScore = getAnswerValue(question, response);
    }

    totalScore += questionScore;
    if (questionScore > 0) {
      details.push(`${question.question}: ${questionScore} punten`);
    }
  });

  // Add bonus points
  const bonus = calculateBonus();
  totalScore += bonus;
  if (bonus > 0) {
    details.push(`Bonus voor energiezuinige combinaties: ${bonus} punten`);
  }

  // Ensure totalScore is a number
  totalScore = Number(totalScore);

  // Determine energy label based on total score
  let label;
  if (totalScore >= 1200) label = 'A++++';
  else if (totalScore >= 1000) label = 'A+++';
  else if (totalScore >= 900) label = 'A++';
  else if (totalScore >= 800) label = 'A+';
  else if (totalScore >= 700) label = 'A';
  else if (totalScore >= 600) label = 'B';
  else if (totalScore >= 500) label = 'C';
  else if (totalScore >= 400) label = 'D';
  else if (totalScore >= 300) label = 'E';
  else if (totalScore >= 200) label = 'F';
  else label = 'G';

  return {
    label,
    score: totalScore,
    details: details.join('\n')
  };
};