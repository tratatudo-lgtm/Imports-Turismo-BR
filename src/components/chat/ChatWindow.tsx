/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { X, Minus, Globe, MessageCircle, MoreVertical, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/site';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá. O atendimento automático web está disponível para orientar o seu pedido. Pode escrever a sua mensagem ou usar as opções rápidas abaixo.',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare for real backend integration
      // const response = await fetch('/api/imports-turismo/chat/message', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: content, userId: '...' })
      // });
      // const data = await response.json();
      
      // Fallback professional message if API is not yet implemented
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Agradecemos o seu contacto. De momento, os nossos consultores estão a processar vários pedidos. Pode também contactar-nos diretamente via WhatsApp para uma resposta mais rápida.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[500px] md:h-[600px] max-h-[calc(100vh-10rem)] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-900/30 flex flex-col overflow-hidden border border-gray-100 z-50"
    >
      {/* Header */}
      <div className="p-4 md:p-6 bg-blue-600 text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-black tracking-tight text-base md:text-lg">Imports Turismo BR</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Online Agora</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-1 md:gap-2">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Minus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex gap-2 p-3 md:p-4 bg-white rounded-2xl rounded-tl-none w-14 md:w-16 shadow-sm border border-gray-100">
            <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-600 rounded-full animate-bounce" />
            <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-600 rounded-full animate-bounce delay-100" />
            <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-600 rounded-full animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 md:px-6 py-2 md:py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-lg md:rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] md:text-xs h-8 md:h-9"
          onClick={() => window.location.href = '/orcamento'}
        >
          Pedir Orçamento
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-lg md:rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] md:text-xs h-8 md:h-9"
          onClick={() => window.location.href = '/destinos'}
        >
          Ver Destinos
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-lg md:rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] md:text-xs h-8 md:h-9"
          onClick={() => window.location.href = '/apoio'}
        >
          Falar com Consultor
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-lg md:rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] md:text-xs h-8 md:h-9"
          onClick={() => window.location.href = '/acompanhar'}
        >
          Acompanhar Pedido
        </Button>
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </motion.div>
  );
};
