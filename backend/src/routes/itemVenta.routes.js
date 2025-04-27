const express = require('express');
const router = express.Router();
const itemVentaController = require('../controllers/itemVenta.controller');  // Asegúrate de que la ruta sea correcta

// Rutas para itemVentas
router.get('/', itemVentaController.getItemVentas);  // Asegúrate de que la función esté correctamente definida
router.post('/', itemVentaController.createItemVenta);
router.put('/:id', itemVentaController.updateItemVenta);
router.delete('/:id', itemVentaController.deleteItemVenta);

module.exports = router;
