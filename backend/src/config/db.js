// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB', error);
    process.exit(1); // Detener el servidor si no se puede conectar
  }
};

module.exports = connectDB;
