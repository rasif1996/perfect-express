import {ApiError} from '@/common/exceptions/ApiError';
import {TokensType} from '@/common/types/common';
import {LoginResponseType, SignupResponseType} from '@/common/types/responses.types';
import {SignupUserDto} from '@/models/dtos/user/signup-user.dto';
import {ITokenModel} from '@/models/schemas/token.schema';
import {IUserModel} from '@/models/schemas/user.schema';
import {Model} from 'mongoose';
import {BcryptService} from '@/modules/bcrypt';
import {TokenService} from '@/modules/token/';

export class AuthService {
	constructor(
		private readonly userModel: Model<IUserModel>,
		private readonly bcryptService: BcryptService,
		private readonly tokenService: TokenService
	) {}

	public async signup(login: string, password: string): Promise<SignupResponseType> {
		const encryptedPassword = this.bcryptService.encrypt(password);
		const user = await this.userModel.create({login, password: encryptedPassword});

		return new SignupUserDto(user);
	}

	public async login(login: string): Promise<LoginResponseType> {
		const foundUser = await this.userModel.findOne({login});

		if (!foundUser) {
			throw ApiError.BadRequest('Пользователь не существует');
		}

		const userDto = new SignupUserDto(foundUser);
		const {accessToken, refreshToken} = this.tokenService.generateTokens({...userDto});

		await this.tokenService.saveToken(userDto.id, refreshToken);

		return {
			accessToken,
			refreshToken,
			user: userDto
		};
	}

	public async logout(token: string): Promise<ITokenModel> {
		if (!token) {
			throw ApiError.Unathorized();
		}

		return this.tokenService.clearToken(token);
	}

	public async refresh(token: string): Promise<TokensType> {
		const refreshToken = await this.tokenService.refreshToken(token);

		const user = await this.userModel.findById(refreshToken.userId);

		if (!user) {
			throw ApiError.BadRequest('Something happened to this user');
		}

		const userDto = new SignupUserDto(user);

		const newTokens = this.tokenService.generateTokens({...userDto});

		await this.tokenService.saveToken(userDto.id, newTokens.refreshToken);

		return newTokens;
	}

	public async activate(id: string): Promise<IUserModel> {
		const user = await this.userModel.findOne({activationLink: id});

		if (!user) {
			throw ApiError.BadRequest('Something wrong happened to the activation link');
		}

		if (user.isActivated) {
			throw ApiError.BadRequest('Already activated');
		}

		user.isActivated = true;

		return user.save();
	}
}
