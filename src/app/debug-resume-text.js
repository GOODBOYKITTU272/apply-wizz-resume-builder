// Debug script to understand what text we're actually parsing
// This simulates the exact logic used in our LinkedIn detection

function debugResumeTextExtraction(resume) {
  console.log('=== RESUME TEXT EXTRACTION DEBUG ===');
  
  let resumeText = "";
  console.log('Starting with empty text');
  
  // Add all profile fields
  console.log('\n--- Adding Profile Fields ---');
  const profileName = resume.profile?.name || '';
  const profileSummary = resume.profile?.summary || '';
  const profileUrl = resume.profile?.url || '';
  const profileEmail = resume.profile?.email || '';
  const profilePhone = resume.profile?.phone || '';
  const profileLocation = resume.profile?.location || '';
  
  console.log('Name:', profileName);
  console.log('Summary:', profileSummary);
  console.log('URL:', profileUrl);
  console.log('Email:', profileEmail);
  console.log('Phone:', profilePhone);
  console.log('Location:', profileLocation);
  
  resumeText += profileName + ' ';
  resumeText += profileSummary + ' ';
  resumeText += profileUrl + ' ';
  resumeText += profileEmail + ' ';
  resumeText += profilePhone + ' ';
  resumeText += profileLocation + ' ';
  
  console.log('Resume text after profile:', resumeText);
  
  // Add all work experience fields
  console.log('\n--- Adding Work Experience Fields ---');
  if (resume.workExperiences) {
    resume.workExperiences.forEach((exp, index) => {
      console.log(`Experience ${index + 1}:`);
      const company = exp.company || '';
      const jobTitle = exp.jobTitle || '';
      const date = exp.date || '';
      console.log('  Company:', company);
      console.log('  Job Title:', jobTitle);
      console.log('  Date:', date);
      
      resumeText += company + ' ';
      resumeText += jobTitle + ' ';
      resumeText += date + ' ';
      
      if (exp.descriptions) {
        const descriptions = exp.descriptions.join(' ');
        console.log('  Descriptions:', descriptions);
        resumeText += descriptions + ' ';
      }
    });
  }
  
  // Add all education fields
  console.log('\n--- Adding Education Fields ---');
  if (resume.educations) {
    resume.educations.forEach((edu, index) => {
      console.log(`Education ${index + 1}:`);
      const school = edu.school || '';
      const degree = edu.degree || '';
      const eduDate = edu.date || '';
      const gpa = edu.gpa || '';
      console.log('  School:', school);
      console.log('  Degree:', degree);
      console.log('  Date:', eduDate);
      console.log('  GPA:', gpa);
      
      resumeText += school + ' ';
      resumeText += degree + ' ';
      resumeText += eduDate + ' ';
      resumeText += gpa + ' ';
      
      if (edu.descriptions) {
        const descriptions = edu.descriptions.join(' ');
        console.log('  Descriptions:', descriptions);
        resumeText += descriptions + ' ';
      }
    });
  }
  
  // Add all project fields
  console.log('\n--- Adding Project Fields ---');
  if (resume.projects) {
    resume.projects.forEach((proj, index) => {
      console.log(`Project ${index + 1}:`);
      const project = proj.project || '';
      const projDate = proj.date || '';
      console.log('  Project:', project);
      console.log('  Date:', projDate);
      
      resumeText += project + ' ';
      resumeText += projDate + ' ';
      
      if (proj.descriptions) {
        const descriptions = proj.descriptions.join(' ');
        console.log('  Descriptions:', descriptions);
        resumeText += descriptions + ' ';
      }
    });
  }
  
  // Add all skills fields
  console.log('\n--- Adding Skills Fields ---');
  if (resume.skills) {
    if (resume.skills.featuredSkills) {
      console.log('Featured Skills:');
      resume.skills.featuredSkills.forEach((skill, index) => {
        const skillName = skill.skill || '';
        console.log(`  Skill ${index + 1}:`, skillName);
        resumeText += skillName + ' ';
      });
    }
    if (resume.skills.descriptions) {
      const descriptions = resume.skills.descriptions.join(' ');
      console.log('Skills Descriptions:', descriptions);
      resumeText += descriptions + ' ';
    }
  }
  
  // Add all custom fields
  console.log('\n--- Adding Custom Fields ---');
  if (resume.custom && resume.custom.descriptions) {
    const descriptions = resume.custom.descriptions.join(' ');
    console.log('Custom Descriptions:', descriptions);
    resumeText += descriptions + ' ';
  }
  
  console.log('\n=== FINAL RESUME TEXT ===');
  console.log('"' + resumeText + '"');
  console.log('Length:', resumeText.length);
  
  const linkedinFound = resumeText.toLowerCase().includes('linkedin');
  console.log('\nLinkedIn found:', linkedinFound);
  
  if (!linkedinFound) {
    console.log('\n=== DETAILED SEARCH ===');
    const lowerText = resumeText.toLowerCase();
    console.log('Searching in lowercase text...');
    
    // Check if "linkedin" exists at all
    const positions = [];
    for (let i = 0; i <= lowerText.length - 7; i++) {
      if (lowerText.substring(i, i + 7) === 'linkedin') {
        positions.push(i);
      }
    }
    
    if (positions.length > 0) {
      console.log('Found "linkedin" at positions:', positions);
    } else {
      console.log('No "linkedin" found in text');
      
      // Let's check for similar words
      console.log('\nChecking for similar words:');
      const wordsToCheck = ['linked', 'linked in', 'linked-in', 'linkedIn'];
      wordsToCheck.forEach(word => {
        if (lowerText.includes(word)) {
          console.log(`Found "${word}" in text`);
        }
      });
    }
  }
  
  return resumeText;
}

// Test with a sample resume that contains LinkedIn
const testResume = {
  profile: {
    name: "Chandravamsi",
    email: "chandravamsi3437@gmail.com",
    summary: "Experienced professional | LinkedIn",
    url: "",
    phone: "",
    location: ""
  },
  workExperiences: [],
  educations: [],
  projects: [],
  skills: {
    featuredSkills: [],
    descriptions: []
  },
  custom: {
    descriptions: []
  }
};

debugResumeTextExtraction(testResume);

module.exports = { debugResumeTextExtraction };