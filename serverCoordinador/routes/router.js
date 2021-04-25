const { Router } = require('express');
const router = Router();

const instanceCtrl = require('./instance-controller');

// Instancias
router.route('/instance').get(instanceCtrl.getInstances);

module.exports = router;
