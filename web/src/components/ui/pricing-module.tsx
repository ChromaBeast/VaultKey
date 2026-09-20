"use client";

import * as React from "react";
import { PricingCard } from "./pricing-card";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  priceMonthly: number;
  priceYearly: number;
  features: PlanFeature[];
  recommended?: boolean;
}

export interface PricingModuleProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  defaultAnnual?: boolean;
  className?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export function PricingModule({
  title = "Pricing Plans",
  subtitle,
  plans,
  defaultAnnual = false,
  onSelectPlan,
}: PricingModuleProps) {
  const [isAnnual, setIsAnnual] = React.useState(defaultAnnual);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="section-header-center">
        <span className="section-eyebrow">
          Pricing &amp; Plans
        </span>
        <h2 className="section-title">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center mb-10">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 18px',
          borderRadius: '9999px',
          background: 'var(--vk-surface-1)',
          border: '1px solid var(--vk-border)',
        }}>
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.85rem',
              fontWeight: isAnnual ? 400 : 700,
              color: isAnnual ? 'var(--vk-text-muted)' : 'var(--vk-text)',
              cursor: 'pointer',
            }}
          >
            Monthly
          </button>

          {/* Simple visual toggle */}
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: '40px',
              height: '22px',
              borderRadius: '9999px',
              background: isAnnual ? 'var(--vk-accent)' : 'var(--vk-surface-3)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
              transition: 'background 0.2s ease',
            }}
            aria-checked={isAnnual}
            role="switch"
          >
            <span style={{
              position: 'absolute',
              top: '3px',
              left: isAnnual ? '21px' : '3px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s ease',
            }} />
          </button>

          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.85rem',
              fontWeight: isAnnual ? 700 : 400,
              color: isAnnual ? 'var(--vk-text)' : 'var(--vk-text-muted)',
              cursor: 'pointer',
            }}
          >
            Annual
            <span style={{
              fontSize: '0.6rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--vk-accent)',
              background: 'rgba(0, 143, 245, 0.12)',
              border: '1px solid rgba(0, 143, 245, 0.25)',
              padding: '2px 7px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isAnnual={isAnnual}
            onSelectPlan={onSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}

export default PricingModule;
