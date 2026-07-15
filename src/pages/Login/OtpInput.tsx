import React, { useState, useRef } from 'react'
// OtpInput.tsx — 6-cell OTP entry with paste + auto-advance + backspace nav.

import './Login.css'
interface Props {
  onComplete: (code: string) => void
  disabled?: boolean
}
export function OtpInput({ onComplete, disabled }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const refs = useRef<Array<HTMLInputElement | null>>([])
  function setDigit(i: number, val: string) {
    const clean = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = clean
    setDigits(next)
    if (clean && i < 5) refs.current[i + 1]?.focus()
    if (next.every((d) => d !== '')) onComplete(next.join(''))
  }
  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0)
      refs.current[i - 1]?.focus()
  }
  function onPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setDigits(next)
    if (next.every((d) => d !== '')) onComplete(next.join(''))
    else refs.current[pasted.length]?.focus()
  }
  return (
    <div className="otp" onPaste={onPaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="otp__cell mono"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
        />
      ))}
    </div>
  )
}
