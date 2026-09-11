"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
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
    <section className={cn("w-full bg-background text-foreground py-16 sm:py-24 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>

        {/* Dedicated Toggle Row — Guarantees no collision with cards or badges */}
        <div className="flex justify-center items-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-white/10 shadow-lg">
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={(checked) => setIsAnnual(checked)}
            />
            <label htmlFor="billing-toggle" className="text-xs sm:text-sm font-medium text-foreground cursor-pointer select-none">
              {annualBillingLabel}
            </label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col justify-between bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-primary/40",
                plan.recommended && "border-primary/70 ring-1 ring-primary/40 shadow-xl shadow-primary/10"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full shadow-lg shadow-primary/30 z-20 whitespace-nowrap">
                  RECOMMENDED
                </div>
              )}

              <CardHeader className="text-center pt-2 pb-4 px-0">
                <div className="flex justify-center mb-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold tracking-tight text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1.5 h-10 flex items-center justify-center line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 justify-between px-0 pb-0 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    ${isAnnual ? plan.priceYearly : plan.priceMonthly}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 mb-5">/ {isAnnual ? "year" : "month"}</p>

                  <Button
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => onSelectPlan?.(plan)}
                    className={cn(
                      "w-full mb-6 font-semibold py-2.5 transition-all",
                      plan.recommended
                        ? "bg-primary text-black hover:bg-primary/90 shadow-md shadow-primary/25"
                        : "bg-surface-2/60 border-white/10 text-foreground hover:bg-surface-3 hover:border-primary/40"
                    )}
                  >
                    {buttonLabel}
                  </Button>
                </div>

                <div className="text-left text-xs border-t border-white/8 pt-4 mt-auto">
                  <h4 className="font-semibold text-primary/90 mb-1 tracking-wider uppercase text-[10px] font-mono">Overview</h4>
                  <p className="text-muted-foreground mb-3 font-medium text-xs">✓ {plan.users}</p>

                  <h4 className="font-semibold text-primary/90 mb-2 tracking-wider uppercase text-[10px] font-mono">Highlights</h4>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span className={cn(
                          "text-xs leading-relaxed",
                          f.included ? "text-foreground/90" : "text-muted-foreground/40 line-through"
                        )}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingModule;
