require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const authRoutes      = require("./routes/auth");
const productosRoutes = require("./routes/productoRoutes"); // ✅ nombre correcto
const pedidosRoutes   = require("./routes/pedidos");

app.use("/auth",      authRoutes);
app.use("/productos", productosRoutes);
app.use("/pedidos",   pedidosRoutes);

app.get("/", (req, res) => res.json({ message: "API La Maison 🌴" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`));