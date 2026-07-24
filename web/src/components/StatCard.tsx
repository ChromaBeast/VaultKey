import React from 'react';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  accentColor = '#8b5cf6',
}) => {
  return (
    <div
      className="glass"
      style={{
        padding: '20px 24px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: '1 1 200px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          boxShadow: `0 4px 16px ${accentColor}20`,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit, sans-serif', marginTop: '2px' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
