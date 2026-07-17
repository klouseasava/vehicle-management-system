// src/services/reports.ts
import { apiRequest } from './client';

export type ReportType = 'driver_report' | 'vehicle_report' | 'maintenance_report' | 'fuel_report';

export interface ReportParameters {
  report_type: ReportType;
  driver_id?: string;
  vehicle_plate?: string;
  start_date?: string;
  end_date?: string;
}

// Request to generate a report. The backend would likely generate a file (e.g., PDF, CSV).
export function generateReport(params: ReportParameters): Promise<{ message: string; download_url?: string }> {
  return apiRequest('/reports/generate', {
    method: 'POST',
    body: params,
    // Provide a demo feedback
    fallback: { message: `Report generation for ${params.report_type} initiated (demo mode).` },
  });
}

// For reports, you might need a way to check report status and get the download link.
// export function checkReportStatus(report_id: string): Promise<{ status: string; download_url?: string }> { ... }