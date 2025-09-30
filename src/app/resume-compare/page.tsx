"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { readPdf } from "../lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "../lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "../lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "../lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "../lib/parse-resume-from-pdf/extract-resume-from-sections";
import { calculateATSScore } from "../lib/ats-score";
import type { ATSScore } from "../lib/ats-score";
import type { Resume } from "../lib/redux/types";
import { ResumeDropzone } from "components/ResumeDropzone";
import { ApplyWizzLogo } from "components/ApplyWizzLogo";
import ComparisonReport from "components/ComparisonReport";
import DebugPanel from "components/DebugPanel";
import { cx } from "../lib/cx";

// Types for comparison
interface ResumeComparison {
  resume1: Resume;
  resume2: Resume;
  atsScore1: ATSScore;
  atsScore2: ATSScore;
  changes: {
    added: string[];
    removed: string[];
    modified: string[];
    improved: string[];
    declined: string[];
  };
  analysis: {
    overallImprovement: number;
    categoryImprovements: {
      contactInfo: number;
      workExperience: number;
      education: number;
      skills: number;
      formatting: number;
    };
    recommendations: string[];
    strengths: string[];
    concerns: string[];
  };
}

// Resume comparison logic
function compareResumes(resume1: Resume, resume2: Resume): ResumeComparison {
  // Debug logging to understand the resumes being compared
  console.log('=== RESUME COMPARISON DEBUG ===');
  console.log('Resume 1 Summary:', {
    name: resume1.profile?.name,
    workExp: resume1.workExperiences?.length || 0,
    education: resume1.educations?.length || 0,
    skills: resume1.skills?.featuredSkills?.length || 0,
    email: resume1.profile?.email,
    phone: resume1.profile?.phone
  });
  console.log('Resume 2 Summary:', {
    name: resume2.profile?.name,
    workExp: resume2.workExperiences?.length || 0,
    education: resume2.educations?.length || 0,
    skills: resume2.skills?.featuredSkills?.length || 0,
    email: resume2.profile?.email,
    phone: resume2.profile?.phone
  });
  
  const atsScore1 = calculateATSScore(resume1);
  const atsScore2 = calculateATSScore(resume2);
  
  console.log('ATS Score 1:', atsScore1);
  console.log('ATS Score 2:', atsScore2);
  console.log('Scores are identical:', JSON.stringify(atsScore1) === JSON.stringify(atsScore2));
  
  const changes: ResumeComparison['changes'] = {
    added: [],
    removed: [],
    modified: [],
    improved: [],
    declined: []
  };

  const analysis: ResumeComparison['analysis'] = {
    overallImprovement: atsScore2.overall - atsScore1.overall,
    categoryImprovements: {
      contactInfo: atsScore2.breakdown.contactInfo - atsScore1.breakdown.contactInfo,
      workExperience: atsScore2.breakdown.workExperience - atsScore1.breakdown.workExperience,
      education: atsScore2.breakdown.education - atsScore1.breakdown.education,
      skills: atsScore2.breakdown.skills - atsScore1.breakdown.skills,
      formatting: atsScore2.breakdown.formatting - atsScore1.breakdown.formatting,
    },
    recommendations: [],
    strengths: [],
    concerns: []
  };

  // Check for identical resumes and add appropriate messaging
  const resumesAreIdentical = JSON.stringify(resume1) === JSON.stringify(resume2);
  if (resumesAreIdentical) {
    console.warn('⚠️ IDENTICAL RESUMES DETECTED: User uploaded the same resume twice!');
    analysis.concerns.push('You have uploaded the same resume twice. Please upload two different versions to see a meaningful comparison.');
    analysis.recommendations.push('Upload an updated version of your resume to see improvements and changes.');
    analysis.recommendations.push('Try uploading a resume with different work experience, skills, or education details.');
  }

  // Profile changes with null safety
  const profile1 = resume1.profile || {};
  const profile2 = resume2.profile || {};
  
  if (profile1.name !== profile2.name) {
    if (profile2.name && !profile1.name) {
      changes.added.push(`Added name: ${profile2.name}`);
    } else if (!profile2.name && profile1.name) {
      changes.removed.push(`Removed name: ${profile1.name}`);
    } else if (profile1.name && profile2.name) {
      changes.modified.push(`Changed name from "${profile1.name}" to "${profile2.name}"`);
    }
  }

  if (profile1.email !== profile2.email) {
    if (profile2.email && !profile1.email) {
      changes.added.push(`Added email: ${profile2.email}`);
    } else if (!profile2.email && profile1.email) {
      changes.removed.push(`Removed email: ${profile1.email}`);
    } else if (profile1.email && profile2.email) {
      changes.modified.push(`Changed email from "${profile1.email}" to "${profile2.email}"`);
    }
  }

  if (profile1.phone !== profile2.phone) {
    if (profile2.phone && !profile1.phone) {
      changes.added.push(`Added phone: ${profile2.phone}`);
    } else if (!profile2.phone && profile1.phone) {
      changes.removed.push(`Removed phone: ${profile1.phone}`);
    } else if (profile1.phone && profile2.phone) {
      changes.modified.push(`Changed phone from "${profile1.phone}" to "${profile2.phone}"`);
    }
  }

  // Work experience changes
  const exp1Count = resume1.workExperiences?.length || 0;
  const exp2Count = resume2.workExperiences?.length || 0;
  
  if (exp2Count > exp1Count) {
    changes.added.push(`Added ${exp2Count - exp1Count} work experience(s)`);
    changes.improved.push("Expanded work experience section");
  } else if (exp2Count < exp1Count) {
    changes.removed.push(`Removed ${exp1Count - exp2Count} work experience(s)`);
    changes.declined.push("Reduced work experience section");
  }

  // Education changes
  const edu1Count = resume1.educations?.length || 0;
  const edu2Count = resume2.educations?.length || 0;
  
  if (edu2Count > edu1Count) {
    changes.added.push(`Added ${edu2Count - edu1Count} education entry(ies)`);
  } else if (edu2Count < edu1Count) {
    changes.removed.push(`Removed ${edu1Count - edu2Count} education entry(ies)`);
  }

  // Skills changes
  const skills1Count = resume1.skills?.featuredSkills?.length || 0;
  const skills2Count = resume2.skills?.featuredSkills?.length || 0;
  
  if (skills2Count > skills1Count) {
    changes.added.push(`Added ${skills2Count - skills1Count} skill(s)`);
    changes.improved.push("Enhanced skills section");
  } else if (skills2Count < skills1Count) {
    changes.removed.push(`Removed ${skills1Count - skills2Count} skill(s)`);
  }

  // Generate analysis
  if (analysis.overallImprovement > 0) {
    analysis.strengths.push(`Overall ATS score improved by ${analysis.overallImprovement} points`);
  } else if (analysis.overallImprovement < 0) {
    analysis.concerns.push(`Overall ATS score decreased by ${Math.abs(analysis.overallImprovement)} points`);
  }

  // Category-specific analysis
  Object.entries(analysis.categoryImprovements).forEach(([category, improvement]) => {
    if (improvement > 0) {
      analysis.strengths.push(`${category.replace(/([A-Z])/g, ' $1').toLowerCase()} score improved by ${improvement} points`);
    } else if (improvement < 0) {
      analysis.concerns.push(`${category.replace(/([A-Z])/g, ' $1').toLowerCase()} score decreased by ${Math.abs(improvement)} points`);
    }
  });

  // Recommendations
  if (analysis.overallImprovement <= 0) {
    analysis.recommendations.push("Consider adding more quantified achievements to work experience");
    analysis.recommendations.push("Ensure all contact information is complete and professional");
    analysis.recommendations.push("Add relevant technical skills for your target role");
  } else {
    analysis.recommendations.push("Great improvements! Continue refining job descriptions with action verbs");
    analysis.recommendations.push("Consider adding links to portfolio or LinkedIn profile");
    analysis.recommendations.push("Keep optimizing for ATS keywords relevant to your industry");
  }

  return {
    resume1,
    resume2,
    atsScore1,
    atsScore2,
    changes,
    analysis
  };
}

