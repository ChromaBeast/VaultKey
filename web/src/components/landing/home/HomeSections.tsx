import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, Code2, Globe, History, Link2, Lock, ScrollText, Server, ShieldCheck, Sparkles, Terminal, Users, Zap } from 'lucide-react';
import { IconTile, type Tone } from '@/components/ui';

const STACK: { label: string; tone: Tone; icon: React.ReactNode }[] = [
  { label: 'Node.js', tone: 'blue', icon: <Code2 size={14} /> },
  { label: 'Python', tone: 'blue', icon: <Code2 size={14} /> },
  { label: 'Dart', tone: 'blue', icon: <Code2 size={14} /> },
  { label: 'Docker', tone: 'blue', icon: <Server size={14} /> },
  { label: 'Claude Code', tone: 'blue', icon: <Bot size={14} /> },
  { label: 'Cursor', tone: 'blue', icon: <Sparkles size={14} /> },
  { label: 'REST API', tone: 'blue', icon: <Globe size={14} /> },
];

export const StackStrip: React.FC = () => (
  <section className="stack-strip" aria-label="Works with your stack">
    <p>Works with your stack</p>
    <ul>{STACK.map((s) => <li key={s.label} className="stack-pill">{s.icon}{s.label}</li>)}</ul>
  </section>
);

const FEATURES: { icon: React.ReactNode; tone: Tone; title: string; text: string }[] = [
  { icon: <Lock size={22} />, tone: 'blue', title: 'Encrypted at rest', text: 'AES-256-GCM per secret. Keys are wrapped per member and never stored in plaintext.' },
  { icon: <Zap size={22} />, tone: 'blue', title: 'Runtime injection', text: 'vaultkey run injects secrets straight into your process. No local secret file, ever.' },
  { icon: <Users size={22} />, tone: 'blue', title: 'Scoped access', text: 'Admin, write and read roles plus scoped API tokens for CI and automation.' },
  { icon: <ScrollText size={22} />, tone: 'blue', title: 'HMAC audit ledger', text: 'Every read, write and rollback is chained and signed. Verify the chain in one click.' },
  { icon: <History size={22} />, tone: 'blue', title: 'Version history', text: 'Every change is a version. Roll back a bad deploy in a single step.' },
  { icon: <Link2 size={22} />, tone: 'blue', title: 'One-time share links', text: 'Hand a secret to a teammate with a link that self-destructs after one view.' },
];

export const FeatureGrid: React.FC = () => (
  <section className="section-shell home-features" aria-labelledby="features-title">
    <header className="section-header-center">
      <h2 id="features-title" className="section-title">Everything a secret needs.<br />Nothing it doesn’t.</h2>
      <p>Encrypted storage, scoped access and a tamper-evident record of every change.</p>
    </header>
    <div className="feature-grid">
      {FEATURES.map((f) => (
        <article key={f.title} className="glass feature-card">
          <IconTile tone={f.tone} size="lg">{f.icon}</IconTile>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </article>
      ))}
    </div>
  </section>
);

const STEPS: { n: string; title: string; text: string; tone: Tone; icon: React.ReactNode; cmd: string; ok: string }[] = [
  { n: '1', title: 'Store', text: 'Add secrets in the dashboard or CLI. Each value is encrypted before it is saved.', tone: 'blue', icon: <Lock size={22} />, cmd: '$ vaultkey secrets set STRIPE_KEY', ok: 'encrypted · v1' },
  { n: '2', title: 'Run', text: 'Start your app through VaultKey. Secrets are injected into the process memory.', tone: 'blue', icon: <Zap size={22} />, cmd: '$ vaultkey run -- npm start', ok: '12 secrets injected' },
  { n: '3', title: 'Audit', text: 'Every access is chained and signed. Export or verify the ledger anytime.', tone: 'blue', icon: <ScrollText size={22} />, cmd: '$ vaultkey audit verify', ok: 'chain intact · 1,284 entries' },
];

