ALTER TABLE `events` ADD `user_id` text;--> statement-breakpoint
CREATE INDEX `events_userId_idx` ON `events` (`user_id`);