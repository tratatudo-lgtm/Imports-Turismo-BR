/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.sendAdminOtp(phoneNumber);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.verifyAdminOtp(phoneNumber, otp);
      localStorage.setItem('admin_phone', phoneNumber);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao validar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border border-white/20 shadow-2xl"
          >
            <Lock className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Área Administrativa</h1>
          <p className="text-blue-100/60">Acesso restrito para consultores autorizados.</p>
        </div>

        <Card className="p-10 rounded-[3rem] shadow-2xl border-none bg-white/95 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-blue-950">Acesso por WhatsApp</h2>
                  <p className="text-sm text-gray-500">Insira o seu número de telefone para receber o código de acesso.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <Input 
                    label="Número de Telefone" 
                    type="tel"
                    placeholder="+351 912 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                  Enviar Código <MessageSquare className="ml-2 w-4 h-4" />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="otp-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-blue-950">Validar Código</h2>
                  <p className="text-sm text-gray-500">Enviamos um código de 6 dígitos para o seu WhatsApp.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <Input 
                    label="Código de Acesso" 
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoFocus
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                    Confirmar Acesso <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-gray-500"
                    onClick={() => setStep('phone')}
                    disabled={isLoading}
                  >
                    Alterar número
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        <div className="flex items-center justify-center gap-2 text-blue-100/40 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Conexão segura e encriptada</span>
        </div>
      </div>
    </div>
  );
}
