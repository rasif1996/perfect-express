import {Document, model, Schema} from 'mongoose';
import {IComment} from '@/common/types/models.types';

export interface ICommentModel extends IComment, Document {}

const schema = new Schema<IComment>(
	{
		message: {
			type: String,
			required: true
		},
		postId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Post'
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	},
	{timestamps: true, versionKey: false}
);

export const CommentModel = model<ICommentModel>('Comment', schema);
