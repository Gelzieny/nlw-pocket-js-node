CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"avatar_url" text NOT NULL,
	"external_account_id" integer NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_external_account_id_unique" UNIQUE("external_account_id")
);
