const Productos=require("../models/productos.model.js")

const ProductosController = {
  listar(req,res){

    // El middleware requiereAuth trae req.user, que ahora incluye el campo 'admin'
    const esAdmin = req.user.admin; // obtenemos el rol dewsde req.user

    Productos.listar((error,productos) => {
      if(error){
        return res.render("mensaje", {
        titulo: "No se encontraron Productos",
        mensaje: error.message})
      }else{
        return res.render("productos", {productos, esAdmin})
      }
    })
  },
  procesar(req, res) {
    console.log(req.body)
    const { id ,action, nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento } = req.body

    switch(action) {
        case 'agregar':
            Productos.crear({ nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento}, (error, resultado) => {
                if (error) {
                  return res.render("mensaje", {
                    titulo: "Error al agregar el producto",
                    mensaje: error.message
                  })  
                    
                }

                return res.redirect('/productos')
            })
          break
        case 'editar':
            Productos.editar({id, nombre, categoria, marca, precio, stock, proveedor_email, rating, descuento }, (error, resultado) => {
                if (error) {
                    return res.render("mensaje", {
                        titulo: "Error al editar el producto",
                        mensaje: error.message
                    })
                }

                return res.redirect('/productos')
            })
          break
        case 'eliminar':
          Productos.eliminar(id, (error, resultado) => {
              if (error) {
                  return res.render("mensaje", {
                      titulo: "Error al eliminar el producto",
                      mensaje: error.message
                  })
              }
            return res.redirect('/productos')
          })
        break

        default:
            return res.render('crear_producto', {
                errores: [`La acción '${action}' no es válida.`],
                datos: req.body
            })
    }
}

}

module.exports = ProductosController