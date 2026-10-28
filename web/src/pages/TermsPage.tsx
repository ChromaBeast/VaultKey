import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPage, LegalSection } from '../components/legal/LegalPage';
import { LEGAL } from '../lib/legal';

const operator = LEGAL.legalEntity || LEGAL.productName;

export const TermsPage: React.FC = () => (
  <LegalPage title="Terms of Service">
    <LegalSection title="1. Agreement">
      <p>
        These terms govern your use of the hosted {LEGAL.productName} service operated by {operator}. By creating an
        account you agree to them on behalf of yourself and the organization you register.
      </p>
    </LegalSection>
    <LegalSection title="2. Your account and credentials">
      <p>
        You are responsible for your master password, API tokens and the activity of members you invite. Your master
        password protects the key that decrypts your secrets; we cannot recover encrypted data if every member with
        access loses their password. Revoke tokens you no longer use.
      </p>
    </LegalSection>
    <LegalSection title="3. Acceptable use">
      <p>
        Do not use the service to store unlawfully obtained data, attack other systems, resell access without
        permission, or interfere with the service's operation. We may suspend accounts that put the service or other
        customers at risk.
      </p>
    </LegalSection>
    <LegalSection title="4. Plans and billing">
      <p>
        Paid plans are billed monthly in Indian Rupees through Razorpay, in advance, and renew automatically until
        cancelled. Applicable taxes are added at checkout. Cancellation and refunds are covered by our{' '}
        <Link to="/refunds" className="text-primary">Refund &amp; Cancellation Policy</Link>. If a renewal payment
        fails, the organization returns to the Free plan at the end of the paid period.
      </p>
    </LegalSection>
    <LegalSection title="5. Your data">
      <p>
        You own the secrets and data you store. We process it only to provide the service, as described in our{' '}
        <Link to="/privacy" className="text-primary">Privacy Policy</Link>. You can export your secrets with the CLI
        at any time. After an account is closed, its data is deleted from the live database and ages out of backups.
      </p>
    </LegalSection>
    <LegalSection title="6. Availability and warranty">
      <p>
        We work to keep the service available and secure, but it is provided &quot;as is&quot; without warranties of
        any kind, to the extent permitted by law. Keep an independent copy of secrets your production systems cannot
        run without.
      </p>
    </LegalSection>
    <LegalSection title="7. Limitation of liability">
      <p>
        To the extent permitted by law, our total liability for any claim is limited to the fees you paid in the three
        months before the claim, and we are not liable for indirect or consequential losses.
      </p>
    </LegalSection>
    <LegalSection title="8. Changes, termination and law">
      <p>
        We may update these terms and will notify account owners of material changes by email. You may stop using the
        service at any time. These terms are governed by the laws of {LEGAL.jurisdiction}. Questions:{' '}
        <a href={`mailto:${LEGAL.supportEmail}`} className="text-primary">{LEGAL.supportEmail}</a>.
      </p>
    </LegalSection>
  </LegalPage>
);
