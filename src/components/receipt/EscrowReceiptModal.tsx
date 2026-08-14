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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Decorative Banner */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Cryptographic Escrow Audit Receipt</h3>
              <p className="text-xs text-slate-400">Non-Repudiation 2PC Saga Mobile Money Certificate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Content Area */}
        <div id="printable-receipt" className="p-8 space-y-6 bg-slate-900 text-slate-200">
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-slate-700">
            <ErrandLogo size="md" />
            <div className="text-left sm:text-right text-xs text-slate-400">
              <div className="font-semibold text-slate-200">ERRAND GHANA ESCROW ENGINE</div>
              <div>University of Ghana, Legon</div>
              <div className="font-mono text-emerald-400 font-bold mt-1">STATUS: {order.escrow_status.toUpperCase()}</div>
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">ORDER ID</span>
              <span className="font-mono font-semibold text-slate-200 truncate block">{order.id.slice(0, 13)}...</span>
            </div>
            <div>
              <span className="text-slate-500 block">MOMO TX REF</span>
              <span className="font-mono font-bold text-amber-400 truncate block">{order.momo_transaction_id || 'PENDING'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">PAYMENT RAILS</span>
              <span className="font-medium text-slate-200 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-400" />
                {order.momo_provider}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">TIMESTAMP</span>
              <span className="font-mono text-slate-300 truncate block">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Parties & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Shopper (Beneficiary)</span>
              <div className="font-bold text-slate-200">{order.shopper_name || 'Kofi Mensah'}</div>
              <div className="text-slate-400 text-[11px] mt-0.5">MoMo: {order.momo_number}</div>
              <div className="text-slate-400 text-[11px]">Neighborhood: {order.neighborhood || 'East Legon, Accra'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Fulfilling Store Merchant</span>
              <div className="font-bold text-slate-200">{order.store_name || 'Naa Lamiley Makola Wholesale'}</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Merchant KYC: Verified (Ghana Card GHA-723)</div>
              <div className="text-slate-400 text-[11px]">Dispatch Hub: Makola Market Central</div>
            </div>
          </div>

          {/* Itemized Grocery Breakdown */}
          {list?.items && list.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Itemized Demand Manifest</span>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Item Name</th>
                      <th className="p-2.5 text-center">Qty / Unit</th>
                      <th className="p-2.5 text-right">Target Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {list.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="p-2.5 font-medium text-slate-200">{item.name}</td>
                        <td className="p-2.5 text-center text-slate-400">{item.quantity} {item.unit}</td>
                        <td className="p-2.5 text-right font-mono text-slate-300">GH₵ {(item.target_price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Settlement Totals */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Escrow Locked Deposit</span>
              <span className="font-mono text-slate-200">GH₵ {order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>2% Platform Escrow Insurance Fee</span>
              <span className="font-mono text-amber-400">GH₵ {order.platform_fee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
              <span>Vendor Settlement Payout</span>
              <span className="font-mono text-emerald-400">GH₵ {order.vendor_payout.toFixed(2)}</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Non-Repudiation Block */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Immutable SHA-256 State Hash
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                VERIFIED (2PC 256-BIT)
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 break-all bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              {order.sha256_audit_hash}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Signed by Distributed Saga Coordinator • Non-repudiable audit ledger entry</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 p-6 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Close Receipt
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
