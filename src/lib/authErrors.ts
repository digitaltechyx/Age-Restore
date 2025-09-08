/**
 * Firebase Authentication Error Codes and their user-friendly messages
 */
export const AUTH_ERROR_MESSAGES = {
  // Common authentication errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  'auth/requires-recent-login': 'Please log in again to complete this action.',
  'auth/credential-already-in-use': 'This credential is already associated with a different account.',
  'auth/invalid-verification-code': 'Invalid verification code.',
  'auth/invalid-verification-id': 'Invalid verification ID.',
  'auth/missing-verification-code': 'Please enter the verification code.',
  'auth/missing-verification-id': 'Verification ID is missing.',
  'auth/code-expired': 'The verification code has expired. Please request a new one.',
  'auth/invalid-phone-number': 'Please enter a valid phone number.',
  'auth/missing-phone-number': 'Please enter a phone number.',
  'auth/quota-exceeded': 'Too many requests. Please try again later.',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/invalid-app-credential': 'Invalid app credential.',
  'auth/missing-app-credential': 'App credential is missing.',
  'auth/invalid-user-token': 'Your session has expired. Please log in again.',
  'auth/user-token-expired': 'Your session has expired. Please log in again.',
  'auth/null-user': 'Please log in to continue.',
  'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
  'auth/argument-error': 'Invalid argument provided.',
  'auth/invalid-api-key': 'Invalid API key.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/offline': 'You are currently offline. Please check your internet connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups and try again.',
  'auth/unauthorized-domain': 'This domain is not authorized for Firebase Authentication.',
  'auth/unsupported-persistence-type': 'Unsupported persistence type.',
  'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  'auth/custom-token-mismatch': 'Custom token mismatch.',
  'auth/invalid-custom-token': 'Invalid custom token.',
  'auth/missing-or-invalid-nonce': 'Missing or invalid nonce.',
  'auth/timeout': 'Request timed out. Please try again.',
  'auth/expired-action-code': 'The action code has expired.',
  'auth/invalid-action-code': 'Invalid action code.',
  'auth/missing-action-code': 'Action code is missing.',
  'auth/invalid-message-payload': 'Invalid message payload.',
  'auth/invalid-sender': 'Invalid sender.',
  'auth/invalid-recipient-email': 'Invalid recipient email.',
  'auth/missing-email': 'Email address is required.',
  'auth/missing-password': 'Password is required.',
  'auth/missing-phone-number': 'Phone number is required.',
  'auth/missing-verification-code': 'Verification code is required.',
  'auth/missing-verification-id': 'Verification ID is required.',
  'auth/phone-number-already-exists': 'This phone number is already in use.',
  'auth/project-not-found': 'Project not found.',
  'auth/insufficient-permission': 'Insufficient permissions.',
  'auth/keychain-error': 'Keychain error occurred.',
  'auth/internal-error': 'An internal error occurred. Please try again.',
  'auth/invalid-app-credential': 'Invalid app credential.',
  'auth/missing-app-credential': 'App credential is missing.',
  'auth/invalid-user-token': 'Your session has expired. Please log in again.',
  'auth/user-token-expired': 'Your session has expired. Please log in again.',
  'auth/null-user': 'Please log in to continue.',
  'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
  'auth/argument-error': 'Invalid argument provided.',
  'auth/invalid-api-key': 'Invalid API key.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/offline': 'You are currently offline. Please check your internet connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups and try again.',
  'auth/unauthorized-domain': 'This domain is not authorized for Firebase Authentication.',
  'auth/unsupported-persistence-type': 'Unsupported persistence type.',
  'auth/custom-token-mismatch': 'Custom token mismatch.',
  'auth/invalid-custom-token': 'Invalid custom token.',
  'auth/missing-or-invalid-nonce': 'Missing or invalid nonce.',
  'auth/timeout': 'Request timed out. Please try again.',
  'auth/expired-action-code': 'The action code has expired.',
  'auth/invalid-action-code': 'Invalid action code.',
  'auth/missing-action-code': 'Action code is missing.',
  'auth/invalid-message-payload': 'Invalid message payload.',
  'auth/invalid-sender': 'Invalid sender.',
  'auth/invalid-recipient-email': 'Invalid recipient email.',
  'auth/missing-email': 'Email address is required.',
  'auth/missing-password': 'Password is required.',
  'auth/missing-phone-number': 'Phone number is required.',
  'auth/missing-verification-code': 'Verification code is required.',
  'auth/missing-verification-id': 'Verification ID is required.',
  'auth/phone-number-already-exists': 'This phone number is already in use.',
  'auth/project-not-found': 'Project not found.',
  'auth/insufficient-permission': 'Insufficient permissions.',
  'auth/keychain-error': 'Keychain error occurred.',
  'auth/internal-error': 'An internal error occurred. Please try again.',
} as const;

/**
 * Get user-friendly error message from Firebase error
 * @param error - Firebase error object or error message
 * @returns User-friendly error message
 */
export function getAuthErrorMessage(error: any): string {
  // Handle different error formats
  let errorCode = '';
  
  if (error?.code) {
    // Firebase error object
    errorCode = error.code;
  } else if (typeof error === 'string') {
    // String error message
    errorCode = error;
  } else if (error?.message) {
    // Error with message property
    errorCode = error.message;
  } else {
    // Unknown error format
    return 'An unexpected error occurred. Please try again.';
  }

  // Check if we have a custom message for this error code
  if (errorCode in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[errorCode as keyof typeof AUTH_ERROR_MESSAGES];
  }

  // Handle common error patterns
  if (errorCode.includes('user-not-found') || errorCode.includes('wrong-password')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  
  if (errorCode.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  
  if (errorCode.includes('weak-password')) {
    return 'Password should be at least 6 characters long.';
  }
  
  if (errorCode.includes('email-already-in-use')) {
    return 'An account with this email already exists.';
  }
  
  if (errorCode.includes('too-many-requests')) {
    return 'Too many failed attempts. Please try again later.';
  }
  
  if (errorCode.includes('network')) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (errorCode.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Default fallback message
  return 'An error occurred. Please try again.';
}

/**
 * Check if error is a network-related error
 * @param error - Firebase error object
 * @returns True if it's a network error
 */
export function isNetworkError(error: any): boolean {
  const errorCode = error?.code || error?.message || '';
  return errorCode.includes('network') || 
         errorCode.includes('timeout') || 
         errorCode.includes('offline') ||
         errorCode.includes('connection');
}

/**
 * Check if error is a credential-related error
 * @param error - Firebase error object
 * @returns True if it's a credential error
 */
export function isCredentialError(error: any): boolean {
  const errorCode = error?.code || error?.message || '';
  return errorCode.includes('user-not-found') || 
         errorCode.includes('wrong-password') ||
         errorCode.includes('invalid-credential') ||
         errorCode.includes('invalid-email');
}

