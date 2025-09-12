"use client";

import { MiningInterface } from "@/components/mining-interface";
import { EarningsDisplay } from "@/components/earnings-display";
import { UpgradePanel } from "@/components/upgrade-panel";
import { StatisticsPanel } from "@/components/statistics-panel";
import { useMining } from "@/hooks/use-mining";

export default function Home() {
  const miningState = useMining();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            ⛏️ Mining Earnings
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Click to mine digits and earn US Dollars! Every digit counts towards your mining fortune.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Mining Interface */}
          <div className="lg:col-span-2 space-y-6">
            <EarningsDisplay {...miningState} />
            <MiningInterface {...miningState} />
          </div>

          {/* Right Panel - Upgrades and Stats */}
          <div className="space-y-6">
            <UpgradePanel {...miningState} />
            <StatisticsPanel {...miningState} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p>Start mining now and watch your US Dollar earnings grow!</p>
        </div>
      </div>
    </main>
  );
}