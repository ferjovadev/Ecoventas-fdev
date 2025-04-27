const Usuario = require('../models/usuario.model');
exports.getUsuarios = async (req, res) => res.json(await Usuario.find());
exports.createUsuario = async (req, res) => res.json(await new Usuario(req.body).save());
exports.updateUsuario = async (req, res) => res.json(await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteUsuario = async (req, res) => res.json(await Usuario.findByIdAndDelete(req.params.id));