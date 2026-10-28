import React from 'react';
import { LegalPage, LegalSection } from '../components/legal/LegalPage';
import { LEGAL } from '../lib/legal';

export const RefundPolicyPage: React.FC = () => (
  <LegalPage title="Refund & Cancellation Policy">
    <LegalSection title="Cancelling a subscription">
      <p>
        Organization admins can cancel at any time from the Billing page. Cancellation stops auto-renewal; your plan
        stays active until the end of the period you already paid for, then the organization moves to the Free plan.
        No further charges are made after cancellation.
      </p>
    </LegalSection>
    <LegalSection title="Refunds">
      <p>
        Subscription fees are charged in advance and are not refunded for partially used periods. We refund in full
        any duplicate charge, or a charge made after you cancelled, when you contact us within 7 days of it. For other
        billing problems, write to us and we will review the request.
      </p>
      <p>
        Approved refunds are issued through Razorpay to the original payment method, usually within 5–7 business days
        depending on your bank.
      </p>
    </LegalSection>
    <LegalSection title="Delivery">
      <p>
        {LEGAL.productName} is an online software service. Nothing is shipped: paid features are enabled for your
        organization as soon as the payment is confirmed.
      </p>
    </LegalSection>
    <LegalSection title="Contact">
      <p>
        Billing questions and refund requests:{' '}
        <a href={`mailto:${LEGAL.supportEmail}?subject=Billing`} className="text-primary">{LEGAL.supportEmail}</a>.
        Include your organization name and the Razorpay payment ID.
      </p>
    </LegalSection>
  </LegalPage>
);
