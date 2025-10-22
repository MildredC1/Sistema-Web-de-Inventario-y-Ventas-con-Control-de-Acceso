import {Router} from 'express';

import * as auth from "../controllers/auth.controller.js"
import productosController from "../controllers/productos.controller.js"

import { requiereAuth, redireccionAuth } from '../middlewares/auth.js';

const router = Router()

// Rutas relacionadas con 'Login'
router.get('/login', redireccionAuth, auth.mostrarLogin)
router.post('/login', auth.login)

// Rutas relacionadas con 'Cierre de sesión'
router.get("/logout", auth.logout)

router.get("/productos", requiereAuth, productosController.listar)
router.post("/productos", requiereAuth, productosController.procesar)

export default router
