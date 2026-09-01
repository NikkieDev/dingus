import Logger from "../util/logger.js";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from "better-sqlite3";

export default class SqliteConnection {
	static instance = null;

	constructor() {
		this.logger = new Logger('sqliteConnection');
		if (SqliteConnection.instance) {
			return SqliteConnection.instance;
		}

		const db = new Database(process.env.DB_FILE);
		this.database = drizzle(db);

		if (!this.database.$client.open) {
			this.logger.error('Cant open database');
			process.exit(3);
		}

		this.logger.info('Database connected');
	}

	getDatabase() {
		return this.database;
	}
}
