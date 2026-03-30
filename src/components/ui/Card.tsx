/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card = ({ children, className, title, subtitle }: CardProps) => {
  return (
    <div className={cn('overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100', className)}>
      {(title || subtitle) && (
        <div className="border-b border-gray-100 px-6 py-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
