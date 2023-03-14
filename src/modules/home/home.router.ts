import {Router} from 'express';
import HomeController from './home.controller';

const homeRouter = Router();
const controller = new HomeController();

homeRouter.get('/', controller.index);

export default homeRouter;
