"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MiningState } from "@/hooks/use-mining";
import { useState, useEffect } from "react";

interface MiningInterfaceProps extends Pick<MiningState, 'mineDigit' | 'isAutoMining' | 'toggleAutoMining' | 'autoMiningSpeed'> {}

export function MiningInterface({ 
  mineDigit, 
  isAutoMining, 
  toggleAutoMining, 
  autoMiningSpeed 
}: MiningInterfaceProps) {
  const [clickAnimation, setClickAnimation] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Handle mining click with animations
  const handleMiningClick = () => {
    mineDigit();
    setClickAnimation(true);
    
    // Add particle effect
    const newParticle = {
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    setParticleEffects(prev => [...prev, newParticle]);
    
    // Remove animation after duration
    setTimeout(() => setClickAnimation(false), 200);
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  // Auto mining progress animation
  useEffect(() => {
    if (isAutoMining && autoMiningSpeed > 0) {
      const interval = Math.max(100, 1000 - (autoMiningSpeed * 40));
      const progressInterval = setInterval(() => {
        setMiningProgress(prev => (prev + 2) % 100);
      }, interval / 50);

      return () => clearInterval(progressInterval);
    } else {
      setMiningProgress(0);
    }
    return undefined;
  }, [isAutoMining, autoMiningSpeed]);

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Mining Button */}
          <div className="relative">
            <Button
              size="lg"
              onClick={handleMiningClick}
              disabled={isAutoMining}
              className={`
                h-32 w-32 md:h-40 md:w-40 rounded-full text-2xl font-bold
                bg-gradient-to-br from-amber-500 to-amber-600 
                hover:from-amber-400 hover:to-amber-500
                border-4 border-amber-400/50
                shadow-lg hover:shadow-xl
                transition-all duration-200
                ${clickAnimation ? 'scale-95 bg-amber-300' : 'scale-100'}
                ${isAutoMining ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-3xl">⛏️</span>
                <span className="text-sm">MINE</span>
              </div>
            </Button>

            {/* Particle Effects */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className="absolute pointer-events-none animate-ping"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Auto Mining Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Label htmlFor="auto-mining" className="text-slate-300">
                Auto Mining
              </Label>
              <Switch
                id="auto-mining"
                checked={isAutoMining}
                onCheckedChange={toggleAutoMining}
                disabled={autoMiningSpeed === 0}
              />
            </div>

            {autoMiningSpeed === 0 && (
              <p className="text-sm text-slate-400">
                Purchase Auto Miner upgrades to enable auto mining
              </p>
            )}

            {isAutoMining && autoMiningSpeed > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Mining Progress</span>
                  <span>Speed Level {autoMiningSpeed}</span>
                </div>
                <Progress value={miningProgress} className="w-full" />
              </div>
            )}
          </div>

          {/* Mining Instructions */}
          <div className="text-center space-y-2">
            {!isAutoMining ? (
              <>
                <h3 className="text-lg font-semibold text-slate-200">
                  Click to Mine Digits!
                </h3>
                <p className="text-sm text-slate-400">
                  Every click mines a digit and earns US Dollars
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-200">
                  Auto Mining Active
                </h3>
                <p className="text-sm text-slate-400">
                  Automatically mining digits in the background
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}