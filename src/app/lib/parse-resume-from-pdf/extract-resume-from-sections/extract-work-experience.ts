import type { ResumeWorkExperience } from "lib/redux/types";
import type {
  TextItem,
  FeatureSet,
  ResumeSectionToLines,
  TextScores
} from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import {
  DATE_FEATURE_SETS,
  hasNumber,
  getHasText,
  isBold,
  hasLetter
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

// Import the regex matchers from profile extraction
import { matchEmail, matchPhone } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";

// prettier-ignore
const WORK_EXPERIENCE_KEYWORDS_LOWERCASE = ['work', 'experience', 'employment', 'history', 'job'];
// prettier-ignore
const JOB_TITLES = ['Accountant', 'Administrator', 'Advisor', 'Agent', 'Analyst', 'Apprentice', 'Architect', 'Assistant', 'Associate', 'Auditor', 'Bartender', 'Biologist', 'Bookkeeper', 'Buyer', 'Carpenter', 'Cashier', 'CEO', 'Clerk', 'Co-op', 'Co-Founder', 'Consultant', 'Coordinator', 'CTO', 'Developer', 'Designer', 'Director', 'Driver', 'Editor', 'Electrician', 'Engineer', 'Extern', 'Founder', 'Freelancer', 'Head', 'Intern', 'Janitor', 'Journalist', 'Laborer', 'Lawyer', 'Lead', 'Manager', 'Mechanic', 'Member', 'Nurse', 'Officer', 'Operator', 'Operation', 'Photographer', 'President', 'Producer', 'Recruiter', 'Representative', 'Researcher', 'Sales', 'Server', 'Scientist', 'Specialist', 'Supervisor', 'Teacher', 'Technician', 'Trader', 'Trainee', 'Treasurer', 'Tutor', 'Vice', 'VP', 'Volunteer', 'Webmaster', 'Worker'];

const hasJobTitle = (item: TextItem) =>
  JOB_TITLES.some((jobTitle) =>
    item.text.split(/\s/).some((word) => word === jobTitle)
  );
const hasMoreThan5Words = (item: TextItem) => item.text.split(/\s/).length > 5;
const JOB_TITLE_FEATURE_SET: FeatureSet[] = [
  [hasJobTitle, 4],
  [hasNumber, -4],
  [hasMoreThan5Words, -2],
];

export const extractWorkExperience = (sections: ResumeSectionToLines) => {
  const workExperiences: ResumeWorkExperience[] = [];
  const workExperiencesScores = [];
  const lines = getSectionLinesByKeywords(
    sections,
    WORK_EXPERIENCE_KEYWORDS_LOWERCASE
  );
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 2;

    const subsectionInfoTextItems = subsectionLines
      .slice(0, descriptionsLineIdx)
      .flat();
    
    // Enhanced date extraction with fallbacks
    let [date, dateScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      DATE_FEATURE_SETS
    );
    
    // Fallback for date extraction
    if (!date && subsectionInfoTextItems.length > 0) {
      const dateItem = subsectionInfoTextItems.find(item => 
        item.text && (hasNumber(item) || item.text.includes('-') || item.text.includes('/'))
      );
      if (dateItem) {
        date = dateItem.text;
        dateScores = [{ text: dateItem.text, score: 1, match: true }];
      }
    }

    // Enhanced job title extraction with fallbacks
    let [jobTitle, jobTitleScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      JOB_TITLE_FEATURE_SET
    );
    
    // Fallback for job title extraction
    if (!jobTitle && subsectionInfoTextItems.length > 0) {
      // Try to find a line that looks like a job title
      const titleItem = subsectionInfoTextItems.find(item => 
        item.text && 
        item.text.trim().length > 0 && 
        !matchPhone(item) && 
        !matchEmail(item) &&
        !hasNumber(item)
      );
      if (titleItem) {
        jobTitle = titleItem.text;
        jobTitleScores = [{ text: titleItem.text, score: 1, match: true }];
      }
    }

    // Enhanced company extraction with fallbacks
    const COMPANY_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
      [getHasText(jobTitle), -4],
    ];
    let [company, companyScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      COMPANY_FEATURE_SET,
      false
    );
    
    // Fallback for company extraction
    if (!company && subsectionInfoTextItems.length > 0) {
      // Try to find a line that looks like a company name
      const companyItem = subsectionInfoTextItems.find(item => 
        item.text && 
        item.text.trim().length > 0 && 
        !matchPhone(item) && 
        !matchEmail(item) &&
        item.text !== jobTitle &&
        item.text !== date
      );
      if (companyItem) {
        company = companyItem.text;
        companyScores = [{ text: companyItem.text, score: 1, match: true }];
      }
    }

    const subsectionDescriptionsLines =
      subsectionLines.slice(descriptionsLineIdx);
    const descriptions = getBulletPointsFromLines(subsectionDescriptionsLines);

    // Only add experience if we have at least some information
    if (company || jobTitle || date || descriptions.length > 0) {
      workExperiences.push({ 
        company: company || '', 
        jobTitle: jobTitle || '', 
        date: date || '', 
        descriptions: descriptions || [] 
      });
      
      workExperiencesScores.push({
        companyScores,
        jobTitleScores,
        dateScores,
      });
    }
  }
  
  // Fallback: if no work experiences found, try to parse from any section that looks like experience
  if (workExperiences.length === 0) {
    // Look for any section that might contain work experience information
    Object.entries(sections).forEach(([sectionName, sectionLines]) => {
      if (sectionName.toLowerCase().includes('work') || 
          sectionName.toLowerCase().includes('experience') || 
          sectionName.toLowerCase().includes('employment')) {
        
        const subsections = divideSectionIntoSubsections(sectionLines);
        for (const subsectionLines of subsections) {
          if (subsectionLines.length > 0) {
            // Try to extract information from the subsection
            const flatLines = subsectionLines.flat();
            if (flatLines.length > 0) {
              // Simple heuristic: take first line as company/title, second as date, rest as descriptions
              const company = flatLines[0]?.text || '';
              const date = flatLines[1]?.text || '';
              const descriptions = flatLines.slice(2).map(item => item.text).filter(text => text.trim().length > 0);
              
              if (company || date || descriptions.length > 0) {
                workExperiences.push({
                  company,
                  jobTitle: '', // We don't have a reliable way to extract this
                  date,
                  descriptions
                });
              }
            }
          }
        }
      }
    });
  }

  return { workExperiences, workExperiencesScores };
};