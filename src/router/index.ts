import {Request, Response, Router} from 'express';

import {errorMiddleware} from '@/middlewares/error.middleware';
import {loggerMiddleware} from '@/middlewares/logger.middleware';
import {authenticationMiddleware} from '@/middlewares/authentication.middleware';
import {AuthRouter} from '@/modules/auth';
import {HomeRouter} from '@/modules/home';
import {PostRouter} from '@/modules/post';
import {UserRouter} from '@/modules/user';

const router = Router();

router.use(loggerMiddleware);

router.use('/', HomeRouter);
router.use('/api/auth', AuthRouter);
router.use('/api/posts', authenticationMiddleware, PostRouter);
router.use('/api/users', authenticationMiddleware, UserRouter);
router.get('/healthChecker', (req: Request, res: Response) => {
	res.status(200).json({
		status: 200,
		message: 'Welcome!'
	});
});

router.use('*', (req: Request, res: Response) => {
	res.status(404).json({message: `Route ${req.originalUrl} not found`, status: 404});
});

router.use(errorMiddleware);

export default router;
