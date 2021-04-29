const express = require('express');
const app = express();
const axios = require('axios');
const port = 8080;
const logger = require('./logs/logger');
const { getMyOwnIP } = require('./scripts/scripts');
const archives = require('./archives/manageFiles'); //Manejo Archivos
var ownIP = getMyOwnIP();
var path = require('path');
var id;
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var palabra = '';
var veces = 0;

let listaPalabras = ['Amazona', 'Progenitor', 'Cohete'];
let listaTareasPendientes = [];
let listPalabrasVote = [];
let toPaint = [];
let listaPixeles = [];

var multer = require('multer');

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './');
	},
	filename: (req, file, cb) => {
		cb(null, 'pruebaCarga.txt');
	},
});

const upload = multer({ storage });

/**
 * Lee la prueba de carga
 * y devulve un codigo diferente de -1
 * si la tarea esta bien hecha
 */
app.post('/validarPrueba', upload.single('file'), function (req, res, next) {
	let creoArchivo = archives.leerPrueba(req, res);
	let validoArchivo = archives.pruebaCarga(palabra, veces);

	if (creoArchivo && validoArchivo) {
		var aux = Math.round(Math.random() * (100 - 1) + 1);
		id = aux;
		logger.info('El ID que mi instancia ' + ownIP + ' da es ' + aux);
		res.send('' + aux);
	} else {
		res.send('-1');
	}
});

/**
 * Lista de pixeles a mostrar en la interfaz
 */
app.get('/listPixels', (req, res) => {
	var miObjeto = new Object();
	axios
		.get(`http://192.168.0.8:3000/listpixels`)
		.then((response) => {
			console.log(response.data);
			let aux = response.data.split(',');
			listaPixeles = [];
			aux.forEach((element) => {
				listaPixeles.push(element);
			});
			miObjeto.info = listaPixeles.toString();
			console.log(listaPixeles.length);
			console.log('Envia => ' + miObjeto.info);
			res.send(JSON.stringify(miObjeto.info));
		})
		.catch((error) => {
			console.log(error);
		});
});

/**
 * Envia la informacion del pixel (x,y,color) al coordinador
 */
app.post('/pixel', (req, res) => {
	var miObjeto = new Object();
	miObjeto.x = req.body.x;
	miObjeto.y = req.body.y;
	miObjeto.color = req.body.color;
	miObjeto.ip = ownIP;
	axios.post(`http://192.168.0.8:3000/infopixels`, miObjeto);
	res.sendStatus(200);
});

/**
 * Obtiene el voto de interfaz y lo envia al coordinador
 */
app.post('/wordV', (req, res) => {
	var miObjeto = new Object();
	console.log(req.body.cars);
	if (req.body.cars === 'ama' || req.body.cars === 'Amazona') {
		miObjeto.word = 'Amazona';
	} else if (req.body.cars === 'pro' || req.body.cars === 'Progenitor') {
		miObjeto.word = 'Progenitor';
	} else if (req.body.cars === 'coh' || req.body.cars === 'Cohete') {
		miObjeto.word = 'Cohete';
	}

	logger.info('Votare por la palabra ' + miObjeto.word);
	axios.post(`http://192.168.0.8:3000/wordV`, miObjeto);
	res.sendStatus(200);
});

/**
 * Se recibe una palabra y la cantidad de veces que haya que escribirla
 */
app.post('/yourTask', (req, res) => {
	logger.info('La tarea es escribir ' + req.body.palabra + ' ' + req.body.veces + ' veces');
	palabra = req.body.palabra;
	veces = req.body.veces;
	res.sendStatus(200);
});

/**
 * Escribe la palabra enviada por parametro (req.body.word)
 * n veces como lo indique (req.body.veces))
 * y envia el archivo al coordinador para su futura verificacion
 */
app.post('/task', (req, res) => {
	var info = archives.escribirArchivo(req.body.word, req.body.veces);
	logger.info('La palabra que se escribira: ' + req.body.word + ' y se escribira ' + req.body.veces);
	logger.info('Se escribio el archivo? => ' + info);
	res.sendFile('pruebaCarga.txt', { root: path.join(__dirname, '') });
});

const { readLogs } = require('./logs/logs-controller');
const { Console } = require('console');

app.get('/logs', (req, res) => {
	let logs = readLogs();
	res.send(logs);
});

/**
 * Peticion que actualiza continuamente la
 * lista de tareas pendientes y la lista de pixeles
 */
app.post('/update', (req, res) => {
	let aux = req.body.info.split(',');
	listaTareasPendientes = [];
	aux.forEach((element) => {
		listaTareasPendientes.push(element);
	});
});

app.get('/listask', (req, res) => {
	try {
		showListTask();
		res.send(JSON.stringify(listaTareasPendientes));
	} catch (error) {
		res.send(JSON.stringify([]));
	}
});

//Metodo encargado de mostrar la lista
function showListTask() {
	for (let i = 0; i < listaTareasPendientes.length; i++) {
		console.log(listaTareasPendientes[i]);
	}
}
app.listen(port, () => {
	logger.info(`Instance corriendo y escuchando en el puerto ${port}`);
});
