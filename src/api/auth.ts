// auth.ts — Two-step OTP auth endpoints.
import { apiRequest } from './client'

export interface RequestOtpPayload {
  email: string
  password: string
  is_login: boolean
  work_id?: string
  full_name?: string
}

// Step 1: request an OTP for login OR register.
export async function requestOtp(
  payload: RequestOtpPayload,
): Promise<{ message: string }> {
  return apiRequest('/auth/request-otp', {
    method: 'POST',
    body: payload,
    noAuth: true,
    // Demo fallback so the OTP flow is testable without a live backend.
    fallback: {
      message: 'OTP sent (demo mode). Use any 6 digits to continue.',
    },
  })
}

// Step 2: verify the 6-digit OTP -> returns a JWT access token.
export async function verifyOtp(
  email: string,
  otp_code: string,
): Promise<{ access_token: string }> {
  return apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: { email, otp_code },
    noAuth: true,
    fallback: { access_token: 'demo.jwt.token' },
  })
}
