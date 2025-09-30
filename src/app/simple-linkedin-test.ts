import { detectLinkedInInResume } from './lib/linkedin-detection';

// Simple test case
const testResume = {
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
};

console.log("Testing LinkedIn detection...");
const result = detectLinkedInInResume(testResume);
console.log("LinkedIn found:", result);