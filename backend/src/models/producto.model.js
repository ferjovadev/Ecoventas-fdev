// Importa mongoose al inicio del archivo
const mongoose = require('mongoose');

// Define el esquema de Producto
const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  descripcion: { type: String, required: true }
});

module.exports = mongoose.model('Producto', ProductoSchema);
