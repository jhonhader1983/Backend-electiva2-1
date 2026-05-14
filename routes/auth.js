const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Usuario = require("../src/models/Usuario");
// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    
    // Verificar si existe
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: "Email ya registrado" });
    
    // Encriptar
    const hashed = await bcrypt.hash(password, 10);
    
    // Crear
    const usuario = new Usuario({
      nombre, apellido, email, password: hashed, telefono
    });
    
    await usuario.save();
    
    res.status(201).json({
      message: "Usuario creado",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: "Usuario no existe" });
    
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });
    
    res.json({
      token: "fake-token-" + Date.now(),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

const nodemailer = require("nodemailer");

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    usuario.resetPasswordCode = code;
    usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await usuario.save();

    // Configurar nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: usuario.email,
      subject: "Recuperación de Contraseña - La Maison",
      text: `Tu código de recuperación es: ${code}\nEste código expirará en 1 hora.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Código enviado a tu correo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const usuario = await Usuario.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) return res.status(400).json({ error: "Código inválido o expirado" });

    usuario.password = await bcrypt.hash(newPassword, 10);
    usuario.resetPasswordCode = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
});

module.exports = router;