const Ventas = require("../models/ventas.model.js")
const ProductosModel = require("../models/productos.model.js")

const VentasController = {
    // Muestrar vista de ventas (formulario para registrar e historial)

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
        Ventas.buscarStock(producto_id, (error, resultadosStock) => {
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
            Ventas.crear({ producto_id, cantidad: cantidadVenta, vendedor_id }, (errorVenta, resultadoVenta) => {
                if (errorVenta) {
                    console.error("Error al registrar venta:", errorVenta)
                    return res.status(500).render("mensaje", {
                        titulo: "Error al Registrar Venta",
                        mensaje: "Ocurrió un error al guardar la venta en la base de datos."
                    })
                }

                // Restar stock en productos
                Ventas.actualizarStock({ producto_id, cantidad: cantidadVenta }, (errorStock, resultadoStock) => {
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