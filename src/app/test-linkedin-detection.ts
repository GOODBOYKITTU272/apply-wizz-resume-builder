// Test file to debug LinkedIn detection issues
import { debugResumeText } from './debug-detection';

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

// Test the detection
const resumeText = debugResumeText(testResume);
const linkedinFound = resumeText.toLowerCase().includes('linkedin');

console.log('=== LinkedIn Detection Debug ===');
console.log('Complete resume text:');
console.log(resumeText);
console.log('\nLength of resume text:', resumeText.length);
console.log('\nLinkedIn found:', linkedinFound);

if (linkedinFound) {
  // Find all positions of "linkedin" in the text
  const positions: number[] = [];
  let pos = resumeText.toLowerCase().indexOf('linkedin');
  while (pos !== -1) {
    positions.push(pos);
    pos = resumeText.toLowerCase().indexOf('linkedin', pos + 1);
  }
  console.log('\nLinkedIn found at positions:', positions);
}

export {};