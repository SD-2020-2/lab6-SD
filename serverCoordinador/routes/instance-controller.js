const { getInstancesIPs, createInstance, checkInstancesStatus } = require('./../scripts/execute-scripts');

/**
 * Peticion /get de instancias
 * @param { Request } req
 * @param { Response } res
 */
const getInstances = (req = Request, res = Response) => {
	res.status(200).send(getInstancesIPs());
};

/**
 * Peticion /post de instancias
 * @param { Request } req
 * @param { Response } res
 */
const postInstance = (req = Request, res = Response) => {
	console.log(createInstance());
	res.status(200).send('Instancia creada !');
};

const instancesStatus = (req = Request, res = Response) => {
	res.status(200).send(checkInstancesStatus());
};

module.exports = {
	getInstances,
	postInstance,
	instancesStatus,
};
