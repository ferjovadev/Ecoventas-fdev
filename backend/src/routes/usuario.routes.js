const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
router.get('/', controller.getUsuarios);
router.post('/', controller.createUsuario);
router.put('/:id', controller.updateUsuario);
router.delete('/:id', controller.deleteUsuario);
module.exports = router;