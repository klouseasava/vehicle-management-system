// src/services/workTickets.ts
import { apiRequest } from './client';

export interface WorkTicket {
  ticket_id: string;
  vehicle_plate: string;
  driver_name: string;
  destination: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Service to list work tickets based on status
export function listWorkTickets(status?: string): Promise<WorkTicket[]> {
  return apiRequest('/work-tickets', {
    params: { status },
    fallback: [
      {
        ticket_id: 'WT-001',
        vehicle_plate: 'KDM 420X',
        driver_name: 'Moses Omondi',
        destination: 'Mbale Town',
        start_time: '2024-05-15 08:00',
        end_time: '2024-05-15 17:00',
        purpose: 'Official duty',
        status: 'Pending',
      },
    ],
  });
}

// Service to approve or reject a work ticket
export function approveWorkTicket(ticket_id: string, approve: boolean): Promise<{ message: string }> {
  return apiRequest(`/work-tickets/${ticket_id}/approve`, {
    method: 'POST',
    body: { approve },
    fallback: { message: `Work ticket ${ticket_id} ${approve ? 'approved' : 'rejected'} (demo mode).` },
  });
}