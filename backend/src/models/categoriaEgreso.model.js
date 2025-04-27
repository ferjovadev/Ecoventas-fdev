const mongoose = require('mongoose');

const CategoriaEgresoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true }
});

module.exports = mongoose.model('CategoriaEgreso', CategoriaEgresoSchema);
