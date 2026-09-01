import colors from "colors";

export default class Logger {
	#name;
	constructor(name) {
		this.#name = name;
	}

	#log(msg, color) {
		const date = new Date().toISOString();
		console.log(colors[color](`[${date}] ${this.#name} - ${msg}`));
	}

	error(msg) {
		this.#log(msg, 'red');
	}

	info(msg) {
		this.#log(msg, 'yellow');
	}
}
