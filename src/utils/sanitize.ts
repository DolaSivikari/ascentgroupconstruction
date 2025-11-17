import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u',
      'a', 'img', 'br', 'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'target', 'rel',
      'title', 'id', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/**
 * Validates HTML complexity to prevent DoS attacks
 * @param html - HTML string to validate
 * @returns Validation result with reason if invalid
 */
export const validateHTMLComplexity = (html: string): { valid: boolean; reason?: string } => {
  if (!html) return { valid: true };

  // Check nesting depth - prevent deeply nested structures
  const maxNestingDepth = 15;
  let currentDepth = 0;
  let maxDepth = 0;
  
  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<') {
      // Check if it's a closing tag
      if (html[i + 1] === '/') {
        currentDepth--;
      } else if (html[i + 1] !== '!' && html[i + 1] !== '?') {
        // Opening tag (not comment or declaration)
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }
    }
  }
  
  if (maxDepth > maxNestingDepth) {
    return { 
      valid: false, 
      reason: `HTML structure too deeply nested (${maxDepth} levels, max ${maxNestingDepth})` 
    };
  }

  // Check for excessive attributes
  const attributeMatches = html.match(/\s\w+\s*=/g);
  const attributeCount = attributeMatches ? attributeMatches.length : 0;
  const maxAttributes = 1000;
  
  if (attributeCount > maxAttributes) {
    return { 
      valid: false, 
      reason: `Too many HTML attributes (${attributeCount}, max ${maxAttributes})` 
    };
  }

  // Check for repetitive patterns (potential DoS)
  const maxRepeatedPattern = 100;
  const repeatedPattern = html.match(/(.{10,})\1{5,}/);
  if (repeatedPattern) {
    const repetitions = html.split(repeatedPattern[1]).length - 1;
    if (repetitions > maxRepeatedPattern) {
      return { 
        valid: false, 
        reason: 'HTML contains excessive repetitive patterns' 
      };
    }
  }

  return { valid: true };
};

/**
 * Comprehensive HTML validation and sanitization
 * @param html - Raw HTML to process
 * @returns Object with sanitized HTML and validation status
 */
export const sanitizeAndValidate = (html: string): { 
  sanitized: string; 
  valid: boolean; 
  reason?: string;
} => {
  // First validate complexity
  const complexity = validateHTMLComplexity(html);
  
  if (!complexity.valid) {
    return {
      sanitized: '',
      valid: false,
      reason: complexity.reason
    };
  }

  // Then sanitize
  const sanitized = sanitizeHTML(html);
  
  return {
    sanitized,
    valid: true
  };
};
