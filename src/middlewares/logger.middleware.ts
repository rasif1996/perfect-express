import {logger} from '@/common/utils/logger';
import {NextFunction, Request, Response} from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
	logger.debug(`${req.method}: ${req.path}`);

	next();
}
