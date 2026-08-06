CREATE TABLE `app_releases` (
	`id` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`url` text NOT NULL,
	`label` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_releases_channel_unique` ON `app_releases` (`channel`);