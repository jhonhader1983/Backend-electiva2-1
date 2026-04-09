const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// registro
router.post("/register", async (req, res) => {
    try {
        const { nombre, email, password, edad } = req.body;

        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash, edad });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: "Email o password incorrectos" });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ error: "Email o password incorrectos" });
        }

        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            token, 
            usuario: { 
                id: usuario._id, 
                nombre: usuario.nombre, 
                email: usuario.email,
                rol: usuario.rol
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;