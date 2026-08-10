import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Send,
  Sparkles,
  Award,
  Copy,
  Check,
  Zap,
  Scale,
  Bot,
  User,
  Crown,
  ChevronRight,
  Code2,
  Cpu,
  BrainCircuit
} from 'lucide-react';

function renderMarkdown(text) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n');
    return (
      <p key={pIdx} className="mb-4 last:mb-0 leading-relaxed">
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {inlineMarkdown(line)}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

function inlineMarkdown(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[0].startsWith('**')) {
      parts.push(
        <strong key={match.index} className="text-gray-100 font-semibold">
          {match[2]}
        </strong>
      );
    } else {
      parts.push(
        <em key={match.index} className="text-gray-400 italic">
          {match[3]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function ScoreBadge({ score, isWinner }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
        isWinner
          ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 glow-gold'
          : 'bg-[#0f1422] border-gray-700 text-gray-300'
      }`}
    >
      {isWinner && <Crown className="w-3.5 h-3.5 text-amber-400" />}
      <span>{score} / 10</span>
    </div>
  );
}

function SolutionPanel({ modelName, text, colorTheme }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCyan = colorTheme === 'cyan';

  return (
    <div
      className={`flex-1 p-6 md:p-7 rounded-2xl border transition-all duration-300 relative ${
        isCyan ? 'cyber-glass-cyan' : 'cyber-glass-purple'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full ${
              isCyan ? 'bg-cyan-400 glow-cyan-sm' : 'bg-purple-400 glow-purple-sm'
            }`}
          />
          <span
            className={`font-heading font-bold text-xs uppercase tracking-wider ${
              isCyan ? 'text-cyan-300' : 'text-purple-300'
            }`}
          >
            {modelName}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#070a12] border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Solution Body */}
      <div className="md-prose text-gray-200 text-[14.5px] leading-relaxed">
        {renderMarkdown(text)}
      </div>
    </div>
  );
}

function JudgeVerdict({ judge }) {
  const score1 = parseFloat(judge?.solution_1_score) || 0;
  const score2 = parseFloat(judge?.solution_2_score) || 0;

  const isModelAWinner = score1 > score2;
  const isModelBWinner = score2 > score1;
  const isTie = score1 === score2 && score1 > 0;

  return (
    <div className="mt-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#141208]/90 via-[#0e121b]/90 to-[#070a12]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Ambient Gold Light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center glow-gold">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-gray-100 uppercase tracking-widest flex items-center gap-2">
              <span>JUDGE CHAMBER VERDICT</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-gray-400">Automated multi-criteria evaluation</p>
          </div>
        </div>

        {/* Winner Tag */}
        <div>
          {isModelAWinner && (
            <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold glow-cyan-sm">
              🏆 WINNER: MODEL A
            </div>
          )}
          {isModelBWinner && (
            <div className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-mono font-bold glow-purple-sm">
              🏆 WINNER: MODEL B
            </div>
          )}
          {isTie && (
            <div className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold glow-gold">
              🤝 DRAW / EQUAL SCORE
            </div>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model A Judge Card */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            isModelAWinner
              ? 'bg-cyan-950/20 border-cyan-500/40'
              : 'bg-[#090d17] border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-semibold text-xs text-cyan-300 uppercase tracking-wide">
              Model A Score
            </span>
            <ScoreBadge score={judge?.solution_1_score} isWinner={isModelAWinner} />
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {judge?.solution_1_reasoning}
          </p>
        </div>

        {/* Model B Judge Card */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            isModelBWinner
              ? 'bg-purple-950/20 border-purple-500/40'
              : 'bg-[#090d17] border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-semibold text-xs text-purple-300 uppercase tracking-wide">
              Model B Score
            </span>
            <ScoreBadge score={judge?.solution_2_score} isWinner={isModelBWinner} />
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {judge?.solution_2_reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}

function BattleCard({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SolutionPanel modelName="Model A (Cyan)" text={result?.solution_1} colorTheme="cyan" />
        <SolutionPanel modelName="Model B (Purple)" text={result?.solution_2} colorTheme="purple" />
      </div>
      {result?.judge && <JudgeVerdict judge={result.judge} />}
    </motion.div>
  );
}

export default function ChatWindow({ activeChatId, messages, isLoading, onSubmit, input, setInput }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const starterPrompts = [
    {
      title: 'Quantum vs Relativistic Physics',
      query: 'Compare Quantum Physics vs General Relativity in terms of scale, mathematics, and unification challenges.',
      icon: Zap,
    },
    {
      title: 'React 19 vs Vue 3 Architecture',
      query: 'Compare React 19 Server Components vs Vue 3 Composition API architecture and developer experience.',
      icon: Code2,
    },
    {
      title: 'Python vs Rust for AI Engine',
      query: 'Should a backend team build their high-performance AI inference pipeline in Python or Rust?',
      icon: Cpu,
    },
    {
      title: 'Algorithm Benchmark Duel',
      query: 'Compare QuickSort vs MergeSort in time complexity, space complexity, stability, and real-world usage.',
      icon: BrainCircuit,
    },
  ];

  return (
    <main className="flex-1 flex flex-col h-full bg-[#040508] cyber-bg-grid relative overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex-shrink-0 border-b border-gray-800/80 px-6 py-4 flex items-center justify-between bg-[#070a12]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center glow-cyan-sm">
            <Swords className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-gray-100">
              {activeChatId ? 'Active Battle Session' : 'New Model Arena Duel'}
            </h2>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span className="text-cyan-400">Model A</span> vs <span className="text-purple-400">Model B</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0a0e19] border border-gray-800 text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>NEURAL ARENA ACTIVE</span>
        </div>
      </header>

      {/* Scrollable Message Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-10">
        <div className="max-w-5xl mx-auto flex flex-col pt-2">
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              {/* Hero Badge */}
              <div className="w-20 h-20 rounded-3xl bg-[#090e17] border border-cyan-500/40 glow-cyan flex items-center justify-center mb-6">
                <Swords className="w-10 h-10 text-cyan-400" />
              </div>

              <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-3">
                WELCOME TO AI BATTLE ARENA
              </h1>

              <p className="text-gray-400 text-sm max-w-lg mb-10 leading-relaxed font-sans">
                Submit any prompt or question to trigger a dual-model battle. Watch two AI architectures compute responses simultaneously while the Automated Judge renders a verdict.
              </p>

              {/* Starter Battle Cards */}
              <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {starterPrompts.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInput(item.query)}
                      className="p-4 rounded-2xl cyber-glass hover:cyber-glass-cyan border border-gray-800 transition-all duration-300 text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-heading font-semibold text-xs text-gray-200 group-hover:text-cyan-300">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-400 line-clamp-2 leading-relaxed">
                        {item.query}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Render Messages */}
          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className="mb-6">
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-gradient-to-r from-[#0d1627] to-[#121829] px-6 py-4 rounded-2xl rounded-tr-sm border border-cyan-500/30 shadow-lg text-gray-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-sans leading-relaxed">{msg.content}</div>
                  </div>
                </div>
              ) : (
                <BattleCard result={msg.content} />
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 mb-12 p-6 rounded-2xl cyber-glass border border-cyan-500/30 max-w-md flex items-center gap-4 glow-cyan-sm"
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <span>EVALUATING MODEL DUEL</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="text-xs font-mono text-gray-400 mt-1">
                  Synthesizing Model A & Model B responses...
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Floating Command Input Console */}
      <footer className="flex-shrink-0 border-t border-gray-800/80 px-4 py-4 md:px-10 bg-[#070a12]/95 backdrop-blur-xl z-20">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={onSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a prompt or coding question to battle AI models..."
              disabled={isLoading}
              className="w-full bg-[#090d18] border border-gray-800 rounded-2xl pl-5 pr-28 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 text-sm font-sans transition-all shadow-inner"
            />
            <div className="absolute right-2.5 flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-600 text-black font-heading font-bold text-xs uppercase tracking-wide glow-cyan hover:glow-purple transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>SEND</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mt-2 px-2">
            <span>Press <kbd className="px-1.5 py-0.5 bg-[#090d18] border border-gray-800 rounded text-gray-400">Enter</kbd> to submit</span>
            <span>AI Battle Engine v2.0</span>
          </div>
        </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        @rastkshitij@gmail.com
      </div>
      </footer>
    </main>
  );
}
