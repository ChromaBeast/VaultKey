import React from 'react';
import { LegalPage, LegalSection } from '../components/legal/LegalPage';
import { LEGAL } from '../lib/legal';

export const ContactPage: React.FC = () => (
  <LegalPage title="Contact Us">
    <LegalSection title="Support and billing">
      <p>
        Email: <a href={`mailto:${LEGAL.supportEmail}`} className="text-primary">{LEGAL.supportEmail}</a>
      </p>
      {LEGAL.phone && <p>Phone: {LEGAL.phone}</p>}
      <p>We reply within two business days. For billing issues, include your organization name and payment ID.</p>
    </LegalSection>
    {(LEGAL.legalEntity || LEGAL.address) && (
      <LegalSection title="Registered business">
        {LEGAL.legalEntity && <p>{LEGAL.legalEntity}</p>}
        {LEGAL.address && <p className="whitespace-pre-line">{LEGAL.address}</p>}
      </LegalSection>
    )}
    <LegalSection title="Security reports">
      <p>
        Found a vulnerability? Email{' '}
        <a href={`mailto:${LEGAL.supportEmail}?subject=Security%20report`} className="text-primary">{LEGAL.supportEmail}</a>{' '}
        with steps to reproduce. Please give us reasonable time to fix it before public disclosure.
      </p>
    </LegalSection>
  </LegalPage>
);
