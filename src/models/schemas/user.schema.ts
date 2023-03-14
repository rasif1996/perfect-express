import {Document, model, Schema} from 'mongoose';
import {IUser} from '@/common/types/models.types';
import {nanoid} from 'nanoid';

export interface IUserModel extends IUser, Document {}

const schema = new Schema<IUser>(
	{
		login: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		isActivated: {
			type: Boolean,
			required: true,
			default: false
		},
		activationLink: {
			type: String,
			required: true
		},
		role: {
			type: String,
			required: true
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post'
			}
		]
	},
	{timestamps: true, versionKey: false}
);

schema.pre('validate', function () {
	this.activationLink = nanoid();
	this.role = 'user';
});

export const UserModel = model<IUserModel>('User', schema);
