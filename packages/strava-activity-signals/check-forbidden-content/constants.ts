/**
 * Patterns for real persons/identifiable individuals.
 */
export const PERSON_PATTERNS = [
  /\b(person|people|individual|human|man|woman|child|kid|baby)\b/,
  /\b(face|portrait|photo|picture|image|photo)\b/,
];

/**
 * Patterns for political/ideological symbols.
 */
export const POLITICAL_PATTERNS = [
  /\b(political|politics|government|president|election|vote|democracy|republican|democrat)\b/,
  /\b(flag|banner|symbol|emblem|crest)\b/,
];

/**
 * Patterns for violence.
 */
export const VIOLENCE_PATTERNS = [
  /\b(violence|violent|fight|war|battle|weapon|gun|knife|sword|attack|kill|death|blood)\b/,
  /\b(combat|military|soldier|army|navy|air force)\b/,
];

/**
 * Patterns for sexual content.
 */
export const SEXUAL_PATTERNS = [/\b(sexual|sex|nude|naked|explicit|adult|porn)\b/];

/**
 * Patterns for text/typography instructions.
 */
export const TEXT_PATTERNS = [
  /\b(text|word|letter|alphabet|typography|caption|label|title|heading|font|type)\b/,
  /\b(write|print|display|show|say|tell|read)\b/,
];

export const PATTERNS = [
  ...PERSON_PATTERNS,
  ...POLITICAL_PATTERNS,
  ...VIOLENCE_PATTERNS,
  ...SEXUAL_PATTERNS,
  ...TEXT_PATTERNS,
];
