import { apiRequest } from './client'
import { mockPartsLedger } from './mockData'

export type LedgerSort =
  | 'agency_priority'
  | 'cost_desc'
  | 'cost_asc'
  | 'model_asc'

export interface LedgerItem {
  agency: string
  plate_number: string
  model: string
  part_name: string
  urgency: string
  ai_quote: string
  notes: string
}

export function getPartsLedger(
  sort_by: LedgerSort = 'agency_priority',
): Promise<LedgerItem[]> {
  return apiRequest('/maintenance/admin/parts-ledger', {
    params: { sort_by },
    fallback: mockPartsLedger,
  })
}

export function reportDefect(payload: {
  plate_number: string
  part_name: string
  urgency_level: string
}): Promise<{ message: string }> {
  return apiRequest('/maintenance/report-defect', {
    method: 'POST',
    body: payload,
    fallback: {
      message: `Defect reported for ${payload.plate_number} (demo mode).`,
    },
  })
}
