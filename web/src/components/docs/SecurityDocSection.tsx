import React from 'react';

interface SecurityDocProps {
  onCopy?: (id: string, code: string) => void;
  copiedSnippet?: string | null;
  onNavigateNext?: () => void;
}

export const SecurityDocSection: React.FC<SecurityDocProps> = () => {
  return (
    <section id="security" className="docs-subtopic-block scroll-mt-20">
      <h2 className="docs-h2 mb-2">Security</h2>
      <p className="docs-lead-text text-slate-200 leading-relaxed">
        Secrets are encrypted with AES-256-GCM, keys derived with Argon2id, access is role-based, and the audit log is HMAC-chained so tampering is detectable.
      </p>
    </section>
  );
};
