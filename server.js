const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usuarioRoutes = require("./src/routes/usuarios.routes");
const authRoutes = require("./src/routes/auth.routes");
const productosRoutes = require("./src/routes/productos.routes");
const pedidosRoutes = require("./src/routes/pedidos.routes");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// agrega esta línea junto a las demás rutas
app.use("/api", productosRoutes);

/// pedidos
app.use("/api", pedidosRoutes);

// rutas de la API
app.use("/api", usuarioRoutes);
app.use("/api/auth", authRoutes);

// conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB conectado 🚀");
})
.catch((error) => {
    console.log("Error de conexión:", error);
});

// ruta de prueba
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});