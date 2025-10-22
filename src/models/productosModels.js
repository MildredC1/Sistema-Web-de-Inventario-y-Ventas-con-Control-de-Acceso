const mysql = require('../config/db.js')

const ProductosModel = {
  listar(db) {
    const query = `SELECT id, nombre, categoria, marca, precio, stock, proveedor_email, rating, creado_es, descuento FROM productos  ORDER BY id DESC`
    mysql.query(query, (error, resultados) => db(error, resultados))
  },

  crear({id, nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento}, cb){
        const query = `
            INSERT INTO productos (id, nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento) 
            VALUES (?,?,?,?,?,?,?,?,?)`

        const parametros = [id, nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento]

        mysql.query(query, parametros, (err, results) => cb(err, results))
  },
  
  editar({id, nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento}, cb){
    const query = `
      UPDATE productos
      SET nombre = ?, categoria = ?, marca = ?, precio = ?, stock = ?, proveedor_email = ?, rating = ?, descuento = ?
      WHERE id = ?`
    
    const parametros = [nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento, id]

    mysql.query(query, parametros, (err, results) => cb(err, results))
  },

  eliminar(id, cb) {
        const query = `
            DELETE FROM productos
            WHERE id = ?`

            mysql.query(query, [id], (err, results) => cb(err, results))
    }

}

module.exports = ProductosModel

