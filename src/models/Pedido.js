const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  items: [{
    nombre: String,
    precio: Number,
    cantidad: Number
  }],
  total: { type: Number, required: true },
  tipoEntrega: { type: String, default: 'domicilio' },
  direccion: String,
  mesa: String,
  contacto: String,
  estado: { type: String, default: 'pendiente' }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);