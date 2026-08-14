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
      bg: 'bg-[#13251B] text-[#D4F938] border-[#22402E]',
      icon: ShoppingBag,
      dot: 'bg-[#D4F938]',
    },
    store: {
      label: 'Store Vendor',
      bg: 'bg-[#251D10] text-[#F59E0B] border-[#40311B]',
      icon: Store,
      dot: 'bg-[#F59E0B]',
    },
    admin: {
      label: 'Admin',
      bg: 'bg-[#20152B] text-[#C084FC] border-[#3B2252]',
      icon: Shield,
      dot: 'bg-[#C084FC]',
    },
  };

  const current = configs[role] || configs.shopper;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px] font-bold' : 'px-3 py-1 text-xs font-extrabold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};
