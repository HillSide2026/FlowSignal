import type {
  BusinessUseCase,
  PaymentDirection,
  ScenarioPriority,
  SupportedCorridor,
  SupportedCountryCode
} from './types';

export const SUPPORTED_DIRECTIONS = ['send', 'receive'] as const satisfies
  readonly PaymentDirection[];

export const SUPPORTED_PRIORITIES = ['cost', 'speed', 'balanced'] as const satisfies
  readonly ScenarioPriority[];

export const SUPPORTED_USE_CASES = [
  'saas_exports',
  'services_exports',
  'vendor_payments',
  'import_export_trade_flow',
  'recurring_international_flow'
] as const satisfies readonly BusinessUseCase[];

export const SUPPORTED_COUNTRIES = [
  'IN',
  'US',
  'AE',
  'SG',
  'GB',
  'EU'
] as const satisfies readonly SupportedCountryCode[];

export const SUPPORTED_CORRIDORS = [
  'IN-US',
  'IN-AE',
  'IN-SG',
  'IN-GB',
  'IN-EU'
] as const satisfies readonly SupportedCorridor[];

export const COUNTRY_ALIASES: Record<string, SupportedCountryCode> = {
  ae: 'AE',
  'united arab emirates': 'AE',
  uae: 'AE',
  emirates: 'AE',
  eu: 'EU',
  europe: 'EU',
  'european union': 'EU',
  gb: 'GB',
  greatbritain: 'GB',
  'great britain': 'GB',
  uk: 'GB',
  'united kingdom': 'GB',
  in: 'IN',
  india: 'IN',
  sg: 'SG',
  singapore: 'SG',
  us: 'US',
  usa: 'US',
  'u s': 'US',
  'u s a': 'US',
  'united states': 'US',
  'united states of america': 'US'
};

export const USE_CASE_ALIASES: Record<string, BusinessUseCase> = {
  'import export trade flow': 'import_export_trade_flow',
  'import/export trade flow': 'import_export_trade_flow',
  import: 'import_export_trade_flow',
  export: 'import_export_trade_flow',
  trade: 'import_export_trade_flow',
  'trade flow': 'import_export_trade_flow',
  recurring: 'recurring_international_flow',
  'recurring international flow': 'recurring_international_flow',
  'recurring flows': 'recurring_international_flow',
  saas: 'saas_exports',
  'saas export': 'saas_exports',
  'saas exports': 'saas_exports',
  services: 'services_exports',
  'services export': 'services_exports',
  'services exports': 'services_exports',
  vendor: 'vendor_payments',
  'vendor payment': 'vendor_payments',
  'vendor payments': 'vendor_payments'
};

export const HIGH_VALUE_THRESHOLDS_BY_CURRENCY: Record<string, number> = {
  AED: 180000,
  EUR: 50000,
  GBP: 40000,
  INR: 4000000,
  SGD: 70000,
  USD: 50000
};
