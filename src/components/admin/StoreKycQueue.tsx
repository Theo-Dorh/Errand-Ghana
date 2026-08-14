import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Check, X, Store, UserCheck } from 'lucide-react';

export const StoreKycQueue: React.FC = () => {
  const { users } = useAuth();
  const { approveStoreKyc } = useMarketplace();

  const storeUsers = users.filter((u) => u.role === 'store');

  const handleToggleApproval = async (storeId: string, currentStatus: boolean) => {
    await approveStoreKyc(storeId, !currentStatus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#D4F938]" />
          <span>Store Merchant KYC Verification Queue</span>
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify Ghana Card registration and food hygiene compliance before activating store accounts for marketplace bidding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storeUsers.map((store) => (
          <div
            key={store.id}
            className="apex-card rounded-3xl p-6 space-y-4 border-[#1A2F24] apex-card-hover"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#251D10] text-[#F59E0B] border border-[#40311B] flex items-center justify-center font-bold">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">{store.store_name || store.full_name}</h5>
                  <div className="text-xs text-slate-400">Rep: {store.full_name}</div>
                  <div className="text-[11px] text-slate-500">{store.neighborhood}</div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                store.is_approved
                  ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                  : 'bg-[#251D10] text-[#F59E0B] border border-[#40311B]'
              }`}>
                {store.is_approved ? 'KYC Approved' : 'Pending Review'}
              </span>
            </div>

            {/* KYC Credentials */}
            <div className="p-3.5 rounded-2xl bg-[#08120D] border border-[#16281E] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Ghana Card:</span>
                <span className="text-slate-200 font-bold">{store.kyc_ghana_card || 'GHA-849201948-1'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MoMo Account:</span>
                <span className="text-[#F59E0B] font-semibold">{store.momo_provider} ({store.momo_number})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Food Hygiene Grade:</span>
                <span className="text-[#D4F938] font-bold">GRADE A (Certified)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleToggleApproval(store.id, store.is_approved)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  store.is_approved
                    ? 'bg-[#08120D] border border-[#16281E] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400'
                    : 'btn-apex text-black shadow-md'
                }`}
              >
                {store.is_approved ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Revoke Approval</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Merchant</span>
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
