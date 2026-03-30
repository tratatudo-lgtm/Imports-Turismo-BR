/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.adminLogin({ email, password });
      if (response.ok) {
        localStorage.setItem('admin_email', email);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Credenciais inválidas.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Tente novamente.');
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
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-blue-950">Acesso Restrito</h2>
              <p className="text-sm text-gray-500">Insira suas credenciais para aceder ao painel de controlo.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input 
                label="Email" 
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Input 
                label="Palavra-passe" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12" isLoading={isLoading}>
              Entrar no Painel <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-2 text-blue-100/40 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Conexão segura e encriptada</span>
        </div>
      </div>
    </div>
  );
}
