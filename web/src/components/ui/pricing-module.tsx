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
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">{subtitle}</p>

        {/* Toggle */}
        <div className="inline-flex items-center justify-center gap-3 mb-12 px-4 py-2 rounded-full bg-card/60 border border-white/10">
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={(checked) => setIsAnnual(checked)}
          />
          <label htmlFor="billing-toggle" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
            {annualBillingLabel}
          </label>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col justify-between bg-card/70 backdrop-blur-md border border-white/10 rounded-2xl p-2 transition-all duration-300 hover:shadow-2xl hover:border-primary/40",
                plan.recommended && "border-primary/70 ring-1 ring-primary/40 shadow-xl shadow-primary/10 sm:scale-[1.02]"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-primary text-primary-foreground text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full shadow-lg shadow-primary/30">
                  Recommended
                </div>
              )}

              <CardHeader className="text-center pt-7 pb-4 px-4">
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 justify-between px-4 pb-4 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-1">
                    ${isAnnual ? plan.priceYearly : plan.priceMonthly}
                  </div>
                  <p className="text-xs text-muted-foreground mb-6">/ {isAnnual ? "year" : "month"}</p>

                  <Button
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => onSelectPlan?.(plan)}
                    className={cn("w-full mb-6 font-semibold", !plan.recommended && "border-white/15 hover:bg-accent/40")}
                  >
                    {buttonLabel}
                  </Button>
                </div>

                <div className="text-left text-xs border-t border-white/5 pt-4">
                  <h4 className="font-semibold text-foreground mb-1 tracking-wider uppercase text-[10px]">Overview</h4>
                  <p className="text-muted-foreground mb-3 font-medium">✓ {plan.users}</p>

                  <h4 className="font-semibold text-foreground mb-2 tracking-wider uppercase text-[10px]">Highlights</h4>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
                        )}
                        <span className={f.included ? "text-foreground/90" : "text-muted-foreground/50 line-through"}>
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
