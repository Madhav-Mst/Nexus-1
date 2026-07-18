'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface TimelineStep {
  day: number;
  phase: string;
  detail: string;
}

interface TimelineData {
  status: string;
  targetExam: string;
  daysAvailable: number;
  timeline: TimelineStep[];
}

export default function StudyTimeline() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const data = getToolOutput<TimelineData>();
  const isDark = theme === 'dark';

  if (!data) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: isDark ? '#fff' : '#000' }}>
        Loading study plan...
      </div>
    );
  }

  const phaseColor = (phase: string) => {
    if (phase.includes('Mapping')) return '#60a5fa';
    if (phase.includes('Concept')) return '#a78bfa';
    if (phase.includes('Recall')) return '#ffb347';
    return '#4ade80';
  };

  return (
    <div style={{
      padding: 24,
      background: isDark
        ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #f5f5fa 0%, #e8e8f5 100%)',
      borderRadius: 20,
      color: isDark ? '#e8e8f0' : '#1a1a2e',
      maxWidth: 420,
      fontFamily: 'Inter, system-ui, sans-serif',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
    }}>
      <h3 style={{ margin: 0, marginBottom: 4, fontSize: 18 }}>📅 Study Orchestration</h3>
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 0, marginBottom: 20 }}>
        {data.targetExam} · {data.daysAvailable} day plan
      </p>

      <div style={{ position: 'relative', paddingLeft: 20 }}>
        <div style={{
          position: 'absolute', left: 5, top: 6, bottom: 6, width: 2,
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }} />
        {data.timeline.map((step, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 16, paddingLeft: 16 }}>
            <div style={{
              position: 'absolute', left: -20, top: 3, width: 10, height: 10,
              borderRadius: '50%', background: phaseColor(step.phase),
              boxShadow: `0 0 0 3px ${phaseColor(step.phase)}22`
            }} />
            <div style={{ fontSize: 12, opacity: 0.5 }}>Day {step.day}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{step.phase}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{step.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, textAlign: 'center', opacity: 0.4, marginTop: 8 }}>
        CipherX Nexus · autonomous timeline
      </div>
    </div>
  );
}