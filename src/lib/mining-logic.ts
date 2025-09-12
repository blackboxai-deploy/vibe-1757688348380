/**
 * Mining logic calculations and utilities
 */

export interface MiningCalculation {
  earningsPerDigit: number;
  digitsPerSecond: number;
  earningsPerSecond: number;
  efficiency: number;
}

export function calculateMiningEfficiency(
  baseEarning: number,
  multiplier: number,
  autoSpeed: number
): MiningCalculation {
  const earningsPerDigit = baseEarning * multiplier;
  const digitsPerSecond = autoSpeed / 1000; // Convert milliseconds to seconds
  const earningsPerSecond = earningsPerDigit * digitsPerSecond;
  const efficiency = multiplier * (autoSpeed > 0 ? autoSpeed : 1);

  return {
    earningsPerDigit,
    digitsPerSecond,
    earningsPerSecond,
    efficiency
  };
}

export function getAchievements(stats: {
  totalDigitsMined: number;
  totalEarnings: number;
  earningsPerMinute: number;
}): string[] {
  const achievements: string[] = [];

  // Digit-based achievements
  if (stats.totalDigitsMined >= 100) achievements.push("First Hundred");
  if (stats.totalDigitsMined >= 1000) achievements.push("Thousand Digits");
  if (stats.totalDigitsMined >= 10000) achievements.push("Ten Thousand Club");
  if (stats.totalDigitsMined >= 100000) achievements.push("Mining Master");

  // Earnings-based achievements
  if (stats.totalEarnings >= 100) achievements.push("$100 Milestone");
  if (stats.totalEarnings >= 1000) achievements.push("$1,000 Fortune");
  if (stats.totalEarnings >= 10000) achievements.push("$10,000 Tycoon");
  if (stats.totalEarnings >= 100000) achievements.push("$100,000 Mogul");

  // Rate-based achievements
  if (stats.earningsPerMinute >= 10) achievements.push("$10/min Producer");
  if (stats.earningsPerMinute >= 100) achievements.push("$100/min Earner");
  if (stats.earningsPerMinute >= 1000) achievements.push("$1,000/min Machine");

  return achievements;
}

export function calculateUpgradeCost(baseCost: number, currentLevel: number): number {
  return Math.floor(baseCost * Math.pow(1.5, currentLevel));
}

export function calculateUpgradeEffectiveness(
  cost: number,
  currentEarnings: number,
  effect: number
): {
  canAfford: boolean;
  paybackTime: number; // in minutes
  worthiness: 'excellent' | 'good' | 'poor' | 'unaffordable';
} {
  const canAfford = currentEarnings >= cost;
  
  if (!canAfford) {
    return {
      canAfford: false,
      paybackTime: Infinity,
      worthiness: 'unaffordable'
    };
  }

  const paybackTime = cost / (effect * 60); // Rough calculation in minutes
  
  let worthiness: 'excellent' | 'good' | 'poor' = 'poor';
  if (paybackTime <= 5) worthiness = 'excellent';
  else if (paybackTime <= 15) worthiness = 'good';

  return {
    canAfford,
    paybackTime,
    worthiness
  };
}