import multer from 'multer';
import {nanoid} from 'nanoid';

const diskStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = nanoid();
		const mimetype = file.mimetype.split('/')[0];
		const ext = file.mimetype.split('/')[1];

		if (mimetype === 'image') {
			cb(null, '/uploads/images/' + file.fieldname + '-' + uniqueSuffix + ext);
		}

		cb(null, '/uploads/files/' + file.fieldname + '-' + uniqueSuffix + ext);
	}
});

const memoryStorage = multer.memoryStorage();

export const uploadDisk = multer({storage: diskStorage});

export const uploadMemory = multer({storage: memoryStorage});
