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
  token: string;
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
  token: string;
  phoneNumber: string;
}

export interface ClientSession {
  token: string;
  client: Customer;
}
