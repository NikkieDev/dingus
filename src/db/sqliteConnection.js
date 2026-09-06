import Logger from "../util/logger.js";
import { drizzle } from 'drizzle-orm/better-sqlite3';

export default class SqliteConnection {
	static instance = null;

	constructor() {
		if (SqliteConnection.instance) {
			return SqliteConnection.instance;
		}

		this.logger = new Logger('sqliteConnection');
		this.database = drizzle(process.env.DB_FILE);

		if (!this.database.$client.open) {
			this.logger.error('Cant open database');
			process.exit(3);
		}

		this.logger.info('Database connected');
		SqliteConnection.instance = this;
	}

	getDatabase() {
		return this.database;
	}
}
