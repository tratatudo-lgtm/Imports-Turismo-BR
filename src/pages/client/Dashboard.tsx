/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  User, 
  LogOut, 
  ChevronRight, 
  Download, 
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Bell
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { ClientDashboardData } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, statsRes, ticketsRes] = await Promise.all([
          apiService.getSession().catch(() => null),
          apiService.getClientDashboardStats().catch(() => null),
          apiService.getClientTickets().catch(() => ({ tickets: [] }))
        ]);

        if (!sessionRes || !sessionRes.authenticated) {
          navigate('/cliente/login');
          return;
        }

        setSession(sessionRes);
        setStats(statsRes?.stats || null);
        setTickets(ticketsRes?.tickets || []);
        
        localStorage.setItem('client_data', JSON.stringify(sessionRes));
      } catch (err: any) {
        // Only show error if it's a real failure, not just empty data
        if (err.message?.includes('401')) {
          localStorage.removeItem('client_token');
          localStorage.removeItem('client_data');
          navigate('/cliente/login');
        } else {
          setError(err.message || 'Erro ao carregar dados do painel.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const activeTickets = tickets.filter(t => {
    const status = (t.status || '').toLowerCase();
    const activeStatuses = ['new', 'open', 'aberto', 'pendente', 'recebido', 'em análise', 'em_analise', 'in_progress'];
    const isActive = activeStatuses.some(s => status.includes(s));
    
    const kind = (t.kind || '').toLowerCase();
    const category = (t.category || '').toLowerCase();
    const isComplaint = kind.includes('reclam') || category.includes('pos_venda') || category.includes('reclam');
    
    return isActive && !isComplaint;
  });

  const complaints = tickets.filter(t => {
    const kind = (t.kind || '').toLowerCase();
    const category = (t.category || '').toLowerCase();
    return kind.includes('reclam') || category.includes('pos_venda') || category.includes('reclam');
  });

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_data');
    navigate('/cliente/login');
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const blob = await apiService.downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao descarregar documento:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs font-bold">A preparar a sua viagem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Client Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-blue-950">Imports Turismo BR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/cliente/dashboard" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Dashboard</Link>
            <Link to="/cliente/compras" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Minhas Compras</Link>
            <Link to="/cliente/documentos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Documentos</Link>
            <Link to="/cliente/apoio" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Apoio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
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
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">Olá, {(session?.company_name || session?.name || 'Cliente').split(' ')[0]}!</h1>
            <p className="text-gray-500">Bem-vindo à sua área de gestão de viagens.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100">
            <CheckCircle2 className="w-4 h-4" /> {session?.authenticated ? 'Sessão Ativa' : 'Conta Verificada'}
          </div>
        </div>

        {/* Quick Stats / Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-none shadow-sm space-y-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total de Interações</p>
                <p className="text-2xl font-bold text-blue-950">{stats?.messages ?? stats?.totalMessages ?? 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm space-y-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pedidos Ativos</p>
                <p className="text-2xl font-bold text-blue-950">{activeTickets.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm space-y-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Reclamações</p>
                <p className="text-2xl font-bold text-blue-950">{complaints.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm space-y-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total de Tickets</p>
                <p className="text-2xl font-bold text-blue-950">{stats?.totalTickets ?? tickets.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-950">Pedidos Recentes</h2>
              <Link to="/cliente/compras">
                <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Ver Todos</Button>
              </Link>
            </div>
            
            {activeTickets.length > 0 ? (
              <div className="space-y-4">
                {activeTickets.slice(0, 5).map((ticket) => (
                  <Card key={ticket.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-colors">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ticket.tracking_code || ticket.id}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                              ['concluído', 'resolvido', 'closed', 'finalizado'].includes((ticket.status || '').toLowerCase()) ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            )}>
                              {ticket.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-blue-950">{ticket.subject || ticket.title || 'Pedido de Viagem'}</h3>
                          <p className="text-sm text-gray-500">{ticket.metadata?.destination || ticket.destination || ticket.category || 'Geral'} • {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Link to={`/cliente/apoio`}>
                        <Button variant="ghost" size="sm" className="text-gray-400 group-hover:text-blue-600">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<ShoppingBag className="w-10 h-10" />}
                title="Sem pedidos recentes"
                description="Ainda não realizou nenhuma reserva ou orçamento connosco."
                action={<Button onClick={() => navigate('/destinos')}>Explorar Destinos</Button>}
              />
            )}
          </div>

          {/* Latest Documents & Support */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-950">Documentos</h2>
                <Link to="/cliente/documentos">
                  <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Ver Todos</Button>
                </Link>
              </div>
              <Card className="p-6 border-none shadow-sm space-y-4">
                {tickets && tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.slice(0, 3).map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-blue-950 line-clamp-1">{ticket.subject || ticket.title}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{ticket.status}</p>
                          </div>
                        </div>
                        <Link to="/cliente/apoio" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-400 italic py-4">Nenhum documento ou ticket recente.</p>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-blue-950">Apoio ao Cliente</h2>
              <Card className="p-6 border-none shadow-sm bg-blue-950 text-white space-y-4">
                <div className="bg-white/10 p-3 rounded-2xl w-fit">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">Precisa de ajuda?</h3>
                  <p className="text-sm text-blue-200/80">A nossa equipa está disponível para o ajudar com qualquer questão.</p>
                </div>
                <Link to="/cliente/apoio">
                  <Button className="w-full bg-white text-blue-950 hover:bg-blue-50 border-none mt-2">
                    Abrir Suporte
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
