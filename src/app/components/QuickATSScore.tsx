import React from "react";
import Link from "next/link";
import type { ATSScore } from "lib/ats-score";
import { getScoreColor, getScoreLabel } from "lib/ats-score";

interface QuickATSScoreProps {
  score: ATSScore;
  className?: string;
  onClick?: () => void;
}

export const QuickATSScore: React.FC<QuickATSScoreProps> = ({ 
  score, 
  className = "",
  onClick 
}) => {
  const { overall } = score;

  return (
    <div 
      className={`inline-flex items-center gap-3 bg-white rounded-lg shadow-md px-4 py-3 border hover:shadow-lg transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center">
            <div 
              className={`w-8 h-8 rounded-full border-2 ${
                overall >= 80 
                  ? "border-green-500 bg-green-50" 
                  : overall >= 60 
                  ? "border-yellow-500 bg-yellow-50" 
                  : "border-red-500 bg-red-50"
              } flex items-center justify-center`}
            >
              <span className={`text-xs font-bold ${getScoreColor(overall)}`}>
                {overall}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            ATS Score
          </span>
          <span className={`text-xs font-medium ${getScoreColor(overall)}`}>
            {getScoreLabel(overall)}
          </span>
        </div>
      </div>
      
      <div className="h-8 w-px bg-gray-200" />
      
      <Link 
        href="/analysis" 
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer group"
      >
        <span className="group-hover:scale-110 transition-transform duration-200">📊</span>
        <span className="font-medium">Apply Wizz Analysis</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
      </Link>
    </div>
  );
};

interface ATSScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ATSScoreBadge: React.FC<ATSScoreBadgeProps> = ({ 
  score, 
  size = "md",
  showLabel = true 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base"
  };

  const getBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500 text-white";
    if (score >= 80) return "bg-green-400 text-white";
    if (score >= 70) return "bg-yellow-500 text-white";
    if (score >= 60) return "bg-yellow-400 text-gray-900";
    return "bg-red-500 text-white";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        ${sizeClasses[size]} 
        ${getBadgeColor(score)}
        rounded-full 
        flex items-center justify-center 
        font-bold 
        shadow-lg
        border-2 border-white
      `}>
        {score}
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
};