const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  fecha: Date,
  total: Number,
  estado: String,
  metodo_pago: String,
  cliente_id: mongoose.Schema.Types.ObjectId,
  usuario_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Venta', VentaSchema);
