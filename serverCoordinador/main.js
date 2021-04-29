const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const bodyParser = require('body-parser');
const logger = require('./logs/logger');
const archives = require('./archives/manageFiles'); //Manejo Archivos
var server = require('http').Server(app);
let listaServidores = [];
let listaPalabras = [];
let listaPixeles = ['x:250,y:230,color:#fffff', 'x:20,y:30,color:#fffff'];
let listaCertificado = [];
let listaVotos = [0, 0, 0];
var serverReq;
let listaTareasPendientes = [];
var isTime = false;
var count = 0;
const fs = require('fs');

var currentColor;

const executeScripts = require('./scripts/execute-scripts');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes/router'));
app.use(express.static('public'));

app.get('/word', (req, res) => {
	for (let i = 0; i < listaServidores.length; i++) {
		axios.get(`http://${listaServidores[i]}:8080/word`).then((response) => {
			listaPalabras.push(response.data.wordV);
		});
	}
	res.sendStatus(200);
});

app.get('/list', (req, res) => {
	var miObjeto = new Object();
	miObjeto.word1 = listaPalabras[0];
	miObjeto.word2 = listaPalabras[1];
	for (let i = 0; i < listaServidores.length; i++) {
		axios
			.post(`http://${listaServidores[i]}:8080/listword`, miObjeto)
			.then((response) => {})
			.catch((error) => {
				console.log(error);
			});
	}
	res.sendStatus(200);
});

function resolveAfter2Seconds() {
	return new Promise((resolve) => {
		setTimeout(() => {
			axios
				.get(`http://localhost:3000/list`)
				.then((response) => {})
				.catch((error) => {
					console.log(error);
				});
			console.log('Redy');
		}, 4000);
	});
}

async function asyncCall() {
	console.log('calling');
	const result = await resolveAfter2Seconds();
	console.log(result);
}

app.post('/infopixels', async (req, res) => {
	serverReq = req.body.ip;
	logger.info(`la instancia ${serverReq} desea modificar el pixel en la pos x: ${req.body.x}, y:${req.body.y} y con un color ${req.body.color}`);
	listaTareasPendientes.push('la instancia ' + req.body.ip + ' quiere modificar pixel');
	axios
		.get(`http://localhost:3000/word`)
		.then((response) => {})
		.catch((error) => {
			console.log(error);
		});
	asyncCall();
	res.send('Ok');
});

app.post('/wordV', (req, res) => {
	var word = req.body.word;
	console.log('me llega: ' + word);
	listaVotos.push(word);
	count = count + 1;
	if (count >= 2) {
		axios
			.get(`http://localhost:3000/task`)
			.then((response) => {})
			.catch((error) => {
				console.log(error);
			});
	}
	res.sendStatus(200);
});

app.get('/file', (req, res) => {
	axios
		.get(`http://localhost:8080/task`)
		.then((response) => {
			fs.writeFileSync('prueba.txt', response.data);
		})
		.catch((error) => {});
	res.sendStatus(200);
});

/**
 * Envia la prueba de trabajo a la instancia
 * que solicito la votacion
 * Se hace una peticion de la cual se espera un archivo
 */
app.get('/task', (req, res) => {
	var indices = [];
	var element;
	var mayor = 0;
	var word;
	for (let i = 0; i < listaVotos.length; i++) {
		element = listaVotos[i];
		var idx = listaVotos.indexOf(element);
		while (idx != -1) {
			indices.push(idx);
			idx = listaVotos.indexOf(element, idx + 1);
		}
		if (indices.length > mayor) {
			mayor = indices.length;
			word = element;
		}
	}
	var miObjeto = new Object();
	miObjeto.word = word;
	miObjeto.veces = 5000;
	listaTareasPendientes.push(serverReq + ':' + word + ':' + 5000);
	console.log('La palabra que mas votos tuvo fue ' + miObjeto.word);
	axios
		.post(`http://${serverReq}:8080/task`, miObjeto) // => Envia tarea a la instancia
		.then((response) => {
			console.log(response.data);
			fs.writeFileSync('prueba.txt', response.data);
			archives.enviarListaTareas(listaServidores, miObjeto.word, 5000);
			archives.enviarPruebaATodosLosServidores(listaServidores);
		})
		.catch((error) => {
			console.log(error);
		});
	res.sendStatus(200);
});

//Enviar el archivo recivido a todas las instancias
//Las cuales deben responder con un OK

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

//Metodo encargado de mostrar la lista
function showVotes() {
	console.log('lista de Votos');
	for (let i = 0; i < listaVotos.length; i++) {
		console.log(listaVotos[i]);
	}
}

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
