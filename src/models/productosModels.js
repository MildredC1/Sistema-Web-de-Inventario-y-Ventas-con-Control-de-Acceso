const mysql = require('../config/db.js')

const ProductosModel = {
  listar(db) {
    const query = `SELECT id, nombre, categoria, marca, precio, stock, proveedor_email, rating,   creado_es, descuento FROM productos  ORDER BY id DESC`
    mysql.query(query, (error, resultados) => db(error, resultados))
  }
}

module.exports = ProductosModel

