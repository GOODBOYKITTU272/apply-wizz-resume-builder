import type {
  ResumeSectionToLines,
  TextItem,
  FeatureSet,
} from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import {
  isBold,
  hasNumber,
  hasComma,
  hasLetter,
  hasLetterAndIsAllUpperCase,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";

// Name
export const matchOnlyLetterSpaceOrPeriod = (item: TextItem) =>
  item.text.match(/^[a-zA-Z\s\.]+$/);

// Email
// Simple email regex: xxx@xxx.xxx (xxx = anything not space)
export const matchEmail = (item: TextItem) => item.text.match(/\S+@\S+\.\S+/);
const hasAt = (item: TextItem) => item.text.includes("@");

// Phone
// Simple phone regex that matches (xxx)-xxx-xxxx where () and - are optional, - can also be space
export const matchPhone = (item: TextItem) =>
  item.text.match(/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
const hasParenthesis = (item: TextItem) => /\([0-9]+\)/.test(item.text);

// Location
// Simple location regex that matches "<City>, <ST>"
export const matchCityAndState = (item: TextItem) =>
  item.text.match(/[A-Z][a-zA-Z\s]+, [A-Z]{2}/);

// Url
// Simple url regex that matches "xxx.xxx/xxx" (xxx = anything not space)
export const matchUrl = (item: TextItem) => item.text.match(/\S+\.[a-z]+\/\S+/);
// Match https://xxx.xxx where s is optional
const matchUrlHttpFallback = (item: TextItem) =>
  item.text.match(/https?:\/\/\S+\.\S+/);
// Match www.xxx.xxx
const matchUrlWwwFallback = (item: TextItem) =>
  item.text.match(/www\.\S+\.\S+/);
const hasSlash = (item: TextItem) => item.text.includes("/");

// Summary
const has4OrMoreWords = (item: TextItem) => item.text.split(" ").length >= 4;

/**
 *              Unique Attribute
 * Name         Bold or Has all uppercase letter
 * Email        Has @
 * Phone        Has ()
 * Location     Has ,    (overlap with summary)
 * Url          Has slash
 * Summary      Has 4 or more words
 */

/**
 * Name -> contains only letters/space/period, e.g. Leonardo W. DiCaprio
 *         (it isn't common to include middle initial in resume)
 *      -> is bolded or has all letters as uppercase
 */
const NAME_FEATURE_SETS: FeatureSet[] = [
  [matchOnlyLetterSpaceOrPeriod, 3, true],
  [isBold, 2],
  [hasLetterAndIsAllUpperCase, 2],
  // Match against other unique attributes
  [hasAt, -4], // Email
  [hasNumber, -4], // Phone
  [hasParenthesis, -4], // Phone
  [hasComma, -4], // Location
  [hasSlash, -4], // Url
  [has4OrMoreWords, -2], // Summary
];

// Email -> match email regex xxx@xxx.xxx
const EMAIL_FEATURE_SETS: FeatureSet[] = [
  [matchEmail, 4, true],
  [isBold, -1], // Name
  [hasLetterAndIsAllUpperCase, -1], // Name
  [hasParenthesis, -4], // Phone
  [hasComma, -4], // Location
  [hasSlash, -4], // Url
  [has4OrMoreWords, -4], // Summary
];

// Phone -> match phone regex (xxx)-xxx-xxxx
const PHONE_FEATURE_SETS: FeatureSet[] = [
  [matchPhone, 4, true],
  [hasLetter, -4], // Name, Email, Location, Url, Summary
];

// Location -> match location regex <City>, <ST>
const LOCATION_FEATURE_SETS: FeatureSet[] = [
  [matchCityAndState, 4, true],
  [isBold, -1], // Name
  [hasAt, -4], // Email
  [hasParenthesis, -3], // Phone
  [hasSlash, -4], // Url
];

// URL -> match url regex xxx.xxx/xxx
const URL_FEATURE_SETS: FeatureSet[] = [
  [matchUrl, 4, true],
  [matchUrlHttpFallback, 3, true],
  [matchUrlWwwFallback, 3, true],
  [isBold, -1], // Name
  [hasAt, -4], // Email
  [hasParenthesis, -3], // Phone
  [hasComma, -4], // Location
  [has4OrMoreWords, -4], // Summary
];

// Summary -> has 4 or more words
const SUMMARY_FEATURE_SETS: FeatureSet[] = [
  [has4OrMoreWords, 4],
  [isBold, -1], // Name
  [hasAt, -4], // Email
  [hasParenthesis, -3], // Phone
  [matchCityAndState, -4, false], // Location
];

export const extractProfile = (sections: ResumeSectionToLines) => {
  const lines = sections.profile || [];
  const textItems = lines.flat();

  // Enhanced parsing with fallback mechanisms
  let [name, nameScores] = getTextWithHighestFeatureScore(
    textItems,
    NAME_FEATURE_SETS
  );
  
  // Fallback: if no name found, try to find the first non-email, non-phone line
  if (!name && textItems.length > 0) {
    const firstTextItem = textItems.find(item => 
      item.text && 
      !matchEmail(item) && 
      !matchPhone(item) &&
      item.text.trim().length > 0
    );
    if (firstTextItem) {
      name = firstTextItem.text;
      nameScores = [{ text: firstTextItem.text, score: 1, match: true }];
    }
  }

  let [email, emailScores] = getTextWithHighestFeatureScore(
    textItems,
    EMAIL_FEATURE_SETS
  );
  
  // Fallback: try to find email with simpler pattern
  if (!email && textItems.length > 0) {
    const emailItem = textItems.find(item => 
      item.text && item.text.includes('@')
    );
    if (emailItem) {
      email = emailItem.text;
      emailScores = [{ text: emailItem.text, score: 1, match: true }];
    }
  }

  let [phone, phoneScores] = getTextWithHighestFeatureScore(
    textItems,
    PHONE_FEATURE_SETS
  );
  
  // Fallback: try to find phone with simpler pattern
  if (!phone && textItems.length > 0) {
    const phoneItem = textItems.find(item => 
      item.text && /\d{3}.*\d{3}.*\d{4}/.test(item.text)
    );
    if (phoneItem) {
      phone = phoneItem.text;
      phoneScores = [{ text: phoneItem.text, score: 1, match: true }];
    }
  }

  let [location, locationScores] = getTextWithHighestFeatureScore(
    textItems,
    LOCATION_FEATURE_SETS
  );
  
  // Fallback: try to find location with simpler pattern
  if (!location && textItems.length > 0) {
    const locationItem = textItems.find(item => 
      item.text && /[A-Za-z]+,\s*[A-Z]{2}/.test(item.text)
    );
    if (locationItem) {
      location = locationItem.text;
      locationScores = [{ text: locationItem.text, score: 1, match: true }];
    }
  }

  let [url, urlScores] = getTextWithHighestFeatureScore(
    textItems,
    URL_FEATURE_SETS
  );
  
  // Fallback: try to find URL with simpler pattern
  if (!url && textItems.length > 0) {
    const urlItem = textItems.find(item => 
      item.text && (item.text.includes('http') || item.text.includes('www') || item.text.includes('.com'))
    );
    if (urlItem) {
      url = urlItem.text;
      urlScores = [{ text: urlItem.text, score: 1, match: true }];
    }
  }

  let [summary, summaryScores] = getTextWithHighestFeatureScore(
    textItems,
    SUMMARY_FEATURE_SETS,
    undefined,
    true
  );

  const summaryLines = getSectionLinesByKeywords(sections, ["summary"]);
  const summarySection = summaryLines
    .flat()
    .map((textItem) => textItem.text)
    .join(" ");
  const objectiveLines = getSectionLinesByKeywords(sections, ["objective"]);
  const objectiveSection = objectiveLines
    .flat()
    .map((textItem) => textItem.text)
    .join(" ");

  // Enhanced summary extraction with better fallback
  let finalSummary = summarySection || objectiveSection || summary;
  
  // If still no summary, try to extract from first few lines that look like descriptions
  if (!finalSummary && lines.length > 1) {
    const potentialSummaryLines = lines.slice(1, 4).flat()
      .filter(item => item.text && item.text.trim().length > 20)
      .map(item => item.text)
      .join(' ');
    
    if (potentialSummaryLines.length > 50) {
      finalSummary = potentialSummaryLines;
    }
  }

  return {
    profile: {
      name: name || '',
      email: email || '',
      phone: phone || '',
      location: location || '',
      url: url || '',
      summary: finalSummary || '',
    },
    // For debugging
    profileScores: {
      name: nameScores,
      email: emailScores,
      phone: phoneScores,
      location: locationScores,
      url: urlScores,
      summary: summaryScores,
    },
  };
};
