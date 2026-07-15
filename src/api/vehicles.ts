import { apiRequest } from './client'
import { mockVehicles, mockTracking } from './mockData'

export interface Vehicle {
  plate_number: string
  model: string
  engine_size_cc?: number
  name?: string
  year?: number
  make?: string
  vin?: string
  status?: string
  meter_reading?: number
  image_urls?: string[]
  assigned_employee_id?: string
}

export function listVehicles(): Promise<Vehicle[]> {
  return apiRequest('/telematics/vehicles', { fallback: mockVehicles })
}

export function addVehicle(v: {
  plate_number: string
  model: string
  engine_size_cc: number
}): Promise<Vehicle> {
  return apiRequest('/telematics/vehicles/add', {
    method: 'POST',
    body: v,
    fallback: { ...v, status: 'Unassigned' },
  })
}

export function bulkUploadVehicles(
  file: File,
): Promise<{ message: string; count?: number }> {
  const fd = new FormData()
  fd.append('file', file)
  return apiRequest('/telematics/vehicles/bulk-upload', {
    method: 'POST',
    formData: fd,
    fallback: { message: `Uploaded ${file.name} (demo mode).` },
  })
}

export function assignDriver(
  plate_number: string,
  employee_id: string,
): Promise<{ message: string }> {
  return apiRequest('/telematics/vehicles/assign', {
    method: 'POST',
    params: { plate_number, employee_id },
    fallback: {
      message: `Assigned ${employee_id} to ${plate_number} (demo mode).`,
    },
  })
}

export interface TrackedVehicle {
  id: number
  plate: string
  model: string
  status: string
  driver?: string
  work_id?: string
  phone?: string
  authorized?: boolean
  assignment_age_mins: number
  route_distance_km: number
  lat: number
  lng: number
  speed?: number
  direction?: number
  route_index?: number
}

export async function listTracking(): Promise<TrackedVehicle[]> {
  // TODO: backend endpoint not available yet — replace with live GPS REST/WebSocket.
  return Promise.resolve(mockTracking)
}
