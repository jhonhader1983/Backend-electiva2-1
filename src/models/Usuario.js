const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  apellido: String,
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: String,
  rol:      { type: String, default: 'usuario' },
  resetPasswordCode: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);