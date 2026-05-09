const express = require("express")
const router = express.Router()
const db = require("../db") // Esto importa el archivo db.js que configuramos como SQLite

// ... resto del código de pedidos ..
router.post("/", (req, res) => {
  const { items, total, tipoEntrega, direccion, mesa, contacto, usuario_id } = req.body

  // 1. Insertar el pedido
  const sqlPedido = `
    INSERT INTO pedidos (usuario_id, total, tipo_entrega, direccion, mesa, contacto, estado)
    VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
  `
  const valores = [
    usuario_id || null,
    total,
    tipoEntrega || "domicilio",
    direccion || null,
    mesa || null,
    contacto || null,
  ]

  db.query(sqlPedido, valores, (err, result) => {
    if (err) {
      console.error("❌ Error creando pedido:", err)
      return res.status(500).json({ error: "Error al crear pedido", detalle: err.message })
    }

    const pedidoId = result.insertId

    // 2. Insertar los items
    if (items && items.length > 0) {
      const sqlItems = "INSERT INTO pedido_items (pedido_id, nombre, precio, cantidad) VALUES ?"
      const valoresItems = items.map(it => [pedidoId, it.nombre, it.precio, it.cantidad])

      db.query(sqlItems, [valoresItems], (err2) => {
        if (err2) {
          console.error("❌ Error guardando items:", err2)
          return res.status(500).json({ error: "Error al guardar items" })
        }
        res.status(201).json({
          message: "Pedido creado",
          id: pedidoId,
          estado: "pendiente",
        })
      })
    } else {
      res.status(201).json({ message: "Pedido creado", id: pedidoId })
    }
  })
})

// ═══════════════════════════════════════════
// OBTENER MIS PEDIDOS ⭐
// GET /pedidos/mis-pedidos?usuario_id=1
// ═══════════════════════════════════════════
router.get("/mis-pedidos", (req, res) => {
  const usuarioId = req.query.usuario_id

  console.log("📥 Buscando pedidos para usuario:", usuarioId)

  let sql, params

  if (usuarioId) {
    sql = "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC"
    params = [usuarioId]
  } else {
    // Si no envía usuario_id, devuelve todos (modo dev)
    sql = "SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 50"
    params = []
  }

  db.query(sql, params, (err, pedidos) => {
    if (err) {
      console.error("❌ Error obteniendo pedidos:", err)
      return res.status(500).json({ error: "Error al obtener pedidos" })
    }

    if (!pedidos.length) return res.json([])

    // Obtener items de cada pedido
    const pedidoIds = pedidos.map(p => p.id)
    const sqlItems = "SELECT * FROM pedido_items WHERE pedido_id IN (?)"

    db.query(sqlItems, [pedidoIds], (err2, items) => {
      if (err2) {
        console.error("❌ Error obteniendo items:", err2)
        return res.status(500).json({ error: "Error al obtener items" })
      }

      // Asociar items a cada pedido y normalizar campos
      const resultado = pedidos.map(p => ({
        _id: p.id,
        id: p.id,
        usuario: p.usuario_id,
        total: p.total,
        tipoEntrega: p.tipo_entrega,
        direccion: p.direccion,
        mesa: p.mesa,
        contacto: p.contacto,
        estado: p.estado,
        createdAt: p.created_at,
        items: items.filter(it => it.pedido_id === p.id).map(it => ({
          nombre: it.nombre,
          precio: it.precio,
          cantidad: it.cantidad,
        })),
      }))

      console.log(`✅ ${resultado.length} pedidos enviados`)
      res.json(resultado)
    })
  })
})

// ═══════════════════════════════════════════
// CANCELAR PEDIDO
// PUT /pedidos/:id/cancelar
// ═══════════════════════════════════════════
router.put("/:id/cancelar", (req, res) => {
  const id = req.params.id
  const sql = "UPDATE pedidos SET estado = 'cancelado' WHERE id = ? AND estado = 'pendiente'"

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error" })
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Solo se pueden cancelar pedidos pendientes" })
    }
    res.json({ message: "Pedido cancelado", id })
  })
})

// ═══════════════════════════════════════════
// ADMIN: TODOS LOS PEDIDOS
// GET /pedidos
// ═══════════════════════════════════════════
router.get("/", (req, res) => {
  const sql = "SELECT * FROM pedidos ORDER BY created_at DESC"

  db.query(sql, (err, pedidos) => {
    if (err) return res.status(500).json({ error: "Error" })
    if (!pedidos.length) return res.json([])

    const pedidoIds = pedidos.map(p => p.id)
    db.query("SELECT * FROM pedido_items WHERE pedido_id IN (?)", [pedidoIds], (err2, items) => {
      if (err2) return res.status(500).json({ error: "Error items" })

      const resultado = pedidos.map(p => ({
        _id: p.id,
        id: p.id,
        usuario: p.usuario_id,
        total: p.total,
        tipoEntrega: p.tipo_entrega,
        direccion: p.direccion,
        mesa: p.mesa,
        contacto: p.contacto,
        estado: p.estado,
        createdAt: p.created_at,
        items: items.filter(it => it.pedido_id === p.id),
      }))
      res.json(resultado)
    })
  })
})

// ═══════════════════════════════════════════
// ADMIN: CAMBIAR ESTADO
// PUT /pedidos/:id/estado
// ═══════════════════════════════════════════
router.put("/:id/estado", (req, res) => {
  const { estado } = req.body
  const id = req.params.id

  db.query("UPDATE pedidos SET estado = ? WHERE id = ?", [estado, id], (err) => {
    if (err) return res.status(500).json({ error: "Error" })
    res.json({ message: "Estado actualizado", id, estado })
  })
})

module.exports = router