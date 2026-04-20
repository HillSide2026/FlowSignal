import partnersConfig from './config/partners.json';
import { parsePartnerRulesConfig } from './config/schema';
import type {
  FlowPointsConfig,
  FlowPointsMetadata,
  NormalizedScenarioInput,
  PartnerRule,
  PartnerRulesConfig,
  ProviderMatch,
  RouteResult
} from './types';

export const partnerRulesConfig = parsePartnerRulesConfig(partnersConfig);

export function matchPartnersForScenario(
  scenario: NormalizedScenarioInput,
  routes: RouteResult[],
  config: PartnerRulesConfig = partnerRulesConfig
): ProviderMatch[] {
  return routes.flatMap((route) =>
    config.partners
      .filter((partner) => partnerFitsRoute(partner, route, scenario))
      .toSorted(
        (a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id)
      )
      .map((partner) => partnerToProviderMatch(partner, route, scenario))
  );
}

export function attachProviderMatchesToRoutes(
  routes: RouteResult[],
  providerMatches: ProviderMatch[]
): RouteResult[] {
  const matchesByRoute = new Map<string, ProviderMatch[]>();

  for (const match of providerMatches) {
    const matches = matchesByRoute.get(match.routeId) ?? [];
    matches.push(match);
    matchesByRoute.set(match.routeId, matches);
  }

  return routes.map((route) => ({
    ...route,
    providerMatches: matchesByRoute.get(route.routeId) ?? []
  }));
}

function partnerFitsRoute(
  partner: PartnerRule,
  route: RouteResult,
  scenario: NormalizedScenarioInput
): boolean {
  return (
    partner.supportedRoutes.includes(route.routeId) &&
    partner.supportedCorridors.includes(scenario.corridor) &&
    partner.supportedDirections.includes(scenario.direction) &&
    partner.supportedUseCases.includes(scenario.businessUseCase) &&
    partner.supportedCurrencies.includes(scenario.currency)
  );
}

function partnerToProviderMatch(
  partner: PartnerRule,
  route: RouteResult,
  scenario: NormalizedScenarioInput
): ProviderMatch {
  return {
    providerId: partner.id,
    providerName: partner.name,
    description: partner.description,
    routeId: route.routeId,
    routeName: route.routeName,
    routeType: route.routeType,
    costProfile: partner.costProfile,
    speedProfile: partner.speedProfile,
    regulatoryFit: partner.regulatoryFit,
    bestUseCase: partner.bestUseCase,
    whyThisPartner: partner.whyThisPartner,
    matchedOn: {
      corridor: scenario.corridor,
      direction: scenario.direction,
      businessUseCase: scenario.businessUseCase,
      currency: scenario.currency
    },
    flowPoints: toFlowPointsMetadata(partner.flowPoints)
  };
}

function toFlowPointsMetadata(
  flowPoints: FlowPointsConfig | null
): FlowPointsMetadata | null {
  if (!flowPoints) {
    return null;
  }

  return {
    amount: flowPoints.amount,
    label: `Earn ${new Intl.NumberFormat('en-US').format(
      flowPoints.amount
    )} FlowPoints`,
    disclosure: flowPoints.disclosure
  };
}
