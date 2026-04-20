import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  evaluateScenario,
  matchPartnersForScenario,
  type PartnerRulesConfig,
  type ProviderMatch
} from '../lib/route-intelligence';

test('evaluates a supported US to India SaaS export receipt', () => {
  const output = evaluateScenario({
    direction: 'receive',
    sourceCountry: 'United States',
    destinationCountry: 'India',
    amount: '75,000',
    currency: 'USD',
    businessUseCase: 'SaaS exports',
    priority: 'speed'
  });

  assert.equal(output.status, 'supported');
  assert.equal(output.inputErrors.length, 0);
  assert.equal(output.unsupportedReasons.length, 0);
  assert.equal(output.scenario?.corridor, 'IN-US');
  assert.equal(output.scenario?.businessUseCase, 'saas_exports');
  assert.equal(output.routes.length, 3);
  assert.deepEqual(
    output.routes.map((route) => route.routeId),
    [
      'bank-swift-inward-export',
      'fintech-assisted-export-collection',
      'local-receiving-account-export'
    ]
  );
  assert.ok(output.providerMatches.length > 0);
  assert.ok(
    output.providerMatches.some(
      (match) => match.flowPoints?.label === 'Earn 750 FlowPoints'
    )
  );
  assert.ok(
    output.providerMatches.every(
      (match) => !/flowpoints|incentive/i.test(match.whyThisPartner)
    )
  );

  for (const route of output.routes) {
    assert.ok(route.routeName);
    assert.ok(route.routeType);
    assert.ok(route.costRange.summary);
    assert.ok(route.estimatedTimeline.summary);
    assert.ok(route.documentation.summary);
    assert.ok(route.documentation.requirements.length > 0);
    assert.ok(route.tradeoffSummary);
    assert.ok(
      route.riskFlags.some((flag) => flag.code === 'high_value_review')
    );
    assert.ok(route.recommendationTags.every((tag) => tag.reason.length > 0));
    assert.ok(Array.isArray(route.providerMatches));
  }

  const localReceivingRoute = output.routes.find(
    (route) => route.routeId === 'local-receiving-account-export'
  );

  assert.ok(localReceivingRoute);
  assert.ok(
    localReceivingRoute.recommendationTags.some(
      (tag) => tag.tag === 'best_for_speed'
    )
  );
  assert.ok(
    localReceivingRoute.recommendationTags.some(
      (tag) => tag.tag === 'best_for_simplicity'
    )
  );
});

test('evaluates a supported India to UAE vendor payment from corridor input', () => {
  const output = evaluateScenario({
    direction: 'send',
    corridor: 'India to UAE',
    amount: 25000,
    currency: 'AED',
    businessUseCase: 'vendor payments',
    priority: 'cost'
  });

  assert.equal(output.status, 'supported');
  assert.equal(output.scenario?.corridor, 'IN-AE');
  assert.equal(output.scenario?.sourceCountry, 'IN');
  assert.equal(output.scenario?.destinationCountry, 'AE');
  assert.equal(output.routes.length, 4);
  assert.ok(
    output.routes.some((route) => route.providerMatches.length > 0)
  );

  const localPayoutRoute = output.routes.find(
    (route) => route.routeId === 'fintech-local-rails-payout'
  );

  assert.ok(localPayoutRoute);
  assert.ok(
    localPayoutRoute.recommendationTags.some(
      (tag) => tag.tag === 'best_for_cost'
    )
  );
  assert.ok(
    localPayoutRoute.recommendationTags.some(
      (tag) => tag.tag === 'priority_fit'
    )
  );
});

test('returns unsupported for a valid corridor and direction outside the MVP rules', () => {
  const output = evaluateScenario({
    direction: 'receive',
    sourceCountry: 'UAE',
    destinationCountry: 'India',
    amount: 12000,
    currency: 'AED',
    businessUseCase: 'vendor_payments',
    priority: 'balanced'
  });

  assert.equal(output.status, 'unsupported');
  assert.equal(output.scenario?.corridor, 'IN-AE');
  assert.equal(output.routes.length, 0);
  assert.ok(
    output.unsupportedReasons.some((reason) =>
      reason.includes('receive scenarios')
    )
  );
});

