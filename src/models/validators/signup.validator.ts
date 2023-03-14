import {check} from 'express-validator';
import {UserModel} from '../schemas/user.schema';

export const signupValidator = [
	check('login')
		.exists()
		.withMessage('Поля login обязательно')
		.isLength({min: 3})
		.withMessage('Поле login слишком короткое')
		.custom(value => {
			return UserModel.findOne({login: value}).then(user => {
				if (user) {
					return Promise.reject('Логин уже существует');
				}
			});
		}),
	check('password')
		.exists()
		.withMessage('Поле password обязательно')
		.isLength({min: 3})
		.withMessage('Невалидный пароль'),
	check('passwordConfirmation')
		.exists()
		.withMessage('Повторите пароль')
		.custom((value, {req}) => {
			if (value !== req.body.password) {
				return Promise.reject('Пароль не соответствует');
			}

			return true;
		})
];
