import type { PiiType } from "@shared/schema";

const PII_PATTERNS: Record<PiiType, RegExp> = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  name: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
  address: /\b\d+\s+[A-Za-z\s,]+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St)\.?\b/gi,
};

const MASK_CHARS: Record<PiiType, string> = {
  email: "[EMAIL]",
  phone: "[PHONE]",
  ip: "[IP]",
  creditCard: "[CC]",
  ssn: "[SSN]",
  name: "[NAME]",
  address: "[ADDRESS]"
};

export function detectPii(text: string): Record<PiiType, string[]> {
  const results: Partial<Record<PiiType, string[]>> = {};
  
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const matches = text.match(pattern) || [];
    if (matches.length > 0) {
      results[type as PiiType] = [...new Set(matches)];
    }
  });
  
  return results as Record<PiiType, string[]>;
}

export function anonymizeText(text: string, enabledTypes: Record<string, boolean>): string {
  let anonymized = text;
  
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    if (enabledTypes[type]) {
      anonymized = anonymized.replace(pattern, MASK_CHARS[type as PiiType]);
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
        highlighted = highlighted.replace(
          new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<mark class="bg-yellow-500/20 text-yellow-200">${value}</mark>`
        );
      });
    }
  });
  
  return highlighted;
}
