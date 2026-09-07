ALTER TABLE `user_profile` ADD `sexuality` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_guild_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`memberId` text NOT NULL,
	`guildId` integer,
	`joinedAt` text DEFAULT (current_timestamp) NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL,
	CONSTRAINT `fk_guild_member_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_guild_member`(`id`, `memberId`, `guildId`, `joinedAt`, `createdAt`, `updatedAt`) SELECT `id`, `memberId`, `guildId`, `joinedAt`, `createdAt`, `updatedAt` FROM `guild_member`;--> statement-breakpoint
DROP TABLE `guild_member`;--> statement-breakpoint
ALTER TABLE `__new_guild_member` RENAME TO `guild_member`;--> statement-breakpoint
PRAGMA foreign_keys=ON;