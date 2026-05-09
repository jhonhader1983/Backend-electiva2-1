const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ error: "No token" })

  const token = authHeader.split(" ")[1] // "Bearer xxxxx"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.usuario = decoded // { id, email, rol }
    next()
  } catch (err) {
    res.status(401).json({ error: "Token inválido" })
  }
}