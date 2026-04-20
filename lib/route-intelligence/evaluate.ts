import routesConfig from './config/routes.json';
import { parseRouteRulesConfig } from './config/schema';
import {
  COUNTRY_ALIASES,
  HIGH_VALUE_THRESHOLDS_BY_CURRENCY,
  SUPPORTED_CORRIDORS,
  SUPPORTED_COUNTRIES,
  SUPPORTED_USE_CASES,
  USE_CASE_ALIASES
} from './constants';
import {
  attachProviderMatchesToRoutes,
  matchPartnersForScenario
} from './match-partners';
import type {
  BusinessUseCase,
  ComplexityLevel,
  NormalizedScenarioInput,
  PaymentDirection,
  RecommendationTag,
  RiskFlag,
  RouteResult,
  RouteRule,
  ScenarioInput,
  ScenarioOutput,
  ScenarioPriority,
  SupportedCorridor,
  SupportedCountryCode
} from './types';

const routeRulesConfig = parseRouteRulesConfig(routesConfig);

const supportedCountrySet = new Set<string>(SUPPORTED_COUNTRIES);
const supportedCorridorSet = new Set<string>(SUPPORTED_CORRIDORS);
const supportedUseCaseSet = new Set<string>(SUPPORTED_USE_CASES);

const complexityRank: Record<ComplexityLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3
};

type NormalizationResult =
  | {
      kind: 'valid';
      scenario: NormalizedScenarioInput;
    }
  | {
      kind: 'invalid';
      errors: string[];
    }
  | {
      kind: 'unsupported';
      reasons: string[];
    };

type MatchedRoute = {
  rule: RouteRule;
  result: RouteResult;
};

export function evaluateScenario(input: ScenarioInput): ScenarioOutput {
  const normalized = normalizeScenarioInput(input);

  if (normalized.kind === 'invalid') {
    return {
      status: 'invalid',
      rulesVersion: routeRulesConfig.rulesVersion,
      scenario: null,
      routes: [],
      providerMatches: [],
      unsupportedReasons: [],
      inputErrors: normalized.errors
    };
  }

  if (normalized.kind === 'unsupported') {
    return {
      status: 'unsupported',
      rulesVersion: routeRulesConfig.rulesVersion,
      scenario: null,
      routes: [],
      providerMatches: [],
      unsupportedReasons: normalized.reasons,
      inputErrors: []
    };
  }

  const scenario = normalized.scenario;
  const routeMatch = findMatchingRouteRules(scenario);

  if (routeMatch.kind === 'unsupported') {
    return {
      status: 'unsupported',
      rulesVersion: routeRulesConfig.rulesVersion,
      scenario,
      routes: [],
      providerMatches: [],
      unsupportedReasons: routeMatch.reasons,
      inputErrors: []
    };
  }

  const matchedRoutes = routeMatch.routes
    .toSorted((a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id))
    .map((rule) => ({
      rule,
      result: routeRuleToResult(rule, scenario)
    }));
  const routesWithRecommendations = applyRecommendationTags(
    matchedRoutes,
    scenario.priority
  );
  const providerMatches = matchPartnersForScenario(
    scenario,
    routesWithRecommendations
  );

  return {
    status: 'supported',
    rulesVersion: routeRulesConfig.rulesVersion,
    scenario,
    routes: attachProviderMatchesToRoutes(
      routesWithRecommendations,
      providerMatches
    ),
    providerMatches,
    unsupportedReasons: [],
    inputErrors: []
  };
}

function normalizeScenarioInput(input: ScenarioInput): NormalizationResult {
  const errors: string[] = [];
  const unsupportedReasons: string[] = [];

  const direction = normalizeDirection(input.direction);
  if (!direction) {
    errors.push('direction must be send or receive');
  }

  const amount = normalizeAmount(input.amount);
  if (amount === null) {
    errors.push('amount must be a positive number');
  }

  const currency = normalizeCurrency(input.currency);
  if (!currency) {
    errors.push('currency must be a three-letter currency code');
  }

  const priority = normalizePriority(input.priority);
  if (!priority) {
    errors.push('priority must be cost, speed, or balanced');
  }

  const useCase = normalizeUseCase(input.businessUseCase);
  if (!useCase) {
    unsupportedReasons.push(
      'This business use case is not in the MVP route rules yet.'
    );
  }

  const corridorInput = getCorridorInput(input);
  if (!corridorInput.sourceCountry || !corridorInput.destinationCountry) {
    errors.push(
      'sourceCountry and destinationCountry are required, either directly or through corridor'
    );
  }

  const sourceCountry = normalizeCountry(corridorInput.sourceCountry);
  const destinationCountry = normalizeCountry(corridorInput.destinationCountry);

  if (corridorInput.sourceCountry && !sourceCountry) {
    unsupportedReasons.push(
      `Source country ${corridorInput.sourceCountry} is not supported by the MVP route rules.`
    );
  }

  if (corridorInput.destinationCountry && !destinationCountry) {
    unsupportedReasons.push(
      `Destination country ${corridorInput.destinationCountry} is not supported by the MVP route rules.`
    );
  }

  if (sourceCountry && destinationCountry && sourceCountry === destinationCountry) {
    errors.push('sourceCountry and destinationCountry must be different');
  }

  const corridor =
    sourceCountry && destinationCountry
      ? toIndiaFirstCorridor(sourceCountry, destinationCountry)
      : null;

  if (sourceCountry && destinationCountry && !corridor) {
    unsupportedReasons.push(
      'This MVP only supports India-linked corridors: India-US, India-UAE, India-Singapore, India-UK, and India-EU.'
    );
  }

  if (errors.length > 0) {
    return {
      kind: 'invalid',
      errors
    };
  }

  if (
    unsupportedReasons.length > 0 ||
    !direction ||
    amount === null ||
    !currency ||
    !priority ||
    !useCase ||
    !sourceCountry ||
    !destinationCountry ||
    !corridor
  ) {
    return {
      kind: 'unsupported',
      reasons: unsupportedReasons
    };
  }

  return {
    kind: 'valid',
    scenario: {
      direction,
      sourceCountry,
      destinationCountry,
      corridor,
      amount,
      currency,
      businessUseCase: useCase,
      priority
    }
  };
}

