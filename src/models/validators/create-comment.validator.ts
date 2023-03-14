import {check} from 'express-validator';

export const createCommentValidator = [check('message').exists().withMessage('Message is required')];
