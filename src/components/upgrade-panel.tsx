"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatUSD } from "@/lib/currency-formatter";
import { calculateUpgradeEffectiveness } from "@/lib/mining-logic";
import { MiningState } from "@/hooks/use-mining";

interface UpgradePanelProps extends Pick<MiningState, 'currentEarnings' | 'upgrades' | 'purchaseUpgrade'> {}

export function UpgradePanel({ currentEarnings, upgrades, purchaseUpgrade }: UpgradePanelProps) {
  const getUpgradeIcon = (type: string) => {
    switch (type) {
      case "multiplier": return "⚡";
      case "speed": return "🏃";
      case "auto": return "🤖";
      default: return "📈";
    }
  };

  const getUpgradeTypeLabel = (type: string) => {
    switch (type) {
      case "multiplier": return "Earnings";
      case "speed": return "Speed";
      case "auto": return "Automation";
      default: return "Upgrade";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border-indigo-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-indigo-100 flex items-center gap-2">
          🛠️ Upgrades
        </CardTitle>
        <CardDescription className="text-indigo-300">
          Invest your earnings to boost mining efficiency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upgrades.map(upgrade => {
          const effectiveness = calculateUpgradeEffectiveness(
            upgrade.currentCost,
            currentEarnings,
            upgrade.effect
          );
          
          const progressPercentage = (upgrade.level / upgrade.maxLevel) * 100;
          const isMaxed = upgrade.level >= upgrade.maxLevel;

          return (
            <Card key={upgrade.id} className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getUpgradeIcon(upgrade.type)}</span>
                      <div>
                        <h4 className="font-semibold text-slate-200">{upgrade.name}</h4>
                        <p className="text-sm text-slate-400">{upgrade.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getUpgradeTypeLabel(upgrade.type)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Level {upgrade.level}/{upgrade.maxLevel}</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Cost and Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {isMaxed ? (
                        <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                          MAX LEVEL
                        </Badge>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-slate-300">
                            Cost: <span className="font-semibold">{formatUSD(upgrade.currentCost)}</span>
                          </div>
                          {upgrade.type === "multiplier" && (
                            <div className="text-xs text-slate-400">
                              +{(upgrade.effect * 100).toFixed(0)}% earnings per digit
                            </div>
                          )}
                          {upgrade.type === "speed" && (
                            <div className="text-xs text-slate-400">
                              +{((upgrade.effect - 1) * 100).toFixed(0)}% click effectiveness
                            </div>
                          )}
                          {upgrade.type === "auto" && (
                            <div className="text-xs text-slate-400">
                              +{upgrade.effect} auto mining speed
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => purchaseUpgrade(upgrade.id)}
                      disabled={!effectiveness.canAfford || isMaxed}
                      className={`
                        ${effectiveness.worthiness === 'excellent' ? 'bg-green-700 hover:bg-green-600' : ''}
                        ${effectiveness.worthiness === 'good' ? 'bg-blue-700 hover:bg-blue-600' : ''}
                        ${effectiveness.worthiness === 'poor' ? 'bg-slate-700 hover:bg-slate-600' : ''}
                        ${isMaxed ? 'bg-slate-600 cursor-not-allowed' : ''}
                      `}
                    >
                      {isMaxed ? 'MAXED' : effectiveness.canAfford ? 'BUY' : 'NEED MORE'}
                    </Button>
                  </div>

                  {/* Effectiveness Indicator */}
                  {!isMaxed && effectiveness.canAfford && (
                    <div className="text-xs text-center">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${effectiveness.worthiness === 'excellent' ? 'border-green-500 text-green-300' : ''}
                          ${effectiveness.worthiness === 'good' ? 'border-blue-500 text-blue-300' : ''}
                          ${effectiveness.worthiness === 'poor' ? 'border-slate-500 text-slate-400' : ''}
                        `}
                      >
                        {effectiveness.worthiness === 'excellent' && '🌟 Excellent Investment'}
                        {effectiveness.worthiness === 'good' && '👍 Good Investment'}
                        {effectiveness.worthiness === 'poor' && '⚠️ Consider Carefully'}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}