const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true },
    }
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Factura', facturaSchema);
