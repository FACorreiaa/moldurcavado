CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"guest_name" text DEFAULT 'Anonymous' NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"item_id" uuid PRIMARY KEY NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"description_pt" text NOT NULL,
	"description_en" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_item_id_portfolio_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_item_id_portfolio_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;