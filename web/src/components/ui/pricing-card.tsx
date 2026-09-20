import * as React from 'react';
import { Check } from 'lucide-react';
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
    <div
      className={cn(
        'relative flex flex-col justify-between bg-[var(--vk-surface-1)] border border-[var(--vk-border)] rounded-[var(--radius-xl)] p-6 sm:p-7 transition-all duration-200 hover:border-[var(--vk-border-hover)] shadow-sm',
        plan.recommended && 'border-[var(--vk-accent)] ring-1 ring-[var(--vk-accent)]/30 shadow-xl shadow-[var(--vk-accent)]/5'
      )}
    >
      <div>
        {/* Card Header: Icon + Name + Recommended Pill INSIDE header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[var(--vk-accent-dim)] border border-[rgba(91,141,239,0.25)] flex items-center justify-center text-[var(--vk-accent)] shrink-0">
              {plan.icon}
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--vk-text)]">
              {plan.name}
            </h3>
          </div>
          {plan.recommended && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--vk-accent)] text-white shadow-sm shrink-0">
              Recommended
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--vk-text-secondary)] min-h-[36px] leading-relaxed mb-5">
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--vk-text)]">
              ${displayPrice}
            </span>
            <span className="text-xs text-[var(--vk-text-muted)]">
              {plan.priceMonthly === 0 ? '/ forever' : '/ month'}
            </span>
          </div>
          {isAnnual && plan.priceYearly > 0 && (
            <p className="text-[11px] text-[var(--vk-accent)] font-mono mt-1">
              Billed annually (${plan.priceYearly}/yr)
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onSelectPlan?.(plan)}
          className={cn(
            'w-full py-2.5 px-4 rounded-[var(--radius-md)] font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center',
            plan.recommended
              ? 'bg-[var(--vk-accent)] text-white hover:bg-[var(--vk-accent-hover)] shadow-sm'
              : 'bg-[var(--vk-surface-2)] border border-[var(--vk-border)] text-[var(--vk-text)] hover:bg-[var(--vk-surface-3)] hover:border-[var(--vk-border-hover)]'
          )}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Feature List (clean and unified without duplicate headers) */}
      <div className="pt-6 border-t border-[var(--vk-border)] mt-6">
        <ul className="space-y-3">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--vk-text-secondary)]">
              <Check className="w-4 h-4 text-[var(--vk-accent)] shrink-0 mt-0.5" />
              <span className="leading-snug">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
