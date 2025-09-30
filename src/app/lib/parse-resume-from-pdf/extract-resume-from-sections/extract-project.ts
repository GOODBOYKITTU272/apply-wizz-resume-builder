import type { ResumeProject } from "lib/redux/types";
import type {
  FeatureSet,
  ResumeSectionToLines,
  TextScores
} from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import {
  DATE_FEATURE_SETS,
  getHasText,
  isBold,
  hasNumber
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

export const extractProject = (sections: ResumeSectionToLines) => {
  const projects: ResumeProject[] = [];
  const projectsScores = [];
  const lines = getSectionLinesByKeywords(sections, ["project"]);
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 1;

    const subsectionInfoTextItems = subsectionLines
      .slice(0, descriptionsLineIdx)
      .flat();
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
    
    const PROJECT_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
    ];
    let [project, projectScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      PROJECT_FEATURE_SET,
      false
    );
    
    // Fallback for project name extraction
    if (!project && subsectionInfoTextItems.length > 0) {
      // Try to find a line that looks like a project name (bold or first line)
      const projectItem = subsectionInfoTextItems.find(item => 
        item.text && item.text.trim().length > 0
      );
      if (projectItem) {
        project = projectItem.text;
        projectScores = [{ text: projectItem.text, score: 1, match: true }];
      }
    }

    const descriptionsLines = subsectionLines.slice(descriptionsLineIdx);
    const descriptions = getBulletPointsFromLines(descriptionsLines);

    // Only add project if we have at least some information
    if (project || date || descriptions.length > 0) {
      projects.push({ 
        project: project || '', 
        date: date || '', 
        descriptions: descriptions || [] 
      });
      
      projectsScores.push({
        projectScores,
        dateScores,
      });
    }
  }
  
  // Fallback: if no projects found, try to parse from any section that looks like projects
  if (projects.length === 0) {
    // Look for any section that might contain project information
    Object.entries(sections).forEach(([sectionName, sectionLines]) => {
      if (sectionName.toLowerCase().includes('project')) {
        
        const subsections = divideSectionIntoSubsections(sectionLines);
        for (const subsectionLines of subsections) {
          if (subsectionLines.length > 0) {
            // Try to extract information from the subsection
            const flatLines = subsectionLines.flat();
            if (flatLines.length > 0) {
              // Simple heuristic: take first line as project name, second as date, rest as descriptions
              const projectName = flatLines[0]?.text || '';
              const date = flatLines[1]?.text || '';
              const descriptions = flatLines.slice(2).map(item => item.text).filter(text => text.trim().length > 0);
              
              if (projectName || date || descriptions.length > 0) {
                projects.push({
                  project: projectName,
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
  
  return { projects, projectsScores };
};