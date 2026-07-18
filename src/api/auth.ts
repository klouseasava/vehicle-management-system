// auth.ts — Two-step OTP auth endpoints.
import { apiRequest } from './client'

export interface RequestOtpPayload {
  email: string
  password: string
  is_login: boolean
  work_id?: string
  full_name?: string
  department?: string // Matches Java backend DTO
}

/**
 * Step 1: Request an OTP for login OR register.
 */
export async function requestOtp(
  payload: RequestOtpPayload,
): Promise<{ message: string }> {
  return apiRequest('/auth/request-otp', {
    method: 'POST',
    body: payload,
    noAuth: true,
  })
}

/**
 * Step 2: Verify the 6-digit OTP -> returns a live JWT access token.
 */
export async function verifyOtp(
  email: string,
  otp_code: string,
): Promise<{ access_token: string }> {
  return apiRequest('/auth/verify-otp', {
    method: 'POST',
    // Sends 'code' to match OtpVerifyDto in your Java backend
    body: { email, code: otp_code }, 
    noAuth: true,
  })
}