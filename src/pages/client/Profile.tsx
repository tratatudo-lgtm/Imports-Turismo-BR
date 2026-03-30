/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  LogOut, 
  Bell, 
  ChevronRight, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { apiService } from '../../services/api';
import { Customer } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function ClientProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Customer | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, sessionRes] = await Promise.all([
          apiService.getClientProfile(),
          apiService.getSession().catch(() => null)
        ]);
        
        if (!sessionRes || !sessionRes.authenticated) {
          navigate('/cliente/login');
          return;
        }

        setProfile(profileRes?.profile || profileRes);
        setSession(sessionRes);
        
        localStorage.setItem('client_data', JSON.stringify(sessionRes));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar o seu perfil.');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // API call to update profile would go here
      // For now, we simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs font-bold">A carregar o seu perfil...</p>
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
            <Link to="/cliente/documentos" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Documentos</Link>
            <Link to="/cliente/apoio" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Apoio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-blue-950 leading-none">{session?.name || profile?.nome}</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter leading-none mt-1">{session?.role || 'Cliente'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-blue-950 tracking-tight">O Meu Perfil</h1>
          <p className="text-gray-500">Gira os seus dados pessoais e preferências de conta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="p-8 border-none shadow-sm flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-black border-4 border-white shadow-lg">
                  {profile?.nome?.charAt(0) || <User className="w-12 h-12" />}
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-blue-950">{profile?.nome}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cliente Verificado</p>
              </div>
              <div className="pt-6 border-t border-gray-50 w-full space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Membro desde</span>
                  <span className="font-bold text-blue-950">{new Date(profile?.createdAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Viagens Realizadas</span>
                  <span className="font-bold text-blue-950">12</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-blue-950 text-white space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold">Segurança</h3>
              </div>
              <p className="text-xs text-blue-200/80">A sua conta está protegida com autenticação de dois fatores via WhatsApp.</p>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                Gerir Segurança
              </Button>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="p-8 border-none shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-blue-950">Dados Pessoais</h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <Input 
                      defaultValue={profile?.nome} 
                      className="h-12 bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                    <Input 
                      defaultValue={profile?.email} 
                      className="h-12 bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-xl"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                    <Input 
                      defaultValue={profile?.telefone} 
                      className="h-12 bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                    <Input 
                      type="date"
                      className="h-12 bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Morada</label>
                  <Input 
                    placeholder="Rua, Número, Cidade, País"
                    className="h-12 bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 rounded-xl"
                  />
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

                <div className="pt-6 border-t border-gray-50 flex justify-end">
                  <Button type="submit" disabled={isSaving} className="h-12 px-8 rounded-xl shadow-lg shadow-blue-600/20">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Guardar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="p-8 border-none shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-blue-950">Preferências de Notificação</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-950">Notificações por WhatsApp</p>
                    <p className="text-xs text-gray-400">Receba atualizações sobre as suas reservas em tempo real.</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-950">Newsletter e Ofertas</p>
                    <p className="text-xs text-gray-400">Receba promoções exclusivas e novidades de destinos.</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
