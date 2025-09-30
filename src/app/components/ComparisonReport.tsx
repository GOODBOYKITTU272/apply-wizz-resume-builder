'use client';

import React from 'react';
import { Resume } from '../lib/redux/types';
import { ATSScore } from '../lib/ats-score';
import { generateDetailedATSReport } from '../lib/ats-detailed-report';
import {
  percent, sectionBreakdownDelta,
  diffEducation, diffWork, diffProjects,
  hasGitHub, hasLinkedIn
} from '../lib/compare-utils';
import ATSImpactGrid from './ATSImpactGrid';

type Props = {
  resume1: Resume | null;
  atsScore1: ATSScore | null;
  resume2: Resume | null;
  atsScore2: ATSScore | null;
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

export default function ComparisonReport({ resume1, atsScore1, resume2, atsScore2 }: Props) {
  if (!resume1 || !resume2 || !atsScore1 || !atsScore2) {
    return (
      <div className="p-6 rounded-2xl border bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">We couldn’t analyze one or both PDFs</h3>
        <p className="text-sm text-gray-600">
          Ensure each resume has a selectable text layer (not a scanned image). Export from Word/Google Docs and re-upload.
        </p>
      </div>
    );
  }

  // Build reports
  const report1 = generateDetailedATSReport(resume1, atsScore1);
  const report2 = generateDetailedATSReport(resume2, atsScore2);

  const overallA = percent(atsScore1.overall);
  const overallB = percent(atsScore2.overall);
  const overallDelta = overallB - overallA;

  const deltas = sectionBreakdownDelta(atsScore1, atsScore2);

  // Content diffs
  const workDiff = diffWork(resume1, resume2);
  const eduDiff  = diffEducation(resume1, resume2);
  const projDiff = diffProjects(resume1, resume2);

  // Detection badges (computed from actual resume content)
  const linkedInA = hasLinkedIn(resume1);
  const linkedInB = hasLinkedIn(resume2);
  const githubA   = hasGitHub(resume1);
  const githubB   = hasGitHub(resume2);

  // Helper for remarks
  const first = <T extends { description?: string }>(arr?: T[]) => (arr?.[0]?.description ?? '');

  // Dynamic "Resume Quality Grid"
  const qualityRows = [
    { label: '📑 Resume Length', status: report2.categoryScores?.brevity! >= 80 ? '✅ Perfect' : report2.categoryScores?.brevity! >= 60 ? '⚠️ Needs Tuning' : '❌ Issue', remark: first(report2.categories.brevity) || 'Resume length analysis based on content.' },
    { label: '🎯 Professional Summary', status: report2.categories.impact?.some((x:any)=>x.status==='pass') ? '✅ Strong' : '⚠️ Improve', remark: first(report2.categories.impact) || 'Make it achievement-first and JD-aligned.' },
    { label: '💻 Technical Skills', status: report2.categoryScores?.readability! >= 75 ? '✅ Optimized' : '⚠️ Improve', remark: first(report2.categories.readability) || 'Map stack to JD; remove noise.' },
    { label: '📊 Experience Section', status: report2.categories.sections?.some((x:any)=>x.title?.toLowerCase().includes('work') && x.status==='pass') ? '✅ Impact-Driven' : '⚠️ Improve', remark: first(report2.categories.sections) || 'Convert tasks → quantified outcomes.' },
    { label: '🔄 Projects', status: (resume2.projects?.length||0) > 0 ? '✅ Present' : '⚠️ Add/Improve', remark: (resume2.projects?.length||0) > 0 ? 'Projects detected.' : 'Add 1–2 role-aligned projects with metrics.' },
    { label: '📝 Formatting', status: report2.categoryScores?.appearance! >= 80 ? '✅ Consistent' : '⚠️ Minor issues', remark: first(report2.categories.appearance) || 'Consistency of fonts, spacing, bullets.' },
  ];

  return (
    <div className="space-y-8">
      {/* Topline ATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Resume A — Overall</div>
          <div className="text-2xl font-semibold">{overallA}/100</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill text={`LinkedIn: ${linkedInA ? 'Detected' : '—'}`} tone={linkedInA ? 'good' : 'neutral'} />
            <Pill text={`GitHub: ${githubA ? 'Detected' : '—'}`} tone={githubA ? 'good' : 'neutral'} />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">VS</div>
        </div>

        <div className="p-5 rounded-2xl border bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Resume B — Overall</div>
          <div className="text-2xl font-semibold">{overallB}/100</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill text={`LinkedIn: ${linkedInB ? 'Detected' : '—'}`} tone={linkedInB ? 'good' : 'neutral'} />
            <Pill text={`GitHub: ${githubB ? 'Detected' : '—'}`} tone={githubB ? 'good' : 'neutral'} />
          </div>
        </div>
      </div>

      {/* Overall Improvement */}
      <div className="p-5 rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">Overall Improvement</div>
          <Pill text={`${overallDelta >= 0 ? '📈' : '📉'} ${overallDelta} points`} tone={overallDelta > 0 ? 'good' : overallDelta < 0 ? 'bad' : 'neutral'} />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {overallDelta >= 0 ? 'Resume B performs better overall.' : overallDelta < 0 ? 'Resume A performs better overall.' : 'Both resumes are equal overall.'} Consider keeping the strongest elements.
        </p>
      </div>

      {/* Section-by-Section Comparison */}
      <div className="p-5 rounded-2xl border bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Section-by-Section Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 px-4 font-medium">Section</th>
                <th className="py-2 px-4 font-medium">Resume A</th>
                <th className="py-2 px-4 font-medium">Resume B</th>
                <th className="py-2 px-4 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {[
                { k: 'Contact Info', a: atsScore1.breakdown.contactInfo, b: atsScore2.breakdown.contactInfo, d: deltas.contactInfo },
                { k: 'Education', a: atsScore1.breakdown.education, b: atsScore2.breakdown.education, d: deltas.education },
                { k: 'Work Experience', a: atsScore1.breakdown.workExperience, b: atsScore2.breakdown.workExperience, d: deltas.workExperience },
                { k: 'Skills', a: atsScore1.breakdown.skills, b: atsScore2.breakdown.skills, d: deltas.skills },
                { k: 'Formatting', a: atsScore1.breakdown.formatting, b: atsScore2.breakdown.formatting, d: deltas.formatting },
              ].map(row => (
                <tr key={row.k} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{row.k}</td>
                  <td className="py-3 px-4">{percent(row.a)}/100</td>
                  <td className="py-3 px-4">{percent(row.b)}/100</td>
                  <td className="py-3 px-4">
                    <Pill text={`${row.d > 0 ? '📈 +'+row.d : row.d < 0 ? '📉 '+row.d : '➡️ 0'}`} tone={row.d>0 ? 'good' : row.d<0 ? 'bad' : 'neutral'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additions & Improvements (computed diffs) */}
      <div className="p-5 rounded-2xl border bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Additions & Improvements</h3>
        <div className="flex flex-wrap gap-2">
          {workDiff.added > 0 && <Pill tone="good" text={`+ Added ${workDiff.added} work experience(s)`} />}
          {eduDiff.added  > 0 && <Pill tone="good" text={`+ Added ${eduDiff.added} education entry(ies)`} />}
          {projDiff.added > 0 && <Pill tone="good" text={`+ Added ${projDiff.added} project(s)`} />}
          {(workDiff.expanded + eduDiff.expanded + projDiff.expanded) > 0 && (
            <Pill tone="good" text="📈 Expanded content in sections" />
          )}
          {(workDiff.added + eduDiff.added + projDiff.added) === 0 && (workDiff.expanded + eduDiff.expanded + projDiff.expanded) === 0 && (
            <Pill text="— No additions detected" />
          )}
        </div>
      </div>

      {/* Quality grid (dynamic) */}
      <div className="p-5 rounded-2xl border bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Resume Quality Grid (Dynamic)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 px-4 font-medium">Quality Check</th>
                <th className="py-2 px-4 font-medium">Status</th>
                <th className="py-2 px-4 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody>
              {qualityRows.map(r => (
                <tr key={r.label} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{r.label}</td>
                  <td className="py-3 px-4">
                    <Pill
                      text={r.status}
                      tone={r.status.startsWith('✅') ? 'good' : r.status.startsWith('⚠️') ? 'warn' : 'bad'}
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-700">{r.remark || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATS Impact Grid (our dynamic component) */}
      <div className="grid grid-cols-1">
        <ATSImpactGrid title="ATS Impact — Resume B" resume={resume2} atsScore={atsScore2} />
      </div>

      {/* Recommendations (from real report2 feedback) */}
      <div className="p-5 rounded-2xl border bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Key Recommendations (Dynamic)</h3>
        <ul className="list-disc pl-6 text-sm text-gray-800 space-y-1">
          {(atsScore2?.feedback?.critical || []).map((t: string, i: number) => <li key={`c-${i}`}>[Critical] {t}</li>)}
          {(atsScore2?.feedback?.improvements || []).map((t: string, i: number) => <li key={`i-${i}`}>{t}</li>)}
          {(atsScore2?.feedback?.strengths || []).slice(0,2).map((t: string, i: number) => <li key={`s-${i}`}>Keep: {t}</li>)}
        </ul>
      </div>
    </div>
  );
}