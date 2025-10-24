import {Router} from 'express';

import productosController from "../controllers/productos.controller.js"
import { requiereAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Productos'
router.get("/productos", requiereAuth, productosController.listar) // Mostrar formulario y listado Productos
router.post("/productos", requiereAuth, productosController.procesar) // Procesar registro Productos

router.get("/crear_producto", requiereAuth, productosController.mostrarFormulario) // Nos muestra el formulario para crear producto

export default router