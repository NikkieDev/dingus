import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guildTable = sqliteTable('guild', {
	id: int().primaryKey({ autoIncrement: true }),
	discordId: text().notNull().unique(),
	ownerDiscordId: text().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: text().notNull().default(sql`(current_timestamp)`), 
	updatedAt: text().notNull().default(sql`(current_timestamp)`),
});

export const memberTable = sqliteTable('member', {
	id: int().primaryKey({ autoIncrement: true }),
	memberId: text().notNull(),
	joinedAt: text().notNull().default(sql`(current_timestamp)`),
});

export const userProfileTable = sqliteTable('user_profile', {
	id: int().primaryKey({ autoIncrement: true }),
	guildMemberId: int().references(() => memberTable.id).unique(),
	name: text(),
	pronouns: text(),
	sexuality: text(),
	gender: text(),
	createdAt: text().notNull().default(sql`(current_timestamp)`), 
	updatedAt: text().notNull().default(sql`(current_timestamp)`),
});
