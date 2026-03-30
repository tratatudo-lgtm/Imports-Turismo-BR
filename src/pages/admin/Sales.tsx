/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  DollarSign,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { AdminSale, AdminSalesStats } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminSales() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [stats, setStats] = useState<AdminSalesStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const adminEmail = localStorage.getItem('admin_email');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const [salesRes, statsRes] = await Promise.all([
          apiService.getAdminSales().catch(() => []),
          apiService.getAdminSalesStats().catch(() => ({ totalRevenue: 0, totalSales: 0, averageTicket: 0, monthlySales: 0 }))
        ]);
        setSales(salesRes);
        setStats(statsRes);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar vendas.');
        if (err.message?.includes('401')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const filteredSales = sales.filter(s => 
    s.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando vendas...</p>
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
            <Link to="/admin/pedidos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Pedidos</Link>
            <Link to="/admin/reclamacoes" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Reclamações</Link>
            <Link to="/admin/vendas" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Vendas</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-bold text-blue-950">Consultor Autorizado</p>
            <p className="text-xs text-gray-400">{adminEmail}</p>
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
            <h1 className="text-3xl font-bold text-blue-950">Vendas</h1>
            <p className="text-gray-500">Relatório de vendas concluídas e faturamento.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Pesquisar venda..." 
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-none shadow-sm flex items-center gap-4 bg-blue-600 text-white">
            <div className="bg-white/20 p-3 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-blue-100 uppercase tracking-widest font-bold">Total Faturado</p>
              <p className="text-2xl font-bold">R$ {(stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-2xl text-green-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Vendas Totais</p>
              <p className="text-2xl font-bold text-blue-950">{stats?.totalSales || 0}</p>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ticket Médio</p>
              <p className="text-2xl font-bold text-blue-950">R$ {(stats?.averageTicket || 0).toLocaleString()}</p>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-sm flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Este Mês</p>
              <p className="text-2xl font-bold text-blue-950">{stats?.monthlySales || 0}</p>
            </div>
          </Card>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-red-600 font-medium">
            {error}
          </div>
        ) : filteredSales.length === 0 ? (
          <EmptyState 
            icon={<TrendingUp className="w-10 h-10" />}
            title="Nenhuma venda encontrada"
            description={searchTerm ? "Não encontramos vendas com os termos pesquisados." : "Não existem vendas registadas no sistema."}
          />
        ) : (
          <Card className="p-0 border-none shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Produto / Pacote</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold">
                            {sale.cliente.charAt(0)}
                          </div>
                          <p className="text-sm font-bold text-blue-950">{sale.cliente}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-600">{sale.produto}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-blue-950">R$ {sale.valor.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          sale.status === 'Pago' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                        )}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(sale.createdAt || '').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative group inline-block">
                          <Button variant="ghost" size="sm" disabled className="text-gray-400 bg-gray-50/50 cursor-not-allowed">
                            Detalhes <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                            <div className="bg-blue-950 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                              Em preparação
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
