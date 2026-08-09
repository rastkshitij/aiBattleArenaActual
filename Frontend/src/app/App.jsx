import React, { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import axios from "axios"
/* ─────────────────────────────────────────
   Sample Data
   ───────────────────────────────────────── */

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
    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#222] text-gray-300 border border-[#333]">
      {score}/10
    </span>
  )
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
  )
}

function JudgeVerdict({ judge }) {
  return (
    <div className="border-t border-[#222] bg-[#0F0F0F] p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg">⚖️</span>
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Judge Verdict</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Model A Verdict */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Model A</span>
            <ScoreLabel score={judge.solution_1_score} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {judge.solution_1_reasoning}
          </p>
        </div>
        
        {/* Model B Verdict */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Model B</span>
            <ScoreLabel score={judge.solution_2_score} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {judge.solution_2_reasoning}
          </p>
        </div>
      </div>
    </div>
  )
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
  )
}

/* ─────────────────────────────────────────
   Main App
   ───────────────────────────────────────── */
export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

function cleanMdAndLatex(text) {
  return text
    // Remove markdown symbols
    .replace(/[#_*`~>-]/g, '')

    // Remove links [text](url)
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')

    // Remove LaTeX block delimiters \[ \]
    .replace(/\\\[|\\\]/g, '')

    // Replace LaTeX commands
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')

    // Remove inline LaTeX brackets \( \)
    .replace(/\\\(|\\\)/g, '')

    // Remove extra backslashes
    .replace(/\\/g, '')

    // Clean spacing
    .replace(/\n+/g, '\n')
    .trim();
}
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response =  await axios.post('http://localhost:3000/invoke' , {
      input : input
    } )
    const data  =  response.data    
    console.log(data)

    if (!input.trim() || isLoading) return
    const problem = input.trim()
    setInput('')
    setIsLoading(true)
    const id = Date.now()
    setMessages(prev => [...prev, { id, problem, result: null, error: null }])
    try {
      // Temporary mock response until backend is connected
      await new Promise(r => setTimeout(r, 1500))
      
      const sampleData = {
        result: {
          problem: problem,
          solution_1: cleanMdAndLatex(data.result.solution_1),
          solution_2: cleanMdAndLatex(data.result.solution_2),
          judge: {
            solution_1_score: data.result.judge.solution_1_score,
            solution_2_score: data.result.judge.solution_2_score,
            solution_1_reasoning: cleanMdAndLatex(data.result.judge.solution_1_reasoning),
            solution_2_reasoning: cleanMdAndLatex(data.result.judge.solution_2_reasoning)
        }
      }
    }   
      setMessages(prev => prev.map(m => m.id === id ? { ...m, result: sampleData.result } : m))
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, error: err.message } : m))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] font-sans selection:bg-[#333] selection:text-white">
      
      {/* Header Minimal */}
      <header className="flex-shrink-0 sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#222] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#141414] border border-[#222] text-gray-400 text-sm">
            ❋
          </div>
          <span className="font-semibold text-gray-200 tracking-tight">AI Battle Arena</span>
        </div>
      </header>

      {/* Chat Flow */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col pt-4 h-full">
          
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center flex-1 h-full opacity-0 animate-[fadeIn_1s_ease-out_forwards] mt-32">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#141414] border border-[#222] text-gray-400 text-3xl mb-6 shadow-sm">
                ❋
              </div>
              <h1 className="text-2xl font-semibold text-gray-200 mb-2">Welcome to AI Battle Arena</h1>
              <p className="text-gray-500 text-[15px] max-w-md text-center leading-relaxed">
                Send a message to pit two AI models against each other. An impartial judge will evaluate their responses.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col w-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              {/* User message */}
              <div className="self-end max-w-2xl bg-[#1A1A1A] px-6 py-4 rounded-2xl rounded-tr-sm border border-[#333] shadow-sm text-gray-200 text-[15px] leading-relaxed relative">
                {msg.problem}
              </div>

              {/* AI Response Card */}
              {msg.result && <BattleCard result={msg.result} />}
              
              {/* Error State */}
              {msg.error && (
                <div className="mt-4 mb-12 self-start bg-red-950/30 text-red-500 px-4 py-3 rounded-lg text-sm border border-red-900/50">
                  {msg.error}
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="self-start mt-6 mb-12 bg-[#141414] px-6 py-4 rounded-2xl rounded-tl-sm border border-[#222] text-gray-500 text-sm flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 bg-gray-600 rounded-full"></span>
              <span className="animate-pulse w-2 h-2 bg-gray-600 rounded-full animation-delay-200"></span>
              <span className="animate-pulse w-2 h-2 bg-gray-600 rounded-full animation-delay-400"></span>
              <span className="ml-2">Evaluating models...</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area Minimal */}
      <footer className="flex-shrink-0 bg-[#0A0A0A] border-t border-[#222] px-4 py-6 md:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-[#111111] border border-[#333] rounded-2xl px-2 py-2 shadow-sm focus-within:border-gray-500 focus-within:bg-[#141414] transition-all duration-300"
          >
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