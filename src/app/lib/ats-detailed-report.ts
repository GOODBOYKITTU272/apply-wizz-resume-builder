import type { Resume } from "./redux/types";
import { detectLinkedInInResume } from "./linkedin-detection";
import type { ATSScore } from "./ats-score";

export interface DetailedATSReport {
  applicantName: string;
  position?: string;
  overallScore: number;
  detections: {
    contactDetection: boolean;
    emailDetection: boolean;
    linkedinDetection: boolean;
    githubDetection: boolean;
  };
  categories: {
    measuringEffect: ATSCategoryResult[];
    vagueBuzzwords: ATSCategoryResult[];
    impact: ATSCategoryResult[];
    brevity: ATSCategoryResult[];
    appearance: ATSCategoryResult[];
    readability: ATSCategoryResult[];
    sections: ATSCategoryResult[];
  };
  categoryScores: {
    impact: number;
    brevity: number;
    appearance: number;
    readability: number;
  };
  recommendations: string[];
  improvements: string[];
}

export interface ATSCategoryResult {
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  score?: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function estimateBrevity(r: Resume) {
  const bullets =
    (r.workExperiences||[]).reduce((n,w)=>n+(w.descriptions?.length||0),0) +
    (r.projects||[]).reduce((n,p)=>n+(p.descriptions?.length||0),0) +
    (r.skills?.descriptions?.length||0)
  if (bullets <= 20) return 90
  if (bullets <= 35) return 80
  if (bullets <= 50) return 70
  if (bullets <= 70) return 60
  return 50
}

function buildImpactMessages(resume: Resume, atsBreakdown: any): ATSCategoryResult[] {
  const messages: ATSCategoryResult[] = [];
  
  // Check for quantified achievements based on actual ATS scoring
  const workExpScore = atsBreakdown.workExperience;
  const hasNumbers = resume.workExperiences?.some(exp => 
    exp.descriptions?.some(desc => /\d+/.test(desc))
  );
  
  messages.push({
    title: 'Quantified Impact',
    description: workExpScore >= 80 ? 'Strong quantified achievements.' : 'Add more quantified outcomes.',
    status: workExpScore >= 80 ? 'pass' : 'warning'
  });
  
  return messages;
}

function buildAppearanceMessages(resume: Resume, atsBreakdown: any): ATSCategoryResult[] {
  const formattingScore = atsBreakdown.formatting;
  
  return [{
    title: 'Professional Layout',
    description: formattingScore >= 85 ? 'Consistent layout.' : 'Fix alignment/spacing/fonts.',
    status: formattingScore >= 85 ? 'pass' : 'warning'
  }];
}

function buildSectionsMessages(resume: Resume, atsBreakdown: any): ATSCategoryResult[] {
  const sectionsScore = (atsBreakdown.contactInfo + atsBreakdown.education + atsBreakdown.workExperience + atsBreakdown.skills) / 4;
  
  return [{
    title: 'Required Sections',
    description: sectionsScore >= 70 ? 'All core sections present.' : 'Add missing sections.',
    status: sectionsScore >= 70 ? 'pass' : 'warning'
  }];
}

function buildReadabilityMessages(resume: Resume, atsBreakdown: any): ATSCategoryResult[] {
  const readabilityScore = atsBreakdown.formatting;
  
  return [{
    title: 'Readability',
    description: readabilityScore >= 90 ? 'Excellent readability/structure.' : 'Tighten headings/bullets/spacing.',
    status: readabilityScore >= 90 ? 'pass' : 'warning'
  }];
}

function buildBrevityMessages(resume: Resume): ATSCategoryResult[] {
  const brevityScore = estimateBrevity(resume);
  return [{
    title: 'Content Length',
    description: `Bullet density suggests brevity ≈ ${brevityScore}/100.`,
    status: brevityScore >= 70 ? 'pass' : 'warning'
  }];
}

export function generateDetailedATSReport(resume: Resume, ats: ATSScore): DetailedATSReport {
  const b = ats.breakdown;
  
  // All scores derived from actual breakdown, no constants
  const categoryScores = {
    impact:      clamp((b.workExperience + b.skills) / 2),
    readability: clamp(b.formatting),
    appearance:  clamp(b.formatting),
    brevity:     clamp(estimateBrevity(resume)),
  };

  const categories = {
    impact: buildImpactMessages(resume, b),
    readability: buildReadabilityMessages(resume, b),
    appearance: buildAppearanceMessages(resume, b),
    sections: buildSectionsMessages(resume, b),
    brevity: buildBrevityMessages(resume),
    measuringEffect: buildImpactMessages(resume, b),
    vagueBuzzwords: buildAppearanceMessages(resume, b),
  };

  const applicantName = resume.profile?.name || "Unknown Applicant";
  
  // Detection analysis
  const detections = {
    contactDetection: !!(resume.profile?.phone && resume.profile?.email),
    emailDetection: !!resume.profile?.email,
    linkedinDetection: detectLinkedInInResume(resume),
    githubDetection: (() => {
      // Check URL field for github
      if (resume.profile?.url && resume.profile.url.toLowerCase().includes('github')) {
        return true;
      }
      
      // Check if "github" word exists anywhere in the entire resume
      let resumeText = "";
      
      // Add all profile fields
      resumeText += (resume.profile?.name || '') + ' ';
      resumeText += (resume.profile?.summary || '') + ' ';
      resumeText += (resume.profile?.url || '') + ' ';
      
      // Add all work experience fields
      if (resume.workExperiences) {
        resume.workExperiences.forEach(exp => {
          resumeText += (exp.company || '') + ' ';
          resumeText += (exp.jobTitle || '') + ' ';
          if (exp.descriptions) {
            resumeText += exp.descriptions.join(' ') + ' ';
          }
        });
      }
      
      const githubFound = resumeText.toLowerCase().includes('github');
      return githubFound;
    })()
  };

  return {
    applicantName,
    overallScore: ats.overall,
    detections,
    categories,
    categoryScores,
    recommendations: ats.recommendations || [],
    improvements: []
  };
}