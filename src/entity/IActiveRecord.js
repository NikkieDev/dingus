import SqliteConnection from '../db/sqliteConnection.js';

export default class IActiveRecord {
	constructor() {
		this.db = new SqliteConnection().getDatabase();
		if (IActiveRecord === new.target) {
			throw new Error('IActiveRecord is abstract');
		}
	}

	static async findById(id) {
		throw new Error('static findById(id) must be implemented');
	}

	async save() {
		throw new Error('save() must be implemented');
	}
}
