const express = require('express');
const app = express();
const axios = require('../instance/node_modules/axios');
const port = 8080;
const bodyParser = require('body-parser');
//obtiene la direccion ip de la misma instancia
const { getMyOwnIP } = require('./scripts/scripts');
var ownIP = getMyOwnIP();
let listaPalabras = [];
let listaTareasPendientes = [];


server.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});