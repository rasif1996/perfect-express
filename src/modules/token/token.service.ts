import {ApiError} from '@/common/exceptions/ApiError';
import {SignupUserDto} from '@/models/dtos/user/signup-user.dto';
import {ITokenModel} from '@/models/schemas/token.schema';
import jwt from 'jsonwebtoken';
import {Model, Schema} from 'mongoose';
import {ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN} from '@/common/constants';
import {TokensType, UserJwtPayload} from '@/common/types/common';

export class TokenService {
	constructor(private readonly tokenModel: Model<ITokenModel>) {}

	public generateTokens(user: SignupUserDto): TokensType {
		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || 'secret', {
			expiresIn: ACCESS_TOKEN_EXPIRES_IN
		});
		const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || 'secret', {
			expiresIn: REFRESH_TOKEN_EXPIRES_IN
		});

		return {accessToken, refreshToken};
	}

	public async saveToken(userId: Schema.Types.ObjectId, refreshToken: string): Promise<ITokenModel> {
		const token = await this.tokenModel.findOne({userId});

		if (token) {
			token.refreshToken = refreshToken;

			return token.save();
		}

		return this.tokenModel.create({userId, refreshToken});
	}

	public async clearToken(refreshToken: string): Promise<ITokenModel> {
		const token = await this.tokenModel.findOne({refreshToken});

		if (!token) {
			throw ApiError.Unathorized();
		}

		return token.remove();
	}

	public async refreshToken(refreshToken: string): Promise<ITokenModel> {
		const token = TokenService.validateRefreshToken(refreshToken);

		if (!token) {
			throw ApiError.Unathorized('Token invalid or expired');
		}

		const tokenDb = await this.findToken(refreshToken);

		if (!tokenDb) {
			throw ApiError.Unathorized('Token does not exist');
		}

		return tokenDb;
	}

	public static validateAccessToken(token: string): UserJwtPayload | undefined {
		try {
			return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret') as UserJwtPayload;
		} catch {
			return undefined;
		}
	}

	public static validateRefreshToken(token: string): UserJwtPayload | undefined {
		try {
			return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'secret') as UserJwtPayload;
		} catch {
			return undefined;
		}
	}

	private async findToken(refreshToken: string): Promise<ITokenModel | null> {
		return this.tokenModel.findOne({refreshToken});
	}
}
