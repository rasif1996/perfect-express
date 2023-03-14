import {ApiError} from '@/common/exceptions/ApiError';
import {IPostModel} from '@/models/schemas/post.schema';
import {IUserModel} from '@/models/schemas/user.schema';
import {Model} from 'mongoose';

export class UserService {
	constructor(private readonly userModel: Model<IUserModel>) {}

	public async getUserPosts(userId: string): Promise<IPostModel[]> {
		const user = await this.userModel.findById(userId).populate('posts');

		if (!user) {
			throw ApiError.BadRequest('Unknown user');
		}

		return user.posts;
	}
}
