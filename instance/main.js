const express = require('express');
const app = express();
const axios = require('axios');
const port = 8080;
const logger = require('./logs/logger');
const { getMyOwnIP } = require('./scripts/scripts');
var ownIP = getMyOwnIP();

app.use(express.static('public'));
app.use(express.json());
//app.use(express.urlencoded({ extend: true }));

let listaPalabras = ['Amazona', 'Progenitor', 'Cohete', 'Verdadero', 'Lata', 'Apilar', 'Dinero', 'Vecina', 'Documentos', 'Circuitos'];
let listaTareasPendientes = [];
let listPalabrasVote = [];

app.get('/word', (req, res) => {
	var word = listaPalabras[getRandomWord()];
	logger.info('Mi instancia es ' + ownIP + ' y La palabra aleatoria es: ' + word);
	res.send({ wordV: word });
});

//enviar la lista de palabras a las instancias
app.post('/pixel', (req, res) => {
	var miObjeto = new Object();
	miObjeto.x = req.body.x;
	miObjeto.y = req.body.y;
	miObjeto.color = req.body.color;
	miObjeto.ip = ownIP;
	console.log(miObjeto.x);
	console.log(miObjeto.y);
	axios.post(`http://192.168.0.8:3000/infopixels`, miObjeto);
	res.sendStatus(200);
});

app.get('/wordV', (req, res) => {
	var numAlea = Math.floor(0 + Math.random() * (2 - 0));
	var miObjeto = new Object();
	miObjeto.num = numAlea;
	console.log('Votare por la palabra en la pos' + numAlea);
	//IP DEL COMPUTADOR
	axios.post(`http://192.168.0.8:3000/wordV`, miObjeto);
	res.sendStatus(200);
});

/**
 * Aqui llegan las palabras para voto y se almacenan en la lista
 */
app.post('/listword', (req, res) => {
	listPalabrasVote.push(req.body.word1);
	listPalabrasVote.push(req.body.word2);
	res.sendStatus(200);
});

app.get('/ID', (req, res) => {
	var numAlea = Math.floor(1 + Math.random() * (100 - 1));
	var miObjeto = new Object();
	miObjeto.num = numAlea;
	console.log('El id que dare es' + numAlea);
	//IP DEL COMPUTADOR
	//axios.post(`http://192.168.0.8:3000/wordV`, miObjeto);
	res.sendStatus(200);
});

//Metodo que da una palabra aleatoria
function getRandomWord() {
	var value = Math.floor(0 + Math.random() * (9 - 0));
	return value;
}

app.listen(port, () => {
	logger.info(`Instance corriendo y escuchando en el puerto ${port}`);
});
