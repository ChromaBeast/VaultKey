import React from 'react';

const ROWS = [
  ['Plaintext on disk', 'Never', 'Stored in a .env file'],
  ['Run secrets', 'Directly in your app', 'Load them yourself'],
  ['Setup', 'Single binary', 'Add a file'],
];

export const ComparisonTable: React.FC = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left min-w-[520px]">
        <thead>
          <tr className="border-b border-border bg-secondary/70">
            <th className="px-5 py-4 text-muted-foreground text-xs font-semibold uppercase tracking-wider">At a glance</th>
            <th className="px-5 py-4 text-primary text-xs font-bold uppercase tracking-wider">VaultKey</th>
            <th className="px-5 py-4 text-muted-foreground text-xs font-semibold uppercase tracking-wider">.env file</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-sm">
          {ROWS.map(([feature, vaultkey, dotenv]) => (
            <tr key={feature}>
              <td className="px-5 py-4 font-medium text-foreground">{feature}</td>
              <td className="px-5 py-4 text-foreground">{vaultkey}</td>
              <td className="px-5 py-4 text-muted-foreground">{dotenv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
