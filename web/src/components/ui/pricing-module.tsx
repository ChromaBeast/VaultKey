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
  users: string;
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
  buttonLabel = "Get started",
  plans,
  defaultAnnual = false,
  className,
  onSelectPlan,
}: PricingModuleProps) {
  const [isAnnual, setIsAnnual] = React.useState(defaultAnnual);

  return (
    <div className={cn("w-full text-foreground", className)}>
      <div className="w-full text-center">
        <span className="text-xs font-mono text-primary uppercase font-bold tracking-widest block mb-2">
          Pricing & Plans
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
          {subtitle}
        </p>

        {/* Dedicated Toggle Row with Dual Monthly/Annual Labels */}
        <div className="flex justify-center items-center mb-8 sm:mb-10">
          <div
            role="group"
            aria-label="Billing frequency options"
            className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-white/10 shadow-lg"
          >
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none bg-transparent border-none p-0",
                !isAnnual ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
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
                isAnnual ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Annual</span>
              <span className="text-[10px] font-bold text-primary bg-primary/15 border border-primary/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {annualBillingLabel.includes('(')
                  ? annualBillingLabel.slice(annualBillingLabel.indexOf('(') + 1, annualBillingLabel.indexOf(')'))
                  : 'Save 20%'}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 items-stretch w-full">
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
