"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { calculateATSScore } from "lib/ats-score";
import type { ATSScore } from "lib/ats-score";
import { ApplyWizzLogo } from "components/ApplyWizzLogo";

// Sample data type definitions
interface SampleResume {
  profile: {
    name: string;
    email: string;
    phone: string;
    location: string;
    url: string;
  };
  workExperiences: Array<{
    company: string;
    jobTitle: string;
    date: string;
    descriptions: string[];
  }>;
  educations: Array<{
    school: string;
    degree: string;
    date: string;
    gpa?: string;
  }>;
  skills: {
    featuredSkills: Array<{
      skill: string;
      rating: number;
    }>;
    descriptions: string[];
  };
  projects: any[];
  customs: any[];
}

// Sample data - in a real app, this would come from props or API
const getSampleResume = (): SampleResume => ({
  profile: {
    name: "Leo Leopard",
    email: "leo@email.com",
    phone: "123-456-7890",
    location: "La Verne, CA",
    url: ""
  },
  workExperiences: [
    {
      company: "ABC Company",
      jobTitle: "Software Engineer",
      date: "2020 - 2023",
      descriptions: [
        "Developed web applications using React and Node.js",
        "Collaborated with cross-functional teams",
        "Improved application performance by 25%"
      ]
    },
    {
      company: "XYZ Corp",
      jobTitle: "Junior Developer",
      date: "2018 - 2020",
      descriptions: [
        "Built responsive user interfaces",
        "Participated in agile development process"
      ]
    }
  ],
  educations: [
    {
      school: "University of La Verne",
      degree: "Bachelor of Science in Computer Science",
      date: "2018",
      gpa: "3.8"
    }
  ],
  skills: {
    featuredSkills: [
      { skill: "JavaScript", rating: 5 },
      { skill: "React", rating: 4 },
      { skill: "Node.js", rating: 4 },
      { skill: "Python", rating: 3 }
    ],
    descriptions: [
      "Full-stack development with modern frameworks",
      "Database design and optimization",
      "API development and integration"
    ]
  },
  projects: [],
  customs: []
});

// Chart Components
const CircularChart: React.FC<{ value: number; label: string; color: string }> = ({ 
  value, 
  label, 
  color 
}) => {
  const radius = 45;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );
};

const BarChart: React.FC<{ 
  data: Array<{ label: string; value: number; color: string }> 
}> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-32 text-sm font-medium text-gray-700 text-right">
            {item.label}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
            <div
              className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-1000 ease-out"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              }}
            >
              {item.value}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TrendChart: React.FC<{ data: Array<{ month: string; score: number }> }> = ({ data }) => {
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const range = maxScore - minScore;

  return (
    <div className="relative h-64 p-4">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
        <span>{maxScore}</span>
        <span>{Math.round((maxScore + minScore) / 2)}</span>
        <span>{minScore}</span>
      </div>
      
      {/* Chart area */}
      <div className="ml-8 h-full relative">
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${100 - y}%`}
              x2="100%"
              y2={`${100 - y}%`}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Trend line */}
          <polyline
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * 100},${100 - ((d.score - minScore) / range) * 100}`
            ).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={`${(i / (data.length - 1)) * 100}%`}
              cy={`${100 - ((d.score - minScore) / range) * 100}%`}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all cursor-pointer"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((d, i) => (
            <span key={i}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const [resume] = useState<SampleResume>(getSampleResume());
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for smooth UX
    const timer = setTimeout(() => {
      const score = calculateATSScore(resume as any);
      setAtsScore(score);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resume]);

  if (loading || !atsScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApplyWizzLogo size="lg" className="mb-4" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your resume data...</p>
        </div>
      </div>
    );
  }

  const categoryData = [
    { label: "Contact Information", value: atsScore.breakdown.contactInfo, color: "#10b981" },
    { label: "Work Experience", value: atsScore.breakdown.workExperience, color: "#3b82f6" },
    { label: "Education", value: atsScore.breakdown.education, color: "#8b5cf6" },
    { label: "Skills", value: atsScore.breakdown.skills, color: "#f59e0b" },
    { label: "Formatting", value: atsScore.breakdown.formatting, color: "#ef4444" }
  ];

  const industryBenchmark = {
    tech: 82,
    finance: 79,
    healthcare: 76,
    marketing: 74,
    average: 78
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <ApplyWizzLogo size="lg" className="mb-4 justify-center" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Resume Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive insights into your resume's ATS performance
          </p>
        </div>

        {/* Category Breakdown - Full Width */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Score Breakdown</h3>
          <BarChart data={categoryData} />
        </div>

        {/* Industry Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Industry Benchmarks</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(industryBenchmark).map(([industry, score]) => (
              <div key={industry} className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-2xl font-bold text-blue-600 mb-1">{score}%</div>
                <div className="text-sm font-medium text-gray-700 capitalize">{industry}</div>
                <div className={`text-xs mt-1 ${
                  atsScore.overall >= score ? "text-green-600" : "text-red-600"
                }`}>
                  {atsScore.overall >= score ? "Above" : "Below"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Recommendations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span>✅</span> Strengths
              </h4>
              <ul className="space-y-2">
                {atsScore.feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                <span>⚠️</span> Improvements
              </h4>
              <ul className="space-y-2">
                {atsScore.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <span>🚨</span> Critical Issues
              </h4>
              <ul className="space-y-2">
                {atsScore.feedback.critical.length > 0 ? (
                  atsScore.feedback.critical.map((critical, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {critical}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    No critical issues found! 🎉
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-white text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Optimize Your Resume?</h3>
          <p className="text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-2">
            Get personalized recommendations from Apply Wizz experts to achieve a 90+ ATS score 
            and increase your chances of landing interviews at top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://apply-wizz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
            >
              🚀 Get Professional Help
            </a>
            <a
              href="/resume-compare"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base"
            >
              🔄 Compare Resume Versions
            </a>
            <a
              href="/resume-builder"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base"
            >
              📝 Use Resume Builder
            </a>
            <a
              href="/resume-parser"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base"
            >
              🔍 Back to Scanner
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}