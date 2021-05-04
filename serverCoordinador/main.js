const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const bodyParser = require('body-parser');
const logger = require('./logs/logger');
const archives = require('./archives/manageFiles'); //Manejo Archivos
const executeScripts = require('./scripts/execute-scripts');
const fs = require('fs');

var server = require('http').Server(app);
let listaServidores = [];
let listaPixeles = [];
let listCertificado = [];
let listaVotos = [];
var serverReq;
let listaTareasPendientes = [];
var count = 0;
var currentColor;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes/router'));
app.use(express.static('public'));

/**
 * Recibe en el request la informacion del pixel
 * enviado por la instancia
 * Aparte de que lo agrega a la lista de tareas pendientes
 */
app.post('/infopixels', async (req, res) => {
	serverReq = req.body.ip;
	currentColor = req.body;
	logger.info(`la instancia ${serverReq} desea modificar el pixel en la pos x: ${req.body.x}, y:${req.body.y} y con un color ${req.body.color}`);
	listaTareasPendientes.push('la instancia ' + req.body.ip + ' quiere modificar pixel');
	res.send('Ok');
});

/**
 * Peticion llamada por la instancia, para las votaciones
 * En el momento que ya estan todas las votaciones
 * procede a asignar la tarea en /task
 */
app.post('/wordV', (req, res) => {
	var word = req.body.word;
	logger.info('La votacion es para la palabra' + word);
	listaVotos.push(word);
	count = count + 1;
	if (count >= listaServidores.length) {
		axios
			.get(`http://localhost:3000/task`)
			.then((response) => {})
			.catch((error) => {});
		count = 0;
	}
	res.sendStatus(200);
});

/**
 * No se que hace este metodo
 */
app.get('/file', (req, res) => {
	axios
		.get(`http://localhost:8080/task`)
		.then((response) => {
			fs.writeFileSync('prueba.txt', response.data);
		})
		.catch((error) => {});
	res.sendStatus(200);
});

app.get('/listpixels', (req, res) => {
	var miObjeto = new Object();
	miObjeto.info = listaPixeles.toString();
	res.send(miObjeto.info);
});

/**
 * Metodo que cuenta cuantas veces esta una palabra en la
 * lista de votaciones
 * @param {*} word
 * @returns el numero de veces que encontro la palabra
 */
function getTime(word) {
	var count = 0;
	listaVotos.forEach((element) => {
		if (element == word) {
			count = count + 1;
		}
	});
	return count;
}

/**
 * Envia la prueba de trabajo a la instancia
 * que solicito la votacion
 * Se hace una peticion de la cual se espera un archivo
 */
app.get('/task', (req, res) => {
	let counts = [];
	counts.push(getTime('Amazona'));
	counts.push(getTime('Progenitor'));
	counts.push(getTime('Cohete'));
	var mayor = 0;
	for (let i = 0; i < counts.length; i++) {
		if (counts[i] != 0) {
			if (counts[i] > mayor) {
				mayor = i;
			}
			if (counts[i] == mayor) {
				mayor = 5;
			}
		}
	}
	listaVotos = [];
	var word;
	if (mayor == 0) {
		word = 'Amazonas';
	} else if (mayor == 1) {
		word = 'Progenitor';
	} else if (mayor == 2) {
		word = 'Cohete';
	} else if (mayor == 5) {
		word = 'X';
	}
	//Si word es igual a X significa que hubo un empate entre las palabras
	if (word != 'X') {
		var miObjeto = new Object();
		miObjeto.word = word;
		miObjeto.veces = 5000;
		listaTareasPendientes.push(serverReq + ':' + word + ':' + 5000);
		logger.info('La palabra que mas votos tuvo fue ' + miObjeto.word);
		axios
			.post(`http://${serverReq}:8080/task`, miObjeto) // => Envia tarea a la instancia
			.then((response) => {
				fs.writeFileSync('prueba.txt', response.data);
				/**
				 * Envia la tarea que hizo la instancia a validar a todas las demas
				 */
				archives.enviarListaTareas(listaServidores, miObjeto.word, 5000);
				archives.enviarPruebaATodosLosServidores(listaServidores);
				setTimeout(isValidated, 3000);
			})
			.catch((error) => {
				console.log(error);
			});
		res.sendStatus(200);
	} else {
		logger.info('No hubo votacion, quedaron en empate. Volver a intentar');
		res.sendStatus(200);
	}
});

