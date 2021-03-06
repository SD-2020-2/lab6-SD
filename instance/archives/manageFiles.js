const readline = require('readline'),
	fs = require('fs'),
	NOMBRE_ARCHIVO = 'pruebaCarga.txt';




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
			console.log('La palabra ' + palabra + " no coincide con " + array[i]);
			return false;
		}
		i++;
		if (i == veces) { 
			console.log('Se valido la prueba de carga: ' + palabra + " veces " + veces);
			return true;
		}
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

function enviarPruebaCarga (IP, Puerto, path) {
	console.log('Se esta enviando la prueba de carga al lider...');
	var stream = fs.createReadStream(NOMBRE_ARCHIVO);
	var data = new FormData();
	data.append('file', stream); /*Son parametros Clave Valor 
    DEBEN SER LOS MISMOS EN EL SERVIDOR DE DESTINO
    */
	var req = request(
		{
			host: IP,
			port: Puerto,
			path: path,
			method: 'POST',
			headers: data.getHeaders(),
		},
		(response) => {
			console.log("Respuesta dese algun esclavo: " + response.statusCode);
		}
	);
	data.pipe(req);
};

exports.enviarPruebaATodosLosServidores = function (listaServidores){
	for (let i = 0; i < listaServidores.length; i++) {
		enviarPruebaCarga(`http://${listaServidores[i]}` , 8080 , 'validarPrueba');
	}
}

exports.leerPrueba = function(req , res){
    fs.readFileSync(req.file.path, 'utf-8', function(err,data){
        if(err){
          res.end(err);
		  return false;
        }
        res.end(data);
    });
	return true;
}