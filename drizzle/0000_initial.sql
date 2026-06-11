CREATE TABLE `kenya_wards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ward_code` text,
	`ward` text NOT NULL,
	`county` text NOT NULL,
	`county_code` integer,
	`sub_county` text,
	`constituency` text NOT NULL,
	`constituency_code` integer,
	`minx` real,
	`miny` real,
	`maxx` real,
	`maxy` real,
	`geom` blob
);
--> statement-breakpoint
CREATE TABLE `kenya_ward_events` (
	`id` text PRIMARY KEY NOT NULL,
	`trigger_by` text,
	`event_type` text NOT NULL,
	`ward_id` integer,
	`ward_code` text,
	`old_data` text,
	`new_data` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`sync_status` text DEFAULT 'PENDING' NOT NULL,
	`sync_attempts` integer DEFAULT 0 NOT NULL,
	`last_sync_attempt` text,
	`error_message` text,
	`client_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `kenya_ward_updates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` integer NOT NULL,
	`data` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `sync_events` (
	`id` text PRIMARY KEY NOT NULL,
	`device_id` text NOT NULL,
	`table_name` text NOT NULL,
	`row_id` text NOT NULL,
	`action` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text NOT NULL,
	`verified` integer DEFAULT 1 NOT NULL,
	`verified_at` text,
	`verified_by` text
);
--> statement-breakpoint
CREATE TABLE `applied_sync_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`applied_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
