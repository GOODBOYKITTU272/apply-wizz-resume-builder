import type {
  TextItem,
  FeatureSet,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import type { ResumeEducation } from "lib/redux/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import {
  DATE_FEATURE_SETS,
  hasComma,
  hasLetter,
  hasNumber,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

/**
 *              Unique Attribute
 * School       Has school
 * Degree       Has degree
 * GPA          Has number
 */

// prettier-ignore
const SCHOOLS = ['College', 'University', 'Institute', 'School', 'Academy', 'BASIS', 'Magnet']
const hasSchool = (item: TextItem) =>
  SCHOOLS.some((school) => item.text.includes(school));
// prettier-ignore
const DEGREES = ["Associate", "Bachelor", "Master", "PhD", "Ph."];
const hasDegree = (item: TextItem) =>
  DEGREES.some((degree) => item.text.includes(degree)) ||
  /[ABM][A-Z\.]/.test(item.text); // Match AA, B.S., MBA, etc.
const matchGPA = (item: TextItem) => item.text.match(/[0-4]\.\d{1,2}/);
const matchGrade = (item: TextItem) => {
  const grade = parseFloat(item.text);
  if (Number.isFinite(grade) && grade <= 110) {
    return [String(grade)] as RegExpMatchArray;
  }
  return null;
};

const SCHOOL_FEATURE_SETS: FeatureSet[] = [
  [hasSchool, 4],
  [hasDegree, -4],
  [hasNumber, -4],
];

const DEGREE_FEATURE_SETS: FeatureSet[] = [
  [hasDegree, 4],
  [hasSchool, -4],
  [hasNumber, -3],
];

const GPA_FEATURE_SETS: FeatureSet[] = [
  [matchGPA, 4, true],
  [matchGrade, 3, true],
  [hasComma, -3],
  [hasLetter, -4],
];

export const extractEducation = (sections: ResumeSectionToLines) => {
  const educations: ResumeEducation[] = [];
  const educationsScores = [];
  const lines = getSectionLinesByKeywords(sections, ["education"]);
  const subsections = divideSectionIntoSubsections(lines);
  for (const subsectionLines of subsections) {
    const textItems = subsectionLines.flat();
    let [school, schoolScores] = getTextWithHighestFeatureScore(
      textItems,
      SCHOOL_FEATURE_SETS
    );
    
    // Fallback for school extraction
    if (!school && textItems.length > 0) {
      // Try to find a line that looks like a school name
      const schoolItem = textItems.find(item => 
        item.text && 
        (item.text.includes('University') || 
         item.text.includes('College') || 
         item.text.includes('Institute') ||
         item.text.includes('School'))
      );
      if (schoolItem) {
        school = schoolItem.text;
        schoolScores = [{ text: schoolItem.text, score: 1, match: true }];
      }
    }
    
    let [degree, degreeScores] = getTextWithHighestFeatureScore(
      textItems,
      DEGREE_FEATURE_SETS
    );
    
    // Fallback for degree extraction
    if (!degree && textItems.length > 0) {
      // Try to find a line that looks like a degree
      const degreeItem = textItems.find(item => 
        item.text && 
        (item.text.includes('Bachelor') || 
         item.text.includes('Master') || 
         item.text.includes('PhD') ||
         /[A-Z][A-Z]\.?\s/.test(item.text)) // Match B.S., M.A., etc.
      );
      if (degreeItem) {
        degree = degreeItem.text;
        degreeScores = [{ text: degreeItem.text, score: 1, match: true }];
      }
    }
    
    let [gpa, gpaScores] = getTextWithHighestFeatureScore(
      textItems,
      GPA_FEATURE_SETS
    );
    
    // Fallback for GPA extraction
    if (!gpa && textItems.length > 0) {
      // Try to find a line that looks like a GPA
      const gpaItem = textItems.find(item => 
        item.text && /[0-4]\.?\d{1,2}/.test(item.text)
      );
      if (gpaItem) {
        gpa = gpaItem.text;
        gpaScores = [{ text: gpaItem.text, score: 1, match: true }];
      }
    }
    
    let [date, dateScores] = getTextWithHighestFeatureScore(
      textItems,
      DATE_FEATURE_SETS
    );
    
    // Fallback for date extraction
    if (!date && textItems.length > 0) {
      // Try to find a line that looks like a date
      const dateItem = textItems.find(item => 
        item.text && (hasNumber(item) || item.text.includes('-') || item.text.includes('/'))
      );
      if (dateItem) {
        date = dateItem.text;
        dateScores = [{ text: dateItem.text, score: 1, match: true }];
      }
    }

    let descriptions: string[] = [];
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines);
    if (descriptionsLineIdx !== undefined) {
      const descriptionsLines = subsectionLines.slice(descriptionsLineIdx);
      descriptions = getBulletPointsFromLines(descriptionsLines);
    }

    // Only add education if we have at least some information
    if (school || degree || gpa || date || descriptions.length > 0) {
      educations.push({ 
        school: school || '', 
        degree: degree || '', 
        gpa: gpa || '', 
        date: date || '', 
        descriptions: descriptions || [] 
      });
      
      educationsScores.push({
        schoolScores,
        degreeScores,
        gpaScores,
        dateScores,
      });
    }
  }

  // Fallback: if no educations found, try to parse from any section that looks like education
  if (educations.length === 0) {
    // Look for any section that might contain education information
    Object.entries(sections).forEach(([sectionName, sectionLines]) => {
      if (sectionName.toLowerCase().includes('education') || 
          sectionName.toLowerCase().includes('academic')) {
        
        const subsections = divideSectionIntoSubsections(sectionLines);
        for (const subsectionLines of subsections) {
          if (subsectionLines.length > 0) {
            // Try to extract information from the subsection
            const flatLines = subsectionLines.flat();
            if (flatLines.length > 0) {
              // Simple heuristic: take first line as school, second as degree/date, rest as descriptions
              const school = flatLines[0]?.text || '';
              const degreeOrDate = flatLines[1]?.text || '';
              const descriptions = flatLines.slice(2).map(item => item.text).filter(text => text.trim().length > 0);
              
              if (school || degreeOrDate || descriptions.length > 0) {
                educations.push({
                  school,
                  degree: degreeOrDate.includes('Bachelor') || degreeOrDate.includes('Master') ? degreeOrDate : '',
                  gpa: '',
                  date: degreeOrDate.includes('20') ? degreeOrDate : '',
                  descriptions
                });
              }
            }
          }
        }
      }
    });
  }

  if (educations.length !== 0) {
    const coursesLines = getSectionLinesByKeywords(sections, ["course"]);
    if (coursesLines.length !== 0) {
      educations[0].descriptions.push(
        "Courses: " +
          coursesLines
            .flat()
            .map((item) => item.text)
            .join(" ")
      );
    }
  }

  return {
    educations,
    educationsScores,
  };
};