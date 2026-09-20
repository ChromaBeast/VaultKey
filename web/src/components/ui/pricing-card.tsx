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
      "flex flex-col bg-card border border-border rounded-xl p-6 transition-all duration-200",
      plan.recommended && "border-primary shadow-lg shadow-primary/10"
    )}>
      {/* Recommended badge row — always reserved, never overflows */}
      <div style={{ height: '28px', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        {plan.recommended && (
          <span style={{
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: 'var(--vk-accent)',
            color: '#fff',
          }}>
            Recommended
          </span>
        )}
      </div>

      {/* Icon + Name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: '8px',
          background: 'rgba(0, 143, 245, 0.12)',
          border: '1px solid rgba(0, 143, 245, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--vk-accent)',
          flexShrink: 0,
        }}>
          {plan.icon}
        </div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--vk-text)' }}>
          {plan.name}
        </h3>
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 20px',
        fontSize: '0.8rem',
        color: 'var(--vk-text-secondary)',
        lineHeight: 1.55,
        minHeight: '40px',
      }}>
        {plan.description}
      </p>

      {/* Price */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--vk-text)', lineHeight: 1 }}>
            ${displayPrice}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)' }}>
            {plan.priceMonthly === 0 ? '/ forever' : '/ mo'}
          </span>
        </div>
        {isAnnual && plan.priceYearly > 0 && (
          <div style={{ marginTop: '4px', fontSize: '0.7rem', color: 'var(--vk-accent)', fontFamily: 'var(--font-mono)' }}>
            ${plan.priceYearly} billed annually
          </div>
        )}
      </div>

      {/* CTA button */}
      <Button
        type="button"
        variant={plan.recommended ? "default" : "secondary"}
        onClick={() => onSelectPlan?.(plan)}
        className="w-full mb-6 font-semibold"
      >
        {buttonLabel}
      </Button>

      {/* Features */}
      <div style={{ borderTop: '1px solid var(--vk-border)', paddingTop: '20px', flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {plan.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Check size={14} style={{ color: 'var(--vk-accent)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--vk-text-secondary)', lineHeight: 1.45 }}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
