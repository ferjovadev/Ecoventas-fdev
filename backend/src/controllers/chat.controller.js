const Chat = require("../models/chat.model");

exports.getMensajes = async (req, res) => {
  try {
    const mensajes = await Chat.find().sort({ createdAt: 1 });
    res.json(mensajes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};
