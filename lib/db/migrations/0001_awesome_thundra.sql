CREATE TABLE "partner_route_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" integer NOT NULL,
	"route_type" varchar(50) NOT NULL,
	"origin_country" varchar(64),
	"destination_country" varchar(64),
	"business_use_case" varchar(100),
	"fit_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"cost_profile" text,
	"speed_profile" text,
	"regulatory_fit" text,
	"best_use_case" text,
	"why_this_partner" text,
	"flow_points_amount" integer,
	"flow_points_label" varchar(120),
	"flow_points_disclosure" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partners_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "payment_scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"team_id" integer,
	"direction" varchar(20) NOT NULL,
	"origin_country" varchar(64) NOT NULL,
	"destination_country" varchar(64) NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"business_use_case" varchar(100) NOT NULL,
	"priority" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'created' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenario_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"scenario_id" integer NOT NULL,
	"rules_version" varchar(50) NOT NULL,
	"routes_json" jsonb NOT NULL,
	"comparison_json" jsonb,
	"recommendations_json" jsonb,
	"providers_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "partner_route_mappings" ADD CONSTRAINT "partner_route_mappings_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_scenarios" ADD CONSTRAINT "payment_scenarios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_scenarios" ADD CONSTRAINT "payment_scenarios_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_results" ADD CONSTRAINT "scenario_results_scenario_id_payment_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."payment_scenarios"("id") ON DELETE no action ON UPDATE no action;