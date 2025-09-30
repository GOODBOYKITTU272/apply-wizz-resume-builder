'use client';

import React, { useState } from 'react';

const LinkedInDebugTest = () => {
  const [resumeText, setResumeText] = useState('');
  const [detectionResult, setDetectionResult] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testLinkedInDetection = () => {
    console.log('=== MANUAL LINKEDIN DETECTION TEST ===');
    console.log('Input text:', resumeText);
    console.log('Text length:', resumeText.length);
    
    // Our detection logic
    const lowerText = resumeText.toLowerCase();
    const found = lowerText.includes('linkedin');
    
    console.log('Lowercase text:', lowerText);
    console.log('LinkedIn found:', found);
    
    // Detailed search
    if (!found) {
      console.log('Performing detailed character search...');
      const positions = [];
      for (let i = 0; i <= lowerText.length - 7; i++) {
        if (lowerText.substring(i, i + 7) === 'linkedin') {
          positions.push(i);
        }
      }
      console.log('Found "linkedin" at positions:', positions);
    }
    
    setDetectionResult(found);
    
    // Set debug info for display
    setDebugInfo({
      inputText: resumeText,
      lowercaseText: lowerText,
      textLength: resumeText.length,
      directSearch: found,
      detailedSearch: !found ? 'Performed' : 'Not needed'
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LinkedIn Detection Debugger</h1>
      
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Paste your resume text here:
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={10}
          className="w-full p-4 border border-gray-300 rounded-lg"
          placeholder="Paste the text from your resume that contains 'LinkedIn'..."
        />
      </div>
      
      <button
        onClick={testLinkedInDetection}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 mb-6"
      >
        Test LinkedIn Detection
      </button>
      
      {detectionResult !== null && (
        <div className="mt-6 p-4 rounded-lg bg-gray-100">
          <h2 className="text-xl font-bold mb-3">Detection Result:</h2>
          <div className="text-2xl font-bold mb-4">
            LinkedIn Detection: 
            <span className={detectionResult ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
              {detectionResult ? "YES" : "NO"}
            </span>
          </div>
          
          {debugInfo && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Debug Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Input Text Length:</strong> {debugInfo.textLength}
                </div>
                <div>
                  <strong>Direct Search Result:</strong> {debugInfo.directSearch.toString()}
                </div>
              </div>
              <div className="mt-3">
                <strong>Input Text:</strong>
                <div className="mt-1 p-2 bg-white rounded border max-h-32 overflow-y-auto">
                  {debugInfo.inputText}
                </div>
              </div>
              <div className="mt-3">
                <strong>Lowercase Text:</strong>
                <div className="mt-1 p-2 bg-white rounded border max-h-32 overflow-y-auto">
                  {debugInfo.lowercaseText}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Open your browser's developer console (F12 or Ctrl+Shift+J)</li>
          <li>Paste your resume text in the box above</li>
          <li>Click "Test LinkedIn Detection"</li>
          <li>Check the console for detailed debugging output</li>
          <li>The result will also be displayed on this page</li>
        </ol>
      </div>
    </div>
  );
};

export default LinkedInDebugTest;