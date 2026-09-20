import * as React from 'react';
import { Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { PricingPlan } from './pricing-module';

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  buttonLabel?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isAnnual,
  buttonLabel = 'Get Started',
  onSelectPlan,
}) => {
  const displayPrice = plan.priceMonthly === 0
    ? 0
    : isAnnual
      ? Math.round(plan.priceYearly / 12)
      : plan.priceMonthly;

  return (
    <div className={cn(
      "flex flex-col justify-between bg-card border border-border rounded-xl p-6 sm:p-7 transition-all duration-200 text-left",
      plan.recommended && "border-primary shadow-xl shadow-primary/10"
    )}>
      {/* Top section: Header, Price & CTA */}
      <div>
        {/* Recommended badge row — always reserved, never overflows */}
        <div className="h-7 mb-3 flex items-center">
          {plan.recommended && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              Recommended
            </span>
          )}
        </div>

        {/* Icon + Name row */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
            {plan.icon}
          </div>
          <h3 className="text-base font-bold text-foreground m-0">
            {plan.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-5 min-h-[38px]">
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-none">
              ${displayPrice}
            </span>
            <span className="text-xs text-muted-foreground">
              {plan.priceMonthly === 0 ? '/ forever' : '/ mo'}
            </span>
          </div>
          {isAnnual && plan.priceYearly > 0 && (
            <div className="text-[11px] font-mono text-primary mt-1.5">
              ${plan.priceYearly} billed annually
            </div>
          )}
        </div>

        {/* CTA button */}
        <Button
          type="button"
          variant={plan.recommended ? "default" : "secondary"}
          onClick={() => onSelectPlan?.(plan)}
          className="w-full h-10 mb-6 font-semibold"
        >
          {buttonLabel}
        </Button>
      </div>

      {/* Features */}
      <div className="border-t border-border pt-5 mt-auto">
        <ul className="space-y-3 m-0 p-0 list-none">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-snug">
              <Check size={14} className="text-primary shrink-0 mt-0.5" />
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
