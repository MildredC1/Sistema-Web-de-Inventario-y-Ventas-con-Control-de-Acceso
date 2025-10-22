const mysql = require('../config/db.js')

const ProductosModel = {
  listar(db) {
    const query = `SELECT id, nombre, categoria, marca, precio, stock, proveedor_email, rating, creado_es, descuento FROM productos  ORDER BY id DESC`
    mysql.query(query, (error, resultados) => db(error, resultados))
  },


  listarConUsuarios(cb) {
    const query = `
        SELECT 
          productos.id,
          productos.nombre,
          productos.categoria,
          productos.marca,
          productos.precio,
          productos.stock,
          productos.proveedor_email,
          productos.rating,
          productos.creado_es,
          productos.descuento,
          usuarios.id AS usuario_id,
          usuarios.nombre AS usuario_nombre,
          usuarios.correo AS usuario_correo,
          usuarios.admin AS usuario_admin
        FROM productos
        JOIN usuarios ON productos.usuario_id = usuarios.id
        ORDER BY productos.id DESC`;
        mysql.query(query, (error, resultados) => cb(error, resultados));
      },


  crear({ nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento,usuario_id}, cb){
        const query = `
            INSERT INTO productos (nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento,usuario_id) 
            VALUES (?,?,?,?,?,?,?,?,?)`

        const parametros = [nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento,usuario_id]

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

