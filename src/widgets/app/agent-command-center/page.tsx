'use client';

import { useState } from 'react';
import { useTheme, useWidgetState, useWidgetSDK } from '@nitrostack/widgets';

interface AgentCard {
  role: string;
  status: string;
  specialty: string;
  summary: string;
  confidence?: number;
  priority?: string;
}

interface OrchestrationData {
  status: string;
  generatedAt: string;
  prompt: string;
  context: string;
  overview?: string;
  consensusScore?: number;
  nextAction?: string;
  decisions?: string[];
  agents: AgentCard[];
}

interface Message {
  id: number;
  role: 'user' | 'agent';
  sender: string;
  text: string;
}

export default function AgentCommandCenter() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const [state, setState] = useWidgetState<{ selected: string | null }>({ selected: null });
  const data = getToolOutput<OrchestrationData>();
  const isDark = theme === 'dark';
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'agent',
      sender: 'Nexus Orchestrator',
      text: 'Welcome. I can coordinate research, learning, debate, review, and synthesis to accelerate education and academic discovery.'
    }
  ]);

  if (!data) {
    return (
      <div style={{ padding: 24, color: isDark ? '#fff' : '#111', fontFamily: 'Inter, sans-serif' }}>
        Loading multi-agent command center...
      </div>
    );
  }

  const quickActions = [
    { label: 'Research topic', prompt: 'Explore this academic topic and summarize the key concepts, evidence, and research directions.' },
    { label: 'Study plan', prompt: 'Create a structured learning plan for this subject with milestones, priorities, and clear outcomes.' },
    { label: 'Debate mode', prompt: 'Challenge this idea and present the strongest academic opposing viewpoint with reasoning.' },
    { label: 'Review output', prompt: 'Review this draft for clarity, structure, and rubric alignment with constructive feedback.' }
  ];

  const handleSend = () => {
    const value = inputValue.trim();
    if (!value) return;

    const lower = value.toLowerCase();
    let agent = 'Synthesis Agent';
    if (lower.includes('research') || lower.includes('literature') || lower.includes('source') || lower.includes('paper')) agent = 'Research Agent';
    else if (lower.includes('study') || lower.includes('learn') || lower.includes('plan') || lower.includes('course')) agent = 'Learning Agent';
    else if (lower.includes('debate') || lower.includes('argue') || lower.includes('opinion')) agent = 'Debate Agent';
    else if (lower.includes('review') || lower.includes('feedback') || lower.includes('rubric') || lower.includes('draft')) agent = 'Review Agent';

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: 'user', sender: 'You', text: value },
      { id: prev.length + 2, role: 'agent', sender: agent, text: `The ${agent} is now processing your request with a premium multi-step response. ${value}` }
    ]);
    setInputValue('');
    setState({ selected: agent });
  };

  return (
    <div style={{
      padding: 24,
      background: isDark ? 'linear-gradient(135deg, #050816 0%, #0b1730 45%, #12284a 100%)' : 'linear-gradient(135deg, #f5f9ff 0%, #e9f0ff 45%, #e0ebff 100%)',
      borderRadius: 28,
      color: isDark ? '#e8f1ff' : '#0f172a',
      border: isDark ? '1px solid rgba(96,165,250,0.25)' : '1px solid rgba(15,23,42,0.08)',
      boxShadow: '0 24px 80px rgba(15, 23, 42, 0.25)',
      maxWidth: 780,
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.7 }}>Nexus Orchestrator</div>
          <h3 style={{ margin: '4px 0 0', fontSize: 22 }}>Education & Research Intelligence Layer</h3>
          <div style={{ fontSize: 12, opacity: 0.72, marginTop: 4 }}>Transforming study, teaching, and academic discovery into intelligent workflows.</div>
        </div>
        <div style={{ background: '#22c55e22', color: '#22c55e', padding: '6px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
          LIVE
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => setInputValue(action.prompt)}
            style={{
              border: '1px solid rgba(96,165,250,0.25)',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.78)',
              color: 'inherit',
              borderRadius: 999,
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: 12,
              boxShadow: '0 6px 16px rgba(96, 165, 250, 0.12)'
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: isDark ? '1.2fr 0.8fr' : '1.2fr 0.8fr', alignItems: 'start' }}>
        <div style={{ borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.82)', padding: 14, minHeight: 320 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Live Conversation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>{msg.sender}</div>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: 14,
                  background: msg.role === 'user' ? '#60a5fa' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
                  color: msg.role === 'user' ? '#fff' : 'inherit'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the agents to research, plan study, debate ideas, review work, or synthesize findings..."
              style={{
                flex: 1,
                borderRadius: 999,
                border: '1px solid rgba(96,165,250,0.22)',
                padding: '10px 12px',
                background: isDark ? '#081120' : '#fff',
                color: 'inherit'
              }}
            />
            <button onClick={handleSend} style={{ border: 'none', borderRadius: 999, background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)', color: '#fff', padding: '10px 14px', cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 22px rgba(37, 99, 235, 0.25)' }}>
              Send
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 16, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.84)', border: '1px solid rgba(96,165,250,0.22)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Consensus Overview</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{data.overview || 'The agents are aligned and prepared to turn this topic into a strong academic outcome.'}</div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.72 }}>Consensus score: <strong>{data.consensusScore || 94}/100</strong></div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.72 }}>Next action: <strong>{data.nextAction || 'Create a final academic action plan.'}</strong></div>
          </div>

          {data.decisions && data.decisions.length > 0 && (
            <div style={{ padding: 12, borderRadius: 16, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.72)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Academic Decision Board</div>
              {data.decisions.map((item, index) => (
                <div key={index} style={{ fontSize: 12, opacity: 0.74, marginTop: 4 }}>• {item}</div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gap: 8 }}>
            {data.agents.map((agent) => (
              <div
                key={agent.role}
                onClick={() => setState({ selected: agent.role })}
                style={{
                  padding: 10,
                  borderRadius: 14,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: state.selected === agent.role ? '1px solid #60a5fa' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{agent.role}</strong>
                  <span style={{ fontSize: 11, color: '#60a5fa' }}>{agent.status}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{agent.specialty}</div>
                {agent.confidence !== undefined && (
                  <div style={{ marginTop: 6, fontSize: 11, opacity: 0.65 }}>
                    Confidence {Math.round(agent.confidence * 100)}% · {agent.priority}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, opacity: 0.45, textAlign: 'center' }}>
        NitroStack Studio · education and research orchestration demo
      </div>
    </div>
  );
}
