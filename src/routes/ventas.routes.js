import {Router} from 'express';

import ventasController from '../controllers/ventas.controller.js';
import { requiereAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Ventas'
router.get("/ventas", requiereAuth, ventasController.mostrar)   // Mostrar formulario y listado Ventas
router.post("/ventas", requiereAuth, ventasController.registrar) // Procesar registro Ventas

router.get("crear_venta", requiereAuth, ventasController.mostrarFormulario) // Nos muestra el formulario para crear producto

export default router