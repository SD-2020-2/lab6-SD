const express = require("express");
const app = express();
const axios = require("axios");
const port = 8080;
const logger = require("./logs/logger");
const { getMyOwnIP } = require("./scripts/scripts");
const archives = require("./archives/manageFiles"); //Manejo Archivos
var ownIP = getMyOwnIP();
var path = require("path");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var palabra = "";
var veces = 0;

let listaPalabras = [
  "Amazona",
  "Progenitor",
  "Cohete",
  "Verdadero",
  "Lata",
  "Apilar",
  "Dinero",
  "Vecina",
  "Documentos",
  "Circuitos",
];
let listaTareasPendientes = [];
let listPalabrasVote = [];
let listaPixeles = [];

var multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./");
  },
  filename: (req, file, cb) => {
    cb(null, "pruebaCarga.txt");
  },
});

const upload = multer({ storage });
/**
 * Lee la prueba de carga
 * y devulve un codigo diferente de -1
 * si la tarea esta bien hecha
 */
app.post("/validarPrueba", upload.single("file"), function (req, res, next) {
  let creoArchivo = archives.leerPrueba(req, res);
  let validoArchivo = archives.pruebaCarga(palabra, veces);
  if (creoArchivo && validoArchivo) {
    res.send("" + Math.round(Math.random() * (100 - 1) + 1));
  } else {
    res.send("-1");
  }
});

app.get("/word", (req, res) => {
  var word = listaPalabras[getRandomWord()];
  logger.info(
    "Mi instancia es " + ownIP + " y La palabra aleatoria es: " + word
  );
  res.send({ wordV: word });
});

//enviar la lista de palabras a las instancias
app.post("/pixel", (req, res) => {
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

/**
 * Para votar
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

	console.log('Votare por la palabra ' + miObjeto.word);
	//IP DEL COMPUTADOR
	axios.post(`http://192.168.0.8:3000/wordV`, miObjeto);
	res.sendStatus(200);
});

/**
 * Aqui llegan las palabras para voto y se almacenan en la lista
 */
app.post("/listword", (req, res) => {
  logger.info("Llega la lista de palabras" + req.body.word1);
  listPalabrasVote.push(req.body.word1);
  listPalabrasVote.push(req.body.word2);
  res.sendStatus(200);
});

/**
 * Se recibe una palabra y la cantidad de veces que haya que escribirla
 */
app.post("/yourTask", (req, res) => {
  logger.info(
    "La tarea es escribir " + req.body.palabra + " " + req.body.veces + " veces"
  );
  palabra = req.body.palabra;
  veces = req.body.veces;
  res.sendStatus(200);
});

/**
 * Escribe la palabra enviada por parametro (req.body.word)
 * n veces como lo indique (req.body.veces))
 */
app.post('/task', (req, res) => {
	var info = archives.escribirArchivo(req.body.word, req.body.veces);
	//var info = archives.escribirArchivo('Funciona', 500);
	console.log('El archivo fue ' + info);
	console.log('La palabra que se escribira: ' + req.body.word + ' y se escribira ' + req.body.veces);
	res.sendFile('pruebaCarga.txt', { root: path.join(__dirname, '') });
});

//Metodo que da una palabra aleatoria
function getRandomWord() {
  var value = Math.floor(0 + Math.random() * (9 - 0));
  return value;
}

const { readLogs } = require("./logs/logs-controller");
const { Console } = require("console");

app.get("/logs", (req, res) => {
  let logs = readLogs();
  res.send(logs);
});

app.post("/update", (req, res) => {
  let aux = req.body.info.split(",");
  listaTareasPendientes = [];
  aux.forEach((element) => {
    listaTareasPendientes.push(element);
  });

  let aux2 = req.body.pixels.split(",");
  listaPixeles = [];
  aux2.forEach((element) => {
    listaPixeles.push(element);
  });
});

app.get("/listask", (req, res) => {
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
