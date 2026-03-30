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
  DashboardStats,
  TrackingResponse,
  OtpResponse,
  VerifyOtpResponse,
  Customer,
  Sale,
  ClientDashboardData,
  ClientDocument,
  MagicLinkResponse,
  Complaint,
  ClientSession
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

  // Handle blob responses
  if (response.headers.get('Content-Type')?.includes('application/octet-stream') || endpoint.includes('download')) {
    return response.blob() as any;
  }

  return response.json();
}

export const apiService = {
  // ... (existing public endpoints)
  createLead: (data: Lead) => 
    fetcher<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),
  
  createQuote: (data: QuoteRequest) => 
    fetcher<{ trackingCode: string }>('/orcamentos', { method: 'POST', body: JSON.stringify(data) }),
  
  createBooking: (data: BookingRequest) => 
    fetcher<{ trackingCode: string }>('/reservas', { method: 'POST', body: JSON.stringify(data) }),
  
  createContact: (data: ContactRequest) => 
    fetcher<ContactRequest>('/contactos', { method: 'POST', body: JSON.stringify(data) }),
  
  createComplaint: (data: ComplaintRequest) => 
    fetcher<ComplaintRequest>('/reclamacoes', { method: 'POST', body: JSON.stringify(data) }),
  
  trackRequest: (trackingCode: string) => 
    fetcher<TrackingResponse>(`/pedidos/${trackingCode}`),

  // Admin Auth
  requestOtp: (phoneNumber: string) => 
    fetcher<OtpResponse>('/admin/request-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),
  
  verifyOtp: (phoneNumber: string, otp: string) => 
    fetcher<VerifyOtpResponse>('/admin/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  // Admin Dashboard (requires token)
  getDashboard: (token: string) => 
    fetcher<DashboardStats>('/admin/dashboard', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  // Admin CRM
  getCRM: (token: string) => 
    fetcher<Customer[]>('/admin/crm', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getCustomerDetail: (token: string, id: string) => 
    fetcher<Customer>(`/admin/crm/${id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Admin Orders
  getAdminPedidos: (token: string) => 
    fetcher<QuoteRequest[]>('/admin/pedidos', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Admin Complaints
  getAdminReclamacoes: (token: string) => 
    fetcher<Complaint[]>('/admin/reclamacoes', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Admin Sales
  getAdminVendas: (token: string) => 
    fetcher<Sale[]>('/admin/vendas', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Client Auth
  requestClientOtp: (phoneNumber: string) => 
    fetcher<OtpResponse>('/client/request-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),
  
  verifyClientOtp: (phoneNumber: string, otp: string) => 
    fetcher<ClientSession>('/client/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  requestMagicLink: (email: string) => 
    fetcher<MagicLinkResponse>('/client/request-magic-link', { method: 'POST', body: JSON.stringify({ email }) }),
  
  verifyMagicLink: (token: string) => 
    fetcher<ClientSession>('/client/verify-magic-link', { method: 'POST', body: JSON.stringify({ token }) }),

  // Client Area (requires token)
  getClientDashboard: (token: string) => 
    fetcher<ClientDashboardData>('/client/dashboard', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientPurchases: (token: string) => 
    fetcher<Sale[]>('/client/compras', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientDocuments: (token: string) => 
    fetcher<ClientDocument[]>('/client/documentos', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  downloadDocument: (token: string, id: string) => 
    fetcher<Blob>(`/client/documentos/${id}/download`, { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientSupport: (token: string) => 
    fetcher<Complaint[]>('/client/apoio', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientProfile: (token: string) => 
    fetcher<Customer>('/client/perfil', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
};
