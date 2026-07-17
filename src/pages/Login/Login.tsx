import React, { useState, useEffect } from 'react'
// Login.tsx — auth gate. Handles login, register and the shared 6-digit OTP step.
// Three internal steps: 'credentials' (login|register form) -> 'otp' entry -> success.

import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TruckIcon, ShieldCheckIcon, ArrowLeftIcon } from 'lucide-react'
import { requestOtp, verifyOtp } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { isValidEmail, isValidWorkId } from '../../utils/format'
import { OtpInput } from './OtpInput'
import './Login.css'

// Slideshow images sourced from public directory
const SLIDESHOW_IMAGES = ['/countylogo.png', '/countyoffice.png', '/map.png']

type Mode = 'login' | 'register'
type Step = 'credentials' | 'otp'

export function Login() {
  const { login, timedOut, clearTimedOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [step, setStep] = useState<Step>('credentials')
  const [submitting, setSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === SLIDESHOW_IMAGES.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [workId, setWorkId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateCredentials(): boolean {
    const e: Record<string, string> = {}
    if (!isValidEmail(email)) e.email = 'Enter a valid email address.'
    if (password.length < 4) e.password = 'Password is required.'
    if (mode === 'register') {
      if (fullName.trim().length < 2) e.fullName = 'Enter your full name.'
      if (!isValidWorkId(workId))
        e.workId = 'Work ID should look like VFM-1024.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleRequestOtp(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validateCredentials()) return
    setSubmitting(true)
    try {
      await requestOtp({
        email,
        password,
        is_login: mode === 'login',
        ...(mode === 'register'
          ? {
              full_name: fullName,
              work_id: workId,
            }
          : {}),
      })
      toast.info('Verification code sent to your email.')
      setStep('otp')
    } catch (err) {
      toast.error('Could not send code. Check your credentials and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerify(code: string) {
    setSubmitting(true)
    try {
      const { access_token } = await verifyOtp(email, code)
      login(access_token, {
        email,
        full_name:
          mode === 'register'
            ? fullName
            : email.split('@')[0].replace(/\./g, ' '),
        role: 'Fleet Administrator',
        regional_office: 'Vihiga County HQ',
        work_id: workId || undefined,
      })
      toast.success('Welcome to VFMS.')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Invalid or expired code. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      {/* Left: brand + county road hero */}
      <div
        className="login__hero"
        style={{
          backgroundImage: `url(${SLIDESHOW_IMAGES[currentImageIndex]})`,
        }}
      >
        <div className="login__hero-overlay" />
        <div className="login__hero-content">
          <div className="login__brand">
            <span className="login__brand-mark">
              <TruckIcon size={22} />
            </span>
            <span className="login__brand-name">VFMS</span>
          </div>
          <h1 className="login__hero-title">Vihiga County Fleet Management</h1>
          <p className="login__hero-sub">
            Home of diverse landscape, culture and talent.
          </p>
        </div>
      </div>

      {/* Right: auth card */}
      <div className="login__panel">
        <div className="login__card">
          {timedOut && step === 'credentials' && (
            <div className="login__timeout" role="alert">
              <ShieldCheckIcon size={16} />
              You were logged out for security after 5 minutes of inactivity.
              <button
                className="login__timeout-dismiss"
                onClick={clearTimedOut}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.div
                key="credentials"
                initial={{
                  opacity: 0,
                  x: -16,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -16,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <h2 className="login__title">
                  {mode === 'login' ? 'Sign in' : 'Create your account'}
                </h2>
                <p className="login__subtitle">
                  {mode === 'login'
                    ? 'Access the county fleet operations dashboard.'
                    : 'Register as county fleet staff to get started.'}
                </p>

                <form onSubmit={handleRequestOtp} noValidate>
                  {mode === 'register' && (
                    <>
                      <div className="field">
                        <label className="field__label" htmlFor="fullName">
                          Full name<span className="req">*</span>
                        </label>
                        <input
                          id="fullName"
                          className={`input ${errors.fullName ? 'input--error' : ''}`}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jane Achieng"
                        />
                        {errors.fullName && (
                          <span className="field__error">
                            {errors.fullName}
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label className="field__label" htmlFor="workId">
                          Work ID<span className="req">*</span>
                        </label>
                        <input
                          id="workId"
                          className={`input ${errors.workId ? 'input--error' : ''}`}
                          value={workId}
                          onChange={(e) => setWorkId(e.target.value)}
                          placeholder="VFM-1024"
                        />
                        {errors.workId && (
                          <span className="field__error">{errors.workId}</span>
                        )}
                      </div>
                    </>
                  )}

                  <div className="field">
                    <label className="field__label" htmlFor="email">
                      Email<span className="req">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`input ${errors.email ? 'input--error' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@vihiga.go.ke"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <span className="field__error">{errors.email}</span>
                    )}
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="password">
                      Password<span className="req">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      className={`input ${errors.password ? 'input--error' : ''}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                    />
                    {errors.password && (
                      <span className="field__error">{errors.password}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary btn--block"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Send code'}
                  </button>
                </form>

                <p className="login__toggle">
                  {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login')
                      setErrors({})
                    }}
                  >
                    {mode === 'login' ? 'Register' : 'Log in'}
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{
                  opacity: 0,
                  x: 16,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 16,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <button
                  className="login__back"
                  onClick={() => setStep('credentials')}
                >
                  <ArrowLeftIcon size={16} /> Back
                </button>
                <h2 className="login__title">Enter verification code</h2>
                <p className="login__subtitle">
                  We sent a 6-digit code to <strong>{email}</strong>.
                </p>
                <OtpInput onComplete={handleVerify} disabled={submitting} />
                <button
                  className="btn btn--ghost btn--block"
                  style={{
                    marginTop: 18,
                  }}
                  disabled={submitting}
                  onClick={() =>
                    handleRequestOtp(
                      new Event('submit') as unknown as React.FormEvent,
                    )
                  }
                >
                  Resend code
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="login__footer">
          Vihiga County Government · Fleet Operations
        </p>
      </div>
    </div>
  )
}