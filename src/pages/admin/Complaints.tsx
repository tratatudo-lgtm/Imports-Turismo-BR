/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { Complaint } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('admin_token');
  const phone = localStorage.getItem('admin_phone');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchComplaints = async () => {
      try {
        const data = await apiService.getAdminReclamacoes(token);
        setComplaints(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar reclamações.');
        if (err.message?.includes('401')) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_phone');
    navigate('/admin/login');
  };

  const filteredComplaints = complaints.filter(c => 
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aberta': return 'bg-red-100 text-red-700 border-red-200';
      case 'em_analise': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolvida': return 'bg-green-100 text-green-700 border-green-200';
      case 'fechada': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Carregando reclamações...</p>
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
            <Link to="/admin/reclamacoes" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Reclamações</Link>
            <Link to="/admin/vendas" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Vendas</Link>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-blue-950">Reclamações</h1>
            <p className="text-gray-500">Gestão de insatisfações e apoio pós-venda.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Pesquisar reclamação..." 
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
        ) : filteredComplaints.length === 0 ? (
          <EmptyState 
            icon={<AlertTriangle className="w-10 h-10" />}
            title="Nenhuma reclamação encontrada"
            description={searchTerm ? "Não encontramos reclamações com os termos pesquisados." : "Não existem reclamações registadas no sistema."}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4 flex-grow">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                      complaint.status === 'Aberta' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    )}>
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">{complaint.referencia}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                          getStatusColor(complaint.status)
                        )}>
                          {complaint.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-blue-950">{complaint.cliente}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl">{complaint.descricao}</p>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 min-w-[140px]">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Data</p>
                      <p className="text-sm font-medium text-blue-950">{new Date(complaint.data).toLocaleDateString()}</p>
                    </div>
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
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
