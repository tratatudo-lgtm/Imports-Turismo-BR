/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  LogOut, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  LayoutDashboard,
  User,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { apiService } from '../../services/api';
import { QuoteRequest, Complaint, Customer } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<QuoteRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'pedidos' | 'reclamacoes'>('pedidos');
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('admin_token');
  const phone = localStorage.getItem('admin_phone');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [pedidosRes, reclamacoesRes, crmRes] = await Promise.all([
          apiService.getAdminPedidos(token).catch(() => []),
          apiService.getAdminReclamacoes(token).catch(() => []),
          apiService.getCRM(token).catch(() => [])
        ]);

        setOrders(pedidosRes);
        setComplaints(reclamacoesRes);
        setCustomers(crmRes);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados do dashboard.');
        if (err.message?.includes('401')) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_phone');
    navigate('/admin/login');
  };

  // Calculate metrics based on real data
  const totalTickets = orders.length + complaints.length;
  
  const activeStatuses = ['new', 'open', 'aberto', 'pendente', 'recebido', 'em análise', 'em_analise', 'in_progress'];
  const activeRequests = orders.filter(o => 
    activeStatuses.includes((o.status || '').toLowerCase())
  ).length;

  const totalComplaints = complaints.length;
  const totalLeads = customers.length; // Using CRM as leads source

  const filteredOrders = orders.filter(o => 
    o.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.trackingCode && o.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    o.destino.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const filteredCustomers = customers.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const filteredComplaints = complaints.filter(c => 
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.referencia.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar / Topbar */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-blue-950">Admin Panel</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className={cn(
                "text-sm font-bold transition-all pb-1 border-b-2",
                window.location.pathname === '/admin/dashboard' ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-600"
              )}
            >
              Visão Geral
            </button>
            <button 
              onClick={() => navigate('/admin/crm')}
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              CRM
            </button>
            <button 
              onClick={() => navigate('/admin/pedidos')}
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Pedidos
            </button>
            <button 
              onClick={() => navigate('/admin/reclamacoes')}
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Reclamações
            </button>
            <button 
              onClick={() => navigate('/admin/vendas')}
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Vendas
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-bold text-blue-950">Consultor Autorizado</p>
            <p className="text-xs text-gray-400">{phone}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total de Leads</p>
                  <h3 className="text-3xl font-bold text-blue-950">{totalLeads}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs font-bold">
                <span>Dados do CRM</span>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pedidos Ativos</p>
                  <h3 className="text-3xl font-bold text-blue-950">{activeRequests}</h3>
                </div>
                <div className="bg-amber-50 p-3 rounded-2xl">
                  <ShoppingBag className="text-amber-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs font-bold">
                <span>Total: {orders.length}</span>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Reclamações</p>
                  <h3 className="text-3xl font-bold text-blue-950">{totalComplaints}</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-2xl">
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs font-bold">
                <span>Total de reclamações</span>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Tickets</p>
                  <h3 className="text-3xl font-bold text-blue-950">{totalTickets}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-2xl">
                  <CheckCircle2 className="text-green-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs font-bold">
                <span>Volume total</span>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['pedidos', 'leads', 'reclamacoes'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                      activeTab === tab 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-white text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Pesquisar..." 
                    className="pl-9 h-10 text-sm w-48" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <Button variant="ghost" size="sm" disabled className="bg-gray-50/50 border border-gray-100 text-gray-400 cursor-not-allowed">
                    <Filter className="w-4 h-4 mr-2" /> Filtrar
                  </Button>
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                    <div className="bg-blue-950 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                      Em preparação
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-0 border-none shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Destino / Assunto</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeTab === 'pedidos' && (
                      filteredOrders.length > 0 ? filteredOrders.map((pedido, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                {pedido.nome.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-blue-950">{pedido.nome}</p>
                                <p className="text-xs text-gray-400">{pedido.telefone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-600">{pedido.destino}</p>
                            <p className="text-xs text-gray-400 font-mono">{pedido.trackingCode}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              activeStatuses.includes((pedido.status || '').toLowerCase()) ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                            )}>
                              {pedido.status || 'pendente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(pedido.createdAt || '').toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative group inline-block">
                              <Button variant="ghost" size="sm" disabled className="text-gray-400 bg-gray-50/50 cursor-not-allowed">
                                Gerir <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                                <div className="bg-blue-950 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                                  Em preparação
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <p className="text-gray-400 italic">Nenhum pedido encontrado.</p>
                          </td>
                        </tr>
                      )
                    )}
                    {activeTab === 'leads' && (
                      filteredCustomers.length > 0 ? filteredCustomers.map((customer, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold">
                                {customer.nome.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-blue-950">{customer.nome}</p>
                                <p className="text-xs text-gray-400">{customer.telefone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-600">{customer.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600">
                              Cliente CRM
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(customer.createdAt || '').toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => navigate(`/admin/crm/${customer.id}`)}
                            >
                              Detalhes <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <p className="text-gray-400 italic">Nenhuma lead encontrada.</p>
                          </td>
                        </tr>
                      )
                    )}
                    {activeTab === 'reclamacoes' && (
                      filteredComplaints.length > 0 ? filteredComplaints.map((reclamacao, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                                {reclamacao.cliente.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-blue-950">{reclamacao.cliente}</p>
                                <p className="text-xs text-gray-400">{reclamacao.referencia}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-600 truncate max-w-xs">{reclamacao.descricao}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              reclamacao.status === 'aberta' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                            )}>
                              {reclamacao.status || 'pendente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(reclamacao.data || '').toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative group inline-block">
                              <Button variant="ghost" size="sm" disabled className="text-gray-400 bg-gray-50/50 cursor-not-allowed">
                                Analisar <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                                <div className="bg-blue-950 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                                  Em preparação
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <p className="text-gray-400 italic">Nenhuma reclamação encontrada.</p>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                <button 
                  onClick={() => {
                    if (activeTab === 'pedidos') navigate('/admin/pedidos');
                    if (activeTab === 'leads') navigate('/admin/crm');
                    if (activeTab === 'reclamacoes') navigate('/admin/reclamacoes');
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Ver todos os registos
                </button>
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <Card className="p-6 border-none shadow-sm bg-blue-600 text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">Seu Perfil</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-blue-100/60 uppercase tracking-widest font-bold">Telefone de Acesso</p>
                  <p className="text-lg font-bold">{phone}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-blue-100/60 leading-relaxed">
                    Você está logado como consultor administrativo. Suas ações são registadas para fins de auditoria.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm space-y-6">
              <h4 className="font-bold text-blue-950">Ações Rápidas</h4>
              <div className="space-y-3">
                <div className="relative group">
                  <Button variant="outline" disabled className="w-full justify-between text-sm border-gray-100 bg-gray-50/50 opacity-70 cursor-not-allowed">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-3 text-blue-600" /> Enviar Mensagem Massa
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">Em preparação</span>
                  </Button>
                </div>
                <div className="relative group">
                  <Button variant="outline" disabled className="w-full justify-between text-sm border-gray-100 bg-gray-50/50 opacity-70 cursor-not-allowed">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-3 text-green-600" /> Exportar Relatório PDF
                    </div>
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">Em preparação</span>
                  </Button>
                </div>
                <div className="relative group">
                  <Button variant="outline" disabled className="w-full justify-between text-sm border-gray-100 bg-gray-50/50 opacity-70 cursor-not-allowed">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-amber-600" /> Gerir Consultores
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">Em preparação</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
