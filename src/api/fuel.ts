// fuel.ts — Fleet fuel summary/forecast + daily log lookup (/telematics/fleet).
import { apiRequest } from './client'
import { mockFuelSummary, mockDailyLog } from './mockData'

export interface FuelSummary {
  summary: { total_fleet_litres: number; total_fleet_cost: number }
  forecast: { estimated_next_month_budget_ksh: number }
  vehicles: Array<{
    plate_number: string
    model: string
    monthly_total_litres: number
    monthly_total_cost: number
    daily_average_litres: number
  }>
}

export function getFuelSummary(): Promise<FuelSummary> {
  return apiRequest('/telematics/fleet/fuel-summary', {
    fallback: mockFuelSummary,
  })
}

export interface DailyLogRow {
  plate_number: string
  distance: number
  litres: number
  cost: number
  speed: number
}

export function getDailyLog(target_date: string): Promise<DailyLogRow[]> {
  return apiRequest('/telematics/fleet/daily-log', {
    params: { target_date },
    fallback: mockDailyLog(target_date),
  })
}
