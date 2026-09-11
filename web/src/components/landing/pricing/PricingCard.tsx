import React from 'react';
import { Link } from 'react-router-dom';

export interface PlanProps {
  id: string;
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
}

export const PricingCard: React.FC<{ plan: PlanProps }> = ({ plan }) => {
  return (
    <div
      className="glass"
      style={{
        padding: '32px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: plan.highlighted ? 'rgba(16, 20, 32, 0.85)' : 'rgba(14, 18, 27, 0.55)',
        border: plan.highlighted ? '1px solid rgba(60, 237, 235, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              color: plan.highlighted ? 'var(--vk-accent)' : 'var(--vk-text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              marginBottom: '10px',
            }}
          >
            {plan.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.03em' }}>
              {plan.price}
            </span>
            {plan.period && (
              <span style={{ color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)' }}>{plan.period}</span>
            )}
          </div>
          <p style={{ color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '6px' }}>
            {plan.desc}
          </p>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            paddingTop: '20px',
            marginBottom: '28px',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plan.features.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--vk-text-secondary)' }}>
                <span style={{ color: 'var(--vk-success)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', marginTop: '1px', flexShrink: 0 }}>
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        {plan.ctaLink.startsWith('mailto:') ? (
          <a
            href={plan.ctaLink}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {plan.ctaText}
          </a>
        ) : (
          <Link
            to={plan.ctaLink}
            className={plan.highlighted ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {plan.ctaText}
          </Link>
        )}
      </div>
    </div>
  );
};
