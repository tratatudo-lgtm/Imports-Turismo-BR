/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Base Entities
export interface Lead {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  origem?: string;
  createdAt?: string;
}

export interface QuoteRequest {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  destino: string;
  periodo: string;
  passageiros: number;
  criancas: number;
  cidadePartida: string;
  observacoes?: string;
  status?: string;
  trackingCode?: string;
  createdAt?: string;
}

export interface BookingRequest {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  destino: string;
  periodo: string;
  passageiros: number;
  criancas: number;
  cidadePartida: string;
  observacoes?: string;
  status?: string;
  trackingCode?: string;
  createdAt?: string;
}

export interface ContactRequest {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  assunto: string;
  mensagem: string;
  createdAt?: string;
}

export interface ComplaintRequest {
  id?: string;
  referencia: string;
  descricao: string;
  dataOcorrencia: string;
  expectativaResolucao: string;
  nome: string;
  telefone: string;
  email: string;
  status?: string;
  createdAt?: string;
}

export interface Sale {
  id: string;
  cliente: string;
  produto: string;
  valor: number;
  status: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  cliente: string;
  referencia: string;
  descricao: string;
  status: string;
  data: string;
}

export interface Customer {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  createdAt: string;
  notas?: string;
  historico?: Array<{
    titulo: string;
    descricao: string;
    data: string;
  }>;
  pedidos?: QuoteRequest[];
  reclamacoes?: Complaint[];
  vendas?: Sale[];
}

export interface ClientDocument {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  url?: string;
}

export interface ClientDashboardData {
  resumo: {
    totalCompras: number;
    proximaViagem: string;
    documentosNovos: number;
  };
  comprasRecentes: Sale[];
  documentosRecentes: ClientDocument[];
}

export interface AdminTicket {
  id: string;
  trackingCode: string;
  nome: string;
  email: string;
  telefone: string;
  destino: string;
  status: string;
  kind: string;
  category: string;
  createdAt: string;
  subject?: string;
  description?: string;
  // Real API fields
  company_name?: string;
  tracking_code?: string;
  created_at?: string;
  phone_e164?: string;
  title?: string;
  metadata?: {
    destination?: string;
    [key: string]: any;
  };
}

export interface AdminTicketStats {
  activeTickets: number;
  complaints: number;
  totalTickets: number;
  // Real API fields
  openTickets?: number;
  closedTickets?: number;
}

export interface AdminSalesStats {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  monthlySales: number;
  // Real API fields
  activeSubscriptions?: number;
  trialSubscriptions?: number;
  suspendedSubscriptions?: number;
  avgTicket?: number;
  monthlyRevenue?: number;
}

export interface AdminSale {
  id: string;
  cliente: string;
  produto: string;
  valor: number;
  status: string;
  createdAt: string;
  // Real API fields
  plan?: string;
  created_at?: string;
  started_at?: string;
  company_name?: string;
  client_name?: string;
}

export interface AdminClient {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  createdAt: string;
  totalTickets?: number;
  totalSpent?: number;
  // Real API fields
  company_name?: string;
  phone_e164?: string;
  created_at?: string;
}

// API Responses
export interface TrackingResponse {
  trackingCode: string;
  status: string;
  nome?: string;
  destino?: string;
  periodo?: string;
  createdAt?: string;
  historico?: Array<{
    status: string;
    mensagem: string;
    data: string;
  }>;
}

export interface OtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message?: string;
  authenticated?: boolean;
}

export interface MagicLinkResponse {
  message: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalPedidos: number;
  totalReclamacoes: number;
  recentLeads: Lead[];
  recentPedidos: QuoteRequest[];
  recentReclamacoes: ComplaintRequest[];
}

export interface AdminSession {
  authenticated: boolean;
  phone_e164?: string;
}

export interface AdminTravelOrder {
  id: string;
  tracking_code: string;
  order_code: string;
  client_id: string;
  customer_name: string;
  customer_phone_e164: string;
  customer_email: string;
  destino: string;
  origin_city: string;
  travel_start_date: string;
  travel_end_date: string;
  passengers_adults: number;
  passengers_children: number;
  package_type: string;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  payment_method: string;
  payment_type: 'single' | 'installments';
  installments: number;
  sales_status: string;
  payment_status: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  payments?: AdminTravelPayment[];
}

export interface AdminTravelPayment {
  id: string;
  payment_code: string;
  external_reference?: string;
  order_id: string;
  order_code: string;
  client_id: string;
  customer_name: string;
  amount: number;
  currency: string;
  method: string;
  channel?: string;
  type: string;
  installment_number?: number;
  installment_total?: number;
  status: string;
  due_at: string;
  paid_at?: string;
  payer_name?: string;
  payer_phone_e164?: string;
  payer_email?: string;
  notes?: string;
  proof_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminTravelStats {
  totalOrders: number;
  awaitingPaymentOrders: number;
  confirmedOrders: number;
  paidPayments: number;
  totalPaidAmount: number;
  totalDueAmount: number;
}

export interface ClientSession {
  token: string;
  client: Customer;
}
