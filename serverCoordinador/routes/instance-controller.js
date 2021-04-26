const { getInstancesIPs } = require('./../scripts/execute-scripts');

/**
 * Peticion /get de instancias
 * @param { Request } req
 * @param { Response } res
 */
const getInstances = (req = Request, res = Response) => {
	res.status(200).send(getInstancesIPs());
};

module.exports = {
	getInstances,
};
