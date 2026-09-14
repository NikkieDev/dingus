import Project from './project.js';
import User from './user.js';

export default class Data {
	id;
	weight;
	created_at;
	project;
	user;

	static fromJSON(obj) {
		const __self = new Data();

		__self.id = obj.id;
		__self.weight = obj.weight;
		__self.created_at = obj.created_at;
		__self.project = Project.fromJSON(obj.project);
		__self.user = User.fromJSON(obj.user);

		return __self;
	}
}
