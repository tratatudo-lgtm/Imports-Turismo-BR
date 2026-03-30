/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';
import { QuoteRequest } from '../types';
import { motion } from 'motion/react';

export default function QuoteRequestPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuoteRequest>({
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
      const response = await apiService.createQuote(formData) as { trackingCode: string };
      setTrackingCode(response.trackingCode);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar seu pedido. Tente novamente.');
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
          <h1 className="text-3xl font-bold text-blue-950">Pedido Recebido com Sucesso!</h1>
          <p className="text-gray-600 leading-relaxed">
            Obrigado, <span className="font-bold text-blue-600">{formData.nome}</span>! Nossa equipe de especialistas já foi notificada e entrará em contacto em breve com as melhores opções para sua viagem.
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
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Info */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Plane className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-blue-950 tracking-tight leading-tight">
              Solicite seu <br/>
              <span className="text-blue-600">Orçamento Premium</span>
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Preencha o formulário ao lado e deixe nossa equipe desenhar a viagem dos seus sonhos. Atendimento personalizado e as melhores tarifas garantidas.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <CheckCircle2 className="text-amber-500 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-950 text-sm">Curadoria Exclusiva</p>
                  <p className="text-xs text-gray-500">Hotéis e roteiros selecionados a dedo.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <CheckCircle2 className="text-amber-500 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-950 text-sm">Melhor Preço</p>
                  <p className="text-xs text-gray-500">Negociações diretas com fornecedores.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <CheckCircle2 className="text-amber-500 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-950 text-sm">Suporte Total</p>
                  <p className="text-xs text-gray-500">Acompanhamento do embarque ao retorno.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
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
                    label="Destino Desejado" 
                    name="destino"
                    required
                    placeholder="Ex: Maldivas ou Europa"
                    value={formData.destino}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Período da Viagem" 
                    name="periodo"
                    required
                    placeholder="Ex: Janeiro/2026 ou 15 dias"
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
                  label="Observações Especiais" 
                  name="observacoes"
                  placeholder="Conte-nos mais sobre seus desejos para esta viagem..."
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
                  Enviar Solicitação de Orçamento
                </Button>
                
                <p className="text-center text-xs text-gray-400">
                  Ao enviar, você concorda com nossos termos de privacidade e autoriza o contacto comercial.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
