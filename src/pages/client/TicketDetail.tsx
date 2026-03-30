/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare, 
  History, 
  TrendingUp, 
  LogOut, 
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  Tag,
  Hash
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [sessionRes, ticketRes, messagesRes, historyRes] = await Promise.all([
          apiService.getSession().catch(() => null),
          apiService.getTicketDetail(id),
          apiService.getTicketMessages(id).catch(() => []),
          apiService.getTicketHistory(id).catch(() => [])
        ]);

        if (!sessionRes || !sessionRes.authenticated) {
          navigate('/cliente/login');
          return;
        }

        setSession(sessionRes);
        setTicket(ticketRes?.ticket || ticketRes);
        setMessages(messagesRes || []);
        setHistory(historyRes || []);
      } catch (err: any) {
        console.error('Error fetching ticket detail:', err);
        setError(err.message || 'Erro ao carregar os detalhes do pedido.');
        if (err.message?.includes('401')) {
          localStorage.removeItem('client_token');
          localStorage.removeItem('client_data');
          navigate('/cliente/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_data');
    navigate('/cliente/login');
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (['new', 'open', 'novo', 'aberto'].includes(s)) return 'bg-blue-100 text-blue-600 border-blue-200';
    if (['in_progress', 'em_andamento', 'processamento'].includes(s)) return 'bg-amber-100 text-amber-600 border-amber-200';
    if (['resolvido', 'concluído', 'closed', 'finalizado', 'concluded'].includes(s)) return 'bg-green-100 text-green-600 border-green-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (['new', 'novo'].includes(s)) return 'Novo';
    if (['open', 'aberto'].includes(s)) return 'Aberto';
    if (['in_progress', 'em_andamento'].includes(s)) return 'Em Andamento';
    if (['resolvido', 'concluído', 'concluded'].includes(s)) return 'Concluído';
    if (['closed', 'finalizado'].includes(s)) return 'Finalizado';
    return status || 'Pendente';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs font-bold">A carregar detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-blue-950 mb-2">Erro ao carregar pedido</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">{error || 'Não foi possível encontrar o pedido solicitado.'}</p>
        <Button onClick={() => navigate('/cliente/dashboard')}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-blue-950">{session?.company_name || 'Imports Turismo BR'}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/cliente/dashboard" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/cliente/compras" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Minhas Compras</Link>
            <Link to="/cliente/documentos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Documentos</Link>
            <Link to="/cliente/apoio" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Apoio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cliente/perfil" className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-blue-950 leading-none">{session?.name || 'Cliente'}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter leading-none mt-1">{session?.role || 'Ver Perfil'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {session?.name?.charAt(0) || <User className="w-5 h-5" />}
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="bg-white border-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Hash className="w-3 h-3" />
            <span>{ticket.tracking_code || ticket.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                    {ticket.subject || ticket.title || ticket.description || 'Detalhes do Pedido'}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Criado em {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    {ticket.metadata?.destination && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{ticket.metadata.destination}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border self-start md:self-center",
                  getStatusColor(ticket.status)
                )}>
                  {getStatusLabel(ticket.status)}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Descrição do Pedido</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {ticket.description || ticket.subject || 'Sem descrição adicional.'}
                </div>
              </div>
            </Card>

            {/* Messages */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-blue-950">Mensagens e Atualizações</h2>
              </div>

              {messages.length === 0 ? (
                <Card className="p-12 border-none shadow-sm flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-blue-950">Sem mensagens ainda</h3>
                    <p className="text-sm text-gray-400">Assim que houver uma interação, ela aparecerá aqui.</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <motion.div 
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className={cn(
                        "p-6 border-none shadow-sm space-y-3",
                        msg.is_staff ? "bg-blue-50/50 border-l-4 border-l-blue-600" : "bg-white"
                      )}>
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                            msg.is_staff ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                          )}>
                            {msg.is_staff ? 'Equipa Imports' : 'Você'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.body || msg.content || msg.message}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Ticket Info */}
            <Card className="p-6 border-none shadow-sm space-y-6">
              <h3 className="font-bold text-blue-950 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                Informações
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking Code</p>
                  <p className="text-sm font-mono font-bold text-blue-950">{ticket.tracking_code || ticket.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Pedido</p>
                  <p className="text-sm font-bold text-blue-950 capitalize">{ticket.kind || ticket.category || 'Geral'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Última Atualização</p>
                  <p className="text-sm font-bold text-blue-950">{new Date(ticket.updated_at || ticket.created_at).toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* History */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-blue-950">Histórico</h2>
              </div>

              {history.length === 0 ? (
                <Card className="p-6 border-none shadow-sm text-center">
                  <p className="text-xs text-gray-400">Sem histórico de estados registado.</p>
                </Card>
              ) : (
                <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {history.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blue-600" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-950">
                            {getStatusLabel(item.status)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {item.comment && (
                          <p className="text-xs text-gray-500 italic">"{item.comment}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
