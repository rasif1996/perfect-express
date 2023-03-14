import {Router} from 'express';
import {UserModel} from '@/models/schemas/user.schema';
import {AuthController} from './auth.controller';
import {BcryptService} from '@/modules/bcrypt/';
import {AuthService} from './auth.service';
import {signupValidator} from '@/models/validators/signup.validator';
import {loginValidator} from '@/models/validators/login.validator';
import {validationMiddleware} from '@/middlewares/validation.middleware';
import {TokenService} from '@/modules/token';
import {TokenModel} from '@/models/schemas/token.schema';
import {asyncHandler} from '@/router/asyncHandler';

const router = Router();

const bcryptService = new BcryptService();
const tokenService = new TokenService(TokenModel);
const service = new AuthService(UserModel, bcryptService, tokenService);

const controller = new AuthController(service);

router.post('/register', validationMiddleware(signupValidator), asyncHandler(controller.register));
router.post('/login', validationMiddleware(loginValidator), asyncHandler(controller.login));
router.post('/logout', asyncHandler(controller.logout));
router.post('/refresh', asyncHandler(controller.refresh));
router.get('/activate/:link', asyncHandler(controller.activate));

export default router;
