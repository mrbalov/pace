/**
 * Checks if text contains forbidden content patterns.
 *
 * Forbidden content includes:
 * - Real persons or identifiable individuals
 * - Political or ideological symbols
 * - Explicit violence or sexual content
 * - Military or combat scenes
 * - Text/captions/typography instructions
 *
 * @param {string} text - Text to check for forbidden content
 * @returns {boolean} True if forbidden content detected, false otherwise
 * @internal
 */
const checkForbiddenContent = (text: string): boolean => {
  const lowerText = text.toLowerCase();

  // Patterns for real persons/identifiable individuals
  const personPatterns = [
    /\b(person|people|individual|human|man|woman|child|kid|baby)\b/,
    /\b(face|portrait|photo|picture|image|photo)\b/,
  ];

  // Patterns for political/ideological symbols
  const politicalPatterns = [
    /\b(political|politics|government|president|election|vote|democracy|republican|democrat)\b/,
    /\b(flag|banner|symbol|emblem|crest)\b/,
  ];

  // Patterns for violence
  const violencePatterns = [
    /\b(violence|violent|fight|war|battle|weapon|gun|knife|sword|attack|kill|death|blood)\b/,
    /\b(combat|military|soldier|army|navy|air force)\b/,
  ];

  // Patterns for sexual content
  const sexualPatterns = [/\b(sexual|sex|nude|naked|explicit|adult|porn)\b/];

  // Patterns for text/typography instructions
  const textPatterns = [
    /\b(text|word|letter|alphabet|typography|caption|label|title|heading|font|type)\b/,
    /\b(write|print|display|show|say|tell|read)\b/,
  ];

  // Check all patterns
  const allPatterns = [
    ...personPatterns,
    ...politicalPatterns,
    ...violencePatterns,
    ...sexualPatterns,
    ...textPatterns,
  ];

  const hasForbiddenContent = allPatterns.some((pattern) => pattern.test(lowerText));

  return hasForbiddenContent;
};

export default checkForbiddenContent;
