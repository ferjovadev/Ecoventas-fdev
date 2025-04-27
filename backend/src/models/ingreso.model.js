const mongoose = require('mongoose');

const IngresoSchema = new mongoose.Schema({
  fecha: Date,
  monto: Number,
  tipo: String,
  descripcion: String,
  venta_id: mongoose.Schema.Types.ObjectId,
  usuario_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Ingreso', IngresoSchema);
