import React from 'react';
import clsx from 'clsx';

export const ScoreCard = ({ label, score, maxScore = 100, description }) => {
  const percentage = (score / maxScore) * 100;
  const getColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    if (score >= 40) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-700">{label}</h3>
        <span className={clsx(
          'text-2xl font-bold bg-gradient-to-r',
          getColor(score),
          'bg-clip-text text-transparent'
        )}>
          {score}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={clsx(
            'h-2 rounded-full bg-gradient-to-r',
            getColor(score)
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-gray-600">{description}</p>
      )}
    </div>
  );
};

export const OfferStrengthIndicator = ({ offer }) => {
  if (!offer.intelligenceAnalysis) {
    return <div className="p-4 text-gray-500 text-sm">Analysis pending...</div>;
  }

  const { bidStrengthScore, financingReliability, closingProbability, riskFactors } = offer.intelligenceAnalysis;

  return (
    <div className="space-y-4">
      <ScoreCard
        label="Bid Strength Score"
        score={bidStrengthScore}
        description="Overall strength of the offer"
      />
      <ScoreCard
        label="Financing Reliability"
        score={financingReliability * 100}
        description="Confidence in loan approval"
      />
      <ScoreCard
        label="Closing Probability"
        score={closingProbability * 100}
        description="Estimated probability of deal closure"
      />
      {riskFactors && riskFactors.length > 0 && (
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2">Risk Factors</h4>
          <ul className="space-y-1">
            {riskFactors.map((risk, idx) => (
              <li key={idx} className="text-sm text-orange-700">
                • {risk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const PropertyRiskIndicator = ({ disclosure }) => {
  if (!disclosure.intelligenceAnalysis) {
    return <div className="p-4 text-gray-500 text-sm">Analysis pending...</div>;
  }

  const { identifiedRisks, overallRiskLevel } = disclosure.intelligenceAnalysis;

  const riskLevelColors = {
    'low': 'bg-green-50 border-green-200 text-green-900',
    'moderate': 'bg-yellow-50 border-yellow-200 text-yellow-900',
    'high': 'bg-orange-50 border-orange-200 text-orange-900',
    'critical': 'bg-red-50 border-red-200 text-red-900',
  };

  const riskColor = riskLevelColors[overallRiskLevel?.toLowerCase()] || riskLevelColors.moderate;

  return (
    <div className="space-y-4">
      <div className={clsx('p-4 rounded-lg border', riskColor)}>
        <h4 className="font-semibold mb-2">Overall Risk Level: {overallRiskLevel}</h4>
      </div>
      {identifiedRisks && identifiedRisks.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Identified Risks</h4>
          <div className="space-y-2">
            {identifiedRisks.map((risk, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-medium text-sm text-gray-900">{risk.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
