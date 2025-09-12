"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface MiningUpgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentCost: number;
  level: number;
  maxLevel: number;
  effect: number;
  type: "multiplier" | "speed" | "auto";
}

export interface MiningStats {
  totalDigitsMined: number;
  totalEarnings: number;
  digitsPerMinute: number;
  earningsPerMinute: number;
  miningStartTime: number;
  achievements: string[];
}

export interface MiningState {
  currentEarnings: number;
  digitsMined: number;
  baseEarningPerDigit: number;
  miningMultiplier: number;
  autoMiningSpeed: number;
  isAutoMining: boolean;
  upgrades: MiningUpgrade[];
  stats: MiningStats;
  mineDigit: () => void;
  purchaseUpgrade: (upgradeId: string) => void;
  toggleAutoMining: () => void;
  resetProgress: () => void;
}

const initialUpgrades: MiningUpgrade[] = [
  {
    id: "pickaxe",
    name: "Better Pickaxe",
    description: "Increases earnings per digit",
    baseCost: 50,
    currentCost: 50,
    level: 0,
    maxLevel: 10,
    effect: 0.05,
    type: "multiplier"
  },
  {
    id: "mining_speed",
    name: "Mining Speed",
    description: "Click faster for more digits",
    baseCost: 100,
    currentCost: 100,
    level: 0,
    maxLevel: 15,
    effect: 1.2,
    type: "speed"
  },
  {
    id: "auto_miner",
    name: "Auto Miner",
    description: "Automatically mines digits",
    baseCost: 500,
    currentCost: 500,
    level: 0,
    maxLevel: 20,
    effect: 1,
    type: "auto"
  }
];

export function useMining(): MiningState {
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [digitsMined, setDigitsMined] = useState(0);
  const [upgrades, setUpgrades] = useState<MiningUpgrade[]>(initialUpgrades);
  const [isAutoMining, setIsAutoMining] = useState(false);
  const [stats, setStats] = useState<MiningStats>({
    totalDigitsMined: 0,
    totalEarnings: 0,
    digitsPerMinute: 0,
    earningsPerMinute: 0,
    miningStartTime: Date.now(),
    achievements: []
  });

  const autoMiningInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Base earning per digit in USD
  const baseEarningPerDigit = 0.10;

  // Calculate mining multiplier from upgrades
  const miningMultiplier = upgrades.reduce((acc, upgrade) => {
    if (upgrade.type === "multiplier") {
      return acc + (upgrade.level * upgrade.effect);
    }
    return acc;
  }, 1);

  // Calculate auto mining speed
  const autoMiningSpeed = upgrades.reduce((acc, upgrade) => {
    if (upgrade.type === "auto") {
      return acc + upgrade.level;
    }
    return acc;
  }, 0);

  // Mine a single digit
  const mineDigit = useCallback(() => {
    const earnings = baseEarningPerDigit * miningMultiplier;
    setCurrentEarnings(prev => prev + earnings);
    setDigitsMined(prev => prev + 1);
    setStats(prev => ({
      ...prev,
      totalDigitsMined: prev.totalDigitsMined + 1,
      totalEarnings: prev.totalEarnings + earnings
    }));
  }, [baseEarningPerDigit, miningMultiplier]);

  // Purchase upgrade
  const purchaseUpgrade = useCallback((upgradeId: string) => {
    setUpgrades(prev => prev.map(upgrade => {
      if (upgrade.id === upgradeId && 
          currentEarnings >= upgrade.currentCost && 
          upgrade.level < upgrade.maxLevel) {
        
        setCurrentEarnings(current => current - upgrade.currentCost);
        
        return {
          ...upgrade,
          level: upgrade.level + 1,
          currentCost: Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level + 1))
        };
      }
      return upgrade;
    }));
  }, [currentEarnings]);

  // Toggle auto mining
  const toggleAutoMining = useCallback(() => {
    setIsAutoMining(prev => !prev);
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setCurrentEarnings(0);
    setDigitsMined(0);
    setUpgrades(initialUpgrades);
    setIsAutoMining(false);
    setStats({
      totalDigitsMined: 0,
      totalEarnings: 0,
      digitsPerMinute: 0,
      earningsPerMinute: 0,
      miningStartTime: Date.now(),
      achievements: []
    });
  }, []);

  // Auto mining effect
  useEffect(() => {
    if (isAutoMining && autoMiningSpeed > 0) {
      const interval = Math.max(100, 1000 - (autoMiningSpeed * 40)); // Faster with more levels
      autoMiningInterval.current = setInterval(mineDigit, interval);
    } else {
      if (autoMiningInterval.current) {
        clearInterval(autoMiningInterval.current);
      }
    }

    return () => {
      if (autoMiningInterval.current) {
        clearInterval(autoMiningInterval.current);
      }
    };
  }, [isAutoMining, autoMiningSpeed, mineDigit]);

  // Stats update effect
  useEffect(() => {
    statsUpdateInterval.current = setInterval(() => {
      const timeElapsed = (Date.now() - stats.miningStartTime) / 1000 / 60; // minutes
      if (timeElapsed > 0) {
        setStats(prev => ({
          ...prev,
          digitsPerMinute: prev.totalDigitsMined / timeElapsed,
          earningsPerMinute: prev.totalEarnings / timeElapsed
        }));
      }
    }, 1000);

    return () => {
      if (statsUpdateInterval.current) {
        clearInterval(statsUpdateInterval.current);
      }
    };
  }, [stats.miningStartTime]);

  return {
    currentEarnings,
    digitsMined,
    baseEarningPerDigit,
    miningMultiplier,
    autoMiningSpeed,
    isAutoMining,
    upgrades,
    stats,
    mineDigit,
    purchaseUpgrade,
    toggleAutoMining,
    resetProgress
  };
}