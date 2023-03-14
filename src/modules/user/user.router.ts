import {Roles} from '@/common/types/common';
import {restrictedTo} from '@/middlewares/restrictedTo.middleware';
import {asyncHandler} from '@/router/asyncHandler';
import {Router} from 'express';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {UserModel} from '@/models/schemas/user.schema';

const service = new UserService(UserModel);
const controller = new UserController(service);

const router = Router();

router.get('/:userId/posts', restrictedTo([Roles.ADMIN]), asyncHandler(controller.getUserPosts));

export default router;
