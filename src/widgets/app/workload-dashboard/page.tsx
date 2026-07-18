'use client';

import { useTheme, useWidgetState, useWidgetSDK } from '@nitrostack/widgets';

interface Task {
  title: string;
  course: string;
  daysUntilDue: number;
  estimatedHoursRequired: number;
  priorityScore: number;
  tier: 'critical' | 'high' | 'moderate' | 'stable';
}

interface WorkloadData {
  status: string;
  generatedAt: string;
  totalHoursBacklog: number;
  burnoutRisk: { level: 'high' | 'moderate' | 'low'; message: string };
  matrix: Task[];
}

export default function WorkloadDashboard() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const [state, setState] = useWidgetState<{ expanded: boolean }>(() => ({ expanded: true }));

  const data = getToolOutput<WorkloadData>();
  const isDark = theme === 'dark';

  if (!data) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: isDark ? '#fff' : '#000' }}>
        Loading workload matrix...
      </div>
    );
  }

  const riskColors = { high: '#ff5470', moderate: '#ffb347', low: '#4ade80' };
  const riskColor = riskColors[data.burnoutRisk.level];

  const tierColor = (tier: string) =>
    tier === 'critical' ? '#ff5470' :
    tier === 'high' ? '#ffb347' :
    tier === 'moderate' ? '#60a5fa' : '#4ade80';

  return (
    <div style={{
      padding: 24,
      background: isDark
        ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #f5f5fa 0%, #e8e8f5 100%)',
      borderRadius: 20,
      color: isDark ? '#e8e8f0' : '#1a1a2e',
      maxWidth: 460,
      fontFamily: 'Inter, system-ui, sans-serif',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h3 style={{ margin: 0, fontSize: 18, letterSpacing: 0.3 }}>⚡ Workload Matrix</h3>
        <span style={{
          background: `${riskColor}22`, color: riskColor, padding: '4px 10px',
          borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase'
        }}>
          {data.burnoutRisk.level} risk
        </span>
      </div>

      <p style={{ fontSize: 13, opacity: 0.65, marginTop: 4, marginBottom: 16 }}>
        {data.burnoutRisk.message}
      </p>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14, fontSize: 12, opacity: 0.7
      }}>
        <span>Total backlog: <strong>{data.totalHoursBacklog}h</strong></span>
        <button
          onClick={() => setState({ expanded: !state?.expanded })}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'inherit', opacity: 0.7, fontSize: 12, textDecoration: 'underline'
          }}
        >
          {state?.expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {state?.expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.matrix.map((task, i) => (
            <div key={i} style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              borderRadius: 12,
              padding: '12px 16px',
              borderLeft: `3px solid ${tierColor(task.tier)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 14 }}>{task.title}</strong>
                <span style={{ fontSize: 12, opacity: 0.55 }}>{task.course}</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>
                {task.daysUntilDue}d left · {task.estimatedHoursRequired}h needed · score {task.priorityScore}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, textAlign: 'center', opacity: 0.4, marginTop: 16 }}>
        CipherX Nexus · generated {new Date(data.generatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
}