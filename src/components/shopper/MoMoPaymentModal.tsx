import React, { useState } from 'react';
import { StoreOffer, DemandList, MoMoProvider } from '../../types/index.ts';
import { ShieldCheck, Smartphone, Lock, AlertCircle, X, Check } from 'lucide-react';

interface MoMoPaymentModalProps {
  offer: StoreOffer;
  list: DemandList;
  defaultMomoNumber?: string;
  defaultProvider?: MoMoProvider;
  onClose: () => void;
  onConfirmPayment: (
    offerId: string,
    momoNumber: string,
    provider: MoMoProvider,
    momoPin: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const MoMoPaymentModal: React.FC<MoMoPaymentModalProps> = ({
  offer,
  list,
  defaultMomoNumber = '0244123456',
  defaultProvider = 'MTN_MOMO',
  onClose,
  onConfirmPayment,
}) => {
  const [provider, setProvider] = useState<MoMoProvider>(defaultProvider);
  const [momoNumber, setMomoNumber] = useState(defaultMomoNumber);
  const [momoPin, setMomoPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = offer.offered_total_price + offer.delivery_fee;
  const platformFee = Math.round((totalAmount * 0.02) * 100) / 100;
  const vendorPayout = Math.round((totalAmount - platformFee) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoNumber || momoNumber.length < 9) {
      setErrorMsg('Please enter a valid Ghana Mobile Money phone number.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');
      const res = await onConfirmPayment(offer.id, momoNumber, provider, momoPin);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Payment authentication failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during MoMo execution.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0E1A14] border border-[#1A2F24] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A2F24] bg-[#08120D]/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#16291E] text-[#D4F938] border border-[#234330] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mobile Money Safe Pay Protection</h3>
              <p className="text-xs text-slate-400">Funds are held safely until you receive your items</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#16291E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Amount Overview */}
          <div className="p-4 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Store Vendor</span>
              <span className="font-bold text-white">{offer.store_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Grocery List</span>
              <span className="font-medium text-slate-300">{list.title}</span>
            </div>
            <div className="pt-2 border-t border-[#1A2F24] flex justify-between items-center text-sm font-extrabold text-white">
              <span>Total Safe Pay Amount</span>
              <span className="font-mono text-lg text-[#D4F938]">GH₵ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* MoMo Provider Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Select Mobile Money Network</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('MTN_MOMO')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                  provider === 'MTN_MOMO'
                    ? 'bg-[#251D10] text-[#F59E0B] border-[#F59E0B] shadow-inner'
                    : 'bg-[#08120D] border-[#16281E] text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span>MTN MoMo</span>
                <span className="text-[10px] text-slate-400 font-mono">*170#</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('TELECEL_CASH')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                  provider === 'TELECEL_CASH'
                    ? 'bg-[#2B151A] text-[#F87171] border-[#F87171] shadow-inner'
                    : 'bg-[#08120D] border-[#16281E] text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span>Telecel Cash</span>
                <span className="text-[10px] text-slate-400 font-mono">*110#</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('AT_MONEY')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                  provider === 'AT_MONEY'
                    ? 'bg-[#15232B] text-[#38BDF8] border-[#38BDF8] shadow-inner'
                    : 'bg-[#08120D] border-[#16281E] text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span>AT Money</span>
                <span className="text-[10px] text-slate-400 font-mono">*110#</span>
              </button>
            </div>
          </div>

          {/* Phone Number and Simulation PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">MoMo Phone Number *</label>
              <input
                type="tel"
                required
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="0244123456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-white font-mono text-xs focus:outline-none focus:border-[#D4F938]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Simulated MoMo PIN</span>
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={momoPin}
                onChange={(e) => setMomoPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-white font-mono text-center text-xs tracking-widest focus:outline-none focus:border-[#D4F938]"
              />
            </div>
          </div>

          {/* Safe Pay Guarantee Callout */}
          <div className="p-3.5 rounded-2xl bg-[#12241B] border border-[#234330] text-[11px] text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#D4F938] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">100% Money-Back Safe Pay Protection</strong>
              <span>
                Your funds are locked in the escrow vault. The store receives GH₵ {vendorPayout.toFixed(2)} only when you inspect the fresh goods and confirm receipt.
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-slate-300 text-xs font-bold hover:bg-[#12221A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Locking Escrow...' : `Authorize GH₵ ${totalAmount.toFixed(2)}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
