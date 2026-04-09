const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const { verificarToken, soloAdmin } = require("../middleware/verificarToken");

// público — ver productos
router.get("/productos", async (req, res) => {
    try {
        const productos = await Producto.find({ disponible: true });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// admin — crear producto
router.post("/productos", verificarToken, soloAdmin, async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// admin — editar producto
router.put("/productos/:id", verificarToken, soloAdmin, async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// admin — eliminar producto
router.delete("/productos/:id", verificarToken, soloAdmin, async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;