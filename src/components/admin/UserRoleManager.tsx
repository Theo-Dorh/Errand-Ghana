import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole, MoMoProvider } from '../../types/index.ts';
import { Users, UserPlus, Shield, ShoppingBag, Store, Trash2, CheckCircle2 } from 'lucide-react';

export const UserRoleManager: React.FC = () => {
  const { users, adminCreateUser, updateUserRole, deleteUser, currentUser } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('shopper');
  const [storeName, setStoreName] = useState('');
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [momoProvider, setMomoProvider] = useState<MoMoProvider>('MTN_MOMO');
  const [neighborhood, setNeighborhood] = useState('East Legon, Accra');
  const [statusMsg, setStatusMsg] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    adminCreateUser({
      full_name: fullName,
      email,
      role,
      momo_number: momoNumber,
      momo_provider: momoProvider,
      neighborhood,
      store_name: role === 'store' ? storeName || `${fullName} Mart` : undefined,
      is_approved: true,
    });

    setStatusMsg(`User "${fullName}" created successfully with role ${role.toUpperCase()}!`);
    setShowCreateModal(false);
    setFullName('');
    setEmail('');
    setStoreName('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D4F938]" />
            <span>User & Role Governance Console</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Create new platform accounts, assign roles (Shopper, Store, Admin), and manage permissions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 shrink-0 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User & Role</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-[#182C20] border border-[#234330] text-[#D4F938] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4F938] shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Users Table (Apex Style) */}
      <div className="apex-card rounded-3xl overflow-hidden border-[#1A2F24]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08120D] text-slate-400 border-b border-[#1A2F24] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Contact & Location</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Change Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16281E]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#12221A]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        u.role === 'shopper'
                          ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                          : u.role === 'store'
                          ? 'bg-[#251D10] text-[#F59E0B] border-[#40311B]'
                          : 'bg-[#20152B] text-[#C084FC] border-[#3B2252]'
                      }`}>
                        {u.role === 'shopper' && <ShoppingBag className="w-4 h-4" />}
                        {u.role === 'store' && <Store className="w-4 h-4" />}
                        {u.role === 'admin' && <Shield className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{u.full_name}</span>
                          {u.id === currentUser.id && (
                            <span className="px-2 py-0.5 rounded-full bg-[#182C20] text-[#D4F938] text-[10px] font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                        {u.store_name && (
                          <div className="text-[11px] text-[#F59E0B] font-medium">{u.store_name}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300">
                    <div>{u.neighborhood}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{u.momo_provider} ({u.momo_number})</div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'shopper'
                        ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                        : u.role === 'store'
                        ? 'bg-[#251D10] text-[#F59E0B] border border-[#40311B]'
                        : 'bg-[#20152B] text-[#C084FC] border border-[#3B2252]'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white font-medium focus:outline-none focus:border-[#D4F938] cursor-pointer"
                    >
                      <option value="shopper" className="bg-[#0E1A14] text-white">Shopper</option>
                      <option value="store" className="bg-[#0E1A14] text-white">Store / Merchant</option>
                      <option value="admin" className="bg-[#0E1A14] text-white">Admin</option>
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User & Role */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E1A14] border border-[#1A2F24] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1A2F24]">
              <div className="w-11 h-11 rounded-2xl bg-[#16291E] text-[#D4F938] border border-[#234330] flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Create New Platform User</h4>
                <p className="text-xs text-slate-400">Provision a new account with custom role permissions</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Assign Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('shopper')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'shopper'
                        ? 'bg-[#182C20] text-[#D4F938] border-[#D4F938]'
                        : 'bg-[#08120D] border-[#16281E] text-slate-400'
                    }`}
                  >
                    Shopper
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('store')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'store'
                        ? 'bg-[#251D10] text-[#F59E0B] border-[#F59E0B]'
                        : 'bg-[#08120D] border-[#16281E] text-slate-400'
                    }`}
                  >
                    Store / Merchant
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'admin'
                        ? 'bg-[#20152B] text-[#C084FC] border-[#C084FC]'
                        : 'bg-[#08120D] border-[#16281E] text-slate-400'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Osei"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samuel@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>
              </div>

              {role === 'store' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Store / Business Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Osei Wholesale Cereals"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">MoMo Network</label>
                  <select
                    value={momoProvider}
                    onChange={(e) => setMomoProvider(e.target.value as MoMoProvider)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white focus:outline-none focus:border-[#D4F938]"
                  >
                    <option value="MTN_MOMO" className="bg-[#0E1A14] text-white">MTN MoMo (*170#)</option>
                    <option value="TELECEL_CASH" className="bg-[#0E1A14] text-white">Telecel Cash (*110#)</option>
                    <option value="AT_MONEY" className="bg-[#0E1A14] text-white">AT Money (*110#)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">MoMo Number</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="0244123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Neighborhood / Location</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Madina Market, Accra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1A2F24]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#08120D] text-slate-300 text-xs font-bold hover:bg-[#12221A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
