import React from 'react';
import { Order, DemandList } from '../../types/index.ts';
import { ShieldCheck, Printer, X, CheckCircle, Smartphone, Hash } from 'lucide-react';
import { ErrandLogo } from '../common/ErrandLogo.tsx';

interface EscrowReceiptModalProps {
  order: Order;
  list?: DemandList;
  onClose: () => void;
}

export const EscrowReceiptModal: React.FC<EscrowReceiptModalProps> = ({ order, list, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E1A14] border border-[#1A2F24] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Decorative Stripe */}
        <div className="h-2 bg-gradient-to-r from-[#008852] via-[#D4F938] to-[#008852]" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A2F24] bg-[#08120D]/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#16291E] text-[#D4F938] border border-[#234330] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mobile Money Digital Receipt</h3>
              <p className="text-xs text-slate-400">Official order certificate & security verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#16291E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6 bg-[#08120D] text-slate-100">
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A2F24]">
            <ErrandLogo size="md" variant="dark" />
            <div className="text-left sm:text-right text-xs text-slate-400">
              <div className="font-bold text-white">ERRAND GHANA ESCROW ENGINE</div>
              <div>Accra & Kumasi Urban Hubs</div>
              <div className="font-mono text-[#D4F938] font-bold mt-1">STATUS: {order.escrow_status.toUpperCase()}</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0E1A14] border border-[#1A2F24] text-xs">
            <div>
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">ORDER ID</span>
              <span className="font-mono font-bold text-white truncate block">{order.id.slice(0, 13)}...</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">MOMO TX REF</span>
              <span className="font-mono font-bold text-[#F59E0B] truncate block">{order.momo_transaction_id || 'PENDING'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">PAYMENT NETWORK</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-[#D4F938]" />
                {order.momo_provider}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">DATE</span>
              <span className="font-mono text-slate-300 truncate block">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#0E1A14] border border-[#1A2F24] space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Customer</span>
              <div className="font-bold text-white">{order.shopper_name || 'Customer'}</div>
              <div className="text-slate-400 text-[11px]">MoMo: {order.momo_number}</div>
              <div className="text-slate-400 text-[11px]">Delivery: {order.neighborhood}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1A14] border border-[#1A2F24] space-y-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Store Merchant</span>
              <div className="font-bold text-white">{order.store_name}</div>
              <div className="text-slate-400 text-[11px]">Merchant KYC: Verified</div>
              <div className="text-slate-400 text-[11px]">Dispatch: Makola / Madina Central Hub</div>
            </div>
          </div>

          {/* Itemized Manifest */}
          {list?.items && list.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Itemized Demand Items</span>
              <div className="rounded-2xl border border-[#1A2F24] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0E1A14] text-slate-400 border-b border-[#1A2F24]">
                    <tr>
                      <th className="p-3 font-bold">Item Name</th>
                      <th className="p-3 text-center font-bold">Qty / Unit</th>
                      <th className="p-3 text-right font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#16281E]">
                    {list.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-200">{item.name}</td>
                        <td className="p-3 text-center text-slate-400">{item.quantity} {item.unit}</td>
                        <td className="p-3 text-right font-mono text-[#D4F938] font-bold">GH₵ {(item.target_price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settlement Totals */}
          <div className="p-4 rounded-2xl bg-[#0E1A14] border border-[#1A2F24] space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Escrow Locked Deposit</span>
              <span className="font-mono text-white font-bold">GH₵ {order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Platform Escrow Protection Fee (2%)</span>
              <span className="font-mono text-[#F59E0B] font-bold">GH₵ {order.platform_fee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-[#1A2F24] flex justify-between text-sm font-extrabold text-white">
              <span>Vendor Settlement Payout</span>
              <span className="font-mono text-[#D4F938]">GH₵ {order.vendor_payout.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Signature */}
          <div className="p-4 rounded-2xl bg-[#12241B] border border-[#234330] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#D4F938] font-bold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Order Security & State Signature
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#182C20] text-[#D4F938] font-mono text-[10px] font-bold border border-[#234330]">
                2PC 256-BIT
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 break-all bg-[#08120D] p-2.5 rounded-xl border border-[#16281E]">
              {order.sha256_audit_hash}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#D4F938] font-medium">
              <CheckCircle className="w-3 h-3 text-[#D4F938]" />
              <span>Verified by Escrow Engine • Non-repudiable audit certificate</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 p-6 bg-[#08120D]/60 border-t border-[#1A2F24]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0E1A14] border border-[#1A2F24] text-slate-300 text-xs font-bold hover:bg-[#12221A] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
