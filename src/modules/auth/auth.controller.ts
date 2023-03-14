import {THIRTY_DAYS} from '@/common/constants';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';

export class AuthController {
	constructor(private readonly service: AuthService) {
		this.register = this.register.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.refresh = this.refresh.bind(this);
		this.activate = this.activate.bind(this);
	}

	public async register(req: Request, res: Response) {
		const {login, password} = req.body;

		const userData = await this.service.signup(login, password);

		res.status(201).json({status: 201, data: userData});
	}

	public async login(req: Request, res: Response) {
		const {login} = req.body;

		const userData = await this.service.login(login);

		res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: THIRTY_DAYS});

		res.status(200).json({status: 200, data: userData});
	}

	public async logout(req: Request, res: Response) {
		const {refreshToken} = req.cookies;

		await this.service.logout(refreshToken);

		res.clearCookie('refreshToken');

		res.status(200).json({status: 200, message: 'Log out'});
	}

	public async refresh(req: Request, res: Response) {
		const {refreshToken} = req.cookies;

		const tokens = await this.service.refresh(refreshToken);

		res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, maxAge: THIRTY_DAYS});

		res.status(200).json({status: 200, data: tokens});
	}

	public async activate(req: Request, res: Response) {
		const {link} = req.params;

		await this.service.activate(link);

		res.status(200).json({status: 200, message: 'Activated'});
	}
}
