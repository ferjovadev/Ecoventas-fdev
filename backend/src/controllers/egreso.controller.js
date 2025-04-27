const Egreso = require('../models/egreso.model');
exports.getEgresos = async (req, res) => res.json(await Egreso.find());
exports.createEgreso = async (req, res) => res.json(await new Egreso(req.body).save());
exports.updateEgreso = async (req, res) => res.json(await Egreso.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteEgreso = async (req, res) => res.json(await Egreso.findByIdAndDelete(req.params.id));