/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { apiService } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

type LoginMethod = 'whatsapp' | 'email';
type LoginStep = 'input' | 'verify';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<LoginMethod>('whatsapp');
  const [step, setStep] = useState<LoginStep>('input');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (method === 'whatsapp') {
        await apiService.requestClientOtp(identifier);
        setStep('verify');
        setSuccess('Código enviado para o seu WhatsApp!');
      } else {
        await apiService.requestMagicLink(identifier);
        setSuccess('Link de acesso enviado para o seu e-mail!');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao solicitar acesso. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const session = await apiService.verifyClientOtp(identifier, otp);
      localStorage.setItem('client_token', session.token);
      localStorage.setItem('client_data', JSON.stringify(session.client));
      navigate('/cliente/dashboard');
    } catch (err: any) {
      setError(err.message || 'Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao site
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Área do Cliente
          </div>
          <h1 className="text-4xl font-black text-blue-950 tracking-tight">Bem-vindo de volta</h1>
          <p className="text-gray-500">Aceda à sua área reservada para gerir as suas viagens e documentos.</p>
        </div>

        <Card className="p-8 border-none shadow-2xl shadow-blue-900/5 rounded-[2.5rem] bg-white/80 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex p-1 bg-gray-100 rounded-2xl">
                  <button
                    onClick={() => { setMethod('whatsapp'); setError(null); setSuccess(null); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                      method === 'whatsapp' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    onClick={() => { setMethod('email'); setError(null); setSuccess(null); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                      method === 'email' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Mail className="w-4 h-4" /> E-mail
                  </button>
                </div>

                <form onSubmit={handleRequestAccess} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                      {method === 'whatsapp' ? 'Telemóvel / WhatsApp' : 'Endereço de E-mail'}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {method === 'whatsapp' ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                      </div>
                      <Input
                        type={method === 'whatsapp' ? 'tel' : 'email'}
                        placeholder={method === 'whatsapp' ? '+351 912 345 678' : 'exemplo@email.com'}
                        className="pl-12 h-14 bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-2xl"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600 text-sm">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{success}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        {method === 'whatsapp' ? 'Receber Código' : 'Receber Link Mágico'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">Verifique o seu WhatsApp</h3>
                  <p className="text-sm text-gray-500">Enviamos um código de 6 dígitos para {identifier}</p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-center block">
                      Código de Verificação
                    </label>
                    <Input
                      type="text"
                      placeholder="000000"
                      className="h-16 text-center text-3xl font-black tracking-[0.5em] bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-2xl"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20"
                      disabled={isLoading || otp.length < 6}
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirmar e Entrar'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-gray-400 hover:text-blue-600"
                      onClick={() => setStep('input')}
                    >
                      Alterar número ou método
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <p className="text-center text-sm text-gray-400">
          Ao entrar, concorda com os nossos <Link to="/termos" className="text-blue-600 font-bold hover:underline">Termos de Serviço</Link> e <Link to="/privacidade" className="text-blue-600 font-bold hover:underline">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
