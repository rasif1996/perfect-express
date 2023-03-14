import {IUserModel} from '@/models/schemas/user.schema';
import {Schema} from 'mongoose';

export class SignupUserDto {
	readonly id: Schema.Types.ObjectId;
	readonly login: string;

	constructor(user: IUserModel) {
		this.id = user._id;
		this.login = user.login;
	}
}
