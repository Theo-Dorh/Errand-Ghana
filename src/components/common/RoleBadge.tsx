import React from 'react';
import { UserRole } from '../../types/index.ts';
import { ShoppingBag, Store, Shield } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const configs = {
    shopper: {
      label: 'Shopper',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShoppingBag,
      dot: 'bg-emerald-600',
    },
    store: {
      label: 'Merchant',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Store,
      dot: 'bg-amber-600',
    },
    admin: {
      label: 'Admin',
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Shield,
      dot: 'bg-purple-600',
    },
  };

  const current = configs[role] || configs.shopper;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] font-semibold' : 'px-3 py-1 text-xs font-bold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};
