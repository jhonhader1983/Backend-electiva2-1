const db = require("../db");

const crearProducto = (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  
  // Si usas Cloudinary, la URL estará en req.file.path
  // Si no hay imagen, guardamos un string vacío o nulo
  const imagen = req.file ? req.file.path : "";

  console.log("📦 Intentando crear producto:", { nombre, precio, categoria });

  const sql = `INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES (?, ?, ?, ?, ?)`;
  
  db.query(sql, [nombre, descripcion, precio, categoria, imagen], (err, result) => {
    if (err) {
      console.error("❌ Error al insertar producto en DB:", err.message);
      return res.status(500).json({ error: "Error al guardar el producto en la base de datos" });
    }
    
    console.log("✅ Producto creado exitosamente");
    res.status(201).json({ 
      message: "Producto creado con éxito", 
      id: result.insertId 
    });
  });
};

// También necesitamos una función para LISTAR los productos en el Home
const obtenerProductos = (req, res) => {
  db.query("SELECT * FROM productos", (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener productos" });
    res.json(rows);
  });
};

module.exports = { crearProducto, obtenerProductos };