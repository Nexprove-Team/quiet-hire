CREATE TABLE "recruiter_relevance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"recruiter_id" text NOT NULL,
	"score" real NOT NULL,
	"feedback" text NOT NULL,
	"strengths" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gaps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recruiter_relevance_application_id_recruiter_id_unique" UNIQUE("application_id","recruiter_id")
);
--> statement-breakpoint
ALTER TABLE "recruiter_relevance" ADD CONSTRAINT "recruiter_relevance_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_relevance" ADD CONSTRAINT "recruiter_relevance_recruiter_id_user_id_fk" FOREIGN KEY ("recruiter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;