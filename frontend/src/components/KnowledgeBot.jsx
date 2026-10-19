import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Sparkles, RefreshCw, CornerDownRight } from 'lucide-react';
import { sendChatMessage } from '../api/client';

const QUICK_QUESTIONS = [
  'What is the minimum curing period for OPC concrete according to ACI 308?',
  'What are OSHA 1926 guardrail height and force criteria?',
  'How to diagnose a 45-degree diagonal crack in a reinforced beam?',
  'What are the standard slump and water-cement ratios for M25 concrete?'
];

export default function KnowledgeBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Construction Intelligence Assistant. I am specialized in structural concrete (ACI 318), occupational site safety (OSHA 1926), building codes (IBC), and CPM scheduling. How can I assist you with field engineering or technical specifications today?',
      citations: ['ACI 318-19 Building Code', 'OSHA 29 CFR 1926 Standards', 'International Building Code 2024'],
      suggested_followups: [
        'What is the minimum curing period for OPC concrete according to ACI 308?',
        'What are OSHA 1926 guardrail height and force criteria?',
        'How to diagnose a 45-degree diagonal crack in a reinforced beam?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      // Map history for backend
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendChatMessage(query, historyPayload);
      setMessages([...updatedHistory, {
        role: 'assistant',
        content: res.response,
        citations: res.citations || [],
        suggested_followups: res.suggested_followups || []
      }]);
    } catch (err) {
      setMessages([...updatedHistory, {
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to retrieve response from assistant.'}`,
        citations: [],
        suggested_followups: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Construction Engineering Knowledge Assistant</h2>
          <p className="text-xs text-zinc-400">Conversational AI expert grounded in ACI, OSHA, ASTM, and International Building Codes</p>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] text-zinc-500 font-medium mr-1 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Inquiries:</span>
        </span>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 transition cursor-pointer truncate max-w-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="subtle-card flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-white/[0.08] text-white flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <Bot className="w-4 h-4 text-zinc-300" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-lg p-3.5 space-y-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white text-black font-medium self-end'
                  : 'bg-white/[0.03] border border-white/[0.08] text-zinc-200'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Code References:</span>
                    <div className="flex flex-wrap gap-1">
                      {msg.citations.map((cite, cIdx) => (
                        <span key={cIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.06]">
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Suggested Next Questions:</span>
                    <div className="space-y-1">
                      {msg.suggested_followups.map((f, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSend(f)}
                          className="text-left text-[11px] text-zinc-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer group"
                        >
                          <CornerDownRight className="w-3 h-3 text-zinc-500 group-hover:text-white shrink-0" />
                          <span className="underline decoration-white/20 underline-offset-2">{f}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  <User className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-zinc-400 pl-10">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Consulting civil engineering knowledge base...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-black/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about building codes, concrete hydration, rebar lap lengths, OSHA rules..."
              className="flex-1 px-3.5 py-2 rounded-md bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/[0.3]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-40 flex items-center space-x-1"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
