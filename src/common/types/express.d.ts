import {IUserModel} from '@/models/schemas/user.schema';

declare module 'express' {
	interface Request {
		user?: IUserModel;
	}
}
