// Direct test of LinkedIn detection logic
function detectLinkedInInResume(resume: any): boolean {
  console.log('=== STARTING LINKEDIN DETECTION ===');
  console.log('Resume object:', JSON.parse(JSON.stringify(resume)));
  
  try {
    let resumeText = "";
    
    // Profile section
    console.log('--- Checking Profile Section ---');
    if (resume.profile) {
      const profileFields = [
        resume.profile.name,
        resume.profile.summary,
        resume.profile.url,
        resume.profile.email,
        resume.profile.phone,
        resume.profile.location
      ];
      
      profileFields.forEach((field, index) => {
        const fieldName = ['name', 'summary', 'url', 'email', 'phone', 'location'][index];
        if (field) {
          console.log(`Profile ${fieldName}:`, field);
          resumeText += field + ' ';
        }
      });
    }
    
    // Work experiences
    console.log('--- Checking Work Experiences ---');
    if (Array.isArray(resume.workExperiences)) {
      resume.workExperiences.forEach((exp: any, index: number) => {
        console.log(`Experience ${index + 1}:`, exp);
        if (exp) {
          const expFields = [
            exp.company,
            exp.jobTitle,
            exp.date
          ];
          
          expFields.forEach(field => {
            if (field) {
              console.log('  Field:', field);
              resumeText += field + ' ';
            }
          });
          
          if (Array.isArray(exp.descriptions)) {
            const descriptions = exp.descriptions.join(' ');
            console.log('  Descriptions:', descriptions);
            resumeText += descriptions + ' ';
          }
        }
      });
    }
    
    // Education
    console.log('--- Checking Education ---');
    if (Array.isArray(resume.educations)) {
      resume.educations.forEach((edu: any, index: number) => {
        console.log(`Education ${index + 1}:`, edu);
        if (edu) {
          const eduFields = [
            edu.school,
            edu.degree,
            edu.date,
            edu.gpa
          ];
          
          eduFields.forEach(field => {
            if (field) {
              console.log('  Field:', field);
              resumeText += field + ' ';
            }
          });
          
          if (Array.isArray(edu.descriptions)) {
            const descriptions = edu.descriptions.join(' ');
            console.log('  Descriptions:', descriptions);
            resumeText += descriptions + ' ';
          }
        }
      });
    }
    
    // Projects
    console.log('--- Checking Projects ---');
    if (Array.isArray(resume.projects)) {
      resume.projects.forEach((proj: any, index: number) => {
        console.log(`Project ${index + 1}:`, proj);
        if (proj) {
          const projFields = [
            proj.project,
            proj.date
          ];
          
          projFields.forEach(field => {
            if (field) {
              console.log('  Field:', field);
              resumeText += field + ' ';
            }
          });
          
          if (Array.isArray(proj.descriptions)) {
            const descriptions = proj.descriptions.join(' ');
            console.log('  Descriptions:', descriptions);
            resumeText += descriptions + ' ';
          }
        }
      });
    }
    
    // Skills
    console.log('--- Checking Skills ---');
    if (resume.skills) {
      if (Array.isArray(resume.skills.featuredSkills)) {
        console.log('Featured Skills:');
        resume.skills.featuredSkills.forEach((skill: any, index: number) => {
          console.log(`  Skill ${index + 1}:`, skill);
          if (skill && skill.skill) {
            console.log('    Skill name:', skill.skill);
            resumeText += skill.skill + ' ';
          }
        });
      }
      
      if (Array.isArray(resume.skills.descriptions)) {
        const descriptions = resume.skills.descriptions.join(' ');
        console.log('Skills Descriptions:', descriptions);
        resumeText += descriptions + ' ';
      }
    }
    
    // Custom section
    console.log('--- Checking Custom Section ---');
    if (resume.custom && Array.isArray(resume.custom.descriptions)) {
      const descriptions = resume.custom.descriptions.join(' ');
      console.log('Custom Descriptions:', descriptions);
      resumeText += descriptions + ' ';
    }
    
    // Final text processing
    console.log('=== FINAL RESUME TEXT ===');
    console.log('"' + resumeText + '"');
    console.log('Text length:', resumeText.length);
    
    // Detection logic
    const trimmedText = resumeText.trim();
    console.log('Trimmed text:', '"' + trimmedText + '"');
    
    const lowerText = trimmedText.toLowerCase();
    console.log('Lowercase text:', '"' + lowerText + '"');
    
    // Primary detection
    const primaryFound = lowerText.includes('linkedin');
    console.log('Primary detection (includes "linkedin"):', primaryFound);
    
    // Secondary detection with regex for more robust matching
    const regexFound = /linkedin/i.test(trimmedText);
    console.log('Regex detection (/linkedin/i):', regexFound);
    
    // Manual character-by-character search
    console.log('--- MANUAL CHARACTER SEARCH ---');
    const linkedinPositions: number[] = [];
    for (let i = 0; i <= lowerText.length - 7; i++) {
      if (lowerText.substring(i, i + 7) === 'linkedin') {
        linkedinPositions.push(i);
      }
    }
    console.log('Manual search found "linkedin" at positions:', linkedinPositions);
    
    // Check for similar words that might be causing confusion
    console.log('--- CHECKING FOR SIMILAR WORDS ---');
    const similarWords = ['linked', 'linked in', 'linked-in'];
    similarWords.forEach(word => {
      if (lowerText.includes(word)) {
        console.log(`Found similar word "${word}" in text`);
      }
    });
    
    const finalResult = primaryFound || regexFound || linkedinPositions.length > 0;
    console.log('=== FINAL DETECTION RESULT ===');
    console.log('LinkedIn found:', finalResult);
    
    return finalResult;
  } catch (error) {
    console.error('Error in LinkedIn detection:', error);
    return false;
  }
}

// Test cases
const testCases = [
  {
    name: "Basic LinkedIn in summary",
    resume: {
      profile: {
        name: "John Doe",
        summary: "Software engineer with 5 years experience. Find me on LinkedIn for professional networking.",
        email: "john@example.com"
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
    },
    expected: true
  },
  {
    name: "No LinkedIn anywhere",
    resume: {
      profile: {
        name: "Alice Brown",
        summary: "Marketing specialist",
        email: "alice@example.com"
      },
      workExperiences: [
        {
          company: "Marketing Agency",
          jobTitle: "Manager",
          descriptions: ["Managed social media campaigns"]
        }
      ],
      educations: [],
      projects: [],
      skills: {
        featuredSkills: [],
        descriptions: []
      },
      custom: {
        descriptions: []
      }
    },
    expected: false
  }
];

console.log("=== DIRECT LINKEDIN DETECTION TESTS ===\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log("Expected:", testCase.expected);
  
  const result = detectLinkedInInResume(testCase.resume);
  console.log("Actual:", result);
  
  if (result === testCase.expected) {
    console.log("✅ PASS\n");
  } else {
    console.log("❌ FAIL\n");
  }
});