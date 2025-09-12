"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatUSD, formatUSDCompact, formatDigits } from "@/lib/currency-formatter";
import { MiningState } from "@/hooks/use-mining";
import { useEffect, useState } from "react";

interface EarningsDisplayProps extends Pick<MiningState, 'currentEarnings' | 'digitsMined' | 'baseEarningPerDigit' | 'miningMultiplier'> {}

export function EarningsDisplay({ 
  currentEarnings, 
  digitsMined, 
  baseEarningPerDigit, 
  miningMultiplier 
}: EarningsDisplayProps) {
  const [animatedEarnings, setAnimatedEarnings] = useState(currentEarnings);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate earnings changes
  useEffect(() => {
    if (currentEarnings !== animatedEarnings) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setAnimatedEarnings(currentEarnings);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentEarnings, animatedEarnings]);

  const earningsPerDigit = baseEarningPerDigit * miningMultiplier;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Earnings */}
      <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-emerald-300 uppercase tracking-wide">
              Total Earnings
            </h3>
            <div className={`text-3xl md:text-4xl font-bold text-emerald-100 transition-all duration-150 ${
              isAnimating ? 'scale-110 text-emerald-200' : 'scale-100'
            }`}>
              {formatUSDCompact(animatedEarnings)}
            </div>
            <div className="text-sm text-emerald-400">
              {formatUSD(animatedEarnings)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digits Mined */}
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide">
              Digits Mined
            </h3>
            <div className="text-3xl md:text-4xl font-bold text-blue-100">
              {formatDigits(digitsMined)}
            </div>
            <div className="text-sm text-blue-400">
              Total collected
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Per Digit */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wide">
              Per Digit
            </h3>
            <div className="text-3xl md:text-4xl font-bold text-purple-100">
              {formatUSD(earningsPerDigit)}
            </div>
            <div className="text-sm text-purple-400">
              {miningMultiplier > 1 ? `${miningMultiplier.toFixed(1)}x multiplier` : 'Base rate'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}