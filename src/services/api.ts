/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Lead, 
  QuoteRequest, 
  BookingRequest, 
  ContactRequest, 
  ComplaintRequest, 
  DashboardStats 
} from '../types';

const API_BASE_URL = 'https://api.tratatudo.pt/api/imports-turismo';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro HTTP: ${response.status}`);
  }

  return response.json();
}

export const apiService = {
  // Public Endpoints
  createLead: (data: Lead) => 
    fetcher('/leads', { method: 'POST', body: JSON.stringify(data) }),
  
  createQuote: (data: QuoteRequest) => 
    fetcher('/orcamentos', { method: 'POST', body: JSON.stringify(data) }),
  
  createBooking: (data: BookingRequest) => 
    fetcher('/reservas', { method: 'POST', body: JSON.stringify(data) }),
  
  createContact: (data: ContactRequest) => 
    fetcher('/contactos', { method: 'POST', body: JSON.stringify(data) }),
  
  createComplaint: (data: ComplaintRequest) => 
    fetcher('/reclamacoes', { method: 'POST', body: JSON.stringify(data) }),
  
  trackRequest: (trackingCode: string) => 
    fetcher<any>(`/pedidos/${trackingCode}`),

  // Admin Auth
  requestOtp: (phoneNumber: string) => 
    fetcher('/admin/request-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),
  
  verifyOtp: (phoneNumber: string, otp: string) => 
    fetcher<{ token: string }>('/admin/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  // Admin Dashboard (requires token)
  getDashboard: (token: string) => 
    fetcher<DashboardStats>('/admin/dashboard', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getLeads: (token: string) => 
    fetcher<Lead[]>('/admin/leads', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getPedidos: (token: string) => 
    fetcher<(QuoteRequest | BookingRequest)[]>('/admin/pedidos', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getReclamacoes: (token: string) => 
    fetcher<ComplaintRequest[]>('/admin/reclamacoes', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
};
