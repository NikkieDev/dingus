CREATE TABLE `guild_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`memberId` text NOT NULL,
	`guildId` integer,
	`joinedAt` integer,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL,
	CONSTRAINT `fk_guild_member_guildId_guild_id_fk` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`)
);
--> statement-breakpoint
CREATE TABLE `guild` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`discordId` text NOT NULL UNIQUE,
	`ownerDiscordId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`guildMemberId` integer UNIQUE,
	`name` text,
	`pronouns` text,
	`gender` text,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL,
	CONSTRAINT `fk_user_profile_guildMemberId_guild_member_id_fk` FOREIGN KEY (`guildMemberId`) REFERENCES `guild_member`(`id`)
);
