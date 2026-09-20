"use client";

import * as React from "react";
import { PricingCard } from "./pricing-card";
import { cn } from "@/lib/utils";

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
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mt-3 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Modern Segmented Billing Toggle */}
      <div className="flex justify-center items-center mb-12 sm:mb-16">
        <div className="inline-flex items-center p-1.5 rounded-full bg-secondary border border-border shadow-inner gap-1">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
              !isAnnual
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
              isAnnual
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Annual</span>
            <span
              className={cn(
                "text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors",
                isAnnual
                  ? "bg-white/20 text-white"
                  : "bg-primary/15 text-primary border border-primary/25"
              )}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
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
