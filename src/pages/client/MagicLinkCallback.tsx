/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function MagicLinkCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Token de acesso não encontrado no link.');
      setIsLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const session = await apiService.verifyMagicLink(token);
        localStorage.setItem('client_token', session.token);
        localStorage.setItem('client_data', JSON.stringify(session.client));
        navigate('/cliente/dashboard');
      } catch (err: any) {
        setError(err.message || 'Erro ao validar o link de acesso. O link pode ter expirado.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-blue-950">Validando seu acesso...</h2>
          <p className="text-gray-500">Por favor, aguarde um momento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-950">Erro de Acesso</h2>
            <p className="text-gray-500">{error}</p>
          </div>
          <Button className="w-full" onClick={() => navigate('/cliente/login')}>
            Voltar ao Login
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}
