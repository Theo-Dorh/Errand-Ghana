import React from 'react';
import { UserRole } from '../../types/index.ts';
import { ShoppingCart, Store, ShieldCheck } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const configs = {
    shopper: {
      label: 'C2B Shopper',
      bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
      icon: ShoppingCart,
      dot: 'bg-emerald-400',
    },
    store: {
      label: 'Market Merchant',
      bg: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
      icon: Store,
      dot: 'bg-amber-400',
    },
    admin: {
      label: 'Escrow Auditor',
      bg: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
      icon: ShieldCheck,
      dot: 'bg-purple-400',
    },
  };

  const current = configs[role] || configs.shopper;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses} shadow-sm backdrop-blur-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};