/**
 * Si la prueba de carga fue validad en todas las instancias
 * modifica la lista de pixeles
 */
function isValidated() {
	if (archives.isValidated()) {
		logger.info('Pixel a modificar: x:' + currentColor.x + '|y:' + currentColor.y + '|color:' + currentColor.color);
		listaPixeles.push('x:' + currentColor.x + '|y:' + currentColor.y + '|color:' + currentColor.color);
	}
	let list = archives.sendlistVerify();
	var code = '';
	for (let i = 0; i < list.length; i++) {
		if (i + 1 == list.length) {
			code += list[i];
		} else {
			code += list[i] + '-';
		}
	}
	listCertificado.push(code);
	logger.info('Codigo lista: ' + listCertificado[0]);
	showListCertificate();
	sendListCertificate();
}

//Enviar el archivo recivido a todas las instancias
//Las cuales deben responder con un OK

/**
 * Trae la lista de todas las instancias
 * y las coloca en la lista de servidores
 */
setTimeout(() => {
	axios
		.get(`http://localhost:3000/instance`)
		.then((response) => {
			var aux = response.data;
			listaServidores = Object.values(aux);
			showList();
		})
		.catch((error) => {
			console.log(error);
		});
}, 5000);

/**
 * Actualiza cada 5 segundos con todas las instancias
 * la lista de tareas pendientes y la lista
 * de pixeles
 */
setInterval(() => {
	var miObjeto = new Object();
	miObjeto.info = listaTareasPendientes.toString();
	miObjeto.pixels = listaPixeles.toString();
	for (let i = 0; i < listaServidores.length; i++) {
		axios
			.post(`http://${listaServidores[i]}:8080/update`, miObjeto)
			.then((response) => {})
			.catch((error) => {
				console.log(error);
			});
	}
}, 5000);

//Metodo encargado de mostrar la lista
function showList() {
	console.log('Lista de instancias: ');
	for (let i = 0; i < listaServidores.length; i++) {
		console.log(listaServidores[i]);
	}
}

//Metodo encargado de mostrar la lista de certificacion
function showListCertificate() {
	console.log('Lista de Certificado: ');
	for (let i = 0; i < listCertificado.length; i++) {
		console.log(listCertificado[i]);
	}
}

//Metodo encargado de actualizar la lista de certificacion
//a todas las instancias
function sendListCertificate() {
	var miObjeto = new Object();
	miObjeto.info = listCertificado.toString();
	for (let i = 0; i < listaServidores.length; i++) {
		axios
			.post(`http://${listaServidores[i]}:8080/listVerificacion`, miObjeto)
			.then((response) => {})
			.catch((error) => {
				console.log(error);
			});
	}
}

/**
 * Crea un archivo que contiene
 * los codigos de los pxeles para su certificacion
 */
app.post('/fileCert', (req, res) => {
	var info = req.body.info;
	fs.writeFileSync('certificado.txt', info);
	axios.get(`http://localhost:3000/consensoCertificado`);
	res.sendStatus(200);
});

/**
 * Envia el archivo a todas las instancias para que validen
 * el archivo
 */
app.get('/consensoCertificado', (req, res) => {
	var array = fs.readFileSync('certificado.txt').toString().split(',');
	var miObjeto = new Object();
	miObjeto.info = array.toString();
	var count = 0;
	for (let i = 0; i < listaServidores.length; i++) {
		axios
			.post(`http://${listaServidores[i]}:8080/validate`, miObjeto)
			.then((response) => {
				if (response.data === 'Apruebo') {
					count = count + 1;
					logger.info('La instancia ' + listaServidores[i] + ' aprobo la obra');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	res.sendStatus(200);
});

/**
 * Obtiene los logs la instancia especificada en instancenum (2,3,4)
 */
app.get('/logs/:instancenum', (req, res) => {
	let ip = `172.17.0.${req.params.instancenum}`;
	axios
		.get(`http://${ip}:8080/logs`)
		.then((logsArray) => {
			logger.info(`Peticion de logs a instance ${ip}`);
			res.send(logsArray.data);
		})
		.catch((error) => {
			logger.error(`Al traer logs: ${error.message}`);
			res.send([]);
		});
});

server.listen(port, () => {
	logger.info(`Middleware listening on port ${port}`);
});
