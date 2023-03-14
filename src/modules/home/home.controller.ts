import {Response, Request} from 'express';

class HomeController {
	async index(req: Request, res: Response) {
		res.send('Hello, world');
	}
}

export default HomeController;
