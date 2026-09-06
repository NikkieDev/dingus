import IActiveRecord from './IActiveRecord.js';
import { userProfileTable } from '../db/schema.js';

export default class UserProfile extends IActiveRecord {
	id;
	guildMemberId;
	name;
	pronouns;
	gender;
	createdAt;
	updatedAt;

	constructor(
		guildMemberId,
		name,
		pronouns,
		gender
	) {
		super();

		this.guildMemberId = guildMemberId;
		this.name = name;
		this.pronouns = pronouns;
		this.gender = gender;
		this.updatedAt = new Date();
	}

	async save() {
		const data = {
			guildMemberId: this.guildMemberId,
			name: this.name,
			pronouns: this.pronouns,
			gender: this.gender,
			updatedAt: this.updatedAt.toISOString(),
		};

		const inserted = await this.db.insert(userProfileTable)
			.values(data)
			.onConflictDoUpdate({ target: userProfileTable.guildMemberId, set: data })
			.returning()
		;

		this.id = inserted[0].id;
	}
}
