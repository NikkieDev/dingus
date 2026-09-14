import Logger from './util/logger.js';
import Webhook from './model/TopGG/webhook.js';
import GuildMember from './entity/guildMember.js';
import express from 'express';
import crypto from 'crypto';

export default class WebhookServer {
	constructor(botClient) {
		this.logger = new Logger('Webhooks');

		this.app = express();
		this.port = parseInt(process.env.PORT);

		this.app.use(express.json({ verify: (req, res, buf, encoding) => {
			req.rawBody = buf.toString('utf-8');
		}}));

		this.app.post('/vote', async (req, res) => {
			const signature = req.get('x-topgg-signature');
			const body = req.rawBody;

			if (!this.verifyTopGGWebhook(body, signature)) {
				return res.send('Unauthorized', 401);
			}

			const serializedBody = Webhook.fromJSON(req.body);
			const discordId = serializedBody.data.user.getDiscordId();

			const member = await GuildMember.find(discordId);
			if (member) {
				await member.addVote();
				await member.save();

				const voteCount = await member.getVoteCount();
				this.logger.info(`${discordId} has voted! Vote count: ${voteCount}`);

				try {
					const dmChannel = await botClient.users.createDM(discordId);
					await dmChannel.send(`Thanks for voting! You've voted ${voteCount} times`);
				} catch (error) {
					this.logger.error(error.message);
				}
			}

			return res.status(200).send('ok');
		});

		this.logger.info('ready to listen');
	}

	listen() {
		this.app.listen(this.port);
		this.logger.info(`Listening on port ${this.port}`);
	}

	verifyTopGGWebhook(body, sig) {
		const [tPart, v1Part] = sig.split(',');
		const timestamp = tPart.split('=')[1];
		const receivedSig = v1Part.split('=')[1];

		const expected = crypto
			.createHmac('sha256', process.env.TOP_GG_WEBHOOK_SECRET)
			.update(`${timestamp}.${body}`)
			.digest('hex')
		;

		return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSig));
	}
}
