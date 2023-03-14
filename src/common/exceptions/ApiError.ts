import {ValidationError} from 'express-validator';

export class ApiError extends Error {
	public status: number;
	public errors: ValidationError[];

	constructor(status: number, message: string, errors: ValidationError[] = []) {
		super(message);

		this.status = status;
		this.errors = errors;
	}

	static BadRequest(message: string, errors?: ValidationError[]) {
		return new ApiError(400, message, errors);
	}

	static Forbidden() {
		return new ApiError(409, 'Forbidden');
	}

	static Conflict(message: string, errors?: ValidationError[]) {
		return new ApiError(409, message, errors);
	}

	static Unathorized(message?: string) {
		return new ApiError(401, message || 'Unathorized');
	}
}
