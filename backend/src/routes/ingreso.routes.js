const express = require('express');
const router = express.Router();
const controller = require('../controllers/ingreso.controller');
router.get('/', controller.getIngresos);
router.post('/', controller.createIngreso);
router.put('/:id', controller.updateIngreso);
router.delete('/:id', controller.deleteIngreso);
module.exports = router;