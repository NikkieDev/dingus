import IActiveRecord from './IActiveRecord.js';
import UserProfile from '../entity/userProfile.js';
import Guild from '../entity/guild.js';
import { guildMemberTable, guildTable, userProfileTable } from '../db/schema.js';
import SqliteConnection from '../db/sqliteConnection.js';
import { eq } from 'drizzle-orm';

export default class GuildMember extends IActiveRecord {
	id;
	memberId;
	guildId;
	joinedAt;
	createdAt;
	updatedAt;

	constructor(
		memberId,
		guildId,
		joinedAt,
	) {
		super();

		this.memberId = memberId;
		this.guildId = guildId;
		this.joinedAt = joinedAt;
		this.updatedAt = new Date()
	}

	async hasProfile() {
		const result = await this.db
			.select()
			.from(userProfileTable)
			.where(eq(userProfileTable.guildMemberId, this.id))
		;

		return 1 === result.length;
	}

	async getProfile() {
		const result = await this.db
			.select()
			.from(userProfileTable)
			.where(eq(userProfileTable.guildMemberId, this.id))
		;
		
		if (0 === result.length) {
			return null;
		}

		return new UserProfile(
			this.id,
			result[0].name,
			result[0].pronouns,
			result[0].gender,
		);
	}

	async getGuild() {
		const result = await this.db
			.select()
			.from(guildTable)
			.where(eq(guildTable.discordId, this.guildId))
		;

		if (0 === result.length) {
			return null;
		}

		return new Guild(
			result[0].discordId,
			result[0].ownerDiscordId,
			result[0].name,
			result[0].description,
		);
	}

	async save() {
		const data = {
			memberId: this.memberId,
			guildId: this.guildId,
			joinedAt: this.joinedAt,
			updatedAt: this.updatedAt.toISOString(),
		};

		const inserted = await this.db.insert(guildMemberTable)
			.values(data)
			.onConflictDoNothing()
			.returning()
		;

		this.id = inserted[0].id;
	}


	static async findById(memberId) {
		const result = await new SqliteConnection().getDatabase()
			.select()
			.from(guildMemberTable)
			.where(eq(guildMemberTable.memberId, memberId))
		;

		if (0 === result.length) {
			return null;
		}

		const guildMember = new GuildMember(
			result[0].memberId,
			result[0].guildId,
			result[0].joinedAt,
		);

		return guildMember;
	}
}
