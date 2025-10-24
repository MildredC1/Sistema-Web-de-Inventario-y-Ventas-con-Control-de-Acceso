const ventasModel = require("../models/ventas.model.js")

const VentasController = {
    // Muestrar vista de ventas (formulario para registrar e historial)
    async mostrar(req, res) {
        try {
            // Necesitamos los productos para llenar el <campos> en el formulario
            productosModel.listar((errorProductos, productos) => {
                if (errorProductos) {
                    return res.render("mensaje", {
                        titulo: "Error al obtener productos",
                        mensaje: error.message,
                        redireccionar: true,
                        linkMensaje: "Volver al inicio",
                        link: "/"
                    })
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
                mensaje: error.message,
                redireccionar: true,
                linkMensaje: "Volver al inicio",
                link: "/"
            })
        }
    },

    procesar(req, res) {
        console.log(req.body)
        const { id ,action, producto_id, cantidad} = req.body

        switch (action) {
            case 'agregar':
                // Procesar el registro de una nueva venta

                const vendedor_id = req.user.id // Obtenido del usuario logueado
                
                if (!producto_id || !cantidad || isNaN(cantidad) || cantidad <= 0) {
                    return res.status(400).render("mensaje", {
                        titulo: "Error al Registrar Venta",
                        mensaje: "El producto y la cantidad deben ser válidos.",
                        redireccionar: true,
                        linkMensaje: "Crear Venta",
                        link: "/crear_venta"
                    })
                }

                const cantidadVenta = parseInt(cantidad)

                // Validar cantidad ≤ stock (Buscar stock actual)
                ventasModel.buscarStock(producto_id, (error, resultadosStock) => {
                    if (error || resultadosStock.length === 0) {
                        return res.status(500).render("mensaje", {
                            titulo: "Error de Validación",
                            mensaje: "No se pudo obtener el stock del producto.",
                            redireccionar: true,
                            linkMensaje: "Volver a crear Venta",
                            link: "/crear_venta"
                        })
                    }

                    const stockActual = resultadosStock[0].stock

                    if (cantidadVenta > stockActual) {
                        return res.status(400).render("mensaje", {
                            titulo: "Error de Stock",
                            mensaje: `No hay suficiente stock. Stock disponible: ${stockActual}`,
                            redireccionar: true,
                            linkMensaje: "Volver a crear Venta",
                            link: "/crear_venta"
                        })
                    }

                    // Registrar la venta
                    ventasModel.crear({ producto_id, cantidad: cantidadVenta, vendedor_id }, (errorVenta, resultadoVenta) => {
                        if (errorVenta) {
                            console.error("Error al registrar venta:", errorVenta)
                            return res.status(500).render("mensaje", {
                                titulo: "Error al Registrar Venta",
                                mensaje: "Ocurrió un error al guardar la venta en la base de datos.",
                                redireccionar: true,
                                linkMensaje: "Volver a crear Venta",
                                link: "/crear_venta"
                            })
                        }

                        // Restar stock en productos
                        ventasModel.actualizarStock({ producto_id, cantidad: cantidadVenta }, (errorStock, resultadoStock) => {
                            if (errorStock) {
                                // simular transaccion
                                console.error("ERROR CRÍTICO: Stock no actualizado después de la venta:", errorStock)
                                return res.status(500).render("mensaje", {
                                    titulo: "Venta Registrada, Error de Inventario",
                                    mensaje: "Venta registrada, pero falló la actualización del inventario. Revisar logs.",
                                    redireccionar: true,
                                    linkMensaje: "Ver ventas",
                                    link: "/ventas"
                                })
                            }

                            // Si todo sale bien redireccionar
                            return res.redirect('/ventas?venta=ok')
                        })
                    })
                })
                
                break
            
            case 'editar':
                ventasModel.editar({id, producto_id, cantidad, vendedor_id}, (error, resultado) => {
                    if (error) {
                        return res.render("mensaje", {
                            titulo: "Error al editar la venta",
                            mensaje: error.message,
                            redireccionar: true,
                            linkMensaje: "Ver ventas",
                            link: "/ventas"
                        })
                    }

                    return res.redirect('/ventas')
                })
                break

            case 'eliminar':
                ventasModel.eliminar(id, (error, resultado) => {
                    if (error) {
                        return res.render("mensaje", {
                            titulo: "Error al eliminar la venta",
                            mensaje: error.message,
                            redireccionar: true,
                            linkMensaje: "Ver ventas",
                            link: "/ventas"
                        })
                    }
                    
                    return res.redirect('/ventas')
                })
                
                break

            default:
                return res.render('crear_venta', {
                    errores: [`La acción '${action}' no es válida.`],
                    datos: req.body
                })
        }
    },

    mostrarFormulario(req, res) {
        res.render("crear_venta")
    }
}

module.exports = VentasController