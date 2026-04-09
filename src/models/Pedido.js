const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
    usuario: {
        id: { type: String },
        nombre: { type: String, required: true },
        email: { type: String }
    },
    items: [
        {
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            cantidad: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    estado: { type: String, enum: ["pendiente", "en proceso", "entregado"], default: "pendiente" }
}, { timestamps: true });

module.exports = mongoose.model("Pedido", PedidoSchema);