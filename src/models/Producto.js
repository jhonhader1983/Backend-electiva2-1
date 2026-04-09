const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    imagen: { type: String },
    categoria: { type: String },
    disponible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Producto", ProductoSchema);