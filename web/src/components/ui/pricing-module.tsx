"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
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
  annualBillingLabel?: string;
  buttonLabel?: string;
  plans: PricingPlan[];
  defaultAnnual?: boolean;
  className?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export function PricingModule({
  title = "Pricing Plans",
  subtitle = "Choose a plan that fits your needs.",
  annualBillingLabel = "Annual billing",
  buttonLabel = "Get Started",
  plans,
  defaultAnnual = false,
  className,
  onSelectPlan,
}: PricingModuleProps) {
  const [isAnnual, setIsAnnual] = React.useState(defaultAnnual);

  return (
    <div className={cn("w-full text-foreground", className)}>
      <div className="w-full text-center">
        <span className="text-xs font-mono text-[var(--vk-accent)] uppercase font-bold tracking-widest block mb-2">
          Pricing & Plans
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--vk-text)] mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-[var(--vk-text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>

        {/* Dedicated Toggle Row with abundant bottom margin to prevent any overlap */}
        <div className="flex justify-center items-center mb-12 sm:mb-14">
          <div
            role="group"
            aria-label="Billing frequency options"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--vk-surface-1)] border border-[var(--vk-border)] shadow-sm"
          >
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none bg-transparent border-none p-0",
                !isAnnual ? "text-[var(--vk-text)] font-bold" : "text-[var(--vk-text-muted)] hover:text-[var(--vk-text)]"
              )}
            >
              Monthly
            </button>
            <Switch
              id="billing-toggle"
              aria-label={annualBillingLabel}
              checked={isAnnual}
              onCheckedChange={(checked) => setIsAnnual(checked)}
            />
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none flex items-center gap-1.5 bg-transparent border-none p-0",
                isAnnual ? "text-[var(--vk-text)] font-bold" : "text-[var(--vk-text-muted)] hover:text-[var(--vk-text)]"
              )}
            >
              <span>Annual</span>
              <span className="text-[10px] font-mono font-bold text-[var(--vk-accent)] bg-[var(--vk-accent-dim)] border border-[rgba(91,141,239,0.3)] px-2 py-0.5 rounded-full uppercase tracking-wider">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid: 3 spacious columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch w-full text-left">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              buttonLabel={buttonLabel}
              onSelectPlan={onSelectPlan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingModule;
