const express = require('express');
const router = express.Router();
const controller = require('../controllers/proveedor.controller');
router.get('/', controller.getProveedores);
router.post('/', controller.createProveedor);
router.put('/:id', controller.updateProveedor);
router.delete('/:id', controller.deleteProveedor);
module.exports = router;