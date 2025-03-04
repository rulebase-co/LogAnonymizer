import type { PiiType } from "@shared/schema";

// Pattern to identify agent-related text (for exclusion only)
const AGENT_TEXT_PATTERN = /(?:Agent(?:\s*Name)?:\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)|(?:ID:\s*AGT-\d+)|(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+ID:\s*AGT-\d+)/g;

const PII_PATTERNS: Record<PiiType, RegExp> = {
  timestamp: /\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?|\d{4}-\d{2}-\d{2}|\w+\s+\d{1,2},\s+\d{4}/g,
  userId: /User ID: \d+|UID: \d+|User#\d+/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  name: /\b(?<!Agent\s*Name:\s*)(?<!ID:\s*AGT-\d+\s*)[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b(?!\s*ID:\s*AGT-\d+)(?!\s*AGT-\d+)/g,
  address: /\b\d+\s+[A-Za-z\s,]+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St)\.?\b/gi,
};

const MASK_CHARS: Record<PiiType, string> = {
  timestamp: "[TIMESTAMP]",
  userId: "[USER_ID]",
  email: "[EMAIL]",
  phone: "[PHONE]",
  ip: "[IP]",
  creditCard: "[CC]",
  ssn: "[SSN]",
  name: "[NAME]",
  address: "",  // Will be replaced with fictional addresses
};

// List of fictional addresses to use as replacements
const FICTIONAL_ADDRESSES = [
  "221B Baker Street, London",
  "12 Grimmauld Place, London",
  "742 Evergreen Terrace, Springfield",
  "31 Spooner Street, Quahog",
  "124 Conch Street, Bikini Bottom",
  "1313 Mockingbird Lane, Mockingbird Heights",
  "322 Maple Street, Stars Hollow",
  "4 Privet Drive, Little Whinging",
  "17 Cherry Tree Lane, London",
  "84 Rainey Street, Arlen"
];

let currentAddressIndex = 0;

// Helper function to get text positions of all agent-related content
function getAgentTextPositions(text: string): Array<[number, number]> {
  const positions: Array<[number, number]> = [];
  let match;
  while ((match = AGENT_TEXT_PATTERN.exec(text)) !== null) {
    positions.push([match.index, match.index + match[0].length]);
  }
  return positions;
}

// Helper function to check if a position is within any agent text
function isWithinAgentText(position: number, agentPositions: Array<[number, number]>): boolean {
  return agentPositions.some(([start, end]) => position >= start && position <= end);
}

export function detectPii(text: string): Record<PiiType, string[]> {
  const results: Partial<Record<PiiType, string[]>> = {};
  const agentPositions = getAgentTextPositions(text);

  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    let matches = text.match(pattern) || [];
    if (matches.length > 0) {
      // For names, filter out any that are part of agent text
      if (type === 'name') {
        matches = matches.filter(match => {
          const matchIndex = text.indexOf(match);
          return !isWithinAgentText(matchIndex, agentPositions);
        });
      }
      if (matches.length > 0) {
        results[type as PiiType] = Array.from(new Set(matches));
      }
    }
  });

  return results as Record<PiiType, string[]>;
}

export function anonymizeText(text: string, enabledTypes: Record<string, boolean>): string {
  let anonymized = text;
  const agentPositions = getAgentTextPositions(text);

  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    if (enabledTypes[type]) {
      if (type === 'address') {
        // Replace each address with a unique fictional address
        const matches = anonymized.match(pattern) || [];
        matches.forEach(match => {
          const replacement = FICTIONAL_ADDRESSES[currentAddressIndex % FICTIONAL_ADDRESSES.length];
          currentAddressIndex++;
          anonymized = anonymized.replace(match, replacement);
        });
      } else if (type === 'name') {
        // Only anonymize non-agent names
        let match;
        const regex = new RegExp(pattern);
        while ((match = regex.exec(anonymized)) !== null) {
          if (!isWithinAgentText(match.index, agentPositions)) {
            const replacement = MASK_CHARS[type];
            anonymized = 
              anonymized.slice(0, match.index) + 
              replacement + 
              anonymized.slice(match.index + match[0].length);
          }
        }
      } else {
        anonymized = anonymized.replace(pattern, MASK_CHARS[type as PiiType]);
      }
    }
  });

  return anonymized;
}

export function highlightPii(text: string, enabledTypes: Record<string, boolean>): string {
  let highlighted = text;
  const matches = detectPii(text);

  Object.entries(matches).forEach(([type, values]) => {
    if (enabledTypes[type]) {
      values.forEach(value => {
        const colorClass = `bg-yellow-100 text-yellow-800 dark:bg-yellow-400/30 dark:text-yellow-200 px-1 rounded`;
        highlighted = highlighted.replace(
          new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<mark class="${colorClass}" title="Detected ${type}">${value}</mark>`
        );
      });
    }
  });

  return highlighted;
}