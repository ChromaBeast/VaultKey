import * as React from 'react';
import { Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { PricingPlan } from './pricing-module';

interface PricingCardProps {
  plan: PricingPlan;
  buttonLabel?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  buttonLabel = 'Get Started',
  onSelectPlan,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border transition-all duration-300 text-left p-7 sm:p-8",
        plan.recommended
          ? "bg-gradient-to-b from-[#141d2e] via-card to-card border-primary/50 shadow-2xl shadow-primary/15 ring-1 ring-primary/30"
          : "bg-card border-border hover:border-border-strong shadow-xl shadow-black/25"
      )}
    >
      <div>
        {/* Top row: Icon and Recommended Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
            {plan.icon}
          </div>
          {plan.recommended && (
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/40">
              Recommended
            </span>
          )}
        </div>

        {/* Plan Name & Description */}
        <h3 className="text-xl font-bold text-foreground">
          {plan.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2 min-h-[42px]">
          {plan.description}
        </p>

        {/* Price Display */}
        <div className="mt-6 mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-none">
              {plan.id === 'enterprise' ? 'Custom' : plan.priceMonthly === 0 ? '$0' : '₹1,499'}
            </span>
            {plan.id !== 'enterprise' && <span className="text-sm text-muted-foreground font-medium ml-2">{plan.priceMonthly === 0 ? '/ forever' : '/ month'}</span>}
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="button"
          variant={plan.recommended ? "default" : "secondary"}
          onClick={() => onSelectPlan?.(plan)}
          className="w-full h-11 rounded-xl mb-6 font-semibold text-sm"
        >
          {plan.id === 'enterprise' ? 'Contact us' : buttonLabel}
        </Button>
      </div>

      {/* Feature List */}
      <div className="border-t border-border/80 pt-6 mt-auto">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-4">
          What&apos;s included
        </div>
        <ul className="space-y-3.5 m-0 p-0 list-none">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 leading-snug">
              <div className="w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} strokeWidth={3} />
              </div>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
