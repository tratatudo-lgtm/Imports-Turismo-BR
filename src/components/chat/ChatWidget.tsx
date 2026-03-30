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
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
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
              className="absolute bottom-full right-0 mb-4 w-56 md:w-64 bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl shadow-blue-900/40 border border-gray-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 -skew-x-12 translate-x-1/4" />
              <div className="relative z-10 space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Plane className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-blue-950 uppercase tracking-widest">Suporte Online</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-blue-950 leading-tight">
                  Olá! Precisa de ajuda para planear a sua próxima viagem?
                </p>
                <Button 
                  size="sm" 
                  className="w-full h-8 md:h-10 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black"
                  onClick={() => {
                    setIsOpen(true);
                    setShowNotification(false);
                  }}
                >
                  Falar Agora
                </Button>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
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
            "w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500",
            isOpen 
              ? "bg-white text-blue-600 rotate-90 shadow-blue-900/20" 
              : "bg-blue-600 text-white shadow-blue-600/40"
          )}
        >
          {isOpen ? <X className="w-6 h-6 md:w-8 md:h-8" /> : <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />}
          
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-amber-500 border-2 md:border-4 border-white rounded-full animate-pulse" />
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
