CREATE TABLE `vote` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`memberId` text NOT NULL,
	`votedAt` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `member` ADD `votes` integer;