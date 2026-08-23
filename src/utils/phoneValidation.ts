/**
 * Egyptian Phone Number Validation & Normalization Utility
 * Valid Egyptian mobile prefixes: 010, 011, 012, 015
 * Length: strictly 11 digits
 */

export const EGYPTIAN_PHONE_REGEX = /^(010|011|012|015)\d{8}$/;

/**
 * Validates if the given string is a valid 11-digit Egyptian phone number
 * (e.g. 01012345678, 01123456789, 01234567890, 01545678901)
 * Also supports input with country code +20 (e.g. +201012345678 -> 01012345678)
 */
export function isValidEgyptianPhone(phone: string): boolean {
  const normalized = normalizeEgyptianPhone(phone);
  return EGYPTIAN_PHONE_REGEX.test(normalized);
}

/**
 * Normalizes phone numbers to standard 11 digits format (e.g., "01012345678")
 */
export function normalizeEgyptianPhone(phone: string): string {
  if (!phone) return '';
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // If starts with Egyptian country code 20, convert to local leading 0
  if (digits.startsWith('20') && digits.length === 12) {
    digits = '0' + digits.slice(2);
  } else if (digits.length === 10 && (digits.startsWith('10') || digits.startsWith('11') || digits.startsWith('12') || digits.startsWith('15'))) {
    // If entered without leading zero: 1012345678 -> 01012345678
    digits = '0' + digits;
  }

  return digits;
}

/**
 * Formats Egyptian phone number for display (e.g., "010 1234 5678")
 */
export function formatEgyptianPhone(phone: string): string {
  const normalized = normalizeEgyptianPhone(phone);
  if (normalized.length === 11) {
    return `${normalized.slice(0, 3)} ${normalized.slice(3, 7)} ${normalized.slice(7)}`;
  }
  return phone;
}
