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
        'flex flex-col bg-[var(--vk-surface-1)] border border-[var(--vk-border)] rounded-[var(--radius-lg)] p-6 transition-all duration-200 hover:border-[var(--vk-border-strong)]',
        plan.recommended && 'border-[var(--vk-accent)] shadow-lg'
      )}
    >
      {/* Recommended badge — dedicated row, never overlaps */}
      <div style={{ minHeight: '24px', marginBottom: '14px' }}>
        {plan.recommended && (
          <span style={{
            display: 'inline-block',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: 'var(--vk-accent)',
            color: '#fff',
          }}>
            Recommended
          </span>
        )}
      </div>

      {/* Icon + Plan Name */}
      <div className="flex items-center gap-2.5 mb-2">
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: 'rgba(91,141,239,0.1)',
          border: '1px solid rgba(91,141,239,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--vk-accent)',
          flexShrink: 0,
        }}>
          {plan.icon}
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--vk-text)', margin: 0 }}>
          {plan.name}
        </h3>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.8rem', color: 'var(--vk-text-secondary)', lineHeight: 1.5, margin: '0 0 20px' }}>
        {plan.description}
      </p>

      {/* Price */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--vk-text)', lineHeight: 1 }}>
            ${displayPrice}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)' }}>
            {plan.priceMonthly === 0 ? '/ forever' : '/ month'}
          </span>
        </div>
        {isAnnual && plan.priceYearly > 0 && (
          <p style={{ fontSize: '0.7rem', color: 'var(--vk-accent)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ${plan.priceYearly} billed annually
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onSelectPlan?.(plan)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          border: plan.recommended ? 'none' : '1px solid var(--vk-border)',
          background: plan.recommended ? 'var(--vk-accent)' : 'var(--vk-surface-2)',
          color: plan.recommended ? '#fff' : 'var(--vk-text)',
          marginBottom: '24px',
        }}
      >
        {buttonLabel}
      </button>

      {/* Features */}
      <div style={{ borderTop: '1px solid var(--vk-border)', paddingTop: '20px', flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {plan.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.8rem', color: 'var(--vk-text-secondary)' }}>
              <Check size={14} style={{ color: 'var(--vk-accent)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: 1.4 }}>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
