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
	) {
		super();

		this.memberId = memberId;
		this.guildId = guildId;
		this.joinedAt = new Date();
		this.updatedAt = new Date();
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

		const profile = new UserProfile(
			this.id,
			result[0].name,
			result[0].pronouns,
			result[0].sexuality,
			result[0].gender,
		);

		profile.updatedAt = result[0].updatedAt;
		profile.createdAt = result[0].createdAt;

		return profile;
	}

	async getGuild() {
		const result = await this.db
			.select()
			.from(guildTable)
			.where(eq(guildTable.id, this.guildId))
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
			joinedAt: this.joinedAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
		};

		const inserted = await this.db.insert(guildMemberTable)
			.values(data)
			.onConflictDoNothing()
			.returning()
		;

		if (0 !== inserted.length) {
			this.id = inserted[0].id;
		}
	}

	/*
	* Get guildmember by discord ID
	*/
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
		);

		guildMember.id = result[0].id;
		guildMember.joinedAt = result[0].joinedAt;
		guildMember.createdAt = result[0].createdAt;
		guildMember.updatedAt = result[0].updatedAt;

		return guildMember;
	}
}
