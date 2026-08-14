import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Hash, Copy, Check, Search } from 'lucide-react';

export const AuditLedgerView: React.FC = () => {
  const { theme } = useTheme();
  const { auditLedger } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLedger = auditLedger.filter((entry) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      entry.action.toLowerCase().includes(term) ||
      entry.sha256_hash.toLowerCase().includes(term) ||
      (entry.order_id && entry.order_id.toLowerCase().includes(term)) ||
      entry.actor_role.toLowerCase().includes(term)
    );
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className={`text-base font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Hash className={`w-5 h-5 ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`} />
            <span>Digital Order Security & Audit Ledger</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable non-repudiation ledger verifying every state transition, lock, settlement, and refund.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or hash..."
            className={`w-full pl-9 pr-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
              theme === 'dark'
                ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500 focus:border-[#D4F938]'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
            }`}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="apex-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-bold text-[11px] ${
              theme === 'dark' ? 'bg-[#08120D] text-slate-400 border-[#1A2F24]' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">State transition</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Security signature</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono ${
              theme === 'dark' ? 'divide-[#16281E]' : 'divide-slate-200'
            }`}>
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className={`transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#12221A]/50' : 'hover:bg-slate-50'
                }`}>
                  <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className={`p-4 font-bold font-sans whitespace-nowrap ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                      theme === 'dark'
                        ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className={`p-4 font-sans capitalize ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>{entry.actor_role.replace('_', ' ')}</td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {entry.state_before ? `${entry.state_before} → ` : ''}
                    <strong className={theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}>{entry.state_after}</strong>
                  </td>
                  <td className={`p-4 font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {entry.amount ? `GH₵ ${entry.amount.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={entry.sha256_hash}>
                        {entry.sha256_hash.slice(0, 16)}...
                      </span>
                      <button
                        onClick={() => handleCopyHash(entry.sha256_hash)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-[#16291E] text-slate-400 hover:text-white'
                            : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                        }`}
                        title="Copy Signature"
                      >
                        {copiedHash === entry.sha256_hash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
