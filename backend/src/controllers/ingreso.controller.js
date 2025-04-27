const Ingreso = require('../models/ingreso.model');
exports.getIngresos = async (req, res) => res.json(await Ingreso.find());
exports.createIngreso = async (req, res) => res.json(await new Ingreso(req.body).save());
exports.updateIngreso = async (req, res) => res.json(await Ingreso.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteIngreso = async (req, res) => res.json(await Ingreso.findByIdAndDelete(req.params.id));
