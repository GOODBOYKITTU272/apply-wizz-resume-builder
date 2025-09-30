// Comprehensive test for LinkedIn detection
import { detectLinkedInInResume } from './lib/linkedin-detection';

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
    name: "LinkedIn in work experience",
    resume: {
      profile: {
        name: "Jane Smith",
        summary: "Experienced developer",
        email: "jane@example.com"
      },
      workExperiences: [
        {
          company: "Tech Corp",
          jobTitle: "Senior Developer",
          descriptions: ["Connected with colleagues on LinkedIn for professional development"]
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
    expected: true
  },
  {
    name: "LinkedIn in education",
    resume: {
      profile: {
        name: "Bob Johnson",
        summary: "Recent graduate",
        email: "bob@example.com"
      },
      workExperiences: [],
      educations: [
        {
          school: "University of Technology",
          descriptions: ["Active member of professional networking groups including LinkedIn"]
        }
      ],
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

console.log("=== LINKEDIN DETECTION VERIFICATION TESTS ===\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log("Expected:", testCase.expected);
  
  const result = detectLinkedInInResume(testCase.resume);
  console.log("Actual:", result);
  
  if (result === testCase.expected) {
    console.log("✅ PASS\n");
    passedTests++;
  } else {
    console.log("❌ FAIL\n");
  }
});

console.log(`=== SUMMARY ===`);
console.log(`Passed: ${passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed! LinkedIn detection is working correctly.");
} else {
  console.log("⚠️  Some tests failed. LinkedIn detection may need adjustment.");
}

export {};