import React from 'react';
import { Order, DemandList } from '../../types/index.ts';
import { useTheme } from '../../context/ThemeContext.tsx';
import { ShieldCheck, Printer, X, CheckCircle, Smartphone, Hash } from 'lucide-react';
import { ErrandLogo } from '../common/ErrandLogo.tsx';

interface EscrowReceiptModalProps {
  order: Order;
  list?: DemandList;
  onClose: () => void;
}

export const EscrowReceiptModal: React.FC<EscrowReceiptModalProps> = ({ order, list, onClose }) => {
  const { theme } = useTheme();
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors ${
        theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-white border-slate-200'
      }`}>
        {/* Top Decorative Stripe */}
        <div className="h-2 bg-gradient-to-r from-[#008852] via-[#D4F938] to-[#008852]" />

        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-[#1A2F24] bg-[#08120D]/60' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-[#16291E] text-[#D4F938] border-[#234330]'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Mobile Money Digital Receipt
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Official order certificate & security verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-white hover:bg-[#16291E]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-receipt" className={`p-6 sm:p-8 space-y-6 ${
          theme === 'dark' ? 'bg-[#08120D] text-slate-100' : 'bg-white text-slate-900'
        }`}>
          {/* Brand Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
            theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200'
          }`}>
            <ErrandLogo size="md" variant={theme === 'dark' ? 'dark' : 'light'} />
            <div className="text-left sm:text-right text-xs text-slate-400">
              <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ERRAND GHANA ESCROW ENGINE
              </div>
              <div>Accra & Kumasi Urban Hubs</div>
              <div className={`font-mono font-bold mt-1 ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
              }`}>
                STATUS: {order.escrow_status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border text-xs ${
            theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">ORDER ID</span>
              <span className={`font-mono font-bold truncate block ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{order.id.slice(0, 13)}...</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">MOMO TX REF</span>
              <span className="font-mono font-bold text-amber-600 truncate block">{order.momo_transaction_id || 'PENDING'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">PAYMENT NETWORK</span>
              <span className={`font-semibold flex items-center gap-1 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <Smartphone className="w-3 h-3 text-emerald-600" />
                {order.momo_provider}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">DATE</span>
              <span className={`font-mono truncate block ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className={`p-4 rounded-2xl border space-y-1 ${
              theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Customer</span>
              <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {order.shopper_name || 'Customer'}
              </div>
              <div className="text-slate-400 text-[11px]">MoMo: {order.momo_number}</div>
              <div className="text-slate-400 text-[11px]">Delivery: {order.neighborhood}</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${
              theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Store Merchant</span>
              <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {order.store_name}
              </div>
              <div className="text-slate-400 text-[11px]">Merchant KYC: Verified</div>
              <div className="text-slate-400 text-[11px]">Dispatch: Makola / Madina Central Hub</div>
            </div>
          </div>

          {/* Itemized Manifest */}
          {list?.items && list.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Itemized Demand Items</span>
              <div className={`rounded-2xl border overflow-hidden ${
                theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200'
              }`}>
                <table className="w-full text-xs text-left">
                  <thead className={`border-b ${
                    theme === 'dark' ? 'bg-[#0E1A14] text-slate-400 border-[#1A2F24]' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-3 font-bold">Item Name</th>
                      <th className="p-3 text-center font-bold">Qty / Unit</th>
                      <th className="p-3 text-right font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    theme === 'dark' ? 'divide-[#16281E]' : 'divide-slate-200'
                  }`}>
                    {list.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className={`p-3 font-medium ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                        }`}>{item.name}</td>
                        <td className="p-3 text-center text-slate-400">{item.quantity} {item.unit}</td>
                        <td className={`p-3 text-right font-mono font-bold ${
                          theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
                        }`}>GH₵ {(item.target_price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settlement Totals */}
          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
            theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between text-slate-400">
              <span>Gross Escrow Locked Deposit</span>
              <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                GH₵ {order.total_amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Platform Escrow Protection Fee (2%)</span>
              <span className="font-mono text-amber-600 font-bold">GH₵ {order.platform_fee.toFixed(2)}</span>
            </div>
            <div className={`pt-2 border-t flex justify-between text-sm font-extrabold ${
              theme === 'dark' ? 'border-[#1A2F24] text-white' : 'border-slate-200 text-slate-900'
            }`}>
              <span>Vendor Settlement Payout</span>
              <span className={`font-mono ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
              }`}>GH₵ {order.vendor_payout.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Signature */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            theme === 'dark'
              ? 'bg-[#12241B] border-[#234330]'
              : 'bg-emerald-50/60 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-bold flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
              }`}>
                <Hash className="w-3.5 h-3.5" />
                Order Security & State Signature
              </span>
              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                theme === 'dark'
                  ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                2PC 256-BIT
              </span>
            </div>
            <div className={`font-mono text-[10px] break-all p-2.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-[#08120D] text-slate-400 border-[#16281E]'
                : 'bg-white text-slate-600 border-slate-200'
            }`}>
              {order.sha256_audit_hash}
            </div>
            <div className={`flex items-center gap-2 text-[10px] font-medium ${
              theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
            }`}>
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Verified by Escrow Engine • Non-repudiable audit certificate</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          theme === 'dark' ? 'bg-[#08120D]/60 border-[#1A2F24]' : 'bg-slate-50/70 border-slate-100'
        }`}>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
              theme === 'dark'
                ? 'bg-[#0E1A14] border-[#1A2F24] text-slate-300 hover:bg-[#12221A]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
