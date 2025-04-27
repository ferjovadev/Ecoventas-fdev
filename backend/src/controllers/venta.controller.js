const Venta = require('../models/venta.model');
exports.getVentas = async (req, res) => res.json(await Venta.find());
exports.createVenta = async (req, res) => res.json(await new Venta(req.body).save());
exports.updateVenta = async (req, res) => res.json(await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteVenta = async (req, res) => res.json(await Venta.findByIdAndDelete(req.params.id));
