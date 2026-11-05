import * as React from 'react';
import { Check, Server, Sparkles, Zap } from 'lucide-react';
import { IconTile, type Tone } from './IconTile';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { PricingPlan } from './pricing-module';

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan?: (plan: PricingPlan) => void;
}

const PLAN_STYLE: Record<string, { tone: Tone; icon: React.ReactNode }> = {
  oss: { tone: 'blue', icon: <Zap size={20} /> },
  pro: { tone: 'violet', icon: <Sparkles size={20} /> },
  enterprise: { tone: 'cyan', icon: <Server size={20} /> },
};

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan }) => (
  <div className={cn('glass flex h-full flex-col p-6 text-left sm:p-8', plan.recommended && 'border-[1.5px] border-primary shadow-[0_20px_50px_rgba(0,143,245,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]')}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <IconTile tone={(PLAN_STYLE[plan.id] ?? PLAN_STYLE.oss).tone}>{(PLAN_STYLE[plan.id] ?? PLAN_STYLE.oss).icon}</IconTile>
        <h3 className="text-2xl font-extrabold text-foreground">{plan.name}</h3>
      </div>
      {plan.comingSoon && (
        <span className="badge badge-neutral">Coming soon</span>
      )}
      {plan.recommended && !plan.comingSoon && <span className="badge badge-tone tone-blue">Recommended</span>}
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

    <div className="mt-8 flex items-baseline gap-2">
      <span className={cn('font-[var(--font-display)] text-5xl font-extrabold tracking-tight', plan.recommended ? 'text-[var(--blue-light)]' : 'text-foreground')}>
        {plan.id === 'enterprise' ? 'Custom' : plan.priceMonthly === 0 ? '₹0' : `₹${plan.priceMonthly.toLocaleString('en-IN')}`}
      </span>
      {plan.id !== 'enterprise' && <span className="text-sm text-muted-foreground">{plan.priceMonthly === 0 ? 'forever' : '/ workspace / month'}</span>}
    </div>

    <ul className="mt-7 mb-8 space-y-3 border-t border-border pt-6">
      {plan.features.filter((feature) => feature.included).map((feature) => (
        <li key={feature.label} className="flex items-start gap-3 text-sm text-[#cbd5e1]">
          <Check size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--success)]" aria-hidden="true" />
          <span>{feature.label}</span>
        </li>
      ))}
    </ul>

    <Button type="button" variant={plan.recommended ? 'default' : 'secondary'} onClick={() => onSelectPlan?.(plan)} className="mt-auto h-12 w-full">
      {plan.id === 'enterprise' ? 'Contact us' : plan.comingSoon ? 'Start free for now' : 'Get started'}
    </Button>
  </div>
);
