const express = require('express');
const router = express.Router();
const controller = require('../controllers/venta.controller');
router.get('/', controller.getVentas);
router.post('/', controller.createVenta);
router.put('/:id', controller.updateVenta);
router.delete('/:id', controller.deleteVenta);
module.exports = router;