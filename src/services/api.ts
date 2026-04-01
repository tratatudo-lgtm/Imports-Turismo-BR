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
  AdminSalesStats,
  AdminSession,
  AdminTravelOrder,
  AdminTravelPayment,
  AdminTravelStats
} from '../types';

const PUBLIC_API_BASE_URL = 'https://api.tratatudo.pt/api/public';
const PRIVATE_API_BASE_URL = 'https://api.tratatudo.pt/api';
const SITE_KEY = 'imports-turismo-br';

async function baseFetcher<T>(baseUrl: string, endpoint: string, options?: RequestInit, appendSiteKey: boolean = false): Promise<T> {
  const url = new URL(`${baseUrl}${endpoint}`, window.location.origin);
  
  // Append site_key to query params if requested
  if (appendSiteKey) {
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
    const errorData = await response.json().catch(() => ({}));
    // Improved error handling: check for message, error, or ok: false with error
    const errorMessage = errorData.message || errorData.error || (errorData.ok === false && errorData.error) || `Erro HTTP: ${response.status}`;
    throw new Error(errorMessage);
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

const adminFetcher = <T>(endpoint: string, options?: RequestInit) => {
  const method = options?.method?.toUpperCase() || 'GET';
  if (method === 'GET') {
    return baseFetcher<T>(PRIVATE_API_BASE_URL, endpoint, options, true);
  }
  
  return baseFetcher<T>(PRIVATE_API_BASE_URL, endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      'x-site-key': SITE_KEY
    }
  }, false);
};

/**
 * platformFetcher: Calls internal proxy routes (/api/platform/*)
 * to communicate with the TrataTudo Platform API securely.
 */
const platformFetcher = <T>(endpoint: string, options?: RequestInit) =>
  baseFetcher<T>('/api/platform', endpoint, options, false);

/**
 * unifiedAuthFetcher: Calls internal proxy routes (/api/auth/*)
 * to handle unified WhatsApp/OTP login for both Admin and Client.
 */
