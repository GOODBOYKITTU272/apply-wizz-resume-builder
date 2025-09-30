import type { Resume } from "./redux/types";

export interface ATSScore {
  overall: number;
  breakdown: {
    contactInfo: number;
    education: number;
    workExperience: number;
    skills: number;
    formatting: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    critical: string[];
  };
  recommendations: string[];
}

export function calculateATSScore(resume: Resume): ATSScore {
  const scores = {
    contactInfo: calculateContactScore(resume),
    education: calculateEducationScore(resume),
    workExperience: calculateWorkExperienceScore(resume),
    skills: calculateSkillsScore(resume),
    formatting: calculateFormattingScore(resume),
  };

  const overall = Math.round(
    (scores.contactInfo * 0.25 +
      scores.education * 0.15 +
      scores.workExperience * 0.35 +
      scores.skills * 0.15 +
      scores.formatting * 0.10) 
  );

  const feedback = generateFeedback(resume, scores);
  const recommendations = generateRecommendations(resume, scores);

  return {
    overall,
    breakdown: scores,
    feedback,
    recommendations,
  };
}

function calculateContactScore(resume: Resume): number {
  const { profile } = resume;
  let score = 0;

  // Name (25 points)
  if (profile.name && profile.name.trim().length > 0) {
    score += 25;
  }

  // Email (25 points)
  if (profile.email && isValidEmail(profile.email)) {
    score += 25;
  }

  // Phone (20 points)
  if (profile.phone && profile.phone.trim().length > 0) {
    score += 20;
  }

  // Location (15 points)
  if (profile.location && profile.location.trim().length > 0) {
    score += 15;
  }

  // URL/LinkedIn (15 points)
  if (profile.url && profile.url.trim().length > 0) {
    score += 15;
  }

  return score;
}

function calculateEducationScore(resume: Resume): number {
  const { educations } = resume;
  
  if (educations.length === 0) return 0;

  let score = 0;
  const education = educations[0]; // Focus on primary education

  // School name (30 points)
  if (education.school && education.school.trim().length > 0) {
    score += 30;
  }

  // Degree (40 points)
  if (education.degree && education.degree.trim().length > 0) {
    score += 40;
  }

  // Date (20 points)
  if (education.date && education.date.trim().length > 0) {
    score += 20;
  }

  // GPA (10 points - bonus)
  if (education.gpa && education.gpa.trim().length > 0) {
    score += 10;
  }

  return Math.min(score, 100);
}

function calculateWorkExperienceScore(resume: Resume): number {
  const { workExperiences } = resume;
  
  if (workExperiences.length === 0) return 0;

  let totalScore = 0;
  let validExperiences = 0;

  workExperiences.forEach((exp) => {
    let expScore = 0;

    // Company name (25 points)
    if (exp.company && exp.company.trim().length > 0) {
      expScore += 25;
    }

    // Job title (25 points)
    if (exp.jobTitle && exp.jobTitle.trim().length > 0) {
      expScore += 25;
    }

    // Date (20 points)
    if (exp.date && exp.date.trim().length > 0) {
      expScore += 20;
    }

    // Descriptions/achievements (30 points)
    if (exp.descriptions && exp.descriptions.length > 0) {
      const validDescriptions = exp.descriptions.filter(d => d.trim().length > 0);
      if (validDescriptions.length > 0) {
        expScore += 15;
        // Bonus for multiple bullet points
        if (validDescriptions.length >= 3) {
          expScore += 15;
        } else if (validDescriptions.length >= 2) {
          expScore += 10;
        }
      }
    }

    if (expScore > 0) {
      totalScore += expScore;
      validExperiences++;
    }
  });

  return validExperiences > 0 ? Math.round(totalScore / validExperiences) : 0;
}

function calculateSkillsScore(resume: Resume): number {
  const { skills } = resume;
  let score = 0;

  // Featured skills (60 points)
  if (skills.featuredSkills) {
    const validFeaturedSkills = skills.featuredSkills.filter(
      skill => skill.skill && skill.skill.trim().length > 0
    );
    if (validFeaturedSkills.length > 0) {
      score += Math.min(validFeaturedSkills.length * 10, 60);
    }
  }

  // Additional skills descriptions (40 points)
  if (skills.descriptions && skills.descriptions.length > 0) {
    const validDescriptions = skills.descriptions.filter(d => d.trim().length > 0);
    if (validDescriptions.length > 0) {
      score += 40;
    }
  }

  return Math.min(score, 100);
}

function calculateFormattingScore(resume: Resume): number {
  // This is a simplified scoring - in real ATS, this would analyze actual formatting
  let score = 100; // Assume good formatting from our template

  const { profile, workExperiences, educations } = resume;

  // Deduct points for missing critical sections
  if (!profile.name || !profile.email) {
    score -= 30;
  }

  if (workExperiences.length === 0) {
    score -= 25;
  }

  if (educations.length === 0) {
    score -= 20;
  }

  return Math.max(score, 0);
}

function generateFeedback(resume: Resume, scores: any) {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const critical: string[] = [];

  // Contact Info Feedback
  if (scores.contactInfo >= 80) {
    strengths.push("Complete contact information provided");
  } else {
    if (!resume.profile.name) critical.push("Missing name");
    if (!resume.profile.email) critical.push("Missing email address");
    if (!resume.profile.phone) improvements.push("Add phone number");
    if (!resume.profile.location) improvements.push("Add location/city");
  }

  // Work Experience Feedback
  if (scores.workExperience >= 80) {
    strengths.push("Strong work experience section");
  } else if (scores.workExperience >= 60) {
    improvements.push("Add more detailed job descriptions");
  } else {
    critical.push("Work experience needs significant improvement");
  }

  // Skills Feedback
  if (scores.skills >= 70) {
    strengths.push("Good skills representation");
  } else {
    improvements.push("Add more relevant technical and soft skills");
  }

  // Education Feedback
  if (scores.education >= 80) {
    strengths.push("Complete education information");
  } else if (resume.educations.length === 0) {
    improvements.push("Add education background");
  }

  return { strengths, improvements, critical };
}

function generateRecommendations(resume: Resume, scores: any): string[] {
  const recommendations: string[] = [];

  if (scores.contactInfo < 80) {
    recommendations.push("Ensure all contact information is complete and professional");
  }

  if (scores.workExperience < 70) {
    recommendations.push("Use action verbs and quantify achievements in work experience");
    recommendations.push("Include 3-5 bullet points per job describing key accomplishments");
  }

  if (scores.skills < 70) {
    recommendations.push("Add industry-specific keywords and technical skills");
    recommendations.push("Include both hard and soft skills relevant to target positions");
  }

  if (scores.overall < 70) {
    recommendations.push("Consider using Apply Wizz's resume optimization service");
    recommendations.push("Focus on ATS-friendly formatting and keyword optimization");
  }

  return recommendations;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 60) return "Needs Improvement";
  return "Poor";
}