import bcrypt from 'bcrypt';

export class BcryptService {
	private salt: string | number;

	constructor(salt: string | number = 10) {
		this.salt = process.env.CRYPT_SALT || salt;
	}

	encrypt(password: string): string {
		return bcrypt.hashSync(password, this.salt);
	}

	compare(password: string, encrypted: string): boolean {
		return bcrypt.compareSync(password, encrypted);
	}
}
