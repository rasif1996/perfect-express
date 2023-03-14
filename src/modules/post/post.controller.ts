import {Request, Response} from 'express';
import {PostService} from '@/modules/post';
import {ApiError} from '@/common/exceptions/ApiError';

export class PostsController {
	constructor(private readonly service: PostService) {
		this.getAllPosts = this.getAllPosts.bind(this);
		this.createPost = this.createPost.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.patchPost = this.patchPost.bind(this);

		this.getComments = this.getComments.bind(this);
		this.createComment = this.createComment.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.updateComment = this.updateComment.bind(this);

		this.getMyPosts = this.getMyPosts.bind(this);
	}

	public async getAllPosts(req: Request, res: Response) {
		const {limit, offset} = req.query as {limit: string; offset: string};

		const postsData = await this.service.getAllPosts(offset, limit);

		res.status(200).json({status: 200, data: postsData});
	}

	public async createPost(req: Request, res: Response) {
		const {title, text} = req.body;
		const {id} = req.user || {};
		const image = req.file;

		const createdPost = await this.service.createPost(id, title, text, image);

		res.status(201).json({status: 201, data: createdPost});
	}

	public async deletePost(req: Request, res: Response) {
		const {postId} = req.params;
		const {id} = req.user || {};

		const deletedPost = await this.service.deletePost(id, postId);

		res.status(200).json({status: 200, data: deletedPost});
	}

	public async patchPost(req: Request, res: Response) {
		const {postId} = req.params;
		const {id} = req.user || {};
		const data = req.body;
		const image = req.file;

		const patchedPost = await this.service.patchPost(id, postId, data, image);

		res.status(200).json({status: 200, data: patchedPost});
	}

	public async getComments(req: Request, res: Response) {
		const {postId} = req.params;

		const comments = await this.service.getComments(postId);

		res.status(200).json({status: 200, data: comments});
	}

	public async createComment(req: Request, res: Response) {
		const {postId} = req.params;
		const {id} = req.user || {};
		const {message} = req.body;

		const createdComment = await this.service.createComment(id, postId, message);

		res.status(201).json({status: 201, data: createdComment});
	}

	public async deleteComment(req: Request, res: Response) {
		const {postId, commentId} = req.params;
		const {id} = req.user || {};

		const deletedComment = await this.service.deleteComment(id, postId, commentId);

		res.status(200).json({status: 200, data: deletedComment});
	}

	public async updateComment(req: Request, res: Response) {
		const {postId, commentId} = req.params;
		const {id} = req.user || {};
		const data = req.body;

		const updatedComment = await this.service.updateComment(id, postId, commentId, data);

		res.status(200).json({status: 200, data: updatedComment});
	}

	public async getMyPosts(req: Request, res: Response) {
		const {id} = req.user || {};

		const myPosts = await this.service.getMyPosts(id);

		res.status(200).json({status: 200, data: myPosts});
	}
}
