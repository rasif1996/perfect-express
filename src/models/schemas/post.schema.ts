import {IPost} from '@/common/types/models.types';
import {Document, model, Schema} from 'mongoose';

export interface IPostModel extends IPost, Document {}

const schema = new Schema<IPost>(
	{
		title: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment'
			}
		]
	},
	{timestamps: true, versionKey: false}
);

export const PostModel = model<IPostModel>('Post', schema);
