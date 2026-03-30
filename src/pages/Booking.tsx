/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Send, CheckCircle2, AlertCircle, Plane } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';
import { BookingRequest } from '../types';
import { motion } from 'motion/react';

export default function Booking() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingRequest>({
    nome: '',
    telefone: '',
    email: '',
    destino: '',
    periodo: '',
    passageiros: 1,
    criancas: 0,
    cidadePartida: '',
    observacoes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'passageiros' || name === 'criancas' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.createBooking(formData) as { trackingCode: string };
      setTrackingCode(response.trackingCode);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar sua reserva. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-24 px-6 max-w-2xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 space-y-6"
        >
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-green-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-blue-950">Reserva Registada!</h1>
          <p className="text-gray-600 leading-relaxed">
            Sua solicitação de reserva foi registada com sucesso. Nossa equipe entrará em contacto para confirmar a disponibilidade e finalizar o pagamento.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-2">
            <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">Código de Acompanhamento</p>
            <p className="text-2xl font-mono font-bold text-blue-900 tracking-wider">{trackingCode}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="w-full" onClick={() => navigate('/acompanhar')}>
              Acompanhar Pedido
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20 mb-4"
          >
            <Calendar className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-bold text-blue-950 tracking-tight">Solicitar Pré-Reserva</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Garanta sua vaga no destino dos seus sonhos. Preencha os dados abaixo e iniciaremos o processo de reserva imediata.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-2xl shadow-blue-900/5 p-8 md:p-12 rounded-[3rem] border-none">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Nome Completo" 
                  name="nome"
                  required
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={handleChange}
                />
                <Input 
                  label="WhatsApp" 
                  name="telefone"
                  required
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                />
                <Input 
                  label="E-mail" 
                  name="email"
                  type="email"
                  required
                  placeholder="Ex: joao@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input 
                  label="Destino da Reserva" 
                  name="destino"
                  required
                  placeholder="Ex: Maldivas ou Europa"
                  value={formData.destino}
                  onChange={handleChange}
                />
                <Input 
                  label="Data de Embarque" 
                  name="periodo"
                  type="date"
                  required
                  value={formData.periodo}
                  onChange={handleChange}
                />
                <Input 
                  label="Cidade de Partida" 
                  name="cidadePartida"
                  required
                  placeholder="Ex: São Paulo, SP"
                  value={formData.cidadePartida}
                  onChange={handleChange}
                />
                <Input 
                  label="Adultos" 
                  name="passageiros"
                  type="number"
                  min="1"
                  required
                  value={formData.passageiros}
                  onChange={handleChange}
                />
                <Input 
                  label="Crianças" 
                  name="criancas"
                  type="number"
                  min="0"
                  required
                  value={formData.criancas}
                  onChange={handleChange}
                />
              </div>

              <TextArea 
                label="Observações Adicionais" 
                name="observacoes"
                placeholder="Ex: Necessidades especiais, preferência de hotel, etc."
                value={formData.observacoes}
                onChange={handleChange}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full shadow-xl shadow-blue-600/20"
                isLoading={isLoading}
              >
                <Send className="w-5 h-5 mr-2" />
                Confirmar Solicitação de Reserva
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
