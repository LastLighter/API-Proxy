CREATE TABLE IF NOT EXISTS "api_key_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_key" text NOT NULL,
	"total_calls" integer DEFAULT 0 NOT NULL,
	"successful_calls" integer DEFAULT 0 NOT NULL,
	"remaining_calls" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_key_stats_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_generations" integer DEFAULT 0 NOT NULL,
	"daily_generations" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
