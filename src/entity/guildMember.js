import IActiveRecord from './IActiveRecord.js';
import UserProfile from '../entity/userProfile.js';
import { memberTable, userProfileTable } from '../db/schema.js';
import SqliteConnection from '../db/sqliteConnection.js';
import { eq } from 'drizzle-orm';

export default class GuildMember extends IActiveRecord {
	id;
	memberId;
	joinedAt;

	constructor(
		memberId,
	) {
		super();

		this.memberId = memberId;
		this.joinedAt = new Date();
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
			result[0].about,
		);

		profile.updatedAt = result[0].updatedAt;
		profile.createdAt = result[0].createdAt;

		return profile;
	}

	async save() {
		const data = {
			memberId: this.memberId,
			guildId: this.guildId,
			joinedAt: this.joinedAt.toISOString(),
		};

		const inserted = await this.db.insert(memberTable)
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
	static async find(memberId) {
		const result = await new SqliteConnection().getDatabase()
			.select()
			.from(memberTable)
			.where(eq(memberTable.memberId, memberId))
		;

		if (0 === result.length) {
			return null;
		}

		const guildMember = new GuildMember(result[0].memberId);

		guildMember.id = result[0].id;
		guildMember.joinedAt = result[0].joinedAt;

		return guildMember;
	}
}
