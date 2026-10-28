// Business details shown on the Terms, Refund and Contact pages. Razorpay's
// website review expects a legal entity name and operating address on the
// Contact page; fill these in before switching Razorpay to live mode.
// Empty values are simply not rendered.
export const LEGAL = {
  productName: 'VaultKey',
  legalEntity: '',
  address: '',
  supportEmail: 'sheersh@vaultkey.dev',
  phone: '',
  jurisdiction: 'India',
  lastUpdated: 'October 2026',
} as const;
