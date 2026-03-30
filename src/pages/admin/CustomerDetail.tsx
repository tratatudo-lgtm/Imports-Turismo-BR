/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { AdminClient, AdminTravelOrder, AdminTravelPayment } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<AdminClient | null>(null);
  const [travelOrders, setTravelOrders] = useState<AdminTravelOrder[]>([]);
  const [travelPayments, setTravelPayments] = useState<AdminTravelPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminPhone = localStorage.getItem('admin_phone');

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;
      try {
        const [clientData, ordersData, paymentsData] = await Promise.all([
          apiService.getAdminClientDetail(id),
          apiService.getAdminClientTravelOrders(id).catch(() => []),
          apiService.getAdminClientTravelPayments(id).catch(() => [])
        ]);
        
        setCustomer(clientData);
        setTravelOrders(ordersData);
        setTravelPayments(paymentsData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes do cliente.');
        if (err.message?.includes('401')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="p-12 text-center space-y-6 max-w-md">
          <div className="p-4 bg-red-50 rounded-2xl text-red-600 mx-auto w-fit">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-950">Erro ao carregar</h2>
            <p className="text-gray-500">{error || 'Cliente não encontrado.'}</p>
          </div>
          <Button onClick={() => navigate('/admin/crm')}>Voltar ao CRM</Button>
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
            <Link to="/admin/crm" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">CRM</Link>
            <Link to="/admin/pedidos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Pedidos</Link>
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
        <div className="flex items-center gap-4">
          <Link to="/admin/crm">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-950">Detalhes do Cliente</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-8 border-none shadow-sm space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold">
                  {(customer.company_name || customer.nome || 'C').charAt(0)}
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-blue-950">{customer.company_name || customer.nome || 'Cliente'}</h2>
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Cliente desde {new Date(customer.created_at || customer.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">E-mail</p>
                    <p className="text-sm font-bold text-blue-950">{customer.email || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Telefone</p>
                    <p className="text-sm font-bold text-blue-950">{customer.phone_e164 || customer.telefone || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Última Atividade</p>
                    <p className="text-sm font-bold text-blue-950">Sem informação disponível</p>
                  </div>
                </div>
              </div>

              {customer.notas && (
                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold">Notas / Observações</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                    "{customer.notas}"
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <Button className="w-full" variant="outline" onClick={() => window.open(`https://wa.me/${(customer.phone_e164 || customer.telefone || '').replace(/\D/g, '')}`, '_blank')}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Contactar via WhatsApp
                </Button>
              </div>
            </Card>
          </div>

          {/* Activity / Tabs Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-none shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pedidos</p>
                  <p className="text-2xl font-bold text-blue-950">{customer.pedidos?.length || 0}</p>
                </div>
              </Card>
              <Card className="p-6 border-none shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Vendas</p>
                  <p className="text-2xl font-bold text-blue-950">{customer.vendas?.length || 0}</p>
                </div>
              </Card>
              <Card className="p-6 border-none shadow-sm flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Reclamações</p>
                  <p className="text-2xl font-bold text-blue-950">{customer.reclamacoes?.length || 0}</p>
                </div>
              </Card>
            </div>

            <Card className="p-8 border-none shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-blue-950">Histórico de Atividade</h3>
              
              <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {customer.historico && customer.historico.length > 0 ? (
                  customer.historico.map((item, i) => (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-9 h-9 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm">
                        <Clock className="text-gray-400 w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-blue-950">{item.titulo}</p>
                        <p className="text-sm text-gray-500">{item.descricao}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(item.data).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 italic">
                    Nenhuma atividade registada recentemente.
                  </div>
                )}
              </div>
            </Card>

            {/* Travel Orders */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-950">Pedidos de Viagem</h3>
              {travelOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {travelOrders.map((order) => (
                    <Card key={order.id} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{order.order_code || order.tracking_code}</p>
                          <h4 className="font-bold text-blue-950">{order.destino}</h4>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          order.sales_status === 'confirmed' ? "bg-green-100 text-green-600 border-green-200" : "bg-blue-100 text-blue-600 border-blue-200"
                        )}>
                          {order.sales_status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                        <Link to={`/admin/travel/orders/${order.id}`} className="text-xs font-bold text-blue-600 hover:underline">Ver Detalhes</Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center text-gray-400 italic border-none shadow-sm">
                  Nenhum pedido de viagem associado.
                </Card>
              )}
            </div>

            {/* Travel Payments */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-950">Pagamentos de Viagem</h3>
              {travelPayments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {travelPayments.map((payment) => (
                    <Card key={payment.id} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{payment.payment_code}</p>
                          <h4 className="font-bold text-blue-950">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount)}</h4>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          payment.status === 'paid' ? "bg-green-100 text-green-600 border-green-200" : "bg-amber-100 text-amber-600 border-amber-200"
                        )}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-400">Vencimento: {new Date(payment.due_at).toLocaleDateString()}</p>
                        <Link to={`/admin/travel/payments/${payment.id}`} className="text-xs font-bold text-blue-600 hover:underline">Ver Pagamento</Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center text-gray-400 italic border-none shadow-sm">
                  Nenhum pagamento associado.
                </Card>
              )}
            </div>

            {/* Legacy Tickets */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-950">Tickets de Suporte</h3>
              {customer.pedidos && customer.pedidos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.pedidos.map((pedido) => (
                    <Card key={pedido.id} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{pedido.tracking_code || pedido.trackingCode}</p>
                          <h4 className="font-bold text-blue-950">{pedido.metadata?.destination || pedido.destino || pedido.category}</h4>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {pedido.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-400">{new Date(pedido.created_at || pedido.createdAt || '').toLocaleDateString()}</p>
                        <Link to={`/admin/pedidos?search=${pedido.tracking_code || pedido.trackingCode}`} className="text-xs font-bold text-blue-600 hover:underline">Ver Ticket</Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center text-gray-400 italic border-none shadow-sm">
                  Nenhum ticket associado.
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
