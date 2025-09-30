import { detectLinkedInInResume } from './lib/linkedin-detection';

// Test with a sample resume that contains LinkedIn
const sampleResume = {
  profile: {
    name: "John Doe",
    summary: "Software engineer with 5 years experience. Connect with me on LinkedIn for professional networking.",
    url: "https://linkedin.com/in/johndoe",
    email: "john@example.com",
    phone: "123-456-7890",
    location: "San Francisco, CA"
  },
  workExperiences: [
    {
      company: "Tech Corp",
      jobTitle: "Senior Developer",
      date: "2020-Present",
      descriptions: ["Worked on projects with team members connected through LinkedIn"]
    }
  ],
  educations: [
    {
      school: "University of Technology",
      degree: "BS Computer Science",
      date: "2015-2019",
      gpa: "3.8",
      descriptions: ["Active in professional networking groups including LinkedIn"]
    }
  ],
  projects: [],
  skills: {
    featuredSkills: [
      { skill: "JavaScript" },
      { skill: "LinkedIn API" }
    ],
    descriptions: ["Experienced with LinkedIn integration"]
  },
  custom: {
    descriptions: ["Find me on LinkedIn: johndoe"]
  }
};

console.log("=== DEBUGGING LINKEDIN DETECTION ===");
const result = detectLinkedInInResume(sampleResume);
console.log("Final Result:", result);