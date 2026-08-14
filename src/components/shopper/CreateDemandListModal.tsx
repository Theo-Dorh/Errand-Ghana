import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, MapPin, X, Clock, Check, Sparkles } from 'lucide-react';
import { GHANA_NEIGHBORHOODS, INDIGENOUS_UNITS } from '../../types/index.ts';

interface CreateDemandListModalProps {
  onClose: () => void;
  onSubmit: (
    title: string,
    neighborhood: string,
    deliveryAddress: string,
    targetBudget: number,
    urgency: string,
    notes: string,
    items: Array<{
      name: string;
      quantity: number;
      unit: string;
      target_price: number;
      category: string;
    }>
  ) => void;
}

export const CreateDemandListModal: React.FC<CreateDemandListModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState<string>('East Legon, Accra');
  const [deliveryAddress, setDeliveryAddress] = useState('Near A&C Mall, Boundary Road');
  const [urgency, setUrgency] = useState('Standard (2-4 hrs)');
  const [notes, setNotes] = useState('Please ensure tomatoes are firm and ripe.');

  const [items, setItems] = useState<Array<{ name: string; quantity: number; unit: string; target_price: number; category: string }>>([
    { name: 'Fresh Navrongo Tomatoes', quantity: 1, unit: 'Olonka (Large Tin)', target_price: 65, category: 'Fresh Produce' },
    { name: 'Pona Yams (Medium)', quantity: 3, unit: 'Tubers', target_price: 45, category: 'Tubers' },
    { name: 'Jasmine Fragrant Rice (5kg)', quantity: 1, unit: 'Bag (5kg)', target_price: 110, category: 'Grains' },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState<string>('Olonka (Large Tin)');
  const [newItemPrice, setNewItemPrice] = useState(30);

  const totalCalculatedBudget = items.reduce((sum, item) => sum + item.target_price * item.quantity, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setItems([
      ...items,
      {
        name: newItemName.trim(),
        quantity: newItemQty,
        unit: newItemUnit,
        target_price: newItemPrice,
        category: 'Fresh Produce',
      },
    ]);

    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice(20);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const listTitle = title.trim() || `${items[0].name} & ${items.length - 1} more grocery items`;
    onSubmit(
      listTitle,
      neighborhood,
      deliveryAddress,
      totalCalculatedBudget,
      urgency,
      notes,
      items
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E1A14] border border-[#1A2F24] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A2F24] bg-[#08120D]/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#16291E] text-[#D4F938] border border-[#234330] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Create New Grocery Shopping List</h3>
              <p className="text-xs text-slate-400">Tell local stores what you need and set your target price</p>
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
          {/* Grocery List Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              List Name / Occasion (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Family Market Run, Jollof Ingredients"
              className="w-full px-4 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
            />
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Delivery Neighborhood</span>
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white focus:outline-none focus:border-[#D4F938]"
              >
                {GHANA_NEIGHBORHOODS.map((nh: string) => (
                  <option key={nh} value={nh} className="bg-[#0E1A14] text-white">
                    {nh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Delivery Time Preference</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white focus:outline-none focus:border-[#D4F938]"
              >
                <option value="Urgent (< 1 hr)" className="bg-[#0E1A14] text-white">⚡ Express / Urgent (&lt; 1 hr)</option>
                <option value="Standard (2-4 hrs)" className="bg-[#0E1A14] text-white">Standard (2 - 4 hrs)</option>
                <option value="Flexible (Same Day)" className="bg-[#0E1A14] text-white">Flexible (Same Day)</option>
              </select>
            </div>
          </div>

          {/* Delivery Street Address & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Specific Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Near A&C Mall, Boundary Road"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Produce / Quality Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please ensure tomatoes are firm and ripe."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
              />
            </div>
          </div>

          {/* Add Item Builder */}
          <div className="p-4 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Add Item to List</span>
              </span>
              <span className="text-[10px] text-slate-400">Supports Olonka, Margarine Tin, Tubers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name (e.g. Fresh Garden Eggs)"
                className="sm:col-span-5 px-3 py-2 rounded-xl bg-[#0E1A14] border border-[#1A2F24] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
              />

              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#0E1A14] border border-[#1A2F24] text-xs text-white text-center font-mono focus:outline-none focus:border-[#D4F938]"
                placeholder="Qty"
              />

              <select
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="sm:col-span-3 px-2 py-2 rounded-xl bg-[#0E1A14] border border-[#1A2F24] text-xs text-white focus:outline-none focus:border-[#D4F938]"
              >
                {INDIGENOUS_UNITS.map((u: string) => (
                  <option key={u} value={u} className="bg-[#0E1A14] text-white">
                    {u}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddItem}
                className="sm:col-span-2 flex items-center justify-center gap-1 px-3 py-2 rounded-xl btn-apex text-xs font-black shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Manifest Items List */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Items in Your Basket ({items.length})
            </span>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#08120D] border border-[#16281E] text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.quantity} × {item.unit} (Target: GH₵ {item.target_price.toFixed(2)})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#D4F938]">
                      GH₵ {(item.target_price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#16281E] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Summary & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#1A2F24]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Estimated Budget
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                GH₵ {totalCalculatedBudget.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-slate-300 text-xs font-bold hover:bg-[#12221A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15"
              >
                <Check className="w-4 h-4" />
                <span>Post List to Stores</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
