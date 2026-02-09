// utils/phoneValidation.ts

// Map of country codes to their expected lengths (including country code)
const COUNTRY_CODES: Record<string, number[]> = {
  '254': [12], // Kenya
  '255': [12], // Tanzania
  '256': [12], // Uganda
  '250': [12], // Rwanda
  '257': [12], // Burundi
  '234': [13], // Nigeria
  '263': [12], // Zimbabwe
  '52': [11, 12], // Mexico
};

/**
 * Validates phone numbers from selected countries only
 * @param phone The phone number to validate
 * @returns true if valid, false otherwise
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, ''); // Remove all non-digit characters

  // Check each allowed country code
  for (const code in COUNTRY_CODES) {
    if (cleaned.startsWith(code) && COUNTRY_CODES[code].includes(cleaned.length)) {
      return true;
    }
  }

  return false;
}

/**
 * Formats phone number to ALWAYS be numeric, country code only (no '+', no spaces)
 * @param phone The phone number to format
 * @returns formatted number
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}