function getCorridorInput(input: ScenarioInput): {
  sourceCountry?: string;
  destinationCountry?: string;
} {
  const directSourceCountry = input.sourceCountry ?? input.originCountry;

  if (directSourceCountry || input.destinationCountry) {
    return {
      sourceCountry: directSourceCountry,
      destinationCountry: input.destinationCountry
    };
  }

  if (!input.corridor) {
    return {};
  }

  if (typeof input.corridor !== 'string') {
    return {
      sourceCountry: input.corridor.sourceCountry ?? input.corridor.originCountry,
      destinationCountry: input.corridor.destinationCountry
    };
  }

  return parseCorridor(input.corridor);
}

function parseCorridor(corridor: string): {
  sourceCountry?: string;
  destinationCountry?: string;
} {
  const parts = corridor
    .trim()
    .split(/\s*(?:->|=>|\/|\bto\b|-)\s*/i)
    .filter(Boolean);

  if (parts.length !== 2) {
    return {};
  }

  return {
    sourceCountry: parts[0],
    destinationCountry: parts[1]
  };
}

function normalizeDirection(value: string): PaymentDirection | null {
  const normalized = normalizeText(value);

  if (['send', 'outbound', 'pay', 'payment out'].includes(normalized)) {
    return 'send';
  }

  if (['receive', 'inbound', 'collect', 'payment in'].includes(normalized)) {
    return 'receive';
  }

  return null;
}

function normalizePriority(value: string): ScenarioPriority | null {
  const normalized = normalizeText(value);

  if (['cost', 'low cost', 'lowest cost'].includes(normalized)) {
    return 'cost';
  }

  if (['speed', 'fast', 'fastest'].includes(normalized)) {
    return 'speed';
  }

  if (['balanced', 'balance'].includes(normalized)) {
    return 'balanced';
  }

  return null;
}

function normalizeUseCase(value: string): BusinessUseCase | null {
  const normalized = normalizeText(value);
  const slug = normalized.replace(/\s+/g, '_');

  if (supportedUseCaseSet.has(slug)) {
    return slug as BusinessUseCase;
  }

  return USE_CASE_ALIASES[normalized] ?? null;
}

function normalizeCountry(value?: string): SupportedCountryCode | null {
  if (!value) {
    return null;
  }

  const upperValue = value.trim().toUpperCase();
  if (supportedCountrySet.has(upperValue)) {
    return upperValue as SupportedCountryCode;
  }

  const normalized = normalizeText(value);
  const compact = normalized.replace(/\s+/g, '');

  return COUNTRY_ALIASES[normalized] ?? COUNTRY_ALIASES[compact] ?? null;
}

function normalizeAmount(value: number | string): number | null {
  const amount =
    typeof value === 'number' ? value : Number(value.replace(/,/g, '').trim());

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function normalizeCurrency(value: string): string | null {
  const currency = value.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    return null;
  }

  return currency;
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_./]+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toIndiaFirstCorridor(
  sourceCountry: SupportedCountryCode,
  destinationCountry: SupportedCountryCode
): SupportedCorridor | null {
  const corridor =
    sourceCountry === 'IN'
      ? `IN-${destinationCountry}`
      : destinationCountry === 'IN'
        ? `IN-${sourceCountry}`
        : null;

  if (!corridor || !supportedCorridorSet.has(corridor)) {
    return null;
  }

  return corridor as SupportedCorridor;
}

