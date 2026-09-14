export default class Project {
	id;
	type;
	platform;
	platform_id;

	static fromJSON(obj) {
		const __self = new Project();
		
		__self.id = obj.id;
		__self.type = obj.type;
		__self.platform = obj.platform;
		__self.platform_id = obj.platform_id;

		return __self;
	}
}