const unifiedAuthFetcher = <T>(endpoint: string, options?: RequestInit) =>
  baseFetcher<T>('/api/auth', endpoint, options, false);

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

  // Unified Auth (using unifiedAuthFetcher)
  sendOtp: (phoneNumber: string) =>
    unifiedAuthFetcher<OtpResponse>('/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone_e164: phoneNumber })
    }),

  verifyOtp: (phoneNumber: string, otp: string) =>
    unifiedAuthFetcher<any>('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone_e164: phoneNumber, code: otp })
    }),

  getSession: () =>
    unifiedAuthFetcher<any>('/session'),

  logout: () =>
    unifiedAuthFetcher<any>('/logout', { method: 'POST' }),

  // Admin Auth (Aliased to Unified Auth for compatibility)
  sendAdminOtp: (phoneNumber: string) => apiService.sendOtp(phoneNumber),
  verifyAdminOtp: (phoneNumber: string, otp: string) => apiService.verifyOtp(phoneNumber, otp),
  getAdminSession: () => apiService.getSession(),
  logoutAdmin: () => apiService.logout(),

  // Client Auth (Aliased to Unified Auth for compatibility)
  requestClientOtp: (phoneNumber: string) => apiService.sendOtp(phoneNumber),
  verifyClientOtp: (phoneNumber: string, otp: string) => apiService.verifyOtp(phoneNumber, otp),
  // getSession is already defined above
  getAdminTickets: () => 
    adminFetcher<any>('/admin/tickets').then(res => res.tickets || []),
  
  getAdminTicketStats: () => 
    adminFetcher<any>('/admin/tickets/stats').then(res => res.stats || { 
      totalTickets: 0, 
      activeTickets: 0, 
      complaints: 0, 
      openTickets: 0, 
      closedTickets: 0 
    }),
  
  // Admin CRM
  getAdminClients: () => 
    adminFetcher<any>('/admin/clients').then(res => res.clients || []),
  
  getAdminClientDetail: (id: string) => 
    adminFetcher<any>(`/admin/clients/${id}`).then(res => res.client || res),

  // Admin Sales
  getAdminSales: () => 
    adminFetcher<any>('/admin/sales').then(res => res.sales || []),

  getAdminSalesStats: () => 
    adminFetcher<any>('/admin/sales/stats').then(res => res.stats || { 
      totalSales: 0, 
      activeSubscriptions: 0, 
      trialSubscriptions: 0, 
      suspendedSubscriptions: 0, 
      totalRevenue: 0, 
      avgTicket: 0, 
      monthlyRevenue: 0 
    }),

  // Admin Travel Module
  getAdminTravelOrders: () =>
    adminFetcher<any>('/admin/travel/orders').then(res => res.orders || []),

  getAdminTravelOrderDetail: (id: string) =>
    adminFetcher<any>(`/admin/travel/orders/${id}`).then(res => res.order || res),

  createAdminTravelOrder: (data: any) =>
    adminFetcher<any>('/admin/travel/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateAdminTravelOrder: (id: string, data: any) =>
    adminFetcher<any>(`/admin/travel/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  getAdminTravelPayments: () =>
    adminFetcher<any>('/admin/travel/payments').then(res => res.payments || []),

  getAdminTravelPaymentDetail: (id: string) =>
    adminFetcher<any>(`/admin/travel/payments/${id}`).then(res => res.payment || res),

  createAdminTravelPayment: (data: any) =>
    adminFetcher<any>('/admin/travel/payments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateAdminTravelPayment: (id: string, data: any) =>
    adminFetcher<any>(`/admin/travel/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  getAdminTravelStats: () =>
    adminFetcher<any>('/admin/travel/stats').then(res => res.stats || {
      totalOrders: 0,
      awaitingPaymentOrders: 0,
      confirmedOrders: 0,
      paidPayments: 0,
      totalPaidAmount: 0,
      totalDueAmount: 0
    }),

  getAdminClientTravelOrders: (id: string) =>
    adminFetcher<any>(`/admin/clients/${id}/travel-orders`).then(res => res.orders || []),

  getAdminClientTravelPayments: (id: string) =>
    adminFetcher<any>(`/admin/clients/${id}/travel-payments`).then(res => res.payments || []),

  updateTicketStatus: (id: string, status: string) =>
    adminFetcher<any>(`/admin/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  // Legacy Admin Dashboard (requires token) - Keep for compatibility if needed, but we'll use new ones
  getDashboard: () => 
    adminFetcher<DashboardStats>('/admin/dashboard'),
  
  // Legacy Admin CRM
  getCRM: () => 
    adminFetcher<Customer[]>('/admin/crm'),
  
  getCustomerDetail: (id: string) => 
    adminFetcher<Customer>(`/admin/crm/${id}`),

  // Legacy Admin Orders
  getAdminPedidos: () => 
    adminFetcher<QuoteRequest[]>('/admin/pedidos'),

  // Legacy Admin Complaints
  getAdminReclamacoes: () => 
    adminFetcher<Complaint[]>('/admin/reclamacoes'),

  // Legacy Admin Sales
  getAdminVendas: () => 
    adminFetcher<Sale[]>('/admin/vendas'),

  requestMagicLink: (email: string) => 
    privateFetcher<MagicLinkResponse>('/auth/request-magic-link', { method: 'POST', body: JSON.stringify({ email }) }),
  
  verifyMagicLink: (token: string) => 
    privateFetcher<ClientSession>('/auth/verify-magic-link', { method: 'POST', body: JSON.stringify({ token }) }),

  // --- Client Area (Platform API Proxy Layer) ---

  getClientDashboardStats: () => 
    platformFetcher<any>('/dashboard/summary'),

  getClientPurchases: () => 
    platformFetcher<any>('/travel/orders'),
  
  getClientSupport: () => 
    platformFetcher<any>('/messages'),
  
  getClientProfile: () => 
    platformFetcher<any>('/client/profile'),

  getClientConfig: () =>
    platformFetcher<any>('/client/config'),

  sendClientMessage: (data: any) =>
    platformFetcher<any>('/messages/send', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  createClientTravelOrder: (data: any) =>
    platformFetcher<any>('/travel/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // --- Local Client Area (Session-based) ---

  getClientTickets: () => 
    privateFetcher<{ ok: boolean; tickets: any[] }>('/client/tickets'),

  getTicketDetail: (id: string) => 
    privateFetcher<any>(`/client/tickets/${id}`),

  getTicketMessages: (id: string) => 
    privateFetcher<any[]>(`/client/tickets/${id}/messages`),

  getTicketHistory: (id: string) => 
    privateFetcher<any[]>(`/client/tickets/${id}/history`),
  
  getClientDocuments: () => 
    privateFetcher<{ ok: boolean; documents: any[] }>('/client/documents'),
  
  downloadDocument: (id: string) => 
    privateFetcher<Blob>(`/client/documents/${id}/download`),
};
