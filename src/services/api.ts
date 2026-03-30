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
  ClientSession,
  AdminTicket,
  AdminTicketStats,
  AdminClient,
  AdminSale,
  AdminSalesStats
} from '../types';

const PUBLIC_API_BASE_URL = 'https://api.tratatudo.pt/api/public';
const PRIVATE_API_BASE_URL = 'https://api.tratatudo.pt/api';
const SITE_KEY = 'imports-turismo-br';

async function baseFetcher<T>(baseUrl: string, endpoint: string, options?: RequestInit, appendSiteKey: boolean = false): Promise<T> {
  const url = new URL(`${baseUrl}${endpoint}`);
  
  // For GET requests, append site_key to query params if requested
  if (appendSiteKey && (options?.method === 'GET' || !options?.method)) {
    url.searchParams.append('site_key', SITE_KEY);
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    // Ensure credentials (cookies) are included for all requests
    // This is critical for session-based authentication
    credentials: 'include',
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

const publicFetcher = <T>(endpoint: string, options?: RequestInit) => 
  baseFetcher<T>(PUBLIC_API_BASE_URL, endpoint, options, true);

const privateFetcher = <T>(endpoint: string, options?: RequestInit) => 
  baseFetcher<T>(PRIVATE_API_BASE_URL, endpoint, options, false);

export const apiService = {
  // Public Endpoints (using publicFetcher)
  createQuote: (data: any) => 
    publicFetcher<{ trackingCode: string }>('/request', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, site_key: SITE_KEY, type: 'orcamento' }) 
    }),
  
  createBooking: (data: any) => 
    publicFetcher<{ trackingCode: string }>('/request', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, site_key: SITE_KEY, type: 'reserva' }) 
    }),
  
  createComplaint: (data: any) => 
    publicFetcher<any>('/complaint', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, site_key: SITE_KEY }) 
    }),
  
  trackRequest: (trackingCode: string) => 
    publicFetcher<TrackingResponse>(`/track/${trackingCode}`),

  // Chat Endpoints (using publicFetcher)
  startChat: () =>
    publicFetcher<{ sessionId: string }>('/chat/start', {
      method: 'POST',
      body: JSON.stringify({ site_key: SITE_KEY })
    }),

  sendChatMessage: (sessionId: string, message: string) =>
    publicFetcher<{ reply: string; quick_actions?: { label: string; action: string }[] }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ site_key: SITE_KEY, sessionId, message })
    }),

  // Admin Auth (using privateFetcher)
  adminLogin: (data: any) =>
    privateFetcher<{ ok: boolean; message?: string }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  requestOtp: (phoneNumber: string) => 
    privateFetcher<OtpResponse>('/auth/send-otp', { 
      method: 'POST', 
      body: JSON.stringify({ phone_e164: phoneNumber }) 
    }),
  
  verifyOtp: (phoneNumber: string, otp: string) => 
    privateFetcher<VerifyOtpResponse>('/auth/verify-otp', { 
      method: 'POST', 
      body: JSON.stringify({ phone_e164: phoneNumber, code: otp }) 
    }),

  // Admin Dashboard (Session-based)
  getAdminTickets: () => 
    privateFetcher<AdminTicket[]>('/admin/tickets'),
  
  getAdminTicketStats: () => 
    privateFetcher<AdminTicketStats>('/admin/tickets/stats'),
  
  // Admin CRM
  getAdminClients: () => 
    privateFetcher<AdminClient[]>('/admin/clients'),
  
  getAdminClientDetail: (id: string) => 
    privateFetcher<AdminClient>(`/admin/clients/${id}`),

  // Admin Sales
  getAdminSales: () => 
    privateFetcher<AdminSale[]>('/admin/sales'),

  getAdminSalesStats: () => 
    privateFetcher<AdminSalesStats>('/admin/sales/stats'),

  updateTicketStatus: (id: string, status: string) =>
    privateFetcher<any>(`/admin/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  // Legacy Admin Dashboard (requires token) - Keep for compatibility if needed, but we'll use new ones
  getDashboard: (token?: string) => 
    privateFetcher<DashboardStats>('/admin/dashboard', { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
  
  // Legacy Admin CRM
  getCRM: (token?: string) => 
    privateFetcher<Customer[]>('/admin/crm', { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
  
  getCustomerDetail: (token: string | undefined, id: string) => 
    privateFetcher<Customer>(`/admin/crm/${id}`, { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),

  // Legacy Admin Orders
  getAdminPedidos: (token?: string) => 
    privateFetcher<QuoteRequest[]>('/admin/pedidos', { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),

  // Legacy Admin Complaints
  getAdminReclamacoes: (token?: string) => 
    privateFetcher<Complaint[]>('/admin/reclamacoes', { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),

  // Legacy Admin Sales
  getAdminVendas: (token?: string) => 
    privateFetcher<Sale[]>('/admin/vendas', { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),

  // Client Auth
  requestClientOtp: (phoneNumber: string) => 
    privateFetcher<OtpResponse>('/auth/send-otp', { 
      method: 'POST', 
      body: JSON.stringify({ phone_e164: phoneNumber }) 
    }),
  
  verifyClientOtp: (phoneNumber: string, otp: string) => 
    privateFetcher<ClientSession>('/auth/verify-otp', { 
      method: 'POST', 
      body: JSON.stringify({ phone_e164: phoneNumber, code: otp }) 
    }),

  getSession: () => 
    privateFetcher<any>('/auth/session'),

  requestMagicLink: (email: string) => 
    privateFetcher<MagicLinkResponse>('/auth/request-magic-link', { method: 'POST', body: JSON.stringify({ email }) }),
  
  verifyMagicLink: (token: string) => 
    privateFetcher<ClientSession>('/auth/verify-magic-link', { method: 'POST', body: JSON.stringify({ token }) }),

  // Client Area (Session-based)
  getClientDashboardStats: () => 
    privateFetcher<{ ok: boolean; stats: any }>('/client/dashboard/stats'),

  getClientTickets: () => 
    privateFetcher<{ ok: boolean; tickets: any[] }>('/client/tickets'),

  getTicketDetail: (id: string) => 
    privateFetcher<any>(`/client/tickets/${id}`),

  getTicketMessages: (id: string) => 
    privateFetcher<any[]>(`/client/tickets/${id}/messages`),

  getTicketHistory: (id: string) => 
    privateFetcher<any[]>(`/client/tickets/${id}/history`),
  
  getClientPurchases: () => 
    privateFetcher<{ ok: boolean; tickets: any[] }>('/client/tickets'),
  
  getClientDocuments: () => 
    privateFetcher<{ ok: boolean; documents: any[] }>('/client/documents'),
  
  downloadDocument: (id: string) => 
    privateFetcher<Blob>(`/client/documents/${id}/download`),
  
  getClientSupport: () => 
    privateFetcher<{ ok: boolean; tickets: any[] }>('/client/tickets'),
  
  getClientProfile: () => 
    privateFetcher<any>('/auth/session'),
};
