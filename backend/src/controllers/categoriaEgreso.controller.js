const CategoriaEgreso = require('../models/categoriaEgreso.model');

// Obtener todas las categorías de egreso
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaEgreso.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error });
  }
};

// Crear nueva categoría de egreso
exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new CategoriaEgreso(req.body);
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la categoría', error });
  }
};

// Actualizar categoría de egreso
exports.actualizarCategoria = async (req, res) => {
  try {
    const actualizada = await CategoriaEgreso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la categoría', error });
  }
};

// Eliminar categoría de egreso
exports.eliminarCategoria = async (req, res) => {
  try {
    await CategoriaEgreso.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar la categoría', error });
  }
};
