import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Zap, Sparkles, ChevronRight, Cpu } from 'lucide-react';

export default function WelcomeIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulated high-tech initialization sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  const handleFinish = () => {
    try {
      sessionStorage.setItem('hasSeenIntro', 'true');
    } catch (e) {
      // fallback
    }
    if (onComplete) onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040508] cyber-bg-grid overflow-hidden text-gray-100"
    >
      {/* Ambient background glow spheres */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Sci-fi Overlay Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,240,255,0.02)_50%,transparent_100%)] animate-scanline pointer-events-none" />

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleFinish}
        className="absolute top-6 right-8 text-xs font-mono text-gray-400 hover:text-cyan-400 border border-gray-800 hover:border-cyan-500/50 bg-[#0c1017]/80 px-4 py-2 rounded-lg backdrop-blur-md transition-all flex items-center gap-2 z-50 group cursor-pointer"
      >
        <span>SKIP INTRO</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="relative z-10 max-w-xl w-full px-6 flex flex-col items-center text-center">
        {/* Animated Cyber Shield / Logo Badge */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8 flex items-center justify-center"
        >
          {/* Rotating Glowing Cyber Rings */}
          <div className="absolute w-36 h-36 rounded-full border border-cyan-500/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-44 h-44 rounded-full border border-dashed border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* Central Logo Box */}
          <div className="w-24 h-24 rounded-2xl bg-[#090e17] border border-cyan-500/40 glow-cyan flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 opacity-70" />
            <Swords className="w-11 h-11 text-cyan-400 relative z-10 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
          </div>
        </motion.div>

        {/* Title & Slogan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4 tracking-widest uppercase glow-cyan-sm">
            <Zap className="w-3.5 h-3.5" /> NEURAL ARENA V2.0
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 mb-3">
            AI BATTLE ARENA
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-8 font-sans">
            Two AI models collide. One judge decides the supreme winner.
          </p>
        </motion.div>

        {/* Progress Bar & Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-md bg-[#0c111c]/90 border border-gray-800 rounded-xl p-5 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-3.5 h-3.5 animate-pulse" /> SYNCHRONIZING AI AGENTS...
            </span>
            <span className="text-purple-400 font-bold">{progress}%</span>
          </div>

          {/* Segmented Progress Track */}
          <div className="w-full h-2.5 bg-[#06080e] rounded-full overflow-hidden border border-gray-800/80 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full glow-cyan-sm"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isReady ? 1 : 0.6, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={handleFinish}
            disabled={!isReady}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-600 text-black font-heading font-bold text-base tracking-wide glow-cyan hover:glow-purple transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>ENTER ARENA</span>
            <Sparkles className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
          </button>
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        @rastkshitij@gmail.com
      </div>
    </motion.div>
  );
}
