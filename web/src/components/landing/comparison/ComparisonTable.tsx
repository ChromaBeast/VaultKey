import React from 'react';

interface ComparisonDimension {
  feature: string;
  vaultkey: string;
  dotenv: string;
  hashi: string;
}

const COMPARISON_DATA: ComparisonDimension[] = [
  {
    feature: 'Plaintext on disk',
    vaultkey: 'Never — RAM only',
    dotenv: 'Always',
    hashi: 'Temp files / sidecars',
  },
  {
    feature: 'Setup',
    vaultkey: 'Single binary, zero deps',
    dotenv: 'None',
    hashi: 'Cluster + Consul required',
  },
  {
    feature: 'Team sync',
    vaultkey: 'Encrypted (cloud or self-host)',
    dotenv: 'Manual — leaks via Git/Slack',
    hashi: 'Complex IAM policies',
  },
  {
    feature: 'Offline dev',
    vaultkey: 'Full offline support',
    dotenv: 'Yes',
    hashi: 'Requires local server',
  },
  {
    feature: 'Cost',
    vaultkey: 'Free OSS (MIT)',
    dotenv: 'Free',
    hashi: 'BSL / Enterprise pricing',
  },
];

export const ComparisonTable: React.FC = () => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[560px]">
          <thead>
            <tr className="border-b border-border bg-secondary/80">
              <th className="px-6 py-4 text-muted-foreground text-xs font-semibold uppercase tracking-wider">Capability</th>
              <th className="px-6 py-4 text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 border-x border-primary/20">VaultKey</th>
              <th className="px-6 py-4 text-rose-400 text-xs font-semibold uppercase tracking-wider">Plain .env</th>
              <th className="px-6 py-4 text-muted-foreground text-xs font-semibold uppercase tracking-wider">HashiCorp Vault</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {COMPARISON_DATA.map((row) => (
              <tr key={row.feature} className="hover:bg-secondary/40 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">{row.feature}</td>
                <td className="px-6 py-4 text-primary font-bold bg-primary/10 border-x border-primary/20">{row.vaultkey}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.dotenv}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.hashi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