export const WorkflowSteps: React.FC = () => (
  <section className="home-steps" aria-labelledby="workflow-title">
    <div className="section-shell">
      <h2 id="workflow-title" className="section-title">A safer source of secrets.</h2>
      <p className="section-lede">Keep the commands you know. Your app gets its credentials from a vault your team manages.</p>
      <div className="steps-grid">
        {STEPS.map((s) => (
          <article key={s.n} className="glass step-card">
            <div className="step-top"><IconTile tone={s.tone} size="lg">{s.icon}</IconTile><span className="step-num">0{s.n}</span></div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <div className="step-code"><code>{s.cmd}</code><span><Check size={14} strokeWidth={2.5} aria-hidden="true" /><code>{s.ok}</code></span></div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const CONNECT: { to: string; icon: React.ReactNode; tone: Tone; title: string; text: string }[] = [
  { to: '/docs#cli', icon: <Terminal size={20} />, tone: 'blue', title: 'Command line', text: 'Inject secrets into a child process with your usual start command.' },
  { to: '/docs#sdk', icon: <Code2 size={20} />, tone: 'blue', title: 'SDKs', text: 'Read credentials from Node.js, Python or Dart code.' },
  { to: '/docs#mcp', icon: <Bot size={20} />, tone: 'blue', title: 'MCP / AI agents', text: 'Safe secret access for Claude Code, Cursor and Antigravity.' },
  { to: '/docs#api', icon: <Globe size={20} />, tone: 'blue', title: 'REST API', text: 'Connect your own tools with authenticated requests.' },
];

export const ConnectGrid: React.FC = () => (
  <section className="section-shell" aria-labelledby="connect-title">
    <h2 id="connect-title" className="section-title">Choose how you connect.</h2>
    <div className="connect-grid">
      {CONNECT.map((c) => (
        <Link key={c.title} to={c.to} className="glass connect-card">
          <IconTile tone={c.tone}>{c.icon}</IconTile>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
          <ArrowRight size={16} className="connect-arrow" aria-hidden="true" />
        </Link>
      ))}
    </div>
  </section>
);

const PILLARS: { icon: React.ReactNode; tone: Tone; title: string; text: string }[] = [
  { icon: <Lock size={20} />, tone: 'blue', title: 'AES-256-GCM', text: 'Per-secret encryption at rest' },
  { icon: <Server size={20} />, tone: 'blue', title: 'RAM-only keys', text: 'Never written to disk' },
  { icon: <ShieldCheck size={20} />, tone: 'blue', title: 'HMAC-SHA256 ledger', text: 'Chained, signed, verifiable' },
];

export const SecurityBand: React.FC = () => (
  <section className="section-shell security-band-wrap" aria-labelledby="security-band-title">
    <div className="glass security-band vk-glow">
      <div>
        <h2 id="security-band-title" className="section-title">Understand the vault<br />before you trust it.</h2>
        <p>Secrets are encrypted with AES-256-GCM. Keys live in server memory only, and every action is signed into the audit ledger.</p>
        <Link to="/security" className="btn btn-secondary btn-lg">Read the security model <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <ul>
        {PILLARS.map((p) => (
          <li key={p.title}><IconTile tone={p.tone}>{p.icon}</IconTile><span><strong>{p.title}</strong><small>{p.text}</small></span></li>
        ))}
      </ul>
    </div>
  </section>
);

export const CtaBand: React.FC = () => (
  <section className="section-shell cta-band-wrap">
    <div className="cta-band">
      <h2 className="section-title">Start with your own project.</h2>
      <p>The free plan includes 25 secrets, two team members and two access keys. Compare plans when your team needs more.</p>
      <div>
        <Link to="/signup" className="cta-band-primary">Start free <ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/pricing" className="cta-band-secondary">Compare plans</Link>
      </div>
    </div>
  </section>
);
