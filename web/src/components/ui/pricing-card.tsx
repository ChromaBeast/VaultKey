import * as React from 'react';
import { Check } from 'lucide-react';
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--vk-surface-1)',
      border: plan.recommended
        ? '1px solid var(--vk-accent)'
        : '1px solid var(--vk-border)',
      borderRadius: '14px',
      padding: '24px',
      boxShadow: plan.recommended
        ? '0 0 0 1px rgba(91,141,239,0.2), 0 8px 32px rgba(91,141,239,0.08)'
        : 'none',
    }}>
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
          background: 'rgba(91,141,239,0.1)',
          border: '1px solid rgba(91,141,239,0.2)',
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
      <button
        type="button"
        onClick={() => onSelectPlan?.(plan)}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          background: plan.recommended ? 'var(--vk-accent)' : 'var(--vk-surface-2)',
          color: plan.recommended ? '#fff' : 'var(--vk-text)',
          border: plan.recommended ? 'none' : '1px solid var(--vk-border)',
          marginBottom: '24px',
          transition: 'opacity 0.15s ease',
        }}
      >
        {buttonLabel}
      </button>

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
