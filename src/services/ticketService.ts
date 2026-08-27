import { apiFetch } from './apiClient';
import { Ticket } from '../types';

export const ticketService = {
  getTickets: async () => {
    return apiFetch<{ tickets: Ticket[] }>('/tickets');
  },

  createTicket: async (ticket: Partial<Ticket>) => {
    return apiFetch<{ message: string; ticket: Ticket }>('/tickets', {
      method: 'POST',
      data: ticket,
    });
  },

  updateStatus: async (
    id: number,
    status: Ticket['status'],
    notes?: string,
    assignment?: {
      assigned_to?: string;
      assigned_to_name?: string;
      assigned_to_id?: number;
      picked_up_at?: string;
    }
  ) => {
    return apiFetch<{ message: string; ticket: Ticket }>(`/tickets/${id}/status`, {
      method: 'PATCH',
      data: { status, notes, ...assignment },
    });
  },

  deleteTicket: async (id: number) => {
    return apiFetch<{ message: string }>(`/tickets/${id}`, {
      method: 'DELETE',
    });
  },

  clearAllTickets: async () => {
    return apiFetch<{ message: string }>('/tickets/reset/all', {
      method: 'DELETE',
    });
  },
};
