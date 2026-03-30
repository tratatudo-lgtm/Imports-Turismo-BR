/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  Package, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { AdminTravelOrder } from '../../types';
import { cn } from '../../lib/utils';

export default function TravelOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<AdminTravelOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminPhone = localStorage.getItem('admin_phone');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await apiService.getAdminTravelOrderDetail(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes do pedido.');
        if (err.message?.includes('401')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleLogout = async () => {
    try {
      await apiService.logoutAdmin();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
    localStorage.removeItem('admin_phone');
    navigate('/admin/login');
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

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'partial': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="p-12 text-center space-y-6 max-w-md">
          <div className="p-4 bg-red-50 rounded-2xl text-red-600 mx-auto w-fit">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-950">Erro ao carregar</h2>
            <p className="text-gray-500">{error || 'Pedido não encontrado.'}</p>
          </div>
          <Button onClick={() => navigate('/admin/vendas')}>Voltar às Vendas</Button>
        </Card>
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
        <div className="flex items-center gap-4">
          <Link to="/admin/vendas">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-blue-950">Pedido {order.order_code || order.tracking_code}</h1>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              getStatusColor(order.sales_status)
            )}>
              {order.sales_status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Informações do Cliente
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        {order.customer_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-950">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">ID: {order.client_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" /> {order.customer_phone_e164}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" /> {order.customer_email}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Detalhes da Viagem
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Destino</p>
                      <p className="text-sm font-bold text-blue-950">{order.destino}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Origem</p>
                      <p className="text-sm font-medium text-gray-600">{order.origin_city}</p>
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Partida</p>
                        <p className="text-sm font-medium text-gray-600">{new Date(order.travel_start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Retorno</p>
                        <p className="text-sm font-medium text-gray-600">{new Date(order.travel_end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3" /> Passageiros
                  </p>
                  <p className="text-sm font-bold text-blue-950">
                    {order.passengers_adults} Adultos, {order.passengers_children} Crianças
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Package className="w-3 h-3" /> Tipo de Pacote
                  </p>
                  <p className="text-sm font-bold text-blue-950">{order.package_type}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Pagamento
                  </p>
                  <p className="text-sm font-bold text-blue-950 capitalize">
                    {order.payment_method} ({order.payment_type === 'installments' ? `${order.installments}x` : 'À vista'})
                  </p>
                </div>
              </div>

              {order.notes && (
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Observações</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl italic">"{order.notes}"</p>
                </div>
              )}
            </Card>

            {/* Payments List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-950">Pagamentos Associados</h3>
              {order.payments && order.payments.length > 0 ? (
                <div className="space-y-3">
                  {order.payments.map((payment) => (
                    <Card key={payment.id} className="p-4 border-none shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            payment.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                          )}>
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-blue-950">{payment.payment_code}</p>
                            <p className="text-xs text-gray-400">
                              {payment.installment_number ? `Parcela ${payment.installment_number}/${payment.installment_total}` : 'Pagamento Único'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-sm font-bold text-blue-950">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-gray-400">{new Date(payment.due_at).toLocaleDateString()}</p>
                          </div>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                            getPaymentStatusColor(payment.status)
                          )}>
                            {payment.status}
                          </span>
                          <Link to={`/admin/travel/payments/${payment.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 p-2">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-none shadow-sm">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-gray-400 font-medium italic">Nenhum pagamento registado para este pedido.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <Card className="p-8 border-none shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-blue-950">Resumo Financeiro</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total do Pedido</p>
                  <p className="text-lg font-bold text-blue-950">{formatCurrency(order.total_amount)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total Pago</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(order.amount_paid)}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="text-sm font-bold text-blue-950">Saldo Devedor</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(order.amount_due)}</p>
                </div>
                <div className="pt-4">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-500" 
                      style={{ width: `${(order.amount_paid / order.total_amount) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-right font-bold uppercase tracking-widest">
                    {Math.round((order.amount_paid / order.total_amount) * 100)}% Pago
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-blue-950">Status Financeiro</h3>
              <div className={cn(
                "p-4 rounded-2xl border flex items-center gap-4",
                getPaymentStatusColor(order.payment_status)
              )}>
                {order.payment_status === 'paid' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Estado Atual</p>
                  <p className="text-sm font-bold capitalize">{order.payment_status}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                O estado financeiro é atualizado automaticamente com base nos pagamentos registados.
              </p>
            </Card>

            {order.metadata && Object.keys(order.metadata).length > 0 && (
              <Card className="p-8 border-none shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Metadados
                </h3>
                <div className="space-y-3">
                  {Object.entries(order.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-widest">{key}</span>
                      <span className="text-blue-950 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
