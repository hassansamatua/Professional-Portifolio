"use client";

/**
 * Auth validation utilities for form validation and error handling
 */

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { field: "email", message: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }
  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }
  if (password.length < 6) {
    return {
      field: "password",
      message: "Password must be at least 6 characters long",
    };
  }
  return null;
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationError | null => {
  if (password !== confirmPassword) {
    return {
      field: "confirmPassword",
      message: "Passwords do not match",
    };
  }
  return null;
};

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // Supabase specific error messages
  if (error.message?.includes("Invalid login credentials")) {
    return "Invalid email or password";
  }
  if (error.message?.includes("Email not confirmed")) {
    return "Please verify your email before logging in";
  }
  if (error.message?.includes("User already registered")) {
    return "This email is already registered";
  }
  if (error.message?.includes("Password")) {
    return "Password must be at least 6 characters long";
  }

  return error.message || "An error occurred during authentication";
};
