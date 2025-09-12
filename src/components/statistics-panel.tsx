"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatUSD, formatDigits, formatRate, formatRateUSD } from "@/lib/currency-formatter";
import { getAchievements } from "@/lib/mining-logic";
import { MiningState } from "@/hooks/use-mining";

interface StatisticsPanelProps extends Pick<MiningState, 'stats' | 'resetProgress'> {}

export function StatisticsPanel({ stats, resetProgress }: StatisticsPanelProps) {
  const achievements = getAchievements(stats);
  const miningTimeMinutes = (Date.now() - stats.miningStartTime) / 1000 / 60;
  const miningTimeHours = miningTimeMinutes / 60;

  const formatMiningTime = () => {
    if (miningTimeMinutes < 60) {
      return `${Math.floor(miningTimeMinutes)} minutes`;
    } else if (miningTimeHours < 24) {
      const hours = Math.floor(miningTimeHours);
      const minutes = Math.floor(miningTimeMinutes % 60);
      return `${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(miningTimeHours / 24);
      const hours = Math.floor(miningTimeHours % 24);
      return `${days}d ${hours}h`;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-cyan-100 flex items-center gap-2">
          📊 Statistics
        </CardTitle>
        <CardDescription className="text-cyan-300">
          Track your mining performance and achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-lg font-bold text-cyan-100">
              {formatDigits(stats.totalDigitsMined)}
            </div>
            <div className="text-xs text-cyan-400">Total Digits</div>
          </div>
          
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-lg font-bold text-cyan-100">
              {formatUSD(stats.totalEarnings)}
            </div>
            <div className="text-xs text-cyan-400">Total Earned</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <h4 className="font-semibold text-cyan-200 text-sm">Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Digits per minute:</span>
              <span className="text-cyan-300 font-mono">
                {formatRate(stats.digitsPerMinute)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Earnings per minute:</span>
              <span className="text-cyan-300 font-mono">
                {formatRateUSD(stats.earningsPerMinute)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mining time:</span>
              <span className="text-cyan-300 font-mono">
                {formatMiningTime()}
              </span>
            </div>
            {stats.totalDigitsMined > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Avg per digit:</span>
                <span className="text-cyan-300 font-mono">
                  {formatUSD(stats.totalEarnings / stats.totalDigitsMined)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-cyan-200 text-sm">Achievements</h4>
            <div className="flex flex-wrap gap-1">
              {achievements.map((achievement, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
                >
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {achievements.length === 0 && (
          <div className="text-center py-4">
            <div className="text-slate-400 text-sm">
              Keep mining to unlock achievements!
            </div>
            <div className="text-xs text-slate-500 mt-1">
              First achievement at 100 digits
            </div>
          </div>
        )}

        {/* Mining Milestones */}
        <div className="space-y-2">
          <h4 className="font-semibold text-cyan-200 text-sm">Next Milestones</h4>
          <div className="space-y-1 text-xs text-slate-400">
            {stats.totalDigitsMined < 100 && (
              <div>• {100 - stats.totalDigitsMined} digits until "First Hundred"</div>
            )}
            {stats.totalDigitsMined < 1000 && stats.totalDigitsMined >= 100 && (
              <div>• {1000 - stats.totalDigitsMined} digits until "Thousand Digits"</div>
            )}
            {stats.totalEarnings < 100 && (
              <div>• {formatUSD(100 - stats.totalEarnings)} until "$100 Milestone"</div>
            )}
            {stats.totalEarnings < 1000 && stats.totalEarnings >= 100 && (
              <div>• {formatUSD(1000 - stats.totalEarnings)} until "$1,000 Fortune"</div>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2 border-t border-cyan-700/30">
          <Button
            variant="outline"
            size="sm"
            onClick={resetProgress}
            className="w-full text-xs border-red-700/50 text-red-300 hover:bg-red-900/20"
          >
            🔄 Reset Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}