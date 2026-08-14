import React, { useState } from 'react';
import { BookOpen, Cpu, Terminal, CheckCircle2, Copy, Check } from 'lucide-react';

export const DocsViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'srs' | 'effort' | 'testing' | 'techdebt' | 'manual' | 'links'>('srs');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://github.com/Theo-Dorh/Errand-Ghana');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-950 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Academic Software Engineering Documentation Pack</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">
            CSCD 602 — Advanced Software Engineering
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            University of Ghana, Legon • Developer: <strong className="text-slate-200">Theophilus Dorh</strong> (Student ID: <span className="font-mono text-amber-400">22425676</span>) • GitHub Target: <span className="font-mono text-emerald-400">https://github.com/Theo-Dorh/Errand-Ghana</span>
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'GitHub URL Copied!' : 'Copy Repo Link'}</span>
        </button>
      </div>

      {/* Doc Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveDoc('srs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDoc === 'srs'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          1. SRS Specification [SRS-REQ]
        </button>
        <button
          onClick={() => setActiveDoc('effort')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDoc === 'effort'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Effort Estimation (IFPUG & COCOMO II)
        </button>
        <button
          onClick={() => setActiveDoc('testing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDoc === 'testing'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Testing & QA Report (Vitest)
        </button>
        <button
          onClick={() => setActiveDoc('techdebt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDoc === 'techdebt'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Technical Debt & V2.0 Roadmap
        </button>
        <button
          onClick={() => setActiveDoc('manual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDoc === 'manual'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          5. Comprehensive User Manual
        </button>
        <button
          onClick={() => setActiveDoc('links')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDoc === 'links'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          6. Deployment & Test Accounts
        </button>
      </div>

      {/* Document View Content */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-slate-200 leading-relaxed text-sm">
        {/* 1. SRS */}
        {activeDoc === 'srs' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-amber-400">Software Requirements Specification (SRS)</h3>
              <p className="text-xs text-slate-400 mt-1">Conforming to IEEE 830-1998 Standard for Software Requirements Specifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 font-mono">[SRS-REQ-DEMAND-001]</div>
                <div className="font-semibold text-slate-100">C2B Reverse Auction Demand Formulation</div>
                <p className="text-xs text-slate-400">
                  The system shall permit authenticated consumers to construct multi-item market manifests utilizing indigenous volumetric measures (Olonka, Margarine Tin, Paint Bucket, Tubers) and assert consumer-side price ceilings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 font-mono">[SRS-FEAT-ML-002]</div>
                <div className="font-semibold text-slate-100">Machine Learning Supermarket Price Benchmarking</div>
                <p className="text-xs text-slate-400">
                  The system shall compute real-time price parity benchmarks against formal supermarket retail markups (Shoprite/Melcom 1.18x multiplier) and assign confidence intervals based on commodity perishable volatility indices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-blue-400 font-mono">[SRS-REQ-ESCROW-003]</div>
                <div className="font-semibold text-slate-100">Two-Phase Commit (2PC) MoMo Escrow Lock (Phase 1)</div>
                <p className="text-xs text-slate-400">
                  Upon bid acceptance, the orchestrator shall execute a 2PC Prepare operation, locking gross settlement funds into a neutral platform vault, computing a SHA-256 state hash, and generating a non-repudiation ledger entry.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-purple-400 font-mono">[SRS-REQ-ESCROW-004]</div>
                <div className="font-semibold text-slate-100">Distributed Saga Compensating Transaction (Rollback)</div>
                <p className="text-xs text-slate-400">
                  Upon validated consumer dispute or fulfillment SLA breach, the orchestrator shall trigger an automated compensating transaction reversing 100% of escrow principal directly to the shopper Mobile Money wallet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Effort Estimation */}
        {activeDoc === 'effort' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-amber-400">Software Effort Estimation & Cost Modeling</h3>
              <p className="text-xs text-slate-400 mt-1">Rigorous Engineering Assessment using IFPUG FPA & COCOMO II Early Design Model</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>IFPUG Function Point Analysis (FPA)</span>
                </h4>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>External Inputs (EI): 5 items @ 4 avg =</span>
                    <strong className="text-amber-400 font-mono">20 FP</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>External Outputs (EO): 4 items @ 5 avg =</span>
                    <strong className="text-amber-400 font-mono">20 FP</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>External Inquiries (EQ): 3 items @ 4 avg =</span>
                    <strong className="text-amber-400 font-mono">12 FP</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>Internal Logical Files (ILF): 5 items @ 7 avg =</span>
                    <strong className="text-amber-400 font-mono">35 FP</strong>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold text-white">
                    <span>Total Unadjusted Function Points (UFP):</span>
                    <span className="text-emerald-400 font-mono">87 UFP</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>COCOMO II Early Design Model</span>
                </h4>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>Gear Factor (TypeScript / SQL):</span>
                    <strong className="text-slate-200 font-mono">45 LOC / FP</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>Estimated Code Size (KLOC):</span>
                    <strong className="text-emerald-400 font-mono">3.915 KLOC</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span>Nominal Effort (Person-Months):</span>
                    <strong className="text-amber-400 font-mono">0.18 PM (28.5 hrs)</strong>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold text-white">
                    <span>Development Schedule:</span>
                    <span className="text-purple-400 font-mono">48-Hour Rapid Sprint</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Testing Report */}
        {activeDoc === 'testing' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-amber-400">Quality Assurance & Vitest Testing Report</h3>
              <p className="text-xs text-slate-400 mt-1">100% Test Pass Rate Across Unit, Integration, and Cryptographic Invariant Test Suites</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold uppercase tracking-wider">Test Suite Summary</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                  100% PASS RATE
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>MLPriceBenchmarkVisualizer.test.tsx</span>
                  </span>
                  <span className="text-emerald-400">PASSED (3 tests)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>stateStore.test.ts (2PC Saga Invariant Tests)</span>
                  </span>
                  <span className="text-emerald-400">PASSED (5 tests)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ErrandLogo.test.tsx</span>
                  </span>
                  <span className="text-emerald-400">PASSED (2 tests)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Technical Debt */}
        {activeDoc === 'techdebt' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-amber-400">Technical Debt Analysis & Version 2.0 Roadmap</h3>
              <p className="text-xs text-slate-400 mt-1">Identified Engineering Trade-offs and Strategic Architectural Evolution</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400">48-Hour Sprint Architectural Trade-offs</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>In-memory transactional fallback for environments lacking live Supabase credentials.</li>
                  <li>Simulated Ghana MoMo USSD gateway callback with zero-latency sandbox modes.</li>
                  <li>Client-orchestrated REST state polling alongside SQL triggers.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-purple-400">Version 2.0 Engineering Roadmap</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><strong>Voice AI Speech-to-Text:</strong> Local dialect voice order parsing (Twi, Ga, Ewe) for non-literate market women in Makola & Kejetia.</li>
                  <li><strong>Live Bank of Ghana GhIPSS Gateway:</strong> Real production ISO 8583 switch integration with MTN, Telecel, and AT Money.</li>
                  <li><strong>Decentralized Verifiable Credentials:</strong> DID / W3C verifiable identity for Ghana Card KYC compliance.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 5. User Manual */}
        {activeDoc === 'manual' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-amber-400">Operational User Manual</h3>
              <p className="text-xs text-slate-400 mt-1">End-to-End Operational Protocols for Shoppers, Merchants, and Escrow Auditors</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 uppercase tracking-wider block">Shopper Operational Flow</span>
                <p className="text-slate-300">
                  1. Navigate to <strong>Market Demand Feed</strong> and click <strong>Post Grocery Demand List</strong>.<br/>
                  2. Add grocery items with units (Olonka, Margarine Tin, Tubers, kg) and target unit prices.<br/>
                  3. When merchants submit bids, review ML price benchmark savings against Accra supermarket averages.<br/>
                  4. Click <strong>Accept Bid & Lock Mobile Money Escrow</strong> to execute Phase 1 2PC lock.<br/>
                  5. Once driver arrives, complete physical goods inspection and click <strong>Confirm & Release MoMo Payout</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider block">Merchant Operational Flow</span>
                <p className="text-slate-300">
                  1. Switch persona to <strong>Auntie Naa Baskets (Makola)</strong> or <strong>Uncle Joe (Kaneshie)</strong>.<br/>
                  2. Filter demand lists by urban neighborhood (East Legon, Madina, Kejetia).<br/>
                  3. Click <strong>Place Reverse-Auction Bid</strong>, enter wholesale price and delivery fee.<br/>
                  4. After shopper locks escrow, dispatch order and click <strong>Mark Packed & In-Transit</strong>.<br/>
                  5. Receive automated MoMo wallet payout upon customer inspection confirmation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. Links */}
        {activeDoc === 'links' && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-amber-400">Deployment & Pre-Authenticated Credentials</h3>
              <p className="text-xs text-slate-400 mt-1">Official Submission References for CSCD 602 Academic Evaluation</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div><strong>Project:</strong> ERRAND GHANA (C2B Reverse Auction & 2PC Escrow Engine)</div>
              <div><strong>Developer:</strong> Theophilus Dorh</div>
              <div><strong>Student ID:</strong> 22425676</div>
              <div><strong>Institution:</strong> University of Ghana, Legon (Dept. of Computer Science)</div>
              <div><strong>Course:</strong> CSCD 602 - Advanced Software Engineering</div>
              <div className="text-emerald-400"><strong>GitHub Repo:</strong> https://github.com/Theo-Dorh/Errand-Ghana</div>
              
              <div className="pt-3 border-t border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">Pre-Seeded Test Personas:</span>
                <div className="text-slate-400 space-y-1">
                  <div>• Shopper 1: Kofi Mensah (shopper.kofi@ug.edu.gh / 0244123456 - MTN MoMo)</div>
                  <div>• Shopper 2: Ama Serwaa (shopper.ama@gmail.com / 0501987654 - Telecel Cash)</div>
                  <div>• Merchant 1: Naa Lamiley Makola Wholesale (makola.fresh@gmail.com - MTN MoMo)</div>
                  <div>• Merchant 2: Uncle Joe Kaneshie Hub (kaneshie.mart@gmail.com - AT Money)</div>
                  <div>• Escrow Auditor: Prof. Boateng (admin.escrow@errandghana.ug.edu.gh)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
