import React, { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

/* ─────────────────────────────────────────
   Sample Data
   ───────────────────────────────────────── */
const INITIAL_RESULT = {
  problem: "What is the capital of india",
  solution_1: "The capital of **India** is **New Delhi**.\n\nNew Delhi is a part of the larger **National Capital Territory (NCT) of Delhi** and serves as the political and administrative center of the country. It houses key government institutions, including the **Rashtrapati Bhavan (President's House)**, **Parliament of India**, and the **Supreme Court of India**.\n\nWould you like more details about Delhi's history or landmarks? 😊",
  solution_2: "The capital of India is **New Delhi**. It is the seat of the Government of India and is located within the National Capital Territory of Delhi. New Delhi is a major political, cultural, and commercial center in India.",
  judge: {
    solution_1_score: 10,
    solution_2_score: 10,
    solution_1_reasoning: "The response is completely accurate and provides useful additional context, such as the specific government institutions located in the capital. The formatting is clear and the tone is helpful.",
    solution_2_reasoning: "The response is accurate and concise. It correctly identifies New Delhi as the capital and explains its administrative and geographic relationship to the National Capital Territory of Delhi."
  }
}

/* ─────────────────────────────────────────
   Markdown renderer
   ───────────────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return null
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n')
    return (
      <p key={pIdx}>
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {inlineMarkdown(line)}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    )
  })
}

function inlineMarkdown(text) {
  const parts = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[0].startsWith('**')) {
      parts.push(<strong key={match.index}>{match[2]}</strong>)
    } else {
      parts.push(<em key={match.index}>{match[3]}</em>)
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

/* ─────────────────────────────────────────
   UI Components
   ───────────────────────────────────────── */

function ScoreLabel({ score }) {
  return (
    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
      {score}/10
    </span>
  )
}

function SolutionPanel({ modelName, text }) {
  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${modelName === 'Model A' ? 'bg-blue-500' : 'bg-purple-500'}`} />
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{modelName}</h3>
      </div>
      <div className="md-prose text-gray-700 text-[15px]">
        {renderMarkdown(text)}
      </div>
    </div>
  )
}

function JudgeVerdict({ judge }) {
  return (
    <div className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg">⚖️</span>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Judge Verdict</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Model A Verdict */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Model A</span>
            <ScoreLabel score={judge.solution_1_score} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {judge.solution_1_reasoning}
          </p>
        </div>
        
        {/* Model B Verdict */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Model B</span>
            <ScoreLabel score={judge.solution_2_score} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {judge.solution_2_reasoning}
          </p>
        </div>
      </div>
    </div>
  )
}

function BattleCard({ result }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6 mb-12 transform transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <SolutionPanel modelName="Model A" text={result.solution_1} />
        <SolutionPanel modelName="Model B" text={result.solution_2} />
      </div>
      <JudgeVerdict judge={result.judge} />
    </div>
  )
}

/* ─────────────────────────────────────────
   Main App
   ───────────────────────────────────────── */
export default function App() {
  const [messages, setMessages] = useState([
    { id: 'initial', problem: INITIAL_RESULT.problem, result: INITIAL_RESULT, error: null }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const problem = input.trim()
    setInput('')
    setIsLoading(true)
    const id = Date.now()
    setMessages(prev => [...prev, { id, problem, result: null, error: null }])
    try {
      const resp = await fetch('http://localhost:8000/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      })
      if (!resp.ok) throw new Error('Battle server unreachable')
      const data = await resp.json()
      setMessages(prev => prev.map(m => m.id === id ? { ...m, result: data.result } : m))
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, error: err.message } : m))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50/30 selection:bg-gray-100 font-sans">
      
      {/* Header Minimal */}
      <header className="flex-shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            ❋
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">AI Battle Arena</span>
        </div>
      </header>

      {/* Chat Flow */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col pt-4">
          
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col w-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              {/* User message */}
              <div className="self-end max-w-2xl bg-white px-6 py-4 rounded-2xl rounded-tr-sm border border-gray-100 shadow-sm text-gray-800 text-[15px] leading-relaxed relative">
                {msg.problem}
              </div>

              {/* AI Response Card */}
              {msg.result && <BattleCard result={msg.result} />}
              
              {/* Error State */}
              {msg.error && (
                <div className="mt-4 mb-12 self-start bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
                  {msg.error}
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="self-start mt-6 mb-12 bg-white px-6 py-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-gray-400 text-sm flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 bg-gray-300 rounded-full"></span>
              <span className="animate-pulse w-2 h-2 bg-gray-300 rounded-full animation-delay-200"></span>
              <span className="animate-pulse w-2 h-2 bg-gray-300 rounded-full animation-delay-400"></span>
              <span className="ml-2">Synthesizing solutions...</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area Minimal */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-6 md:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-2 py-2 shadow-sm focus-within:border-gray-300 focus-within:ring-4 focus-within:ring-gray-50 transition-all duration-300"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-gray-800 placeholder-gray-400 text-[15px]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 flex items-center justify-center bg-gray-900 text-white rounded-xl px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
      
      {/* Custom Tailwind utilities via CSS override locally */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </div>
  )
}