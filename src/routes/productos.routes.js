const express = require("express");
const router = express.Router();
const Producto = require("../src/models/Producto"); // ✅ corregido

router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Creando producto:", req.body);
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json({ message: "Plato creado", producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Actualizado", producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;