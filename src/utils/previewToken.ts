/**
 * Generate a secure preview token for draft content
 */
export const generatePreviewToken = (): string => {
  return `preview_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Validate a preview token (enhanced validation)
 */
export const validatePreviewToken = (token: string | null): boolean => {
  if (!token || token.length < 16) return false;
  
  // Token format: preview_{timestamp}_{random}
  const parts = token.split('_');
  if (parts.length < 3 || parts[0] !== 'preview') return false;
  
  const timestamp = parseInt(parts[1]);
  if (isNaN(timestamp)) return false;
  
  // Token expires after 24 hours
  const tokenAge = Date.now() - timestamp;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  return tokenAge < TWENTY_FOUR_HOURS;
};
