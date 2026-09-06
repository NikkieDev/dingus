import { eq } from 'drizzle-orm';
import { guildTable } from '../db/schema.js';
import IActiveRecord from './IActiveRecord.js';
import SqliteConnection from '../db/sqliteConnection.js';

export default class Guild extends IActiveRecord {
	id;
	discordId;
	ownerDiscordId;
	name;
	description;
	createdAt;
	updatedAt;

	constructor(
		discordId,
		ownerDiscordId,
		name,
		description,
	) {
		super();

		this.discordId = discordId;
		this.ownerDiscordId = ownerDiscordId;
		this.name = name;
		this.description = description;
		this.updatedAt = new Date();
	}

	async save() {
		const data = {
			discordId: this.discordId,
			ownerDiscordId: this.ownerDiscordId,
			name: this.name,
			description: this.description,
			updatedAt: this.updatedAt.toISOString(),
		};

		const inserted = await this.db.insert(guildTable)
			.values(data)
			.onConflictDoUpdate({ target: guildTable.discordId, set: data })
			.returning()
		;

		this.id = inserted[0].id;
	}

	static async findById(discordId) {
		const result = await new SqliteConnection().getDatabase()
			.select()
			.from(guildTable)
			.where(eq(guildTable.discordId, discordId))
		;

		if (0 === result.length) {
			return null;
		}

		const guild = new Guild(
			result[0].discordId,
			result[0].ownerDiscordId,
			result[0].name,
			result[0].description,
		);

		guild.id = result[0].id;
		guild.createdAt = result[0].createdAt;
		guild.updatedAt = result[0].updatedAt;

		return guild;
	}
}