function findMatchingRouteRules(
  scenario: NormalizedScenarioInput
):
  | {
      kind: 'supported';
      routes: RouteRule[];
    }
  | {
      kind: 'unsupported';
      reasons: string[];
    } {
  const corridorRoutes = routeRulesConfig.routes.filter((route) =>
    route.supportedCorridors.includes(scenario.corridor)
  );

  if (corridorRoutes.length === 0) {
    return {
      kind: 'unsupported',
      reasons: [`No MVP route rules are configured for ${scenario.corridor}.`]
    };
  }

  const directionRoutes = corridorRoutes.filter((route) =>
    route.supportedDirections.includes(scenario.direction)
  );

  if (directionRoutes.length === 0) {
    return {
      kind: 'unsupported',
      reasons: [
        `No MVP route rules support ${scenario.direction} scenarios for ${scenario.corridor}.`
      ]
    };
  }

  const useCaseRoutes = directionRoutes.filter((route) =>
    route.supportedUseCases.includes(scenario.businessUseCase)
  );

  if (useCaseRoutes.length === 0) {
    return {
      kind: 'unsupported',
      reasons: [
        `No MVP route rules support ${scenario.businessUseCase} for ${scenario.corridor}.`
      ]
    };
  }

  const currencyRoutes = useCaseRoutes.filter((route) =>
    route.supportedCurrencies.includes(scenario.currency)
  );

  if (currencyRoutes.length === 0) {
    return {
      kind: 'unsupported',
      reasons: [
        `No MVP route rules support ${scenario.currency} for ${scenario.businessUseCase} on ${scenario.corridor}.`
      ]
    };
  }

  return {
    kind: 'supported',
    routes: currencyRoutes
  };
}

function routeRuleToResult(
  rule: RouteRule,
  scenario: NormalizedScenarioInput
): RouteResult {
  return {
    routeId: rule.id,
    routeName: rule.name,
    routeType: rule.type,
    costRange: { ...rule.costRange },
    estimatedTimeline: { ...rule.estimatedTimeline },
    complianceLevel: rule.complianceLevel,
    complexityLevel: rule.complexityLevel,
    documentation: {
      summary: rule.documentation.summary,
      requirements: [...rule.documentation.requirements]
    },
    riskFlags: [...rule.baseRiskFlags, ...getScenarioRiskFlags(scenario)],
    tradeoffSummary: rule.tradeoffSummary,
    recommendationTags: [],
    providerMatches: []
  };
}

function getScenarioRiskFlags(scenario: NormalizedScenarioInput): RiskFlag[] {
  const threshold = HIGH_VALUE_THRESHOLDS_BY_CURRENCY[scenario.currency];

  if (!threshold || scenario.amount < threshold) {
    return [];
  }

  return [
    {
      code: 'high_value_review',
      severity: 'watch',
      summary:
        'Amount is above the MVP high-value threshold for this currency, so documentation and counterparty review should be prepared early.'
    }
  ];
}

function applyRecommendationTags(
  matchedRoutes: MatchedRoute[],
  priority: ScenarioPriority
): RouteResult[] {
  const minCostMidpoint = Math.min(
    ...matchedRoutes.map(({ rule }) => getCostMidpoint(rule))
  );
  const minTimelineMidpoint = Math.min(
    ...matchedRoutes.map(({ rule }) => getTimelineMidpoint(rule))
  );
  const minComplexityRank = Math.min(
    ...matchedRoutes.map(({ rule }) => complexityRank[rule.complexityLevel])
  );

  return matchedRoutes.map(({ rule, result }) => {
    const recommendationTags: RecommendationTag[] = [];
    const costMidpoint = getCostMidpoint(rule);
    const timelineMidpoint = getTimelineMidpoint(rule);

    if (costMidpoint === minCostMidpoint) {
      recommendationTags.push({
        tag: 'best_for_cost',
        label: 'Best for cost',
        reason: `Lowest configured midpoint cost among matched routes at ${formatPercent(costMidpoint)}.`
      });
    }

    if (timelineMidpoint === minTimelineMidpoint) {
      recommendationTags.push({
        tag: 'best_for_speed',
        label: 'Best for speed',
        reason: `Shortest configured midpoint timeline among matched routes at ${formatBusinessDays(timelineMidpoint)}.`
      });
    }

    if (complexityRank[rule.complexityLevel] === minComplexityRank) {
      recommendationTags.push({
        tag: 'best_for_simplicity',
        label: 'Best for simplicity',
        reason: `Lowest configured complexity level among matched routes: ${rule.complexityLevel}.`
      });
    }

    if (rule.priorityFit.includes(priority)) {
      recommendationTags.push({
        tag: 'priority_fit',
        label: 'Fits selected priority',
        reason: `The JSON route rule marks this route as a fit for ${priority} priority based on its configured cost, timeline, and complexity tradeoff.`
      });
    }

    return {
      ...result,
      recommendationTags
    };
  });
}

function getCostMidpoint(route: RouteRule): number {
  return (route.costRange.minPercent + route.costRange.maxPercent) / 2;
}

function getTimelineMidpoint(route: RouteRule): number {
  return (
    (route.estimatedTimeline.minBusinessDays +
      route.estimatedTimeline.maxBusinessDays) /
    2
  );
}

function formatPercent(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}

function formatBusinessDays(value: number): string {
  const formattedValue = Number(value.toFixed(1));
  return `${formattedValue} business ${formattedValue === 1 ? 'day' : 'days'}`;
}
