import IActiveRecord from './IActiveRecord.js';
import { userProfileTable } from '../db/schema.js';

export default class UserProfile extends IActiveRecord {
	id;
	guildMemberId;
	name;
	pronouns;
	gender;
	sexuality;
	createdAt;
	updatedAt;

	constructor(
		guildMemberId = null,
		name = '',
		pronouns = '/',
		sexuality = null,
		gender = null
	) {
		super();

		this.guildMemberId = guildMemberId;
		this.name = name;
		this.pronouns = pronouns;
		this.sexuality = sexuality;
		this.gender = gender;
		this.updatedAt = new Date();
	}

	static new() {
		return new UserProfile();
	}

	async save() {
		const data = {
			guildMemberId: this.guildMemberId,
			name: this.name,
			pronouns: this.pronouns,
			sexuality: this.sexuality,
			gender: this.gender,
			updatedAt: new Date().toISOString(),
		};

		const inserted = await this.db.insert(userProfileTable)
			.values(data)
			.onConflictDoUpdate({ target: userProfileTable.guildMemberId, set: data })
			.returning()
		;

		this.id = inserted[0].id;
	}

	getSubjectivePronoun() {
		return this.pronouns.split('/')[0];
	}

	getObjectivePronoun() {
		return this.pronouns.split('/')[1];
	}
}
