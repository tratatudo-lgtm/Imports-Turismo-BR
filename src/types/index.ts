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
