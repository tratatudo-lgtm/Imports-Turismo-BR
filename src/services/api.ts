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
  requestOtp: (phoneNumber: string) => 
    privateFetcher<OtpResponse>('/admin/request-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),
  
  verifyOtp: (phoneNumber: string, otp: string) => 
    privateFetcher<VerifyOtpResponse>('/admin/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  // Admin Dashboard (requires token)
  getDashboard: (token: string) => 
    privateFetcher<DashboardStats>('/admin/dashboard', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  // Admin CRM
  getCRM: (token: string) => 
    privateFetcher<Customer[]>('/admin/crm', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getCustomerDetail: (token: string, id: string) => 
    privateFetcher<Customer>(`/admin/crm/${id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Admin Orders
  getAdminPedidos: (token: string) => 
    privateFetcher<QuoteRequest[]>('/admin/pedidos', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Admin Complaints
  getAdminReclamacoes: (token: string) => 
    privateFetcher<Complaint[]>('/admin/reclamacoes', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Admin Sales
  getAdminVendas: (token: string) => 
    privateFetcher<Sale[]>('/admin/vendas', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),

  // Client Auth
  requestClientOtp: (phoneNumber: string) => 
    privateFetcher<OtpResponse>('/client/request-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),
  
  verifyClientOtp: (phoneNumber: string, otp: string) => 
    privateFetcher<ClientSession>('/client/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  requestMagicLink: (email: string) => 
    privateFetcher<MagicLinkResponse>('/client/request-magic-link', { method: 'POST', body: JSON.stringify({ email }) }),
  
  verifyMagicLink: (token: string) => 
    privateFetcher<ClientSession>('/client/verify-magic-link', { method: 'POST', body: JSON.stringify({ token }) }),

  // Client Area (requires token)
  getClientDashboard: (token: string) => 
    privateFetcher<ClientDashboardData>('/client/dashboard', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientPurchases: (token: string) => 
    privateFetcher<Sale[]>('/client/compras', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientDocuments: (token: string) => 
    privateFetcher<ClientDocument[]>('/client/documentos', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  downloadDocument: (token: string, id: string) => 
    privateFetcher<Blob>(`/client/documentos/${id}/download`, { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientSupport: (token: string) => 
    privateFetcher<Complaint[]>('/client/apoio', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
  
  getClientProfile: (token: string) => 
    privateFetcher<Customer>('/client/perfil', { 
      headers: { Authorization: `Bearer ${token}` } 
    }),
};
