import {JwtPayload} from 'jsonwebtoken';

export interface UserJwtPayload extends JwtPayload {
	login: string;
	id: string;
}

export type TokensType = {
	accessToken: string;
	refreshToken: string;
};

export enum FileType {
	AUDIO = 'audio',
	IMAGE = 'image'
}

export enum Roles {
	ADMIN = 'admin',
	USER = 'user'
}
