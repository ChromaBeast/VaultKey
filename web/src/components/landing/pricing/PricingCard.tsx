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
  badge?: string;
}

export const PricingCard: React.FC<{ plan: PlanProps }> = ({ plan }) => {
  return (
    <div
      className={plan.highlighted ? 'glass-glow' : 'glass'}
      style={{
        padding: '32px',
        borderRadius: '16px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: plan.highlighted ? 'rgba(14, 18, 27, 0.95)' : 'rgba(14, 18, 27, 0.55)',
        border: plan.highlighted ? '1px solid rgba(94, 231, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {plan.badge && (
        <div
          style={{
            position: 'absolute',
            top: '-1px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#5ee7ff',
            color: '#080a0f',
            fontSize: '0.68rem',
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            padding: '3px 14px',
            borderRadius: '0 0 8px 8px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {plan.badge}
        </div>
      )}

      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: plan.highlighted ? '#5ee7ff' : '#8b93a3',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'JetBrains Mono, monospace',
              marginBottom: '10px',
            }}
          >
            {plan.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f5f7fa', letterSpacing: '-0.03em' }}>
              {plan.price}
            </span>
            {plan.period && (
              <span style={{ color: '#8b93a3', fontSize: '0.85rem' }}>{plan.period}</span>
            )}
          </div>
          <p style={{ color: '#8b93a3', fontSize: '0.825rem', marginTop: '6px' }}>
            {plan.desc}
          </p>
        </div>

        <div
          style={{
            borderTop: plan.highlighted ? '1px solid rgba(94, 231, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.07)',
            paddingTop: '20px',
            marginBottom: '28px',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plan.features.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', marginTop: '1px', flexShrink: 0 }}>
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
            className={plan.highlighted ? 'btn btn-cyan' : 'btn btn-secondary'}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {plan.ctaText}
          </Link>
        )}
      </div>
    </div>
  );
};
