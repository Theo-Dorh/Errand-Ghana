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
      setErrorMsg('Please enter your 4-digit MoMo PIN to authorize payment');
      return;
    }

    try {
      setStep('processing');
      setErrorMsg('');

      // Simulate network latency for Ghana MoMo gateway
      await new Promise((resolve) => setTimeout(resolve, 800));

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ghana Mobile Money Checkout</h3>
              <p className="text-xs text-slate-500">Funds are held safely in platform escrow until delivery</p>
            </div>
          </div>

          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Details & Provider Select */}
        {step === 'details' && (
          <form onSubmit={handleProceedToUSSD} className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Escrow Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-900">100% Shopper Protection Guarantee</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  Funds are <strong className="text-slate-900">NOT</strong> paid to the merchant yet. They are locked in the platform vault until you physically inspect your groceries.
                </div>
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Mobile Money Network</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('MTN_MOMO')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    provider === 'MTN_MOMO'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">MTN MoMo</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">*170#</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('TELECEL_CASH')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    provider === 'TELECEL_CASH'
                      ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">Telecel Cash</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">*110#</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('AT_MONEY')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    provider === 'AT_MONEY'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">AT Money</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">*110#</div>
                </button>
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Money Phone Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-semibold">+233 (0)</span>
                <input
                  type="tel"
                  required
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="24 412 3456"
                  className="w-full pl-28 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Grocery Items Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold">GH₵ {offer.offered_total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Delivery Fee</span>
                <span className="font-mono text-slate-900 font-semibold">GH₵ {offer.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Escrow Deposit (To Lock)</span>
                <span className="font-mono text-emerald-800">GH₵ {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/10 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Prompt Phone for MoMo USSD Authorization</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Simulated Ghana MoMo USSD Prompt */}
        {step === 'ussd_prompt' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">{provider} USSD GATEWAY</div>
                <div className="text-sm font-semibold text-white mt-1">
                  Authorize Escrow Lock of <strong className="text-amber-400 font-mono">GH₵ {totalAmount.toFixed(2)}</strong>?
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Recipient: <span className="text-slate-200 font-mono">ERRAND GHANA Escrow</span>
                </div>
              </div>

              {/* PIN Input */}
              <div className="max-w-xs mx-auto">
                <label className="block text-[11px] text-slate-400 mb-1">Enter 4-Digit MoMo PIN to Confirm</label>
                <input
                  type="password"
                  maxLength={4}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center text-2xl font-mono tracking-widest py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-400">{errorMsg}</div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Back
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
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Securing Mobile Money Escrow...</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connecting to Ghana Mobile Money network, locking GH₵ {totalAmount.toFixed(2)} in platform vault, and dispatching merchant notification.
            </p>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900">Escrow Locked Successfully!</h4>
              <p className="text-xs text-slate-600 mt-1">
                GH₵ {totalAmount.toFixed(2)} is held in the Errand Ghana Escrow Vault.
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                The store merchant has been notified to pack and dispatch your groceries.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-md"
            >
              Track Order Live
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
