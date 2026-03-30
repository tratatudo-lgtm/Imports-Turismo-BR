/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  status?: 'pendente' | 'em_analise' | 'concluido';
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
  status?: 'pendente' | 'confirmado' | 'cancelado';
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
  status?: 'pendente' | 'em_analise' | 'resolvido';
  createdAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalPedidos: number;
  totalReclamacoes: number;
  recentLeads: Lead[];
  recentPedidos: (QuoteRequest | BookingRequest)[];
  recentReclamacoes: ComplaintRequest[];
}

export interface AdminSession {
  token: string;
  phoneNumber: string;
}
