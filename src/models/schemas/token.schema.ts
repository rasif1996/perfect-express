import {IToken} from '@/common/types/models.types';
import {Document, model, Schema} from 'mongoose';

export interface ITokenModel extends IToken, Document {}

const schema = new Schema<IToken>(
	{
		refreshToken: {
			type: String,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	},
	{versionKey: false, timestamps: true}
);

export const TokenModel = model<ITokenModel>('Token', schema);
