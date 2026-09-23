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
  className?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export function PricingModule({
  title = "Pricing Plans",
  subtitle,
  plans,
  onSelectPlan,
}: PricingModuleProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="section-header-center">
        <span className="section-eyebrow">Pricing</span>
        <h2 className="section-title">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mt-3 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelectPlan={onSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}

export default PricingModule;
