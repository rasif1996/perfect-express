import {Router} from 'express';
import {Database} from '@/database';
import {App} from './app';

export class AppBuilder {
	private database: Database | undefined;
	private router: Router | undefined;
	private port: string;

	constructor() {
		this.port = String(process.env.PORT || 3000);
	}

	public setDatabase(database: Database) {
		this.database = database;

		return this;
	}

	public setRouter(router: Router) {
		this.router = router;

		return this;
	}

	public setPort(port: string) {
		this.port = port;

		return this;
	}

	public build() {
		return new App(this.database, this.router, this.port);
	}
}
