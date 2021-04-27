const fs = require('fs');
const logger = require('./logger');

const LINE_JUMP_REGEX = /\n/g;
const FILE_PATH = `${__dirname}/../instance.log`;

/**
 * Construye un array de logs tipo string a partir de los leidos en el archivo
 * @param { String } logsString todos los logs del archivo
 * @returns los logs pero ahora en un array
 */
const buildArrayFromString = (logsString = String) => {
	let string = logsString.replace(LINE_JUMP_REGEX, '#');

	return string.split('#');
};

/**
 * Transforma cada log individual tipo string a un objeto con atributos para la ui
 * @param { String } individualLog cada log del archivo
 * @returns un objeto creado a partir del string de cada log individual
 */
const transformLogStringToJson = (individualLog = String) => {
	let auxArray = individualLog.split('--');
	return {
		type: auxArray[0],
		date: auxArray[1],
		message: auxArray[2],
	};
};

/**
 * Lee el archivo de logs y los arma en un array de objetos json
 * @returns un array de jsons con los logs
 */
const readLogs = () => {
	try {
		let fileContent = fs.readFileSync(FILE_PATH, 'utf8').toString();
		logger.info('Archivo logs instancia leido');

		let logs = buildArrayFromString(fileContent);
		logs.pop();
		logs = logs.map((log) => transformLogStringToJson(log));

		return logs;
	} catch (error) {
		logger.error('Al leer archivo. ' + error);
		return [];
	}
};

module.exports = {
	readLogs,
};
