const express = require('express');
const app = express();
const axios = require('axios');
const port = 8080;
const logger = require('./logs/logger');

app.use(express.static('public'));

//obtiene la direccion ip de la misma instancia
//const { getMyOwnIP } = require('./scripts/scripts');
//var ownIP = getMyOwnIP();
let listaPalabras = [];
let listaTareasPendientes = [];

app.listen(port, () => {
	logger.info(`Instance corriendo y escuchando en el puerto ${port}`);
});
