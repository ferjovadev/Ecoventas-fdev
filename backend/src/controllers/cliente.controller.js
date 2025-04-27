const Cliente = require('../models/cliente.model');
exports.getClientes = async (req, res) => res.json(await Cliente.find());
exports.createCliente = async (req, res) => res.json(await new Cliente(req.body).save());
exports.updateCliente = async (req, res) => res.json(await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteCliente = async (req, res) => res.json(await Cliente.findByIdAndDelete(req.params.id));
