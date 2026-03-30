/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-3 md:p-4 bg-white border-t border-gray-100">
      <div className="relative flex items-end gap-2 md:gap-3 bg-gray-50 rounded-xl md:rounded-2xl p-1.5 md:p-2 border border-gray-100 focus-within:border-blue-600/30 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
        <button className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 transition-colors shrink-0">
          <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <textarea
          ref={inputRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva a sua mensagem..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] md:text-sm py-1.5 md:py-2 px-1 resize-none max-h-24 md:max-h-32 font-medium text-blue-950 placeholder:text-gray-400"
        />

        <div className="flex items-center gap-1 shrink-0">
          <button className="hidden sm:block p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <Button
            size="sm"
            disabled={!message.trim() || disabled}
            onClick={handleSend}
            className="w-8 h-8 md:w-10 md:h-10 p-0 rounded-lg md:rounded-xl shadow-lg shadow-blue-600/20"
          >
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>
      <p className="text-[8px] md:text-[10px] text-center text-gray-400 mt-2 md:mt-3 font-bold uppercase tracking-widest">
        Suporte Imports Turismo BR
      </p>
    </div>
  );
};
