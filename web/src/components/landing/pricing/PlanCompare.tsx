import React from 'react';
import { Check, Minus } from 'lucide-react';

const ROWS: [string, string, string, string][] = [
  ['Secrets', '25', 'Unlimited', 'Unlimited'],
  ['Team members', '2', 'Unlimited', 'Unlimited'],
  ['API tokens', '2', 'Unlimited', 'Unlimited'],
  ['Version history & rollback', '–', '✓', '✓'],
  ['One-time share links', '–', '✓', '✓'],
  ['Self-hosted deployment', '–', '–', '✓'],
  ['Custom audit retention', '–', '–', '✓'],
];

const Cell: React.FC<{ value: string }> = ({ value }) => {
  if (value === '✓') return <Check size={18} strokeWidth={2.5} aria-label="Included" style={{ color: 'var(--success)' }} />;
  if (value === '–') return <Minus size={16} aria-label="Not included" style={{ color: 'var(--vk-text-muted)' }} />;
  return <>{value}</>;
};

export const PlanCompare: React.FC = () => (
  <section className="section-shell" aria-labelledby="compare-title">
    <h2 id="compare-title" className="section-title">Compare plans</h2>
    <p className="section-lede">Everything in Free is included in Team.</p>
    <div className="table-wrap glass plan-compare">
      <table>
        <thead><tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col" style={{ color: 'var(--violet-light)' }}>Team</th><th scope="col">Enterprise</th></tr></thead>
        <tbody>{ROWS.map(([feature, ...cells]) => (
          <tr key={feature}><th scope="row">{feature}</th>{cells.map((c, i) => <td key={i}><Cell value={c} /></td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  </section>
);
