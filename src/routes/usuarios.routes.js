const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Usuario = require("../src/models/Usuario");           // ✅ corregido
const { verificarToken } = require("../src/middleware/verificarToken"); // ✅ corregido

router.get("/usuarios/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/usuarios/perfil", verificarToken, async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, passwordActual, passwordNueva } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    if (email && email !== usuario.email) {
      const emailEnUso = await Usuario.findOne({ email });
      if (emailEnUso) return res.status(400).json({ error: "El correo ya está en uso por otra cuenta" });
    }

    if (passwordNueva) {
      if (!passwordActual) return res.status(400).json({ error: "Debes ingresar tu contraseña actual para cambiarla" });
      const valida = await bcrypt.compare(passwordActual, usuario.password);
      if (!valida) return res.status(400).json({ error: "La contraseña actual es incorrecta" });
      usuario.password = await bcrypt.hash(passwordNueva, 10);
    }

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (direccion !== undefined) usuario.direccion = direccion;

    await usuario.save();

    res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario: {
        id: usuario._id, nombre: usuario.nombre, email: usuario.email,
        telefono: usuario.telefono, direccion: usuario.direccion, rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;