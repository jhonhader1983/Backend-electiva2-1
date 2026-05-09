const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Usuario = require("../src/models/Usuario"); // ✅ corregido

router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: "Email ya registrado" });
    const hashed = await bcrypt.hash(password, 10);
    const usuario = new Usuario({ nombre, apellido, email, password: hashed, telefono });
    await usuario.save();
    res.status(201).json({
      message: "Usuario creado",
      token: "fake-token-" + Date.now(),
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: "Usuario no existe" });
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });
    res.json({
      token: "fake-token-" + Date.now(),
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;