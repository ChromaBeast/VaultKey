import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PricingPlan } from './pricing-module';

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  buttonLabel: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isAnnual,
  buttonLabel,
  onSelectPlan,
}) => {
  return (
    <Card
      className={cn(
        'relative flex flex-col justify-between bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 xl:p-6 transition-all duration-300 hover:shadow-2xl hover:border-primary/40',
        plan.recommended && 'border-primary/70 ring-1 ring-primary/40 shadow-xl shadow-primary/10'
      )}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-extrabold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-lg shadow-primary/30 z-20 whitespace-nowrap">
          RECOMMENDED
        </div>
      )}

      <CardHeader className="text-center pt-1 pb-3 px-0">
        <div className="flex justify-center mb-2.5">
          <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
            {plan.icon}
          </div>
        </div>
        <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">{plan.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1 h-9 flex items-center justify-center line-clamp-2">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 justify-between px-0 pb-0 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            ${isAnnual ? plan.priceYearly : plan.priceMonthly}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">/ {isAnnual ? 'year' : 'month'}</p>

          <Button
            variant={plan.recommended ? 'default' : 'outline'}
            onClick={() => onSelectPlan?.(plan)}
            className={cn(
              'w-full h-10 font-semibold transition-all text-xs sm:text-sm',
              plan.recommended
                ? 'bg-primary text-black hover:bg-primary/90 shadow-md shadow-primary/25'
                : 'bg-surface-2/60 border-white/10 text-foreground hover:bg-surface-3 hover:border-primary/40'
            )}
          >
            {buttonLabel}
          </Button>
        </div>

        <div className="text-left text-xs border-t border-white/10 pt-4 mt-4">
          <h4 className="font-semibold text-primary/90 mb-1.5 tracking-wider uppercase text-[10px] font-mono">Overview</h4>
          <p className="text-muted-foreground mb-2.5 font-medium text-xs">✓ {plan.users}</p>

          <h4 className="font-semibold text-primary/90 mb-1.5 tracking-wider uppercase text-[10px] font-mono">Highlights</h4>
          <ul className="space-y-1.5">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                {f.included ? (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <X className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />
                )}
                <span className={cn(
                  'text-xs leading-snug',
                  f.included ? 'text-foreground/90' : 'text-muted-foreground/40 line-through'
                )}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
