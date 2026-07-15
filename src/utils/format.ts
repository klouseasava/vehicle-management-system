// format.ts — small shared formatting + validation helpers.

// Kenyan Shillings, e.g. KSh 12,345.67
export function formatKsh(value: number): string {
  return (
    'KSh ' +
    value.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

export function formatNumber(value: number, digits = 1): string {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

// Kenyan phone: +2547XXXXXXXX / +2541XXXXXXXX / 07XXXXXXXX / 01XXXXXXXX
export function isValidKenyanPhone(phone: string): boolean {
  const p = phone.replace(/\s+/g, '')
  return /^(\+254|0)(7|1)\d{8}$/.test(p)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Work ID format like VFM-XXXX
export function isValidWorkId(id: string): boolean {
  return /^VFM-\d{3,5}$/i.test(id.trim())
}
