import {Request, Response} from 'express';
import {UserService} from './user.service';

export class UserController {
	constructor(private readonly service: UserService) {
		this.getUserPosts = this.getUserPosts.bind(this);
	}

	public async getUserPosts(req: Request, res: Response) {
		const {userId} = req.params;

		const posts = await this.service.getUserPosts(userId);

		return res.send('Users posts');
	}
}
