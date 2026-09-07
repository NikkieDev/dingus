ALTER TABLE `guild_member` RENAME TO `member`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`memberId` text NOT NULL,
	`joinedAt` text DEFAULT (current_timestamp) NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_member`(`id`, `memberId`, `joinedAt`, `createdAt`, `updatedAt`) SELECT `id`, `memberId`, `joinedAt`, `createdAt`, `updatedAt` FROM `member`;--> statement-breakpoint
DROP TABLE `member`;--> statement-breakpoint
ALTER TABLE `__new_member` RENAME TO `member`;--> statement-breakpoint
PRAGMA foreign_keys=ON;