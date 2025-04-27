const Producto = require('../models/producto.model');
exports.getProductos = async (req, res) => res.json(await Producto.find());
exports.createProducto = async (req, res) => res.json(await new Producto(req.body).save());
exports.updateProducto = async (req, res) => res.json(await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteProducto = async (req, res) => res.json(await Producto.findByIdAndDelete(req.params.id));
