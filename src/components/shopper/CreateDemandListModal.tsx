import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, X, Sparkles, MapPin, Clock } from 'lucide-react';

interface DemandItemInput {
  name: string;
  quantity: number;
  unit: string;
  target_price: number;
  category: string;
}

interface CreateDemandListModalProps {
  onClose: () => void;
  onSubmit: (
    title: string,
    neighborhood: string,
    deliveryAddress: string,
    totalBudget: number,
    urgency: string,
    notes: string,
    items: DemandItemInput[]
  ) => Promise<{ success: boolean; message?: string }>;
}

const GHANA_UNITS = [
  'Olonka',
  'Margarine Tin',
  'Paint Bucket',
  'Bag (5kg)',
  'Bag (25kg)',
  'Bag (50kg)',
  'Tubers',
  'Bunch',
  'Crate',
  'Kg',
  'Liter',
  'Pieces',
];

const CATEGORIES = [
  'Fresh Produce',
  'Grains & Cereals',
  'Tubers',
  'Meat & Fish',
  'Oils & Spices',
  'Snacks & Provisions',
];

const ACCRA_NEIGHBORHOODS = [
  'East Legon',
  'Madina',
  'Makola Market',
  'Kaneshie',
  'Osu',
  'Cantonments',
  'Spintex',
  'Circle (Kwame Nkrumah)',
  'Tema Community 1',
  'Kumasi Central (Kejetia)',
  'KNUST Campus',
  'Adum, Kumasi',
];

export const CreateDemandListModal: React.FC<CreateDemandListModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('East Legon');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [urgency, setUrgency] = useState('Standard (2-4 hrs)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [items, setItems] = useState<DemandItemInput[]>([
    { name: 'Fresh Navrongo Firm Tomatoes', quantity: 1, unit: 'Olonka', target_price: 75.0, category: 'Fresh Produce' },
    { name: 'Ghana Royal Jasmine Rice (5kg)', quantity: 1, unit: 'Bag (5kg)', target_price: 145.0, category: 'Grains & Cereals' },
  ]);

  const totalCalculatedBudget = items.reduce((sum, i) => sum + (Number(i.target_price) || 0) * (Number(i.quantity) || 0), 0);
  const estimatedSupermarketBaseline = Math.round(totalCalculatedBudget * 1.18 * 100) / 100;
  const estimatedSavings = Math.round((estimatedSupermarketBaseline - totalCalculatedBudget) * 100) / 100;

  const addItemRow = () => {
    setItems([
      ...items,
      { name: '', quantity: 1, unit: 'kg', target_price: 30.0, category: 'Fresh Produce' },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  const updateItemRow = (index: number, field: keyof DemandItemInput, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please specify a title for your demand list');
      return;
    }
    if (!items.every((i) => i.name.trim() && i.quantity > 0 && i.target_price > 0)) {
      setErrorMsg('Please ensure all grocery items have names, quantities, and realistic target prices');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const res = await onSubmit(
        title,
        neighborhood,
        deliveryAddress || `${neighborhood}, Accra, Ghana`,
        totalCalculatedBudget,
        urgency,
        notes,
        items
      );
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to publish demand list');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Post Grocery Demand Basket</h3>
              <p className="text-xs text-slate-500">Specify what you need and let wholesale merchants bid at your target price</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          {/* List Title & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Demand Basket Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekend Jollof & Fresh Soup Basket"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Target Neighborhood / Market Hub *
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none cursor-pointer"
              >
                {ACCRA_NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Address & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Address / Landmark</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Near Shell Station, Boundary Road"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Fulfillment Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Express (1-2 hrs)">Express (1-2 hrs)</option>
                <option value="Standard (2-4 hrs)">Standard (2-4 hrs)</option>
                <option value="Flexible (Today)">Flexible (Today)</option>
                <option value="Weekend Bulk Batch">Weekend Bulk Batch</option>
              </select>
            </div>
          </div>

          {/* Itemized Items Manifest */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Itemized Grocery Breakdown
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  {/* Name */}
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) => updateItemRow(idx, 'name', e.target.value)}
                      placeholder="e.g. Techiman Pona Yam"
                      className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-16">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      required
                      value={item.quantity}
                      onChange={(e) => updateItemRow(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white px-2 py-1.5 rounded-xl border border-slate-200 text-center text-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* Unit */}
                  <div className="w-28">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItemRow(idx, 'unit', e.target.value)}
                      className="w-full bg-white px-2 py-1.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {GHANA_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Unit Price */}
                  <div className="w-24">
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-slate-400 text-[10px]">GH₵</span>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        value={item.target_price}
                        onChange={(e) => updateItemRow(idx, 'target_price', parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        className="w-full bg-white pl-7 pr-2 py-1.5 rounded-xl border border-slate-200 text-right text-slate-900 font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="w-32 hidden sm:block">
                    <select
                      value={item.category}
                      onChange={(e) => updateItemRow(idx, 'category', e.target.value)}
                      className="w-full bg-white px-2 py-1.5 rounded-xl border border-slate-200 text-slate-700 focus:outline-none text-[11px]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delete Row */}
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-900">Estimated Supermarket Benchmark</div>
                <div className="text-slate-600 mt-0.5">
                  Retail Average: <span className="line-through text-slate-500 font-mono">GH₵ {estimatedSupermarketBaseline.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-500">Your Target Budget</div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                GH₵ {totalCalculatedBudget.toFixed(2)}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold">
                Projected Savings: ~GH₵ {estimatedSavings.toFixed(2)} (18% vs retail)
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Special Merchant Instructions (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ensure tomatoes are hard and firm. Yams should be white Pona."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || totalCalculatedBudget <= 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Demand to Stores'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
