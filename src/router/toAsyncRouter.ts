import {RequestHandler} from 'express';
import {asyncHandler} from './asyncHandler';

let methods = ['get', 'post', 'put', 'delete', 'all'];

export function toAsyncRouter(router: any) {
	for (const key in router) {
		if (methods.includes(key)) {
			const method = router[key];

			router[key] = (path: string, ...callbacks: RequestHandler[]) =>
				method.call(router, path, ...callbacks.map((cb: RequestHandler) => asyncHandler(cb)));
		}
	}

	return router;
}

toAsyncRouter.setMethods = (methodsArray: string[]) => {
	methods = methodsArray.slice();
};

toAsyncRouter.getMethods = () => methods.slice();
