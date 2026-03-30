/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Bell,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Plus,
  Send,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { Complaint } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ClientSupport() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const [sessionRes, ticketsRes] = await Promise.all([
          apiService.getSession().catch(() => null),
          apiService.getClientTickets().catch(() => ({ tickets: [] }))
        ]);

        if (!sessionRes || !sessionRes.authenticated) {
          navigate('/cliente/login');
          return;
        }

        setSession(sessionRes);
        setTickets(ticketsRes?.tickets || []);
        
        localStorage.setItem('client_data', JSON.stringify(sessionRes));
      } catch (err: any) {
        if (err.message?.includes('401')) {
          localStorage.removeItem('client_token');
          localStorage.removeItem('client_data');
          navigate('/cliente/login');
        } else {
          setError(err.message || 'Erro ao carregar os seus pedidos de apoio.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupport();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_data');
    navigate('/cliente/login');
  };

  const filteredTickets = tickets.filter(t => {
    const kind = (t.kind || '').toLowerCase();
    const category = (t.category || '').toLowerCase();
    const isComplaint = kind.includes('reclam') || category.includes('pos_venda') || category.includes('reclam');
    
    if (!isComplaint) return false;

    const matchesSearch = (t.tracking_code || t.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.subject || t.title || t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.status || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aberta': 
      case 'new':
      case 'open':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'em_analise': 
      case 'em análise':
      case 'in_progress':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'resolvida': 
      case 'resolvido':
      case 'concluído':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'fechada': 
      case 'closed':
      case 'finalizado':
        return 'bg-gray-100 text-gray-400 border-gray-200';
      default: return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs font-bold">A carregar o seu apoio...</p>
        </div>
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
            <span className="text-lg font-bold text-blue-950">Imports Turismo BR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/cliente/dashboard" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/cliente/compras" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Minhas Compras</Link>
            <Link to="/cliente/documentos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Documentos</Link>
            <Link to="/cliente/apoio" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Apoio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cliente/perfil" className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-blue-950">{session?.company_name || session?.name || 'Cliente'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{session?.role || 'Acesso Cliente'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {(session?.company_name || session?.name || 'C').charAt(0)}
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

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">Apoio ao Cliente</h1>
            <p className="text-gray-500">Consulte os seus pedidos de suporte e reclamações.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Pesquisar pedido..." 
                className="pl-9 h-10 text-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4 mr-2" /> Novo Pedido
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {error ? (
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-red-600 font-medium">
                {error}
              </div>
            ) : filteredTickets.length === 0 ? (
              <EmptyState 
                icon={<MessageSquare className="w-10 h-10" />}
                title="Sem pedidos de apoio"
                description={searchTerm ? "Não encontramos pedidos com os termos pesquisados." : "Ainda não abriu nenhum pedido de apoio ou reclamação."}
              />
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="flex gap-4 flex-grow">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                          ['aberta', 'new', 'open'].includes((ticket.status || '').toLowerCase()) ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        )}>
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">{ticket.tracking_code || ticket.id}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                              getStatusColor(ticket.status)
                            )}>
                              {ticket.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-blue-950 line-clamp-1">{ticket.subject || ticket.title || ticket.description}</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Atualizado em {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                          Ver Conversa <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 border-none shadow-sm bg-white space-y-6">
              <h3 className="text-xl font-bold text-blue-950">Contactos Diretos</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-bold text-blue-950">+351 912 345 678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">E-mail de Apoio</p>
                    <p className="text-sm font-bold text-blue-950">apoio@importsturismo.br</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50">
                <p className="text-xs text-gray-400 leading-relaxed italic">
                  O nosso horário de atendimento é de Segunda a Sexta, das 09:00 às 18:00 (GMT).
                </p>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm bg-blue-600 text-white space-y-4">
              <h3 className="text-xl font-bold">FAQ</h3>
              <p className="text-sm text-blue-100">Consulte as perguntas frequentes para obter respostas rápidas.</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none">
                Ver Central de Ajuda
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
