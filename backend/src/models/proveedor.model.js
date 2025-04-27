// Importa mongoose al inicio del archivo
const mongoose = require('mongoose');

// Define el esquema de Proveedor
const ProveedorSchema = new mongoose.Schema({
  ruc: String,
  razon_social: String,
  contacto: String
});

// Exporta el modelo de Proveedor
module.exports = mongoose.model('Proveedor', ProveedorSchema);
