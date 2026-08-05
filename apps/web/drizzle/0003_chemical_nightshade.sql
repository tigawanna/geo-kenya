CREATE TABLE `deleted_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`former_user_id` text NOT NULL,
	`deleted_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `deleted_accounts_email_unique` ON `deleted_accounts` (`email`);