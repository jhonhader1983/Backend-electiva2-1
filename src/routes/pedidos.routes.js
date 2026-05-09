const express = require("express");
const router = express.Router();
const Pedido = require("../src/models/Pedido"); // ✅ corregido

router.post("/", async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json({ message: "Pedido creado", pedido });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/mis-pedidos", async (req, res) => {
  try {
    const usuarioId = req.query.usuario_id;
    const filtro = usuarioId ? { usuario_id: usuarioId } : {};
    const pedidos = await Pedido.find(filtro).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id/estado", async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;