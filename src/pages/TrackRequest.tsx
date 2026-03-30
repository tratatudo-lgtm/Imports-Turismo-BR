/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, AlertCircle, Calendar, MapPin, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { TrackingResponse } from '../types';
import { siteConfig } from '../config/site';

export default function TrackRequest() {
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiService.trackRequest(trackingCode);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Código de acompanhamento não encontrado. Verifique e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20 mb-6"
        >
          <Package className="text-white w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl font-bold text-blue-950 tracking-tight">Acompanhe seu Pedido</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Insira o código de acompanhamento para verificar o estado atual da sua solicitação.
        </p>
      </div>

      <Card className="p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-900/5 border-none">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Ex: TRK-123456" 
              className="pl-12 h-14 text-lg font-mono uppercase tracking-widest"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-10" isLoading={isLoading}>
            Consultar
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600"
            >
              <AlertCircle className="w-8 h-8 shrink-0" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Referência</p>
                  <h2 className="text-3xl font-mono font-bold text-blue-950">{result.trackingCode}</h2>
                </div>
                <div className={cn("px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wider", getStatusColor(result.status))}>
                  {result.status?.replace('_', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {result.nome && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <User className="w-4 h-4" /> Nome
                    </div>
                    <p className="text-lg font-semibold text-blue-950">{result.nome}</p>
                  </div>
                )}
                {result.destino && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <MapPin className="w-4 h-4" /> Destino
                    </div>
                    <p className="text-lg font-semibold text-blue-950">{result.destino}</p>
                  </div>
                )}
                {result.periodo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <Calendar className="w-4 h-4" /> Período
                    </div>
                    <p className="text-lg font-semibold text-blue-950">{result.periodo}</p>
                  </div>
                )}
              </div>

              {/* Timeline - Simplified and Robust */}
              <div className="pt-8 space-y-6">
                <h3 className="text-lg font-bold text-blue-950">Estado da Solicitação</h3>
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                      <CheckCircle2 className="text-white w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-blue-950">Registada</p>
                      <p className="text-sm text-gray-500">A solicitação foi recebida e aguarda processamento inicial.</p>
                      {result.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">{new Date(result.createdAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className={cn(
                      "absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm",
                      result.status !== 'pendente' ? "bg-blue-500" : "bg-gray-200"
                    )}>
                      <Clock className="text-white w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className={cn("font-bold", result.status !== 'pendente' ? "text-blue-950" : "text-gray-300")}>Em Análise</p>
                      <p className="text-sm text-gray-500">A equipa técnica está a validar os detalhes da sua solicitação.</p>
                    </div>
                  </div>

                  <div className="relative pl-12">
                    <div className={cn(
                      "absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm",
                      result.status === 'concluido' || result.status === 'confirmado' ? "bg-green-500" : "bg-gray-200"
                    )}>
                      <CheckCircle2 className="text-white w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className={cn("font-bold", result.status === 'concluido' || result.status === 'confirmado' ? "text-blue-950" : "text-gray-300")}>Finalizada</p>
                      <p className="text-sm text-gray-500">O processo foi concluído e a informação final está disponível.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-center">
                <Button variant="outline" onClick={() => window.open(`https://wa.me/${siteConfig.whatsapp}`, '_blank')}>
                  Contactar Suporte
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
