import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Files {
	static getScriptFiles(dir) {
		return fs.readdirSync(dir).filter(file => file.endsWith('.js'));
	}

	static getCommandsDir() {
		return path.join(__dirname, '..', 'commands');
	}

	static getEventsDir() {
		return path.join(__dirname, '..', 'events');
	}
}
