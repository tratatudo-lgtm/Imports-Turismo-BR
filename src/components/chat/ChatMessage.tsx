/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { Plane } from 'lucide-react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full gap-2 md:gap-3 mb-4",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 mt-1">
          <Plane className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-[13px] md:text-sm font-medium leading-relaxed shadow-sm",
        isAssistant 
          ? "bg-white text-blue-950 rounded-tl-none border border-gray-100" 
          : "bg-blue-600 text-white rounded-tr-none"
      )}>
        {message.content}
        <div className={cn(
          "text-[9px] md:text-[10px] mt-1.5 md:mt-2 opacity-50",
          isAssistant ? "text-blue-950" : "text-white"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};
