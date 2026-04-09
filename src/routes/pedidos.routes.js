const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const { verificarToken, soloAdmin } = require("../middleware/verificarToken");

// usuario — crear pedido
router.post("/pedidos", verificarToken, async (req, res) => {
    try {
        const { items, total } = req.body;
        const pedido = new Pedido({
            usuario: {
                id: req.usuario.id,
                nombre: req.usuario.nombre,
                email: req.usuario.email
            },
            items,
            total
        });
        await pedido.save();
        res.status(201).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// admin — ver todos los pedidos
router.get("/pedidos", verificarToken, soloAdmin, async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ createdAt: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// admin — cambiar estado del pedido
router.put("/pedidos/:id", verificarToken, soloAdmin, async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;