import mongoose from 'mongoose';

export class Database {
	public async connect() {
		mongoose.set('strictQuery', false);

		return mongoose.connect(
			`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@example.goi23u5.mongodb.net/?retryWrites=true&w=majority`
		);
	}
}
