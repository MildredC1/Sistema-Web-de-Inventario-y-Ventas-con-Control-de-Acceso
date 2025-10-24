const pool = require('../config/db.js')

const UsuariosModel = {
    // Función para listar todos los usuarios
    listar(cb) {
        // Seleccionaremos los campos necesarios, sin contar la contraseña
        const query = `SELECT id, nombre, correo, admin, foto FROM usuarios ORDER BY id ASC`
        
        pool.query(query, (error, resultados) => cb(error, resultados))
    },

    editar({id, nombre, correo, admin}, cb){

        // La columna 'admin' en MySQL es 1 (True) o 0 (False)
        const valorAdminSql = admin ? 1 : 0

        const query = `
            UPDATE usuarios
            SET nombre = ?, correo = ?, admin = ?
            WHERE id = ?`
        
        const parametros = [nombre, correo, valorAdminSql, id]

        mysql.query(query, parametros, (err, results) => cb(err, results))
    },
    
    eliminar(id, cb) {
        const query = `DELETE FROM usuarios WHERE id = ?`
        
        pool.query(query, [id], (err, results) => cb(err, results))
    }

}

module.exports = UsuariosModel