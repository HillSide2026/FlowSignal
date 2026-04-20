import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

type JsonObject = Record<string, unknown>;

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const paymentScenarios = pgTable('payment_scenarios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id').references(() => teams.id),
  direction: varchar('direction', { length: 20 }).notNull(),
  originCountry: varchar('origin_country', { length: 64 }).notNull(),
  destinationCountry: varchar('destination_country', { length: 64 }).notNull(),
  amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  businessUseCase: varchar('business_use_case', { length: 100 }).notNull(),
  priority: varchar('priority', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('created'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const scenarioResults = pgTable('scenario_results', {
  id: serial('id').primaryKey(),
  scenarioId: integer('scenario_id')
    .notNull()
    .references(() => paymentScenarios.id),
  rulesVersion: varchar('rules_version', { length: 50 }).notNull(),
  routesJson: jsonb('routes_json').$type<JsonObject[]>().notNull(),
  comparisonJson: jsonb('comparison_json').$type<JsonObject>(),
  recommendationsJson: jsonb('recommendations_json').$type<JsonObject[]>(),
  providersJson: jsonb('providers_json').$type<JsonObject[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 160 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  costProfile: text('cost_profile'),
  speedProfile: text('speed_profile'),
  regulatoryFit: text('regulatory_fit'),
  bestUseCase: text('best_use_case'),
  whyThisPartner: text('why_this_partner'),
  // FlowPoints are nullable display metadata only; route and partner matching must ignore them.
  flowPointsAmount: integer('flow_points_amount'),
  flowPointsLabel: varchar('flow_points_label', { length: 120 }),
  flowPointsDisclosure: text('flow_points_disclosure'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const partnerRouteMappings = pgTable('partner_route_mappings', {
  id: serial('id').primaryKey(),
  partnerId: integer('partner_id')
    .notNull()
    .references(() => partners.id),
  routeType: varchar('route_type', { length: 50 }).notNull(),
  originCountry: varchar('origin_country', { length: 64 }),
  destinationCountry: varchar('destination_country', { length: 64 }),
  businessUseCase: varchar('business_use_case', { length: 100 }),
  fitNotes: text('fit_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  paymentScenarios: many(paymentScenarios),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  paymentScenarios: many(paymentScenarios),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const paymentScenariosRelations = relations(
  paymentScenarios,
  ({ one, many }) => ({
    user: one(users, {
      fields: [paymentScenarios.userId],
      references: [users.id],
    }),
    team: one(teams, {
      fields: [paymentScenarios.teamId],
      references: [teams.id],
    }),
    results: many(scenarioResults),
  })
);

export const scenarioResultsRelations = relations(scenarioResults, ({ one }) => ({
  scenario: one(paymentScenarios, {
    fields: [scenarioResults.scenarioId],
    references: [paymentScenarios.id],
  }),
}));

export const partnersRelations = relations(partners, ({ many }) => ({
  routeMappings: many(partnerRouteMappings),
}));

export const partnerRouteMappingsRelations = relations(
  partnerRouteMappings,
  ({ one }) => ({
    partner: one(partners, {
      fields: [partnerRouteMappings.partnerId],
      references: [partners.id],
    }),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type PaymentScenario = typeof paymentScenarios.$inferSelect;
export type NewPaymentScenario = typeof paymentScenarios.$inferInsert;
export type ScenarioResult = typeof scenarioResults.$inferSelect;
export type NewScenarioResult = typeof scenarioResults.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
export type PartnerRouteMapping = typeof partnerRouteMappings.$inferSelect;
export type NewPartnerRouteMapping = typeof partnerRouteMappings.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
