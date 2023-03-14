import {ICommentModel} from '@/models/schemas/comment.schema';
import {IPostModel} from '@/models/schemas/post.schema';
import {Schema} from 'mongoose';

export interface IUser {
	login: string;
	password: string;
	activationLink: string;
	isActivated: boolean;
	posts: IPostModel[];
	role: string;
}

export interface IToken {
	refreshToken: string;
	userId: Schema.Types.ObjectId;
}

export interface IPost {
	title: string;
	text: string;
	userId: Schema.Types.ObjectId;
	image: string;
	comments: ICommentModel[];
}

export interface IComment {
	message: string;
	userId: Schema.Types.ObjectId;
	postId: Schema.Types.ObjectId;
}
