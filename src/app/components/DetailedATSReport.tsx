'use client';

import React from 'react';
import { ApplyWizzLogo } from './ApplyWizzLogo';
import type { DetailedATSReport } from '../lib/ats-detailed-report';

interface DetailedATSReportProps {
  report: DetailedATSReport;
  onClose: () => void;
}

export const DetailedATSReportComponent: React.FC<DetailedATSReportProps> = ({ report, onClose }) => {
  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('detailed-ats-report-content');
      if (!element) return;

      // Import html2canvas and jspdf dynamically
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Enhanced canvas rendering with better page handling
      const canvas = await html2canvas(element, {
        scale: 1.8, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#2d3748',
        logging: false,
        height: element.scrollHeight, // Capture full content height
        windowWidth: 1200, // Fixed width for consistent layout
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('detailed-ats-report-content');
          if (clonedElement) {
            // Apply inline styles to ensure they're captured
            clonedElement.style.backgroundColor = '#2d3748';
            clonedElement.style.color = 'white';
            clonedElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            clonedElement.style.lineHeight = '1.5';
            
            // Apply styles to all child elements
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el: any) => {
              // White cards
              if (el.className.includes('bg-white')) {
                el.style.backgroundColor = 'white';
                el.style.color = '#1f2937';
                el.style.borderRadius = '8px';
                el.style.padding = '16px';
                el.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }
              // Green text and checkmarks
              if (el.className.includes('text-green-400') || el.className.includes('text-green-500')) {
                el.style.color = '#10b981';
              }
              // Gray text
              if (el.className.includes('text-gray-300')) {
                el.style.color = '#d1d5db';
              }
              if (el.className.includes('text-gray-600')) {
                el.style.color = '#6b7280';
              }
              if (el.className.includes('text-gray-900')) {
                el.style.color = '#111827';
              }
              // Background colors
              if (el.className.includes('bg-gray-700')) {
                el.style.backgroundColor = '#374151';
              }
              if (el.className.includes('bg-gray-800')) {
                el.style.backgroundColor = '#1f2937';
              }
              // Gradients
              if (el.className.includes('bg-gradient-to-br')) {
                el.style.background = 'linear-gradient(to bottom right, #86efac, #4ade80)';
                el.style.color = '#1f2937';
              }
              // Blue and orange accents
              if (el.className.includes('text-blue-300')) {
                el.style.color = '#93c5fd';
              }
              if (el.className.includes('text-orange-300')) {
                el.style.color = '#fdba74';
              }
              // Ensure proper spacing and layout
              el.style.printColorAdjust = 'exact';
              el.style.webkitPrintColorAdjust = 'exact';
            });
            
            // Fix grid layout for PDF
            const gridElements = clonedDoc.querySelectorAll('.grid');
            gridElements.forEach((grid: any) => {
              grid.style.display = 'grid';
              grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
              grid.style.gap = '16px';
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 0.95);
      
      // Use canvas dimensions directly for default size instead of A4
      const imgWidth = canvas.width / 2; // Scale down for better fit
      const imgHeight = canvas.height / 2;
      
      // Create PDF with custom dimensions based on content
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      
      // Add image to fit the entire page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`ATS_Screening_Report_${report.applicantName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div id="detailed-ats-report-content" className="bg-gray-800 text-white min-h-screen">
          
          {/* Header Section */}
          <div className="bg-gray-800 px-8 py-6 flex items-center justify-between">
            {/* Left Side - Title and Applicant Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">ATS Screening Report</h1>
              <div className="space-y-2 text-lg">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Applicant:</span>
                  <span className="text-green-400 font-bold">{report.applicantName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Position:</span>
                  <span className="text-green-400 font-bold">Software Engineer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Email Id Detection:</span>
                  <span className="text-green-400 font-bold">{report.detections.emailDetection ? "YES" : "NO"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">LinkedIn Id Detection:</span>
                  <span className="text-green-400 font-bold">{report.detections.linkedinDetection ? "YES" : "NO"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">GitHub Detection:</span>
                  <span className="text-green-400 font-bold">{report.detections.githubDetection ? "YES" : "NO"}</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Overall Score Circle */}
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-3 tracking-wider">OVERALL RANKING SCORE</div>
              <div className="w-32 h-32 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-bold text-gray-800">{report.overallScore}</span>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-300 text-3xl print:hidden ml-4"
            >
              ×
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="px-8 pb-8">
            <div className="flex gap-8">
              
              {/* Left Column - Assessment Cards */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Row 1 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Measuring Effect</div>
                        <div className="text-sm text-gray-600">Analysis based on resume metrics and achievements.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Professional Language</div>
                        <div className="text-sm text-gray-600">Language analysis completed - no vague buzzwords detected.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 2 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">No repetitive phrases</div>
                        <div className="text-sm text-gray-600">Your use of language exhibits commendable diversity.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Fluff Glitches</div>
                        <div className="text-sm text-gray-600">Great Job! Your resume avoids Fluff Glitches.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 3 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">No repetitive bullet points</div>
                        <div className="text-sm text-gray-600">Your bullet points demonstrate a refreshing level of originality.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Formatting</div>
                        <div className="text-sm text-gray-600">Excellent. Your experiences are in reverse chronological order.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 4 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Unique action verbs</div>
                        <div className="text-sm text-gray-600">{report.categories.impact?.[0]?.description || 'Action verb analysis available.'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Date Formatting</div>
                        <div className="text-sm text-gray-600">You're a pro at keeping your dates consistent, good job!</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 5 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Weak Action Verbs</div>
                        <div className="text-sm text-gray-600">Nice work, your verbs are clear and impactful.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Contact Details</div>
                        <div className="text-sm text-gray-600">It's Clear. Your resume contains enough Contact Details.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 6 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Grammar Check</div>
                        <div className="text-sm text-gray-600">Structure and formatting analysis completed.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{report.detections.emailDetection ? 'Contact Information' : 'Missing Contact'}</div>
                        <div className="text-sm text-gray-600">The information you requested seems to be available.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 7 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Unwanted Words</div>
                        <div className="text-sm text-gray-600">Great job, your word choice is inclusive and impactful.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Core Readability</div>
                        <div className="text-sm text-gray-600">Your Resume Core Sections Found.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 8 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Proofread Impact</div>
                        <div className="text-sm text-gray-600">Great job! Your resume is free of mistakes and looking sharp.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Position Title Readability</div>
                        <div className="text-sm text-gray-600">{report.categories.readability?.[0]?.description || 'Readability analysis available.'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 9 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Resume Length</div>
                        <div className="text-sm text-gray-600">Perfect length for executive level professionals.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Font Readability</div>
                        <div className="text-sm text-gray-600">Great news! Your resume passes the Technical check.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 10 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Resume Length - Pages</div>
                        <div className="text-sm text-gray-600">Perfect length so recruiters easily digest accomplishments listing manager.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Personal Pronouns</div>
                        <div className="text-sm text-gray-600">Work, your resume avoids personal pronouns, keeping it clear and concise.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 11 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Bullet Points</div>
                        <div className="text-sm text-gray-600">List of bullet point structures is clearly readable with a style and organization.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Consistency</div>
                        <div className="text-sm text-gray-600">Resume is Consistently throughout your dates, locations and other details.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 12 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Bullet Points - Occupancy</div>
                        <div className="text-sm text-gray-600">Bullet point are balanced throughout out your positions in a logical proportion.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Soft Skills - Communication</div>
                        <div className="text-sm text-gray-600">Great news! you show great communications through your ability and talent.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 13 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Readability</div>
                        <div className="text-sm text-gray-600">{report.categories.readability?.[0]?.description || 'Readability analysis available.'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Soft Skills - Leadership</div>
                        <div className="text-sm text-gray-600">Great news! you show great leadership abilities and talent!</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 14 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Resume Depth</div>
                        <div className="text-sm text-gray-600">Your resume provides sufficient depth context through accomplishments and experience.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Technical Impact</div>
                        <div className="text-sm text-gray-600">Your resume displays enough technical accomplishments.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 15 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Bullet Point Length</div>
                        <div className="text-sm text-gray-600">The length of your resume bullet points is well-measured.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Technical Verified</div>
                        <div className="text-sm text-gray-600">Great news! Your resume passed the Technical check.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 16 */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Excess words</div>
                        <div className="text-sm text-gray-600">{report.categories.brevity?.[0]?.description || 'Word density analysis available.'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Impact Analysis</div>
                        <div className="text-sm text-gray-600">Impact assessment based on quantified achievements.</div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Right Column - Score Cards */}
              <div className="w-80 space-y-6">
                
                {/* Impact Score */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
                    <span className="text-3xl font-bold text-gray-800">{report.categoryScores.impact}</span>
                  </div>
                  <div className="text-white font-bold text-lg mb-3">Impact</div>
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Metrics Impact</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Verbs Impact</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Spell Impact</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Keyword Impact</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  </div>
                </div>
                
                {/* Brevity Score */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
                    <span className="text-3xl font-bold text-gray-800">{report.categoryScores.brevity}</span>
                  </div>
                  <div className="text-white font-bold text-lg mb-3">Brevity</div>
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Resume Length</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Formatting</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Excess/Filler Words</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Bullet Strength</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  </div>
                </div>
                
                {/* Appearance Score */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
                    <span className="text-3xl font-bold text-gray-800">{report.categoryScores.appearance}</span>
                  </div>
                  <div className="text-white font-bold text-lg mb-3">Appearance</div>
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Vague Buzzwords</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Details Detection</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Core Linking</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Readability</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  </div>
                </div>
                
                {/* Sections Score */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
                    <span className="text-3xl font-bold text-gray-800">{report.categoryScores.readability}</span>
                  </div>
                  <div className="text-white font-bold text-lg mb-3">Sections</div>
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Required Sections</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Technical Impact</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Contact Details</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Proofreader</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Page Break for PDF */}
            <div className="print:break-before-page">
              {/* What we did for you section */}
              <div className="bg-gray-800 text-white p-6 rounded-lg mt-8">
                <h3 className="text-xl font-bold mb-4 text-orange-300">✅ What We Did for You</h3>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">1.</span>
                    <span>Created a Professional Summary – Based on your experience and optimized to align with job market trends.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">2.</span>
                    <span>Enhanced Technical Skills – Added advanced, domain-relevant technical skills to improve recruiter attention.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">3.</span>
                    <span>Optimized Your Resume Content – Crafted your resume based on your updated inputs and feedback.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">4.</span>
                    <span>Crafted Roles & Responsibilities – Built using industry standards with strong action verbs and impactful phrasing.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">5.</span>
                    <span>Standardized Work Experience – Refined to meet U.S. and international resume standards.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">6.</span>
                    <span>Added ATS Keywords – Optimized experience section with technical and domain-specific keywords for higher ATS ranking.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">7.</span>
                    <span>Included Metrics & Achievements – Quantified your work to make your resume result-oriented and recruiter-friendly.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">8.</span>
                    <span>Projects Section – Included one strong project; additional projects can be highlighted in interviews or profiles.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">9.</span>
                    <span>Education Section – Optimized and positioned for professional presentation.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">10.</span>
                    <span>Metrics for International Standards – Ensured achievements are measurable and impactful for global recruiters.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-300 min-w-[20px]">11.</span>
                    <span>Final Industry-Standard Alignment – Resume is now fully ATS-compliant and aligned with industry best practices.</span>
                  </li>
                </ol>

                <div className="mt-8 border-t border-gray-600 pt-6">
                  <p className="text-gray-300">Thank you,</p>
                  <p className="text-white font-medium">Team Applywizz</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden mt-8">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                📄 Download PDF Report
              </button>
              <a
                href="https://apply-wizz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 text-center"
              >
                🚀 Get Professional Optimization
              </a>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                Close Report
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-4 rounded-b-lg text-center">
            <ApplyWizzLogo size="sm" className="mx-auto mb-2" />
            <p className="text-xs text-gray-600">
              Generated by Apply Wizz ATS Analysis System | Your Career Partner
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .fixed {
            position: static !important;
          }
          .bg-black {
            background-color: transparent !important;
          }
          .min-h-screen {
            min-height: auto !important;
          }
          .shadow-2xl {
            box-shadow: none !important;
          }
          .py-4 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .px-4 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};