import {BcryptService} from '@/modules/bcrypt';
import {check} from 'express-validator';
import {UserModel} from '../schemas/user.schema';

export const loginValidator = [
	check('login')
		.exists()
		.withMessage('Поле login обязательно')
		.custom(value => {
			return UserModel.findOne({login: value}).then(user => {
				if (!user) {
					return Promise.reject('Такого пользователя не существует');
				}
			});
		}),
	check('password')
		.exists()
		.withMessage('Поле password обязательно')
		.custom((value, {req}) => {
			return UserModel.findOne({login: req.body.login}).then(user => {
				if (!user) {
					return Promise.reject('Введите верный логин');
				}

				const bcryptService = new BcryptService();

				const isMatch = bcryptService.compare(value, user.password);

				if (!isMatch) {
					return Promise.reject('Неверный пароль');
				}
			});
		})
];
