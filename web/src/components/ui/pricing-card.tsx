import * as React from 'react';
import { Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { PricingPlan } from './pricing-module';

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan }) => (
  <div className={cn('flex h-full flex-col rounded-xl border bg-card p-6 text-left sm:p-7', plan.recommended ? 'border-primary/60' : 'border-border')}>
    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

    <div className="mt-8 flex items-baseline gap-2">
      <span className="text-4xl font-extrabold tracking-tight text-foreground">
        {plan.id === 'enterprise' ? 'Custom' : plan.priceMonthly === 0 ? '₹0' : `₹${plan.priceMonthly.toLocaleString('en-IN')}`}
      </span>
      {plan.id !== 'enterprise' && <span className="text-sm text-muted-foreground">{plan.priceMonthly === 0 ? 'forever' : '/ month'}</span>}
    </div>

    <ul className="mt-7 mb-8 space-y-3 border-t border-border pt-6">
      {plan.features.filter((feature) => feature.included).map((feature) => (
        <li key={feature.label} className="flex items-start gap-3 text-sm text-muted-foreground">
          <Check size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <span>{feature.label}</span>
        </li>
      ))}
    </ul>

    <Button type="button" variant={plan.recommended ? 'default' : 'secondary'} onClick={() => onSelectPlan?.(plan)} className="mt-auto h-11 w-full rounded-lg">
      {plan.id === 'enterprise' ? 'Contact us' : 'Get started'}
    </Button>
  </div>
);
