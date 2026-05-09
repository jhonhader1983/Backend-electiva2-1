const express = require("express");
const router = express.Router();
const Producto = require('../src/models/Producto');
// GET todos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear
router.post("/", async (req, res) => {
  try {
    console.log("Creando producto:", req.body);
    const { nombre, descripcion, precio, categoria, imagen } = req.body;
    
    const producto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen
    });
    
    await producto.save();
    res.status(201).json({ message: "Plato creado", producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;