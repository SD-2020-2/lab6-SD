const { execSync } = require('child_process');

const LINE_JUMP_REGEX = /\n/g;

/**
 * Reemplaza los saltos de linea \n con comas y convierte el string en un array
 * @param { String } string la cadena a convertir en un array
 * @returns { Array:String } array de los objetos que venian en el String
 */
const buildArrayFromString = (string = String) => {
	string = string.trim();
	string = string.replace(LINE_JUMP_REGEX, ',');

	return string.split(',').reverse();
};

/**
 * Obtiene las ips de las instancias corriendo en docker
 * @returns un array con las ips de los contenedores que actualmente estan corriendo de la imagen instancia
 */
const getInstancesIPs = () => {
	let instancePorts = execSync(`bash ${__dirname}/list-containers.sh`).toString();

	return buildArrayFromString(instancePorts);
};



module.exports = {
	getInstancesIPs,
};
