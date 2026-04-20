import { z } from 'zod';
import {
  SUPPORTED_CORRIDORS,
  SUPPORTED_DIRECTIONS,
  SUPPORTED_PRIORITIES,
  SUPPORTED_USE_CASES
} from '../constants';
import type { PartnerRulesConfig, RouteRulesConfig } from '../types';

const routeTypeSchema = z.enum([
  'bank_swift',
  'fintech_assisted',
  'local_rails',
  'trade_bank_route'
]);

const complianceLevelSchema = z.enum(['low', 'moderate', 'high']);
const complexityLevelSchema = z.enum(['low', 'moderate', 'high']);
const riskSeveritySchema = z.enum(['info', 'watch', 'elevated']);

const costRangeSchema = z
  .object({
    minPercent: z.number().nonnegative(),
    maxPercent: z.number().nonnegative(),
    summary: z.string().min(1)
  })
  .refine((range) => range.maxPercent >= range.minPercent, {
    message: 'maxPercent must be greater than or equal to minPercent'
  });

const estimatedTimelineSchema = z
  .object({
    minBusinessDays: z.number().int().nonnegative(),
    maxBusinessDays: z.number().int().nonnegative(),
    summary: z.string().min(1)
  })
  .refine((timeline) => timeline.maxBusinessDays >= timeline.minBusinessDays, {
    message: 'maxBusinessDays must be greater than or equal to minBusinessDays'
  });

const documentationSchema = z.object({
  summary: z.string().min(1),
  requirements: z.array(z.string().min(1)).min(1)
});

const riskFlagSchema = z.object({
  code: z.string().min(1),
  severity: riskSeveritySchema,
  summary: z.string().min(1)
});

const routeRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: routeTypeSchema,
  supportedCorridors: z.array(z.enum(SUPPORTED_CORRIDORS)).min(1),
  supportedDirections: z.array(z.enum(SUPPORTED_DIRECTIONS)).min(1),
  supportedUseCases: z.array(z.enum(SUPPORTED_USE_CASES)).min(1),
  supportedCurrencies: z.array(z.string().length(3)).min(1),
  costRange: costRangeSchema,
  estimatedTimeline: estimatedTimelineSchema,
  complianceLevel: complianceLevelSchema,
  complexityLevel: complexityLevelSchema,
  documentation: documentationSchema,
  baseRiskFlags: z.array(riskFlagSchema),
  tradeoffSummary: z.string().min(1),
  priorityFit: z.array(z.enum(SUPPORTED_PRIORITIES)).min(1),
  displayOrder: z.number().int().nonnegative()
});

const flowPointsConfigSchema = z.object({
  amount: z.number().int().positive(),
  disclosure: z.string().min(1)
});

const partnerRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  supportedRoutes: z.array(z.string().min(1)).min(1),
  supportedCorridors: z.array(z.enum(SUPPORTED_CORRIDORS)).min(1),
  supportedDirections: z.array(z.enum(SUPPORTED_DIRECTIONS)).min(1),
  supportedUseCases: z.array(z.enum(SUPPORTED_USE_CASES)).min(1),
  supportedCurrencies: z.array(z.string().length(3)).min(1),
  costProfile: z.string().min(1),
  speedProfile: z.string().min(1),
  regulatoryFit: z.string().min(1),
  bestUseCase: z.string().min(1),
  whyThisPartner: z.string().min(1),
  flowPoints: flowPointsConfigSchema.nullable(),
  displayOrder: z.number().int().nonnegative()
});

export const routeRulesConfigSchema = z.object({
  rulesVersion: z.string().min(1),
  routes: z.array(routeRuleSchema).min(1)
});

export const partnerRulesConfigSchema = z.object({
  rulesVersion: z.string().min(1),
  partners: z.array(partnerRuleSchema).min(1)
});

export function parseRouteRulesConfig(config: unknown): RouteRulesConfig {
  return routeRulesConfigSchema.parse(config);
}

export function parsePartnerRulesConfig(config: unknown): PartnerRulesConfig {
  return partnerRulesConfigSchema.parse(config);
}
