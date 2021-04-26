const express = require('express');
const app = express();
const axios = require('axios');
const port = 8080;
const logger = require('./logs/logger');

app.use(express.static('public'));

const bodyParser = require('body-parser');
let listaPalabras = ['Amazona', 'Progenitor', 'Cohete', 'Verdadero', 'Lata', 'Apilar', 'Dinero', 'Vecina', 'Documentos', 'Circuitos'];
let listaTareasPendientes = [];

app.get('/word', (req, res) => {
	var word = listaPalabras[getRandomWord()];
	console.log('La palabra aleatoria es: ' + word);
	res.send({ wordV: word });
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

//Metodo que da una palabra aleatoria
function getRandomWord() {
	var value = Math.floor(0 + Math.random() * (9 - 0));
	return value;
}

app.listen(port, () => {
	logger.info(`Instance corriendo y escuchando en el puerto ${port}`);
});
