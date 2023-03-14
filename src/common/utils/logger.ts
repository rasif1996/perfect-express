import {format, createLogger, transports, addColors} from 'winston';

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white'
};

addColors(colors);

const configuration = {
	level: 'debug',
	transports: [
		new transports.File({
			filename: 'logs/all.log'
		}),
		new transports.File({
			level: 'error',
			filename: 'logs/error.log'
		}),
		new transports.Console({
			format: format.combine(
				format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
				format.align(),
				format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
				format.colorize({all: true})
			)
		})
	]
};

export const logger = createLogger(configuration);
