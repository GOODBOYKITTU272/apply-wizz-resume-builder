// Simple JavaScript test for LinkedIn detection

// Sample resume data with LinkedIn in various places
const testResume = {
  profile: {
    name: "John Doe",
    summary: "Experienced software developer with expertise in React and Node.js. Connect with me on LinkedIn for professional networking.",
    url: "https://github.com/johndoe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    location: "San Francisco, CA"
  },
  workExperiences: [
    {
      company: "Tech Corp",
      jobTitle: "Senior Developer",
      date: "2020-Present",
      descriptions: [
        "Led development of key features using React and Node.js",
        "Mentioned LinkedIn profile in professional networking events"
      ]
    }
  ],
  educations: [
    {
      school: "University of Technology",
      degree: "BS Computer Science",
      date: "2016-2020",
      gpa: "3.8",
      descriptions: ["Active member of professional networking groups including LinkedIn"]
    }
  ],
  projects: [
    {
      project: "Social Media Dashboard",
      date: "2021",
      descriptions: ["Integrated LinkedIn API for professional networking features"]
    }
  ],
  skills: {
    featuredSkills: [
      { skill: "React" },
      { skill: "Node.js" },
      { skill: "LinkedIn API" }
    ],
    descriptions: ["Professional networking through LinkedIn platform"]
  },
  custom: {
    descriptions: ["LinkedIn: linkedin.com/in/johndoe"]
  }
};

// Function to extract all text from resume
function extractResumeText(resume) {
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
    resume.workExperiences.forEach((exp) => {
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
    resume.educations.forEach((edu) => {
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
    resume.projects.forEach((proj) => {
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
      resume.skills.featuredSkills.forEach((skill) => {
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

// Test the detection
const resumeText = extractResumeText(testResume);
const linkedinFound = resumeText.toLowerCase().includes('linkedin');

console.log('=== LinkedIn Detection Debug ===');
console.log('Complete resume text:');
console.log(resumeText);
console.log('\nLength of resume text:', resumeText.length);
console.log('\nLinkedIn found:', linkedinFound);

if (linkedinFound) {
  // Find all positions of "linkedin" in the text
  const positions = [];
  let pos = resumeText.toLowerCase().indexOf('linkedin');
  while (pos !== -1) {
    positions.push(pos);
    pos = resumeText.toLowerCase().indexOf('linkedin', pos + 1);
  }
  console.log('\nLinkedIn found at positions:', positions);
}