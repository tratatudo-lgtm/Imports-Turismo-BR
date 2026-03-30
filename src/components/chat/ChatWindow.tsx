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
      content: 'Olá! Bem-vindo à Imports Turismo BR. Como posso ajudar a planear a sua próxima aventura hoje?',
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

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Obrigado pelo seu contacto. Um dos nossos consultores especializados entrará em contacto consigo em breve para dar seguimento ao seu pedido. Se preferir ajuda imediata, pode também contactar-nos via WhatsApp.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/30 flex flex-col overflow-hidden border border-gray-100 z-50"
    >
      {/* Header */}
      <div className="p-6 bg-blue-600 text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Globe className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-black tracking-tight text-lg">Imports Turismo BR</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Online Agora</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Minus className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex gap-2 p-4 bg-white rounded-2xl rounded-tl-none w-16 shadow-sm border border-gray-100">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100" />
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-xl bg-blue-50 text-blue-600 border border-blue-100"
          onClick={() => handleSendMessage('Quero um orçamento')}
        >
          Pedir Orçamento
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-xl bg-blue-50 text-blue-600 border border-blue-100"
          onClick={() => handleSendMessage('Quero ver destinos')}
        >
          Ver Destinos
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="whitespace-nowrap rounded-xl bg-blue-50 text-blue-600 border border-blue-100"
          onClick={() => handleSendMessage('Falar com consultor')}
        >
          Falar com Consultor
        </Button>
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </motion.div>
  );
};
