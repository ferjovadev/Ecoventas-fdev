const mongoose = require('mongoose');

const EgresoSchema = new mongoose.Schema({
  fecha: Date,
  monto: Number,
  categoria: String,
  descripcion: String,
  proveedor_id: mongoose.Schema.Types.ObjectId,
  comprobante: String,
  usuario_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Egreso', EgresoSchema);
