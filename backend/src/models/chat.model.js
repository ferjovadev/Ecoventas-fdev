const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    texto: { type: String, required: true },
    hora: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
