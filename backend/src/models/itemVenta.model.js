const mongoose = require('mongoose'); // Asegúrate de importar mongoose

const ItemVentaSchema = new mongoose.Schema({
  cantidad: Number,
  precio_unitario: Number,
  venta_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta' },
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
});

module.exports = mongoose.model('ItemVenta', ItemVentaSchema);
