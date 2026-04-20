export type PaymentDirection = 'send' | 'receive';

export type ScenarioPriority = 'cost' | 'speed' | 'balanced';

export type BusinessUseCase =
  | 'saas_exports'
  | 'services_exports'
  | 'vendor_payments'
  | 'import_export_trade_flow'
  | 'recurring_international_flow';

export type SupportedCountryCode = 'IN' | 'US' | 'AE' | 'SG' | 'GB' | 'EU';

export type SupportedCorridor =
  | 'IN-US'
  | 'IN-AE'
  | 'IN-SG'
  | 'IN-GB'
  | 'IN-EU';

export type RouteType =
  | 'bank_swift'
  | 'fintech_assisted'
  | 'local_rails'
  | 'trade_bank_route';

export type ComplianceLevel = 'low' | 'moderate' | 'high';

export type ComplexityLevel = 'low' | 'moderate' | 'high';

export type RiskSeverity = 'info' | 'watch' | 'elevated';

export type FlowPointsConfig = {
  amount: number;
  disclosure: string;
};

export type FlowPointsMetadata = FlowPointsConfig & {
  label: string;
};

export type ScenarioInput = {
  direction: PaymentDirection | string;
  sourceCountry?: string;
  originCountry?: string;
  destinationCountry?: string;
  corridor?:
    | string
    | {
        sourceCountry?: string;
        originCountry?: string;
        destinationCountry: string;
      };
  amount: number | string;
  currency: string;
  businessUseCase: BusinessUseCase | string;
  priority: ScenarioPriority | string;
};

export type NormalizedScenarioInput = {
  direction: PaymentDirection;
  sourceCountry: SupportedCountryCode;
  destinationCountry: SupportedCountryCode;
  corridor: SupportedCorridor;
  amount: number;
  currency: string;
  businessUseCase: BusinessUseCase;
  priority: ScenarioPriority;
};

export type CostRange = {
  minPercent: number;
  maxPercent: number;
  summary: string;
};

export type EstimatedTimeline = {
  minBusinessDays: number;
  maxBusinessDays: number;
  summary: string;
};

export type DocumentationSummary = {
  summary: string;
  requirements: string[];
};

export type RiskFlag = {
  code: string;
  severity: RiskSeverity;
  summary: string;
};

export type PartnerRule = {
  id: string;
  name: string;
  description: string;
  supportedRoutes: string[];
  supportedCorridors: SupportedCorridor[];
  supportedDirections: PaymentDirection[];
  supportedUseCases: BusinessUseCase[];
  supportedCurrencies: string[];
  costProfile: string;
  speedProfile: string;
  regulatoryFit: string;
  bestUseCase: string;
  whyThisPartner: string;
  flowPoints: FlowPointsConfig | null;
  displayOrder: number;
};

export type PartnerRulesConfig = {
  rulesVersion: string;
  partners: PartnerRule[];
};

export type ProviderMatch = {
  providerId: string;
  providerName: string;
  description: string;
  routeId: string;
  routeName: string;
  routeType: RouteType;
  costProfile: string;
  speedProfile: string;
  regulatoryFit: string;
  bestUseCase: string;
  whyThisPartner: string;
  matchedOn: {
    corridor: SupportedCorridor;
    direction: PaymentDirection;
    businessUseCase: BusinessUseCase;
    currency: string;
  };
  flowPoints: FlowPointsMetadata | null;
};

export type RecommendationTag =
  | {
      tag: 'best_for_cost';
      label: 'Best for cost';
      reason: string;
    }
  | {
      tag: 'best_for_speed';
      label: 'Best for speed';
      reason: string;
    }
  | {
      tag: 'best_for_simplicity';
      label: 'Best for simplicity';
      reason: string;
    }
  | {
      tag: 'priority_fit';
      label: 'Fits selected priority';
      reason: string;
    };

export type RouteResult = {
  routeId: string;
  routeName: string;
  routeType: RouteType;
  costRange: CostRange;
  estimatedTimeline: EstimatedTimeline;
  complianceLevel: ComplianceLevel;
  complexityLevel: ComplexityLevel;
  documentation: DocumentationSummary;
  riskFlags: RiskFlag[];
  tradeoffSummary: string;
  recommendationTags: RecommendationTag[];
  providerMatches: ProviderMatch[];
};

export type ScenarioOutput = {
  status: 'supported' | 'unsupported' | 'invalid';
  rulesVersion: string;
  scenario: NormalizedScenarioInput | null;
  routes: RouteResult[];
  providerMatches: ProviderMatch[];
  unsupportedReasons: string[];
  inputErrors: string[];
};

export type RouteRule = {
  id: string;
  name: string;
  type: RouteType;
  supportedCorridors: SupportedCorridor[];
  supportedDirections: PaymentDirection[];
  supportedUseCases: BusinessUseCase[];
  supportedCurrencies: string[];
  costRange: CostRange;
  estimatedTimeline: EstimatedTimeline;
  complianceLevel: ComplianceLevel;
  complexityLevel: ComplexityLevel;
  documentation: DocumentationSummary;
  baseRiskFlags: RiskFlag[];
  tradeoffSummary: string;
  priorityFit: ScenarioPriority[];
  displayOrder: number;
};

export type RouteRulesConfig = {
  rulesVersion: string;
  routes: RouteRule[];
};
