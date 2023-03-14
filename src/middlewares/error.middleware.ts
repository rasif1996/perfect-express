import {ApiError} from '@/common/exceptions/ApiError';
import {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import {logger} from '@/common/utils/logger';

export function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
	if (error instanceof mongoose.Error.CastError) {
		logger.error(`Cast Error: ${error.message}`);

		return res.status(400).json({message: `Invalid ObjectId: ${error.path}`, status: 400});
	}

	if (error instanceof ApiError) {
		logger.error(`Api Error: ${error.message}`);

		return res
			.status(error.status)
			.json({message: error.message, status: error.status, errors: error.errors});
	}

	logger.error(`Server Error: ${error.message}`);

	res.status(500).send({message: `Unexpected server error`, status: 500, errors: error.message});
}
