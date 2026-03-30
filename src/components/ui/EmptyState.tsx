/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-gray-200">
    <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-bold text-blue-950">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">{description}</p>
    </div>
    {action && <div className="pt-2">{action}</div>}
  </div>
);
