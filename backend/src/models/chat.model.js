const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    nombre: String,
    texto: String,
    hora: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
