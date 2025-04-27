const express = require('express');
const router = express.Router();
const categoriaEgresoController = require('../controllers/categoriaEgreso.controller');  // Verifica que la ruta sea correcta

// Rutas para las categorías de egreso
router.get('/', categoriaEgresoController.obtenerCategorias);
router.post('/', categoriaEgresoController.crearCategoria);
router.put('/:id', categoriaEgresoController.actualizarCategoria);
router.delete('/:id', categoriaEgresoController.eliminarCategoria);

module.exports = router;
