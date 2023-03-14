import {ApiError} from '@/common/exceptions/ApiError';
import {Roles} from '@/common/types/common';
import {NextFunction, Request, Response} from 'express';

export function restrictedTo(allowedRoles: Roles[]) {
	return function (req: Request, res: Response, next: NextFunction) {
		const user = req.user;

		if (!user) {
			return next(ApiError.Unathorized());
		}

		if (!allowedRoles.includes(user.role as Roles)) {
			return next(ApiError.Forbidden());
		}

		next();
	};
}
