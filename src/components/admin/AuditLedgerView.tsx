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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-400" />
            <span>Cryptographic SHA-256 Audit Trail (Chain of Custody)</span>
          </h4>
          <p className="text-xs text-slate-400">
            Append-only non-repudiation ledger verifying every 2PC state transition, lock, settlement, and refund.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or hash..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Actor Role</th>
                <th className="p-3.5">State Transition</th>
                <th className="p-3.5">Amount (GH₵)</th>
                <th className="p-3.5">SHA-256 Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3.5 font-bold text-slate-200 font-sans whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300 text-[11px]">
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-sans capitalize">{entry.actor_role.replace('_', ' ')}</td>
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">
                    {entry.state_before ? `${entry.state_before} → ` : ''}
                    <strong className="text-emerald-400">{entry.state_after}</strong>
                  </td>
                  <td className="p-3.5 text-amber-400 font-bold">
                    {entry.amount ? `GH₵ ${entry.amount.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={entry.sha256_hash}>
                        {entry.sha256_hash.slice(0, 16)}...
                      </span>
                      <button
                        onClick={() => handleCopyHash(entry.sha256_hash)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-colors"
                        title="Copy SHA-256 Hash"
                      >
                        {copiedHash === entry.sha256_hash ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
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
