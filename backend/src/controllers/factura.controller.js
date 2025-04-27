const Factura = require('../models/factura.model');

// Crear factura
exports.createFactura = async (req, res) => {
  try {
    const { clienteId, productos } = req.body;

    let total = 0;
    productos.forEach(producto => {
      total += producto.precio * producto.cantidad;
    });

    const nuevaFactura = new Factura({
      numero: `FAC-${Date.now()}`,
      clienteId,
      productos,
      total,
    });

    const factura = await nuevaFactura.save();
    res.status(201).json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear factura' });
  }
};

// Obtener todas las facturas
exports.getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find().populate('clienteId').populate('productos.productoId');
    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las facturas' });
  }
};
