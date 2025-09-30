// Debug function to check what text we're actually searching for LinkedIn/GitHub
export function debugResumeText(resume: any): string {
  let resumeText = "";
  
  // Add all profile fields
  resumeText += (resume.profile?.name || '') + ' ';
  resumeText += (resume.profile?.summary || '') + ' ';
  resumeText += (resume.profile?.url || '') + ' ';
  resumeText += (resume.profile?.email || '') + ' ';
  resumeText += (resume.profile?.phone || '') + ' ';
  resumeText += (resume.profile?.location || '') + ' ';
  
  // Add all work experience fields
  if (resume.workExperiences) {
    resume.workExperiences.forEach((exp: any) => {
      resumeText += (exp.company || '') + ' ';
      resumeText += (exp.jobTitle || '') + ' ';
      resumeText += (exp.date || '') + ' ';
      if (exp.descriptions) {
        resumeText += exp.descriptions.join(' ') + ' ';
      }
    });
  }
  
  // Add all education fields
  if (resume.educations) {
    resume.educations.forEach((edu: any) => {
      resumeText += (edu.school || '') + ' ';
      resumeText += (edu.degree || '') + ' ';
      resumeText += (edu.date || '') + ' ';
      resumeText += (edu.gpa || '') + ' ';
      if (edu.descriptions) {
        resumeText += edu.descriptions.join(' ') + ' ';
      }
    });
  }
  
  // Add all project fields
  if (resume.projects) {
    resume.projects.forEach((proj: any) => {
      resumeText += (proj.project || '') + ' ';
      resumeText += (proj.date || '') + ' ';
      if (proj.descriptions) {
        resumeText += proj.descriptions.join(' ') + ' ';
      }
    });
  }
  
  // Add all skills fields
  if (resume.skills) {
    if (resume.skills.featuredSkills) {
      resume.skills.featuredSkills.forEach((skill: any) => {
        resumeText += (skill.skill || '') + ' ';
      });
    }
    if (resume.skills.descriptions) {
      resumeText += resume.skills.descriptions.join(' ') + ' ';
    }
  }
  
  // Add all custom fields
  if (resume.custom && resume.custom.descriptions) {
    resumeText += resume.custom.descriptions.join(' ') + ' ';
  }
  
  return resumeText;
}