CREATE TABLE "handoff_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"scenario_id" integer NOT NULL,
	"preferred_route" varchar(160) NOT NULL,
	"partner_id" varchar(160),
	"request_type" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'submitted' NOT NULL,
	"urgency" varchar(20) NOT NULL,
	"notes" text,
	"missing_info_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "handoff_requests" ADD CONSTRAINT "handoff_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoff_requests" ADD CONSTRAINT "handoff_requests_scenario_id_payment_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."payment_scenarios"("id") ON DELETE no action ON UPDATE no action;