// Component for displaying comparison results
const ComparisonResults: React.FC<{ 
  comparison: ResumeComparison;
  onViewDetailedReport: () => void;
  onOpenReportInNewTab: () => void;
  onDownloadPDF: () => void;
}> = ({ comparison, onViewDetailedReport, onOpenReportInNewTab, onDownloadPDF }) => {
  const { changes, analysis, atsScore1, atsScore2 } = comparison;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-green-600";
    if (improvement < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return "📈";
    if (improvement < 0) return "📉";
    return "➡️";
  };

  return (
    <div className="space-y-6">
      {/* Identical Resume Warning */}
      {analysis.overallImprovement === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Identical Resumes Detected</h3>
              <p className="text-yellow-700 text-sm mb-3">
                It appears you've uploaded the same resume twice. To see meaningful comparison results, 
                please upload two different versions of your resume.
              </p>
              <div className="bg-yellow-100 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Suggestions:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Upload an older version vs your current resume</li>
                  <li>• Compare before and after applying feedback</li>
                  <li>• Test different formatting or content variations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Score Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">📊 ATS Score Comparison</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Resume 1</div>
            <div className={`text-3xl font-bold ${getScoreColor(atsScore1.overall)}`}>
              {atsScore1.overall}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getImprovementColor(analysis.overallImprovement)}`}>
                {getImprovementIcon(analysis.overallImprovement)} {analysis.overallImprovement > 0 ? '+' : ''}{analysis.overallImprovement}
              </div>
              <div className="text-sm text-gray-600">Change</div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Resume 2</div>
            <div className={`text-3xl font-bold ${getScoreColor(atsScore2.overall)}`}>
              {atsScore2.overall}%
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">🎯 Category Improvements</h3>
        <div className="space-y-4">
          {Object.entries(analysis.categoryImprovements).map(([category, improvement]) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700 capitalize">
                {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {atsScore1.breakdown[category as keyof typeof atsScore1.breakdown]}% → {atsScore2.breakdown[category as keyof typeof atsScore2.breakdown]}%
                </span>
                <span className={`font-bold ${getImprovementColor(improvement)}`}>
                  {getImprovementIcon(improvement)} {improvement > 0 ? '+' : ''}{improvement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Changes Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Additions & Improvements</h3>
          <div className="space-y-3">
            {changes.added.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Added:</h4>
                <ul className="space-y-1">
                  {changes.added.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {changes.improved.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Improved:</h4>
                <ul className="space-y-1">
                  {changes.improved.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">📈</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">❌ Removals & Concerns</h3>
          <div className="space-y-3">
            {changes.removed.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Removed:</h4>
                <ul className="space-y-1">
                  {changes.removed.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {changes.declined.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">Concerns:</h4>
                <ul className="space-y-1">
                  {changes.declined.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">📉</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">🔍 Detailed Analysis</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span>💪</span> Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span>⚠️</span> Concerns
            </h4>
            <ul className="space-y-2">
              {analysis.concerns.length > 0 ? (
                analysis.concerns.map((concern, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    {concern}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic">No major concerns identified</li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span>💡</span> Recommendations
            </h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-3">📊 Want a Detailed Professional Report?</h3>
        <p className="text-blue-100 mb-4 max-w-2xl mx-auto text-sm">
          Get a comprehensive, downloadable PDF report with detailed section-by-section analysis, 
          professional recommendations, and industry-standard formatting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onViewDetailedReport}
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm"
          >
            📋 View Detailed Report
          </button>
          <button
            onClick={onDownloadPDF}
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm"
          >
            📄 Download PDF Report
          </button>
          <button
            onClick={onOpenReportInNewTab}
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            🔗 Open in New Tab
          </button>
          <a
            href="https://apply-wizz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            📈 Get Professional Optimization
          </a>
          <a
            href="/resume-builder"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            📝 Create New Version
          </a>
        </div>
      </div>
    </div>
  );
};

export default function ResumeComparePage() {
  const [fileUrl1, setFileUrl1] = useState<string>("");
  const [fileUrl2, setFileUrl2] = useState<string>("");
  const [textItems1, setTextItems1] = useState<TextItems>([]);
  const [textItems2, setTextItems2] = useState<TextItems>([]);
  const [rawText1, setRawText1] = useState<string>(""); // NEW: Track raw text for debugging
  const [rawText2, setRawText2] = useState<string>(""); // NEW: Track raw text for debugging
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ResumeComparison | null>(null);
  const [error, setError] = useState<string>("");
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  // Optimized callback handlers with URL cleanup
  const handleFileUrl1Change = useCallback((url: string | null) => {
    // Clean up previous URL to prevent reuse
    if (fileUrl1) {
      URL.revokeObjectURL(fileUrl1);
    }
    setFileUrl1(url || "");
    setError(""); // Clear any previous errors
  }, [fileUrl1]);

  const handleFileUrl2Change = useCallback((url: string | null) => {
    // Clean up previous URL to prevent reuse  
    if (fileUrl2) {
      URL.revokeObjectURL(fileUrl2);
    }
    setFileUrl2(url || "");
    setError(""); // Clear any previous errors
  }, [fileUrl2]);

  const openDetailedReportInNewTab = useCallback(() => {
    if (!comparison) return;
    
    // Create a simplified new window with the detailed report
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (newWindow) {
      const overallImprovement = comparison.atsScore2.overall - comparison.atsScore1.overall;
      
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume Comparison Report - Apply Wizz</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: #374151; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .score-section { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; margin: 20px 0; }
            .score-box { text-align: center; padding: 20px; border-radius: 8px; }
            .score-1 { background: #dbeafe; }
            .score-2 { background: #dcfce7; }
            .improvement { background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background: #f8f9fa; font-weight: bold; }
            .table tr:nth-child(even) { background: #f8f9fa; }
            h1, h2, h3 { margin-top: 0; }
            .positive { color: #16a34a; font-weight: bold; }
            .negative { color: #dc2626; font-weight: bold; }
            .neutral { color: #6b7280; }
            @media print { body { background: white; } .container { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Resume Comparison Report</h1>
              <p>Generated by Apply Wizz - ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="score-section">
              <div class="score-box score-1">
                <h3>Resume 1 (Original)</h3>
                <div style="font-size: 2rem; font-weight: bold;">
                  ${comparison.atsScore1.overall}%
                </div>
              </div>
              
              <div class="improvement">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: bold; color: ${overallImprovement >= 0 ? '#16a34a' : '#dc2626'}">
                    ${overallImprovement > 0 ? '+' : ''}${overallImprovement}
                  </div>
                  <div style="font-size: 0.875rem; color: #6b7280;">Change</div>
                </div>
              </div>
              
              <div class="score-box score-2">
                <h3>Resume 2 (Updated)</h3>
                <div style="font-size: 2rem; font-weight: bold;">
                  ${comparison.atsScore2.overall}%
                </div>
              </div>
            </div>
            
            <h2>📈 Category-by-Category Analysis</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Resume 1 Score</th>
                  <th>Resume 2 Score</th>
                  <th>Change</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(comparison.analysis.categoryImprovements).map(([category, improvement]) => `
                  <tr>
                    <td style="font-weight: bold;">${category.replace(/([A-Z])/g, ' $1').toLowerCase()}</td>
                    <td>${comparison.atsScore1.breakdown[category as keyof typeof comparison.atsScore1.breakdown]}%</td>
                    <td>${comparison.atsScore2.breakdown[category as keyof typeof comparison.atsScore2.breakdown]}%</td>
                    <td class="${improvement > 0 ? 'positive' : improvement < 0 ? 'negative' : 'neutral'}">
                      ${improvement > 0 ? '+' : ''}${improvement}
                    </td>
                    <td>
                      ${improvement > 0 ? '📈 Improved' : improvement < 0 ? '📉 Declined' : '➡️ No Change'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>📝 Content Changes Summary</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Change Type</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                ${comparison.changes.added.length > 0 ? `
                  <tr>
                    <td style="color: #16a34a; font-weight: bold;">✅ Added</td>
                    <td>${comparison.changes.added.join('<br>')}</td>
                  </tr>
                ` : ''}
                ${comparison.changes.improved.length > 0 ? `
                  <tr>
                    <td style="color: #2563eb; font-weight: bold;">📈 Improved</td>
                    <td>${comparison.changes.improved.join('<br>')}</td>
                  </tr>
                ` : ''}
                ${comparison.changes.removed.length > 0 ? `
                  <tr>
                    <td style="color: #dc2626; font-weight: bold;">❌ Removed</td>
                    <td>${comparison.changes.removed.join('<br>')}</td>
                  </tr>
                ` : ''}
                ${comparison.changes.declined.length > 0 ? `
                  <tr>
                    <td style="color: #f59e0b; font-weight: bold;">⚠️ Concerns</td>
                    <td>${comparison.changes.declined.join('<br>')}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
            
            <h2>💡 Recommendations</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                ${comparison.analysis.recommendations.map((rec: string, index: number) => `
                  <tr>
                    <td style="font-weight: bold; color: #2563eb;">${index + 1}</td>
                    <td>${rec}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            ${comparison.analysis.strengths.length > 0 ? `
              <h2>💪 Key Strengths</h2>
              <table class="table">
                <tbody>
                  ${comparison.analysis.strengths.map((strength: string) => `
                    <tr>
                      <td style="color: #16a34a;">✅</td>
                      <td>${strength}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}
            
            ${comparison.analysis.concerns.length > 0 ? `
              <h2>⚠️ Areas of Concern</h2>
              <table class="table">
                <tbody>
                  ${comparison.analysis.concerns.map((concern: string) => `
                    <tr>
                      <td style="color: #dc2626;">⚠️</td>
                      <td>${concern}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}
            
            <div style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">
                Generated by Apply Wizz Resume Comparison System<br>
                Visit <a href="https://apply-wizz.com" target="_blank">apply-wizz.com</a> for professional optimization services
              </p>
            </div>
          </div>
          
          <script>
            window.addEventListener('keydown', function(e) {
              if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                window.print();
              }
            });
            window.focus();
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  }, [comparison]);

  const downloadComparisonPDF = useCallback(async () => {
    if (!comparison) return;
    
    try {
      // Import html2canvas and jspdf dynamically
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      // Create a temporary container with the report content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.background = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      
      const overallImprovement = comparison.atsScore2.overall - comparison.atsScore1.overall;
      
      tempContainer.innerHTML = `
        <div style="background: white; padding: 20px;">
          <div style="background: #374151; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">📊 Resume Comparison Report</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.8;">Generated by Apply Wizz - ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; margin: 20px 0;">
            <div style="text-align: center; padding: 20px; background: #dbeafe; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Resume 1 (Original)</h3>
              <div style="font-size: 32px; font-weight: bold; color: ${comparison.atsScore1.overall >= 80 ? '#16a34a' : comparison.atsScore1.overall >= 60 ? '#f59e0b' : '#dc2626'};">
                ${comparison.atsScore1.overall}%
              </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px; padding: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: ${overallImprovement >= 0 ? '#16a34a' : '#dc2626'};">
                  ${overallImprovement >= 0 ? '📈' : '📉'} ${overallImprovement > 0 ? '+' : ''}${overallImprovement}
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Overall Change</div>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #dcfce7; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Resume 2 (Updated)</h3>
              <div style="font-size: 32px; font-weight: bold; color: ${comparison.atsScore2.overall >= 80 ? '#16a34a' : comparison.atsScore2.overall >= 60 ? '#f59e0b' : '#dc2626'};">
                ${comparison.atsScore2.overall}%
              </div>
            </div>
          </div>
          
          <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📈 Category-by-Category Analysis</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Category</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">Resume 1</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">Resume 2</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">Change</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(comparison.analysis.categoryImprovements).map(([category, improvement], index) => `
                <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'}">
                  <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; text-transform: capitalize;">${category.replace(/([A-Z])/g, ' $1').toLowerCase()}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${comparison.atsScore1.breakdown[category as keyof typeof comparison.atsScore1.breakdown]}%</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${comparison.atsScore2.breakdown[category as keyof typeof comparison.atsScore2.breakdown]}%</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; color: ${improvement > 0 ? '#16a34a' : improvement < 0 ? '#dc2626' : '#6b7280'};">
                    ${improvement > 0 ? '+' : ''}${improvement}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">
                    ${improvement > 0 ? '📈 Improved' : improvement < 0 ? '📉 Declined' : '➡️ No Change'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">📝 Content Changes Summary</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold; width: 25%;">Change Type</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Details</th>
              </tr>
            </thead>
            <tbody>
              ${comparison.changes.added.length > 0 ? `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px; color: #16a34a; font-weight: bold;">✅ Added</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${comparison.changes.added.join('<br>')}</td>
                </tr>
              ` : ''}
              ${comparison.changes.improved.length > 0 ? `
                <tr style="background: #f8f9fa;">
                  <td style="border: 1px solid #ddd; padding: 12px; color: #2563eb; font-weight: bold;">📈 Improved</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${comparison.changes.improved.join('<br>')}</td>
                </tr>
              ` : ''}
              ${comparison.changes.removed.length > 0 ? `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px; color: #dc2626; font-weight: bold;">❌ Removed</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${comparison.changes.removed.join('<br>')}</td>
                </tr>
              ` : ''}
              ${comparison.changes.declined.length > 0 ? `
                <tr style="background: #f8f9fa;">
                  <td style="border: 1px solid #ddd; padding: 12px; color: #f59e0b; font-weight: bold;">⚠️ Concerns</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${comparison.changes.declined.join('<br>')}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
          
          <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">💡 Recommendations</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; width: 15%;">Priority</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              ${comparison.analysis.recommendations.map((rec: string, index: number) => `
                <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'}">
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; color: #2563eb;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${rec}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              Generated by Apply Wizz Resume Comparison System<br>
              Visit apply-wizz.com for professional optimization services
            </p>
          </div>
        </div>
      `;
      
      document.body.appendChild(tempContainer);
      
      // Generate canvas with high quality
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: tempContainer.scrollHeight
      });
      
      // Remove temporary container
      document.body.removeChild(tempContainer);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Resume_Comparison_Report_${timestamp}.pdf`;
      
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback mechanism: offer alternative download methods
      const shouldTryAlternative = window.confirm(
        'PDF generation failed. Would you like to try an alternative method?\n\n' +
        'Click OK to open a print-friendly version in a new tab where you can:\n' +
        '• Use your browser\'s "Print to PDF" feature\n' +
        '• Save as PDF manually\n' +
        '• Print the report'
      );
      
      if (shouldTryAlternative) {
        openDetailedReportInNewTab();
      }
    }
  }, [comparison]);

  const resume1 = useMemo(() => {
    if (textItems1.length === 0) return null;
    try {
      const lines = groupTextItemsIntoLines(textItems1);
      const sections = groupLinesIntoSections(lines);
      return extractResumeFromSections(sections);
    } catch (error) {
      console.error('Error parsing resume 1:', error);
      return null;
    }
  }, [textItems1]);

  const resume2 = useMemo(() => {
    if (textItems2.length === 0) return null;
    try {
      const lines = groupTextItemsIntoLines(textItems2);
      const sections = groupLinesIntoSections(lines);
      return extractResumeFromSections(sections);
    } catch (error) {
      console.error('Error parsing resume 2:', error);
      return null;
    }
  }, [textItems2]);

  useEffect(() => {
    if (fileUrl1) {
      readPdf(fileUrl1)
        .then(textItems => {
          setTextItems1(textItems);
          // Capture raw text for debugging
          const rawText = textItems.map(item => item.text).join(' ');
          setRawText1(rawText);
          console.log('Resume 1 parsed - raw text length:', rawText.length);
        })
        .catch(error => {
          console.error('Error reading PDF 1:', error);
          setTextItems1([]);
          setRawText1('');
        });
    }
  }, [fileUrl1]);

  useEffect(() => {
    if (fileUrl2) {
      readPdf(fileUrl2)
        .then(textItems => {
          setTextItems2(textItems);
          // Capture raw text for debugging
          const rawText = textItems.map(item => item.text).join(' ');
          setRawText2(rawText);
          console.log('Resume 2 parsed - raw text length:', rawText.length);
        })
        .catch(error => {
          console.error('Error reading PDF 2:', error);
          setTextItems2([]);
          setRawText2('');
        });
    }
  }, [fileUrl2]);

  useEffect(() => {
    if (resume1 && resume2) {
      setLoading(true);
      setError("");
      setTimeout(() => {
        try {
          const comparisonResult = compareResumes(resume1 as Resume, resume2 as Resume);
          setComparison(comparisonResult);
        } catch (error) {
          console.error('Error comparing resumes:', error);
          setError('Failed to compare resumes. Please ensure both files are valid resumes.');
        } finally {
          setLoading(false);
        }
      }, 1000);
    } else {
      setComparison(null);
    }
  }, [resume1, resume2]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <ApplyWizzLogo size="lg" className="mb-4 justify-center" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔄 Resume Comparison Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload two versions of your resume to see detailed changes, improvements, and ATS score comparisons. 
            Perfect for tracking your resume evolution and optimization progress with enterprise-grade analysis.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            🔒 Secure • 🚀 Fast Analysis • 📊 Professional Reports
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📄 Resume 1 (Original)
            </h3>
            <ResumeDropzone
              onFileUrlChange={handleFileUrl1Change}
              playgroundView={true}
            />
            {fileUrl1 && (
              <div className="mt-4">
                <div className="aspect-h-[9.5] aspect-w-7">
                  <iframe src={`${fileUrl1}#navpanes=0`} className="h-64 w-full rounded-lg" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📄 Resume 2 (Updated)
            </h3>
            <ResumeDropzone
              onFileUrlChange={handleFileUrl2Change}
              playgroundView={true}
            />
            {fileUrl2 && (
              <div className="mt-4">
                <div className="aspect-h-[9.5] aspect-w-7">
                  <iframe src={`${fileUrl2}#navpanes=0`} className="h-64 w-full rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing resume changes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-bold text-red-700 mb-2">Comparison Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Debug Panels for Raw Text Hash Verification */}
        {(resume1 || resume2) && (
          <div className="mb-8 space-y-4">
            {resume1 && (
              <DebugPanel 
                title="Resume A Debug" 
                rawText={rawText1} 
                resume={resume1} 
                atsScore={comparison?.atsScore1} 
              />
            )}
            {resume2 && (
              <DebugPanel 
                title="Resume B Debug" 
                rawText={rawText2} 
                resume={resume2} 
                atsScore={comparison?.atsScore2} 
              />
            )}
          </div>
        )}

        {/* Comparison Results */}
        {comparison && !loading && (
          <ComparisonResults 
            comparison={comparison} 
            onViewDetailedReport={() => setShowDetailedReport(true)}
            onOpenReportInNewTab={openDetailedReportInNewTab}
            onDownloadPDF={downloadComparisonPDF}
          />
        )}

        {/* Instructions */}
        {!fileUrl1 || !fileUrl2 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">How to Use Resume Comparison</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="font-semibold mb-2">Upload Original Resume</h4>
                  <p className="text-sm text-gray-600">
                    Upload your first resume version in the left panel. This will serve as your baseline.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="font-semibold mb-2">Upload Updated Resume</h4>
                  <p className="text-sm text-gray-600">
                    Upload your newer resume version in the right panel for comparison.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="font-semibold mb-2">Analyze Changes</h4>
                  <p className="text-sm text-gray-600">
                    Get detailed analysis of changes, ATS score improvements, and optimization recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Detailed Report Modal */}
        {showDetailedReport && comparison && resume1 && resume2 && (
          <ComparisonReport
            resume1={resume1 as Resume}
            atsScore1={comparison.atsScore1}
            resume2={resume2 as Resume}
            atsScore2={comparison.atsScore2}
          />
        )}
      </div>
    </main>
  );
}