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

        // Registrar la venta
        Ventas.crear({ producto_id, cantidad: cantidadVenta, vendedor_id }, (errorVenta, resultadoVenta) => {
            if (errorVenta) {
                console.error("Error al registrar venta:", errorVenta)
                return res.status(500).render("mensaje", {
                    titulo: "Error al Registrar Venta",
                    mensaje: "Ocurrió un error al guardar la venta en la base de datos."
                })
            }

            // Si todo sale bien redireccionar
            return res.redirect('/ventas?venta=ok')

        })
    }
}

module.exports = VentasController