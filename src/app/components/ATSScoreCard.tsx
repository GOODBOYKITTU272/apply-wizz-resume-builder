import React from "react";
import type { ATSScore } from "lib/ats-score";
import { getScoreColor, getScoreLabel } from "lib/ats-score";

interface ATSScoreCardProps {
  score: ATSScore;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ score }) => {
  const { overall, breakdown, feedback, recommendations } = score;

  const CircularProgress: React.FC<{ value: number; size?: number }> = ({ 
    value, 
    size = 120 
  }) => {
    const radius = (size - 20) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={getScoreColor(value)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(value)}`}>
            {overall}
          </span>
          <span className="text-sm text-gray-500">/ 100</span>
        </div>
      </div>
    );
  };

  const ProgressBar: React.FC<{ label: string; value: number; icon: string }> = ({ 
    label, 
    value, 
    icon 
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${getScoreColor(value)}`}>
          {value}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            value >= 80 
              ? "bg-green-500" 
              : value >= 60 
              ? "bg-yellow-500" 
              : "bg-red-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Overall Score */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-gray-900">
          🎯 Apply Wizz ATS Score
        </h3>
        <CircularProgress value={overall} />
        <div className="space-y-1">
          <p className={`text-lg font-semibold ${getScoreColor(overall)}`}>
            {getScoreLabel(overall)}
          </p>
          <p className="text-sm text-gray-600">
            {overall >= 80 
              ? "Your resume is highly ATS-friendly!" 
              : overall >= 60 
              ? "Good foundation, with room for improvement" 
              : "Significant optimization needed"}
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Score Breakdown</h4>
        <div className="space-y-4">
          <ProgressBar 
            label="Contact Information" 
            value={breakdown.contactInfo} 
            icon="📞" 
          />
          <ProgressBar 
            label="Work Experience" 
            value={breakdown.workExperience} 
            icon="💼" 
          />
          <ProgressBar 
            label="Education" 
            value={breakdown.education} 
            icon="🎓" 
          />
          <ProgressBar 
            label="Skills" 
            value={breakdown.skills} 
            icon="⚡" 
          />
          <ProgressBar 
            label="Formatting" 
            value={breakdown.formatting} 
            icon="📄" 
          />
        </div>
      </div>

      {/* Feedback Sections */}
      {feedback.strengths.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2">
            ✅ Strengths
          </h4>
          <ul className="space-y-1">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.improvements.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
            ⚠️ Areas for Improvement
          </h4>
          <ul className="space-y-1">
            {feedback.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.critical.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2">
            🚨 Critical Issues
          </h4>
          <ul className="space-y-1">
            {feedback.critical.map((critical, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                {critical}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            💡 Apply Wizz Recommendations
          </h4>
          <ul className="space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-blue-50 rounded-lg p-4 text-center space-y-3">
        <h4 className="font-semibold text-blue-900">
          Want to optimize your resume with Apply Wizz?
        </h4>
        <p className="text-sm text-blue-800">
          Our AI-powered optimization service can help you achieve a 90+ ATS score 
          and increase your chances of landing interviews at top companies.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href="https://apply-wizz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            🚀 Get Professional Help
          </a>
          <a
            href="/analysis"
            className="inline-flex items-center gap-2 bg-gray-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
          >
            📊 View Detailed Analysis
          </a>
          <a
            href="/resume-compare"
            className="inline-flex items-center gap-2 bg-purple-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-600 transition-colors duration-200"
          >
            🔄 Compare Resumes
          </a>
          <a
            href="/resume-builder"
            className="inline-flex items-center gap-2 border-2 border-blue-500 text-blue-600 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
          >
            📝 Use Resume Builder
          </a>
        </div>
      </div>
    </div>
  );
};