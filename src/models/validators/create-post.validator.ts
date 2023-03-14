import {check} from 'express-validator';

export const createPostValidator = [
	check('title').exists().withMessage('Title is required'),
	check('text').exists().withMessage('Text is required'),
	check('image').custom((value, {req}) => {
		if (!req.file) {
			throw new Error('Please upload an image file');
		} else if (!req.file.mimetype.startsWith('image/')) {
			throw new Error('Please upload an image file');
		}

		return true;
	})
];
