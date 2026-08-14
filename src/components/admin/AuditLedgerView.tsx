import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Hash, Copy, Check, Search } from 'lucide-react';

export const AuditLedgerView: React.FC = () => {
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
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#D4F938]" />
            <span>Digital Order Security & Audit Ledger</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable non-repudiation ledger verifying every state transition, lock, settlement, and refund.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or hash..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
          />
        </div>
      </div>

      {/* Ledger Table (Apex Style) */}
      <div className="apex-card rounded-3xl border-[#1A2F24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08120D] text-slate-400 border-b border-[#1A2F24] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">State Transition</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Security Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16281E] font-mono">
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#12221A]/50 transition-colors">
                  <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-4 font-bold text-white font-sans whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-xl bg-[#182C20] border border-[#234330] text-[#D4F938] text-[11px] font-bold">
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-sans capitalize">{entry.actor_role.replace('_', ' ')}</td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {entry.state_before ? `${entry.state_before} → ` : ''}
                    <strong className="text-[#D4F938]">{entry.state_after}</strong>
                  </td>
                  <td className="p-4 text-white font-bold">
                    {entry.amount ? `GH₵ ${entry.amount.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 truncate max-w-[140px]" title={entry.sha256_hash}>
                        {entry.sha256_hash.slice(0, 16)}...
                      </span>
                      <button
                        onClick={() => handleCopyHash(entry.sha256_hash)}
                        className="p-1 rounded hover:bg-[#16291E] text-slate-400 hover:text-white transition-colors"
                        title="Copy Signature"
                      >
                        {copiedHash === entry.sha256_hash ? (
                          <Check className="w-3.5 h-3.5 text-[#D4F938]" />
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
