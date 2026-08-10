import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function AuthForm({ mode, onSubmit, isLoading, switchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#040508] cyber-bg-grid flex items-center justify-center px-4 py-12 relative overflow-hidden text-gray-200">
      {/* Radial Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Branding Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#090e17] border border-cyan-500/40 glow-cyan mb-4 group transition-transform duration-300 hover:scale-105">
            <Swords className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 tracking-tight">
            AI BATTLE ARENA
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-2 uppercase tracking-widest flex items-center justify-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> DUAL MODEL EVALUATION PLATFORM
          </p>
        </div>

        {/* Form Container Card */}
        <div className="cyber-glass rounded-3xl p-8 shadow-2xl border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#070a12] p-1.5 rounded-xl border border-gray-800 mb-8 relative">
            <button
              type="button"
              onClick={() => mode !== 'login' && switchMode()}
              className={`flex-1 py-2.5 text-sm font-medium font-heading rounded-lg transition-all relative z-10 ${
                mode === 'login' ? 'text-cyan-300 font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => mode !== 'register' && switchMode()}
              className={`flex-1 py-2.5 text-sm font-medium font-heading rounded-lg transition-all relative z-10 ${
                mode === 'register' ? 'text-purple-300 font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Create Account
            </button>

            {/* Active Tab Highlight Pill */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`absolute top-1.5 bottom-1.5 rounded-lg border ${
                mode === 'login'
                  ? 'left-1.5 right-[50%] bg-cyan-950/40 border-cyan-500/40 glow-cyan-sm'
                  : 'left-[50%] right-1.5 bg-purple-950/40 border-purple-500/40 glow-purple-sm'
              }`}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#080c14] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 text-sm transition-all font-sans"
                  placeholder="commander@arena.ai"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#080c14] border border-gray-800 rounded-xl pl-10 pr-11 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 text-sm transition-all font-sans"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-600 text-black font-heading font-bold py-3.5 text-sm transition-all duration-300 glow-cyan hover:glow-purple flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'ENTER ARENA' : 'REGISTER COMMANDER'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Toggle Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-xs font-mono text-gray-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {mode === 'login'
                ? "New to the arena? Create an account →"
                : 'Already registered? Sign in to continue →'}
            </button>
          </div>
        </div>

        {/* Feature Badges Footer */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-gray-500">
          <div className="p-2 rounded-lg bg-[#070a12] border border-gray-900 flex items-center justify-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-cyan-400" /> Model vs Model
          </div>
          <div className="p-2 rounded-lg bg-[#070a12] border border-gray-900 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> AI Judge
          </div>
          <div className="p-2 rounded-lg bg-[#070a12] border border-gray-900 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Real-time
          </div>
        </div>
      </motion.div>
    </div>
  );
}
