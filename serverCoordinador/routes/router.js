const { Router } = require('express');
const router = Router();

const instanceCtrl = require('./instance-controller');

// Instancias
router.route('/instance').get(instanceCtrl.getInstances);
router.route('/instance').post(instanceCtrl.postInstance);
router.route('/instancestatus').get(instanceCtrl.instancesStatus);

module.exports = router;
