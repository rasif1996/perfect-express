import {NextFunction, Request, Response} from 'express';
import {TokenService} from '@/modules/token/token.service';
import {UserModel} from '@/models/schemas/user.schema';
import {ApiError} from '@/common/exceptions/ApiError';
import {UserJwtPayload} from '@/common/types/common';

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
	try {
		const accessToken = req.headers.authorization;

		if (!accessToken) {
			throw ApiError.Unathorized('You are not logged in');
		}

		const tokenType = accessToken.split(' ')[0];
		const token = accessToken.split(' ')[1];

		if (tokenType !== 'Bearer' || !token) {
			throw ApiError.Unathorized('Invalid token');
		}

		const tokenPayload: UserJwtPayload | undefined = TokenService.validateAccessToken(token);

		if (!tokenPayload) {
			throw ApiError.Unathorized('Invalid token or user does not exist');
		}

		const user = await UserModel.findOne({login: tokenPayload.login});

		if (!user) {
			throw ApiError.BadRequest('User with that token no longer exists');
		}

		if (!user.isActivated) {
			throw ApiError.BadRequest('You are not activated');
		}

		req.user = user;

		next();
	} catch (e) {
		next(e);
	}
}