test('returns invalid for malformed scenario fields', () => {
  const output = evaluateScenario({
    direction: 'send',
    corridor: 'India-Singapore',
    amount: 0,
    currency: 'SGD',
    businessUseCase: 'vendor payments',
    priority: 'fastest'
  });

  assert.equal(output.status, 'invalid');
  assert.equal(output.routes.length, 0);
  assert.ok(
    output.inputErrors.some((error) =>
      error.includes('amount must be a positive number')
    )
  );
});

test('scenario evaluation is deterministic for identical input', () => {
  const input = {
    direction: 'send',
    sourceCountry: 'India',
    destinationCountry: 'Singapore',
    amount: 50000,
    currency: 'SGD',
    businessUseCase: 'recurring international flow',
    priority: 'balanced'
  };

  assert.deepEqual(evaluateScenario(input), evaluateScenario(input));
});

test('FlowPoints do not affect partner matching order or eligibility', () => {
  const output = evaluateScenario({
    direction: 'send',
    corridor: 'India to UAE',
    amount: 25000,
    currency: 'AED',
    businessUseCase: 'vendor payments',
    priority: 'cost'
  });

  assert.equal(output.status, 'supported');
  assert.ok(output.scenario);

  const testPartnerConfig: PartnerRulesConfig = {
    rulesVersion: 'test-partner-rules',
    partners: [
      {
        id: 'non-incentive-fit',
        name: 'Non-Incentive Fit',
        description: 'Test partner without FlowPoints.',
        supportedRoutes: ['fintech-assisted-outward-transfer'],
        supportedCorridors: ['IN-AE'],
        supportedDirections: ['send'],
        supportedUseCases: ['vendor_payments'],
        supportedCurrencies: ['AED'],
        costProfile: 'Cost profile based on route fit.',
        speedProfile: 'Speed profile based on route fit.',
        regulatoryFit: 'Regulatory fit based on route fit.',
        bestUseCase: 'Vendor payments.',
        whyThisPartner: 'Fits because the route and use case match.',
        flowPoints: null,
        displayOrder: 10
      },
      {
        id: 'incentive-fit',
        name: 'Incentive Fit',
        description: 'Test partner with FlowPoints metadata.',
        supportedRoutes: ['fintech-assisted-outward-transfer'],
        supportedCorridors: ['IN-AE'],
        supportedDirections: ['send'],
        supportedUseCases: ['vendor_payments'],
        supportedCurrencies: ['AED'],
        costProfile: 'Cost profile based on route fit.',
        speedProfile: 'Speed profile based on route fit.',
        regulatoryFit: 'Regulatory fit based on route fit.',
        bestUseCase: 'Vendor payments.',
        whyThisPartner: 'Fits because the route and use case match.',
        flowPoints: {
          amount: 100,
          disclosure: 'Incentives do not affect recommendations.'
        },
        displayOrder: 20
      }
    ]
  };

  const changedFlowPointsConfig: PartnerRulesConfig = {
    ...testPartnerConfig,
    rulesVersion: 'test-partner-rules-changed-flowpoints',
    partners: testPartnerConfig.partners.map((partner) => ({
      ...partner,
      flowPoints: {
        amount: partner.id === 'non-incentive-fit' ? 9999 : 1,
        disclosure: 'Incentives do not affect recommendations.'
      }
    }))
  };

  const originalMatches = matchPartnersForScenario(
    output.scenario,
    output.routes,
    testPartnerConfig
  );
  const changedFlowPointsMatches = matchPartnersForScenario(
    output.scenario,
    output.routes,
    changedFlowPointsConfig
  );

  assert.deepEqual(
    originalMatches.map(providerMatchIdentity),
    changedFlowPointsMatches.map(providerMatchIdentity)
  );
  assert.deepEqual(
    originalMatches.map((match) => match.providerId),
    ['non-incentive-fit', 'incentive-fit']
  );
});

function providerMatchIdentity(match: ProviderMatch) {
  return `${match.routeId}:${match.providerId}`;
}
