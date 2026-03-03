/**
 * Authentication routes and constants
 */

export const AUTH_ROUTES = {
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  HOME: "/",
} as const;

export const PUBLIC_ROUTES = [
  AUTH_ROUTES.SIGNUP,
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.CALLBACK,
  AUTH_ROUTES.HOME,
] as const;

export const PROTECTED_ROUTES = [
  AUTH_ROUTES.DASHBOARD,
] as const;

/**
 * Password validation requirements
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 6,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`,
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_NOT_CONFIRMED: "Please verify your email before logging in",
  EMAIL_ALREADY_REGISTERED: "This email is already registered",
  SESSION_EXPIRED: "Your session has expired. Please sign in again",
  UNKNOWN_ERROR: "An unknown error occurred",
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: "Account created! Check your email to verify.",
  SIGNED_IN: "Signed in successfully",
  SIGNED_OUT: "Signed out successfully",
  PASSWORD_RESET_SENT: "Password reset link sent to your email",
  PASSWORD_RESET: "Password reset successfully",
} as const;
