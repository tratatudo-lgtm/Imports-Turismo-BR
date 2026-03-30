/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MessageCircle, X, Plane, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatWindow } from './ChatWindow';
import { Button } from '../ui/Button';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowNotification(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <ChatWindow onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>

      <div className="relative group">
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-3xl p-6 shadow-2xl shadow-blue-900/40 border border-gray-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 -skew-x-12 translate-x-1/4" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-black text-blue-950 uppercase tracking-widest">Suporte Online</span>
                </div>
                <p className="text-sm font-bold text-blue-950 leading-tight">
                  Olá! Precisa de ajuda para planear a sua próxima viagem?
                </p>
                <Button 
                  size="sm" 
                  className="w-full h-10 rounded-xl text-xs font-black"
                  onClick={() => {
                    setIsOpen(true);
                    setShowNotification(false);
                  }}
                >
                  Falar Agora
                </Button>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className={cn(
            "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500",
            isOpen 
              ? "bg-white text-blue-600 rotate-90 shadow-blue-900/20" 
              : "bg-blue-600 text-white shadow-blue-600/40"
          )}
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
          
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 border-4 border-white rounded-full animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

// Helper to avoid import error if cn is not available in this file context
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
