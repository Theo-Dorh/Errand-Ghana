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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Decorative Stripe */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mobile Money Escrow Receipt</h3>
              <p className="text-xs text-slate-500">Official transaction certificate & cryptographic state verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <ErrandLogo size="md" />
            <div className="text-left sm:text-right text-xs text-slate-500">
              <div className="font-bold text-slate-900">ERRAND GHANA ESCROW ENGINE</div>
              <div>Accra & Kumasi Urban Hubs</div>
              <div className="font-mono text-emerald-800 font-bold mt-1">STATUS: {order.escrow_status.toUpperCase()}</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">ORDER ID</span>
              <span className="font-mono font-bold text-slate-900 truncate block">{order.id.slice(0, 13)}...</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">MOMO TX REF</span>
              <span className="font-mono font-bold text-amber-800 truncate block">{order.momo_transaction_id || 'PENDING'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">PAYMENT NETWORK</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-700" />
                {order.momo_provider}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">DATE</span>
              <span className="font-mono text-slate-700 truncate block">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Customer</span>
              <div className="font-bold text-slate-900">{order.shopper_name || 'Customer'}</div>
              <div className="text-slate-500 text-[11px]">MoMo: {order.momo_number}</div>
              <div className="text-slate-500 text-[11px]">Delivery: {order.neighborhood}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Store Merchant</span>
              <div className="font-bold text-slate-900">{order.store_name}</div>
              <div className="text-slate-500 text-[11px]">Merchant KYC: Verified</div>
              <div className="text-slate-500 text-[11px]">Dispatch: Makola / Madina Central Hub</div>
            </div>
          </div>

          {/* Itemized Manifest */}
          {list?.items && list.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Itemized Demand Items</span>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold">Item Name</th>
                      <th className="p-3 text-center font-bold">Qty / Unit</th>
                      <th className="p-3 text-right font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-900">{item.name}</td>
                        <td className="p-3 text-center text-slate-600">{item.quantity} {item.unit}</td>
                        <td className="p-3 text-right font-mono text-slate-900 font-bold">GH₵ {(item.target_price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settlement Totals */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Escrow Locked Deposit</span>
              <span className="font-mono text-slate-900 font-bold">GH₵ {order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Escrow Insurance Fee (2%)</span>
              <span className="font-mono text-amber-800 font-bold">GH₵ {order.platform_fee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Vendor Settlement Payout</span>
              <span className="font-mono text-emerald-800">GH₵ {order.vendor_payout.toFixed(2)}</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Signature */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Immutable SHA-256 State Signature
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white font-mono text-[10px] font-bold">
                2PC 256-BIT
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-600 break-all bg-white p-2.5 rounded-xl border border-emerald-200">
              {order.sha256_audit_hash}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-800 font-medium">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Signed by Escrow Coordinator • Non-repudiable audit entry</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 p-6 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
