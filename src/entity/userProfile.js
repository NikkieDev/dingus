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
		guildMemberId,
		name,
		pronouns,
		sexuality,
		gender
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
		return {
			name: '',
			pronouns: null,
			sexuality: null,
			gender: null,
			getSubjectivePronoun: () => null,
			getObjectivePronoun: () => null,
		};
	}

	async save() {
		const data = {
			guildMemberId: this.guildMemberId,
			name: this.name,
			pronouns: this.pronouns,
			sexuality: this.sexuality,
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

	getSubjectivePronoun() {
		return this.pronouns.split('/')[0];
	}

	getObjectivePronoun() {
		return this.pronouns.split('/')[1];
	}
}
