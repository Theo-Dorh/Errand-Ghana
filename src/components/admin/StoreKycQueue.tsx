import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Check, X, Store, UserCheck } from 'lucide-react';

export const StoreKycQueue: React.FC = () => {
  const { availableUsers } = useAuth();
  const { approveStoreKyc } = useMarketplace();

  const storeUsers = availableUsers.filter((u) => u.role === 'store');

  const handleToggleApproval = async (storeId: string, currentStatus: boolean) => {
    await approveStoreKyc(storeId, !currentStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" />
            <span>Store Merchant KYC Verification Queue</span>
          </h4>
          <p className="text-xs text-slate-400">
            Verify Ghana Card credentials, business registration, and food safety certifications before merchant marketplace activation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storeUsers.map((store) => (
          <div
            key={store.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-100">{store.store_name}</h5>
                  <div className="text-xs text-slate-400">Rep: {store.full_name}</div>
                  <div className="text-[11px] text-slate-500">{store.neighborhood}</div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                store.is_approved
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border-amber-500/30'
              }`}>
                {store.is_approved ? 'KYC Approved' : 'Pending Verification'}
              </span>
            </div>

            {/* KYC Credentials */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Ghana Card:</span>
                <span className="text-slate-200 font-semibold">{store.kyc_ghana_card || 'GHA-849201948-1'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MoMo Settlement:</span>
                <span className="text-amber-400">{store.momo_provider} ({store.momo_number})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Food Hygiene Standard:</span>
                <span className="text-emerald-400">GRADE A (Certified)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleToggleApproval(store.id, store.is_approved)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  store.is_approved
                    ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/40'
                }`}
              >
                {store.is_approved ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Revoke KYC Approval</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Merchant KYC</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
