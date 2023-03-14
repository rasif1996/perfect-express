import path from 'path';
import fs from 'fs';
import {nanoid} from 'nanoid';
import {ApiError} from '@/common/exceptions/ApiError';
import {FileType} from '@/common/types/common';

export class FileService {
	public createFile(type: FileType, file: Express.Multer.File): string {
		const fileExtension = file.originalname.split('.').pop();
		const fileOriginalName = file.originalname.split('.').shift();
		const fileName = fileOriginalName + '-' + nanoid() + '.' + fileExtension;
		const filePath = path.resolve(__dirname, '../../..', 'public', type);

		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath, {recursive: true});
		}

		fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

		return type + '/' + fileName;
	}
}
