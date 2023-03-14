import {ApiError} from '@/common/exceptions/ApiError';
import {CreateCommentDto} from '@/models/dtos/user/create-comment.dto';
import {ICommentModel} from '@/models/schemas/comment.schema';
import {IPostModel} from '@/models/schemas/post.schema';
import {IUserModel} from '@/models/schemas/user.schema';
import {Model} from 'mongoose';
import {FileService} from '@/modules/file';
import {FileType} from '@/common/types/common';

export class PostService {
	constructor(
		private readonly postModel: Model<IPostModel>,
		private readonly userModel: Model<IUserModel>,
		private readonly commentModel: Model<ICommentModel>,
		private readonly fileService: FileService
	) {}

	public async getAllPosts(offset: string, limit: string) {
		const DEFAULT_LIMIT = 50;
		const DEFAULT_OFFSET = 0;

		const limitValue = limit ? parseInt(limit) : DEFAULT_LIMIT;
		const offsetValue = offset ? parseInt(offset) : DEFAULT_OFFSET;

		const posts = await this.postModel.find().skip(offsetValue).limit(limitValue);

		const totalCount = await this.postModel.count();

		const totalPages = Math.ceil(totalCount / limitValue);
		const currentPage = Math.ceil(totalCount % offsetValue);

		return {
			posts,
			count: posts.length,
			paging: {
				total: totalCount,
				page: currentPage,
				pages: totalPages
			}
		};
	}

	public async createPost(
		userId: string,
		title: string,
		text: string,
		image: Express.Multer.File | undefined
	): Promise<IPostModel> {
		if (!image) {
			throw ApiError.BadRequest('File is required');
		}

		const imagePath = this.fileService.createFile(FileType.IMAGE, image);

		const user = await this.userModel.findById(userId);

		if (!user) {
			throw ApiError.BadRequest('User is not defined');
		}

		const post = await this.postModel.create({title, text, userId, image: imagePath});

		user.posts.push(post);

		await user.save();

		return post;
	}

	public async deletePost(userId: string, postId: string): Promise<IPostModel> {
		const post = await this.postModel.findById(postId);

		if (!post) {
			throw ApiError.BadRequest('Id is not valid');
		}

		if (String(post.userId) !== userId) {
			throw ApiError.Forbidden();
		}

		await post.remove();

		return post;
	}

	public async patchPost(
		userId: string,
		postId: string,
		data: Partial<IPostModel>,
		image: Express.Multer.File | undefined
	) {
		let imagePath = '';

		if (image) {
			imagePath = this.fileService.createFile(FileType.IMAGE, image);
		}

		const post = await this.postModel.findById(postId);

		if (!post) {
			throw ApiError.BadRequest('Id is not valid');
		}

		if (String(post.userId) !== userId) {
			throw ApiError.Forbidden();
		}

		const updatedPost = await post.updateOne({...data, ...(imagePath ? {image: imagePath} : {})});

		return updatedPost;
	}

	public async getComments(postId: string): Promise<ICommentModel[]> {
		const post = await this.postModel.findById(postId).populate('comments');

		if (!post) {
			throw ApiError.BadRequest('Id is not valid');
		}

		return post.comments;
	}

	public async createComment(userId: string, postId: string, message: string): Promise<CreateCommentDto> {
		const post = await this.postModel.findById(postId).populate('comments');

		if (!post) {
			throw ApiError.BadRequest('Id is not valid');
		}

		const comment = await this.commentModel.create({postId, userId, message});

		if (!comment) {
			throw ApiError.BadRequest('Comment was not created');
		}

		post.comments.push(comment);

		await post.save();

		return new CreateCommentDto(comment);
	}

	public async deleteComment(userId: string, postId: string, commentId: string): Promise<CreateCommentDto> {
		const comment = await this.commentModel.findById(commentId);

		if (!comment) {
			throw ApiError.BadRequest('Comment id is not valid');
		}

		if (String(comment.userId) !== userId) {
			throw ApiError.Forbidden();
		}

		const post = await this.postModel.findById(postId).populate('comments');

		if (!post) {
			throw ApiError.BadRequest('Post id is not valid');
		}

		await comment.remove();

		post.comments = post.comments.filter(comment => comment._id !== commentId);

		await post.save();

		return new CreateCommentDto(comment);
	}

	public async updateComment(
		userId: string,
		postId: string,
		commentId: string,
		data: Partial<ICommentModel>
	) {
		const comment = await this.commentModel.findById(commentId);

		if (!comment) {
			throw ApiError.BadRequest('Comment id is not valid');
		}

		if (String(comment.userId) !== userId) {
			throw ApiError.Forbidden();
		}

		const post = await this.postModel.findById(postId).populate('comments');

		if (!post) {
			throw ApiError.BadRequest('Post id is not valid');
		}

		const updatedComment = await comment.updateOne(data);

		post.comments = post.comments.map(comment =>
			comment._id !== commentId ? comment : ({...comment, ...data} as ICommentModel)
		);

		await post.save();

		return new CreateCommentDto(updatedComment);
	}

	public async getMyPosts(userId: string): Promise<IPostModel[]> {
		const user = await this.userModel.findById(userId).populate('posts');

		if (!user) {
			throw ApiError.BadRequest('User is not defined. Try again');
		}

		return user.posts;
	}
}
