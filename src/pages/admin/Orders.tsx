/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreHorizontal, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { AdminTicket } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<AdminTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const adminPhone = localStorage.getItem('admin_phone');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiService.getAdminTickets();
        // Filter out complaints
        const isComplaint = (t: AdminTicket) => {
          const kind = (t.kind || '').toLowerCase();
          const category = (t.category || '').toLowerCase();
          return kind.includes('reclam') || category.includes('reclam') || category.includes('pos_venda');
        };
        setOrders(data.filter(t => !isComplaint(t)));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados dos pedidos.');
        if (err.message?.includes('401')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiService.logoutAdmin();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
    localStorage.removeItem('admin_phone');
    navigate('/admin/login');
  };

  const filteredOrders = orders.filter(o => {
    const nome = o.company_name || o.nome || o.client_name || 'Cliente';
    const trackingCode = o.tracking_code || o.trackingCode || String(o.id || '');
    const destino = o.metadata?.destination || o.destino || o.category || 'Geral';
    
    return String(nome).toLowerCase().includes(searchTerm.toLowerCase()) || 
           String(trackingCode).toLowerCase().includes(searchTerm.toLowerCase()) ||
           String(destino).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'em_analise': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'concluido': return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmado': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-blue-950">Admin Panel</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/admin/dashboard" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Visão Geral</Link>
            <Link to="/admin/crm" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">CRM</Link>
            <Link to="/admin/pedidos" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Pedidos</Link>
            <Link to="/admin/reclamacoes" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Reclamações</Link>
            <Link to="/admin/vendas" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Vendas</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-bold text-blue-950">Consultor Autorizado</p>
            <p className="text-xs text-gray-400">{adminPhone}</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-blue-950">Pedidos</h1>
            <p className="text-gray-500">Gestão de orçamentos e solicitações de viagem.</p>
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
            <Button variant="outline" size="sm" className="bg-white border border-gray-100">
              <Filter className="w-4 h-4 mr-2" /> Filtrar
            </Button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-red-600 font-medium">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState 
            icon={<ShoppingBag className="w-10 h-10" />}
            title="Nenhum pedido encontrado"
            description={searchTerm ? "Não encontramos pedidos com os termos pesquisados." : "Ainda não existem pedidos registados no sistema."}
          />
        ) : (
          <Card className="p-0 border-none shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Código</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assunto</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Destino</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => {
                    const nome = order.company_name || order.nome || order.client_name || 'Cliente';
                    const telefone = order.phone_e164 || order.telefone || '';
                    const trackingCode = order.tracking_code || order.trackingCode || String(order.id || '');
                    const destino = order.metadata?.destination || order.destino || order.category || 'Geral';
                    const createdAt = order.created_at || order.createdAt || null;
                    const assunto = order.title || order.subject || order.description || 'Pedido de Orçamento';

                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono font-bold text-blue-950">{trackingCode}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold">
                              {nome.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-blue-950">{nome}</p>
                              <p className="text-xs text-gray-400">{telefone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-600 truncate max-w-[150px]">{assunto}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-600">{destino}</p>
                          <p className="text-xs text-gray-400">{order.periodo}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            getStatusColor(order.status || 'pendente')
                          )}>
                            {order.status || 'pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {createdAt ? new Date(createdAt).toLocaleDateString() : 'Data indisponível'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative group inline-block">
                            <Button variant="ghost" size="sm" disabled className="text-gray-400 bg-gray-50/50 cursor-not-allowed">
                              Gerir <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                              <div className="bg-blue-950 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                                Em preparação
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
