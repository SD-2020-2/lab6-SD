const readline = require('readline'),
	fs = require('fs'),
	NOMBRE_ARCHIVO = 'prueba.txt';
const axios = require('axios');
const FormData = require('form-data');
const { request } = require('http');

var verifyCode = [];

/**
 * Verifica que una palabra se haya escrito una cantidad de
 * veces en un archivo
 * @param {*} palabra digamos: hola
 * @param {*} veces digamos: 500
 * @returns true si la palabra esta la cantidad de veces en el archivo
 */
exports.pruebaCarga = function (palabra, veces) {
	var array = fs.readFileSync(NOMBRE_ARCHIVO).toString().split('\n');
	let i = 0;
	while (array[i] != null) {
		if (palabra != array[i]) {
			return false;
		}
		i++;
	}
	if (i == veces) {
		return true;
	}
	return false;
};

/**
 * Escribe una palabra una cantidad de veces
 * en un archivo txt
 * @param {*} palabra
 * @param {*} veces
 * @returns true si se completo la tarea
 */
exports.escribirArchivo = function (palabra, veces) {
	let data = '';
	while (veces > 0) {
		data += palabra + '\n';
		veces--;
	}
	fs.writeFileSync('pruebaCarga.txt', data);
	return true;
};

exports.escribirMatriz = function (matriz) {
	for (let i = 0; i < matriz.length; i++) {
		for (let i = 0; i < matriz.length; i++) {
			matriz[i][j];
		}
	}
};

/**
 * Envia el archivo
 * prueba carga a un servidor particular
 * @param {*} Puerto
 */
function enviarPruebaCarga(Puerto) {
	console.log('Se esta enviando la prueba de carga al lider...');
	var stream = fs.createReadStream(NOMBRE_ARCHIVO);
	var data = new FormData();
	data.append('file', stream); /*Son parametros Clave Valor 
    DEBEN SER LOS MISMOS EN EL SERVIDOR DE DESTINO
    */
	var req = request(
		{
			host: 'localhost',
			port: Puerto,
			path: '/validarPrueba',
			method: 'POST',
			headers: data.getHeaders(),
		},
		(response) => {
			response.setEncoding('utf8');
			response.on('data', function (body) {
				console.log('Codigo de ' + Puerto + ' es: ' + body);
				verifyCode.push(body);
			});
		}
	);
	data.pipe(req);
}
/**
 * Envia el archivo prueba para ser verificado en todos
 * los servidores
 * @param {*} listaServidores
 */
exports.enviarPruebaATodosLosServidores = function (listaServidores) {
	let i = 1;
	listaServidores.forEach(function (elemento) {
		console.log('Enviando prueba para validar a: ' + elemento);
		enviarPruebaCarga(8080 + i);
		i++;
	});
};

/**
 * Envia tareas a otros servidores
 * La palabra y la cantidad de veces que tiene que escribirla
 * @param {*} listaServidores
 * @param {*} listaTareas
 */
exports.enviarListaTareas = function (listaServidores, palabra, veces) {
	console.log('se supone que envio: ' + palabra + ' veces ' + veces);
	var miObjeto = new Object();
	miObjeto.palabra = palabra;
	miObjeto.veces = veces;
	let i = 1;
	listaServidores.forEach(function (elemento) {
		console.log('Enviando tarea a : ' + elemento);
		axios
			.post(`http://${elemento}:8080/yourTask`, miObjeto)
			.then((response) => {})
			.catch((error) => {
				console.log(error);
			});
		i++;
	});
};

exports.isValidated = function () {
	console.log('La lista de verificacion tiene como tamano: ' + verifyCode.length);
	if (verifyCode.length > 0) {
		verifyCode.forEach(function (elemento) {
			if (elemento == -1) {
				return false;
			}
		});
		return true;
	}
	return false;
};

exports.sendlistVerify = function () {
	return verifyCode;
};
