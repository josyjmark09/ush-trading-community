/**
 * Email validation utility providing real-time feedback as the user types.
 */

export interface EmailValidationResult {
  isValid: boolean;
  status: 'empty' | 'typing' | 'invalid' | 'valid';
  message: string;
}

export function validateEmail(email: string): EmailValidationResult {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      status: 'empty',
      message: '',
    };
  }

  // Check for spaces
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Email cannot contain spaces',
    };
  }

  // If no '@' yet
  if (!trimmed.includes('@')) {
    if (trimmed.length < 4) {
      return {
        isValid: false,
        status: 'typing',
        message: '',
      };
    }
    return {
      isValid: false,
      status: 'invalid',
      message: "Missing '@' in email address",
    };
  }

  const parts = trimmed.split('@');
  if (parts.length > 2) {
    return {
      isValid: false,
      status: 'invalid',
      message: "Email cannot contain multiple '@' symbols",
    };
  }

  const [localPart, domainPart] = parts;

  if (!localPart) {
    return {
      isValid: false,
      status: 'invalid',
      message: "Please enter an account name before '@'",
    };
  }

  if (!domainPart) {
    return {
      isValid: false,
      status: 'invalid',
      message: "Please enter a domain after '@' (e.g. gmail.com)",
    };
  }

  if (!domainPart.includes('.')) {
    return {
      isValid: false,
      status: 'invalid',
      message: "Domain must include an extension (e.g. .com, .net)",
    };
  }

  const domainSubParts = domainPart.split('.');
  const tld = domainSubParts[domainSubParts.length - 1];

  if (tld.length < 2) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Incomplete domain extension (e.g. .com)',
    };
  }

  // Full standard regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Please check for invalid characters in the email',
    };
  }

  return {
    isValid: true,
    status: 'valid',
    message: '✓ Valid email address',
  };
}
