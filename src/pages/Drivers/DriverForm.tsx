import React, { useState, useRef } from 'react'
// DriverForm.tsx — registration/edit form with required photo on registration and replaceable photo on edit.
import { UploadIcon } from 'lucide-react'
import type { Driver } from '../../api/drivers'
import { isValidEmail, isValidKenyanPhone } from '../../utils/format'
export interface DriverFormValues {
  employee_id: string
  full_name: string
  id_number: string
  email: string
  phone_number: string
  license_number: string
  status: string
}
export function DriverForm({
  mode,
  initial,
  busy,
  onSubmit,
  submitLabel,
}: {
  mode: 'register' | 'edit'
  initial?: Partial<Driver>
  busy?: boolean
  onSubmit: (v: DriverFormValues, p: File | null) => void
  submitLabel: string
}) {
  const [v, setV] = useState<DriverFormValues>({
    employee_id: initial?.employee_id || '',
    full_name: initial?.full_name || '',
    id_number: initial?.id_number || '',
    email: initial?.email || '',
    phone_number: initial?.phone_number || '',
    license_number: initial?.license_number || '',
    status: initial?.status || 'pending',
  })
  const [p, setP] = useState<File | null>(null)
  const [preview, setPreview] = useState(initial?.profile_photo || '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const ref = useRef<HTMLInputElement>(null)
  const change = (k: keyof DriverFormValues, value: string) =>
    setV((x) => ({
      ...x,
      [k]: value,
    }))
  function submit(e: React.FormEvent) {
    e.preventDefault()
    const n: Record<string, string> = {}
    if (!v.employee_id) n.employee_id = 'Required.'
    if (v.full_name.length < 2) n.full_name = 'Enter a name.'
    if (!isValidEmail(v.email)) n.email = 'Enter a valid email.'
    if (!isValidKenyanPhone(v.phone_number))
      n.phone_number = 'Use a Kenyan phone format.'
    if (!v.license_number) n.license_number = 'Required.'
    if (mode === 'register' && !p) n.photo = 'A profile photo is required.'
    setErrors(n)
    if (!Object.keys(n).length) onSubmit(v, p)
  }
  return (
    <form onSubmit={submit}>
      <div className="driver-form__photo">
        <div className="driver-form__avatar">
          {preview ? (
            <img src={preview} alt="Driver preview" />
          ) : (
            <span>Photo</span>
          )}
        </div>
        <div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => ref.current?.click()}
          >
            <UploadIcon size={15} />
            {mode === 'edit' ? 'Replace photo' : 'Upload photo'}
            {mode === 'register' && <span className="req">*</span>}
          </button>
          <input
            hidden
            ref={ref}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setP(file)
                setPreview(URL.createObjectURL(file))
              }
            }}
          />
          {errors.photo && <span className="field__error">{errors.photo}</span>}
        </div>
      </div>
      <div className="field-row">
        {(
          ['employee_id', 'full_name', 'id_number', 'license_number'] as const
        ).map((k) => (
          <div className="field" key={k}>
            <label className="field__label">
              {k.replace('_', ' ')}
              <span className="req">*</span>
            </label>
            <input
              className={`input ${errors[k] ? 'input--error' : ''}`}
              value={v[k]}
              disabled={k === 'employee_id' && mode === 'edit'}
              onChange={(e) => change(k, e.target.value)}
            />
            {errors[k] && <span className="field__error">{errors[k]}</span>}
          </div>
        ))}
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field__label">
            Email<span className="req">*</span>
          </label>
          <input
            className="input"
            value={v.email}
            onChange={(e) => change('email', e.target.value)}
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </div>
        <div className="field">
          <label className="field__label">
            Phone<span className="req">*</span>
          </label>
          <input
            className="input"
            value={v.phone_number}
            onChange={(e) => change('phone_number', e.target.value)}
          />
          {errors.phone_number && (
            <span className="field__error">{errors.phone_number}</span>
          )}
        </div>
      </div>
      <div className="field">
        <label className="field__label">Status</label>
        <select
          className="select"
          value={v.status}
          onChange={(e) => change('status', e.target.value)}
        >
          {['pending', 'active', 'suspended'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <button className="btn btn--primary btn--block" disabled={busy}>
        {busy ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
