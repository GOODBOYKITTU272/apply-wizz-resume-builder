"use client";
import { useState, useEffect, useMemo } from "react";
import { readPdf } from "../lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "../lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "../lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "../lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "../lib/parse-resume-from-pdf/extract-resume-from-sections";
import { calculateATSScore } from "../lib/ats-score";
import { ATSScoreCard } from "components/ATSScoreCard";
import { DetailedATSReportComponent } from "components/DetailedATSReport";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "../lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { QuickATSScore } from "components/QuickATSScore";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import { detectLinkedInInResume } from "../lib/linkedin-detection";
import { generateDetailedATSReport } from "../lib/ats-detailed-report";

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    description: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    description: (
      <span>
        Created with Apply Wizz resume builder -{" "}
        <Link href="/resume-builder">Link</Link>
      </span>
    ),
  },
];

const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];
export default function ResumeParser() {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);
  
  // Debug LinkedIn detection
  useEffect(() => {
    console.log('=== RESUME OBJECT FOR DEBUGGING ===');
    console.log(JSON.parse(JSON.stringify(resume)));
    
    // Manual LinkedIn detection for debugging
    let resumeText = "";
    
    // Profile section
    if (resume.profile) {
      const profileFields = [
        resume.profile.name,
        resume.profile.summary,
        resume.profile.url,
        resume.profile.email,
        resume.profile.phone,
        resume.profile.location
      ];
      
      profileFields.forEach((field) => {
        if (field) {
          resumeText += field + ' ';
        }
      });
    }
    
    // Work experiences
    if (Array.isArray(resume.workExperiences)) {
      resume.workExperiences.forEach((exp: any) => {
        if (exp) {
          const expFields = [
            exp.company,
            exp.jobTitle,
            exp.date
          ];
          
          expFields.forEach(field => {
            if (field) {
              resumeText += field + ' ';
            }
          });
          
          if (Array.isArray(exp.descriptions)) {
            const descriptions = exp.descriptions.join(' ');
            resumeText += descriptions + ' ';
          }
        }
      });
    }
    
    // Education
    if (Array.isArray(resume.educations)) {
      resume.educations.forEach((edu: any) => {
        if (edu) {
          const eduFields = [
            edu.school,
            edu.degree,
            edu.date,
            edu.gpa
          ];
          
          eduFields.forEach(field => {
            if (field) {
              resumeText += field + ' ';
            }
          });
          
          if (Array.isArray(edu.descriptions)) {
            const descriptions = edu.descriptions.join(' ');
            resumeText += descriptions + ' ';
          }
        }
      });
    }
    
    // Projects
    if (Array.isArray(resume.projects)) {
      resume.projects.forEach((proj: any) => {
        if (proj) {
          const projFields = [
            proj.project,
            proj.date
          ];
          
          projFields.forEach(field => {
            if (field) {
              resumeText += field + ' ';
            }
          });
          
          if (Array.isArray(proj.descriptions)) {
            const descriptions = proj.descriptions.join(' ');
            resumeText += descriptions + ' ';
          }
        }
      });
    }
    
    // Skills
    if (resume.skills) {
      if (Array.isArray(resume.skills.featuredSkills)) {
        resume.skills.featuredSkills.forEach((skill: any) => {
          if (skill && skill.skill) {
            resumeText += skill.skill + ' ';
          }
        });
      }
      
      if (Array.isArray(resume.skills.descriptions)) {
        const descriptions = resume.skills.descriptions.join(' ');
        resumeText += descriptions + ' ';
      }
    }
    
    // Custom section
    if (resume.custom && Array.isArray(resume.custom.descriptions)) {
      const descriptions = resume.custom.descriptions.join(' ');
      resumeText += descriptions + ' ';
    }
    
    console.log('=== DEBUG: COMPLETE RESUME TEXT ===');
    console.log('"' + resumeText + '"');
    
    const trimmedText = resumeText.trim();
    const lowerText = trimmedText.toLowerCase();
    
    console.log('=== DEBUG: LINKEDIN DETECTION ===');
    console.log('Trimmed text:', '"' + trimmedText + '"');
    console.log('Lowercase text:', '"' + lowerText + '"');
    
    const linkedinFound = lowerText.includes('linkedin');
    console.log('LinkedIn found in text:', linkedinFound);
    
    if (linkedinFound) {
      console.log('=== LINKEDIN POSITIONS ===');
      const positions: number[] = [];
      for (let i = 0; i <= lowerText.length - 7; i++) {
        if (lowerText.substring(i, i + 7) === 'linkedin') {
          positions.push(i);
        }
      }
      console.log('Found "linkedin" at positions:', positions);
    }
  }, [resume]);
  
  // Calculate ATS Score
  const atsScore = useMemo(() => {
    return calculateATSScore(resume);
  }, [resume]);

  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  return (
    <main className="h-full w-full overflow-hidden">
      <div className="grid md:grid-cols-6">
        <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
          <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
            <div className="aspect-h-[9.5] aspect-w-7">
              <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
            </div>
          </section>
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
        </div>
        <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
          <section className="max-w-[600px] grow">
            <div className="flex items-center justify-between mb-4">
              <Heading className="text-primary !mt-4 !mb-0">
                Apply Wizz ATS Scanner
              </Heading>
              <div className="hidden sm:flex">
                <QuickATSScore 
                  score={atsScore} 
                  onClick={() => setShowDetailedReport(true)}
                />
              </div>
            </div>
            <Paragraph smallMarginTop={true}>
              This powerful tool showcases Apply Wizz's resume parsing technology that ensures your resume is ATS-friendly. 
              Upload your resume to see how well it would be parsed by Applicant Tracking Systems used by major companies.
            </Paragraph>
            
            {/* Mobile Quick Score */}
            <div className="sm:hidden mb-4">
              <QuickATSScore 
                score={atsScore} 
                onClick={() => setShowDetailedReport(true)}
              />
            </div>
            <div className="mt-3 flex gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50",
                    example.fileUrl === fileUrl
                      ? "border-blue-400"
                      : "border-gray-300"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key))
                      setFileUrl(example.fileUrl);
                  }}
                  tabIndex={0}
                >
                  <h1 className="font-semibold">Resume Example {idx + 1}</h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {example.description}
                  </p>
                </article>
              ))}
            </div>
            <Paragraph>
              You can also{" "}
              <span className="font-semibold">upload your resume below</span> to
              test how well it would be parsed by Application Tracking Systems (ATS) 
              used by companies like Google, Meta, Microsoft, and Amazon. Apply Wizz's 
              ATS scanner helps ensure your resume passes initial screening. The more information 
              it can parse accurately, the better your chances of landing interviews.
            </Paragraph>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={(fileUrl) =>
                  setFileUrl(fileUrl || defaultFileUrl)
                }
                playgroundView={true}
              />
            </div>
            
            {/* ATS Score Section */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  onClick={() => setShowDetailedReport(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  📄 Generate Detailed ATS Report
                </button>
              </div>
              <ATSScoreCard score={atsScore} />
            </div>
            
            {/* Detailed Report Modal */}
            {showDetailedReport && (
              <DetailedATSReportComponent
                report={(() => {
                  const report = generateDetailedATSReport(resume, atsScore);
                  // Override position if available from work experience
                  const latestJobTitle = resume.workExperiences?.[0]?.jobTitle;
                  if (latestJobTitle && latestJobTitle.trim()) {
                    report.position = latestJobTitle.trim();
                  } else if (resume.profile.summary) {
                    const summaryWords = resume.profile.summary.split(' ').slice(0, 3).join(' ').replace(/[.,]/g, '').trim();
                    if (summaryWords) {
                      report.position = summaryWords;
                    }
                  } else {
                    report.position = "Professional";
                  }
                  return report;
                })()}
                onClose={() => setShowDetailedReport(false)}
              />
            )}
            
            <Heading level={2} className="!mt-[1.2em]">
              Detailed Parsing Data
            </Heading>
            <ResumeTable resume={resume} />
            <div className="pt-24" />
          </section>
        </div>
      </div>
    </main>
  );
}
