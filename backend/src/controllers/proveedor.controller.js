const Proveedor = require('../models/proveedor.model');
exports.getProveedores = async (req, res) => res.json(await Proveedor.find());
exports.createProveedor = async (req, res) => res.json(await new Proveedor(req.body).save());
exports.updateProveedor = async (req, res) => res.json(await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteProveedor = async (req, res) => res.json(await Proveedor.findByIdAndDelete(req.params.id));
