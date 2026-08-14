import React, { useState } from 'react';
import { StoreOffer, DemandList, MoMoProvider } from '../../types/index.ts';
import { Smartphone, ShieldCheck, Lock, ArrowRight, X, CheckCircle, AlertCircle } from 'lucide-react';

interface MoMoPaymentModalProps {
  offer: StoreOffer;
  list: DemandList;
  defaultMomoNumber: string;
  defaultProvider: MoMoProvider;
  onClose: () => void;
  onConfirmPayment: (
    listId: string,
    offerId: string,
    provider: MoMoProvider,
    momoNumber: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const MoMoPaymentModal: React.FC<MoMoPaymentModalProps> = ({
  offer,
  list,
  defaultMomoNumber,
  defaultProvider,
  onClose,
  onConfirmPayment,
}) => {
  const [provider, setProvider] = useState<MoMoProvider>(defaultProvider || 'MTN_MOMO');
  const [momoNumber, setMomoNumber] = useState(defaultMomoNumber || '0244123456');
  const [step, setStep] = useState<'details' | 'ussd_prompt' | 'processing' | 'success'>('details');
  const [ussdPin, setUssdPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = offer.offered_total_price + offer.delivery_fee;

  const handleProceedToUSSD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoNumber || momoNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Ghana Mobile Money phone number');
      return;
    }
    setErrorMsg('');
    setStep('ussd_prompt');
  };

  const handleAuthorizeUSSD = async () => {
    if (!ussdPin || ussdPin.length < 4) {
      setErrorMsg('Please enter your 4-digit MoMo PIN to authorize escrow lock');
      return;
    }

    try {
      setStep('processing');
      setErrorMsg('');

      // Simulate network latency for Ghana MoMo gateway
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await onConfirmPayment(list.id, offer.id, provider, momoNumber);
      if (res.success) {
        setStep('success');
      } else {
        setErrorMsg(res.message || 'Payment authorization failed');
        setStep('details');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed');
      setStep('details');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Ghana Mobile Money 2PC Escrow</h3>
              <p className="text-xs text-slate-400">Phase 1: Lock Deposit in Neutral Platform Vault</p>
            </div>
          </div>

          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Details & Provider Select */}
        {step === 'details' && (
          <form onSubmit={handleProceedToUSSD} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Escrow Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-300">100% Shopper Protection Guarantee</div>
                <div className="text-slate-300 mt-1 leading-relaxed">
                  Funds are <strong className="text-white">NOT</strong> paid to the merchant yet. They are locked in the platform escrow vault until you physically inspect and confirm delivery.
                </div>
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Mobile Money Network</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('MTN_MOMO')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    provider === 'MTN_MOMO'
                      ? 'bg-amber-950/60 border-amber-400 text-amber-300 shadow-md shadow-amber-900/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-black text-xs">MTN MoMo</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">*170#</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('TELECEL_CASH')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    provider === 'TELECEL_CASH'
                      ? 'bg-rose-950/60 border-rose-400 text-rose-300 shadow-md shadow-rose-900/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-black text-xs">Telecel Cash</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">*110#</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('AT_MONEY')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    provider === 'AT_MONEY'
                      ? 'bg-blue-950/60 border-blue-400 text-blue-300 shadow-md shadow-blue-900/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-black text-xs">AT Money</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">*110#</div>
                </button>
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Money Phone Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-semibold">+233 (0)</span>
                <input
                  type="tel"
                  required
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="24 412 3456"
                  className="w-full pl-28 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Grocery Items Subtotal</span>
                <span className="font-mono text-slate-200">GH₵ {offer.offered_total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Delivery Fee</span>
                <span className="font-mono text-slate-200">GH₵ {offer.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Escrow Deposit (To Lock)</span>
                <span className="font-mono text-amber-400">GH₵ {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Prompt Phone for MoMo USSD Authorization</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Simulated Ghana MoMo USSD Overlay */}
        {step === 'ussd_prompt' && (
          <div className="p-6 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-400 shadow-2xl text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">{provider} USSD GATEWAY</div>
                <div className="text-sm font-semibold text-slate-200 mt-1">
                  Authorize Escrow Lock of <strong className="text-amber-400">GH₵ {totalAmount.toFixed(2)}</strong>?
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Recipient: <span className="text-slate-200 font-mono">ERRAND GHANA Escrow Vault</span> (Ref: 2PC-SAGA-LOCK)
                </div>
              </div>

              {/* PIN Input */}
              <div className="max-w-xs mx-auto">
                <label className="block text-[11px] text-slate-400 mb-1">Enter MoMo PIN to Confirm</label>
                <input
                  type="password"
                  maxLength={4}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center text-xl font-mono tracking-widest py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-400">{errorMsg}</div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizeUSSD}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                >
                  Authorize Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Processing */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-base font-bold text-slate-100">Executing 2PC Distributed Saga Lock...</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Connecting to Ghana Mobile Money Switch, securing GH₵ {totalAmount.toFixed(2)} in platform vault, and calculating cryptographic SHA-256 audit ledger hash.
            </p>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-100">Escrow Locked Successfully!</h4>
              <p className="text-xs text-slate-300 mt-1">
                GH₵ {totalAmount.toFixed(2)} is secured in the ERRAND GHANA Escrow Vault.
              </p>
              <p className="text-xs text-emerald-400 mt-0.5">
                The merchant has been notified to pack and dispatch your order.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg"
            >
              Track Order Live
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
