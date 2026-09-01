import { Events } from "discord.js";
import Logger from '../util/logger.js';

export default {
	name: Events.ClientReady,
	async execute(ctx) {
		const logger = new Logger('onClientReady');
		logger.info('Client is ready');
	}
}
