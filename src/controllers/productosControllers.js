const Productos=require("../models/productosModels.js")

const ProductosController = {
  listar(req,res){
    Productos.listar((error,productos) => {
      if(error){
        return res.render("error", {
        titulo: "No se encontraron Productos",
        mensaje: error.message})
      }else{
        return res.render("productos", {productos})
      }
    })
  }
}
module.exports=ProductosController