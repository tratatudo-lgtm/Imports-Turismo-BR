/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Bell,
  User,
  Calendar,
  MapPin,
  CreditCard,
  FileCheck,
  FileWarning,
  FileClock,
  FileSearch,
  FileType
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiService } from '../../services/api';
import { ClientDocument } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ClientDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, sessionRes] = await Promise.all([
          apiService.getClientDocuments(),
          apiService.getSession().catch(() => null)
        ]);
        
        if (!sessionRes || !sessionRes.authenticated) {
          navigate('/cliente/login');
          return;
        }

        // Map documents with robust fallbacks
        const rawDocs = docsRes?.documents || docsRes || [];
        const mappedDocs = Array.isArray(rawDocs) ? rawDocs.map((doc: any) => ({
          id: doc.id || doc.document_id || Math.random().toString(36).substr(2, 9),
          nome: doc.name || doc.title || doc.nome || 'Documento',
          tipo: doc.type || doc.document_type || doc.tipo || 'documento',
          data: doc.created_at || doc.issue_date || doc.data || new Date().toISOString(),
          url: doc.url || doc.download_url || ''
        })) : [];

        setDocuments(mappedDocs);
        setSession(sessionRes);
        
        localStorage.setItem('client_data', JSON.stringify(sessionRes));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar os seus documentos.');
        if (err.message?.includes('401')) {
          localStorage.removeItem('client_token');
          localStorage.removeItem('client_data');
          navigate('/cliente/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
      alert('Não foi possível descarregar o documento neste momento.');
    }
  };

  const filteredDocuments = documents.filter(d => 
    (d.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'fatura': return <FileText className="w-8 h-8" />;
      case 'bilhete': return <FileCheck className="w-8 h-8" />;
      case 'voucher': return <FileClock className="w-8 h-8" />;
      case 'recibo': return <FileSearch className="w-8 h-8" />;
      default: return <FileType className="w-8 h-8" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs font-bold">A carregar os seus documentos...</p>
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
            <span className="text-lg font-bold text-blue-950">{session?.company_name || 'Imports Turismo BR'}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/cliente/dashboard" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/cliente/compras" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Minhas Compras</Link>
            <Link to="/cliente/documentos" className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">Documentos</Link>
            <Link to="/cliente/apoio" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Apoio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cliente/perfil" className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-blue-950 leading-none">{session?.name || 'Cliente'}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter leading-none mt-1">{session?.role || 'Ver Perfil'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {session?.name?.charAt(0) || <User className="w-5 h-5" />}
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
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">Documentos</h1>
            <p className="text-gray-500">Aceda às suas faturas, bilhetes e vouchers de viagem.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Pesquisar documento..." 
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
        ) : filteredDocuments.length === 0 ? (
          <EmptyState 
            icon={<FileText className="w-10 h-10" />}
            title="Nenhum documento encontrado"
            description={searchTerm ? "Não encontramos documentos com os termos pesquisados." : "Ainda não existem documentos disponíveis para download."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {getDocIcon(doc.tipo)}
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-[9px] font-bold uppercase tracking-widest border border-gray-200">
                      {doc.tipo}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-blue-950 line-clamp-1">{doc.nome}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Disponível desde {new Date(doc.data).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{doc.id}</span>
                  <Button 
                    onClick={() => handleDownload(doc.id, doc.nome)}
                    size="sm" 
                    className="rounded-xl shadow-lg shadow-blue-600/10"
                  >
                    <Download className="w-4 h-4 mr-2" /> Descarregar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
