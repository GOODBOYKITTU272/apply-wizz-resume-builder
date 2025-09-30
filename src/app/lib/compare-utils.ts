// src/app/lib/compare-utils.ts
import { Resume } from "./redux/types";
import { ATSScore } from "./ats-score";

export type SectionDelta = {
  contactInfo: number;
  education: number;
  workExperience: number;
  skills: number;
  formatting: number;
};

export function percent(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function delta(a?: number, b?: number) {
  if (typeof a !== "number" || typeof b !== "number") return 0;
  return Math.round(b - a);
}

export function sectionBreakdownDelta(a: ATSScore, b: ATSScore): SectionDelta {
  return {
    contactInfo: delta(a.breakdown.contactInfo, b.breakdown.contactInfo),
    education: delta(a.breakdown.education, b.breakdown.education),
    workExperience: delta(a.breakdown.workExperience, b.breakdown.workExperience),
    skills: delta(a.breakdown.skills, b.breakdown.skills),
    formatting: delta(a.breakdown.formatting, b.breakdown.formatting),
  };
}

// ---- content-level diffs ----
export type CountDiff = { added: number; removed: number; expanded: number };

function countExpanded(oldText?: string, newText?: string): number {
  const a = (oldText || "").trim().length;
  const b = (newText || "").trim().length;
  return b > a ? 1 : 0;
}

export function diffEducation(a: Resume, b: Resume): CountDiff {
  const A = a.educations || [];
  const B = b.educations || [];
  const added = Math.max(0, B.length - A.length);
  const removed = Math.max(0, A.length - B.length);
  let expanded = 0;
  const len = Math.min(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const ax = A[i], bx = B[i];
    expanded += countExpanded(
      [ax.school, ax.degree, ax.date, ax.gpa, ...(ax.descriptions || [])].join(" "),
      [bx.school, bx.degree, bx.date, bx.gpa, ...(bx.descriptions || [])].join(" ")
    );
  }
  return { added, removed, expanded };
}

export function diffWork(a: Resume, b: Resume): CountDiff {
  const A = a.workExperiences || [];
  const B = b.workExperiences || [];
  const added = Math.max(0, B.length - A.length);
  const removed = Math.max(0, A.length - B.length);
  let expanded = 0;
  const len = Math.min(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const aw = A[i], bw = B[i];
    expanded += countExpanded(
      [aw.company, aw.jobTitle, aw.date, ...(aw.descriptions || [])].join(" "),
      [bw.company, bw.jobTitle, bw.date, ...(bw.descriptions || [])].join(" ")
    );
  }
  return { added, removed, expanded };
}

export function diffProjects(a: Resume, b: Resume): CountDiff {
  const A = a.projects || [];
  const B = b.projects || [];
  const added = Math.max(0, B.length - A.length);
  const removed = Math.max(0, A.length - B.length);
  let expanded = 0;
  const len = Math.min(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const ap = A[i], bp = B[i];
    expanded += countExpanded(
      [ap.project, ap.date, ...(ap.descriptions || [])].join(" "),
      [bp.project, bp.date, ...(bp.descriptions || [])].join(" ")
    );
  }
  return { added, removed, expanded };
}

// simple signals – presence of contact info
export function hasLinkedIn(r?: Resume) {
  const url = r?.profile?.url || "";
  const text =
    [
      r?.profile?.name, r?.profile?.email, r?.profile?.url,
      ...(r?.skills?.descriptions || []),
      ...(r?.projects || []).map(p => [p.project, p.date, ...(p.descriptions || [])].join(" ")),
      ...(r?.workExperiences || []).map(w => [w.company, w.jobTitle, ...(w.descriptions || [])].join(" ")),
    ].join(" ") || "";
  return /linkedin\.com\/(in|pub|company)\//i.test(url) || /linkedin/i.test(text);
}

export function hasGitHub(r?: Resume) {
  const text =
    [
      r?.profile?.url,
      ...(r?.projects || []).map(p => [p.project, p.date, ...(p.descriptions || [])].join(" ")),
      ...(r?.workExperiences || []).map(w => [w.company, w.jobTitle, ...(w.descriptions || [])].join(" ")),
      ...(r?.skills?.descriptions || []),
    ].join(" ") || "";
  return /github\.com\//i.test(text);
}