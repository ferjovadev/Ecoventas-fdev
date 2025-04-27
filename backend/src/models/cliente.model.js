// Importa mongoose al inicio del archivo
const mongoose = require('mongoose');

// Define el esquema de Cliente
const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
});

module.exports = mongoose.model('Cliente', ClienteSchema);
