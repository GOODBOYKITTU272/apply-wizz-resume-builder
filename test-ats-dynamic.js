// Quick test to verify ATS scoring is truly dynamic

const resumeA = {
  profile: { name: "Test A", email: "a@test.com" },
  workExperiences: [],
  educations: [],
  skills: { featuredSkills: [] },
  projects: []
};

const resumeB = {
  profile: { name: "Test B", email: "b@test.com" },
  workExperiences: [
    { 
      company: "Tech Corp", 
      jobTitle: "Engineer", 
      descriptions: ["Improved performance by 50%", "Led team of 5 developers"] 
    }
  ],
  educations: [{ school: "University", degree: "CS" }],
  skills: { featuredSkills: ["JavaScript", "React", "Node.js"] },
  projects: [
    { 
      name: "Portfolio", 
      descriptions: ["Built with React", "Deployed on AWS"] 
    }
  ]
};

console.log('Resume A (minimal):', JSON.stringify(resumeA, null, 2));
console.log('Resume B (comprehensive):', JSON.stringify(resumeB, null, 2));
console.log('\\nKey differences:');
console.log('- Work Experience:', resumeA.workExperiences.length, 'vs', resumeB.workExperiences.length);
console.log('- Education:', resumeA.educations.length, 'vs', resumeB.educations.length);
console.log('- Skills:', resumeA.skills.featuredSkills.length, 'vs', resumeB.skills.featuredSkills.length);
console.log('- Projects:', resumeA.projects.length, 'vs', resumeB.projects.length);

console.log('\\n🧪 EXPECTATION: These should produce DIFFERENT ATS scores if our fixes work!');