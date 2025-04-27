const mongoose = require('mongoose');
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  rol: String,
  habilitado: { type: Boolean, default: true }
});
module.exports = mongoose.model('Usuario', UsuarioSchema);