import {ICommentModel} from '@/models/schemas/comment.schema';

export class CreateCommentDto {
	readonly id;
	readonly message;

	constructor(comment: ICommentModel) {
		this.id = comment._id;
		this.message = comment.message;
	}
}
