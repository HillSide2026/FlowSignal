import 'server-only';

import { and, desc, eq } from 'drizzle-orm';
import { db } from './drizzle';
import {
  paymentScenarios,
  scenarioResults,
  type PaymentScenario,
  type ScenarioResult
} from './schema';
import type {
  NormalizedScenarioInput,
  ProviderMatch,
  RouteResult,
  ScenarioInput,
  ScenarioOutput
} from '@/lib/route-intelligence';

type JsonObject = Record<string, unknown>;

export type ScenarioCreateValues = {
  userId: number;
  teamId?: number | null;
  input: {
    direction: string;
    originCountry: string;
    destinationCountry: string;
    amount: number;
    currency: string;
    businessUseCase: string;
    priority: string;
  };
  output: ScenarioOutput;
};

export type ScenarioListItem = {
  id: number;
  direction: string;
  originCountry: string;
  destinationCountry: string;
  amount: string;
  currency: string;
  businessUseCase: string;
  priority: string;
  status: string;
  updatedAt: Date;
  resultCreatedAt: Date | null;
  rulesVersion: string | null;
};

export type ScenarioWithResult = {
  scenario: PaymentScenario;
  result: ScenarioResult | null;
};

type StoredScenarioResultMeta = {
  status?: ScenarioOutput['status'];
  scenario?: NormalizedScenarioInput | null;
  unsupportedReasons?: string[];
  inputErrors?: string[];
};

type StoredRouteResult = Omit<RouteResult, 'providerMatches'> & {
  providerMatches?: ProviderMatch[];
};

export async function createScenarioWithResult({
  userId,
  teamId,
  input,
  output
}: ScenarioCreateValues) {
  const [createdScenario] = await db
    .insert(paymentScenarios)
    .values({
      userId,
      teamId: teamId ?? null,
      direction: input.direction,
      originCountry: input.originCountry,
      destinationCountry: input.destinationCountry,
      amount: input.amount.toFixed(2),
      currency: input.currency,
      businessUseCase: input.businessUseCase,
      priority: input.priority,
      status: output.status === 'supported' ? 'evaluated' : output.status
    })
    .returning({ id: paymentScenarios.id });

  if (!createdScenario) {
    throw new Error('Scenario could not be created');
  }

  await db.insert(scenarioResults).values({
    scenarioId: createdScenario.id,
    rulesVersion: output.rulesVersion,
    routesJson: toJsonObjects(output.routes),
    comparisonJson: toJsonObject({
      status: output.status,
      scenario: output.scenario,
      unsupportedReasons: output.unsupportedReasons,
      inputErrors: output.inputErrors
    }),
    recommendationsJson: toJsonObjects(extractRecommendationRows(output.routes)),
    providersJson: toJsonObjects(output.providerMatches)
  });

  return createdScenario.id;
}

export async function listScenariosForUser(
  userId: number
): Promise<ScenarioListItem[]> {
  return db
    .select({
      id: paymentScenarios.id,
      direction: paymentScenarios.direction,
      originCountry: paymentScenarios.originCountry,
      destinationCountry: paymentScenarios.destinationCountry,
      amount: paymentScenarios.amount,
      currency: paymentScenarios.currency,
      businessUseCase: paymentScenarios.businessUseCase,
      priority: paymentScenarios.priority,
      status: paymentScenarios.status,
      updatedAt: paymentScenarios.updatedAt,
      resultCreatedAt: scenarioResults.createdAt,
      rulesVersion: scenarioResults.rulesVersion
    })
    .from(paymentScenarios)
    .leftJoin(
      scenarioResults,
      eq(scenarioResults.scenarioId, paymentScenarios.id)
    )
    .where(eq(paymentScenarios.userId, userId))
    .orderBy(desc(paymentScenarios.updatedAt), desc(paymentScenarios.id));
}

export async function getScenarioForUser(
  userId: number,
  scenarioId: number
): Promise<ScenarioWithResult | null> {
  const [row] = await db
    .select({
      scenario: paymentScenarios,
      result: scenarioResults
    })
    .from(paymentScenarios)
    .leftJoin(
      scenarioResults,
      eq(scenarioResults.scenarioId, paymentScenarios.id)
    )
    .where(
      and(eq(paymentScenarios.id, scenarioId), eq(paymentScenarios.userId, userId))
    )
    .orderBy(desc(scenarioResults.createdAt))
    .limit(1);

  return row ?? null;
}

export function scenarioInputFromRecord(
  scenario: PaymentScenario
): ScenarioInput {
  return {
    direction: scenario.direction,
    sourceCountry: scenario.originCountry,
    destinationCountry: scenario.destinationCountry,
    amount: scenario.amount,
    currency: scenario.currency,
    businessUseCase: scenario.businessUseCase,
    priority: scenario.priority
  };
}

export function scenarioOutputFromStoredResult(
  result: ScenarioResult | null
): ScenarioOutput | null {
  if (!result) {
    return null;
  }

  const meta = readStoredMeta(result.comparisonJson);
  const storedRoutes = result.routesJson as unknown as StoredRouteResult[];
  const providerMatches = readStoredProviderMatches(
    result.providersJson,
    storedRoutes
  );
  const routes = attachStoredProviderMatches(storedRoutes, providerMatches);
  const status =
    meta.status ??
    (routes.length > 0 ? ('supported' as const) : ('unsupported' as const));

  return {
    status,
    rulesVersion: result.rulesVersion,
    scenario: meta.scenario ?? null,
    routes,
    providerMatches,
    unsupportedReasons: meta.unsupportedReasons ?? [],
    inputErrors: meta.inputErrors ?? []
  };
}

function readStoredProviderMatches(
  value: JsonObject[] | null,
  routes: StoredRouteResult[]
): ProviderMatch[] {
  if (value) {
    return value as unknown as ProviderMatch[];
  }

  return routes.flatMap((route) => route.providerMatches ?? []);
}

function attachStoredProviderMatches(
  routes: StoredRouteResult[],
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

function extractRecommendationRows(routes: RouteResult[]) {
  return routes.flatMap((route) =>
    route.recommendationTags.map((tag) => ({
      routeId: route.routeId,
      routeName: route.routeName,
      ...tag
    }))
  );
}

function readStoredMeta(value: JsonObject | null): StoredScenarioResultMeta {
  if (!value) {
    return {};
  }

  return value as StoredScenarioResultMeta;
}

function toJsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

function toJsonObjects(value: unknown[]): JsonObject[] {
  return JSON.parse(JSON.stringify(value)) as JsonObject[];
}
