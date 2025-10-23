const mysql = require('../config/db.js')

const VentasModel = {
    // Lista el historial de ventas, uniendo con la tabla productos para mostrar el nombre.
    listar(cb) {
        const query = `
            SELECT 
                v.id,
                v.cantidad,
                v.fecha,
                p.nombre as producto_nombre, 
                u.nombre as vendedor_nombre
            FROM ventas v
            JOIN productos p ON v.producto_id = p.id
            JOIN usuarios u ON v.vendedor_id = u.id
            ORDER BY v.fecha DESC`  
        mysql.query(query, (error, resultados) => cb(error, resultados))
    },

    // Busca el stock actual de un producto
    buscarStock(productoId, cb) {
        const query = `SELECT stock FROM productos WHERE id = ?`
        
        mysql.query(query, [productoId], (error, resultados) => cb(error, resultados))
    },

    // Registra una nueva venta
    crear({ producto_id, cantidad, vendedor_id }, cb){
        const query = `
            INSERT INTO ventas (producto_id, cantidad, vendedor_id)
            VALUES (?,?,?)`
        
        const parametros = [producto_id, cantidad, vendedor_id]

        mysql.query(query, parametros, (err, results) => cb(err, results))
    },

    // Actualiza el stock después de una venta (Restar stock)
    actualizarStock({ producto_id, cantidad }, cb) {
        const query = `
            UPDATE productos
            SET stock = stock - ?
            WHERE id = ?`

        const parametros = [cantidad, producto_id]
        
        mysql.query(query, parametros, (err, results) => cb(err, results))
    },

    editar({id, producto_id, cantidad, vendedor_id}, cb){
        const query = `
          UPDATE ventas
          SET producto_id = ?, cantidad = ?, vendedor_id = ?
          WHERE id = ?`
        
        const parametros = [producto_id, cantidad, vendedor_id, id]
        
        mysql.query(query, parametros, (err, results) => cb(err, results))
    },

    eliminar(id, cb) {
        const query = `
            DELETE FROM ventas
            WHERE id = ?`

        mysql.query(query, [id], (err, results) => cb(err, results))
    }
}

module.exports = VentasModel