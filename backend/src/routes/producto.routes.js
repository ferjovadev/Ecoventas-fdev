const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller');
router.get('/', controller.getProductos);
router.post('/', controller.createProducto);
router.put('/:id', controller.updateProducto);
router.delete('/:id', controller.deleteProducto);
module.exports = router;