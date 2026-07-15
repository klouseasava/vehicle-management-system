import { apiRequest } from './client'
import { mockDrivers } from './mockData'

export interface Driver {
  employee_id: string
  full_name: string
  id_number: string
  email: string
  phone_number: string
  license_number: string
  status: string
  profile_photo?: string
}

export function listDrivers(): Promise<Driver[]> {
  return apiRequest('/telematics/drivers', { fallback: mockDrivers })
}

// Registration is multipart because a profile photo is mandatory.
export function registerDriver(
  fields: Omit<Driver, 'profile_photo'>,
  photo: File,
): Promise<{ message: string }> {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => fd.append(k, String(v)))
  fd.append('profile_photo', photo)
  return apiRequest('/telematics/drivers/register', {
    method: 'POST',
    formData: fd,
    fallback: { message: `Registered ${fields.full_name} (demo mode).` },
  })
}

export function updateDriverStatus(
  employee_id: string,
  status: string,
): Promise<{ message: string }> {
  return apiRequest(`/telematics/drivers/${employee_id}/status`, {
    method: 'PATCH',
    body: { status },
    fallback: { message: `Status updated to ${status} (demo mode).` },
  })
}

// Update details (no photo).
export function updateDriver(
  employee_id: string,
  fields: Omit<Driver, 'profile_photo'>,
): Promise<{ message: string }> {
  return apiRequest(`/telematics/drivers/${employee_id}`, {
    method: 'PUT',
    body: fields,
    fallback: { message: `Updated ${fields.full_name} (demo mode).` },
  })
}

export function deleteDriver(
  employee_id: string,
): Promise<{ message: string }> {
  return apiRequest(`/telematics/drivers/${employee_id}`, {
    method: 'DELETE',
    fallback: { message: `Deleted ${employee_id} (demo mode).` },
  })
}
