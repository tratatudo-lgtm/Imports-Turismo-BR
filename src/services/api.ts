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

const API_BASE_URL = 'https://api.tratatudo.pt/api/public';
const SITE_KEY = 'imports-turismo-br';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // For GET requests, append site_key to query params if not already there
  if (options?.method === 'GET' || !options?.method) {
    url.searchParams.append('site_key', SITE_KEY);
  }

  const response = await fetch(url.toString(), {
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
  const contentType = response.headers.get('Content-Type');
  if (contentType?.includes('application/octet-stream') || contentType?.includes('application/pdf') || endpoint.includes('download')) {
    return response.blob() as unknown as T;
  }

  return response.json();
}

export const apiService = {
  // Public Endpoints
  createQuote: (data: any) => 
    fetcher<{ trackingCode: string }>('/request', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, site_key: SITE_KEY, type: 'orcamento' }) 
    }),
  
  createBooking: (data: any) => 
    fetcher<{ trackingCode: string }>('/request', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, site_key: SITE_KEY, type: 'reserva' }) 
    }),
  
  createComplaint: (data: any) => 
    fetcher<any>('/complaint', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, site_key: SITE_KEY }) 
    }),
  
  trackRequest: (trackingCode: string) => 
    fetcher<TrackingResponse>(`/track/${trackingCode}`),

  // Chat Endpoints
  startChat: () =>
    fetcher<{ sessionId: string }>('/chat/start', {
      method: 'POST',
      body: JSON.stringify({ site_key: SITE_KEY })
    }),

  sendChatMessage: (sessionId: string, message: string) =>
    fetcher<{ reply: string; quick_actions?: { label: string; action: string }[] }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ site_key: SITE_KEY, sessionId, message })
    }),

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
