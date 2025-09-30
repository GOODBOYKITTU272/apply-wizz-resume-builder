'use client';

import React from 'react';
import type { Resume } from '../lib/redux/types';

function hash(s: string) {
  let h = 0, i = 0, len = s.length;
  while (i < len) { h = (h << 5) - h + s.charCodeAt(i++) | 0; }
  return (h >>> 0).toString(16);
}

interface DebugPanelProps {
  title: string;
  rawText: string;
  resume: Resume | null;
  atsScore: any;
}

export default function DebugPanel({ title, rawText, resume, atsScore }: DebugPanelProps) {
  const h = rawText ? hash(rawText) : '∅';
  
  return (
    <details className="mt-3 p-3 border rounded-xl bg-gray-50">
      <summary className="cursor-pointer text-sm text-gray-700">
        {title} — raw hash: <strong>{h}</strong>
      </summary>
      <div className="mt-3 space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-600 mb-1">Raw Text Preview:</h4>
          <pre className="text-xs overflow-auto whitespace-pre-wrap bg-white p-2 rounded border max-h-32">
            {rawText?.slice(0, 600) || '∅'}
          </pre>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-600 mb-1">Parsed Resume & ATS Score:</h4>
          <pre className="text-xs overflow-auto whitespace-pre-wrap bg-white p-2 rounded border max-h-32">
            {JSON.stringify({ 
              profile: resume?.profile, 
              breakdown: atsScore?.breakdown, 
              overall: atsScore?.overall,
              workExpCount: resume?.workExperiences?.length || 0,
              eduCount: resume?.educations?.length || 0,
              skillsCount: resume?.skills?.featuredSkills?.length || 0
            }, null, 2)}
          </pre>
        </div>
      </div>
    </details>
  );
}