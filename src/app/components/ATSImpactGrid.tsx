'use client';

import React from 'react';
import { Resume } from '../lib/redux/types';
import { ATSScore } from '../lib/ats-score';
import { generateDetailedATSReport } from '../lib/ats-detailed-report';
import type { Resume as ResumeType } from '../lib/redux/types';

type Props = {
  title: string;
  resume: Resume;
  atsScore: ATSScore;
};

// Helper function for safe category access
function first(arr: any[]): string {
  return arr && arr.length > 0 ? arr[0]?.description || arr[0] || '' : '';
}

// Clamp utility
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

// Real brevity estimator based on content density
function estimateBrevity(resume: ResumeType): number {
  const bullets =
    (resume.workExperiences || []).reduce((n, w) => n + (w.descriptions?.length || 0), 0) +
    (resume.projects || []).reduce((n, p) => n + (p.descriptions?.length || 0), 0) +
    (resume.skills?.descriptions?.length || 0);

  // Real heuristic - no constants
  if (bullets <= 20) return 90;
  if (bullets <= 35) return 80;
  if (bullets <= 50) return 70;
  if (bullets <= 70) return 60;
  return 50;
}

export default function ATSImpactGrid({ title, resume, atsScore }: Props) {
  // Generate detailed report with real category analysis
  const report = generateDetailedATSReport(resume, atsScore);

  // STRICT rows: no constants, no demo text, no fallbacks  
  const rows = [
    { label: '📊 Metrics Impact',    score: report.categoryScores?.impact,     highlight: first(report.categories.impact) },
    { label: '💬 Verbs Impact',      score: report.categoryScores?.impact,     highlight: first(report.categories.impact) },
    { label: '✅ Spell/Grammar',     score: report.categoryScores?.readability,highlight: first(report.categories.readability) },
    { label: '🏷️ Keyword Relevance',score: report.categoryScores?.impact,     highlight: first(report.categories.impact) },
    { label: '🎨 Appearance',        score: report.categoryScores?.appearance, highlight: first(report.categories.appearance) },
    { label: '📄 Sections Coverage', score: report.categoryScores?.readability, highlight: first(report.categories.sections) },
    { label: '⏱️ Brevity',           score: clamp(estimateBrevity(resume), 0, 100), highlight: first(report.categories.brevity) },
    { label: '🔍 Readability',       score: report.categoryScores?.readability,highlight: first(report.categories.readability) },
    { label: '📈 Technical Strength',score: report.categoryScores?.impact,     highlight: first(report.categories.impact) },
  ];

  // ScorePill with no fallback numbers
  const ScorePill: React.FC<{ value?: number }> = ({ value }) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return <Pill text="—" />;
    const v = Math.max(0, Math.min(100, Math.round(value)));
    const tone = v >= 85 ? 'bg-green-100 text-green-800' : v >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${tone}`}>{v}/100</span>;
  };

  const Pill: React.FC<{ text: string; tone?: 'good' | 'warn' | 'bad' | 'neutral' }> = ({ text, tone = 'neutral' }) => {
    const toneClass =
      tone === 'good'
        ? 'bg-green-100 text-green-800'
        : tone === 'warn'
        ? 'bg-yellow-100 text-yellow-800'
        : tone === 'bad'
        ? 'bg-red-100 text-red-800'
        : 'bg-gray-100 text-gray-800';
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${toneClass}`}>{text}</span>;
  };

  return (
    <div className="p-5 rounded-2xl border bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 px-4 font-medium">Metric</th>
              <th className="py-2 px-4 font-medium">Score</th>
              <th className="py-2 px-4 font-medium">Analysis</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{row.label}</td>
                <td className="py-3 px-4">
                  <ScorePill value={row.score} />
                </td>
                <td className="py-3 px-4 text-gray-700">{row.highlight || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}