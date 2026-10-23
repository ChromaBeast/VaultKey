import React, { useEffect, useState } from 'react';
import { isAdminRole } from '../lib/permissions';
import { errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { CancelSubscriptionButton } from '../components/CancelSubscriptionButton';
import { PaymentHistoryTable } from '../components/PaymentHistoryTable';
import { fetchPaymentHistory } from '../lib/payments';
import type { PaymentRecord } from '../types/payment';
import { PageHeader } from '../components/ui/PageHeader';

const ENTERPRISE_MAILTO = 'mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20inquiry';

export const BillingPage: React.FC = () => {
  const { org, user } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const currentPlan = org?.plan || 'free';
  const subStatus = org?.subscription_status || 'none';
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const loadHistory = async () => {
      try {
        const data = await fetchPaymentHistory();
        if (!cancelled) setPayments(data || []);
      } catch (error) {
        if (!cancelled) setHistoryError(errorMessage(error, "Could not load payment history."));
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };
    void loadHistory();
    return () => { cancelled = true; };
  }, [org?.plan, org?.subscription_status, isAdmin]);

  return (
    <div className="animate-fade">
      <PageHeader
        title="Billing"
        description={isAdmin ? "Manage your plan and payment history." : "View workspace plans. An administrator manages billing."}
      />

      {org?.subscription_id && (
        <div className="glass p-4 sm:p-5 mb-7 flex items-center justify-between flex-wrap gap-3.5 rounded-xl border border-primary/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Active Subscription</h3>
              <span className={subStatus === 'active' ? 'badge badge-write' : 'badge badge-danger'}>
                {subStatus}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Subscription ID: <code className="text-primary font-mono">{org.subscription_id}</code>
              {org.current_period_end && (
                <span className="ml-3">
                  {subStatus === 'cancelled' ? 'Ends:' : 'Renews:'} {new Date(org.current_period_end).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          {isAdmin && subStatus === 'active' && <CancelSubscriptionButton onSuccess={() => undefined} />}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
        {/* Free Starter */}
        <div className="glass p-6 flex flex-col rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-foreground">Free Starter</h3>
            {currentPlan === 'free' && <span className="badge badge-neutral">Active</span>}
          </div>
          <div className="text-3xl font-extrabold my-3.5 text-foreground">
            ₹0 <span className="text-sm text-muted-foreground font-normal">/ forever</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            For individual developers and small personal projects.
          </p>
          <ul className="space-y-2 mb-6 flex-1 text-xs text-muted-foreground border-t border-border pt-4">
            <li className="flex items-center gap-2">✓ 25 encrypted secrets</li>
            <li className="flex items-center gap-2">✓ 2 active scoped API tokens</li>
            <li className="flex items-center gap-2">✓ CLI runtime process injection</li>
            <li className="flex items-center gap-2">✓ Node.js, Python, and Dart SDKs</li>
          </ul>
          <button className="btn btn-secondary w-full justify-center" disabled>
            {currentPlan === 'free' ? 'Active Plan' : 'Free Tier'}
          </button>
        </div>

        {/* Pro Team */}
        <div className="glass-glow p-6 flex flex-col relative rounded-xl border border-primary/40">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-primary">Pro Team</h3>
            {currentPlan === 'pro' && <span className="badge badge-write">Active</span>}
          </div>
          <div className="text-3xl font-extrabold my-3.5 text-foreground">
            ₹1,499 <span className="text-sm text-muted-foreground font-normal">($19) / mo</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Full cryptographic security and collaboration for teams.
          </p>
          <ul className="space-y-2 mb-6 flex-1 text-xs text-muted-foreground border-t border-border pt-4">
            <li className="flex items-center gap-2 text-foreground">✓ Unlimited secrets & projects</li>
            <li className="flex items-center gap-2 text-foreground">✓ Multi-user envelope key wrapping</li>
            <li className="flex items-center gap-2 text-foreground">✓ HMAC-SHA256 chained audit ledger</li>
            <li className="flex items-center gap-2 text-foreground">✓ Secret rollback & 1-time share links</li>
          </ul>
          {isAdmin ? <RazorpayCheckoutButton
            plan="pro"
            planName="Pro Team"
            amountLabel="₹1,499"
            isCurrentPlan={currentPlan === 'pro'}
            onSuccess={() => undefined}
          /> : <p className="text-sm text-muted-foreground">Ask an administrator to change your plan.</p>}
        </div>

        {/* Enterprise */}
        <div className="glass p-6 flex flex-col rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-foreground">Enterprise</h3>
            {currentPlan === 'enterprise' && <span className="badge badge-neutral">Active</span>}
          </div>
          <div className="text-3xl font-extrabold my-3.5 text-foreground">Custom</div>
          <p className="text-xs text-muted-foreground mb-4">
            Dedicated infrastructure, custom compliance, and air-gapped SLA.
          </p>
          <ul className="space-y-2 mb-6 flex-1 text-xs text-muted-foreground border-t border-border pt-4">
            <li className="flex items-center gap-2">✓ Self-hosted Docker deployment</li>
            <li className="flex items-center gap-2">✓ Custom audit retention & SIEM integration</li>
            <li className="flex items-center gap-2">✓ Security architecture review</li>
            <li className="flex items-center gap-2">✓ Priority SLA & support</li>
          </ul>
          <a href={ENTERPRISE_MAILTO} className="btn btn-secondary w-full justify-center">
            Contact Sales
          </a>
        </div>
      </div>

      {isAdmin && <div>
        <h2 className="text-lg font-bold text-foreground mb-3.5">
          Payment history
        </h2>
        {historyLoading ? <p role="status" className="text-sm text-muted-foreground">Loading payment history…</p> :
          historyError ? <p role="alert" className="text-sm text-destructive">{historyError} Reload this page to retry.</p> :
          <PaymentHistoryTable payments={payments} />}
      </div>}
    </div>
  );
};
