import Data from './data.js';

export default class Webhook {
	type;
	data;

	static fromJSON(obj) {
		const __self = new Webhook();
		__self.type = obj.type;
		__self.data = Data.fromJSON(obj.data);

		return __self;
	}
}
