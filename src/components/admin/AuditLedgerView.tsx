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
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-700" />
            <span>Cryptographic SHA-256 Audit Trail</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
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
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-600 shadow-sm"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="app-card rounded-3xl border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">State Transition</th>
                <th className="p-4">Amount</th>
                <th className="p-4">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-4 font-bold text-slate-900 font-sans whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-purple-900 text-[11px] font-bold">
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 font-sans capitalize">{entry.actor_role.replace('_', ' ')}</td>
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {entry.state_before ? `${entry.state_before} → ` : ''}
                    <strong className="text-emerald-700">{entry.state_after}</strong>
                  </td>
                  <td className="p-4 text-slate-900 font-bold">
                    {entry.amount ? `GH₵ ${entry.amount.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={entry.sha256_hash}>
                        {entry.sha256_hash.slice(0, 16)}...
                      </span>
                      <button
                        onClick={() => handleCopyHash(entry.sha256_hash)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy SHA-256 Hash"
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
