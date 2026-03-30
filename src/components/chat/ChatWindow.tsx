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
import { apiService } from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: { label: string; action: string }[];
}

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
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

  useEffect(() => {
    const initChat = async () => {
      try {
        const { sessionId } = await apiService.startChat();
        setSessionId(sessionId);
      } catch (error) {
        console.error('Failed to start chat:', error);
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    if (!sessionId) return;

    setIsTyping(true);

    try {
      const { reply, quick_actions } = await apiService.sendChatMessage(sessionId, content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
        quickActions: quick_actions,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou contacte-nos via WhatsApp.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action.startsWith('http')) {
      window.open(action, '_blank');
    } else if (action.startsWith('/')) {
      window.location.href = action;
    } else {
      handleSendMessage(action);
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
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onQuickAction={handleQuickAction} />
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

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </motion.div>
  );
};
