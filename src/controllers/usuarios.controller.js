const Usuarios = require("../models/usuarios.model.js")

const UsuariosController = {
    listar(req, res) {
        // Verificar si el usuario logueado es administrador
        // El middleware 'requiereAuth' ya puso el objeto de usuario en req.user
        const esAdmin = req.user ? req.user.admin : false
        if (!esAdmin) {
            // Si NO es admin, denegar el acceso
            return res.status(403).render("mensaje", {
                titulo: "Acceso Denegado",
                mensaje: "No tienes permisos de administrador para ver este módulo."
            })
        }

        // Si es admin, obtener la lista de usuarios
        Usuarios.listar((error, usuarios) => {
            if (error) {
                console.error("Error al listar usuarios:", error)
                return res.status(500).render("mensaje", {
                    titulo: "Error en el Sistema",
                    mensaje: "No se pudieron obtener los datos de los usuarios."
                })
            }
        
            return res.render("usuarios", { usuarios, esAdmin: true })
        })
    },
    
    procesar(req, res) {
        // Verificar si el usuario logueado es administrador
        const esAdmin = req.user ? req.user.admin : false
        
        if (!esAdmin) {
            return res.status(403).render("mensaje", {
                titulo: "Acceso Denegado",
                mensaje: "No tienes permisos de administrador para modificar usuarios."
            })
        }

        // Extraer datos y acción

        const { action, id, nombre, correo, admin } = req.body

        // Convierte el valor del checkbox 'admin' (que puede ser '1' o undefined) a booleano
        const nuevoAdmin = (admin === '1')
        
        switch(action) {
            case 'editar':
                // Validaciones básicas antes de editar
                if (!id || !nombre || !correo) {
                    return res.status(400).render("mensaje", {
                        titulo: "Error de Edición",
                        mensaje: "Todos los campos (nombre, correo) son obligatorios."
                    })
                }

                Usuarios.editar({ id, nombre, correo, admin: nuevoAdmin }, (error, resultado) => {
                    if (error) {
                        console.error("Error al editar usuario:", error)
                        return res.render("mensaje", {
                            titulo: "Error al editar el usuario",
                            mensaje: error.message
                        })
                    }
                    
                    return res.redirect('/usuarios?edit=ok')
                })

                break
            case 'eliminar':
                // No se permite eliminar al usuario que está actualmente logueado para evitar errores
                if (req.user.id === parseInt(id)) {
                    return res.status(400).render("mensaje", {
                        titulo: "Error de Eliminación",
                        mensaje: "No puedes eliminar tu propia cuenta de usuario mientras estás logueado."
                    })
                }
                
                Usuarios.eliminar(id, (error, resultado) => {
                    if (error) {
                        console.error("Error al eliminar usuario:", error)
                        return res.render("mensaje", {
                            titulo: "Error al eliminar el usuario",
                            mensaje: error.message
                        })
                    }

                    return res.redirect('/usuarios?delete=ok')
                })
                
                break
            default:
                return res.status(400).render("mensaje", {
                    titulo: "Acción Inválida",
                    mensaje: `La acción '${action}' no es válida.`
                })
        }
    }
}

module.exports = UsuariosController