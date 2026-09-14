export default class User {
	id;
	platform_id;
	name;

	getDiscordId() {
		return this.platform_id;
	}

	static fromJSON(obj) {
		const __self = new User();

		__self.id = obj.id;
		__self.platform_id = obj.platform_id;
		__self.name = obj.name;

		return __self;
	}
}
