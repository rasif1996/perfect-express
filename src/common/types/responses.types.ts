import {SignupUserDto} from '@/models/dtos/user/signup-user.dto';

export type SignupResponseType = SignupUserDto;

export type LoginResponseType = {
	accessToken: string;
	refreshToken: string;
	user: SignupUserDto;
};
