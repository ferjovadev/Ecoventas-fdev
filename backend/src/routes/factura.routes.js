const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

// Rutas para facturas
router.post('/', facturaController.createFactura);  // Crear factura
router.get('/', facturaController.getFacturas);    // Obtener todas las facturas

module.exports = router;
