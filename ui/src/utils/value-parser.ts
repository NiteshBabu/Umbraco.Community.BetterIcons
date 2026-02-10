import type { IconValue } from '../types';

/**
 * Parse icon value from JSON string or object
 */
export const parseIconValue = (value: string | IconValue | null | undefined): IconValue | null => {
  if (!value) return null;
  
  try {
    // Check if value is already an object
    if (typeof value === 'object' && value !== null) {
      return value as IconValue;
    }
    // Otherwise parse as JSON string
    return JSON.parse(value);
  } catch {
    // Failed to parse, return null
    return null;
  }
};

/**
 * Stringify icon value to JSON
 */
export const stringifyIconValue = (value: IconValue): string => {
  return JSON.stringify(value);
};
