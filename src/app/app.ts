import express, {Express, Router} from 'express';
import {json, urlencoded} from 'body-parser';
import cookie from 'cookie-parser';
import {Database} from '@/database';
import {logger} from '@/common/utils/logger';

export class App {
	private readonly app: Express;
	private running = false;

	constructor(
		private readonly database: Database | undefined,
		private readonly router: Router | undefined,
		private readonly port: string
	) {
		this.app = express();
	}

	public init() {
		this.initMiddlewares();
		this.initRouter();

		this.running = true;
	}

	public async start() {
		if (!this.running) {
			return;
		}

		if (!this.router) {
			logger.error('You do not have a router');

			return;
		}

		if (!this.database) {
			this.connect();

			return;
		}

		this.database
			.connect()
			.then(() => {
				logger.info('MongoDB is connected');

				this.connect();
			})
			.catch(() => {
				logger.error('MongoDB is not connected');
			});
	}

	private connect() {
		this.app.listen(this.port, () => {
			logger.info(`Server is running on port: ${this.port}`);
		});
	}

	private initMiddlewares() {
		this.app.use(json());
		this.app.use(urlencoded({extended: true}));
		this.app.use(cookie());
		this.app.use(express.static('public'));
	}

	private initRouter() {
		if (this.router) {
			this.app.use(this.router);
		}
	}
}
