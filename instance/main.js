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
app.get("/wordV", (req, res) => {
  var numAlea = Math.floor(0 + Math.random() * (2 - 0));
  var miObjeto = new Object();
  miObjeto.num = numAlea;
  console.log(req.body.cars);
  console.log("Votare por la palabra en la pos" + numAlea);
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
app.post("/task", (req, res) => {
  console.log(req.body);
  console.log(req);
  var info = archives.escribirArchivo(req.body.word, req.body.veces);
  //var info = archives.escribirArchivo('Funciona', 500);
  console.log("El archivo fue " + info);
  console.log(
    "La palabra que se escribira: " +
      req.body.word +
      " y se escribira " +
      req.body.veces
  );
  res.sendFile("pruebaCarga.txt", { root: path.join(__dirname, "") });
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

app.listen(port, () => {
  logger.info(`Instance corriendo y escuchando en el puerto ${port}`);
});
