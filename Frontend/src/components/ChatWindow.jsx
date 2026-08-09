import React, { useRef, useEffect } from 'react';

function renderMarkdown(text) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n');
    return (
      <p key={pIdx}>
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
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else {
      parts.push(<em key={match.index}>{match[3]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function ScoreLabel({ score }) {
  return (
    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#222] text-gray-300 border border-[#333]">
      {score}/10
    </span>
  );
}

function SolutionPanel({ modelName, text }) {
  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${modelName === 'Model A' ? 'bg-cyan-500' : 'bg-purple-500'}`} />
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{modelName}</h3>
      </div>
      <div className="md-prose text-gray-300 text-[15px]">
        {renderMarkdown(text)}
      </div>
    </div>
  );
}

function JudgeVerdict({ judge }) {
  return (
    <div className="border-t border-[#222] bg-[#0F0F0F] p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg">⚖️</span>
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Judge Verdict</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Model A</span>
            <ScoreLabel score={judge.solution_1_score} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{judge.solution_1_reasoning}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Model B</span>
            <ScoreLabel score={judge.solution_2_score} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{judge.solution_2_reasoning}</p>
        </div>
      </div>
    </div>
  );
}

function BattleCard({ result }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-[#222] shadow-sm overflow-hidden mt-6 mb-12 transform transition-all hover:border-[#333]">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#222]">
        <SolutionPanel modelName="Model A" text={result.solution_1} />
        <SolutionPanel modelName="Model B" text={result.solution_2} />
      </div>
      <JudgeVerdict judge={result.judge} />
    </div>
  );
}

export default function ChatWindow({ activeChatId, messages, isLoading, onSubmit, input, setInput }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main className="flex-1 flex flex-col">
      <header className="flex-shrink-0 border-b border-[#222] px-6 py-4 flex items-center justify-between bg-[#0A0A0A]">
        <div className="font-medium text-gray-200">{activeChatId ? 'Current chat' : 'New battle'}</div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col pt-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center flex-1 h-full min-h-[300px] opacity-90">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#141414] border border-[#222] text-gray-400 text-3xl mb-6">❋</div>
              <h1 className="text-2xl font-semibold text-gray-200 mb-2">Welcome to AI Battle Arena</h1>
              <p className="text-gray-500 text-[15px] max-w-md text-center leading-relaxed">
                Send a question to compare two AI models and judge the outcome.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className="mb-6">
              {msg.role === 'user' ? (
                <div className="self-end max-w-2xl ml-auto bg-[#1A1A1A] px-6 py-4 rounded-2xl rounded-tr-sm border border-[#333] text-gray-200">
                  {msg.content}
                </div>
              ) : (
                <BattleCard result={msg.content} />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="self-start mt-6 mb-12 bg-[#141414] px-6 py-4 rounded-2xl rounded-tl-sm border border-[#222] text-gray-500 text-sm flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 bg-gray-600 rounded-full" />
              <span className="animate-pulse w-2 h-2 bg-gray-600 rounded-full animation-delay-200" />
              <span className="animate-pulse w-2 h-2 bg-gray-600 rounded-full animation-delay-400" />
              <span className="ml-2">Evaluating models...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <footer className="flex-shrink-0 border-t border-[#222] px-4 py-6 md:px-12 pb-8 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={onSubmit} className="flex items-center gap-3 bg-[#111111] border border-[#333] rounded-2xl px-2 py-2 shadow-sm focus-within:border-gray-500 focus-within:bg-[#141414] transition-all duration-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-gray-200 placeholder-gray-600 text-[15px]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 flex items-center justify-center bg-white text-black hover:bg-gray-200 rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </main>
  );
}
