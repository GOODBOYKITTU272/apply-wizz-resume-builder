/**
 * Robust LinkedIn detection function with comprehensive debugging
 * @param resume The resume object to search for LinkedIn
 * @returns boolean indicating if LinkedIn was found
 */
export function detectLinkedInInResume(resume: any): boolean {
  console.log('=== STARTING LINKEDIN DETECTION ===');
  console.log('Resume object:', JSON.parse(JSON.stringify(resume)));
  
  try {
    // First, check if LinkedIn is directly in the URL field (most common case)
    console.log('--- CHECKING PROFILE URL FIELD ---');
    if (resume.profile && resume.profile.url) {
      console.log('Profile URL:', resume.profile.url);
      const lowerUrl = resume.profile.url.toLowerCase();
      if (lowerUrl.includes('linkedin.com') || lowerUrl.includes('linkedin')) {
        console.log('LinkedIn found in profile URL field');
        return true;
      }
    }
    
    // Also check if "LinkedIn" word is in the URL field
    if (resume.profile && resume.profile.url) {
      const urlText = resume.profile.url;
      console.log('Checking URL field for "LinkedIn":', urlText);
      if (urlText.toLowerCase().includes('linkedin')) {
        console.log('LinkedIn found in URL field text');
        return true;
      }
    }
    
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
    
    // Additional check for URL format
    console.log('--- CHECKING FOR LINKEDIN URL ---');
    const linkedinUrlFound = /linkedin\.com/i.test(trimmedText);
    console.log('LinkedIn URL found:', linkedinUrlFound);
    
    const finalResult = primaryFound || regexFound || linkedinPositions.length > 0 || linkedinUrlFound;
    console.log('=== FINAL DETECTION RESULT ===');
    console.log('LinkedIn found:', finalResult);
    
    return finalResult;
  } catch (error) {
    console.error('Error in LinkedIn detection:', error);
    return false;
  }
}