import {Router} from 'express';
import {PostsController} from './post.controller';
import {PostService} from './post.service';
import {PostModel} from '@/models/schemas/post.schema';
import {validationMiddleware} from '@/middlewares/validation.middleware';
import {createPostValidator} from '@/models/validators/create-post.validator';
import {UserModel} from '@/models/schemas/user.schema';
import {asyncHandler} from '@/router/asyncHandler';
import {CommentModel} from '@/models/schemas/comment.schema';
import {createCommentValidator} from '@/models/validators/create-comment.validator';
import {uploadMemory} from '@/app/uploadFile';
import {FileService} from '@/modules/file';

const fileService = new FileService();
const service = new PostService(PostModel, UserModel, CommentModel, fileService);
const controller = new PostsController(service);

const router = Router();

router.get('/', asyncHandler(controller.getAllPosts));
router.post(
	'/',
	uploadMemory.single('image'),
	validationMiddleware(createPostValidator),
	asyncHandler(controller.createPost)
);
router.delete('/:postId', asyncHandler(controller.deletePost));
router.patch('/:postId', uploadMemory.single('image'), asyncHandler(controller.patchPost));

router.get('/:postId/comments', asyncHandler(controller.getComments));
router.post(
	'/:postId/comments',
	validationMiddleware(createCommentValidator),
	asyncHandler(controller.createComment)
);
router.delete('/:postId/comments/:commentId', asyncHandler(controller.deleteComment));
router.patch('/:postId/comments/:commentId', asyncHandler(controller.updateComment));

router.get('/me', asyncHandler(controller.getMyPosts));

export default router;
