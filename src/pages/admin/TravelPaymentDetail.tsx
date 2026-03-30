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
  DollarSign, 
  CreditCard, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Download,
  Calendar,
  Hash,
  Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { AdminTravelPayment } from '../../types';
import { cn } from '../../lib/utils';

export default function TravelPaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<AdminTravelPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminPhone = localStorage.getItem('admin_phone');

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) return;
      try {
        const data = await apiService.getAdminTravelPaymentDetail(id);
        setPayment(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes do pagamento.');
        if (err.message?.includes('401')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
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

  const getMethodLabel = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'pix': return 'Pix';
      case 'credit_card': return 'Cartão de Crédito';
      case 'credit_card_installments': return 'Cartão Parcelado';
      case 'boleto': return 'Boleto';
      case 'bank_transfer': return 'Transferência Bancária';
      case 'cash': return 'Dinheiro';
      case 'mixed': return 'Misto';
      default: return method;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando detalhes do pagamento...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="p-12 text-center space-y-6 max-w-md">
          <div className="p-4 bg-red-50 rounded-2xl text-red-600 mx-auto w-fit">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-950">Erro ao carregar</h2>
            <p className="text-gray-500">{error || 'Pagamento não encontrado.'}</p>
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
            <h1 className="text-3xl font-bold text-blue-950">Pagamento {payment.payment_code}</h1>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              getStatusColor(payment.status)
            )}>
              {payment.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" /> Detalhes do Valor
                  </h3>
                  <div className="space-y-4">
                    <div className="p-6 bg-blue-50 rounded-3xl text-center">
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Valor Total</p>
                      <p className="text-4xl font-bold text-blue-950">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-blue-400 mt-2">Moeda: {payment.currency}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Método</p>
                        <p className="text-sm font-bold text-blue-950">{getMethodLabel(payment.method)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tipo</p>
                        <p className="text-sm font-bold text-blue-950 capitalize">{payment.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Datas e Prazos
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vencimento</p>
                        <p className="text-sm font-bold text-blue-950">{new Date(payment.due_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {payment.paid_at && (
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Pago em</p>
                          <p className="text-sm font-bold text-blue-950">{new Date(payment.paid_at).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <Hash className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Referência Externa</p>
                        <p className="text-sm font-bold text-blue-950">{payment.external_reference || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Informações do Pagador
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nome</p>
                      <p className="text-sm font-bold text-blue-950">{payment.payer_name || payment.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" /> {payment.payer_phone_e164 || 'Não informado'}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" /> {payment.payer_email || 'Não informado'}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" /> Pedido Relacionado
                  </h3>
                  <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Código do Pedido</p>
                      <p className="text-sm font-bold text-blue-950">{payment.order_code}</p>
                    </div>
                    <Link to={`/admin/travel/orders/${payment.order_id}`}>
                      <Button variant="outline" size="sm" className="w-full bg-white">
                        Ver Pedido Completo <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {payment.notes && (
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Notas do Pagamento</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl italic">"{payment.notes}"</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8">
            <Card className="p-8 border-none shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-blue-950">Comprovativo</h3>
              {payment.proof_url ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200">
                    <FileText className="w-12 h-12 text-gray-300" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-grow" onClick={() => window.open(payment.proof_url, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Abrir
                    </Button>
                    <Button variant="outline" onClick={() => window.open(payment.proof_url, '_blank')}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium italic">Nenhum comprovativo anexado a este pagamento.</p>
                </div>
              )}
            </Card>

            <Card className="p-8 border-none shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-blue-950">Informações Adicionais</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Canal</p>
                  <p className="text-sm font-bold text-blue-950 capitalize">{payment.channel || 'N/A'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Parcela</p>
                  <p className="text-sm font-bold text-blue-950">
                    {payment.installment_number ? `${payment.installment_number}/${payment.installment_total}` : '1/1'}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Criado em</p>
                  <p className="text-sm font-medium text-gray-600">{new Date(payment.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
