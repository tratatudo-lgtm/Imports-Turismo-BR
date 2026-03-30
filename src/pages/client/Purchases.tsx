/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Bell,
  User,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { Sale } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ClientPurchases() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('client_token');
  const clientData = JSON.parse(localStorage.getItem('client_data') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/cliente/login');
      return;
    }

    const fetchPurchases = async () => {
      try {
        const data = await apiService.getClientPurchases(token);
        setPurchases(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar as suas compras.');
        if (err.message?.includes('401')) {
          localStorage.removeItem('client_token');
          localStorage.removeItem('client_data');
          navigate('/cliente/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_data');
    navigate('/cliente/login');
  };

  const filteredPurchases = purchases.filter(p => 
    p.produto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs font-bold">A carregar o seu histórico...</p>
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
            <Link to="/cliente/compras" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Minhas Compras</Link>
            <Link to="/cliente/documentos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Documentos</Link>
            <Link to="/cliente/apoio" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Apoio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cliente/perfil" className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-blue-950">{clientData.nome || 'Cliente'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ver Perfil</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {clientData.nome?.charAt(0) || <User className="w-5 h-5" />}
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
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">Minhas Compras</h1>
            <p className="text-gray-500">Histórico completo de reservas e pacotes adquiridos.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Pesquisar compra..." 
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
        ) : filteredPurchases.length === 0 ? (
          <EmptyState 
            icon={<ShoppingBag className="w-10 h-10" />}
            title="Nenhuma compra encontrada"
            description={searchTerm ? "Não encontramos compras com os termos pesquisados." : "Ainda não realizou nenhuma compra connosco."}
            action={<Button onClick={() => navigate('/destinos')}>Explorar Destinos</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredPurchases.map((purchase) => (
              <Card key={purchase.id} className="p-8 border-none shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex gap-6 flex-grow">
                    <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-colors flex-shrink-0">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">{purchase.id}</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          purchase.status === 'Pago' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        )}>
                          {purchase.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-blue-950 tracking-tight">{purchase.produto}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{new Date(purchase.data).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-950">R$ {purchase.valor.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Brasil / Mundo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 min-w-[160px] border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-8">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Pago</p>
                      <p className="text-xl font-black text-blue-950">R$ {purchase.valor.toLocaleString()}</p>
                    </div>
                    <Button variant="outline" className="w-full md:w-auto rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      Ver Detalhes <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
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
