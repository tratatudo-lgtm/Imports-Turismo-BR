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
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { AdminTravelOrder, AdminTravelPayment, AdminTravelStats } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminSales() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminTravelOrder[]>([]);
  const [payments, setPayments] = useState<AdminTravelPayment[]>([]);
  const [stats, setStats] = useState<AdminTravelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');

  const adminPhone = localStorage.getItem('admin_phone');

  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const [ordersRes, paymentsRes, statsRes] = await Promise.all([
          apiService.getAdminTravelOrders().catch(() => []),
          apiService.getAdminTravelPayments().catch(() => []),
          apiService.getAdminTravelStats().catch(() => ({
            totalOrders: 0,
            awaitingPaymentOrders: 0,
            confirmedOrders: 0,
            paidPayments: 0,
            totalPaidAmount: 0,
            totalDueAmount: 0
          }))
        ]);
        setOrders(ordersRes);
        setPayments(paymentsRes);
        setStats(statsRes);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados de vendas.');
        if (err.message?.includes('401')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelData();
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'pix': return 'Pix';
      case 'credit_card': return 'Cartão';
      case 'credit_card_installments': return 'Cartão Parcelado';
      case 'boleto': return 'Boleto';
      case 'bank_transfer': return 'Transferência';
      case 'cash': return 'Dinheiro';
      case 'mixed': return 'Misto';
      default: return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'quoted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'negotiation': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'awaiting_payment': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'ticketed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFinancialStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'partial': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.order_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.tracking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.destino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(p => 
    p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.payment_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.order_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando painel de vendas...</p>
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
            <h1 className="text-3xl font-bold text-blue-950">Vendas de Viagens</h1>
            <p className="text-gray-500">Gestão comercial e financeira de pacotes turísticos.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Pesquisar pedido ou pagamento..." 
                className="pl-9 h-10 text-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 border-none shadow-sm flex flex-col justify-between bg-blue-600 text-white">
            <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Total Pedidos</p>
            <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-between">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Aguardando Pgto</p>
            <p className="text-2xl font-bold text-amber-600">{stats?.awaitingPaymentOrders || 0}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-between">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Confirmados</p>
            <p className="text-2xl font-bold text-green-600">{stats?.confirmedOrders || 0}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-between">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pgtos Recebidos</p>
            <p className="text-2xl font-bold text-blue-950">{stats?.paidPayments || 0}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-between bg-green-50">
            <p className="text-[10px] text-green-600 uppercase tracking-widest font-bold">Total Pago</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(stats?.totalPaidAmount || 0)}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-between bg-red-50">
            <p className="text-[10px] text-red-600 uppercase tracking-widest font-bold">Total em Falta</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(stats?.totalDueAmount || 0)}</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative",
              activeTab === 'orders' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Pedidos de Viagem
            {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative",
              activeTab === 'payments' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Pagamentos
            {activeTab === 'payments' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
        </div>

        {activeTab === 'orders' ? (
          <Card className="p-0 border-none shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destino</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Viagem</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Financeiro</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Método / Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                            {order.customer_name?.charAt(0)}
                          </div>
                          <p className="text-xs font-bold text-blue-950">{order.customer_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-mono text-gray-400">{order.order_code || order.tracking_code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-blue-950">{order.destino}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] text-gray-500">{new Date(order.travel_start_date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-blue-950">{formatCurrency(order.total_amount)}</p>
                          <p className="text-[9px] text-green-600 font-bold">Pago: {formatCurrency(order.amount_paid)}</p>
                          <p className="text-[9px] text-red-600 font-bold">Falta: {formatCurrency(order.amount_due)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-gray-600">{getPaymentMethodLabel(order.payment_method)}</p>
                          <p className="text-[9px] text-gray-400 capitalize">
                            {order.payment_type === 'installments' ? `${order.installments}x` : 'À vista'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border w-fit",
                            getStatusColor(order.sales_status)
                          )}>
                            {order.sales_status}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border w-fit",
                            getFinancialStatusColor(order.payment_status)
                          )}>
                            {order.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/admin/travel/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                            Abrir <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic">
                        Nenhum pedido de viagem encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-0 border-none shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Método</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parcela</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vencimento</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-mono text-gray-400">{payment.payment_code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-blue-950">{payment.customer_name}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-bold text-blue-950">{formatCurrency(payment.amount)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-bold text-gray-600">{getPaymentMethodLabel(payment.method)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border",
                          getFinancialStatusColor(payment.status)
                        )}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] text-gray-500">
                          {payment.installment_number ? `${payment.installment_number}/${payment.installment_total}` : '1/1'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] text-gray-400">{new Date(payment.due_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/admin/travel/payments/${payment.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                            Abrir <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic">
                        Nenhum pagamento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
