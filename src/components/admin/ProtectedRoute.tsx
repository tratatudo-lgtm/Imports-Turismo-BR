/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await apiService.getAdminSession();
        if (session.phoneNumber) {
          localStorage.setItem('admin_phone', session.phoneNumber);
        }
        setIsVerifying(false);
      } catch (err) {
        console.error('Sessão admin inválida:', err);
        localStorage.removeItem('admin_phone');
        navigate('/admin/login');
      }
    };

    verifySession();
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
