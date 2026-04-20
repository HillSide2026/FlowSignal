export const countryOptions = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'EU', label: 'European Union' }
] as const;

export const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'INR', label: 'INR' },
  { value: 'AED', label: 'AED' },
  { value: 'SGD', label: 'SGD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'EUR', label: 'EUR' }
] as const;

export const directionOptions = [
  {
    value: 'receive',
    label: 'Receive money',
    description: 'An international customer or counterparty pays into India.'
  },
  {
    value: 'send',
    label: 'Send money',
    description: 'An Indian business pays an overseas vendor or counterparty.'
  }
] as const;

export const useCaseOptions = [
  { value: 'saas_exports', label: 'SaaS exports' },
  { value: 'services_exports', label: 'Services exports' },
  { value: 'vendor_payments', label: 'Vendor payments' },
  { value: 'import_export_trade_flow', label: 'Import/export trade flow' },
  {
    value: 'recurring_international_flow',
    label: 'Recurring international flow'
  }
] as const;

export const priorityOptions = [
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Compare cost, speed, documentation, and operating effort.'
  },
  {
    value: 'cost',
    label: 'Cost',
    description: 'Look for lower indicative fees and FX spread ranges.'
  },
  {
    value: 'speed',
    label: 'Speed',
    description: 'Prioritize routes with shorter expected settlement windows.'
  }
] as const;

export const defaultScenarioFormValues = {
  direction: 'receive',
  originCountry: 'US',
  destinationCountry: 'IN',
  amount: '75000',
  currency: 'USD',
  businessUseCase: 'saas_exports',
  priority: 'balanced'
};

export const countryLabels = Object.fromEntries(
  countryOptions.map((option) => [option.value, option.label])
) as Record<string, string>;

export const useCaseLabels = Object.fromEntries(
  useCaseOptions.map((option) => [option.value, option.label])
) as Record<string, string>;

export const priorityLabels = Object.fromEntries(
  priorityOptions.map((option) => [option.value, option.label])
) as Record<string, string>;

export const directionLabels = Object.fromEntries(
  directionOptions.map((option) => [option.value, option.label])
) as Record<string, string>;

