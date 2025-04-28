const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');

// Login simple SIN encriptar passwords
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparamos directo las contraseñas (sin bcrypt)
    if (usuario.password !== password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto-ecoventas', // usa secreto de .env
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: usuario._id,
        name: usuario.nombre,
        email: usuario.email,
        role: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
