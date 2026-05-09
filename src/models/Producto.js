const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  categoria: String,
  imagen: String,
  disponible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);