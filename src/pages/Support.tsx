/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Send, CheckCircle2, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';
import { ComplaintRequest } from '../types';
import { motion } from 'motion/react';
import { siteConfig } from '../config/site';

export default function Support() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ComplaintRequest>({
    nome: '',
    telefone: '',
    email: '',
    referencia: '',
    descricao: '',
    dataOcorrencia: '',
    expectativaResolucao: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiService.createComplaint(formData);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar sua reclamação. Tente novamente.');
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
          <h1 className="text-3xl font-bold text-blue-950">Reclamação Registada</h1>
          <p className="text-gray-600 leading-relaxed">
            A sua reclamação foi registada com sucesso. A nossa equipa de apoio ao cliente irá analisar o seu caso e entrará em contacto assim que possível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="w-full" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.open(`https://wa.me/${siteConfig.whatsapp}`, '_blank')}>
              Falar no WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-blue-950 tracking-tight leading-tight">
              Central de <br/>
              <span className="text-blue-600">Apoio ao Cliente</span>
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Estamos aqui para garantir que sua experiência seja positiva. Se algo não saiu como esperado, conte-nos para que possamos analisar a situação.
            </p>
            
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-50 p-3 rounded-xl">
                  <Phone className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">WhatsApp</p>
                  <p className="font-bold text-blue-950">{siteConfig.whatsappFormatted}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Mail className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">E-mail de Suporte</p>
                  <p className="font-bold text-blue-950">{siteConfig.supportEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-amber-50 p-3 rounded-xl">
                  <MessageSquare className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Apoio</p>
                  <p className="font-bold text-blue-950">Análise Especializada</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Complaint Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-2xl shadow-blue-900/5 p-8 md:p-12 rounded-[3rem] border-none">
              <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-bold text-blue-950">Formulário de Reclamação</h2>
                <p className="text-gray-500">Preencha os detalhes abaixo para que possamos analisar seu caso.</p>
              </div>

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
                    label="Referência da Reserva" 
                    name="referencia"
                    required
                    placeholder="Ex: TRK-123456"
                    value={formData.referencia}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Data da Ocorrência" 
                    name="dataOcorrencia"
                    type="date"
                    required
                    value={formData.dataOcorrencia}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Expectativa de Resolução" 
                    name="expectativaResolucao"
                    placeholder="Ex: Reembolso, Crédito, etc."
                    value={formData.expectativaResolucao}
                    onChange={handleChange}
                  />
                </div>

                <TextArea 
                  label="Descrição Detalhada do Problema" 
                  name="descricao"
                  required
                  placeholder="Conte-nos exatamente o que aconteceu..."
                  value={formData.descricao}
                  onChange={handleChange}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full shadow-xl shadow-blue-600/20"
                  isLoading={isLoading}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Reclamação para Análise
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
