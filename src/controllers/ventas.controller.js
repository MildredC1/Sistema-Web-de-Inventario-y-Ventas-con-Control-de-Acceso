const ventasModel = require("../models/ventas.model.js")
const productosModel = require("../models/productos.model.js")

const VentasController = {
    // Muestrar vista de ventas (formulario para registrar e historial)
    async mostrar(req, res) {
        try {
            // Necesitamos los productos para llenar el <campos> en el formulario
            productosModel.listar((errorProductos, productos) => {
                if (errorProductos) {
                    throw new Error("Error al obtener productos: " + errorProductos.message)
                }

                ventasModel.listar((errorVentas, historialVentas) => {
                    if (errorVentas) {
                        // Manejar error de listado de ventas (si ocurre)
                        console.error("Error al listar ventas:", errorVentas)
                        historialVentas = [] // Mostrar historial vacío si falla
                    }

                    // req.user esta disponible por el middleware
                    
                    const esAdmin = req.user ? req.user.admin : false

                    return res.render("ventas", {
                        productos,
                        historialVentas,
                        esAdmin // Pasamos el rol para futuras validaciones en la vista
                    })
                })
            })
        } catch (error) {
            return res.status(500).render("mensaje", {
                titulo: "Error en el módulo de Ventas",
                mensaje: error.message
            })
        }
    },

    // Procesar el registro de una nueva venta
    registrar(req, res) {
        const { producto_id, cantidad } = req.body
        const vendedor_id = req.user.id // Obtenido del usuario logueado
        
        if (!producto_id || !cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).render("mensaje", {
                titulo: "Error al Registrar Venta",
                mensaje: "El producto y la cantidad deben ser válidos."
            })
        }

        const cantidadVenta = parseInt(cantidad)

        // Validar cantidad ≤ stock (Buscar stock actual)
        ventasModel.buscarStock(producto_id, (error, resultadosStock) => {
            if (error || resultadosStock.length === 0) {
                return res.status(500).render("mensaje", {
                    titulo: "Error de Validación",
                    mensaje: "No se pudo obtener el stock del producto."
                })
            }

            const stockActual = resultadosStock[0].stock

            if (cantidadVenta > stockActual) {
                return res.status(400).render("mensaje", {
                    titulo: "Error de Stock",
                    mensaje: `No hay suficiente stock. Stock disponible: ${stockActual}`
                })
            }

            // Registrar la venta
            ventasModel.crear({ producto_id, cantidad: cantidadVenta, vendedor_id }, (errorVenta, resultadoVenta) => {
                if (errorVenta) {
                    console.error("Error al registrar venta:", errorVenta)
                    return res.status(500).render("mensaje", {
                        titulo: "Error al Registrar Venta",
                        mensaje: "Ocurrió un error al guardar la venta en la base de datos."
                    })
                }

                // Restar stock en productos
                ventasModel.actualizarStock({ producto_id, cantidad: cantidadVenta }, (errorStock, resultadoStock) => {
                    if (errorStock) {
                        // simular transaccion
                        console.error("ERROR CRÍTICO: Stock no actualizado después de la venta:", errorStock)
                        return res.status(500).render("mensaje", {
                            titulo: "Venta Registrada, Error de Inventario",
                            mensaje: "Venta registrada, pero falló la actualización del inventario. Revisar logs."
                        })
                    }

                    // Si todo sale bien redireccionar
                    return res.redirect('/ventas?venta=ok')
                })
            })
        })
    }
}

module.exports = VentasController