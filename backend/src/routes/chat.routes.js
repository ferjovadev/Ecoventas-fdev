const express = require("express");
const router = express.Router();
const Chat = require("../models/chat.model");

// Obtener últimos mensajes (ejemplo 50)
router.get("/", async (req, res) => {
  try {
    const mensajes = await Chat.find().sort({ createdAt: 1 }).limit(50);
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mensajes" });
  }
});

module.exports = router;
